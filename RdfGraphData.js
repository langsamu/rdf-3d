import RdfLinkObject from "./RdfLinkObject.js"
import RdfNodeObject from "./RdfNodeObject.js"

export default class RdfGraphData {
    #nodes
    #links

    constructor(g) {
        this.#nodes = [...new Map(RdfGraphData.asNodes(g)).values()]
        this.#links = [...g].map(x => new RdfLinkObject(x))
    }

    get nodes() {
        return this.#nodes;
    }

    get links() {
        return this.#links;
    }

    static* asNodes(graph) {
        for (let quad of graph) {
            yield [quad.subject.value, new RdfNodeObject(quad.subject)]
            yield [quad.object.value, new RdfNodeObject(quad.object)]
        }
    }
}
