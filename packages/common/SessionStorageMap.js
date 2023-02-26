export class SessionStorageMap extends Map {
    #key

    constructor(key) {
        super()

        this.#key = key
    }

    get #cache() {
        let cache = sessionStorage.getItem(this.#key)

        if (!cache) {
            cache = "{}"
            sessionStorage.setItem(this.#key, cache)
        }

        return JSON.parse(cache)
    }

    set #cache(value) {
        sessionStorage.setItem(this.#key, JSON.stringify(value))
    }

    clear(key) {
        const cache = this.#cache
        delete cache[key]

        this.#cache = {}
    }

    delete(key) {
        const cache = this.#cache
        delete cache[key]

        this.#cache = cache
    }

    forEach(callback, thisArg) {
        this.#cache.forEach(callback, thisArg)
    }

    get(key) {
        return this.#cache[key]
    }

    has(key) {
        return key in this.#cache
    }

    set(key, value) {
        const cache = this.#cache
        cache[key] = value

        this.#cache = cache
        return this
    }

    get size() {
        return Object.keys(this.#cache).length
    }
}
