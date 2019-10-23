import * as THREE from 'three'

export default class Scene extends THREE.Scene {
    constructor() {
        super()
        this._setup()
    }

    _setup() {
        this
            ._setupSkybox()
            ._updateFog()
    }
}
