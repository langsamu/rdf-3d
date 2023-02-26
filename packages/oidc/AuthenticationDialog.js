class AuthenticationDialog extends HTMLDialogElement {
    #link

    constructor() {
        super()

        this.innerHTML = `Click <a target="oidcAuthentication">here</a> to initiate authentication flow in a new window`
        this.#link = this.querySelector("a")
    }

    /**
     * @param {String} authenticationUrl
     */
    showModal(authenticationUrl) {
        this.#link.href = authenticationUrl

        super.showModal()
    }
}

customElements.define("solid-authentication-dialog", AuthenticationDialog, {extends: "dialog"})
