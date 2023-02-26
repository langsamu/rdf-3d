export function basic(username, password) {
    const credentials = [username, password].join(":")
    const encoded = btoa(credentials)

    return `Basic ${encoded}`
}

export function bearer(token) {
    return `Bearer ${token}`
}
