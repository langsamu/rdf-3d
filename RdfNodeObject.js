import {convertLabel} from "./utils.js"

export default class RdfNodeObject {
    #term

    constructor(term) {
        this.#term = term
    }

    get id() {
        return this.#term.value
    }

    get label() {
        return convertLabel(this.#term)
    }
}
