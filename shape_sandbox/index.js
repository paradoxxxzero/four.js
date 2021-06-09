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
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

import {
  HyperMesh,
  HyperGeometry,
  HyperRenderer,
  HyperGeometryMergedVertices,
  HyperEdgesGeometryMergedEdges,
  HyperSliceGeometry,
  faceColors,
  cellColors,
  wDepthColors,
  depthColors,
} from 'four-js'

import { tesseract as shape } from '../src/shapes'
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

const ws = shape.vertices.map(([, , , w]) => w)
const wmin = Math.min(...ws)
const wmax = Math.max(...ws)

const scale = 0.8
const showFaces = !true
const showEdges = !true
const showPoints = !true
const showSliceFaces = true
const showSliceEdges = true
const showSlicePoints = true
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
const lotsofcolors = new Array(128).fill().map((_, i) => `hsl(${(i * 29) % 360}, 60%, 60%)`)
const hyperRenderer = new HyperRenderer(1.5, 5)

const material = new MeshPhongMaterial()
material.transparent = true
material.opacity = 0.25
material.blending = NormalBlending
material.depthWrite = false

material.side = DoubleSide
material.vertexColors = true

const edgesMaterial = new LineBasicMaterial()
// edgesMaterial.opacity = 0.1
// edgesMaterial.transparent = true
// edgesMaterial.depthWrite = false
// edgesMaterial.blending = AdditiveBlending
edgesMaterial.linewidth = 2
edgesMaterial.vertexColors = true
// edgesMaterial.color = new Color(0xffffff)

const pointsMaterial = new ShaderMaterial({
  uniforms: {
    size: { value: 5 },
    opacity: { value: 0.25 },
  },
  vertexShader: `uniform float size;
    attribute vec3 color;
    varying vec3 vColor;
  
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    
      gl_PointSize = size * ( 10.0 / - mvPosition.z );
    
      gl_Position = projectionMatrix * mvPosition;
    }`,
  fragmentShader: `
    uniform float opacity;
    varying vec3 vColor;
  
      void main() {
      
        if (length(gl_PointCoord - vec2( 0.5, 0.5 )) > 0.475) discard;
      
        gl_FragColor = vec4(vColor, opacity );
      } `,
})
pointsMaterial.transparent = true
pointsMaterial.depthWrite = false

const hyperGeometry = new HyperGeometry(shape, hyperRenderer, {
  useColors: true,
  useFaces: true,
  useEdges: true,
  usePoints: true,
  colors: [
    0xff0000,
    0x0000ff,
    0x00ff00,
    0xff00ff,
    0xffff00,
    0x00ffff,
    0x000000,
    0xffffff,
  ],
  colorGenerator: depthColors,
})

const hyperMesh = new HyperMesh(hyperGeometry.geometries, material)
hyperMesh.cellSize = cellSize
hyperMesh.scale.setScalar(scale)
hyperMesh.visible = showFaces
scene.add(hyperMesh)

const hyperEdges = new HyperMesh(
  hyperGeometry.edgesGeometries,
  edgesMaterial,
  LineSegments
)
hyperEdges.cellSize = cellSize
hyperEdges.scale.setScalar(scale)
hyperEdges.visible = showEdges
scene.add(hyperEdges)

const hyperPoints = new HyperMesh(
  hyperGeometry.pointsGeometries,
  pointsMaterial,
  Points
)
hyperPoints.cellSize = cellSize
hyperPoints.scale.setScalar(scale)
hyperPoints.visible = showPoints
scene.add(hyperPoints)

const slices = new HyperSliceGeometry(shape, hyperRenderer, {
  useColors: true,
  useFaces: showSliceFaces,
  useEdges: showSliceEdges,
  usePoints: showSlicePoints,
  colors: lotsofcolors,
})

const slicesPointsMesh = new Points(slices.pointGeometry, pointsMaterial)
slicesPointsMesh.visible = showSlicePoints
slicesPointsMesh.scale.setScalar(scale)
scene.add(slicesPointsMesh)

const slicesEdgesMesh = new LineSegments(slices.edgeGeometry, edgesMaterial)
slicesEdgesMesh.visible = showSliceEdges
slicesEdgesMesh.scale.setScalar(scale)
scene.add(slicesEdgesMesh)

const slicesMesh = new Mesh(slices.geometry, material)
slicesMesh.visible = showSliceFaces
slicesMesh.scale.setScalar(scale)

scene.add(slicesMesh)

function render() {
  stats.update()
  requestAnimationFrame(render)
  hyperRenderer.rotate({ xy: 4, xz: 4, xw: 4, yz: 4, yw: 4, zw: 4 })
  hyperRenderer.shiftSlice(0.5, wmin, wmax)
  ;(showFaces || showEdges || showPoints) && hyperGeometry.update()
  showFaces && hyperMesh.update()
  showEdges && hyperEdges.update()
  showPoints && hyperPoints.update()
  ;(showSliceFaces || showSliceEdges || showSlicePoints) && slices.update()
  renderer.render(scene, camera)
}

render()
