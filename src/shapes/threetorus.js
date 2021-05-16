export const generateThreeTorus = (r1, r2, r3, piResolution = 8) => {
  const vertices = []
  const faces = []
  const cells = []
  let facesIndex = 0

  const classOfVertex = {
    theta: {},
    phi: {},
    gamma: {},
  }

  for (let theta = 0; theta <= piResolution; theta++) {
    for (let phi = 0; phi <= piResolution; phi++) {
      for (let gamma = 0; gamma < 2 * piResolution; gamma++) {
        if (!classOfVertex.theta[theta]) {
          classOfVertex.theta[theta] = []
        }
        if (!classOfVertex.phi[phi]) {
          classOfVertex.phi[phi] = []
        }
        if (!classOfVertex.gamma[gamma]) {
          classOfVertex.gamma[gamma] = []
        }

        classOfVertex.theta[theta].push(vertices.length)
        classOfVertex.phi[phi].push(vertices.length)
        classOfVertex.gamma[gamma].push(vertices.length)

        const thetaInPi = (theta * Math.PI) / piResolution
        const phiInPi = (phi * Math.PI) / piResolution
        const gammaInPi = (gamma * Math.PI) / piResolution

        vertices.push([
          r1 * Math.cos(thetaInPi),
          (r2 + r1 * Math.sin(thetaInPi)) * Math.cos(phiInPi),
          (r3 + (r2 + r1 * Math.sin(thetaInPi)) * Math.sin(phiInPi)) *
            Math.cos(gammaInPi),
          (r3 + (r2 + r1 * Math.sin(thetaInPi)) * Math.sin(phiInPi)) *
            Math.sin(gammaInPi),
        ])
      }
    }
  }

  for (let key in classOfVertex.theta) {
    const vertexClass = classOfVertex.theta[key]
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
  }

  for (let key in classOfVertex.phi) {
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
  }

  for (let key in classOfVertex.gamma) {
    if (parseInt(key) < piResolution) {
      // we need to reconstruct the rounds from the classvertex
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
  }

  return {
    vertices,
    faces,
    cells,
  }
}

export default generateThreeTorus(0.1, 0.5, 1)
