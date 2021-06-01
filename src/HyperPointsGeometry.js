import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperPointsGeometry {
  constructor(hyperGeometry, hyperRenderer) {
    this.hyperGeometry = hyperGeometry
    this.hyperRenderer = hyperRenderer

    const { vertices, faces, cells } = this.hyperGeometry

    this.geometries = cells.map(cell => {
      const allVertices = [
        ...new Set(
          cell
            .map(faceIndex =>
              faces[faceIndex].map(verticeIndex => vertices[verticeIndex])
            )
            .flat()
        ),
      ]

      const positions = new Float32Array(allVertices.length * 3)

      let pos = 0
      allVertices.forEach(([x, y, z]) => {
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
    const { vertices, faces, cells } = this.hyperGeometry

    cells.map((cell, cellIndex) => {
      const geometry = this.geometries[cellIndex]
      const allVertices = [
        ...new Set(
          cell
            .map(faceIndex =>
              faces[faceIndex].map(verticeIndex => vertices[verticeIndex])
            )
            .flat()
        ),
      ]
      let pos = 0
      allVertices.forEach(([x, y, z]) => {
        geometry.attributes.position.array[pos++] = x
        geometry.attributes.position.array[pos++] = y
        geometry.attributes.position.array[pos++] = z
      })

      geometry.attributes.position.needsUpdate = true
    })
  }
}
