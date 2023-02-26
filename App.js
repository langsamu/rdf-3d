import Visualizer from "./Visualizer.js"
import RdfGraphData from "./RdfGraphData.js"
import "./packages/unpkg.com/n3@1.16.3/browser/n3.min.js"
import {OidcCredentialManager} from "./packages/oidc/OidcCredentialManager.js"
import {ReactiveAuthenticationClient} from "./ReactiveAuthenticationClient.js"
import {UmaTokenProvider} from "./UmaTokenProvider.js"
import {OidcTokenProvider} from "./packages/oidc/OidcTokenProvider.js"

export default class App extends HTMLElement {
    static ELEMENT_NAME = "x-app"
    #visualizer
    #oidc
    #client

    constructor() {
        super()

        this.#oidc = new OidcCredentialManager
        this.#client = new ReactiveAuthenticationClient([new UmaTokenProvider(this.#oidc), new OidcTokenProvider(this.#oidc)])
    }

    connectedCallback() {
        this.#visualizer = this.querySelector(`[is = "${Visualizer.ELEMENT_NAME}"]`)
        this.#visualizer.addEventListener(Visualizer.VISUALIZER_READY, this.#onVisualizerReady.bind(this))
        this.#oidc.addUi(this)
    }

    async #onVisualizerReady() {
        window.addEventListener("hashchange", this.#onHashChange.bind(this));

        if (window.location.hash) {
            await this.#onHashChange()
        } else {
            window.location.hash = "FibonacciSequenceUntyped.ttl"
        }
    }

    async #onHashChange() {
        const fragment = window.location.hash.substring(1)
        const uri = decodeURIComponent(fragment)
        const response = await this.#client.fetch(uri, {headers: {Accept: "text/turtle"}})
        const rdf = await response.text()

        const dataset = new N3.Store()
        dataset.addQuads(new N3.Parser({baseIRI: uri}).parse(rdf))

        this.#visualizer.value = new RdfGraphData(dataset)
    }
}
