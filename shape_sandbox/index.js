import {
  Scene,
  WebGLRenderer,
  Color,
  AmbientLight,
  PointLight,
  PerspectiveCamera,
  MeshLambertMaterial,
  AdditiveBlending,
  NormalBlending,
  CustomBlending,
  DoubleSide,
  LineBasicMaterial,
  LineSegments,
  TextureLoader,
  ShaderMaterial,
  PointsMaterial,
  Points,
  BufferGeometry,
  BufferAttribute,
  DynamicDrawUsage,
  Mesh,
  MeshPhongMaterial,
  MeshNormalMaterial,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

import {
  HyperMesh,
  HyperRenderer,
  HyperSlice,
  normalizeShape,
  faceColors,
  cellColors,
  wDepthColors,
  depthColors,
} from 'four-js'

import * as shapes from '../src/shapes'

const shape = normalizeShape(
  shapes[location.search.replace(/^\?/, '')] || shapes.tesseract
)
// import { default as shape } from '../src/shapes/uvw-hypersurfaces'
// import { generateUVSurface } from '../src/shapes/uv-surfaces'
// const shape = normalizeShape(
//   generateUVSurface(
//     (u, v) => [
//       (1.5 + 0.95 * Math.cos(v)) * Math.cos(u),
//       (1.5 + 0.95 * Math.cos(v)) * Math.sin(u),
//       0.95 * Math.sin(v) * Math.cos(u / 2),
//       0.95 * Math.sin(v) * Math.sin(u / 2),
//     ],
//     [0, 2 * Math.PI, 64, true, false],
//     [0, 2 * Math.PI, 64, true, true]
//   )
// )
const ws = shape.vertices.map(([, , , w]) => w)
const wmin = Math.min(...ws)
const wmax = Math.max(...ws)

const scale = 1
const showFaces = !true
const showEdges = !true
const showPoints = !true
const showSliceFaces = true
const showSliceEdges = true
const showSlicePoints = true
const stats = new Stats()
const scene = new Scene()
const splitScale = 100
const renderer = new WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
document.body.appendChild(stats.dom)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.zoom = Math.min(1, window.innerWidth / window.innerHeight)
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})

const camera = new PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.5,
  10
)
camera.position.set(0, 0, 3.5)
camera.zoom = Math.min(1, window.innerWidth / window.innerHeight)
camera.updateProjectionMatrix()
scene.add(camera)

const controls = new OrbitControls(camera, renderer.domElement)
controls.minDistance = 0.1
controls.maxDistance = 50
// Lights setup
scene.add(new AmbientLight(0x222222))
camera.add(new PointLight(0xffffff, 1))

// prettier-ignore
const hyperRenderer = new HyperRenderer(1.5, 5)

const primaryColors = [
  0xff0000,
  0x0000ff,
  0x00ff00,
  0xff00ff,
  0xffff00,
  0x00ffff,
  0x000000,
  0xffffff,
]
const hyperMesh = new HyperMesh(shape, {
  faces: {
    enabled: showFaces,
    useColors: true,
    // colorGenerator: depthColors,
    // colors: primaryColors,
    // reuse: 2,
    // split: 1,
    splitScale,
    // material: new MeshPhongMaterial({
    //   transparent: true,
    //   opacity: 0.5,
    //   blending: CustomBlending,
    //   depthTest: false,
    //   depthWrite: false,
    //   side: DoubleSide,
    //   vertexColors: true,
    // }),
    // material: new MeshNormalMaterial({
    //   vertexColors: true,
    //   side: DoubleSide,
    //   // transparent: true,
    //   // opacity: 0.25,
    //   // depthWrite: false,
    //   // blending: NormalBlending,
    // }),
  },
  edges: {
    enabled: showEdges,
    useColors: true,
    // colorGenerator: depthColors,
    // colors: primaryColors,
    // reuse: 0,
    // split: 1,
    splitScale,
  },
  points: {
    enabled: showPoints,
    useColors: true,
    // colorGenerator: depthColors,
    // colors: primaryColors,
    // reuse: 2,
    // split: 2,
    splitScale,
  },
})

scene.add(hyperMesh)

const slices = new HyperSlice(shape)
scene.add(slices)

function render() {
  stats.update()
  requestAnimationFrame(render)
  hyperRenderer.rotate({ xy: 4, xz: 4, xw: 4, yz: 4, yw: 4, zw: 4 })
  hyperRenderer.shiftSlice(0.5, wmin, wmax)
  hyperMesh.update(hyperRenderer)
  slices.update(hyperRenderer)
  renderer.render(scene, camera)
}

render()
