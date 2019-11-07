import { Effect, EffectAttribute } from 'postprocessing'
import {
    Uniform,
} from 'three'
import fragmentShader from '../shaders/glsl/dof.frag'


export default class DofEffect extends Effect {
    constructor(texture) {
        super('DofEffect', fragmentShader, {
            attributes: EffectAttribute.DEPTH,
            uniforms: new Map([
                ['enabled', new Uniform(1.0)],
                ['enableBlend', new Uniform(1.0)],
                ['dirtMap', new Uniform(texture)],
                ['hover', new Uniform(1.0)]
            ])
        })
    }
}
