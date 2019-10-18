// import { ShaderPass } from '@johh/three-effectcomposer'
import { EffectPass, ShaderPass } from 'postprocessing'
import * as THREE from 'three'

import Nuke from './nuke'
import NukePass from './nuke-pass'
import FXAA from '../shaders/passes/fxaa'
import DOF from '../shaders/passes/dof'
import SSAO from '../shaders/passes/ssao'


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
        this.fxaaPass = null
        this.dofPass = null
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

        return this
    }

    _setResolution() {
        const { passes } = this
        const { size } = this.display

        return this
    }

    _addPasses() {
        const { nuke } = this
        this.passes.forEach((pass) => {
            if (pass.active) nuke.add(pass)
        })

        return this
    }

    update = (t, dt) => {
        const { nuke } = this
        nuke.update(t, dt)
        // this.passes.forEach((pass) => {
        //     if (pass.uniform.time) pass.uniform.time.value = t / 1000
        // })
    }
}
