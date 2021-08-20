import App from "./App"
import Visualizer from "./Visualizer"

customElements.define(App.ELEMENT_NAME, App, { extends: "main" })
customElements.define(Visualizer.ELEMENT_NAME, Visualizer, { extends: "canvas" })
