/**
 * Global Policy Configuration
 * This file is MUTATED by the system based on learning.
 */

export const GLOBAL_POLICY = {
    // Application Limits
    maxDailyApplications: 50,
    maxHourlyApplications: 10,

    // Thresholds
    minMatchScore: 70, // Will evolve based on success rate
    minConfidenceScore: 0.7,

    // Strategy Defaults
    defaultStrategy: 'balanced',

    // Risk Management
    maxConsecutiveFailures: 5,
    platformCoolOffMinutes: 60,

    // Optimization
    enableDeepOptimization: true,
    optimizationLevel: 'standard', // standard, deep, aggressive

    // Versions (for tracking mutations)
    policyVersion: 1,
    lastMutated: new Date().toISOString(),
};
