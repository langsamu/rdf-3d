export class Cache {
    #key

    constructor(key) {
        this.#key = key
    }

    get #cache() {
        let cache = localStorage.getItem(this.#key)

        if (!cache) {
            cache = "{}"
            localStorage.setItem(this.#key, cache)
        }

        return JSON.parse(cache)
    }

    has(key) {
        return this.#cache.hasOwnProperty(key)
    }

    get(key) {
        return this.#cache[key]
    }

    set(key, value) {
        const cache = this.#cache
        cache[key] = value

        localStorage.setItem(this.#key, JSON.stringify(cache))
    }

    clear(key) {
        const cache = this.#cache
        delete cache[key]

        localStorage.setItem(this.#key, JSON.stringify(cache))
    }
}
