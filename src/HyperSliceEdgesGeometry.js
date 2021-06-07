import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperSliceEdgesGeometry {
  constructor(hyperGeometry, hyperRenderer) {
    this.hyperGeometry = hyperGeometry
    this.hyperRenderer = hyperRenderer
    const { cells } = this.hyperGeometry

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
    const epsilon = 1e-8
    let pos = 0
    const indices = []
    cells.forEach(cell => {
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

        new Array(linkedPairs.length).fill().forEach((_, i) => {
          indices.push(pos / 3 + i, pos / 3 + ((i + 1) % linkedPairs.length))
        })

        linkedPairs.forEach(([x, y, z]) => {
          this.geometry.attributes.position.array[pos++] = x
          this.geometry.attributes.position.array[pos++] = y
          this.geometry.attributes.position.array[pos++] = z
        })
      }
    })
    this.geometry.setIndex(indices)
    this.geometry.attributes.position.needsUpdate = true
  }
}
