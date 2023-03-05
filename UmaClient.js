import {
    Dpop,
    HttpHeader,
    HttpMethod,
    HttpStatus,
    Mime,
    Oauth,
    OauthMetadata,
    Uma
} from "./packages/common/Vocabulary.js"
import {DPoP} from "./packages/oidc/DPoP.js"
import {DPopBoundAccessToken} from "./DPopBoundAccessToken.js"

export class UmaClient {
    #authorizationServer
    #metadataCache

    constructor(authorizationServer, cache) {
        this.#authorizationServer = authorizationServer
        this.#metadataCache = cache
    }

    /**
     * @param {string} ticket
     * @param {string} idToken
     * @param {CryptoKeyPair} dpopKey
     * @return {Promise<DPopBoundAccessToken>}
     */
    async exchangeTicket(ticket, idToken, dpopKey) {
        const metadata = await this.discover()
        const tokenEndpoint = metadata[OauthMetadata.TokenEndpoint]
        const dpopProof = await DPoP.proof(tokenEndpoint, HttpMethod.Post, dpopKey);

        const response = await fetch(tokenEndpoint, {
            method: HttpMethod.Post,
            headers: {
                [Dpop.Header]: dpopProof,
                [HttpHeader.Accept]: Mime.Json,
                [HttpHeader.ContentType]: Mime.Form
            },
            body: new URLSearchParams({
                [Oauth.GrantType]: Uma.TicketGrant,
                [Uma.ClaimToken]: idToken,
                [Uma.ClaimTokenFormat]: Uma.IdToken,
                [Uma.Ticket]: ticket
            })
        })

        const umaResponse = await response.json()
        const umaAccessToken = umaResponse[Oauth.AccessToken]

        return new DPopBoundAccessToken(umaAccessToken, dpopKey)
    }

    static async parseUmaChallenge(input, init) {
        const response = await fetch(input, init)

        if (response.ok || response.status !== HttpStatus.Unauthorized) {
            return [response]
        }

        const challenge = response.headers.get(HttpHeader.WwwAuthenticate)
        const [, umaServer, umaTicket] = Uma.TicketParser.exec(challenge)

        return [response, umaServer, umaTicket]
    }

    async discover() {
        if (!this.#metadataCache.has(this.#authorizationServer)) {
            const response = await fetch(new URL(Uma.Discovery, this.#authorizationServer))
            const json = await response.json()

            this.#metadataCache.set(this.#authorizationServer, json)
        }

        return this.#metadataCache.get(this.#authorizationServer)
    }
}
