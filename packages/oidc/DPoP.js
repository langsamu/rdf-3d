export class DPoP {
    static async proof(htu, htm, key) {
        const iat = Math.floor(Date.now() / 1000)

        const head = {
            alg: "ES256",
            typ: "dpop+jwt",
            jwk: await crypto.subtle.exportKey("jwk", key.publicKey)
        }

        const body = {
            jti: DPoP.#base64UrlWithoutPadding(JSON.stringify(crypto.getRandomValues(new Uint8Array(32)))),
            htm,
            htu,
            iat,
            exp: iat + (60 * 5)
        }

        const headAndBody = [DPoP.#base64UrlWithoutPadding(JSON.stringify(head)), DPoP.#base64UrlWithoutPadding(JSON.stringify(body))].join(".")
        const algorithm = {name: "ECDSA", hash: "SHA-256"}
        const signed = await crypto.subtle.sign(algorithm, key.privateKey, new TextEncoder().encode(headAndBody))
        const signedString = DPoP.#base64UrlWithoutPadding(String.fromCharCode(...new Uint8Array(signed)))

        return [headAndBody, signedString].join(".")
    }

    static #base64UrlWithoutPadding(str) {
        return btoa(str)
            .replace(/=+$/, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
    }
}
