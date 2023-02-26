import "./packages/unpkg.com/n3@1.16.3/browser/n3.min.js"

const writer = await createWriter()

export function convertLabel(term) {
    if (term.termType === "BlankNode") {
        return
    }

    return writer._encodeIriOrBlank(term)
}

async function createWriter() {
    // Load prefix.cc dump
    const response = await fetch("./packages/prefix.cc/popular/all.file.json")
    const original = await response.json()

    // Discard duplicate
    const reverseIndex = new Map
    for (const [key, value] of Object.entries(original)) {
        if (!reverseIndex.has(value)) {
            reverseIndex.set(value, key)
        }
    }

    // Recreate original index by reversing again
    const prefixes = Object.fromEntries([...reverseIndex.entries()].map(([key, value]) => [value, key]))

    return new N3.Writer({prefixes})
}
