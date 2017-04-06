// #extension GL_OES_standard_derivatives : enable

varying vec3 vNorm;
varying vec2 vUv;
uniform float iGlobalTime;
uniform sampler2D iChannel0;

#define TEXEL_SIZE 1.0/512.0

vec3 sample(vec2 uv);
#pragma glslify: blur = require('glsl-hash-blur', sample=sample, iterations=10)

vec3 sample(vec2 uv) {
  return texture2D(iChannel0, uv).rgb;
}

void main() {
  vec3 colorA = vNorm * 0.5 + 0.5;

  float dist = length(vUv - 0.5);
  float falloff = smoothstep(0.3, 0.7, dist);
  float radius = TEXEL_SIZE * 40.0;
  radius *= falloff;
  vec3 colorB = blur(vUv, radius, 1.0);

  //mix the two
  float blend = smoothstep(0.0, 0.7, vNorm.z);
  gl_FragColor.rgb = mix(colorA, colorB, blend);
  gl_FragColor.a = 1.0;
}
