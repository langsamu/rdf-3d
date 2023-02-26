import {TokenProvider} from "../common/TokenProvider.js"
import {DPopBoundAccessToken} from "../../DPopBoundAccessToken.js"
import {Oauth} from "../common/Vocabulary.js"

const oidcMatcher = /Bearer/

export class OidcTokenProvider extends TokenProvider {
    #oidc

    constructor(oidc) {
        super()

        this.#oidc = oidc;
    }

    /** @inheritDoc */
    matches(challenge) {
        return oidcMatcher.test(challenge)
    }

    /** @inheritDoc */
    async getToken(challenge) {
        const credentials = await this.#oidc.getCredentials()

        return new DPopBoundAccessToken(credentials.tokenResponse[Oauth.AccessToken], credentials.dpopKey)
    }
}
