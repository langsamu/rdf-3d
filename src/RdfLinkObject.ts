import type { Quad } from "rdf-js"
import { convertLabel } from "./utils"

export default class RdfLinkObject {
    source: string
    target: string
    label: string

    constructor(quad: Quad) {
        this.source = quad.subject.value
        this.target = quad.object.value
        this.label = convertLabel(quad.predicate.value)
    }
}
