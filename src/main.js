// @flow

import 'sanitize.css/sanitize.css'
import World from './engine/luster'

const container = document.getElementById('app')
const world = new World(container)
world.init()
