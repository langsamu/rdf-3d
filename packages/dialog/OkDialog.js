import {DialogElement} from "./DialogElement.js"

export class OkDialog extends DialogElement {
    #okButton = document.createElement("button")

    constructor() {
        super()

        this.#okButton.classList.add("ok")
        this.buttons.appendChild(this.#okButton)
    }

    connectedCallback() {
        super.connectedCallback()

        if (this.dataset.okTitle) {
            this.#okButton.innerText = this.dataset.okTitle
        } else {
            this.#okButton.innerText = "OK"
        }

        if (this.dataset.okValue) {
            this.#okButton.value = this.dataset.okValue
        }
    }
}

customElements.define("solid-ok-dialog", OkDialog, {extends: "dialog"})
