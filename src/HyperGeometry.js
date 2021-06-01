import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperGeometry {
  constructor(vertices, faces, cells, hyperRenderer) {
    this.hyperRenderer = hyperRenderer
    this.vertices4 = vertices
    this.vertices = this.vertices4.map(
      this.hyperRenderer.project.bind(this.hyperRenderer)
    )
    this.faces = faces
    this.cells = cells

    this.geometries = this.cells.map(cell => {
      const faces = cell.map(faceIndex => this.faces[faceIndex])

      const verticesCount = faces.reduce((sum, face) => sum + face.length, 0)

      const positions = new Float32Array(verticesCount * 3)
      const indices = []

      let pos = 0
      let faceShift = 0
      faces.forEach(face => {
        // Project points
        face
          .map(verticeIndex => this.vertices[verticeIndex])
          .forEach(([x, y, z]) => {
            positions[pos++] = x
            positions[pos++] = y
            positions[pos++] = z
          })

        // Tesselate face
        new Array(face.length - 2).fill().forEach((_, i) => {
          indices.push(faceShift, faceShift + i + 1, faceShift + i + 2)
        })

        faceShift += face.length
      })

      const geometry = new BufferGeometry()
      geometry.setAttribute(
        'position',
        new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage)
      )
      geometry.setIndex(indices)
      geometry.computeVertexNormals()
      return geometry
    })
  }

  update() {
    this.vertices = this.vertices4.map(
      this.hyperRenderer.project.bind(this.hyperRenderer)
    )
    this.cells.map((cell, cellIndex) => {
      const geometry = this.geometries[cellIndex]

      let pos = 0
      cell
        .map(faceIndex => this.faces[faceIndex])
        .forEach(face => {
          face
            .map(verticeIndex => this.vertices[verticeIndex])
            .forEach(([x, y, z]) => {
              geometry.attributes.position.array[pos++] = x
              geometry.attributes.position.array[pos++] = y
              geometry.attributes.position.array[pos++] = z
            })
        })

      geometry.attributes.position.needsUpdate = true
      geometry.computeVertexNormals()
      geometry.attributes.normal.needsUpdate = true
    })
  }
}
