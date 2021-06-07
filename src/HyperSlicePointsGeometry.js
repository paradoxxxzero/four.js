import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperSlicePointsGeometry {
  constructor(hyperGeometry, hyperRenderer) {
    this.hyperGeometry = hyperGeometry
    this.hyperRenderer = hyperRenderer
    const { vertices, faces, cells } = this.hyperGeometry

    this.geometry = new BufferGeometry()
    const positions = new Float32Array(
      3 * 2 * cells.reduce((rv, c) => rv + c.length, 0)
    )
    this.geometry.setAttribute(
      'position',
      new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage)
    )
    this.update()
  }

  update() {
    const { vertices, faces, cells } = this.hyperGeometry

    let pos = 0
    const slicedFaces = []
    const slicedEdges = []
    cells.forEach(cell => {
      cell
        .map(faceIndex => faces[faceIndex])
        .forEach(face => {
          if (slicedFaces.includes(face)) {
            return
          }
          slicedFaces.push(face)
          // Set vertices
          face
            .map((verticeIndex, i) => [
              vertices[verticeIndex],
              vertices[face[(i + 1) % face.length]],
            ])
            .forEach(([p1, p2]) => {
              if (
                slicedEdges.some(
                  ([q1, q2]) =>
                    (q1 === p1 && q2 === p2) || (q1 === p2 && q2 === p1)
                )
              ) {
                return
              }
              slicedEdges.push([p1, p2])
              const slice = this.hyperRenderer.slice(p1, p2)
              if (slice) {
                const [x, y, z] = slice
                this.geometry.attributes.position.array[pos++] = x
                this.geometry.attributes.position.array[pos++] = y
                this.geometry.attributes.position.array[pos++] = z
              }
            })
        })
    })
    this.geometry.setDrawRange(0, pos / 3)
    this.geometry.attributes.position.needsUpdate = true
  }
}
