/**
 * Policy Mutator - Self-Improvement Module
 * Automatically adjusts system policy based on performance metrics.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POLICY_PATH = path.join(__dirname, '../config/policy.js');

export class PolicyMutator {

    /**
     * Analyze performance and mutate policy if needed.
     * @param {Object} metrics - Performance metrics { successRate, blockRate, etc }
     */
    static async evolvePolicy(metrics) {
        // 1. Load current policy
        const currentPolicy = (await import('../config/policy.js')).GLOBAL_POLICY;
        let mutated = false;
        let updates = {};

        console.log('🧬 Analyzing performance for policy mutation...');

        // Mutation Rule 1: High Block Rate -> Slow Down
        if (metrics.blockRate > 0.05) { // > 5% blocked
            const newLimit = Math.max(5, Math.floor(currentPolicy.maxHourlyApplications * 0.7));
            if (newLimit !== currentPolicy.maxHourlyApplications) {
                updates.maxHourlyApplications = newLimit;
                updates.platformCoolOffMinutes = currentPolicy.platformCoolOffMinutes + 30;
                mutated = true;
                console.log(`📉 Mutation: Decreasing maxHourlyApplications to ${newLimit} (High Block Rate)`);
            }
        }

        // Mutation Rule 2: Low Success Rate -> Increase Quality Threshold
        if (metrics.successRate < 0.02) { // < 2% success
            const newScore = Math.min(95, currentPolicy.minMatchScore + 5);
            if (newScore !== currentPolicy.minMatchScore) {
                updates.minMatchScore = newScore;
                updates.optimizationLevel = 'deep';
                mutated = true;
                console.log(`📈 Mutation: Increasing minMatchScore to ${newScore} (Low Success Rate)`);
            }
        }

        // Mutation Rule 3: High Success Rate -> Aggressive Growth
        if (metrics.successRate > 0.15) { // > 15% success
            const newLimit = Math.min(100, Math.floor(currentPolicy.maxDailyApplications * 1.2));
            if (newLimit !== currentPolicy.maxDailyApplications) {
                updates.maxDailyApplications = newLimit;
                mutated = true;
                console.log(`🚀 Mutation: Increasing maxDailyApplications to ${newLimit} (High Success Rate)`);
            }
        }

        if (mutated) {
            await this.savePolicy({ ...currentPolicy, ...updates });
        }
    }

    static async savePolicy(newPolicy) {
        newPolicy.policyVersion += 1;
        newPolicy.lastMutated = new Date().toISOString();

        const fileContent = `/**
 * Global Policy Configuration
 * This file is MUTATED by the system based on learning.
 */

export const GLOBAL_POLICY = ${JSON.stringify(newPolicy, null, 2)};
`;

        try {
            await fs.writeFile(POLICY_PATH, fileContent, 'utf8');
            console.log(`💾 Policy v${newPolicy.policyVersion} saved successfully.`);
        } catch (error) {
            console.error('❌ Failed to save mutated policy:', error);
        }
    }
}
