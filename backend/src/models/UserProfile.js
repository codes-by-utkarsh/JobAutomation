/**
 * User Profile Model
 */

import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    // Resume
    resumeFilePath: String,
    resumeText: String,

    // Education
    tenthMarks: Number,
    twelfthMarks: Number,
    degree: String,
    university: String,
    graduationYear: Number,

    // Job Preferences
    jobRoles: [String], // ["Software Engineer", "Data Scientist"]
    experienceLevel: {
        type: String,
        enum: ['Entry', 'Mid', 'Senior', 'Lead'],
        default: 'Mid',
    },
    preferredLocations: [String],
    remoteOnly: {
        type: Boolean,
        default: false,
    },
    minSalary: Number,
    maxSalary: Number,

    // Automation Status
    automationStatus: {
        type: String,
        enum: ['idle', 'running', 'paused'],
        default: 'idle',
    },

    // Stats
    totalApplications: {
        type: Number,
        default: 0,
    },
    interviewsReceived: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
