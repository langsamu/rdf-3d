import {DialogElement} from "./DialogElement.js"

export class ContextMenuDialog extends DialogElement {
    #options = new Map
    #menu

    constructor() {
        super()

        this.#menu = this.contents.appendChild(document.createElement("menu"))

        this.classList.add("context-menu")
    }

    connectedCallback() {
        super.connectedCallback()

        if (this.#options.size > 0) {
            for (const [value, title] of this.#options) {
                const li = this.#menu.appendChild(document.createElement("li"))
                const button = li.appendChild(document.createElement("button"))
                button.value = value
                button.innerText = title
            }
        }
    }

    addItem(value, title) {
        this.#options.set(value, title)
    }
}

customElements.define("solid-context-dialog", ContextMenuDialog, {extends: "dialog"})
