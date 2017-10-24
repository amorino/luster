import * as THREE from 'three'
import Display from 'display/display'

import factory from 'assets/images/factory.jpg'
import lightCircle from 'utils/lights'
import FogScene from 'core/scenes/FogScene'

import FX from 'post/fx'

import fragmentShader from '../shaders/glsl/ice.frag'
import vertexShader from '../shaders/glsl/ice.vert'

export default class World {
  constructor(container) {
    this.display = new Display({
      container,
    })
  }

  init() {
    this
      ._setupRenderer()
      ._setupLights()
      ._setupFX()
      ._setupScenes()
      ._loadTextures()
  }

  destroy() {
    const { display } = this
    display.destroy()
  }

  _setupRenderer() {
    const { renderer } = this.display

    renderer.gammaFactor = 2.2
    renderer.gammaOutput = false
    renderer.gammaInput = false
    renderer.sortObjects = false

    return this
  }

  _setupFX() {
    const { display } = this
    const { events } = display

    this.fx = new FX(display)
    events.render.add(this.fx.update)

    return this
  }

  _setupScenes() {
    const { scene, events } = this.display
    const fog = new FogScene(this.display)
    scene.add(fog)
    events.render.add(fog.update)

    return this
  }

  _loadTextures() {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(factory, this._setCube)

    return this
  }

  _setupLights() {
    const { scene } = this.display
    this.pointLights = lightCircle({ colors: ['#ff0000', '#ff00ff', '#ff0000'], scene, help: true })
    return this
  }

  _setCube = () => {
    const { scene, events } = this.display

    const geometry = new THREE.BoxGeometry(1, 1, 1)

    const uniforms = Object.assign({},
      THREE.ShaderLib.standard.uniforms, {
        time: { type: 'f', value: 0 },
        thicknessMap: { type: 't', value: new THREE.Texture() },
        thicknessRepeat: { type: 'v3', value: new THREE.Vector2() },
        thicknessPower: { type: 'f', value: 20 },
        thicknessScale: { type: 'f', value: 4 },
        thicknessDistortion: { type: 'f', value: 0.185 },
        thicknessAmbient: { type: 'f', value: 0.0 },
      }
    )

    const material = new THREE.MeshStandardMaterial()
    material.uniforms = uniforms

    material.vertexShader = vertexShader
    material.fragmentShader = fragmentShader

    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const rotate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
    }

    events.render.add(rotate)
  }

}
