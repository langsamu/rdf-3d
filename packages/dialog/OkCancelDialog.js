import {OkDialog} from "./OkDialog.js"

export class OkCancelDialog extends OkDialog {
    #cancelButton = document.createElement("button")

    constructor() {
        super()

        this.#cancelButton.type = "button"
        this.#cancelButton.classList.add("cancel")
        this.#cancelButton.addEventListener("click", this.#onClickCancel.bind(this))

        this.buttons.appendChild(this.#cancelButton)
    }

    connectedCallback() {
        super.connectedCallback()

        if (this.dataset.cancelTitle) {
            this.#cancelButton.innerText = this.dataset.cancelTitle
        } else {
            this.#cancelButton.innerText = "Cancel"
        }
    }

    #onClickCancel() {
        this.close()
    }
}

customElements.define("solid-ok-cancel-dialog", OkCancelDialog, {extends: "dialog"})
