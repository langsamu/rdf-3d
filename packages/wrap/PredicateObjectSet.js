export class PredicateObjectSet extends Set {
    #subject
    #predicate
    #dataset
    #factory
    #nodeMapping
    #valueMapping

    constructor(subject, predicate, dataset, factory, nodeMapping, valueMapping) {
        super()

        if (subject.termType !== "NamedNode" && subject.termType !== "BlankNode" && subject.termType !== "Variable") {
            throw new Error("subject not resource")
        }

        this.#subject = subject
        this.#predicate = predicate
        this.#dataset = dataset
        this.#factory = factory
        this.#nodeMapping = nodeMapping
        this.#valueMapping = valueMapping
    }

    add(value) {
        const object = this.#nodeMapping(value, this.#dataset);
        if (object.termType !== "NamedNode" && object.termType !== "BlankNode" && object.termType !== "Literal" && object.termType !== "Variable") {
            throw new Error("object not resource")
        }

        this.#dataset.add(this.#factory.quad(this.#subject, this.#predicate, object))
        return this
    }

    clear() {
        for (const q of this.#dataset.match(this.#subject, this.#predicate)) {
            this.#dataset.delete(q)
        }
    }

    delete(value) {
        if (!this.has(value)) {
            return false
        }

        for (const q of this.#dataset.match(this.#subject, this.#predicate, this.#nodeMapping(value, this.#dataset))) {
            this.#dataset.delete(q)
        }

        return true
    }

    forEach(callback, thisArg) {
        for (const item of this) {
            callback.call(thisArg, item, item, this)
        }
    }

    has(value) {
        const object = this.#nodeMapping(value, this.#dataset);
        if (object.termType !== "NamedNode" && object.termType !== "BlankNode" && object.termType !== "Literal" && object.termType !== "Variable") {
            throw new Error("object not resource")
        }

        return this.#dataset.has(this.#factory.quad(this.#subject, this.#predicate, object))
    }

    get size() {
        return Array.from(this).length
    }

    [Symbol.iterator]() {
        return this.values()
    }

    * entries() {
        for (const v of this) {
            yield [v, v]
        }
    }

    keys() {
        return this.values()
    }

    * values() {
        for (const q of this.#dataset.match(this.#subject, this.#predicate)) {
            yield this.#valueMapping(q.object, this.#dataset)
        }
    }

    get [Symbol.toStringTag]() {
        return "PredicateObjectSet"
    }
}
