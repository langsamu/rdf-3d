import {HttpHeader, Mime, Pim, Solid} from "./packages/common/Vocabulary.js"
import {Cache} from "./packages/common/Cache.js"
import {GraphNode} from "./packages/wrap/GraphNode.js"
import "./packages/unpkg.com/n3@1.16.3/browser/n3.min.js"

export class WebIdClient {
    static #profileCache = new Cache("webid.profile.cache")

    /**
     *
     * @param webId
     * @return {Promise<Profile>}
     */
    static async dereference(webId) {
        if (!this.#profileCache.has(webId)) {
            const response = await fetch(webId, {
                cache: "no-store",
                headers: {
                    [HttpHeader.Accept]: Mime.Turtle
                }
            })

            this.#profileCache.set(webId, await response.text())
        }

        const rdf = this.#profileCache.get(webId)
        const dataset = new N3.Store(new N3.Parser().parse(rdf))
        return new Profile(dataset)
    }
}

class Profile {
    #dataset

    constructor(dataset) {
        this.#dataset = dataset
    }

    /**
     * @return {Agent}
     */
    get agent() {
        for (const q of this.#dataset.match(null, Vocabulary.primaryTopic)) {
            return new Agent(q.object, this.#dataset, N3.DataFactory)
        }
        for (const q of this.#dataset.match(null, Vocabulary.isPrimaryTopicOf)) {
            return new Agent(q.subject, this.#dataset, N3.DataFactory)
        }
    }
}

class Agent extends GraphNode {
    /**
     * @return {Set<string>}
     */
    get issuer() {
        return this.live(
            Vocabulary.oidcIssuer,
            N3.DataFactory.namedNode,
            t => t.value)
    }

    /**
     * @return {Set<string>}
     */
    get storage() {
        return this.live(
            Vocabulary.storage,
            N3.DataFactory.namedNode,
            t => t.value)
    }
}

class Vocabulary {
    static primaryTopic = N3.DataFactory.namedNode("http://xmlns.com/foaf/0.1/primaryTopic")
    static isPrimaryTopicOf = N3.DataFactory.namedNode("http://xmlns.com/foaf/0.1/isPrimaryTopicOf")
    static oidcIssuer = N3.DataFactory.namedNode(Solid.OidcIssuer)
    static storage = N3.DataFactory.namedNode(Pim.Storage)
}
