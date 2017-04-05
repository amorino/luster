import OrbitControls from 'orbit-controls'
import * as THREE from 'three'
import Signal from 'signals'

export default class ThreeApp {
  constructor() {
    this.events = {
      render: new Signal(),
      resize: new Signal(),
    }
    this.canvas = document.getElementById('app')
    this.dpr = Math.min(1.5, window.devicePixelRatio)
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
    }
    this.camera = new THREE.PerspectiveCamera(75, this.size.aspect, 0.1, 1000)
    this.target = new THREE.Vector3()
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.init()
  }

  init() {
    const { camera, scene, renderer, size, resize, render } = this
    renderer.setPixelRatio(this.dpr)
    renderer.setSize(size.width, size.height)

    camera.position.z = 5
    scene.add(camera)

    this.controls = new OrbitControls({
      position: [camera.position.x, camera.position.y, camera.position.z],
    })

    window.addEventListener('resize', resize)

    render()
  }

  resize = () => {
    const { size, renderer, events } = this
    size.width = window.innerWidth
    size.height = window.innerHeight
    events.resize.dispatch(size)
    renderer.setSize(size.width, size.height)
    this._updateProjectionMatrix()
  }

  render = () => {
    const { renderer, camera, scene, events, render } = this
    window.requestAnimationFrame(render)
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
