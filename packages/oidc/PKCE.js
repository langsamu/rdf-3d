const VERIFIER_LENGTH = 32
const CHALLENGE_HASH_ALGORITHM = "SHA-256"

export class PKCE {
    static createVerifier() {
        return this.#base64UrlWithoutPadding(crypto.getRandomValues(new Uint8Array(VERIFIER_LENGTH)))
    }

    static async createChallenge(verifier) {
        return this.#base64UrlWithoutPadding(await crypto.subtle.digest(CHALLENGE_HASH_ALGORITHM, new TextEncoder().encode(verifier)))
    }

    static #base64UrlWithoutPadding(data) {
        return btoa(String.fromCharCode(...new Uint8Array(data)))
            .replace(/=+/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
    }
}
