import {OkCancelDialog} from "./OkCancelDialog.js"

export class SelectDialog extends OkCancelDialog {
    #span = document.createElement("span")
    #select = document.createElement("select")

    constructor() {
        super()

        const label = document.createElement("label")
        label.appendChild(this.#span)
        label.appendChild(this.#select)
        this.contents.appendChild(label)

        this.form.addEventListener("submit", this.#onSubmit.bind(this))
    }

    connectedCallback() {
        super.connectedCallback()

        if (this.dataset.label) {
            this.#span.innerText = this.dataset.label
        } else {
            this.#span.innerText = "Label"
        }
    }

    /**
     * @param {Iterable<String>} items
     * @return {Promise<String>}
     */
    getModalValue(items) {
        while (this.#select.length) {
            this.#select.remove(0);
        }

        for (const item of items) {
            const option = document.createElement("option")

            option.text = item

            this.#select.add(option)
        }

        return super.getModalValue()
    }

    #onSubmit(e) {
        if (e.submitter) {
            e.submitter.value = this.#select.value
        }

        this.returnValue = this.#select.value
    }
}

customElements.define("solid-select-dialog", SelectDialog, {extends: "dialog"})
