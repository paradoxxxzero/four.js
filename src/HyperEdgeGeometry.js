import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperEdgeGeometry {
  constructor(hyperGeometry, hyperRenderer) {
    this.hyperGeometry = hyperGeometry
    this.hyperRenderer = hyperRenderer
    const { vertices, faces, cells } = this.hyperGeometry

    this.geometries = cells.map(cell => {
      const cell_faces = cell.map(faceIndex => faces[faceIndex])

      const verticesCount = cell_faces.reduce(
        (sum, face) => sum + face.length * 2,
        0
      )

      const positions = new Float32Array(verticesCount * 3)

      let pos = 0
      cell_faces.forEach(face => {
        // Project points
        face
          .map((verticeIndex, i) => [
            vertices[verticeIndex],
            vertices[face[(i + 1) % face.length]],
          ])
          .flat()
          .forEach(([x, y, z]) => {
            positions[pos++] = x
            positions[pos++] = y
            positions[pos++] = z
          })
      })

      const geometry = new BufferGeometry()
      geometry.setAttribute(
        'position',
        new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage)
      )
      return geometry
    })
  }

  update() {
    const { vertices, faces, cells } = this.hyperGeometry

    cells.map((cell, cellIndex) => {
      const geometry = this.geometries[cellIndex]

      let pos = 0
      cell
        .map(faceIndex => faces[faceIndex])
        .forEach(face => {
          face
            .map((verticeIndex, i) => [
              vertices[verticeIndex],
              vertices[face[(i + 1) % face.length]],
            ])
            .flat()
            .forEach(([x, y, z]) => {
              geometry.attributes.position.array[pos++] = x
              geometry.attributes.position.array[pos++] = y
              geometry.attributes.position.array[pos++] = z
            })
        })

      geometry.attributes.position.needsUpdate = true
    })
  }
}
