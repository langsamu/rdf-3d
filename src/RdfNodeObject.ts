import type { Term } from "rdf-js"
import { convertLabel } from "./utils"

export default class RdfNodeObject {
    private term: Term

    constructor(term: Term) {
        this.term = term
    }

    get id(): string {
        return this.term.value
    }

    get label(): string {
        return convertLabel(this.term.value)
    }
}
