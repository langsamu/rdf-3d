import {TokenProvider} from "../common/TokenProvider.js"
import {DPopBoundAccessToken} from "../../DPopBoundAccessToken.js"
import {Oauth} from "../common/Vocabulary.js"

const oidcMatcher = /Bearer/

export class OidcTokenProvider extends TokenProvider {
    /** @inheritDoc */
    matches(challenge) {
        return oidcMatcher.test(challenge)
    }

    /** @inheritDoc */
    async getToken(challenge) {
        const credentials = await this.#getCredentials()

        return new DPopBoundAccessToken(credentials.tokenResponse[Oauth.AccessToken], credentials.dpopKey)
    }

    async #getCredentials() {
        return await new Promise(resolve => this.dispatchEvent(new CustomEvent("needCredentials", {detail: {resolve}})))
    }
}
