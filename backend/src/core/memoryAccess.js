/**
 * Memory Access Layer
 * Interface for Strategy Engine to query Career Memory.
 */

import CareerMemory from '../models/CareerMemory.js';

export class MemoryAccess {

    static async getMemory(userId) {
        let memory = await CareerMemory.findOne({ userId });

        if (!memory) {
            memory = await CareerMemory.create({ userId });
        }

        return memory;
    }

    static async recordOutcome(userId, platform, result) {
        const memory = await this.getMemory(userId);

        // Map result to outcome type
        let outcome = 'neutral';
        if (result === 'applied') outcome = 'success';
        else if (result === 'failed' && result.message?.includes('captcha')) outcome = 'captcha';
        else if (result === 'failed' && result.message?.includes('blocked')) outcome = 'blocked';
        else if (result === 'failed') outcome = 'failed';

        memory.recordPlatformOutcome(platform, outcome);
        await memory.save();
    }
}
