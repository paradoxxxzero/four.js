export function createFlatTorus(r1, r2, piResolution = 32) {
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
      //for (let gamma = 0; gamma < 2 * piResolution; gamma+=piResolution) {
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
      iBaseNext  % vertices.length,
    ])
    cell.push(facesIndex)
    facesIndex++
  }
  cells.push(cell)

  /*for (let key in classOfVertex.phi) {
    const vertexClass = classOfVertex.phi[key]
    const cell = []
    for (
      let rounds = 0;
      rounds < vertexClass.length / (piResolution * 2) - 1;
      rounds++
    ) {
      for (let i = 0; i < piResolution * 2; i++) {
        let iBase = rounds * piResolution * 2
        let iBaseNext = (rounds + 1) * piResolution * 2
        faces.push([
          vertexClass[iBase + i],
          vertexClass[iBase + ((i + 1) % (piResolution * 2))],
          vertexClass[iBaseNext + ((i + 1) % (piResolution * 2))],
          vertexClass[iBaseNext + (i % (piResolution * 2))],
        ])
        cell.push(facesIndex)
        facesIndex++
      }
    }
    cells.push(cell)
  }*/

  /*for (let key in classOfVertex.gamma) {
    if (parseInt(key) < piResolution) {
      //we need to reconstruct the rounds from the classvertex
      const vertexClassOne = classOfVertex.gamma[key]
      const vertexClassTwo = classOfVertex.gamma[parseInt(key) + piResolution]

      const vertexClass = []

      for (
        let rounds = 0;
        rounds < vertexClassOne.length / (piResolution + 1);
        rounds++
      ) {
        vertexClass.push(
          ...vertexClassOne.slice(
            rounds * (piResolution + 1),
            (rounds + 1) * (piResolution + 1)
          )
        )
        vertexClass.push(
          ...vertexClassTwo
            .slice(
              rounds * (piResolution + 1),
              (rounds + 1) * (piResolution + 1)
            )
            .reverse()
        )
      }

      const cell = []
      for (
        let rounds = 0;
        rounds < vertexClass.length / (2 * (piResolution + 1)) - 1;
        rounds++
      ) {
        for (let i = 0; i < 2 * (piResolution + 1); i++) {
          let iBase = rounds * (2 * (piResolution + 1))
          let iBaseNext = (rounds + 1) * (2 * (piResolution + 1))
          faces.push([
            vertexClass[iBase + i],
            vertexClass[iBase + ((i + 1) % (2 * (piResolution + 1)))],
            vertexClass[iBaseNext + ((i + 1) % (2 * (piResolution + 1)))],
            vertexClass[iBaseNext + (i % (2 * (piResolution + 1)))],
          ])
          cell.push(facesIndex)
          facesIndex++
        }
      }
      cells.push(cell)
    }
  }*/

  return {
    vertices,
    faces,
    cells,
  }
}

export default createFlatTorus(1, 0.5)
