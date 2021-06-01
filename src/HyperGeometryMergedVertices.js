import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'
import HyperGeometry from './HyperGeometry'

export default class HyperGeometryMergedVertices extends HyperGeometry {
  init() {
    this.vertexGeometriesIndices = []

    this.geometries = this.cells.map(cell => {
      const faces = cell.map(faceIndex => this.faces[faceIndex])
      const verticesIndices = [...new Set(faces.flat())]
      this.vertexGeometriesIndices.push(verticesIndices)
      const positions = new Float32Array(verticesIndices.length * 3)

      let pos = 0
      verticesIndices
        .map(verticeIndex => this.vertices[verticeIndex])
        .forEach(([x, y, z]) => {
          positions[pos++] = x
          positions[pos++] = y
          positions[pos++] = z
        })

      const indices = []
      faces.forEach(face => {
        // Tesselate face
        new Array(face.length - 2).fill().forEach((_, i) => {
          indices.push(
            verticesIndices.indexOf(face[0]),
            verticesIndices.indexOf(face[i + 1]),
            verticesIndices.indexOf(face[i + 2])
          )
        })
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
}
