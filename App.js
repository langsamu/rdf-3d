import Visualizer from "./Visualizer.js"
import RdfGraphData from "./RdfGraphData.js"
import "./packages/unpkg.com/n3@1.16.3/browser/n3.min.js"

export default class App extends HTMLElement {
    static ELEMENT_NAME = "x-app"
    #visualizer

    connectedCallback() {
        this.#visualizer = this.querySelector(`[is = "${Visualizer.ELEMENT_NAME}"]`)
        this.#visualizer.addEventListener(Visualizer.VISUALIZER_READY, this.#onVisualizerReady.bind(this))
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
        const response = await fetch(uri, {headers: {Accept: "text/turtle"}})
        const rdf = await response.text()

        const dataset = new N3.Store()
        dataset.addQuads(new N3.Parser({baseIRI: uri}).parse(rdf))

        this.#visualizer.value = new RdfGraphData(dataset)
    }
}
