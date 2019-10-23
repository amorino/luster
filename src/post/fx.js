import * as THREE from 'three'
import { EffectPass, SMAAEffect, ChromaticAberrationEffect, BrightnessContrastEffect } from 'postprocessing'
import Nuke from './nuke'
import DofEffect from '../effects/dof-effect'
import overlay from '../assets/images/overlay.jpg'

export default class FX {
    passes = []

    bokehParameters = {
        focus: 0.003,
        aperture: 1.6,
        maxblur: 0.0065,
        shape: 0.0
    }

    constructor(display) {
        if (!display.renderer) console.error('FX :: Must define a renderer')
        this.display = display
        this._init()
    }

    _init() {
        this._setupAssets().then(this._setup)
    }

    _setup = () => {
        this._setupNuke()
            ._setupPasses()
            ._addPasses()
    }

    _setupAssets = () => {
        this.assets = new Map()
        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)

        return new Promise((resolve, reject) => {
            loadingManager.onError = reject
            loadingManager.onProgress = (item, loaded, total) => {
                if (loaded === total) {
                    resolve()
                }
            }

            textureLoader.load(overlay, (texture) => {
                this.assets.set('overlay', texture)
            })

            const searchImage = new Image()
            const areaImage = new Image()

            searchImage.addEventListener('load', () => {
                this.assets.set('smaa-search', this)
                loadingManager.itemEnd('smaa-search')
            })

            areaImage.addEventListener('load', () => {
                this.assets.set('smaa-area', this)
                loadingManager.itemEnd('smaa-area')
            })

            loadingManager.itemStart('smaa-search')
            loadingManager.itemStart('smaa-area')

            searchImage.src = SMAAEffect.searchImageDataURL
            areaImage.src = SMAAEffect.areaImageDataURL
        })
    }

    _setupNuke = () => {
        const { renderer, size, camera, scene } = this.display
        this.nuke = new Nuke({ renderer, camera, size, scene })
        return this
    }

    _setupPasses = () => {
        const { camera } = this.display

        const smaaEffect = new SMAAEffect(
            this.assets.get('smaa-search'),
            this.assets.get('smaa-area')
        )
        smaaEffect.active = true
        const smaaPass = new EffectPass(camera, smaaEffect)
        this.passes.push(smaaPass)

        const dofEffect = new DofEffect(this.assets.get('overlay'))
        const dofPass = new EffectPass(camera, dofEffect)
        dofPass.active = true
        this.passes.push(dofPass)

        const chromaticAberrationEffect = new ChromaticAberrationEffect()
        const brightnessEffect = new BrightnessContrastEffect({ brightness: 0.1, contrast: 0.1 })

        const effectPass = new EffectPass(
            camera,
            brightnessEffect,
            chromaticAberrationEffect,
        )

        chromaticAberrationEffect.offset.multiplyScalar(2.0)
        effectPass.active = true
        this.passes.push(effectPass)
        return this
    }

    _addPasses = () => {
        const { nuke } = this
        this.passes.forEach((pass) => {
            if (pass.active) nuke.add(pass)
        })
        nuke.arrange()
        return this
    }

    update = (t, dt) => {
        const { nuke } = this
        if (nuke) {
            nuke.update(t, dt)
        }
    }
}
