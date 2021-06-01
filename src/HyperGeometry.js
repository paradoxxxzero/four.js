import { BufferAttribute, BufferGeometry, DynamicDrawUsage } from 'three'

export default class HyperGeometry {
  constructor(vertices, faces, cells, hyperRenderer) {
    this.hyperRenderer = hyperRenderer
    this.hyperVertices = vertices
    this.vertices = vertices.map(
      this.hyperRenderer.project.bind(this.hyperRenderer)
    )
    this.faces = faces
    this.cells = cells
    this.init()
  }

  init() {
    this.vertexGeometriesIndices = []

    this.geometries = this.cells.map(cell => {
      const faces = cell.map(faceIndex => this.faces[faceIndex])
      this.vertexGeometriesIndices.push(faces.flat())
      const verticesCount = faces.reduce((sum, face) => sum + face.length, 0)

      const positions = new Float32Array(verticesCount * 3)
      const indices = []

      let pos = 0
      let faceShift = 0
      faces.forEach(face => {
        // Set vertices
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
    this.vertices = this.hyperVertices.map(
      this.hyperRenderer.project.bind(this.hyperRenderer)
    )
    this.vertexGeometriesIndices.map((vertexIndices, i) => {
      const geometry = this.geometries[i]

      for (let i = 0, n = vertexIndices.length; i < n; i++) {
        const [x, y, z] = this.vertices[vertexIndices[i]]
        geometry.attributes.position.array[i * 3] = x
        geometry.attributes.position.array[i * 3 + 1] = y
        geometry.attributes.position.array[i * 3 + 2] = z
      }

      geometry.attributes.position.needsUpdate = true
      geometry.computeVertexNormals()
      geometry.attributes.normal.needsUpdate = true
    })
  }
}
