import {OkCancelDialog} from "./OkCancelDialog.js"

export class InputDialog extends OkCancelDialog {
    #span = document.createElement("span")
    #input = document.createElement("input")
    #options = new Set

    constructor() {
        super()

        const label = document.createElement("label")
        label.appendChild(this.#span)
        label.appendChild(this.#input)
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

        if (this.dataset.required) {
            this.#input.required = true
        }

        if (this.dataset.type) {
            this.#input.type = this.dataset.type
        }

        if (this.dataset.pattern) {
            this.#input.pattern = this.dataset.pattern
        }

        if (this.dataset.placeholder) {
            this.#input.placeholder = this.dataset.placeholder
        }

        if (this.#options.size > 0) {
            const datalist = document.createElement("datalist")
            datalist.id = Math.random().toString(36)
            this.appendChild(datalist)

            this.#input.setAttribute("list", datalist.id)

            for (const value of this.#options) {
                const option = document.createElement("option")
                option.value = value
                datalist.appendChild(option)
            }
        }
    }

    set value(value) {
        this.#input.value = value
    }

    addOption(value) {
        this.#options.add(value)
    }

    #onSubmit(e) {
        if (e.submitter) {
            e.submitter.value = this.#input.value
        }

        this.returnValue = this.#input.value
    }
}

customElements.define("solid-input-dialog", InputDialog, {extends: "dialog"})
