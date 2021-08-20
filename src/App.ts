import Visualizer from "./Visualizer"
import RdfGraphData from "./RdfGraphData"
import { Parser, Store } from "n3"

export default class App extends HTMLElement {
    static ELEMENT_NAME = "x-app"
    private visualizer: Visualizer

    connectedCallback(): void {
        this.visualizer = this.querySelector(`[is = "${Visualizer.ELEMENT_NAME}"]`) as Visualizer
        this.visualizer.addEventListener(Visualizer.VISUALIZER_READY, this.onVisualizerReady.bind(this))
    }

    private async onVisualizerReady(): Promise<void> {
        window.addEventListener("hashchange", this.onHashChange.bind(this));

        if (window.location.hash) {
            this.onHashChange.call(this);
        } else {
            window.location.hash = "FibonacciSequenceUntyped.ttl";
        }
    }

    private async onHashChange(): Promise<void> {
        const fragment = window.location.hash.substr(1)
        const uri = decodeURIComponent(fragment)
        const response = await fetch(uri, { headers: { Accept: "text/turtle" } })
        const rdf = await response.text()

        const dataset: any = new Store()
        dataset.addQuads(new Parser().parse(rdf))

        this.visualizer.value = new RdfGraphData(dataset)
    }
}
