import * as THREE from 'three'
import NukeShader from '../../post/nuke-shader'
import vertexShader from '../glsl/fxaa.vert'
import fragmentShader from '../glsl/fxaa.frag'


export default class FXAA extends NukeShader {
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
