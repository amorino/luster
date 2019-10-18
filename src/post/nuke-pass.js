import { Pass } from 'postprocessing'
import overlay from '../assets/images/overlay.jpg'
import { getTexture } from '../utils/3d'
import DOF from '../shaders/passes/dof'

class NukePass extends Pass {
    constructor() {
        super('NukePass')
        this.setFullscreenMaterial(new DOF())
    }

    render(renderer, inputBuffer, outputBuffer, depthRenderTarget) {
        const material = this.getFullscreenMaterial()
        material.uniforms.tDiffuse.value = inputBuffer.texture
        material.uniforms.tDepth.value = depthRenderTarget.texture
        material.uniforms.dirtMap.value = getTexture(overlay)
        material.uniforms.enableBlend.value = 1.0
        material.uniforms.enabled.value = 1.0

        renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer)
        renderer.render(this.scene, this.camera)
    }
}

export default NukePass
