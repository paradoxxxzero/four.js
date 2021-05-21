export const generateUVSurface = (
  f,
  [uMin, uMax, uResolution = 16, uInclusive = false],
  [vMin, vMax, vResolution = 16, vInclusive = false]
) => {
  const vertices = []
  const faces = []
  const cells = []

  for (let v = 0; v < vResolution; v++) {
    let cell = []
    for (let u = 0; u < uResolution; u++) {
      vertices.push(
        f(
          uMin + (u * (uMax - uMin)) / (uResolution - (uInclusive ? 1 : 0)),
          vMin + (v * (vMax - vMin)) / (vResolution - (vInclusive ? 1 : 0))
        )
      )
      const uNext = u + 1 < uResolution ? u + 1 : 0
      const vNext = v + 1 < vResolution ? v + 1 : 0
      faces.push([
        u + v * uResolution,
        uNext + v * uResolution,
        uNext + vNext * uResolution,
        u + vNext * uResolution,
      ])

      cell.push(faces.length - 1)
    }
    if (cell.length) {
      cells.push(cell)
    }
  }
  return {
    vertices,
    faces,
    cells,
  }
}

export const generateFlatTorus = (r1, r2, resolution = 32) =>
  generateUVSurface(
    (u, v) => [
      r1 * Math.cos(u),
      r1 * Math.sin(u),
      r2 * Math.cos(v),
      r2 * Math.sin(v),
    ],
    [-Math.PI, Math.PI, resolution],
    [-Math.PI, Math.PI, resolution]
  )
export const generateDuoCylinder = (r, resolution = 32) =>
  generateFlatTorus(r, r, resolution)

export const flatTorus = generateFlatTorus(1, 0.5)

export const duoCylinder = generateDuoCylinder(1)

export default generateUVSurface(
  (u, v) => [
    Math.cos(u) * Math.sin(v),
    Math.sin(u) * Math.sin(v),
    Math.cos(v) * Math.sin(u),
    Math.cos(v) * Math.cos(u),
  ],
  [-Math.PI, Math.PI, 32],
  [-Math.PI, Math.PI, 32]
)
