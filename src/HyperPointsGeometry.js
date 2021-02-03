import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperPointsGeometry {
  constructor(vertices, faces, cells, hyperRenderer) {
    this.vertices = vertices
    this.faces = faces
    this.cells = cells
    this.hyperRenderer = hyperRenderer

    this.geometries = this.cells.map(cell => {
      const allVertices = [
        ...new Set(
          cell
            .map(faceIndex =>
              this.faces[faceIndex].map(
                verticeIndex => this.vertices[verticeIndex]
              )
            )
            .flat()
        ),
      ]

      const positions = new Float32Array(allVertices.length * 3)

      let pos = 0
      allVertices.forEach(vertice => {
        const [x, y, z] = this.hyperRenderer.project(vertice)
        positions[pos++] = x
        positions[pos++] = y
        positions[pos++] = z
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
      const allVertices = [
        ...new Set(
          cell
            .map(faceIndex =>
              this.faces[faceIndex].map(
                verticeIndex => this.vertices[verticeIndex]
              )
            )
            .flat()
        ),
      ]
      let pos = 0
      allVertices.forEach(vertice => {
        const [x, y, z] = this.hyperRenderer.project(vertice)
        geometry.attributes.position.array[pos++] = x
        geometry.attributes.position.array[pos++] = y
        geometry.attributes.position.array[pos++] = z
      })

      geometry.attributes.position.needsUpdate = true
    })
  }
}
