import * as THREE from 'three'

export function getTexture(path) {
  const img = new Image()
  img.crossOrigin = ''
  img.src = path
  const texture = new THREE.Texture(img)
  img.onload = () => {
    texture.needsUpdate = true
    if (texture.onload) {
      texture.onload()
      texture.onload = null
    }
    if (!THREE.Math.isPowerOfTwo(img.width * img.height)) {
      texture.minFilter = THREE.LinearFilter
    }
  }
  return texture
}

export function toRadians(deg) {
  return deg * (Math.PI / 180)
}

export function toDegrees(rad) {
  return rad * (180 / Math.PI)
}

export function toHex(n) {
  n = parseInt(n, 10)
  if (isNaN(n)) {
    return '00'
  }
  n = Math.max(0, Math.min(n, 255))
  return '0123456789ABCDEF'.charAt((n - n % 16) / 16) + '0123456789ABCDEF'.charAt(n % 16)
}

export function lerp(ratio, start, end) {
  return start + (end - start) * ratio
}

export function rand(min, max) {
  return lerp(Math.random(), min, max)
}

export function doRandom(min, max) {
  return Math.round(rand(min - 0.5, max + 0.5))
}

export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

export function range(oldValue, oldMin, oldMax, newMin, newMax, clamped) {
  const oldRange = (oldMax - oldMin)
  const newRange = (newMax - newMin)
  const newValue = (((oldValue - oldMin) * newRange) / oldRange) + newMin
  if (clamped) return clamp(newValue, newMin, newMax)
  return newValue
}

export function randomSpherePoint({ x, y, z }, radius) {
  const u = Math.random()
  const v = Math.random()
  const phi = (Math.PI * 2) * u
  const theta = Math.acos(2 * v - 1)
  return new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, phi, theta))
}

export function sphereCoords(radius, lat, azimut){
  const theta = lat * (Math.PI / 180)
  const phi = azimut * (Math.PI / 180)
  return new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, phi, theta))
}
