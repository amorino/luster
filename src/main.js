import 'sanitize.css/sanitize.css'
import Modernizr from 'modernizr'

import World from 'engine/world'

console.info(Modernizr)

const container = document.getElementById('app')
const world = new World(container)
world.init()
