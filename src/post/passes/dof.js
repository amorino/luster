import * as THREE from 'three'
import fragmentShader from 'shaders/glsl/dof/dof.frag'
import overlay from 'assets/images/overlay.jpg'
import { getTexture, range } from 'utils/3d'

export default class DOF extends THREE.ShaderMaterial {
    constructor({ size, camera }) {
        super({
            vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }',
            fragmentShader,
            uniforms: {
                depthMat: {
                    type: 't',
                    value: null
                },
                resolution: {
                    type: 'v2',
                    value: new THREE.Vector2()
                },
                enabled: {
                    type: 'f',
                    value: 1
                },
                enableBlend: {
                    type: 'f',
                    value: 1
                },
                dirtMap: {
                    type: 't',
                    value: getTexture(overlay)
                },
                hover: {
                    type: 'f',
                    value: 1
                },
                tDiffuse: {
                    type: 't',
                    value: new THREE.Texture()
                },
            }
        })

        this.size = size
        this.camera = camera

        this._init()
    }

    _init() {
        const { size } = this

        const params = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false
        }

        this.renderTarget = new THREE.WebGLRenderTarget(size.width * 0.25, size.height * 0.25, params)
        this.uniforms.depthMat.value = this.renderTarget.texture
    }

    update = () => {
        const { camera } = this
        console.log(camera)
        const val = range(Math.abs(camera.zMove), 0, 200, 1, 0.75)
        this.a1 = this.a1 * Math.abs(val)
    }
}
