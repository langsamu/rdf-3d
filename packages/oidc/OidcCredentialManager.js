import "./SolidOidcUi.js"
import {OidcClient} from "./OidcClient.js"
import {Oauth, Oidc, OidcRegistration, Pkce} from "../common/Vocabulary.js"
import {PKCE} from "./PKCE.js"

export class OidcCredentialManager {
    static #registrationMinTtlMillis = 10 * 1000

    #credentials
    #gettingCredentials
    #ui
    #clientCredentials

    addUi(container) {
        this.#ui = container.appendChild(container.ownerDocument.createElement("solid-oidc-ui"))
    }

    async getCredentials() {
        await this.#gettingCredentials

        if (!this.#valid && !await this.#refresh()) {
            await this.#codeFlow()
        }

        return this.#credentials
    }

    async #codeFlow() {
        const unlock = this.#lock()
        try {
            const idp = await this.#ui.getIdpUri()
            if (!idp) {
                return
            }

            const redirectUri = new URL("./authentication.html", new URL(location.pathname, location.origin))
            const codeVerifier = PKCE.createVerifier()
            const codeChallenge = await PKCE.createChallenge(codeVerifier);
            const oidcClient = new OidcClient(idp, redirectUri);
            let {client_id, client_secret} = await this.#register(oidcClient)

            const authenticationUrl = `${redirectUri}?${new URLSearchParams({
                idp,
                [Oauth.ClientId]: client_id,
                [Pkce.CodeChallenge]: codeChallenge
            })}`

            const code = await this.#authorize(authenticationUrl)
            const dpopKey = await crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256"}, true, ["sign"])
            const tokenResponse = await oidcClient.exchangeToken(code, client_id, client_secret, dpopKey, codeVerifier)
            this.#credentials = {dpopKey, tokenResponse}

        } finally {
            unlock()
        }
    }

    clearCredentials() {
        this.#credentials = null
        this.#clientCredentials = null
    }

    async getStorageFromWebId() {
        return this.#ui.getStorageFromWebId()
    }

    async #authorize(authenticationUrl) {
        // Open the authN window and wait for it to post us a message with the encrypted OIDC token response
        return await new Promise(async resolve => {
            window.addEventListener("message", async e => {
                // Notify that user interaction is no longer needed
                this.#ui.gotInteraction()

                resolve(e.data)
            }, {once: true})

            const authenticationWindow = open(authenticationUrl)

            // If popup was blocked then request user interaction to open authentication window
            if (!authenticationWindow) {
                this.#ui.needInteraction(authenticationUrl)
            }
        })
    }

    async #register(oidcClient) {
        if (!this.#clientCredentials) {
            this.#clientCredentials = {
                [Oauth.ClientId]: new URL("./id.jsonld", location)
            }

            // Use public client ID without secret by default but register client dynamically if on localhost.
            if (["localhost", "127.0.0.1", "::1"].includes(location.hostname)) {
                Object.assign(this.#clientCredentials, await oidcClient.register())
            }
        }

        if (expiresIn(this.#clientCredentials, OidcCredentialManager.#registrationMinTtlMillis)) {
            this.#clientCredentials = null
            return this.#register(oidcClient)
        }

        return this.#clientCredentials
    }

    get #valid() {
        if (!this.#credentials) {
            return false
        }

        const expiry = JSON.parse(atob(this.#credentials.tokenResponse[Oidc.IdToken].split(".")[1])).exp * 1000

        return new Date(expiry) - Date.now() > 10000
    }

    async #refresh() {
        if (!this.#credentials) {
            return false
        }

        const refreshToken = this.#credentials.tokenResponse[Oauth.RefreshToken]
        if (refreshToken) {
            const unlock = this.#lock()
            try {
                const idp = await this.#ui.getIdpUri()
                if (!idp) {
                    return false
                }

                const redirectUri = new URL("./authentication.html", new URL(location.pathname, location.origin))
                const oidcClient = new OidcClient(idp, redirectUri);
                const {client_id, client_secret} = await this.#register(oidcClient)
                const dpopKey = this.#credentials.dpopKey

                this.#credentials.tokenResponse = await oidcClient.refreshToken(refreshToken, client_id, client_secret, dpopKey)

                return true

            } finally {
                unlock()
            }
        }
    }

    #lock() {
        let unlock
        this.#gettingCredentials = new Promise(resolve => unlock = () => {
            this.#gettingCredentials = null
            resolve()
        })

        return unlock
    }
}

function expiresIn(registration, expectedTtlMillis) {
    if (registration[OidcRegistration.ClientSecretExpiresAt] === 0) { // NSS says this
        return false
    }

    const expiresAtMillis = registration[OidcRegistration.ClientSecretExpiresAt] * 1000
    const expiresAt = new Date(expiresAtMillis)
    const ttlMillis = expiresAt - Date.now()

    return ttlMillis < expectedTtlMillis
}
