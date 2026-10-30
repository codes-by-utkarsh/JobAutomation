/**
 * Profile Routes
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import UserProfile from '../models/UserProfile.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads/resumes/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${req.userId}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files allowed'));
        }
    },
});

/**
 * GET /api/profile/me
 * Get current user's profile
 */
router.get('/me', protect, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.userId });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({ profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/profile/update
 * Update user profile
 */
router.put('/update', protect, async (req, res) => {
    try {
        const profile = await UserProfile.findOneAndUpdate(
            { userId: req.userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.json({ message: 'Profile updated', profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/profile/resume/upload
 * Upload resume
 */
router.post('/resume/upload', protect, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const profile = await UserProfile.findOne({ userId: req.userId });

        profile.resumeFilePath = req.file.path;
        profile.resumeText = `Resume: ${req.file.filename}`;

        await profile.save();

        res.json({
            message: 'Resume uploaded successfully',
            filePath: req.file.path,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/profile/automation/start
 * Start automation
 */
router.post('/automation/start', protect, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.userId });

        // Validation
        if (!profile.resumeFilePath) {
            return res.status(400).json({ error: 'Please upload resume first' });
        }

        if (!profile.jobRoles || profile.jobRoles.length === 0) {
            return res.status(400).json({ error: 'Please set job preferences first' });
        }

        profile.automationStatus = 'running';
        await profile.save();

        // TODO: Trigger job search worker

        res.json({
            message: 'Automation started! The Beast is hunting...',
            status: 'running',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/profile/automation/pause
 */
router.post('/automation/pause', protect, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.userId });
        profile.automationStatus = 'paused';
        await profile.save();

        res.json({ message: 'Automation paused', status: 'paused' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/profile/automation/stop
 */
router.post('/automation/stop', protect, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.userId });
        profile.automationStatus = 'idle';
        await profile.save();

        res.json({ message: 'Automation stopped', status: 'idle' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
