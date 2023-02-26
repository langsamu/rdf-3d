import {MimeType} from "./MimeType.js"

export class ContentType {
    original

    constructor(original) {
        this.original = original
    }

    get mime() {
        return new MimeType(this.original.split(";")[0])
    }
}
