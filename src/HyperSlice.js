import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Color,
  MeshPhongMaterial,
  ShaderMaterial,
  LineBasicMaterial,
  NormalBlending,
  AdditiveBlending,
  DoubleSide,
  Mesh,
  LineSegments,
  Points,
  Group,
} from 'three'
import { cellColors } from './colorGenerators'
import { defaultColors } from './HyperMesh'
import { pointsVertexShader, pointsFragmentShader } from './helpers'

const defaults = {
  faces: {
    enabled: true,
    useColors: true,
    colorGenerator: cellColors,
    colors: defaultColors,
    material: new MeshPhongMaterial({
      side: DoubleSide,
      shininess: 50,
      vertexColors: true,
    }),
  },
  edges: {
    enabled: true,
    useColors: true,
    colorGenerator: cellColors,
    colors: defaultColors,
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

export default class HyperSlice extends Group {
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
    const size = 2 * this.shape.cells.reduce((rv, c) => rv + c.length, 0)
    ;['points', 'edges', 'faces'].map(type => {
      if (this.config[type].enabled) {
        const geometry = this.buildGeometry(size, this.config[type].useColors)

        this[type] = this.createMesh(
          geometry,
          this.config[type].material,
          meshes[type]
        )
        this.parts[type] = {
          geometry,
        }
        this.add(this[type])
      }
    })
  }

  buildGeometry(size, useColors) {
    const geometry = new BufferGeometry()
    geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(3 * size), 3).setUsage(
        DynamicDrawUsage
      )
    )
    if (useColors) {
      geometry.setAttribute(
        'color',
        new BufferAttribute(new Float32Array(3 * size), 3).setUsage(
          DynamicDrawUsage
        )
      )
    }
    return geometry
  }

  createMesh(geometry, material, MeshClass) {
    return new MeshClass(geometry, material)
  }

  update(hyperRenderer) {
    const { vertices, faces, cells } = this.shape
    const epsilon = 1e-8
    let i = 0
    this.parts.faces && (this.parts.faces.indices = [])
    this.parts.edges && (this.parts.edges.indices = [])

    Object.entries(this.parts).forEach(([type, part]) => {
      part.colorGetter = this.config[type].useColors
        ? this.config[type].colorGenerator({
            shape: this.shape,
            colors: this.config[type].colors.map(color => new Color(color)),
          })
        : null
    })
    cells.forEach((cell, cellIndex) => {
      const pairs = []
      cell
        .map(faceIndex => faces[faceIndex])
        .forEach(face => {
          const pair = face
            .map((verticeIndex, faceVerticeIndex) => [
              vertices[verticeIndex],
              vertices[face[(faceVerticeIndex + 1) % face.length]],
            ])
            .map(([p1, p2]) => hyperRenderer.slice(p1, p2))
            .filter(x => x)
          pair.length > 1 && pairs.push(pair)
        })
      if (pairs.length > 2) {
        const linkedPairs = []
        linkedPairs.push(...pairs.shift())
        while (pairs.length) {
          const lp = pairs.length
          const dangle = linkedPairs.slice(-1)[0]
          for (let pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
            const [p1, p2] = pairs[pairIndex]
            if (p1.every((c, ci) => Math.abs(c - dangle[ci]) < epsilon)) {
              pairs.splice(pairIndex, 1)
              linkedPairs.push(p2)
              break
            }
            if (p2.every((c, ci) => Math.abs(c - dangle[ci]) < epsilon)) {
              pairs.splice(pairIndex, 1)
              linkedPairs.push(p1)
              break
            }
          }
          if (lp === pairs.length) {
            // console.log(lp, cell)
            return
          }
        }

        if (this.config.faces.enabled) {
          new Array(linkedPairs.length - 2).fill().forEach((_, j) => {
            this.parts.faces.indices.push(i, i + j + 1, i + j + 2)
          })
        }

        if (this.config.edges.enabled) {
          new Array(linkedPairs.length).fill().forEach((_, j) => {
            this.parts.edges.indices.push(
              i + j,
              i + ((j + 1) % linkedPairs.length)
            )
          })
        }

        linkedPairs.forEach(([x, y, z], pairIndex) => {
          Object.entries(this.parts).forEach(([type, part]) => {
            if (this.config[type].enabled) {
              if (this.config[type].useColors) {
                const [r, g, b] = part
                  .colorGetter({
                    cell: cellIndex,
                    pair: pairIndex,
                    point: [x, y, z],
                    type: `${type}-pair`,
                  })
                  .toArray()
                part.geometry.attributes.color.array[3 * i] = r
                part.geometry.attributes.color.array[3 * i + 1] = g
                part.geometry.attributes.color.array[3 * i + 2] = b
              }
              part.geometry.attributes.position.array[3 * i] = x
              part.geometry.attributes.position.array[3 * i + 1] = y
              part.geometry.attributes.position.array[3 * i + 2] = z
            }
          })
          i++
        })
      }
    })
    Object.entries(this.parts).forEach(([type, part]) => {
      if (this.config[type].enabled) {
        if (type === 'points') {
          part.geometry.setDrawRange(0, i)
        } else {
          part.geometry.setIndex(part.indices)
        }
        part.geometry.attributes.position.needsUpdate = true
        if (this.config[type].useColors) {
          part.geometry.attributes.color.needsUpdate = true
        }
        if (type === 'faces') {
          part.geometry.computeVertexNormals()
          part.geometry.attributes.normal.needsUpdate = true
        }
      }
    })
  }
}
