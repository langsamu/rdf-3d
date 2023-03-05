import {
    Dpop,
    HttpHeader,
    HttpMethod,
    Mime,
    Oauth,
    OauthMetadata,
    Oidc,
    OidcRegistration,
    Pkce,
    Solid
} from "../common/Vocabulary.js"
import {basic} from "../common/Utils.js"
import {DPoP} from "./DPoP.js"

export class OidcClient {
    #identityProvider
    #redirectUri

    constructor(identityProvider, redirectUri) {
        this.#identityProvider = identityProvider
        this.#redirectUri = redirectUri
    }

    async register() {
        const metadata = await this.#discover()
        const registrationEndpoint = metadata[OauthMetadata.RegistrationEndpoint]

        const response = await fetch(registrationEndpoint, {
            method: HttpMethod.Post,
            headers: {
                [HttpHeader.ContentType]: Mime.Json
            },
            body: JSON.stringify({
                [OidcRegistration.RedirectUris]: [this.#redirectUri],
                [OidcRegistration.GrantTypes]: [Oidc.AuthorizationCode, Oauth.RefreshToken],
                [OidcRegistration.ClientName]: "Solid Explorer",
                [OidcRegistration.LogoUri]: "https://langsamu.github.io/solid-explorer/logo.svg",
                [OidcRegistration.ClientUri]: "https://github.com/langsamu/solid-explorer",
                [OidcRegistration.PolicyUri]: "https://github.com/langsamu/solid-explorer/blob/main/data-policy.md"
            }),
            redirect: "manual" // NSS responds with 201
        })

        return await response.json()
    }

    async authorize(clientId, codeChallenge) {
        const metadata = await this.#discover()
        const authorizationEndpoint = metadata[OauthMetadata.AuthorizationEndpoint]

        const authorizationRequest = new URLSearchParams({
            [Oauth.ClientId]: clientId,
            [Oauth.RedirectUri]: this.#redirectUri,
            [Oauth.ResponseType]: Oidc.Code,
            [Oauth.Scope]: [Oidc.Scope, Oidc.OfflineAccess, Solid.WebIdScope].join(" "),
            [Oidc.Prompt]: Oidc.Consent,
            [Pkce.CodeChallenge]: codeChallenge,
            [Pkce.CodeChallengeMethod]: "S256",
        })

        const authorizationUrl = new URL(`?${authorizationRequest}`, authorizationEndpoint)
        location.assign(authorizationUrl)
    }

    async exchangeToken(code, clientId, clientSecret, dpopKey, codeVerifier) {
        const metadata = await this.#discover()
        const tokenEndpoint = metadata[OauthMetadata.TokenEndpoint]
        const dpopProof = await DPoP.proof(tokenEndpoint, HttpMethod.Post, dpopKey);

        const init = {
            method: HttpMethod.Post,
            body: new URLSearchParams({
                [Dpop.Header]: dpopProof,
                [Oauth.ClientId]: clientId,
                [Oauth.GrantType]: Oidc.AuthorizationCode,
                [Oauth.RedirectUri]: this.#redirectUri,
                [Oidc.Code]: code,
                [Pkce.CodeVerifier]: codeVerifier,
            }),
            headers: new Headers
        }

        if (clientSecret) {
            init.headers.set(HttpHeader.Authorization, basic(clientId, clientSecret))
        }

        const response = await fetch(tokenEndpoint, init)
        return response.json()
    }

    async refreshToken(refreshToken, clientId, clientSecret, dpopKey) {
        const metadata = await this.#discover()
        const tokenEndpoint = metadata[OauthMetadata.TokenEndpoint]
        const dpopProof = await DPoP.proof(tokenEndpoint, HttpMethod.Post, dpopKey);

        const init = {
            method: HttpMethod.Post,
            body: new URLSearchParams({
                [Dpop.Header]: dpopProof,
                [Oauth.ClientId]: clientId,
                [Oauth.GrantType]: Oauth.RefreshToken,
                [Oauth.RedirectUri]: this.#redirectUri,
                [Oauth.RefreshToken]: refreshToken,
            }),
            headers: new Headers
        }

        if (clientSecret) {
            init.headers.set(HttpHeader.Authorization, basic(clientId, clientSecret))
        }

        const response = await fetch(tokenEndpoint, init)
        return response.json()
    }

    async #discover() {
        const response = await fetch(new URL(Oidc.Discovery, this.#identityProvider))
        return await response.json()
    }
}
