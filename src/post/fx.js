import { ShaderPass, CopyShader } from 'three-effectcomposer-es6'

import Nuke from './nuke'
import FXAA from '../shaders/passes/fxaa'
import DOF from '../shaders/passes/dof'
import SSAO from '../shaders/passes/ssao'
import overlay from '../assets/images/overlay.jpg'
import { getTexture } from '../utils/3d'

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
    this
    ._setupNuke()
    ._setupPasses()
    ._setResolution()
    ._addPasses()
  }

  _setupNuke() {
    const { renderer, size, camera, scene } = this.display
    this.nuke = new Nuke({ renderer, camera, size, scene })
    return this
  }

  _setupPasses() {
    const { nuke, passes } = this
    const { size, camera } = this.display

    const FXAAShader = new FXAA()
    this.fxaaPass = new ShaderPass(FXAAShader)
    this.fxaaPass.active = true
    passes.push(this.fxaaPass)

    const DOFShader = new DOF({ size, camera })
    this.dofPass = new ShaderPass(DOFShader)
    this.dofPass.uniforms.tDepth.value = nuke.depthRenderTarget.texture
    this.dofPass.uniforms.dirtMap.value = getTexture(overlay)
    this.dofPass.uniforms.enableBlend.value = 1.0
    this.dofPass.uniforms.enabled.value = 1.0
    this.dofPass.active = true
    passes.push(this.dofPass)

    const SAOOShader = SSAO
    this.ssaoPass = new ShaderPass(SAOOShader)
    this.ssaoPass.uniforms.tDepth.value = nuke.depthRenderTarget.texture
    this.ssaoPass.uniforms.size.value.set(size.width, size.height)
    this.ssaoPass.uniforms.cameraNear.value = camera.near
    this.ssaoPass.uniforms.cameraFar.value = camera.far
    this.ssaoPass.uniforms.onlyAO.value = 0
    this.ssaoPass.uniforms.aoClamp.value = 3.0
    this.ssaoPass.uniforms.lumInfluence.value = 0.8
    this.ssaoPass.active = true
    passes.push(this.ssaoPass)

    return this
  }

  _setResolution() {
    const { passes } = this
    const { size } = this.display
    passes.forEach((pass) => {
      if (pass.uniforms.resolution) pass.uniforms.resolution.value.set(size.width, size.height)
    })

    return this
  }

  _addPasses() {
    const { nuke } = this
    this.passes.forEach((pass) => {
      if (pass.active) nuke.add(pass)
    })

    const copyPass = new ShaderPass(CopyShader)
    nuke.add(copyPass)

    return this
  }

  update = (t) => {
    const { nuke } = this
    nuke.update()
    this.passes.forEach((pass) => {
      if (pass.uniforms.time) pass.uniforms.time.value = t / 1000
    })
  }
}
