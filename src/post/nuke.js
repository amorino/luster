import EffectComposer, { RenderPass } from 'three-effectcomposer-es6'
import { remove } from 'lodash'
import * as THREE from 'three'

export default class Nuke {
    renderTargetParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false,
    }

    depthParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter
    }

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
        const { renderer, scene, camera, size, renderTargetParameters, depthParameters } = this
        renderer.nuke = true

        this.renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, renderTargetParameters)
        this.quarterRenderTarget = new THREE.WebGLRenderTarget(size.width * 0.25, size.height * 0.25, renderTargetParameters)
        this.depthRenderTarget = new THREE.WebGLRenderTarget(size.width, size.height, depthParameters)

        // Setup depth pass
        this.depthMaterial = new THREE.MeshDepthMaterial()
        this.depthMaterial.depthPacking = THREE.RGBADepthPacking
        this.depthMaterial.blending = THREE.NoBlending

        // Setup the Effect Composer and add the RenderPass from the scene
        this.composer = new EffectComposer(renderer, this.renderTarget)
        this.composer.addPass(new RenderPass(scene, camera))
    }

    update = () => {
        const { composer, renderer, scene, camera, renderTarget, depthMaterial } = this
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
        composer.passes[composer.passes.length - 1].renderToScreen = true
        composer.addPass(pass)
    }

    remove = (pass) => {
        const { composer } = this
        remove(composer.passes, a => a === pass)
        composer.passes.forEach((p) => { p.renderToScreen = false })
        composer.passes[composer.passes.length - 1].renderToScreen = true
    }
}
