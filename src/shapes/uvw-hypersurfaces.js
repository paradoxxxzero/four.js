export const generateUVWHyperSurface = (
  f,
  [uMin, uMax, uResolution = 16, uInclusive = false, uLoop = true],
  [vMin, vMax, vResolution = 16, vInclusive = false, vLoop = true],
  [wMin, wMax, wResolution = 16, wInclusive = false, wLoop = true],
  withCells = { u: true, v: true, w: true }
) => {
  const vertices = []
  const faces = []
  const cells = []
  const uCellGroups = []
  const vCellGroups = []

  for (let w = 0; w < wResolution; w++) {
    let wCells = []
    for (let v = 0; v < vResolution; v++) {
      let vCells = vCellGroups[v] || []
      for (let u = 0; u < uResolution; u++) {
        let uCells = uCellGroups[u] || []
        vertices.push(
          f(
            uMin + (u * (uMax - uMin)) / (uResolution - (uInclusive ? 1 : 0)),
            vMin + (v * (vMax - vMin)) / (vResolution - (vInclusive ? 1 : 0)),
            wMin + (w * (wMax - wMin)) / (wResolution - (wInclusive ? 1 : 0))
          )
        )
        const uNext = u + 1 < uResolution ? u + 1 : 0
        const vNext = v + 1 < vResolution ? v + 1 : 0
        const wNext = w + 1 < wResolution ? w + 1 : 0
        if ((uLoop || u + 1 < uResolution) && (vLoop || v + 1 < vResolution)) {
          faces.push([
            u + v * uResolution + w * uResolution * vResolution,
            uNext + v * uResolution + w * uResolution * vResolution,
            uNext + vNext * uResolution + w * uResolution * vResolution,
            u + vNext * uResolution + w * uResolution * vResolution,
          ])
          wCells.push(faces.length - 1)
        }
        if ((uLoop || u + 1 < uResolution) && (wLoop || w + 1 < wResolution)) {
          faces.push([
            u + v * uResolution + w * uResolution * vResolution,
            u + v * uResolution + wNext * uResolution * vResolution,
            uNext + v * uResolution + wNext * uResolution * vResolution,
            uNext + v * uResolution + w * uResolution * vResolution,
          ])
          vCells.push(faces.length - 1)
        }
        if ((vLoop || v + 1 < vResolution) && (wLoop || w + 1 < wResolution)) {
          faces.push([
            u + v * uResolution + w * uResolution * vResolution,
            u + v * uResolution + wNext * uResolution * vResolution,
            u + vNext * uResolution + wNext * uResolution * vResolution,
            u + vNext * uResolution + w * uResolution * vResolution,
          ])
          uCells.push(faces.length - 1)
        }

        uCellGroups[u] = uCells
      }
      vCellGroups[v] = vCells
    }
    withCells.w && cells.push(wCells)
  }
  withCells.v && vCellGroups.map(vCells => cells.push(vCells))
  withCells.u && uCellGroups.map(uCells => cells.push(uCells))

  return {
    vertices,
    faces,
    cells,
  }
}

export const generateGlome = r =>
  generateUVWHyperSurface(
    (u, v, w) => [
      r * Math.cos(u),
      r * Math.sin(u) * Math.cos(v),
      r * Math.sin(u) * Math.sin(v) * Math.cos(w),
      r * Math.sin(u) * Math.sin(v) * Math.sin(w),
    ],
    [0, Math.PI, 16, true],
    [0, 2 * Math.PI, 16],
    [0, 2 * Math.PI, 16]
  )

export const glome = generateGlome(1)

export const generateDiTorus = (r1, r2, r3) =>
  generateUVWHyperSurface(
    (u, v, w) => [
      r1 * Math.cos(u),
      (r2 + r1 * Math.sin(u)) * Math.cos(v),
      (r3 + (r2 + r1 * Math.sin(u)) * Math.sin(v)) * Math.cos(w),
      (r3 + (r2 + r1 * Math.sin(u)) * Math.sin(v)) * Math.sin(w),
    ],
    [0, Math.PI, 16, true],
    [0, 2 * Math.PI, 16],
    [0, 2 * Math.PI, 16]
  )

export const diTorus = generateDiTorus(0.25, 0.5, 1)

export const rightHyperCone = generateUVWHyperSurface(
  (u, v, w) => [
    2 * Math.cos(u) * Math.cos(v),
    2 * Math.cos(u) * Math.sin(v),
    2 * Math.sin(u),
    w,
  ],
  [-Math.PI, Math.PI, 16, true],
  [-Math.PI, Math.PI, 16, true],
  [-1, 1, 5]
)
export const obliqueHyperCone = generateUVWHyperSurface(
  (u, v, w) => [
    w + 2 * Math.cos(u) * Math.cos(v),
    w + 2 * Math.cos(u) * Math.sin(v),
    w + 2 * Math.sin(u),
    w,
  ],
  [-Math.PI, Math.PI, 16, true],
  [-Math.PI, Math.PI, 16, true],
  [-1, 1, 5]
)
export const spherinder = generateUVWHyperSurface(
  (u, v, w) => [
    Math.sin(u) * Math.cos(v),
    Math.sin(u) * Math.sin(v),
    Math.cos(u),
    w,
  ],
  [-Math.PI, Math.PI, 16, true],
  [-Math.PI, Math.PI, 16, true],
  [-1, 1, 2, true],
  { u: true, v: false, w: true }
)
export const torinder = generateUVWHyperSurface(
  (u, v, w) => [
    (1 + 0.5 * Math.cos(u)) * Math.cos(v),
    (1 + 0.5 * Math.cos(u)) * Math.sin(v),
    0.5 * Math.cos(u),
    w,
  ],
  [-Math.PI, Math.PI, 16, true],
  [-Math.PI, Math.PI, 16, true],
  [-1, 1, 2, true],
  { u: true, v: false, w: true }
)

export const cubinder = generateUVWHyperSurface(
  (u, v, w) => [Math.cos(u), Math.sin(u), v, w],
  [-Math.PI, Math.PI, 32, true],
  [-1, 1, 2, true],
  [-1, 1, 2, true],
  { u: false, v: true, w: true }
)

export const tiger = generateUVWHyperSurface(
  (u, v, w) => [
    0.25 * Math.cos(u) + 1 * Math.cos(u) * Math.cos(w),
    0.25 * Math.sin(u) + 1 * Math.sin(u) * Math.cos(w),
    0.75 * Math.cos(v) + 1 * Math.cos(v) * Math.sin(w),
    0.75 * Math.sin(v) + 1 * Math.sin(v) * Math.sin(w),
  ],
  [-Math.PI, Math.PI, 8, true],
  [-Math.PI, Math.PI, 8, true],
  [-Math.PI, Math.PI, 8, true],
  { u: true, v: false, w: true }
)

export const torisphere = generateUVWHyperSurface(
  (u, v, w) => [
    0.5 * Math.cos(u) * Math.cos(v) * Math.cos(w) +
      1 * Math.cos(v) * Math.cos(w),
    0.5 * Math.cos(u) * Math.cos(v) * Math.sin(w) +
      1 * Math.cos(v) * Math.sin(w),
    0.5 * Math.cos(u) * Math.sin(v) + 1 * Math.sin(v),
    0.5 * Math.sin(u),
  ],
  [-Math.PI, Math.PI, 8, true],
  [-Math.PI, Math.PI, 8, true],
  [-Math.PI, Math.PI, 16, true]
)

export const spheritorus = generateUVWHyperSurface(
  (u, v, w) => [
    0.5 * Math.cos(u) * Math.cos(v) * Math.cos(w) + 1 * Math.cos(w),
    0.5 * Math.cos(u) * Math.cos(v) * Math.sin(w) + 1 * Math.sin(w),
    0.5 * Math.cos(u) * Math.sin(v),
    0.5 * Math.sin(u),
  ],
  [-Math.PI, Math.PI, 8, true],
  [-Math.PI, Math.PI, 8, true],
  [-Math.PI, Math.PI, 16, true]
)

export default generateUVWHyperSurface(
  (u, v, w) => [u, v, w, u * v * w],
  [-1, 1, 2, true],
  [-1, 1, 2, true],
  [-1, 1, 2, true]
)
