import Display from '../display/display'
import lightCircle from '../utils/lights'
import TeapotScene from '../core/scenes/TeapotScene'
import FX from '../post/fx'

export default class World {
    constructor(container) {
        this.display = new Display({
            container,
        })
    }

    init() {
        this
            ._setupRenderer()
            ._setupLights()
            ._setupFX()
            ._setupScenes()
    }

    destroy() {
        const { display } = this
        display.destroy()
    }

    _setupRenderer() {
        const { renderer } = this.display

        renderer.gammaFactor = 2.2
        renderer.gammaOutput = true
        renderer.gammaInput = true
        renderer.sortObjects = false

        return this
    }

    _setupFX() {
        const { display } = this
        const { events } = display

        this.fx = new FX(display)
        events.render.add(this.fx.update)

        return this
    }

    _setupScenes() {
        const { scene, events } = this.display
        const teapotScene = new TeapotScene(this.display)
        teapotScene.scale.set(10, 10, 10)
        scene.add(teapotScene)
        events.render.add(teapotScene.update)
        return this
    }

    _setupLights() {
        const { scene } = this.display
        this.pointLights = lightCircle({ colors: ['#ff0000', '#ff00ff', '#ff0000'], scene, help: true })
        return this
    }
}
