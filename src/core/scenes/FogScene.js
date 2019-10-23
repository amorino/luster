import * as THREE from 'three'
import FogShader from '../../shaders/materials/FogShader'

export default class FogScene extends THREE.Object3D {
    constructor(app) {
        super()
        this.app = app
        this.fogStrength = 0.03
        this.emissiveFactor = 1.5
        this.emission = 3
        this.sideCountList = [3, 4, 5, 6]
        this.rotationOffset = 0
        this.tubeSpawnTime = 0
        this.cubeSpawnTime = 0
        this.tubeSpawnMin = 0.1
        this.tubeSpawnMax = 0.35
        this.sideTime = 0
        this.sideDelay = 6
        this.currentSideIndex = 0
        const [currentSideCount] = this.sideCountList
        this.currentSideCount = currentSideCount
        this._setup()
    }

    _setup() {
        this
            ._setupLights()
            ._setupSkybox()
            ._updateFog()
    }

    _setupLights() {
        this.pointLights = ['#fff'].map((color, i, list) => {
            // const t = i / list.length
            // const startAngle = Math.PI / 2
            // const angle = (Math.PI * 2 * t) + startAngle

            const intensity = 1
            const distance = 50
            const pointLight = new THREE.PointLight(color, intensity, distance)
            const helper = new THREE.PointLightHelper(pointLight, 1)
            // const r = 3
            // pointLight.position.x = Math.cos(angle) * r;
            // pointLight.position.y = Math.sin(angle) * r;
            pointLight.position.z = -2
            this.add(helper)
            this.add(pointLight)
            return pointLight
        })

        return this
    }

    _setupSkybox() {
        const skyGeometry = new THREE.IcosahedronGeometry(20, 1)
        const skyMaterial = new FogShader({
            // depthTest: false,
            // depthWrite: false,
            // wireframe: true,
            // envMap: this.envMap,
            side: THREE.FrontSide,
            diffuse: 0,
            renderer: this.app.renderer
            // shading: THREE.FlatShading,
        })

        const skyBox = new THREE.Mesh(skyGeometry, skyMaterial)
        skyBox.scale.x *= -1
        this.skyBox = skyBox
        this.add(skyBox)

        return this
    }

    _updateFog = () => {
        const pointLight = this.pointLights[0]
        pointLight.updateMatrixWorld()

        const { camera } = this.app
        camera.updateMatrixWorld()
        this.traverse((child) => {
            if (!child.material || !child.material.uniforms) return
            if (child.material.uniforms.cameraMatrixWorld) {
                child.material.uniforms.cameraMatrixWorld.value.copy(camera.matrixWorld)
            }
            if (child.material.uniforms.fogLightStrength) {
                child.material.uniforms.fogLightStrength.value = this.fogStrength * this.emission
            }
            if (child.material.uniforms.cameraWorldPosition) {
                child.material.uniforms.cameraWorldPosition.value.setFromMatrixPosition(camera.matrixWorld)
            }
            if (child.material.uniforms.pointLightPosition) {
                child.material.uniforms.pointLightPosition.value.setFromMatrixPosition(pointLight.matrixWorld)
            }
            if (child.material.uniforms.pointLightDiffuse) {
                const I = pointLight.color.r * pointLight.intensity
                child.material.uniforms.pointLightDiffuse.value = I
            }
        })
    }

    update = () => {
        this._updateFog()
    }
}
