uniform sampler2D dirtMap;
uniform float enabled;
uniform float enableBlend;
uniform float hover;

vec4 tunnelBlur(sampler2D texture, vec2 uv, float sampleDist, float strength) {
    float samples[8];
    samples[0] = -0.05;
    samples[1] = -0.03;
    samples[2] = -0.02;
    samples[3] = -0.01;
    samples[4] =  0.01;
    samples[5] =  0.02;
    samples[6] =  0.03;
    samples[7] =  0.05;

    vec2 dir = 0.5 - uv;
    float dist = sqrt(dir.x*dir.x + dir.y*dir.y);
    dir = dir / dist;

    vec4 texel = texture2D(texture, uv);
    vec4 sum = texel;

    for (int i = 0; i < 8; i++) {
        sum += texture2D(texture, uv + dir * samples[i] * sampleDist);
    }

    sum *= 1.0/8.0;
    float t = clamp(dist * strength, 0.0, 1.0);

    return mix(texel, sum, t);
}
float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    float oldRange = oldMax - oldMin;
    float newRange = newMax - newMin;
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
}

#define BlendOverlayf(base, blend) 		(base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)))
#define Blend(base, blend, funcf) 		vec4(funcf(base.r, blend.r), funcf(base.g, blend.g), funcf(base.b, blend.b), 1.0)
#define BlendOverlay(base, blend) 		Blend(base, blend, BlendOverlayf)

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    vec4 depthT = texture2D(depthBuffer, vUv);
    float strength = range(depthT.r, 1.0, 0.0, 5.0, 10.0) * hover;
    float dist = range(depthT.r, 1.0, 0.0, 0.0, 0.1);
    vec4 blur = tunnelBlur(inputBuffer, vUv, dist * enabled, strength * enabled);

    vec4 dirt = texture2D(dirtMap, vUv);
    outputColor = mix(blur, BlendOverlay(blur, dirt), normalize(length(blur.rgb)) * enableBlend) * max(hover * 0.005, 1.0);
}
