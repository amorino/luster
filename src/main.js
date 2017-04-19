import 'sanitize.css/sanitize.css'
import Modernizr from 'modernizr'
import * as THREE from 'three'
import Renderer from 'display/renderer'
import vert from 'assets/shaders/vert.vert'
import frag from 'assets/shaders/frag.frag'
import factory from 'assets/images/factory.jpg'

console.info(Modernizr)

const container = document.getElementById('app')

const app = new Renderer({
  clearColor: 'rgb(40, 40, 40)',
  container,
})

const { renderer, camera, scene, events } = app

renderer.shadowMap.enabled = true
renderer.shadowMapSoft = true

renderer.shadowCameraNear = 3
renderer.shadowCameraFar = camera.far
renderer.shadowCameraFov = 75
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.shadowMapBias = 0.0039
renderer.shadowMapDarkness = 0.5
renderer.shadowMapWidth = 1024
renderer.shadowMapHeight = 1024

const geometry = new THREE.BoxGeometry(1, 1, 1)
const textureLoader = new THREE.TextureLoader()

textureLoader.load(factory, (texture) => {
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      iChannel0: { type: 't', value: texture },
      iGlobalTime: { type: 'f', value: 0 },
    },
    defines: {
      USE_MAP: '',
    }
  })

  const cube = new THREE.Mesh(geometry, mat)
  scene.add(cube)

  const rotate = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }

  events.render.add(rotate)
})
