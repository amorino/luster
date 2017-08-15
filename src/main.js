import 'sanitize.css/sanitize.css'
import Modernizr from 'modernizr'

import World from 'engine/luster'

console.warn('>> modernizr', Modernizr)

const container = document.getElementById('app')
const world = new World(container)
world.init()
