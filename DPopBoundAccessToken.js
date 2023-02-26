export class DPopBoundAccessToken {
    #accessToken
    #dpopKey

    /**
     * @param {string} accessToken
     * @param {CryptoKeyPair} dpopKey
     */
    constructor(accessToken, dpopKey) {
        this.#accessToken = accessToken
        this.#dpopKey = dpopKey
    }

    /** @type {string} */
    get accessToken() {
        return this.#accessToken;
    }

    /** @type {CryptoKeyPair} */
    get dpopKey() {
        return this.#dpopKey;
    }
}
