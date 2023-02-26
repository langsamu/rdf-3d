export class MimeType {
    original

    constructor(original) {
        this.original = original
    }

    get type() {
        return this.original.split("/")[0]
    }

    get subType() {
        return this.original.split("/")[1]
    }

    toString() {
        return this.original
    }
}
