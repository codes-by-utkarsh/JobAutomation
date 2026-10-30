/**
 * Job Search Scheduler - Runs every 2 hours to find new jobs
 */

import cron from 'node-cron';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserProfile from '../models/UserProfile.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { AutoJobScraper } from './jobScraper.js';
import { Orchestrator } from '../core/orchestrator.js'; // Import Orchestrator

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const scraper = new AutoJobScraper();
const orchestrator = new Orchestrator();

/**
 * Search for jobs for all active users
 */
async function searchJobs() {
    console.log(`\n🔍 Job Search & Apply Started: ${new Date().toISOString()}\n`);

    try {
        const activeProfiles = await UserProfile.find({ automationStatus: 'running' }).populate('userId');

        for (const profile of activeProfiles) {
            if (!profile.userId) continue;

            const user = await User.findById(profile.userId._id);
            console.log(`\n🎯 Processing user: ${user.fullName}`);

            // 1. Search
            const jobs = await scraper.searchAllPlatforms(profile);

            // 2. Save & Process Jobs
            for (const jobData of jobs) {
                // Save
                let job = await Job.findOne({ platform: jobData.platform, externalId: jobData.externalId });

                if (!job) {
                    job = await Job.create({ ...jobData, discoveredForUser: user._id });
                } else {
                    continue; // Skip if already exists
                }

                // 3. Orchestrate (Apply)
                // We add a small delay to mimic human behavior
                await new Promise(r => setTimeout(r, 5000));

                await orchestrator.processJob(job, user, profile);
            }
        }

        console.log(`\n✅ Cycle complete!\n`);
    } catch (error) {
        console.error(`❌ Error in scheduler: ${error.message}`);
    }
}

// Run immediately on start
searchJobs();

// Schedule
cron.schedule('0 */2 * * *', () => {
    searchJobs();
});
