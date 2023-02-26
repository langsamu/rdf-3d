import {convertLabel} from "./utils.js"

export default class RdfLinkObject {
    source
    target
    label
    sprite

    constructor(quad) {
        this.source = quad.subject.value
        this.target = quad.object.value
        this.label = convertLabel(quad.predicate)
    }
}
