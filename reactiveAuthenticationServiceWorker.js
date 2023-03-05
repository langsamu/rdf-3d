import {OidcCredentialManager} from "./packages/oidc/OidcCredentialManager.js"

const oidc = new OidcCredentialManager
oidc.addUi(document.body)

navigator.serviceWorker.addEventListener("message", onWorkerMessage)

const registration = await navigator.serviceWorker.getRegistration()
if (!registration || !navigator.serviceWorker.controller) {
    console.debug("Not registered. Registering.")
    const registration2 = await navigator.serviceWorker.register("./worker.js", {type: "module"})

    if (!registration2 || !navigator.serviceWorker.controller) {
        console.debug("Reloading")
        location.reload()
    }

    await registration2.update()
}

await registration.update()


async function onWorkerMessage(e) {
    console.debug("onWorkerMessage", e)

    if (e.data === "needCredentials") {
        console.debug("onWorkerMessage needCredentials")

        e.ports[0].postMessage(await oidc.getCredentials())
    }
}
