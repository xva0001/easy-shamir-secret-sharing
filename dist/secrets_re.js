"use strict";
//old deprecate library :
//secretsjs_grempe_rewrite
//this is library adapter 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secrets = exports.secrets = void 0;
//main funtion from shamir-secret-sharing
const buffer_1 = require("buffer");
const shamir_secret_sharing_1 = require("shamir-secret-sharing");
//style for initialed object
//已實例化物件的風格
exports.secrets = {
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
    share: (secret, parts, threshold) => __awaiter(void 0, void 0, void 0, function* () {
        const shares = yield (0, shamir_secret_sharing_1.split)(exports.secrets.toUint8Array(secret), parts, threshold);
        return shares.map(share => buffer_1.Buffer.from(share).toString('hex'));
    }),
    /**
     *
     * @param shares  string[]  array of shares
     * @returns  string  combined secret, Promise
     */
    combine: (shares) => __awaiter(void 0, void 0, void 0, function* () {
        const uint8Array = shares.map(share => Uint8Array.from(buffer_1.Buffer.from(share, 'hex')));
        const combinedUint8Array = yield (0, shamir_secret_sharing_1.combine)(uint8Array);
        return exports.secrets.fromUint8Array(combinedUint8Array);
    }),
};
/**
 * class sytle for secrets
 */
class Secrets {
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
    executeShares() {
        return __awaiter(this, void 0, void 0, function* () {
            this.SharedResult = yield this.share(this.input, this.parts, this.threshold);
        });
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
    executeCombine(shares) {
        return __awaiter(this, void 0, void 0, function* () {
            this.combinedResult = yield this.combine(shares);
        });
    }
    getCombinedResult() {
        return this.combinedResult;
    }
    share(secret, parts, threshold) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exports.secrets.share(secret, parts, threshold);
        });
    }
    combine(shares) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exports.secrets.combine(shares);
        });
    }
}
exports.Secrets = Secrets;
