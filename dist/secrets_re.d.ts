export declare const secrets: {
    /**
     *
     * @param str  string to Uint8Array
     * @returns  Uint8Array
     */
    toUint8Array: (str: string) => Uint8Array<ArrayBufferLike>;
    /**
     *
     * @param arr Uint8Array to string
     * @returns  string
     */
    fromUint8Array: (arr: Uint8Array) => string;
    /**
     *
     * @param secret  string
     * @param parts  number you want to split
     * @param threshold  number of parts to combine(at least, combineArr.len < threshold, can't combine)
     * @returns  string[]  array of shares, Promise
     */
    share: (secret: string, parts: number, threshold: number) => Promise<string[]>;
    /**
     *
     * @param shares  string[]  array of shares
     * @returns  string  combined secret, Promise
     */
    combine: (shares: string[]) => Promise<string>;
};
/**
 * class sytle for secrets
 */
export declare class Secrets {
    private input;
    private SharedResult;
    private parts;
    private threshold;
    private combinedResult;
    /**
     *
     * @param secret  string you want to be shared
     * @param parts  number you want to split
     * @param threshold  number of parts to combine(at least, combineArr.len < threshold, can't combine)
     */
    constructor(secret: string, parts: number, threshold: number);
    /**
     *
     * @param secret string you want to be shared
     * set input and execute share function
     */
    setInputAndExecShare(secret: string): void;
    /**
     *
     * @param parts number you want to split
     * @param threshold number of parts to combine(at least, combineArr.len < threshold, can't combine)
     * change parts and threshold settings
     */
    changeSettings(parts: number, threshold: number): void;
    /**
     *
     * @returns object {parts: number, threshold: number}
     */
    getSettings(): {
        parts: number;
        threshold: number;
    };
    executeShares(): Promise<void>;
    getSharesResult(): string[];
    getResult(): string[];
    clearInput(): void;
    clearResult(): void;
    clearAll(): void;
    executeCombine(shares: string[]): Promise<void>;
    getCombinedResult(): string | null;
    private share;
    private combine;
}
