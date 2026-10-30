/**
 * Application Model
 */

import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },

    // Application Status
    status: {
        type: String,
        enum: ['pending', 'applied', 'interview', 'rejected', 'failed'],
        default: 'pending',
    },

    // Resume used
    resumePath: String,

    // Application metadata
    platform: String,
    appliedAt: Date,

    // Result
    resultMessage: String,
}, {
    timestamps: true,
});

// Index for querying user applications
applicationSchema.index({ userId: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
