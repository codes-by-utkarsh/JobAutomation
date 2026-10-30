/**
 * Job Model
 */

import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true,
        enum: ['linkedin', 'indeed', 'glassdoor'],
    },
    externalId: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    description: String,
    location: String,

    // Who discovered this job
    discoveredForUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

// Compound index for deduplication
jobSchema.index({ platform: 1, externalId: 1 }, { unique: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
