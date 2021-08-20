export function convertLabel(original: string): string {
    return original
        .replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "a")

        .replace("http://example.com/", "ex:")
        .replace("http://purl.org/dc/terms/", "dc:")
        .replace("http://xmlns.com/foaf/0.1/", "foaf:")
        .replace("http://www.w3.org/2002/07/owl#", "owl:")
        .replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#", "rdf:")
        .replace("http://www.w3.org/2000/01/rdf-schema#", "rdfs:")
        .replace("http://schema.org/", "schema:")
        .replace("http://www.w3.org/2004/02/skos/core#", "skos:")
        .replace("http://www.w3.org/2001/XMLSchema#", "xsd:")
}
