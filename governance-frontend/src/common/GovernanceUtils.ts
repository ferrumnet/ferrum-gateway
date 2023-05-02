import { randomBytes } from "crypto";

export class GovernanceUtils {
    static randomSalt() {
        return '0x' + randomBytes(32).toString('hex');
    }

    static defaultExpiry() {
        const now = new Date();
        const epochSeconds = Math.floor(now.getTime() / 1000);
        return epochSeconds + 3600 * 24 * 7; // Default to one week
    }
}