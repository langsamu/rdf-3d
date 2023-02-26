import {Oauth, Oidc, Pkce} from "../common/Vocabulary.js"
import {OidcClient} from "./OidcClient.js"

const query = new URLSearchParams(location.search)
if (query.has(Oidc.Code)) {
    await processCode()
} else {
    await authorize()
}

async function processCode() {
    opener.postMessage(query.get(Oidc.Code), location.origin)
    close()
}

async function authorize() {
    const redirectUri = new URL(location.pathname, location.origin)

    const oidcClient = new OidcClient(query.get("idp"), redirectUri);
    await oidcClient.authorize(query.get(Oauth.ClientId), query.get(Pkce.CodeChallenge))
}
