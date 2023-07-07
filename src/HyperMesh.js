import {
  BufferAttribute,
  BufferGeometry,
  StreamDrawUsage,
  Color,
  Group,
  MeshPhongMaterial,
  NormalBlending,
  DoubleSide,
  LineBasicMaterial,
  ShaderMaterial,
  LineSegments,
  Points,
  Mesh,
  Vector3,
  AdditiveBlending,
} from 'three'
import { cellColors } from './colorGenerators'
import { pointsVertexShader, pointsFragmentShader } from './helpers'

export const defaultColors = new Array(128)
  .fill()
  .map((_, i) => `hsl(${(i * 29) % 360}, 60%, 60%)`)

const defaults = {
  faces: {
    enabled: true,
    useColors: true,
    colorGenerator: cellColors,
    colors: defaultColors,
    reuse: 'none',
    split: 'cells',
    splitScale: 100, // Need split cells or faces
    material: new MeshPhongMaterial({
      transparent: true,
      opacity: 0.25,
      blending: NormalBlending,
      depthWrite: false,
      side: DoubleSide,
      vertexColors: true,
    }),
  },
  edges: {
    enabled: true,
    useColors: true,
    colorGenerator: cellColors,
    colors: defaultColors,
    reuse: 'faces',
    split: 'cells',
    splitScale: 100, // Need split cells or faces
    material: new LineBasicMaterial({
      transparent: true,
      opacity: 0.25,
      blending: AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      linewidth: 2,
    }),
  },
  points: {
    enabled: false,
    useColors: true,
    colorGenerator: cellColors,
    colors: defaultColors,
    reuse: 'faces',
    split: 'none',
    splitScale: 100, // Need split cells or faces
    material: new ShaderMaterial({
      uniforms: {
        size: { value: 5 },
        opacity: { value: 0.25 },
      },
      vertexShader: pointsVertexShader,
      fragmentShader: pointsFragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    }),
  },
}

const reuses = ['all', 'faces', 'none']
const splits = ['none', 'cells', 'faces']

export default class HyperMesh extends Group {
  constructor(
    shape,
    { all = {}, faces = {}, edges = {}, points = {} } = {
      all: {},
      faces: {},
      edges: {},
      points: {},
    }
  ) {
    super()
    this.shape = shape
    this.config = {
      faces: {
        ...defaults.faces,
        ...faces,
        ...all,
      },
      edges: {
        ...defaults.edges,
        ...edges,
        ...all,
      },
      points: {
        ...defaults.points,
        ...points,
        ...all,
      },
    }

    this.parts = {}
    const meshes = {
      faces: Mesh,
      edges: LineSegments,
      points: Points,
    }
    ;['points', 'edges', 'faces'].map((type, order) => {
      if (this.config[type].enabled) {
        const unfoldOrder =
          typeof this.config[type].reuse === 'string'
            ? reuses.indexOf(this.config[type].reuse)
            : this.config[type].reuse
        let geometryOrder =
          typeof this.config[type].split === 'string'
            ? splits.indexOf(this.config[type].split)
            : this.config[type].split
        if (geometryOrder > unfoldOrder) {
          console.warn(
            `Geometry order ${geometryOrder} can’t be superior to unfold order ${unfoldOrder}`
          )
          geometryOrder = unfoldOrder
        }
        const verticesIndices = this.getVerticesIndices(
          unfoldOrder,
          geometryOrder
        )
        const indices = this.getIndices(unfoldOrder, geometryOrder, order + 1)
        const geometry = this.buildGeometry(
          verticesIndices,
          this.config[type].useColors,
          type
        )

        indices && this.setIndices(geometry, indices)
        this[type] = this.createMesh(
          geometry,
          this.config[type].material,
          meshes[type]
        )
        if (this.config[type].useColors) {
          this.setColor(
            geometry,
            verticesIndices,
            unfoldOrder,
            geometryOrder,
            this.config[type].colorGenerator,
            this.config[type].colors,
            type
          )
        }
        this.parts[type] = {
          geometry,
          verticesIndices,
        }
        this.add(this[type])
      }
    })
  }

  initGeometry(size, withColors) {}

  getVerticesIndices(unfoldOrder, geometryOrder) {
    const unfoldFace = faceIndex => this.shape.faces[faceIndex]

    if (unfoldOrder === 0) {
      // All vertices are added once in buffer geometry and reused across faces / cells
      if (geometryOrder === 0) {
        return new Array(this.shape.vertices.length).fill().map((_, i) => i)
      }
    } else if (unfoldOrder === 1) {
      // Vertices are reused in cells, partial unfold
      if (geometryOrder === 0) {
        return this.shape.cells
          .map(cell => [...new Set(cell.map(unfoldFace).flat())])
          .flat()
      }
      if (geometryOrder === 1) {
        return this.shape.cells.map(cell => [
          ...new Set(cell.map(unfoldFace).flat()),
        ])
      }
    } else if (unfoldOrder === 2) {
      // Vertices are never reused, full unfold
      if (geometryOrder === 0) {
        return this.shape.cells.map(cell => cell.map(unfoldFace).flat()).flat()
      }
      if (geometryOrder === 1) {
        return this.shape.cells.map(cell => cell.map(unfoldFace).flat())
      } else if (geometryOrder === 2) {
        return this.shape.cells.map(cell => cell.map(unfoldFace))
      }
    }
  }

  setColor(
    geometry,
    verticesIndices,
    unfoldOrder,
    geometryOrder,
    colorGenerator,
    colors,
    type
  ) {
    const colorGetter = colorGenerator({
      shape: this.shape,
      colors: colors.map(color => new Color(color)),
    })
    const unfoldFace = faceIndex => this.shape.faces[faceIndex]
    if (unfoldOrder === 0) {
      if (geometryOrder === 0) {
        let pos = 0
        verticesIndices.forEach(vertexIndex => {
          const [r, g, b] = colorGetter({
            vertex: vertexIndex,
            type,
          }).toArray()
          geometry.attributes.color.array[pos++] = r
          geometry.attributes.color.array[pos++] = g
          geometry.attributes.color.array[pos++] = b
        })
        geometry.attributes.color.needsUpdate = true
      }
    } else if (unfoldOrder === 1) {
      if (geometryOrder === 0) {
        let pos = 0
        this.shape.cells.forEach((cell, cellIndex) => {
          ;[...new Set(cell.map(unfoldFace).flat())].map(vertexIndex => {
            const [r, g, b] = colorGetter({
              cell: cellIndex,
              vertex: vertexIndex,
              type,
            }).toArray()
            geometry.attributes.color.array[pos++] = r
            geometry.attributes.color.array[pos++] = g
            geometry.attributes.color.array[pos++] = b
          })
        })
        geometry.attributes.color.needsUpdate = true
      }

      if (geometryOrder === 1) {
        this.shape.cells.forEach((cell, cellIndex) => {
          let pos = 0
          ;[...new Set(cell.map(unfoldFace).flat())].map(vertexIndex => {
            const [r, g, b] = colorGetter({
              cell: cellIndex,
              vertex: vertexIndex,
              type,
            }).toArray()
            geometry[cellIndex].attributes.color.array[pos++] = r
            geometry[cellIndex].attributes.color.array[pos++] = g
            geometry[cellIndex].attributes.color.array[pos++] = b
          })
          geometry[cellIndex].attributes.color.needsUpdate = true
        })
      }
    } else if (unfoldOrder === 2) {
      // Vertices are never reused, full unfold
      if (geometryOrder === 0) {
        let pos = 0
        this.shape.cells.forEach((cell, cellIndex) => {
          cell.map(unfoldFace).map((face, faceIndex) => {
            face.forEach(vertexIndex => {
              const [r, g, b] = colorGetter({
                cell: cellIndex,
                face: faceIndex,
                vertex: vertexIndex,
                type,
              }).toArray()
              geometry.attributes.color.array[pos++] = r
              geometry.attributes.color.array[pos++] = g
              geometry.attributes.color.array[pos++] = b
            })
          })
        })
        geometry.attributes.color.needsUpdate = true
      } else if (geometryOrder === 1) {
        this.shape.cells.forEach((cell, cellIndex) => {
          let pos = 0
          cell.map(unfoldFace).map((face, faceIndex) => {
            face.forEach(vertexIndex => {
              const [r, g, b] = colorGetter({
                cell: cellIndex,
                face: faceIndex,
                vertex: vertexIndex,
                type,
              }).toArray()
              geometry[cellIndex].attributes.color.array[pos++] = r
              geometry[cellIndex].attributes.color.array[pos++] = g
              geometry[cellIndex].attributes.color.array[pos++] = b
            })
          })
          geometry[cellIndex].attributes.color.needsUpdate = true
        })
      } else if (geometryOrder === 2) {
        this.shape.cells.forEach((cell, cellIndex) => {
          cell.map(unfoldFace).map((face, faceIndex) => {
            let pos = 0
            face.forEach(vertexIndex => {
              const [r, g, b] = colorGetter({
                cell: cellIndex,
                face: faceIndex,
                vertex: vertexIndex,
                type,
              }).toArray()
              geometry[cellIndex][faceIndex].attributes.color.array[pos++] = r
              geometry[cellIndex][faceIndex].attributes.color.array[pos++] = g
              geometry[cellIndex][faceIndex].attributes.color.array[pos++] = b
            })
            geometry[cellIndex][faceIndex].attributes.color.needsUpdate = true
          })
        })
      }
    }
  }

  getIndices(unfoldOrder, geometryOrder, indicesOrder) {
    const unfoldFace = faceIndex => this.shape.faces[faceIndex]
    let indices
    if (indicesOrder === 0 || indicesOrder === 1) {
      indices = null
    } else if (indicesOrder === 2) {
      // edges
      indices = []
      if (unfoldOrder === 0) {
        if (geometryOrder === 0) {
          this.shape.cells.forEach(cell =>
            cell.map(unfoldFace).forEach(face => {
              face.forEach((vertexIndex, i) => {
                indices.push(vertexIndex, face[(i + 1) % face.length])
              })
            })
          )
        }
      } else if (unfoldOrder === 1) {
        if (geometryOrder === 0) {
          let verticeShift = 0
          this.shape.cells.forEach(cell => {
            const verticesIndices = [...new Set(cell.map(unfoldFace).flat())]
            cell.map(unfoldFace).forEach(face => {
              face.forEach((vertexIndex, i) => {
                indices.push(
                  verticeShift + verticesIndices.indexOf(vertexIndex),
                  verticeShift +
                    verticesIndices.indexOf(face[(i + 1) % face.length])
                )
              })
            })
            verticeShift += verticesIndices.length
          })
        } else if (geometryOrder === 1) {
          this.shape.cells.forEach((cell, cellIndex) => {
            const verticesIndices = [...new Set(cell.map(unfoldFace).flat())]
            const subIndices = []
            cell.map(unfoldFace).forEach(face => {
              face.forEach((vertexIndex, i) => {
                subIndices.push(
                  verticesIndices.indexOf(vertexIndex),
                  verticesIndices.indexOf(face[(i + 1) % face.length])
                )
              })
            })
            indices.push(subIndices)
          })
        }
      } else if (unfoldOrder === 2) {
        if (geometryOrder === 0) {
          let verticeShift = 0
          this.shape.cells.forEach(cell => {
            cell.map(unfoldFace).forEach(face => {
              face.forEach((_, i) => {
                indices.push(
                  verticeShift + i,
                  verticeShift + ((i + 1) % face.length)
                )
              })
              verticeShift += face.length
            })
          })
        } else if (geometryOrder === 1) {
          this.shape.cells.forEach(cell => {
            let verticeShift = 0
            const subIndices = []
            cell.map(unfoldFace).forEach(face => {
              face.forEach((_, i) => {
                subIndices.push(
                  verticeShift + i,
                  verticeShift + ((i + 1) % face.length)
                )
              })
              verticeShift += face.length
            })
            indices.push(subIndices)
          })
        } else if (geometryOrder === 2) {
          this.shape.cells.forEach(cell => {
            const subIndices = []
            cell.map(unfoldFace).forEach(face => {
              const subSubIndices = []
              face.forEach((_, i) => {
                subSubIndices.push(i, (i + 1) % face.length)
              })
              subIndices.push(subSubIndices)
            })
            indices.push(subIndices)
          })
        }
      }
    } else if (indicesOrder === 3) {
      // faces
      indices = []
      if (unfoldOrder === 0) {
        this.shape.cells.forEach(cell =>
          cell.map(unfoldFace).forEach(face => {
            new Array(face.length - 2).fill().forEach((_, i) => {
              indices.push(face[0], face[i + 1], face[i + 2])
            })
          })
        )
      } else if (unfoldOrder === 1) {
        if (geometryOrder === 0) {
          let verticeShift = 0
          this.shape.cells.forEach(cell => {
            const verticesIndices = [...new Set(cell.map(unfoldFace).flat())]
            cell.map(unfoldFace).forEach(face => {
              new Array(face.length - 2).fill().forEach((_, i) => {
                indices.push(
                  verticeShift + verticesIndices.indexOf(face[0]),
                  verticeShift + verticesIndices.indexOf(face[i + 1]),
                  verticeShift + verticesIndices.indexOf(face[i + 2])
                )
              })
            })
            verticeShift += verticesIndices.length
          })
        } else if (geometryOrder === 1) {
          this.shape.cells.forEach((cell, cellIndex) => {
            const verticesIndices = [...new Set(cell.map(unfoldFace).flat())]
            const subIndices = []
            cell.map(unfoldFace).forEach(face => {
              new Array(face.length - 2).fill().forEach((_, i) => {
                subIndices.push(
                  verticesIndices.indexOf(face[0]),
                  verticesIndices.indexOf(face[i + 1]),
                  verticesIndices.indexOf(face[i + 2])
                )
              })
            })
            indices.push(subIndices)
          })
        }
      } else if (unfoldOrder === 2) {
        if (geometryOrder === 0) {
          let verticeShift = 0
          this.shape.cells.forEach(cell => {
            cell.map(unfoldFace).forEach(face => {
              new Array(face.length - 2).fill().forEach((_, i) => {
                indices.push(
                  verticeShift,
                  verticeShift + i + 1,
                  verticeShift + i + 2
                )
              })
              verticeShift += face.length
            })
          })
        } else if (geometryOrder === 1) {
          this.shape.cells.forEach(cell => {
            let verticeShift = 0
            const subIndices = []
            cell.map(unfoldFace).forEach(face => {
              new Array(face.length - 2).fill().forEach((_, i) => {
                subIndices.push(
                  verticeShift,
                  verticeShift + i + 1,
                  verticeShift + i + 2
                )
              })
              verticeShift += face.length
            })
            indices.push(subIndices)
          })
        } else if (geometryOrder === 2) {
          this.shape.cells.forEach(cell => {
            const subIndices = []
            cell.map(unfoldFace).forEach(face => {
              const subSubIndices = []
              new Array(face.length - 2).fill().forEach((_, i) => {
                subSubIndices.push(0, i + 1, i + 2)
              })
              subIndices.push(subSubIndices)
            })
            indices.push(subIndices)
          })
        }
      }
    }
    return indices
  }

  buildGeometry(verticesIndices, useColors, type, level = 0) {
    const [vertexIndiceOrArray] = verticesIndices
    if (Array.isArray(vertexIndiceOrArray)) {
      return verticesIndices.map(x =>
        this.buildGeometry(x, useColors, type, level + 1)
      )
    }
    const size = verticesIndices.length
    const geometry = new BufferGeometry()
    geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(3 * size), 3).setUsage(
        StreamDrawUsage
      )
    )
    if (useColors) {
      geometry.setAttribute(
        'color',
        new BufferAttribute(new Float32Array(3 * size), 3).setUsage(
          StreamDrawUsage
        )
      )
    }
    geometry.name = `${type} geometry, level ${level}`
    return geometry
  }

  setIndices(geometry, indices) {
    if (Array.isArray(geometry)) {
      return geometry.map((x, i) => this.setIndices(x, indices[i]))
    }
    return geometry.setIndex(indices)
  }

  createMesh(geometry, material, MeshClass) {
    if (Array.isArray(geometry)) {
      const group = new Group()
      group.add(
        ...geometry.map((x, i) =>
          this.createMesh(
            x,
            Array.isArray(material) ? material[i] : material,
            MeshClass
          )
        )
      )
      return group
    }
    return new MeshClass(geometry, material)
  }

  walk(geometry, verticesIndices, cb) {
    if (Array.isArray(geometry)) {
      return geometry.forEach((x, i) => this.walk(x, verticesIndices[i], cb))
    }
    cb(geometry, verticesIndices)
  }

  setPoint(geometry, verticesIndices, type, vertices) {
    this.walk(geometry, verticesIndices, (geometry, verticesIndices) => {
      let pos = 0
      verticesIndices.forEach(vertexIndex => {
        const [x, y, z] = vertices[vertexIndex]
        geometry.attributes.position.array[pos++] = x
        geometry.attributes.position.array[pos++] = y
        geometry.attributes.position.array[pos++] = z
      })
      geometry.attributes.position.needsUpdate = true
      if (type === 'faces') {
        geometry.computeVertexNormals()
        geometry.attributes.normal.needsUpdate = true
      }
    })
  }

  recenter(mesh, splitScale) {
    if (mesh.isGroup) {
      return mesh.children.map(child => this.recenter(child, splitScale))
    }
    const center = new Vector3()
    mesh.geometry.computeBoundingBox()
    mesh.geometry.boundingBox.getCenter(center)
    mesh.geometry.center()
    mesh.position.copy(center)
    mesh.scale.setScalar(splitScale / 100)
    // mesh.scale.setScalar(Math.min(splitScale / 100, 0.999))
  }

  update(hyperRenderer) {
    hyperRenderer.prepare(this.shape.vertices)
    const vertices = this.shape.vertices.map(
      hyperRenderer.project.bind(hyperRenderer)
    )
    Object.entries(this.parts).forEach(([type, part]) => {
      if (this.config[type].enabled) {
        this.setPoint(part.geometry, part.verticesIndices, type, vertices)
        this.recenter(this[type], this.config[type].splitScale)
      }
    })
  }
}
