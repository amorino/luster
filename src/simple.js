import * as THREE from 'three'
import orbitViewer from 'three-orbit-viewer'
import vert from 'assets/shaders/vert.vert'
import frag from 'assets/shaders/frag.frag'
import factory from 'assets/images/factory.jpg'

const createOrbitViewer = orbitViewer(THREE)

const app = createOrbitViewer({
  clearColor: 'rgb(40, 40, 40)',
  clearAlpha: 1.0,
  fov: 65,
  position: new THREE.Vector3(0.85, 1, -1.5),
})

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
  const geo = new THREE.BoxGeometry(1, 0.75, 1)
  const box = new THREE.Mesh(geo, mat)

  box.visible = false
  box.rotation.y = -Math.PI

  app.scene.add(box)

  box.visible = true
})

// let time = 0
app.on('tick', (dt) => {
  // time += dt / 1000
})
