import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperEdgesGeometry {
  constructor(hyperGeometry, hyperRenderer) {
    this.hyperGeometry = hyperGeometry
    this.hyperRenderer = hyperRenderer
    const { vertices, faces: gFaces, cells } = this.hyperGeometry

    this.vertexGeometriesIndices = []
    this.geometries = cells.map(cell => {
      const faces = cell.map(faceIndex => gFaces[faceIndex])
      const verticesIndices = [...new Set(faces.flat())]
      this.vertexGeometriesIndices.push(verticesIndices)
      const positions = new Float32Array(verticesIndices.length * 3)

      // Set vertices
      let pos = 0
      verticesIndices
        .map(verticeIndex => vertices[verticeIndex])
        .forEach(([x, y, z]) => {
          positions[pos++] = x
          positions[pos++] = y
          positions[pos++] = z
        })

      // Set edges
      const indices = []
      faces.forEach(face => {
        face.forEach((verticeIndex, i) => {
          indices.push(
            verticesIndices.indexOf(verticeIndex),
            verticesIndices.indexOf(face[(i + 1) % face.length])
          )
        })
      })

      const geometry = new BufferGeometry()
      geometry.setAttribute(
        'position',
        new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage)
      )
      geometry.setIndex(indices)
      return geometry
    })
  }

  update() {
    const { vertices } = this.hyperGeometry
    this.vertexGeometriesIndices.map((vertexIndices, i) => {
      const geometry = this.geometries[i]

      for (let i = 0, n = vertexIndices.length; i < n; i++) {
        const [x, y, z] = vertices[vertexIndices[i]]
        geometry.attributes.position.array[i * 3] = x
        geometry.attributes.position.array[i * 3 + 1] = y
        geometry.attributes.position.array[i * 3 + 2] = z
      }

      geometry.attributes.position.needsUpdate = true
    })
  }
}
