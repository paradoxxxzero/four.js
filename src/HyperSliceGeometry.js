import { BufferAttribute, BufferGeometry, DynamicDrawUsage, Color } from 'three'

export default class HyperSliceGeometry {
  constructor(hyperGeometry, hyperRenderer, cellColors) {
    this.hyperGeometry = hyperGeometry
    this.hyperRenderer = hyperRenderer
    const { cells } = this.hyperGeometry
    this.colors = cellColors
    this.geometry = new BufferGeometry()
    const positions = new Float32Array(
      3 * 2 * cells.reduce((rv, c) => rv + c.length, 0)
    )

    const colors = new Float32Array(
      3 * 2 * cells.reduce((rv, c) => rv + c.length, 0)
    )

    this.geometry.setAttribute(
      'position',
      new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage)
    )
    this.geometry.setAttribute(
      'color',
      new BufferAttribute(colors, 3).setUsage(DynamicDrawUsage)
    )
  }

  update() {
    const { vertices, faces, cells } = this.hyperGeometry
    const epsilon = 1e-8
    let pos = 0
    const indices = []
    cells.forEach((cell, i) => {
      const [r, g, b] = new Color(this.colors[i % this.colors.length]).toArray()
      const pairs = []
      cell
        .map(faceIndex => faces[faceIndex])
        .forEach(face => {
          // Set vertices
          const pair = face
            .map((verticeIndex, i) => [
              vertices[verticeIndex],
              vertices[face[(i + 1) % face.length]],
            ])
            .map(([p1, p2]) => this.hyperRenderer.slice(p1, p2))
            .filter(x => x)
          pair.length > 1 && pairs.push(pair)
        })
      if (pairs.length > 2) {
        const linkedPairs = []
        linkedPairs.push(...pairs.shift())
        while (pairs.length) {
          const lp = pairs.length
          const dangle = linkedPairs.slice(-1)[0]
          for (let i = 0; i < pairs.length; i++) {
            const [p1, p2] = pairs[i]
            if (p1.every((c, i) => Math.abs(c - dangle[i]) < epsilon)) {
              pairs.splice(i, 1)
              linkedPairs.push(p2)
              break
            }
            if (p2.every((c, i) => Math.abs(c - dangle[i]) < epsilon)) {
              pairs.splice(i, 1)
              linkedPairs.push(p1)
              break
            }
          }
          if (lp === pairs.length) {
            // console.log(lp, cell)
            return
          }
        }

        new Array(linkedPairs.length - 2).fill().forEach((_, i) => {
          indices.push(pos / 3, pos / 3 + (i + 1), pos / 3 + (i + 2))
        })

        linkedPairs.forEach(([x, y, z]) => {
          this.geometry.attributes.color.array[pos] = r
          this.geometry.attributes.position.array[pos++] = x
          this.geometry.attributes.color.array[pos] = g
          this.geometry.attributes.position.array[pos++] = y
          this.geometry.attributes.color.array[pos] = b
          this.geometry.attributes.position.array[pos++] = z
        })
      }
    })
    this.geometry.setIndex(indices)
    this.geometry.attributes.position.needsUpdate = true
    this.geometry.attributes.color.needsUpdate = true
    this.geometry.computeVertexNormals()
    this.geometry.attributes.normal.needsUpdate = true
  }
}
