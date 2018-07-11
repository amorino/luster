import * as THREE from 'three'
import bubblegumImg from '../../assets/images/bubblegum.png'

export default class Bubblegum extends THREE.Object3D {
    constructor(display) {
        super()
        this.app = display
        this.geometry = null
        this._setup()
    }

    _setup() {
        this
            ._setupTextures()
    }

    _setupTextures = () => {
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(bubblegumImg, this._setupGeometry)

        return this
    }

    _setupGeometry = () => {
        this.geometry = new THREE.PlaneGeometry(5, 20, 32)
        return this
    }

    updateGeometry = () => {

    }

    update = () => {
        this.updateGeometry()
    }
}
