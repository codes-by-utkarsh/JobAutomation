/**
 * AI Resume Customizer - Node.js Implementation
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import pdf from 'pdf-parse';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class ResumeCustomizer {

    /**
     * Tailor resume for specific job
     */
    async tailorResume(baseResumePath, jobDescription) {
        try {
            // 1. Extract text from base resume
            const baseText = await this.extractText(baseResumePath);

            // 2. Analyze Job for Keywords
            const keywords = await this.extractKeywords(jobDescription);
            console.log(`🔑 Keywords found: ${keywords.join(', ')}`);

            // 3. Rewrite Summary & Skills (Lite optimization)
            // Note: Full rewrite is expensive, we focus on high-impact areas
            const tailoredContent = await this.generateTailoredContent(baseText, jobDescription);

            return {
                originalPath: baseResumePath,
                tailoredContent: tailoredContent,
                matchScore: 85, // Placeholder for AI score
                keywordsMatched: keywords,
            };

        } catch (error) {
            console.error('Resume tailoring failed:', error);
            return null;
        }
    }

    async extractText(filePath) {
        if (filePath.endsWith('.pdf')) {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        }
        return ''; // Add docx support if needed
    }

    async extractKeywords(description) {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Extract top 5 technical skills/keywords from this job description. Return as JSON array."
                },
                { role: "user", content: description }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content);
        return result.skills || result.keywords || [];
    }

    async generateTailoredContent(resumeText, jobDescription) {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writer. rewrite the 'Professional Summary' and 'Skills' section of this resume to perfectly match the job description. Keep it truthful but optimized for ATS."
                },
                {
                    role: "user",
                    content: `RESUME:\n${resumeText.substring(0, 2000)}\n\nJOB:\n${jobDescription.substring(0, 2000)}`
                }
            ]
        });

        return response.choices[0].message.content;
    }
}
