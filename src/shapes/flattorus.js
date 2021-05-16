export function generateFlatTorus(r1, r2, piResolution = 32) {
  const vertices = []
  const faces = []
  const cells = []
  let facesIndex = 0

  const classOfVertex = {
    theta: {},
    phi: {},
    gamma: {},
  }

  for (let theta = 0; theta < 2 * piResolution; theta++) {
    for (let phi = 0; phi < 2 * piResolution; phi++) {
      const thetaInPi = (theta * Math.PI) / piResolution
      const phiInPi = (phi * Math.PI) / piResolution

      vertices.push([
        r1 * Math.cos(thetaInPi),
        r1 * Math.sin(thetaInPi),
        r2 * Math.cos(phiInPi),
        r2 * Math.sin(phiInPi),
      ])
    }
  }

  const cell = []
  for (let i = 0; i < vertices.length; i++) {
    let iBaseNext = i + piResolution * 2
    faces.push([
      i,
      (i + 1) % vertices.length,
      (iBaseNext + 1) % vertices.length,
      iBaseNext % vertices.length,
    ])
    cell.push(facesIndex)
    facesIndex++
  }
  cells.push(cell)

  return {
    vertices,
    faces,
    cells,
  }
}

export default generateFlatTorus(1, 0.5)
