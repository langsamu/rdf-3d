import type { Dataset } from "rdf-js"
import RdfLinkObject from "./RdfLinkObject"
import RdfNodeObject from "./RdfNodeObject"

export default class RdfGraphData {
    readonly nodes: RdfNodeObject[]
    readonly links: RdfLinkObject[]

    constructor(g: Dataset) {
        this.nodes = [...new Map(RdfGraphData.asNodes(g)).values()]
        this.links = [...g].map(x => new RdfLinkObject(x))
    }

    private static *asNodes(graph: Dataset): Iterable<[string, RdfNodeObject]> {
        for (let quad of graph) {
            yield [quad.subject.value, new RdfNodeObject(quad.subject)]
            yield [quad.object.value, new RdfNodeObject(quad.object)]
        }
    }
}
