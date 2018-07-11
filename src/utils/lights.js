import * as THREE from 'three'

export default function lightCircle({ colors, scene, help = false, distance = 50, intensity = 1, r = 1 }) {
    if (!scene) return false
    return colors.map((color, i, list) => {
        const t = i / list.length
        const startAngle = Math.PI / 2
        const angle = (Math.PI * 2 * t) + startAngle
        const pointLight = new THREE.PointLight(color, intensity, distance)
        pointLight.position.x = Math.cos(angle) * r
        pointLight.position.y = Math.sin(angle) * r
        pointLight.position.z = 10
        if (help) {
            const helper = new THREE.PointLightHelper(pointLight, r)
            scene.add(helper)
        }
        scene.add(pointLight)
        return pointLight
    })
}
