/**
 * Career Memory - Long-term Intelligence
 * Stores patterns, narratives, and platform behavior.
 */

import mongoose from 'mongoose';

const careerMemorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // 1. Narrative Intelligence
    // Tracks which phrases/bullets work best for specific roles
    narrativePerformance: [{
        narrativeId: String, // hash of the bullet point text
        text: String,
        roleCategory: String, // "Software Engineer", "Data Scientist"
        usedCount: { type: Number, default: 0 },
        successCount: { type: Number, default: 0 }, // Interviews/Responses
        successRate: { type: Number, default: 0.0 },
        lastUsed: Date
    }],

    // 2. Platform Hostility Map
    // Tracks how "friendly" or "hostile" a platform is
    platformHealth: {
        linkedin: {
            blockCount: { type: Number, default: 0 },
            captchaCount: { type: Number, default: 0 },
            successCount: { type: Number, default: 0 },
            lastBlockedAt: Date,
            healthScore: { type: Number, default: 1.0 }, // 0.0 - 1.0
            hostilePatterns: [String] // "cf-challenge", "403-forbidden"
        },
        indeed: {
            blockCount: { type: Number, default: 0 },
            captchaCount: { type: Number, default: 0 },
            successCount: { type: Number, default: 0 },
            lastBlockedAt: Date,
            healthScore: { type: Number, default: 1.0 },
            hostilePatterns: [String]
        },
        // Add other platforms dynamically
    },

    // 3. Global Stats
    totalApplications: { type: Number, default: 0 },
    totalInterviews: { type: Number, default: 0 },

    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Calculate success rates on save
careerMemorySchema.pre('save', function (next) {
    if (this.isModified('narrativePerformance')) {
        this.narrativePerformance.forEach(n => {
            n.successRate = n.usedCount > 0 ? n.successCount / n.usedCount : 0;
        });
    }
    next();
});

// Instance Method: Update Platform Health
careerMemorySchema.methods.recordPlatformOutcome = function (platform, outcome) {
    if (!this.platformHealth[platform]) {
        this.platformHealth[platform] = { healthScore: 1.0 };
    }

    const stats = this.platformHealth[platform];

    if (outcome === 'blocked' || outcome === 'captcha') {
        stats.blockCount = (stats.blockCount || 0) + 1;
        stats.lastBlockedAt = new Date();
        // Decay health
        stats.healthScore = Math.max(0, (stats.healthScore || 1) - 0.2);
    } else if (outcome === 'success') {
        stats.successCount = (stats.successCount || 0) + 1;
        // Heal health
        stats.healthScore = Math.min(1, (stats.healthScore || 1) + 0.05);
    } else if (outcome === 'failed') {
        // Minor decay for generic failure
        stats.healthScore = Math.max(0, (stats.healthScore || 1) - 0.01);
    }

    this.markModified(`platformHealth.${platform}`);
};

careerMemorySchema.methods.isPlatformHostile = function (platform) {
    const stats = this.platformHealth[platform];
    if (!stats) return false;

    // Hostile if health < 0.3 OR blocked recently (last 30 mins)
    if (stats.healthScore < 0.3) return true;

    if (stats.lastBlockedAt) {
        const minutesSinceBlock = (new Date() - stats.lastBlockedAt) / 1000 / 60;
        if (minutesSinceBlock < 30) return true;
    }

    return false;
};

const CareerMemory = mongoose.model('CareerMemory', careerMemorySchema);

export default CareerMemory;
