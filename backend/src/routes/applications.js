/**
 * Auto-Application API Route
 * Called by n8n workflow to execute job applications
 */

import express from 'express';
import { ApplicationAgent } from '../workers/applicationWorker.js';
import Application from '../models/Application.js';
import UserProfile from '../models/UserProfile.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();
const agent = new ApplicationAgent();

/**
 * POST /api/applications/auto-apply
 * Auto-apply to a job (called by n8n)
 */
router.post('/auto-apply', async (req, res) => {
    try {
        const { jobId, userId, jobUrl, platform, coverLetter } = req.body;

        // Get job and user details
        const job = await Job.findById(jobId);
        const user = await User.findOne({ _id: userId });
        const profile = await UserProfile.findOne({ userId });

        if (!job || !user || !profile) {
            return res.status(404).json({ error: 'Job, user, or profile not found' });
        }

        // Execute application
        const result = await agent.applyToJob(job, user, profile);

        // Save application record
        const application = await Application.create({
            userId: user._id,
            jobId: job._id,
            status: result.status === 'applied' ? 'applied' : 'failed',
            platform: job.platform,
            appliedAt: new Date(),
            resumePath: profile.resumeFilePath,
            coverLetter,
            resultMessage: result.reason || 'Application submitted',
            strategyUsed: 'n8n-ai-agent'
        });

        // Update profile stats
        if (result.status === 'applied') {
            await UserProfile.findByIdAndUpdate(profile._id, {
                $inc: { totalApplications: 1 }
            });
        }

        res.json({
            success: result.status === 'applied',
            application,
            result
        });

    } catch (error) {
        console.error('Auto-apply error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/applications
 * Get all applications for authenticated user
 */
router.get('/', auth, async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.userId })
            .populate('jobId')
            .sort({ appliedAt: -1 })
            .limit(100);

        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/applications/:id/status
 * Update application status (e.g., when you get an interview)
 */
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { status },
            { new: true }
        );

        // If status is interview, increment interviewsReceived
        if (status === 'interview') {
            await UserProfile.findOneAndUpdate(
                { userId: req.userId },
                { $inc: { interviewsReceived: 1 } }
            );
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
