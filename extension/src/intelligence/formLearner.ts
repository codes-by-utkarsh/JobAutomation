"""
Form Pattern Learner - Extension learns form patterns over time.
"""

export interface FormPattern {
    platform: string;
    fieldSignature: string;
    fieldCount: number;
    requiredCount: number;
    commonFields: string[];
    sampleCount: number;
    lastSeen: number; // timestamp
}

export class FormPatternLearner {
    private readonly STORAGE_KEY_PREFIX = 'form_patterns_';
    private readonly MAX_PATTERNS = 100;

    /**
     * Learn a form pattern.
     */
    async learnPattern(platform: string, form: HTMLFormElement): Promise<void> {
        const pattern = this.extractPattern(form);

        const storedPatterns = await this.getPatterns(platform);

        // Find if this pattern exists
        const existing = storedPatterns.find(p => p.fieldSignature === pattern.fieldSignature);

        if (existing) {
            // Increment sample count
            existing.sampleCount += 1;
            existing.lastSeen = Date.now();
        } else {
            // Add new pattern
            storedPatterns.push({
                ...pattern,
                platform,
                sampleCount: 1,
                lastSeen: Date.now()
            });
        }

        // Keep only top patterns
        const sorted = storedPatterns
            .sort((a, b) => b.sampleCount - a.sampleCount)
            .slice(0, this.MAX_PATTERNS);

        await this.savePatterns(platform, sorted);

        console.log(`Learned form pattern for ${platform}, total patterns: ${sorted.length}`);
    }

    /**
     * Detect if current form is anomalous.
     */
    async detectAnomaly(platform: string, form: HTMLFormElement): Promise<boolean> {
        const currentPattern = this.extractPattern(form);

        const storedPatterns = await this.getPatterns(platform);

        if (storedPatterns.length === 0) {
            return false; // No baseline, not anomalous
        }

        // Get most common pattern
        const commonPattern = storedPatterns[0];

        // Compare signatures
        const similarity = this.comparePatternsimilarity(
            currentPattern.fieldSignature,
            commonPattern.fieldSignature
        );

        // If similarity < 0.6, flag as anomaly
        if (similarity < 0.6) {
            console.warn(`Form anomaly detected on ${platform}: similarity ${similarity.toFixed(2)}`);
            return true;
        }

        return false;
    }

    /**
     * Get expected form structure.
     */
    async getExpectedPattern(platform: string): Promise<FormPattern | null> {
        const patterns = await this.getPatterns(platform);
        return patterns.length > 0 ? patterns[0] : null;
    }

    /**
     * Extract pattern from form.
     */
    private extractPattern(form: HTMLFormElement): Omit<FormPattern, 'platform' | 'sampleCount' | 'lastSeen'> {
        const fields = Array.from(form.querySelectorAll('input, textarea, select'));

        const fieldTypes = fields.map((field: any) => {
            return `${field.type}:${field.required ? 'req' : 'opt'}`;
        }).sort();

        const commonFields = fields
            .map((field: any) => field.name || field.id)
            .filter(Boolean)
            .slice(0, 10); // Top 10 field names

        const signature = fieldTypes.join('|');

        return {
            fieldSignature: this.hashSignature(signature),
            fieldCount: fields.length,
            requiredCount: fields.filter((f: any) => f.required).length,
            commonFields
        };
    }

    /**
     * Hash signature for comparison.
     */
    private hashSignature(signature: string): string {
        // Simple hash
        let hash = 0;
        for (let i = 0; i < signature.length; i++) {
            const char = signature.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString(16);
    }

    /**
     * Compare pattern similarity.
     */
    private comparePatternsimilarity(sig1: string, sig2: string): number {
        if (sig1 === sig2) return 1.0;

        // Simple comparison
        const len1 = sig1.length;
        const len2 = sig2.length;
        const maxLen = Math.max(len1, len2);
        const minLen = Math.min(len1, len2);

        return minLen / maxLen;
    }

    /**
     * Get stored patterns for platform.
     */
    private async getPatterns(platform: string): Promise<FormPattern[]> {
        const key = this.STORAGE_KEY_PREFIX + platform;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Save patterns for platform.
     */
    private async savePatterns(platform: string, patterns: FormPattern[]): Promise<void> {
        const key = this.STORAGE_KEY_PREFIX + platform;
        localStorage.setItem(key, JSON.stringify(patterns));
    }
}

// Global instance
export const formLearner = new FormPatternLearner();
