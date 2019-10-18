import * as THREE from 'three'
import NukeShader from '../../post/nuke-shader'
import fragmentShader from '../glsl/dof.frag'

export default class DOF extends NukeShader {
    constructor() {
        super({
            fragmentShader,
            uniforms: {
                tDepth: { type: 't', value: null },
                resolution: { type: 'v2', value: new THREE.Vector2() },
                enabled: { type: 'f', value: 1.0 },
                enableBlend: { type: 'f', value: 1.0 },
                dirtMap: { type: 't', value: null },
                hover: { type: 'f', value: 1.0 },
            }
        })
    }
}
