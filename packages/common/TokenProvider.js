export class TokenProvider {
    /**
     * @abstract
     * @param challenge {string}
     * @return {boolean}
     */
    matches(challenge) {
        throw new Error("Not implemented")
    }

    /**
     * @abstract
     * @param challenge {string}
     * @return {Promise<DPopBoundAccessToken>}
     */
    async getToken(challenge) {
        throw new Error("Not implemented")
    }
}
