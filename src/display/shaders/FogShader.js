import * as THREE from 'three'
import vertexShader from 'assets/shaders/fog/fog.vert'
import fragmentShader from 'assets/shaders/fog/fog.frag'
import defined from 'defined'
import injectDefines from 'glsl-inject-defines'
import getContext from 'utils/context'

export default class FogShader extends THREE.ShaderMaterial {
  constructor(options) {
    const context = getContext(options.renderer)
    const { floatBufferDefine, floatBufferType } = context
    const fragmentShaderDefined = injectDefines(fragmentShader, floatBufferDefine)

    super({
      vertexShader,
      fragmentShader: fragmentShaderDefined,
      blending: THREE.NoBlending,
      transparent: !floatBufferType,
      uniforms: {
        cameraWorldPosition: { type: 'v3', value: new THREE.Vector3() },
        pointLightPosition: { type: 'v3', value: new THREE.Vector3() },
        pointLightDiffuse: { type: 'f', value: 1 },
        fogLightStrength: { type: 'f', value: 0.0 },
        diffuse: { type: 'f', value: defined(options.diffuse, 1) }
      }
    })
  }
}
