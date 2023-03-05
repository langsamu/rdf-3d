import {ReactiveAuthenticationClient} from "./ReactiveAuthenticationClient.js"
import {UmaTokenProvider} from "./UmaTokenProvider.js"
import {OidcTokenProvider} from "./packages/oidc/OidcTokenProvider.js"

self.addEventListener("install", onInstall)
self.addEventListener("activate", onActivate)
self.addEventListener("fetch", onFetch)

const session = new Map

async function onInstall(e) {
    console.log("sw.onInstall", e)

    e.waitUntil(self.skipWaiting())
}

async function onActivate(e) {
    console.log("sw.onActivate", e)
    await self.clients.claim()
}

function onFetch(e) {
    console.debug("sw.onFetch", e)

    if (!e.clientId) {
        console.debug("Ignore navigation")
        return
    }

    e.respondWith(fetchInternal(e))
}

async function fetchInternal(e) {
    const client = await self.clients.get(e.clientId)

    const umaTokenProvider = new UmaTokenProvider(session)
    const oidcTokenProvider = new OidcTokenProvider()

    umaTokenProvider.addEventListener("needCredentials", async e => e.detail.resolve(await postAndWaitForResponse(client, "needCredentials")))
    oidcTokenProvider.addEventListener("needCredentials", async e => e.detail.resolve(await postAndWaitForResponse(client, "needCredentials")))

    const rac = new ReactiveAuthenticationClient(session, [umaTokenProvider, oidcTokenProvider], self.fetch)
    return await rac.fetch(e.request)
}

async function postAndWaitForResponse(target, message) {
    const channel = new MessageChannel()

    try {
        return await new Promise(resolve => {
            channel.port1.onmessage = e => resolve(e.data)

            target.postMessage(message, [channel.port2])
        })

    } finally {
        channel.port1.onmessage = undefined
    }
}
