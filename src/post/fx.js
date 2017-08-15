import * as THREE from 'three'
import Nuke from 'post/nuke'
import FXAA from 'post/passes/fxaa'
import DOF from 'post/passes/dof'
import SSAO from 'post/passes/ssao'
import { ShaderPass, CopyShader } from 'three-effectcomposer-es6'

export default class FX {
  constructor(display) {
    if (!display.renderer) console.error('FX :: Must define a renderer')
    this.display = display
    this._init()
  }
  _init() {
    this
        ._setupNuke()
        ._setupPasses()
  }

  _setupNuke() {
    const { renderer, size, camera, scene } = this.display
    this.nuke = new Nuke({ renderer, camera, size, scene })
    return this
  }

  _setupPasses() {
    const { nuke } = this
    const { size, camera } = this.display

    const parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }
    this.depthRenderTarget = new THREE.WebGLRenderTarget(size.width, size.height, parameters)

    const SAOOShader = SSAO
    this.ssaoPass = new ShaderPass(SAOOShader)
    nuke.add(this.ssaoPass)
    this.ssaoPass.uniforms.tDepth.value = this.depthRenderTarget.texture
    this.ssaoPass.uniforms.size.value.set(size.width, size.height)
    this.ssaoPass.uniforms.cameraNear.value = camera.near
    this.ssaoPass.uniforms.cameraFar.value = camera.far
    this.ssaoPass.uniforms.onlyAO.value = 0
    this.ssaoPass.uniforms.aoClamp.value = 3.0
    this.ssaoPass.uniforms.lumInfluence.value = 0.8

    const FXAAShader = new FXAA()
    this.fxaaPass = new ShaderPass(FXAAShader)
    nuke.add(this.fxaaPass)
    this.fxaaPass.uniforms.resolution.value.set(size.width, size.height)

    const DOFShader = new DOF({ size })
    this.dofPass = new ShaderPass(DOFShader)
    nuke.add(this.dofPass)
    this.dofPass.uniforms.resolution.value.set(size.width, size.height)

    const copyPass = new ShaderPass(CopyShader)
    nuke.add(copyPass)

    return this
  }

  update = () => {
    const { nuke, depthRenderTarget } = this
    nuke.update(depthRenderTarget)
  }
}
