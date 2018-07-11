import * as THREE from 'three'

export default class NukePass extends THREE.ShaderMaterial {
    constructor({ uniforms, fragmentShader, vertexShader }) {
        super({
            vertexShader: vertexShader || 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }',
            fragmentShader,
            uniforms: { ...uniforms, tDiffuse: { type: 't', value: new THREE.Texture() }, }
        })
    }
}
