import isMobile from 'ismobilejs'

export default function getContext(renderer) {
  const useHalfFloat = !isMobile.phone
  const floatBufferType = renderer.extensions.get('OES_texture_half_float') && useHalfFloat
  const floatBufferDefine = {}

  if (floatBufferType) {
    floatBufferDefine.FLOAT_BUFFER = ''
  }

  return {
    floatBufferType,
    floatBufferDefine
  }
}
