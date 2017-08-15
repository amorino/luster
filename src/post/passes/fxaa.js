import * as THREE from 'three'
import vertexShader from 'shaders/glsl/fxaa/fxaa.vert'
import fragmentShader from 'shaders/glsl/fxaa/fxaa.frag'

export default class FXAA extends THREE.ShaderMaterial {
    constructor(options = {}) {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                tDiffuse: { type: 't', value: new THREE.Texture() },
                resolution: { type: 'v2', value: options.resolution || new THREE.Vector2() }
            },
        })
    }
}
