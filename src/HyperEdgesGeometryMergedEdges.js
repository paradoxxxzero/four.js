import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperEdgesGeometryMergedEdges {
  constructor(hyperGeometry, hyperRenderer) {
    this.hyperGeometry = hyperGeometry
    this.hyperRenderer = hyperRenderer
    const { vertices, faces: gFaces, cells } = this.hyperGeometry.shape

    this.vertexGeometriesIndices = []
    const verticesIndices = new Array(vertices.length).fill().map((_, i) => i)
    const positions = new Float32Array(verticesIndices.length * 3)

    let pos = 0
    verticesIndices
      .map(verticeIndex => vertices[verticeIndex])
      .forEach(([x, y, z]) => {
        positions[pos++] = x
        positions[pos++] = y
        positions[pos++] = z
      })
    this.vertexGeometriesIndices.push(verticesIndices)
    const indices = []
    cells.map(cell => {
      const faces = cell.map(faceIndex => gFaces[faceIndex])

      // Set edges
      faces.forEach(face => {
        face.forEach((verticeIndex, i) => {
          indices.push(verticeIndex, face[(i + 1) % face.length])
        })
      })
    })
    const geometry = new BufferGeometry()
    geometry.setAttribute(
      'position',
      new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage)
    )
    geometry.setIndex(indices)
    this.geometries = [geometry]
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
