import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight
} from "three"
import { FlyControls } from "three/examples/jsm/controls/FlyControls"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
import ThreeForceGraph from "three-forcegraph"
import SpriteText from "three-spritetext"

import type RdfGraphData from "./RdfGraphData"
import type RdfNodeObject from "./RdfNodeObject"
import type RdfLinkObject from "./RdfLinkObject"

export default class Visualizer extends HTMLCanvasElement {
    static ELEMENT_NAME = "x-visualizer"
    static VISUALIZER_READY = "visualizer-ready"

    private graph: ThreeForceGraph
    private camera: PerspectiveCamera
    private renderer: WebGLRenderer
    private scene: Scene
    private trackball: TrackballControls
    private fly: FlyControls
    private shift = false

    connectedCallback(): void {
        this.buildScene()

        window.addEventListener("resize", this.onResize.bind(this))
        window.addEventListener("keydown", this.onKeydown.bind(this))

        this.dispatchEvent(new CustomEvent(Visualizer.VISUALIZER_READY))
    }

    private buildScene(): void {
        this.scene = new Scene()
        this.scene.add(new AmbientLight(0x96DCBE))

        this.camera = new PerspectiveCamera()
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.camera.position.z = 50

        this.renderer = new WebGLRenderer({ canvas: this })
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.trackball = new TrackballControls(this.camera, this)
        this.fly = new FlyControls(this.camera, this)

        this.graph = new ThreeForceGraph()
            .nodeRelSize(5)
            //.nodeResolution(1)
            .nodeThreeObjectExtend(true)
            .nodeThreeObject((d: RdfNodeObject) => new SpriteText(d.label, 5, "lightgrey"))
            .linkThreeObject((d: RdfLinkObject) => new SpriteText(d.label, 5, "lightgrey"))
            .linkWidth(2)
            .linkThreeObjectExtend(true)
            .linkPositionUpdate((obj, { start, end }) => Object.assign(
                obj.position,
                ...["x", "y", "z"].map(dimension => (
                    {
                        [dimension]: start[dimension] + (end[dimension] - start[dimension]) / 2
                    }))))
            .linkDirectionalArrowLength(8)
            .linkDirectionalArrowRelPos(1)
            .linkDirectionalParticles(2)
            .linkDirectionalParticleSpeed(0.001)
        this.scene.add(this.graph)
        this.camera.lookAt(this.graph.position)

        this.animateGraph.call(this)
    }

    set value(d: RdfGraphData) {
        this.graph.graphData(d)
    }

    private animateGraph(): void {
        requestAnimationFrame(this.animateGraph.bind(this))

        this.graph.tickFrame()

        if (this.shift) {
            this.fly.update(1)
        }
        else {
            this.trackball.update()
        }

        this.renderer.render(this.scene, this.camera)
    }

    private onResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // TODO: Sync cameras on switch
    private onKeydown(e: KeyboardEvent): void {
        if (e.shiftKey) {
            this.shift = !this.shift
        }
    }
}
