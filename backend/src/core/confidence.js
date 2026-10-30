/**
 * Confidence Calculator
 * Evaluates the probability of success for a given job application context.
 */

export class ConfidenceCalculator {

    /**
     * Calculate confidence score (0.0 - 1.0)
     * @param {Object} context - { job, profile, platformStats }
     */
    static calculate(context) {
        let score = 0.5; // Base confidence
        const { job, profile } = context;

        // 1. Keyword Match (30%)
        if (job.description) {
            const keywords = profile.jobRoles || [];
            const desc = job.description.toLowerCase();
            let matchCount = 0;
            keywords.forEach(kw => {
                if (desc.includes(kw.toLowerCase())) matchCount++;
            });

            const matchRatio = Math.min(matchCount / Math.max(keywords.length, 1), 1);
            score += matchRatio * 0.3;
        }

        // 2. Experience Level Alignment (20%)
        // Simple heuristic: if job title contains "Senior" and user is "Senior", boost
        const title = job.title.toLowerCase();
        const userLevel = (profile.experienceLevel || '').toLowerCase();

        if (userLevel === 'senior' && title.includes('senior')) score += 0.2;
        if (userLevel === 'entry' && (title.includes('senior') || title.includes('lead'))) score -= 0.3;

        // 3. Platform Health (20%)
        // (In real system, query recently blocked count)
        // For now, assume healthy
        score += 0.1;

        // 4. Time Freshness (10%)
        // Todo: Check job posted date

        // Clamp 0-1
        return Math.min(Math.max(score, 0), 0.99);
    }
}
