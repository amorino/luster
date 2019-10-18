import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import Signal from 'signals'

export default class Display {
    size = {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight,
        halfX: window.innerWidth / 2,
        helfY: window.innerHeight / 2,
    }

    rendererOptions = {
        antialias: false
    }

    nuke = false

    dpr = Math.min(1)

    constructor({
        container,
        fieldOfView = 30,
        near = 1,
        far = 50,
        clearColor = 0x0,
        clearAlpha = 1,
        target = new THREE.Vector3(),
        position = new THREE.Vector3(0, 0, 5)
    }) {
        if (!container) {
            console.error('Display :: Must define a container DOM element')
        }

        // Create main events
        this.events = {
            render: new Signal(),
            resize: new Signal(),
        }

        this.clearColor = clearColor
        this.clearAlpha = clearAlpha

        this.fieldOfView = fieldOfView
        this.near = near
        this.far = far

        this.target = target
        this.position = position

        // Camera
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.size.aspect, this.near, this.far)

        // Renderer
        this.renderer = new THREE.WebGLRenderer(this.rendererOptions)
        this.renderer.setClearColor(this.clearColor, this.clearAlpha)

        // Main Scene
        this.scene = new THREE.Scene()

        // Append the canvas
        container.appendChild(this.renderer.domElement)

        // Time utils
        this.lastFrameTime = 0
        this.residual = 0
        this.lastTime = Date.now()

        // Return time variables
        this.deltaTime = 0
        this.timestamp = 0

        this._init()
    }

    destroy = () => {
        const { render, events, _resize } = this
        window.cancelAnimationFrame(render)
        window.removeEventListener('resize', _resize)
        this.renderer.clear()
        this.scene = null
        this.camera = null
        this.controls = null
        this.renderer = null
        events.render.dispose()
        events.resize.dispose()
    }

    _init() {
        const { camera, scene, renderer, size, position, target } = this
        const { _resize, _render } = this

        renderer.setPixelRatio(this.dpr)
        renderer.setSize(size.width, size.height)

        renderer.nuke = false

        camera.position.copy(position)
        camera.lookAt(target)
        scene.add(camera)

        this.controls = new OrbitControls(camera, renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        window.addEventListener('resize', _resize)
        _render()
    }

    _resize = () => {
        const { size, renderer, events } = this
        size.width = window.innerWidth
        size.height = window.innerHeight
        size.aspect = size.width / size.height
        size.halfX = size.width / 2
        size.halfY = size.height / 2

        events.resize.dispatch(size)
        renderer.setSize(size.width, size.height)
    }

    _render = () => {
        const { renderer, camera, scene, events } = this
        let { timestamp, deltaTime, lastTime } = this
        const { _render } = this

        this.render = window.requestAnimationFrame(_render)

        const time = Date.now()
        timestamp = time - lastTime
        deltaTime = this._deltaTime(timestamp)

        this._updateProjectionMatrix()

        events.render.dispatch(timestamp, deltaTime)
        lastTime = time

        if (!renderer.nuke) renderer.render(scene, camera)
    }

    _updateProjectionMatrix() {
        const { size, camera } = this

        camera.aspect = size.aspect
        camera.updateProjectionMatrix()
    }

    _deltaTime(timestamp) {
        let deltaTime = timestamp - this.lastFrameTime
        this.lastFrameTime = timestamp
        deltaTime += this.residual
        this.residual = deltaTime / 1000
        deltaTime -= this.residual
        return deltaTime
    }
}
