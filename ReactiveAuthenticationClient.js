import {DPoP} from "./packages/oidc/DPoP.js"
import {Dpop, HttpHeader, HttpStatus} from "./packages/common/Vocabulary.js"

const DEFAULT_AUTHENTICATION_MECHANISM = "Www-Bearer";

export class ReactiveAuthenticationClient extends EventTarget {
    /** @type {TokenProvider[]} */
    #tokenProviders

    #challengeCache

    #underlyingFetch

    /**
     * @param {Map} cache
     * @param {TokenProvider[]} tokenProviders
     * @param fetch
     */
    constructor(cache, tokenProviders, fetch = window.fetch) {
        super()

        this.#challengeCache = cache
        this.#tokenProviders = tokenProviders
        this.#underlyingFetch = fetch
    }

    /**
     * @param {RequestInfo|URL} input
     * @param {RequestInit?} init
     * @return {Promise<Response>}
     */
    async fetch(input, init) {
        this.dispatchEvent(new CustomEvent("fetching", {bubbles: true}))

        try {
            const request = new Request(input, init)

            if (ReactiveAuthenticationClient.#isAuthenticated(request)) {
                return await this.#underlyingFetch.call(undefined, request)
            }

            const cachedChallenge = this.#challengeCache.get(request.url)

            if (cachedChallenge) {
                const token = await this.#tokenProviders.find(provider => provider.matches(cachedChallenge)).getToken(cachedChallenge)

                if (token !== null) {
                    const upgraded = await ReactiveAuthenticationClient.#upgrade(request, token)
                    return this.fetch(upgraded)
                }
            }

            const originalResponse = await this.#underlyingFetch.call(undefined, request.clone())
            if (originalResponse.status !== HttpStatus.Unauthorized) {
                return originalResponse
            }

            // Extract challenge from unauthorized response.
            // In case there isn't one (or this header is not exposed to CORS) assume bearer authentication.
            const challenge = originalResponse.headers.get(HttpHeader.WwwAuthenticate) ?? DEFAULT_AUTHENTICATION_MECHANISM

            this.#challengeCache.set(request.url, challenge)
            const token = await this.#tokenProviders.find(provider => provider.matches(challenge)).getToken(challenge)
            const upgraded = await ReactiveAuthenticationClient.#upgrade(request, token)

            return await this.fetch(upgraded)

        } finally {
            this.dispatchEvent(new CustomEvent("fetched", {bubbles: true}))
        }
    }

    /**
     * @param {Request} request
     * @return {boolean}
     */
    static #isAuthenticated(request) {
        return request.headers.has(HttpHeader.Authorization)
    }

    /**
     * @param {Request} request
     * @param {DPopBoundAccessToken} token
     * @return {Promise<Request>}
     */
    static async #upgrade(request, token) {
        const upgraded = new Request(request)
        upgraded.headers.set(HttpHeader.Authorization, `${Dpop.Header} ${token.accessToken}`)
        upgraded.headers.set(Dpop.Header, await DPoP.proof(request.url, request.method, token.dpopKey))

        return upgraded
    }
}
