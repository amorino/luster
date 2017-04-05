import 'sanitize.css/sanitize.css'
import Modernizr from 'modernizr'
import * as THREE from 'three'
import ThreeApp from 'app'

console.info(Modernizr)

const app = new ThreeApp()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

const cube = new THREE.Mesh(geometry, material)
app.scene.add(cube)

const rotate = () => {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
}

app.events.render.add(rotate)
