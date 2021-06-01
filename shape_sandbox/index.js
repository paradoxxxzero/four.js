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
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

import disc from './disc.png'
import {
  HyperMesh,
  HyperGeometry,
  HyperRenderer,
  HyperEdgeGeometry,
  HyperGeometryMergedVertices,
  HyperEdgeGeometryMergedEdges,
  HyperPointsGeometry,
} from 'four-js'

import { hecatonicosachoronTruncated as shape } from '../src/shapes'
// import { default as shape } from '../src/shapes/uvw-hypersurfaces'
// import { generateUVSurface } from '../src/shapes/uv-surfaces'
// const shape = generateUVSurface(
//   (u, v) => [
//     (1.5 + 0.95 * Math.cos(v)) * Math.cos(u),
//     (1.5 + 0.95 * Math.cos(v)) * Math.sin(u),
//     0.95 * Math.sin(v) * Math.cos(u / 2),
//     0.95 * Math.sin(v) * Math.sin(u / 2),
//   ],
//   [0, 2 * Math.PI, 32, true, false],
//   [0, 2 * Math.PI, 32, true]
// )

const scale = 2
const showFaces = true
const showEdges = true
const showPoints = !true
const stats = new Stats()
const scene = new Scene()
const cellSize = 100
const renderer = new WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
document.body.appendChild(stats.dom)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})

const camera = new PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  100
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
const lotsofcolors = ['#e06c75', '#98c379', '#d19a66', '#61afef', '#c678dd', '#56b6c2', '#ffffff', '#ff6188', '#a9dc76', '#ffd866', '#fc9867', '#ab9df2', '#78dce8', '#fcfcfa', '#705050', '#60b48a', '#dfaf8f', '#506070', '#dc8cc3', '#8cd0d3', '#dcdccc', '#709080', '#dca3a3', '#c3bf9f', '#f0dfaf', '#94bff3', '#ec93d3', '#93e0e3', '#263238', '#ff9800', '#8bc34a', '#ffc107', '#03a9f4', '#e91e63', '#009688', '#cfd8dc', '#37474f', '#ffa74d', '#9ccc65', '#ffa000', '#81d4fa', '#ad1457', '#26a69a', '#eceff1']

const hyperRenderer = new HyperRenderer(1.5, 5)

let hyperMesh, hyperEdges, hyperPoints
// const hyperGeometry = new HyperGeometryMergedVertices(
const hyperGeometry = new HyperGeometry(
  shape.vertices,
  shape.faces,
  shape.cells,
  hyperRenderer
)
const materials = shape.cells.map((_, i) => {
  const material = new MeshLambertMaterial()
  material.transparent = !false
  material.opacity = 0.25
  material.blending = CustomBlending
  material.side = DoubleSide
  material.depthWrite = false
  // material.depthTest = false
  // material.premultipliedAlpha = true
  material.color = new Color(lotsofcolors[i % (lotsofcolors.length - 1)])
  return material
})
hyperMesh = new HyperMesh(hyperGeometry, materials)
hyperMesh.cellSize = cellSize
hyperMesh.scale.setScalar(scale)
hyperMesh.visible = showFaces
scene.add(hyperMesh)

const hyperEdgesGeometry = new HyperEdgeGeometry(hyperGeometry, hyperRenderer)

const edgeMaterials = shape.cells.map((_, i) => {
  const material = new LineBasicMaterial()
  material.opacity = 0.01
  material.transparent = true
  material.blending = AdditiveBlending
  material.depthWrite = false
  material.linewidth = 1
  material.color = new Color(lotsofcolors[i % (lotsofcolors.length - 1)])
  return material
})
hyperEdges = new HyperMesh(hyperEdgesGeometry, edgeMaterials, LineSegments)
hyperEdges.cellSize = cellSize
hyperEdges.scale.setScalar(scale)
hyperEdges.visible = showEdges
scene.add(hyperEdges)
// const hyperEdgesGeometry = new HyperEdgeGeometryMergedEdges(
//   hyperGeometry,
//   hyperRenderer
// )

// const edgeMaterials = new LineBasicMaterial()
// edgeMaterials.opacity = 0.1
// edgeMaterials.transparent = true
// edgeMaterials.blending = AdditiveBlending
// edgeMaterials.side = DoubleSide
// edgeMaterials.depthWrite = false
// edgeMaterials.linewidth = 1
// edgeMaterials.color = new Color(lotsofcolors[0 % (lotsofcolors.length - 1)])

// hyperEdges = new HyperMesh(hyperEdgesGeometry, edgeMaterials, LineSegments)
// hyperEdges.cellSize = cellSize
// hyperEdges.scale.setScalar(scale)
// hyperEdges.visible = showEdges
// scene.add(hyperEdges)

const hyperPointsGeometry = new HyperPointsGeometry(
  hyperGeometry,
  hyperRenderer
)

// const DOT = new TextureLoader().load(disc)
// const pointsMaterials = shape.cells.map((_, i) => {
//   const material = new PointsMaterial()
//   material.map = DOT
//   material.size = 0.25
//   material.alphaTest = 0.5
//   material.color = new Color(lotsofcolors[i % (lotsofcolors.length - 1)])

//   return material
// })
const pointsMaterials = shape.cells.map((_, i) => {
  const material = new ShaderMaterial({
    uniforms: {
      size: { value: 5 },
      opacity: { value: 0.5 },
      color: { value: new Color(lotsofcolors[i % (lotsofcolors.length - 1)]) },
    },
    vertexShader: `uniform float size;
    
    void main() {
    
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    
      gl_PointSize = size * ( 10.0 / - mvPosition.z );
    
      gl_Position = projectionMatrix * mvPosition;
    }`,
    fragmentShader: `
    uniform vec3 color;
    uniform float opacity;

      void main() {
      
        if (length(gl_PointCoord - vec2( 0.5, 0.5 )) > 0.475) discard;
      
        gl_FragColor = vec4(color, opacity );
      } `,
  })
  material.transparent = true
  material.depthWrite = false
  return material
})
hyperPoints = new HyperMesh(hyperPointsGeometry, pointsMaterials, Points)
hyperPoints.cellSize = cellSize
hyperPoints.scale.setScalar(scale)
hyperPoints.visible = showPoints
scene.add(hyperPoints)

function render() {
  stats.update()
  requestAnimationFrame(render)
  hyperRenderer.rotate({ xy: 0, xz: 0, xw: 5, yz: 0, yw: 10, zw: 10 })
  hyperMesh.update()
  showEdges && hyperEdges.update()
  showPoints && hyperPoints.update()
  renderer.render(scene, camera)
}

render()
