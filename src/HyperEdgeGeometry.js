import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperEdgeGeometry {
  constructor(vertices, faces, cells, hyperRenderer) {
    this.vertices = vertices
    this.faces = faces
    this.cells = cells
    this.hyperRenderer = hyperRenderer

    this.geometries = this.cells.map(cell => {
      const faces = cell.map(faceIndex => this.faces[faceIndex])

      const verticesCount = faces.reduce(
        (sum, face) => sum + face.length * 2,
        0
      )

      const positions = new Float32Array(verticesCount * 3)

      let pos = 0
      faces.forEach(face => {
        // Project points
        face
          .map((verticeIndex, i) => [
            this.vertices[verticeIndex],
            this.vertices[face[(i + 1) % face.length]],
          ])
          .flat()
          .forEach(vertice => {
            const [x, y, z] = this.hyperRenderer.project(vertice)
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
    this.cells.map((cell, cellIndex) => {
      const geometry = this.geometries[cellIndex]

      let pos = 0
      cell
        .map(faceIndex => this.faces[faceIndex])
        .forEach(face => {
          face
            .map((verticeIndex, i) => [
              this.vertices[verticeIndex],
              this.vertices[face[(i + 1) % face.length]],
            ])
            .flat()
            .forEach(vertice => {
              const [x, y, z] = this.hyperRenderer.project(vertice)
              geometry.attributes.position.array[pos++] = x
              geometry.attributes.position.array[pos++] = y
              geometry.attributes.position.array[pos++] = z
            })
        })

      geometry.attributes.position.needsUpdate = true
    })
  }
}
