import * as THREE from 'three'
import NukePass from '../../post/nukepass'
import vertexShader from '../glsl/fxaa.vert'
import fragmentShader from '../glsl/fxaa.frag'

export default class FXAA extends NukePass {
    constructor(options = {}) {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                resolution: { type: 'v2', value: options.resolution || new THREE.Vector2() }
            },
        })
    }
}
