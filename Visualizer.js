import {AmbientLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer,} from "three"
import {FlyControls} from "three/addons/controls/FlyControls.js"
import {TrackballControls} from "three/addons/controls/TrackballControls.js"
import "./packages/unpkg.com/three-spritetext@1.7.1/dist/three-spritetext.min.js"

export default class Visualizer extends HTMLCanvasElement {
    static ELEMENT_NAME = "x-visualizer"
    static VISUALIZER_READY = "visualizer-ready"

    #graph
    #camera
    #renderer
    #scene
    #trackball
    #fly
    #shift = false

    connectedCallback() {
        this.#buildScene()

        window.addEventListener("resize", this.#onResize.bind(this))
        window.addEventListener("keydown", this.#onKeydown.bind(this))

        this.dispatchEvent(new CustomEvent(Visualizer.VISUALIZER_READY))
    }

    #buildScene() {
        this.#scene = new Scene()
        this.#scene.add(new AmbientLight(0x96DCBE))

        this.#camera = new PerspectiveCamera()
        this.#camera.aspect = window.innerWidth / window.innerHeight
        this.#camera.updateProjectionMatrix()
        this.#camera.position.z = 50

        this.#renderer = new WebGLRenderer({canvas: this})
        this.#renderer.setSize(window.innerWidth, window.innerHeight)

        this.#trackball = new TrackballControls(this.#camera, this)
        this.#fly = new FlyControls(this.#camera, this)

        this.#graph = new ThreeForceGraph()
            .nodeRelSize(5)
            //.nodeResolution(1)
            .nodeThreeObjectExtend(true)
            .nodeThreeObject((d) => new SpriteText(d.label, 5, "lightgrey"))
            .linkThreeObject((d) => d.sprite = new SpriteText(d.label, 5, "lightgrey"))
            .linkWidth(2)
            .linkThreeObjectExtend(true)
            .linkPositionUpdate((obj, {start, end}) => Object.assign(
                obj.position,
                ...["x", "y", "z"].map(dimension => (
                    {
                        [dimension]: start[dimension] + (end[dimension] - start[dimension]) / 2
                    }))))
            .linkDirectionalArrowLength(8)
            .linkDirectionalArrowRelPos(1)
            .linkDirectionalParticles(2)
            .linkDirectionalParticleSpeed(0.001)
        this.#scene.add(this.#graph)
        this.#camera.lookAt(this.#graph.position)

        this.#animateGraph.call(this)
    }

    set value(d) {
        this.#graph.graphData(d)
    }

    #animateGraph() {
        requestAnimationFrame(this.#animateGraph.bind(this))

        this.#graph.tickFrame()

        if (this.#shift) {
            this.#fly.update(1)
        } else {
            this.#trackball.update()
        }

        this.#graph.graphData().links.forEach(this.#rotateLinkSprites, this)

        this.#renderer.render(this.#scene, this.#camera)
    }

    // TODO: Why is rotation slightly off with non-square window?
    #rotateLinkSprites(link) {
        if ("id" in link.source) {
            const source = link.source
            const target = link.target

            const start = new Vector3(source.x, source.y, source.z).project(this.#camera)
            const end = new Vector3(target.x, target.y, target.z).project(this.#camera)
            const delta = end.sub(start)

            link.sprite.material.rotation = Math.atan(delta.y / delta.x)
        }
    }

    #onResize() {
        this.#camera.aspect = window.innerWidth / window.innerHeight
        this.#camera.updateProjectionMatrix()
        this.#renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // TODO: Sync cameras on switch
    #onKeydown(e) {
        if (e.shiftKey) {
            this.#shift = !this.#shift
        }
    }
}