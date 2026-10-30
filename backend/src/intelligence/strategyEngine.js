/**
 * Authoritative Strategy Engine
 * Issues binding directives to the orchestrator.
 */

import { GLOBAL_POLICY } from '../config/policy.js';

export class StrategyEngine {

    /**
     * Determine the strategy directive for a given job context.
     * @param {Object} context - { platform, profile, job, memory }
     * @returns {Object} StrategyDirective
     */
    static determineDirective(context) {
        const { platform, profile, job, memory } = context;

        // 1. Check Global Policy Constraints
        // This is the "Vito" power - strictly enforce policy
        if (GLOBAL_POLICY.maxDailyApplications <= 0) {
            return this.createDirective('ABORT', 'HALT', { reason: 'Daily limit reached' });
        }

        // 2. Evaluate Platform Health (from Memory)
        // Use the CareerMemory model's isPlatformHostile method
        if (memory && memory.isPlatformHostile && memory.isPlatformHostile(platform)) {
            return this.createDirective('HOLD', 'WAIT', {
                reason: `Platform ${platform} is currently hostile (Health: ${memory.platformHealth[platform]?.healthScore.toFixed(2)})`,
                waitMinutes: GLOBAL_POLICY.platformCoolOffMinutes
            });
        }

        // 3. Select Strategy Mode
        let mode = 'balanced';
        let reasoning = 'Default balanced strategy';

        // Senior roles get "Sniper"
        if (profile.experienceLevel === 'Senior' || profile.experienceLevel === 'Lead') {
            mode = 'sniper';
            reasoning = 'Senior role requires high customization';
        }
        // High match score gets "Aggressive" if policy allows
        else if (job.matchScore > 90 && GLOBAL_POLICY.optimizationLevel !== 'deep') {
            mode = 'aggressive';
            reasoning = 'High match score, apply quickly';
        }
        // Low match score checks against policy threshold
        else if (job.matchScore < GLOBAL_POLICY.minMatchScore) {
            return this.createDirective('ABORT', 'SKIP', {
                reason: `Match score ${job.matchScore} below policy threshold ${GLOBAL_POLICY.minMatchScore}`
            });
        }

        // 4. Construct Directive
        const strategyConfig = this.getStrategyConfig(mode);

        return this.createDirective('EXECUTE', mode, {
            config: strategyConfig,
            constraints: {
                minConfidence: GLOBAL_POLICY.minConfidenceScore,
                requiredFields: ['resume', 'email', 'phone'],
            },
            reasoning: reasoning
        });
    }

    static createDirective(action, mode, details = {}) {
        return {
            directiveId: `DIR_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            action, // EXECUTE, ABORT, HOLD
            mode,   // sniper, balanced, aggressive, wait, halt, skip
            timestamp: new Date().toISOString(),
            ...details
        };
    }

    static getStrategyConfig(mode) {
        const configs = {
            aggressive: {
                applySpeed: 1000,
                customization: 'none',
                retries: 3
            },
            balanced: {
                applySpeed: 5000,
                customization: 'keywords',
                retries: 2
            },
            sniper: {
                applySpeed: 15000,
                customization: 'deep',
                retries: 5
            }
        };
        return configs[mode] || configs.balanced;
    }
}
