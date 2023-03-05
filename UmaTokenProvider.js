import {TokenProvider} from "./packages/common/TokenProvider.js"
import {UmaClient} from "./UmaClient.js"
import {Oidc} from "./packages/common/Vocabulary.js"

const umaMatcher = /UMA as_uri="([^"]+)", ticket="([^"]+)"/;

export class UmaTokenProvider extends TokenProvider {
    /** @type {Map<String, DPopBoundAccessToken>} */
    #cache

    constructor(cache) {
        super()

        this.#cache = cache
    }

    /** @inheritDoc */
    matches(challenge) {
        return umaMatcher.test(challenge)
    }

    /** @inheritDoc */
    async getToken(challenge) {
        if (this.#cache.has(challenge)) {
            const umaToken = this.#cache.get(challenge);
            if (expired(umaToken.accessToken)) {
                return null
            }

            return umaToken
        }

        const [, asUri, ticket] = umaMatcher.exec(challenge)
        const umaClient = new UmaClient(asUri, this.#cache)
        const credentials = await this.#getCredentials()
        const umaToken = await umaClient.exchangeTicket(ticket, credentials.tokenResponse[Oidc.IdToken], credentials.dpopKey)
        this.#cache.set(challenge, umaToken)

        return umaToken
    }

    async #getCredentials() {
        return await new Promise(resolve => this.dispatchEvent(new CustomEvent("needCredentials", {detail: {resolve}})))
    }
}

function expired(token) {
    const b = token.split(".")
    const c = atob(b[1])
    const d = JSON.parse(c)
    const e = d.exp
    const f = e * 1000
    const expiresAt = new Date(f)
    const ttlMillis = expiresAt - Date.now()

    return ttlMillis < 10 * 1000
}
