export const normalizeShape = (shape, base = 1) => {
  const max = Math.max(
    ...shape.vertices.map(p => Math.sqrt(p.reduce((s, c) => s + c * c, 0)))
  )
  const scale = base / max
  return {
    ...shape,
    vertices: shape.vertices.map(p => p.map(c => c * scale)),
  }
}

export const pointsVertexShader = `
uniform float size;
attribute vec3 color;
varying vec3 vColor;

void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = size * (10.0 / - mvPosition.z);

  gl_Position = projectionMatrix * mvPosition;
}
`

export const pointsFragmentShader = `
uniform float opacity;
varying vec3 vColor;

void main() {
  if (length(gl_PointCoord - vec2( 0.5, 0.5 )) > 0.475) discard;

  gl_FragColor = vec4(vColor, opacity);
}
`
