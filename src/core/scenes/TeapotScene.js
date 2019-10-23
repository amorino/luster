import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import Scene from '../../engine/scene'
const lm = 'https://rawcdn.githack.com/kevinshane/gltf/110edeb1c25187f626ac02a01c825ed094867ed6/teapot/LM.png'
const tea = 'https://rawcdn.githack.com/kevinshane/gltf/110edeb1c25187f626ac02a01c825ed094867ed6/teapot/tea.gltf'

export default class TeapotScene extends THREE.Object3D {
    constructor(display) {
        super()
        this.display = display
        this.animate = false
        this._setup()
    }

    _setup() {
        this
            ._setupAssets().then(this._setCube)
    }

    _setupAssets = () => {
        this.assets = new Map()
        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)
        const gltfLoader = new GLTFLoader(loadingManager)

        return new Promise((resolve, reject) => {
            loadingManager.onError = reject
            loadingManager.onProgress = (item, loaded, total) => {
                if (loaded === total) {
                    resolve()
                }
            }

            gltfLoader.load(tea, (gltf) => {
                this.assets.set('gltf-scene', gltf.scene)
            })

            textureLoader.load(lm, (texture) => {
                this.assets.set('lightmap', texture)
            })
        })
    }

    _setCube = () => {
        this.gltfScene = this.assets.get('gltf-scene')
        this.gltfScene.traverse((node) => {
            if (node.isMesh) {
                const { material } = node
                material.envMap = null
                material.envMapIntensity = 1
                material.roughness = 0
                material.metalness = 0
                material.lightMap = this.assets.get('lightmap')
                material.lightMapIntensity = 1
            }
        })
        this.add(this.gltfScene)
    }

    update = () => {
        if (this.gltfScene && this.animate) {
            this.gltfScene.rotation.x += 0.01
            this.gltfScene.rotation.y += 0.01
        }
    }
}
