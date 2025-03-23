//old deprecate library :
//secretsjs_grempe_rewrite
//this is library adapter 
//main funtion from shamir-secret-sharing
import { Buffer } from "buffer";
import { split, combine } from "shamir-secret-sharing";
//style for initialed object
//已實例化物件的風格
export const secrets = {
    /**
     *
     * @param str  string to Uint8Array
     * @returns  Uint8Array
     */
    toUint8Array: (str) => new TextEncoder().encode(str),
    /**
     *
     * @param arr Uint8Array to string
     * @returns  string
     */
    fromUint8Array: (arr) => new TextDecoder().decode(arr),
    /**
     *
     * @param secret  string
     * @param parts  number you want to split
     * @param threshold  number of parts to combine(at least, combineArr.len < threshold, can't combine)
     * @returns  string[]  array of shares, Promise
     */
    share: async (secret, parts, threshold) => {
        const shares = await split(secrets.toUint8Array(secret), parts, threshold);
        return shares.map(share => Buffer.from(share).toString('hex'));
    },
    /**
     *
     * @param shares  string[]  array of shares
     * @returns  string  combined secret, Promise
     */
    combine: async (shares) => {
        const uint8Array = shares.map(share => Uint8Array.from(Buffer.from(share, 'hex')));
        const combinedUint8Array = await combine(uint8Array);
        return secrets.fromUint8Array(combinedUint8Array);
    },
};
/**
 * class sytle for secrets
 */
export class Secrets {
    /**
     *
     * @param secret  string you want to be shared
     * @param parts  number you want to split
     * @param threshold  number of parts to combine(at least, combineArr.len < threshold, can't combine)
     */
    constructor(secret, parts, threshold) {
        this.SharedResult = [];
        this.combinedResult = null;
        this.input = secret;
        this.parts = parts;
        this.threshold = threshold;
    }
    /**
     *
     * @param secret string you want to be shared
     * set input and execute share function
     */
    setInputAndExecShare(secret) {
        this.input = secret;
        this.executeShares();
    }
    /**
     *
     * @param parts number you want to split
     * @param threshold number of parts to combine(at least, combineArr.len < threshold, can't combine)
     * change parts and threshold settings
     */
    changeSettings(parts, threshold) {
        this.parts = parts;
        this.threshold = threshold;
    }
    /**
     *
     * @returns object {parts: number, threshold: number}
     */
    getSettings() {
        return { parts: this.parts, threshold: this.threshold };
    }
    async executeShares() {
        this.SharedResult = await this.share(this.input, this.parts, this.threshold);
    }
    getSharesResult() {
        return this.SharedResult;
    }
    getResult() {
        return this.SharedResult;
    }
    clearInput() {
        this.input = "";
    }
    clearResult() {
        this.SharedResult = [];
        this.combinedResult = null;
    }
    clearAll() {
        this.clearInput();
        this.clearResult();
    }
    async executeCombine(shares) {
        this.combinedResult = await this.combine(shares);
    }
    getCombinedResult() {
        return this.combinedResult;
    }
    async share(secret, parts, threshold) {
        return await secrets.share(secret, parts, threshold);
    }
    async combine(shares) {
        return await secrets.combine(shares);
    }
}
