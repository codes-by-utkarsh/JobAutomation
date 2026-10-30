/**
 * Non-Linear Orchestrator
 * State Machine based execution engine that obeys Strategy Directives.
 */

import { StrategyEngine } from '../intelligence/strategyEngine.js';
import { ConfidenceCalculator } from './confidence.js';
import { ApplicationAgent } from '../workers/applicationWorker.js';
import { ResumeCustomizer } from '../intelligence/resumeCustomizer.js';
import Application from '../models/Application.js';

export class Orchestrator {
    constructor() {
        this.agent = new ApplicationAgent();
        this.customizer = new ResumeCustomizer();
    }

    /**
     * Main entry point for a job Application Process.
     * Uses a state machine pattern (switch/case loop) for non-linear flow.
     */
    async processJob(job, user, profile) {
        let state = 'ANALYZING';
        let context = {
            job, user, profile,
            retries: 0,
            directive: null,
            confidence: 0,
            resumePath: profile.resumeFilePath
        };

        console.log(`\n🎼 Orchestrating: ${job.title}`);

        while (state !== 'COMPLETED' && state !== 'TERMINATED') {
            console.log(`\n📍 State: ${state}`);

            try {
                switch (state) {

                    // --- 1. ANALYSIS PHASE ---
                    case 'ANALYZING':
                        // Calculate initial confidence
                        context.confidence = ConfidenceCalculator.calculate(context);
                        console.log(`📊 Confidence Score: ${(context.confidence * 100).toFixed(1)}%`);

                        // Get Strategy Directive
                        context.directive = StrategyEngine.determineDirective({
                            platform: job.platform,
                            profile: profile,
                            job: job
                        });
                        console.log(`📜 Strategy Directive: ${context.directive.action} (${context.directive.mode})`);

                        // Branch based on directive
                        if (context.directive.action === 'ABORT') {
                            context.reason = context.directive.reasoning;
                            state = 'ABORTING';
                        } else if (context.directive.action === 'HOLD') {
                            console.log(`⏳ Holding: ${context.directive.reasoning}`);
                            state = 'WAITING';
                        } else {
                            state = 'OPTIMIZING';
                        }
                        break;

                    // --- 2. OPTIMIZATION PHASE ---
                    case 'OPTIMIZING':
                        if (context.directive.config.customization === 'deep') {
                            console.log('✨ Performing deep resume optimization...');
                            try {
                                // Tailor resume
                                const tailored = await this.customizer.tailorResume(profile.resumeFilePath, job.description);
                                if (tailored) {
                                    // In real app, tailored.filePath would be used
                                    console.log('✅ Resume optimized successfully');
                                }
                            } catch (err) {
                                console.warn('⚠️ Optimization failed, falling back to standard resume');
                            }
                        }
                        state = 'EXECUTING';
                        break;

                    // --- 3. EXECUTION PHASE ---
                    case 'EXECUTING':
                        console.log(`🚀 Executing Application (Mode: ${context.directive.mode})`);

                        // Execute automated application
                        const result = await this.agent.applyToJob(job, user, profile);

                        // Merge Field Report into context
                        context.fieldReport = result;
                        if (result.domSignals) {
                            console.log(`📡 Field Intelligence: Hostility ${result.domSignals.hostilityScore} | AntiBot: ${result.domSignals.detectedAntiBot}`);
                        }

                        if (result.status === 'applied') {
                            context.result = 'applied';
                            state = 'COMPLETED';
                        } else if (result.status === 'skipped') {
                            context.result = 'skipped';
                            state = 'COMPLETED';
                        } else {
                            // Handle Failure
                            console.warn(`❌ Execution Failed: ${result.reason}`);
                            context.lastError = result.reason;
                            state = 'RECOVERING';
                        }
                        break;

                    // --- 4. RECOVERY PHASE (Backtracking) ---
                    case 'RECOVERING':
                        context.retries++;
                        const maxRetries = context.directive.config.retries || 2;

                        if (context.retries <= maxRetries) {
                            console.log(`🔄 Retrying (${context.retries}/${maxRetries})...`);
                            // Backtrack to Optimization? Or just retry execution?
                            // For now, simple retry
                            await new Promise(r => setTimeout(r, 2000)); // Cool off
                            state = 'EXECUTING';
                        } else {
                            context.reason = `Max retries (${maxRetries}) exceeded. Last error: ${context.lastError}`;
                            state = 'ABORTING';
                        }
                        break;

                    // --- TERMINAL STATES ---
                    case 'WAITING':
                        // In a real system, we might re-queue the job.
                        // For this MVP loop, we terminate but log as skipped-wait.
                        context.result = 'skipped_wait';
                        state = 'TERMINATED';
                        break;

                    case 'ABORTING':
                        console.warn(`🛑 Aborting: ${context.reason}`);
                        context.result = 'failed';
                        state = 'TERMINATED';
                        break;

                    default:
                        throw new Error(`Unknown state: ${state}`);
                }
            } catch (error) {
                console.error(`💥 Critical Orchestrator Error: ${error.message}`);
                context.reason = error.message;
                context.result = 'failed';
                state = 'TERMINATED';
            }
        }

        // Save final status
        await this.saveOutcome(context);
        return context.result;
    }

    async saveOutcome(context) {
        if (context.result === 'skipped_wait') return; // Don't log waits as failures

        // 1. Save to Database Record
        const app = await Application.create({
            userId: context.user._id,
            jobId: context.job._id,
            status: context.result,
            platform: context.job.platform,
            resultMessage: context.reason || 'Success',
            appliedAt: new Date(),
            resumePath: context.resumePath,
            strategyUsed: context.directive ? context.directive.mode : 'unknown'
        });

        // 2. Update Global Career Memory
        // Dynamic import to avoid circular dependency if any
        const { MemoryAccess } = await import('./memoryAccess.js');

        // Pass more intelligence if available
        let outcome = context.result;
        if (context.fieldReport && context.fieldReport.domSignals && context.fieldReport.domSignals.hostilityScore > 0.5) {
            outcome = 'blocked';
        }

        await MemoryAccess.recordOutcome(context.user._id, context.job.platform, outcome);
    }
}
