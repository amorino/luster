import OrbitControls from 'orbit-controls'
import * as THREE from 'three'

export default class App {
  constructor() {
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
  }

  init() {
    const { camera, scene, renderer, size } = this
    renderer.setPixelRatio(this.dpr)
    renderer.setSize(size.width, size.height)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

    this.cube = new THREE.Mesh(geometry, material)
    scene.add(this.cube)

    camera.position.z = 5
    scene.add(camera)

    this.controls = new OrbitControls({
      position: [camera.position.x, camera.position.y, camera.position.z],
    })

    window.addEventListener('resize', this.resize)

    this._render()
  }

  resize = () => {
    const { size, renderer } = this
    size.width = window.innerWidth
    size.height = window.innerHeight
    renderer.setSize(size.width, size.height)
    this._updateProjectionMatrix()
  }

  _render = () => {
    const { cube, renderer, _render, camera, scene } = this
    window.requestAnimationFrame(_render)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
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
