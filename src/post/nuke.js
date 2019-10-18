// import EffectComposer, { RenderPass } from '@johh/three-effectcomposer'
import { EffectComposer, RenderPass } from 'postprocessing'
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

        this.composer = new EffectComposer(renderer)
        this.composer.addPass(new RenderPass(scene, camera))
    }

    update = (t, dt) => {
        const { composer, renderer, scene, camera, depthMaterial } = this
        if (composer.passes.length > 0) {
            // scene.overrideMaterial = depthMaterial
            // scene.overrideMaterial = null
            // renderer.setRenderTarget(this.renderTarget)
            // renderer.render(scene, camera)
            composer.render(dt)
        }
    }

    add = (pass) => {
        const { composer } = this
        composer.addPass(pass)
    }

    remove = (pass) => {
        const { composer } = this
        remove(composer.passes, a => a === pass)
        composer.passes.forEach((p) => { p.renderToScreen = false })
        composer.passes[composer.passes.length - 1].renderToScreen = true
    }
}
