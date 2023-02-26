import {PredicateObjectSet} from "./PredicateObjectSet.js"

export class GraphNode {
    #dataset
    #term
    #factory

    constructor(term, dataset, factory) {
        this.#term = term;
        this.#dataset = dataset
        this.#factory = factory
    }

    live(predicate, nodeMapping, valueMapping) {
        return new PredicateObjectSet(this.#term, predicate, this.#dataset, this.#factory, nodeMapping, valueMapping)
    }
}
