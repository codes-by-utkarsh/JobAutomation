"""
Extension Intelligence Utilities - Semantic form understanding and job fingerprinting.
"""

export interface FieldContext {
    label: string;
    placeholder: string;
    type: string;
    name: string;
    ariaLabel: string;
    parentText: string;
    siblingText: string;
}

export interface JobFingerprint {
    hash: string;
    title: string;
    company: string;
    location: string;
    descriptionPreview: string;
}

/**
 * Compute normalized job fingerprint for deduplication.
 */
export function computeJobFingerprint(job: {
    title: string;
    company: string;
    location?: string;
    description: string;
}): JobFingerprint {
    // Normalize strings
    const normalize = (str: string): string => {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const normalizedTitle = normalize(job.title);
    const normalizedCompany = normalize(job.company);
    const normalizedLocation = normalize(job.location || '');
    const descriptionPreview = job.description.slice(0, 500);

    // Create hash
    const hashInput = `${normalizedTitle}|${normalizedCompany}|${normalizedLocation}`;
    const hash = simpleHash(hashInput);

    return {
        hash,
        title: normalizedTitle,
        company: normalizedCompany,
        location: normalizedLocation,
        descriptionPreview
    };
}

/**
 * Simple hash function (FNV-1a).
 */
function simpleHash(str: string): string {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash *= 16777619;
    }
    return (hash >>> 0).toString(16);
}

/**
 * Extract field context for semantic classification.
 */
export function extractFieldContext(element: HTMLElement): FieldContext {
    const input = element as HTMLInputElement;

    const label = findLabel(element);
    const placeholder = input.placeholder || '';
    const type = input.type || '';
    const name = input.name || '';
    const ariaLabel = input.getAttribute('aria-label') || '';

    // Get parent and sibling context
    const parent = element.parentElement;
    const parentText = parent ? parent.innerText.slice(0, 100) : '';

    const siblings = parent ? Array.from(parent.children) : [];
    const siblingText = siblings
        .filter(s => s !== element && s.textContent)
        .map(s => s.textContent!.slice(0, 50))
        .join(' ');

    return {
        label,
        placeholder,
        type,
        name,
        ariaLabel,
        parentText,
        siblingText
    };
}

/**
 * Find associated label for an input field.
 */
function findLabel(element: HTMLElement): string {
    const input = element as HTMLInputElement;

    // Try for attribute
    if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) return label.textContent || '';
    }

    // Try parent label
    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.textContent || '';

    // Try previous sibling
    const prev = element.previousElementSibling;
    if (prev && prev.tagName === 'LABEL') {
        return prev.textContent || '';
    }

    return '';
}

/**
 * Decision engine: should we apply to this job?
 */
export function shouldApply(job: {
    title: string;
    company: string;
    description: string;
    url: string;
}): { apply: boolean; reason: string } {
    // 1. Check blacklist (in real system, fetch from backend)
    const blacklistedCompanies = ['ScamCorp', 'MLM Inc'];
    if (blacklistedCompanies.some(bc => job.company.includes(bc))) {
        return { apply: false, reason: 'blacklisted_company' };
    }

    // 2. Check for honeypot indicators
    const honeypotKeywords = [
        'no experience required',
        'make money fast',
        'work from home guarantee',
        'unlimited earning potential'
    ];

    const descLower = job.description.toLowerCase();
    for (const keyword of honeypotKeywords) {
        if (descLower.includes(keyword)) {
            return { apply: false, reason: `honeypot_keyword: ${keyword}` };
        }
    }

    // 3. Check description length
    if (job.description.length < 100) {
        return { apply: false, reason: 'suspiciously_short_description' };
    }

    // 4. Check for excessive enthusiasm
    if (job.description.match(/!/g)?.length || 0 > 10) {
        return { apply: false, reason: 'excessive_enthusiasm' };
    }

    return { apply: true, reason: 'passed_all_checks' };
}

/**
 * Check if job is duplicate (local cache).
 */
export async function isDuplicate(fingerprint: string): Promise<boolean> {
    // Get from localStorage
    const cache = localStorage.getItem('job_fingerprints');
    if (!cache) return false;

    const fingerprints: string[] = JSON.parse(cache);
    return fingerprints.includes(fingerprint);
}

/**
 * Cache job fingerprint.
 */
export async function cacheFingerprint(fingerprint: string): Promise<void> {
    const cache = localStorage.getItem('job_fingerprints');
    const fingerprints: string[] = cache ? JSON.parse(cache) : [];

    if (!fingerprints.includes(fingerprint)) {
        fingerprints.push(fingerprint);

        // Keep only last 1000
        if (fingerprints.length > 1000) {
            fingerprints.shift();
        }

        localStorage.setItem('job_fingerprints', JSON.stringify(fingerprints));
    }
}
