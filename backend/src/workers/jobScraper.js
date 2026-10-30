/**
 * Autonomous Job Scraper - Playwright
 */

import { chromium } from 'playwright';

export class AutoJobScraper {
    async searchAllPlatforms(userProfile) {
        const platforms = ['linkedin', 'indeed', 'glassdoor'];
        const allJobs = [];

        const browser = await chromium.launch({ headless: true });

        try {
            // Search platforms in parallel
            const promises = platforms.map(platform =>
                this.scrapePlatform(browser, platform, userProfile)
            );

            const results = await Promise.allSettled(promises);

            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    allJobs.push(...result.value);
                }
            });

            console.log(`✅ Found ${allJobs.length} total jobs`);
        } finally {
            await browser.close();
        }

        return allJobs;
    }

    async scrapePlatform(browser, platform, profile) {
        if (platform === 'linkedin') {
            return await this.scrapeLinkedIn(browser, profile);
        } else if (platform === 'indeed') {
            return await this.scrapeIndeed(browser, profile);
        } else if (platform === 'glassdoor') {
            return await this.scrapeGlassdoor(browser, profile);
        }
        return [];
    }

    async scrapeLinkedIn(browser, profile) {
        const page = await browser.newPage();
        const jobs = [];

        try {
            const jobRole = profile.jobRoles[0] || 'Software Engineer';
            const location = profile.preferredLocations[0] || 'Remote';

            const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobRole)}&location=${encodeURIComponent(location)}`;

            console.log(`🔍 Searching LinkedIn: ${jobRole} in ${location}`);

            await page.goto(searchUrl, { waitUntil: 'networkidle' });

            // Wait for job listings
            await page.waitForSelector('.jobs-search__results-list', { timeout: 10000 });

            // Scroll to load more
            for (let i = 0; i < 3; i++) {
                await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                await page.waitForTimeout(2000);
            }

            // Extract jobs
            const jobCards = await page.$$('.job-search-card');

            for (const card of jobCards.slice(0, 50)) {
                try {
                    const title = await card.$eval('.base-search-card__title', el => el.textContent.trim());
                    const company = await card.$eval('.base-search-card__subtitle', el => el.textContent.trim());
                    const link = await card.getAttribute('href');

                    if (title && company && link) {
                        const cleanUrl = link.split('?')[0];
                        const externalId = link.split('/').pop().split('?')[0];

                        jobs.push({
                            platform: 'linkedin',
                            title,
                            company,
                            url: cleanUrl,
                            externalId,
                        });
                    }
                } catch (err) {
                    // Skip faulty cards
                }
            }

            console.log(`✅ LinkedIn: ${jobs.length} jobs found`);
        } catch (error) {
            console.error(`❌ LinkedIn scraping failed: ${error.message}`);
        } finally {
            await page.close();
        }

        return jobs;
    }

    async scrapeIndeed(browser, profile) {
        const page = await browser.newPage();
        const jobs = [];

        try {
            const jobRole = profile.jobRoles[0] || 'Software Engineer';
            const location = profile.preferredLocations[0] || 'Remote';

            const searchUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(jobRole)}&l=${encodeURIComponent(location)}`;

            await page.goto(searchUrl, { waitUntil: 'networkidle' });
            await page.waitForSelector('.jobsearch-ResultsList', { timeout: 10000 });

            const jobCards = await page.$$('.job_seen_beacon');

            for (const card of jobCards.slice(0, 50)) {
                try {
                    const title = await card.$eval('.jobTitle', el => el.textContent.trim());
                    const company = await card.$eval('.companyName', el => el.textContent.trim());
                    const href = await card.$eval('a', el => el.getAttribute('href'));

                    if (title && company && href) {
                        const fullUrl = `https://www.indeed.com${href}`;
                        const externalId = href.includes('jk=') ? href.split('jk=')[1] : href;

                        jobs.push({
                            platform: 'indeed',
                            title,
                            company,
                            url: fullUrl,
                            externalId,
                        });
                    }
                } catch (err) {
                    // Skip
                }
            }

            console.log(`✅ Indeed: ${jobs.length} jobs found`);
        } catch (error) {
            console.error(`❌ Indeed scraping failed: ${error.message}`);
        } finally {
            await page.close();
        }

        return jobs;
    }

    async scrapeGlassdoor(browser, profile) {
        // Similar implementation
        return [];
    }
}
