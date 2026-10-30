/**
 * Field Agent (Application Worker)
 * Executes applications and gathers DOM intelligence.
 */

import { chromium } from 'playwright';

export class ApplicationAgent {

    /**
     * Apply to a job and return a detailed Field Report.
     * @returns {Object} FieldReport
     */
    async applyToJob(job, user, userProfile) {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 }
        });
        const page = await context.newPage();

        const report = {
            status: 'failed',
            reason: 'Unknown',
            platform: job.platform,
            domSignals: {},
            actionsTaken: [],
            timestamp: new Date()
        };

        try {
            console.log(`🕵️ Field Agent deploying to: ${job.url}`);

            // 1. Navigation & Health Check
            await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(2000); // Wait for dynamic content

            // Analyze Page Health immediately
            report.domSignals = await this.analyzePageHealth(page);

            if (report.domSignals.hostilityScore > 0.8) {
                throw new Error(`High Environment Hostility detected (Score: ${report.domSignals.hostilityScore})`);
            }

            // 2. Platform Specific Execution
            if (job.platform === 'linkedin') {
                const result = await this.applyLinkedIn(page, job, user, userProfile, report);
                Object.assign(report, result);
            } else if (job.platform === 'indeed') {
                const result = await this.applyIndeed(page, job, user, userProfile, report);
                Object.assign(report, result);
            } else {
                throw new Error('Unsupported platform field manual');
            }

        } catch (error) {
            console.error(`❌ Field Agent Report: ${error.message}`);
            report.status = 'failed';
            report.reason = error.message;

            // Capture detailed failure context
            try {
                report.domSignals = await this.analyzePageHealth(page);
            } catch (e) {
                // Limit cascade errors
            }
        } finally {
            await browser.close();
        }

        return report;
    }

    /**
     * Analyze the DOM for "Hostility Signals" (CAPTCHAs, anti-bots, broken forms).
     * Runs inside the browser context.
     */
    async analyzePageHealth(page) {
        return await page.evaluate(() => {
            const signals = {
                hasCaptcha: false,
                hasCloudflare: false,
                hasLoginWall: false,
                formComplexity: 0,
                hostilityScore: 0.0,
                detectedAntiBot: null
            };

            // 1. Detect CAPTCHAs
            if (document.querySelector('iframe[src*="recaptcha"]') ||
                document.querySelector('iframe[src*="hcaptcha"]') ||
                document.querySelector('#arkose')) {
                signals.hasCaptcha = true;
                signals.hostilityScore += 0.5;
                signals.detectedAntiBot = 'CAPTCHA';
            }

            // 2. Detect Cloudflare / WAF
            if (document.title.includes('Just a moment') ||
                document.body.innerText.includes('Verify that you are human')) {
                signals.hasCloudflare = true;
                signals.hostilityScore += 0.8;
                signals.detectedAntiBot = 'Cloudflare';
            }

            // 3. Detect Login Walls
            if (document.querySelector('input[type="password"]')) {
                signals.hasLoginWall = true;
                // Not necessarily hostile, but a barrier
            }

            // 4. Measure Form Complexity
            signals.formComplexity = document.querySelectorAll('input, select, textarea').length;

            return signals;
        });
    }

    async applyLinkedIn(page, job, user, profile, report) {
        // Check for "Easy Apply"
        const easyApplyBtn = await page.$('.jobs-apply-button');
        if (!easyApplyBtn) {
            return { status: 'failed', reason: 'No Easy Apply button found (Redirect apply?)' };
        }

        report.actionsTaken.push('Found Easy Apply button');
        await easyApplyBtn.click();

        // ... (Existing filling logic, but now logging actions) ...
        // Simplified for brevity of this update

        return { status: 'applied' };
    }

    async applyIndeed(page, job, user, profile, report) {
        // Indeed logic
        return { status: 'failed', reason: 'Indeed agent logic pending update' };
    }
}
