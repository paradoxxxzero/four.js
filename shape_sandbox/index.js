import {
  Scene,
  WebGLRenderer,
  Color,
  AmbientLight,
  PointLight,
  PerspectiveCamera,
  MeshLambertMaterial,
  AdditiveBlending,
  DoubleSide,
  LineBasicMaterial,
  LineSegments,
  TextureLoader,
  PointsMaterial,
  Points,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import disc from './disc.png'
import {
  HyperMesh,
  HyperGeometry,
  HyperRenderer,
  HyperEdgeGeometry,
  HyperPointsGeometry,
} from 'four-js'

const shape = {
  vertices: [
    [1, 1, 1, -1 / Math.sqrt(5)], // 0
    [1, -1, -1, -1 / Math.sqrt(5)], // 1
    [-1, 1, -1, -1 / Math.sqrt(5)], // 2
    [-1, -1, 1, -1 / Math.sqrt(5)], // 3
    [0, 0, 0, Math.sqrt(5) - 1 / Math.sqrt(5)], // 4
  ],
  faces: [
    [1, 2, 3], // 0
    [0, 1, 2], // 1
    [0, 1, 3], // 2
    [0, 3, 2], // 3

    [0, 4, 1], // 4
    [0, 2, 4], // 5
    [0, 3, 4], // 6

    [2, 4, 3], // 7
    [1, 3, 4], // 8
    [1, 4, 2], // 9
  ],
  cells: [
    [0, 1, 2, 3], // 0
    [1, 5, 4, 9], // 1
    [3, 6, 5, 7], // 2
    [2, 4, 6, 8], // 3
    [0, 7, 8, 9], // 4
  ],
}
const showFaces = true
const showEdges = true
const showPoints = true

const scene = new Scene()

const renderer = new WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})

const camera = new PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  1000
)
camera.position.set(0, 0, 10)
scene.add(camera)

const controls = new OrbitControls(camera, renderer.domElement)
controls.minDistance = 2
controls.maxDistance = 50
// Lights setup
scene.add(new AmbientLight(0x222222))
camera.add(new PointLight(0xffffff, 1))

// prettier-ignore
const lotsofcolors = ['#5c6370', '#e06c75', '#98c379', '#d19a66', '#61afef', '#c678dd', '#56b6c2', '#ffffff', '#403e41', '#ff6188', '#a9dc76', '#ffd866', '#fc9867', '#ab9df2', '#78dce8', '#fcfcfa', '#1e2320', '#705050', '#60b48a', '#dfaf8f', '#506070', '#dc8cc3', '#8cd0d3', '#dcdccc', '#709080', '#dca3a3', '#c3bf9f', '#f0dfaf', '#94bff3', '#ec93d3', '#93e0e3', '#263238', '#ff9800', '#8bc34a', '#ffc107', '#03a9f4', '#e91e63', '#009688', '#cfd8dc', '#37474f', '#ffa74d', '#9ccc65', '#ffa000', '#81d4fa', '#ad1457', '#26a69a', '#eceff1']

const hyperRenderer = new HyperRenderer(1.5, 5)

let hyperMesh, hyperEdges, hyperPoints
if (showFaces) {
  const hyperGeometry = new HyperGeometry(
    shape.vertices,
    shape.faces,
    shape.cells,
    hyperRenderer
  )
  const materials = shape.cells.map((_, i) => {
    const material = new MeshLambertMaterial()
    material.transparent = true
    material.opacity = 0.1
    material.blending = AdditiveBlending
    material.side = DoubleSide
    material.depthWrite = false
    material.color = new Color(lotsofcolors[i] || 0xffffff)
    return material
  })
  hyperMesh = new HyperMesh(hyperGeometry, materials)
  scene.add(hyperMesh)
}

if (showEdges) {
  const hyperEdgesGeometry = new HyperEdgeGeometry(
    shape.vertices,
    shape.faces,
    shape.cells,
    hyperRenderer
  )

  const edgeMaterials = shape.cells.map((_, i) => {
    const material = new LineBasicMaterial()
    material.opacity = 0.1
    material.transparent = true
    material.blending = AdditiveBlending
    material.side = DoubleSide
    material.depthWrite = false
    material.linewidth = 2
    material.color = new Color(lotsofcolors[i] || 0xffffff)
    return material
  })
  hyperEdges = new HyperMesh(hyperEdgesGeometry, edgeMaterials, LineSegments)
  scene.add(hyperEdges)
}

if (showPoints) {
  const hyperPointsGeometry = new HyperPointsGeometry(
    shape.vertices,
    shape.faces,
    shape.cells,
    hyperRenderer
  )

  const DOT = new TextureLoader().load(disc)
  const pointsMaterials = shape.cells.map((_, i) => {
    const material = new PointsMaterial()
    material.map = DOT
    material.size = 0.25
    material.alphaTest = 0.5
    material.color = new Color(lotsofcolors[i] || 0xffffff)

    return material
  })
  hyperPoints = new HyperMesh(hyperPointsGeometry, pointsMaterials, Points)
  scene.add(hyperPoints)
}

function render() {
  requestAnimationFrame(render)
  hyperRenderer.rotate({ xy: 0, xz: 0, xw: 5, yz: 0, yw: 10, zw: 10 })
  showFaces && hyperMesh.update()
  showEdges && hyperEdges.update()
  showPoints && hyperPoints.update()
  renderer.render(scene, camera)
}

render()
