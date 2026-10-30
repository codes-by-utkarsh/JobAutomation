"""
Extension Abort Engine - Autonomous decision - making in the extension.
"""

export interface AbortDecision {
    shouldProceed: boolean;
    reason: string;
    confidence: number; // 0-1
    riskFactors: string[];
}

export interface HostileFormIndicators {
    totalFields: number;
    requiredFields: number;
    unusualFields: string[];
    estimatedTime: number; // minutes
}

/**
 * Evaluate if extension should proceed with application.
 * 
 * Extension has AUTONOMOUS AUTHORITY to abort.
 */
export async function evaluateApplication(job: any, form: any): Promise<AbortDecision> {
    const riskFactors: string[] = [];

    // Risk Factor 1: Hostile form
    const formAnalysis = analyzeFormHostility(form);

    if (formAnalysis.requiredFields > 15) {
        riskFactors.push(`Too many required fields (${formAnalysis.requiredFields})`);
    }

    if (formAnalysis.estimatedTime > 30) {
        riskFactors.push(`Form too long (${formAnalysis.estimatedTime} min estimated)`);
    }

    // Risk Factor 2: Suspicious company
    const companyTrust = await checkCompanyTrust(job.company, job.url);

    if (companyTrust < 0.3) {
        riskFactors.push(`Low company trust score (${companyTrust.toFixed(2)})`);
    }

    // Risk Factor 3: Form fingerprint mismatch
    const formStability = await checkFormStability(job.platform, form);

    if (formStability < 0.5) {
        riskFactors.push(`Form changed significantly (stability: ${formStability.toFixed(2)})`);
    }

    // Risk Factor 4: Job description red flags
    const descriptionRisk = analyzeJobDescription(job.description);

    if (descriptionRisk.score > 0.7) {
        riskFactors.push(`Honeypot detected: ${descriptionRisk.reason}`);
    }

    // Decision logic
    const totalRisk = riskFactors.length;

    if (totalRisk >= 3) {
        return {
            shouldProceed: false,
            reason: "Multiple risk factors detected",
            confidence: 0.9,
            riskFactors
        };
    }

    if (totalRisk >= 2) {
        return {
            shouldProceed: false,
            reason: "High risk application",
            confidence: 0.75,
            riskFactors
        };
    }

    return {
        shouldProceed: true,
        reason: "All checks passed",
        confidence: 0.8,
        riskFactors
    };
}

/**
 * Analyze form for hostile patterns.
 */
function analyzeFormHostility(form: any): HostileFormIndicators {
    const fields = form.querySelectorAll('input, textarea, select');
    const requiredFields = form.querySelectorAll('[required]');

    const unusualFields: string[] = [];

    // Check for unusual field types
    fields.forEach((field: HTMLElement) => {
        const name = (field as HTMLInputElement).name || '';

        // Red flags
        if (name.includes('ssn') || name.includes('social')) {
            unusualFields.push('SSN requested');
        }
        if (name.includes('bank') || name.includes('account')) {
            unusualFields.push('Banking info requested');
        }
        if (name.includes('credit') || name.includes('card')) {
            unusualFields.push('Credit card requested');
        }
    });

    // Estimate time (2 minutes per required field)
    const estimatedTime = requiredFields.length * 2;

    return {
        totalFields: fields.length,
        requiredFields: requiredFields.length,
        unusualFields,
        estimatedTime
    };
}

/**
 * Check company trustworthiness.
 */
async function checkCompanyTrust(company: string, url: string): Promise<number> {
    // Check domain age
    const domain = new URL(url).hostname;

    // Simplified trust scoring
    const knownDomains = ['linkedin.com', 'indeed.com', 'glassdoor.com'];

    if (knownDomains.some(d => domain.includes(d))) {
        return 0.9; // High trust
    }

    // Check if company is in cache
    const cachedTrust = localStorage.getItem(`trust_${company}`);
    if (cachedTrust) {
        return parseFloat(cachedTrust);
    }

    // Default medium trust
    return 0.5;
}

/**
 * Check form stability (has it changed?).
 */
async function checkFormStability(platform: string, form: any): Promise<number> {
    const currentFingerprint = computeFormFingerprint(form);

    const storedFingerprints = await getStoredFingerprints(platform);

    if (storedFingerprints.length === 0) {
        return 1.0; // First time, assume stable
    }

    // Compare to most common fingerprint
    const commonFingerprint = storedFingerprints[0];

    const similarity = compareFingertprints(currentFingerprint, commonFingerprint);

    return similarity;
}

function computeFormFingerprint(form: any): string {
    const fields = Array.from(form.querySelectorAll('input, textarea, select'));

    const signature = fields.map((field: any) => {
        return `${field.type}:${field.name}:${field.required}`;
    }).join('|');

    return btoa(signature); // Base64 encode
}

async function getStoredFingerprints(platform: string): Promise<string[]> {
    const stored = localStorage.getItem(`fingerprints_${platform}`);
    return stored ? JSON.parse(stored) : [];
}

function compareFingertprints(fp1: string, fp2: string): number {
    // Simple string similarity
    if (fp1 === fp2) return 1.0;

    const len1 = fp1.length;
    const len2 = fp2.length;

    // Levenshtein distance simplified
    const maxLen = Math.max(len1, len2);
    const minLen = Math.min(len1, len2);

    return minLen / maxLen;
}

/**
 * Analyze job description for red flags.
 */
function analyzeJobDescription(description: string): { score: number, reason: string } {
    const lowerDesc = description.toLowerCase();

    // Honeypot keywords
    const honeypotKeywords = [
        'no experience required',
        'make money fast',
        'work from home guarantee',
        'unlimited earning potential',
        'commission only',
        'easy money'
    ];

    for (const keyword of honeypotKeywords) {
        if (lowerDesc.includes(keyword)) {
            return { score: 0.9, reason: `Honeypot keyword: "${keyword}"` };
        }
    }

    // Very short description
    if (description.length < 100) {
        return { score: 0.8, reason: "Suspiciously short description" };
    }

    // Excessive exclamation marks
    const exclamations = (description.match(/!/g) || []).length;
    if (exclamations > 10) {
        return { score: 0.7, reason: "Excessive enthusiasm (scam indicator)" };
    }

    return { score: 0.0, reason: "No red flags detected" };
}
