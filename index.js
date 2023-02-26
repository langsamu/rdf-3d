import App from "./App.js"
import Visualizer from "./Visualizer.js"

customElements.define(App.ELEMENT_NAME, App, {extends: "main"})
customElements.define(Visualizer.ELEMENT_NAME, Visualizer, {extends: "canvas"})
