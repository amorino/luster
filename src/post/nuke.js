import EffectComposer, { RenderPass } from 'three-effectcomposer-es6'
import { remove } from 'lodash'
import * as THREE from 'three'

export default class Nuke {
    constructor({ renderer, scene, camera, size }) {
        if (!renderer) {
            console.error('Nuke :: Must define renderer')
        }

        this.renderer = renderer
        this.scene = scene
        this.camera = camera
        this.size = size
        this._init()
    }

    _init() {
        const { renderer, scene, camera, size } = this
        renderer.nuke = true

        const parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false }
        this.renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, parameters)

        // Setup depth pass
        this.depthMaterial = new THREE.MeshDepthMaterial()
        this.depthMaterial.depthPacking = THREE.RGBADepthPacking
        this.depthMaterial.blending = THREE.NoBlending

        // Setup the Effect Composer and add the RenderPass from the scene
        this.composer = new EffectComposer(renderer)
        this.composer.addPass(new RenderPass(scene, camera))
    }

    update = (renderTarget) => {
        const { composer, renderer, scene, camera, depthMaterial } = this
        if (composer.passes.length > 0) {
            scene.overrideMaterial = depthMaterial
            renderer.render(scene, camera, renderTarget, true)
            scene.overrideMaterial = null
            composer.render()
        } else {
            renderer.render(scene, camera)
        }
    }

    add = (pass) => {
        const { composer } = this
        composer.passes.forEach((p) => { p.renderToScreen = false })
        pass.renderToScreen = true
        composer.addPass(pass)
    }

    remove = (pass) => {
        const { composer } = this
        remove(composer.passes, a => a === pass)
        composer.passes.forEach((p) => { p.renderToScreen = false })
        composer.passes[composer.passes.length - 1].renderToScreen = true
    }

}
