import type { Quad } from "rdf-js"
import { convertLabel } from "./utils"
import type SpriteText from "three-spritetext"

export default class RdfLinkObject {
    source: string
    target: string
    label: string
    sprite: SpriteText

    constructor(quad: Quad) {
        this.source = quad.subject.value
        this.target = quad.object.value
        this.label = convertLabel(quad.predicate.value)
    }
}
