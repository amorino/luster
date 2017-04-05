import OrbitControls from 'orbit-controls'
import * as THREE from 'three'
import Signal from 'signals'

export default class App {
  constructor({
    container,
    fov = 75,
    near = 0.1,
    far = 1000,
    clearColor = 0x000000,
    clearAlpha = 0,
    target = new THREE.Vector3(),
    position = new THREE.Vector3(0, 0, 5)
  }) {
    if (!container) {
      console.error('You must pass a "container" DOM element')
      return false
    }

    this.events = {
      render: new Signal(),
      resize: new Signal(),
    }

    this.dpr = Math.min(1.5, window.devicePixelRatio)

    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
    }

    this.camera = new THREE.PerspectiveCamera(fov, this.size.aspect, near, far)
    this.target = target
    this.position = position

    const options = {
      antialias: true,
    }

    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer(options)

    this.renderer.setClearColor(clearColor, clearAlpha)

    container.appendChild(this.renderer.domElement)

    this.init()
  }

  init() {
    const { camera, scene, renderer, size, resize, _render, position, target } = this

    renderer.setPixelRatio(this.dpr)
    renderer.setSize(size.width, size.height)

    camera.position.copy(position)
    camera.lookAt(target)

    scene.add(camera)

    this.controls = new OrbitControls({
      position: [camera.position.x, camera.position.y, camera.position.z],
    })

    window.addEventListener('resize', resize)

    _render()
  }

  resize = () => {
    const { size, renderer, events } = this
    size.width = window.innerWidth
    size.height = window.innerHeight
    events.resize.dispatch(size)
    renderer.setSize(size.width, size.height)
    this._updateProjectionMatrix()
  }

  _render = () => {
    const { renderer, camera, scene, events, _render } = this
    window.requestAnimationFrame(_render)
    events.render.dispatch()
    this._updateProjectionMatrix()
    renderer.render(scene, camera)
  }

  _updateProjectionMatrix() {
    const { size, controls, camera } = this
    size.width = window.innerWidth
    size.height = window.innerHeight
    size.aspect = size.width / size.height

    // update camera controls
    controls.update()
    camera.position.fromArray(controls.position)
    camera.up.fromArray(controls.up)
    camera.lookAt(this.target.fromArray(controls.direction))

    // Update camera matrices
    camera.aspect = size.aspect
    camera.updateProjectionMatrix()
  }

}
