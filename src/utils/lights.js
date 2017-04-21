import * as THREE from 'three'

export default function lightCircle(lights, scene, help = false) {
  return lights.map((color, i, list) => {
    const t = i / list.length
    const startAngle = Math.PI / 2
    const angle = (Math.PI * 2 * t) + startAngle
    const intensity = 1
    const distance = 10
    const pointLight = new THREE.PointLight(color, intensity, distance)
    const r = 3
    pointLight.position.x = Math.cos(angle) * r
    pointLight.position.y = Math.sin(angle) * r
    pointLight.position.z = -2

    if (help) {
      const helper = new THREE.PointLightHelper(pointLight, 1)
      scene.add(helper)
    }

    scene.add(pointLight)
    return pointLight
  })
}
