export class DialogElement extends HTMLDialogElement {
    #form = document.createElement("form")
    #legend = document.createElement("legend")
    #contents = document.createElement("div")
    #buttons = document.createElement("div")

    constructor() {
        super()

        this.#form.method = "dialog"
        super.appendChild(this.#form)

        const fieldset = document.createElement("fieldset")
        this.#form.appendChild(fieldset)

        fieldset.appendChild(this.#legend)

        this.#contents.classList.add("contents")
        fieldset.appendChild(this.#contents)

        this.#buttons.classList.add("buttons")
        fieldset.appendChild(this.#buttons)

        this.addEventListener("click", this.#onClick.bind(this))
    }

    connectedCallback() {
        if (this.dataset.title) {
            this.#legend.innerText = this.dataset.title
        } else {
            this.#legend.innerText = "Modal"
        }
    }

    get buttons() {
        return this.#buttons
    }

    get contents() {
        return this.#contents
    }

    get form() {
        return this.#form
    }

    async getModalValue() {
        this.#form.reset()
        this.returnValue = ""

        return await new Promise(resolve => {
            this.addEventListener("close", e => resolve(e.target.returnValue), {once: true})
            this.showModal()
        })
    }

    #onClick(e) {
        if (e.target !== this) {
            return
        }

        if (e.offsetX < 0 || e.offsetY < 0 || e.offsetX > this.offsetWidth || e.offsetY > this.offsetHeight) {
            this.close()
        }
    }
}
