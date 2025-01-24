"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secrets = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
const config_re = {
    bits: 8,
    maxShares: 255,
    logs: [],
    exps: [],
    size: 256,
    radix: 16
};
const settings = {
    bits: 8,
    radix: 16,
    minBits: 3,
    maxBits: 20,
    bytesPerChar: 2,
    maxBytesPerChar: 6,
    primitivePolynomials: [
        null, null, 1, 3, 3,
        5, 3, 3, 29, 17,
        9, 5, 83, 27, 43,
        3, 45, 9, 39, 39,
        9, 5, 3, 33, 27,
        9, 71, 39, 9, 5, 83
    ]
};
class Secrets {
    static initTables() {
        let x = 1;
        for (let i = 0; i < config_re.maxShares; i++) {
            config_re.exps[i] = x;
            config_re.logs[x] = i;
            x = x << 1;
            if (x >= config_re.maxShares) {
                x = x ^ config_re.maxShares;
                x = x ^ 283;
            }
        }
    }
    static strToNumArray(str) {
        const numArray = [];
        for (let i = 0; i < str.length; i++) {
            numArray.push(str.charCodeAt(i));
        }
        return numArray;
    }
    static numArrayToStr(numArray) {
        let str = '';
        for (let i = 0; i < numArray.length; i++) {
            str += String.fromCharCode(numArray[i]);
        }
        return str;
    }
    static numArrayToHex(numArray) {
        let hex = '';
        for (let i = 0; i < numArray.length; i++) {
            hex += ('0' + numArray[i].toString(16)).slice(-2);
        }
        return hex;
    }
    static hexToNumArray(hex) {
        const numArray = [];
        for (let i = 0; i < hex.length; i += 2) {
            numArray.push(parseInt(hex.substr(i, 2), 16));
        }
        return numArray;
    }
    static strToHex(str) {
        return this.numArrayToHex(this.strToNumArray(str));
    }
    static padLeft(str, multipleOfBits) {
        let preGenPadding = new Array(1024).join("0");
        if (multipleOfBits === 0 || multipleOfBits === 1) {
            return str;
        }
        if (multipleOfBits > 1024) {
            throw new Error("Padding must be multiples of no larger than 1024 bits.");
        }
        multipleOfBits = multipleOfBits || settings.bits;
        if (str) {
            const missing = str.length % multipleOfBits;
            if (missing) {
                return (preGenPadding + str).slice(-(multipleOfBits - missing + str.length));
            }
        }
        return str;
    }
    static hex2bin(str) {
        return str.split('').reverse().map(char => {
            const num = parseInt(char, 16);
            if (isNaN(num)) {
                throw new Error("Invalid hex character.");
            }
            return num.toString(2).padStart(4, '0');
        }).reverse().join('');
    }
    static bin2hex(str) {
        str = str.padStart(Math.ceil(str.length / 4) * 4, '0');
        let hex = '';
        for (let i = 0; i < str.length; i += 4) {
            const num = parseInt(str.slice(i, i + 4), 2);
            if (isNaN(num)) {
                throw new Error("Invalid binary character.");
            }
            hex += num.toString(16);
        }
        return hex;
    }
    static getRNG(bits = settings.bits, arr, radix = settings.radix, size = 4) {
        let bytes = Math.ceil(bits / 8);
        let str = "";
        let buf = node_forge_1.default.random.getBytesSync(bytes);
        for (let i = 0; i < buf.length; i++) {
            let value = buf.charCodeAt(i);
            if (arr && arr.length > 0) {
                str += arr[value % arr.length];
            }
            else {
                str += value.toString(radix).padStart(size, '0');
            }
        }
        return str.slice(0, Math.ceil(bits / (Math.log2(radix))));
    }
    static splitNumStringToIntArray(str, padLength) {
        const parts = [];
        if (padLength) {
            str = this.padLeft(str, padLength);
        }
        for (let i = str.length; i > settings.bits; i -= settings.bits) {
            const segment = str.slice(i - settings.bits, i);
            parts.push(parseInt(segment, 2));
        }
        if (str.length > 0) {
            parts.push(parseInt(str.slice(0, str.length), 2));
        }
        return parts;
    }
    static horner(x, coeffs) {
        const logx = config_re.logs[x];
        let fx = 0;
        for (let i = coeffs.length - 1; i >= 0; i--) {
            if (fx !== 0) {
                fx =
                    config_re.exps[(logx + config_re.logs[fx]) % config_re.maxShares] ^
                        coeffs[i];
            }
            else {
                fx = coeffs[i];
            }
        }
        return fx;
    }
    static lagrange(at, x, y, config) {
        let sum = 0;
        const len = x.length;
        for (let i = 0; i < len; i++) {
            if (!y[i])
                continue;
            let product = config.logs[y[i]];
            for (let j = 0; j < len; j++) {
                if (i === j)
                    continue;
                if (at === x[j]) {
                    product = -1;
                    break;
                }
                const atXorXj = at ^ x[j];
                const xiXorXj = x[i] ^ x[j];
                product = (product + config.logs[atXorXj] - config.logs[xiXorXj] + config.maxShares) % config.maxShares;
            }
            sum = product === -1 ? sum : sum ^ config.exps[product];
        }
        return sum;
    }
    static getShares(secret, numShares, threshold, config) {
        const shares = [];
        const coeffs = [secret];
        for (let i = 1; i < threshold; i++) {
            coeffs[i] = parseInt(config.rng(config.bits), 2);
        }
        for (let i = 1; i <= numShares; i++) {
            shares.push({
                x: i,
                y: this.horner(i, coeffs)
            });
        }
        return shares;
    }
    static constructPublicShareString(bits, id, data, config) {
        const parsedBits = parseInt(bits.toString(), 10) || settings.bits;
        const parsedId = parseInt(id.toString(), config.radix);
        const bitsBase36 = parsedBits.toString(36).toUpperCase();
        const idMax = (1 << parsedBits) - 1;
        const idPaddingLen = idMax.toString(config.radix).length;
        const idHex = this.padLeft(parsedId.toString(config.radix), idPaddingLen);
        if (!Number.isInteger(parsedId) || parsedId < 1 || parsedId > idMax) {
            throw new Error(`Share id must be an integer between 1 and ${idMax}, inclusive.`);
        }
        return bitsBase36 + idHex + data;
    }
    constructor(userConfig = {}) {
        this.bits = settings.bits;
        this.radix = settings.radix;
        this.minBits = settings.minBits;
        this.maxBits = settings.maxBits;
        const { bits, radix, minBits, maxBits, primitivePolynomials } = settings;
        this.config = {
            bits: userConfig.bits || bits,
            radix: userConfig.radix || radix,
            size: Math.pow(2, userConfig.bits || bits),
            maxShares: Math.pow(2, userConfig.bits || bits) - 1,
            logs: [],
            exps: []
        };
        this.rng = () => Math.random().toString(2).substring(2, 2 + this.config.bits);
        this.init();
    }
    init() {
        const { bits, size, maxShares } = this.config;
        const { primitivePolynomials, minBits, maxBits } = settings;
        if (bits < minBits || bits > maxBits) {
            throw new Error(`Bits must be between ${minBits} and ${maxBits}.`);
        }
        const primitive = primitivePolynomials[bits];
        if (!primitive) {
            throw new Error(`No primitive polynomial found for bits=${bits}.`);
        }
        const logs = [];
        const exps = [];
        let x = 1;
        for (let i = 0; i < size; i++) {
            exps[i] = x;
            logs[x] = i;
            x = x << 1;
            if (x >= size) {
                x = x ^ primitive;
                x = x & maxShares;
            }
        }
        this.config.logs = logs;
        this.config.exps = exps;
    }
    setRNG(rng) {
        this.rng = rng || (() => Math.random().toString(2).substring(2, 2 + this.config.bits));
    }
    getConfig() {
        return this.config;
    }
    padLeft(input, length = this.config.bits) {
        return input.padStart(length, "0");
    }
    splitNumStringToIntArray(binaryString, chunkSize) {
        const chunks = binaryString.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
        return chunks.map(chunk => parseInt(chunk, 2));
    }
    share(secret, numShares, threshold, padLength = 128) {
        if (typeof secret !== "string") {
            throw new Error("Secret must be a string.");
        }
        if (!Number.isInteger(numShares) || numShares < 2 || numShares > this.config.maxShares) {
            const neededBits = Math.ceil(Math.log(numShares + 1) / Math.LN2);
            throw new Error(`Number of shares must be an integer between 2 and ${this.config.maxShares}. To create ${numShares} shares, use at least ${neededBits} bits.`);
        }
        if (!Number.isInteger(threshold) || threshold < 2 || threshold > numShares) {
            throw new Error(`Threshold must be an integer between 2 and ${numShares}.`);
        }
        if (!Number.isInteger(padLength) || padLength < 0 || padLength > 1024) {
            throw new Error("Zero-pad length must be an integer between 0 and 1024.");
        }
        let binarySecret = "1" + this.hex2bin(secret);
        const secretChunks = this.splitNumStringToIntArray(binarySecret, padLength);
        const x = new Array(numShares);
        const y = new Array(numShares);
        for (const chunk of secretChunks) {
            const subShares = Secrets.getShares(chunk, numShares, threshold, { bits: this.config.bits, rng: this.rng });
            for (let j = 0; j < numShares; j++) {
                x[j] = x[j] || subShares[j].x.toString(this.config.radix);
                y[j] = this.padLeft(subShares[j].y.toString(2)) + (y[j] || "");
            }
        }
        return x.map((xVal, i) => this.constructPublicShareString(this.config.bits, xVal, this.bin2hex(y[i])));
    }
    constructPublicShareString(bits, id, data) {
        return Secrets.constructPublicShareString(bits, parseInt(id), data, this.config);
    }
    hex2bin(str) {
        return Secrets.hex2bin(str);
    }
    bin2hex(str) {
        return Secrets.bin2hex(str);
    }
    extractShareComponents(share) {
        const bits = parseInt(share.charAt(0), 36);
        if (!Number.isInteger(bits) || bits < settings.minBits || bits > settings.maxBits) {
            throw new Error(`Invalid share: Number of bits must be an integer between ${settings.minBits} and ${settings.maxBits}, inclusive.`);
        }
        const maxShares = Math.pow(2, bits) - 1;
        const idLength = maxShares.toString(this.config.radix).length;
        const regex = new RegExp(`^([a-kA-K3-9]{1})([a-fA-F0-9]{${idLength}})([a-fA-F0-9]+)$`);
        const match = regex.exec(share);
        if (!match) {
            throw new Error("The share data provided is invalid: " + share);
        }
        const id = parseInt(match[2], this.config.radix);
        if (!Number.isInteger(id) || id < 1 || id > maxShares) {
            throw new Error(`Invalid share: Share ID must be an integer between 1 and ${maxShares}, inclusive.`);
        }
        return {
            bits,
            id,
            data: match[3],
        };
    }
    ;
    combine(shares, at = 0) {
        if (!shares || shares.length === 0) {
            throw new Error("No shares provided for combination.");
        }
        let setBits;
        const x = [];
        const y = [];
        for (const shareStr of shares) {
            const share = this.extractShareComponents(shareStr);
            if (setBits === undefined) {
                setBits = share.bits;
            }
            else if (share.bits !== setBits) {
                throw new Error("Mismatched shares: Different bit settings.");
            }
            if (!x.includes(share.id)) {
                x.push(share.id);
                const splitShare = Secrets.splitNumStringToIntArray(this.hex2bin(share.data), this.config.bits);
                for (let j = 0; j < splitShare.length; j++) {
                    if (!y[j]) {
                        y[j] = [];
                    }
                    y[j][x.length - 1] = splitShare[j];
                }
            }
        }
        let result = "";
        for (const shareRow of y) {
            const interpolatedValue = Secrets.lagrange(at, x, shareRow, this.config);
            result = this.padLeft(interpolatedValue.toString(2)) + result;
        }
        if (at >= 1) {
            return this.bin2hex(result);
        }
        const secretBinary = result.slice(result.indexOf("1") + 1);
        return this.bin2hex(secretBinary);
    }
    random(bits) {
        if (typeof bits !== "number" ||
            bits % 1 !== 0 ||
            bits < 2 ||
            bits > 65536) {
            throw new Error("Number of bits must be an Integer between 1 and 65536.");
        }
        return this.bin2hex(this.rng());
    }
    newShare(id, shares) {
        if (typeof id === "string") {
            id = parseInt(id, this.config.radix);
        }
        if (!Number.isInteger(id) || id < 1 || id >= Math.pow(2, this.config.bits)) {
            throw new Error(`Invalid 'id': Must be an integer between 1 and ${Math.pow(2, this.config.bits) - 1}, inclusive.`);
        }
        const radid = id.toString(this.config.radix);
        const firstShare = shares[0];
        const share = this.extractShareComponents(firstShare);
        return Secrets.constructPublicShareString(share.bits, Number(radid), this.combine(shares, id), this.config);
    }
}
exports.Secrets = Secrets;
