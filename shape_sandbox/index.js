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
  HyperEdgesGeometry,
  HyperGeometryMergedVertices,
  HyperEdgesGeometryMergedEdges,
  HyperSliceGeometry,
  HyperPointsGeometry,
} from 'four-js'

import { permutahedronF as shape } from '../src/shapes'
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

const scale = 5
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
const lotsofcolors = new Array(128).fill().map((_, i) => `hsl(${(i * 29) % 360}, 40%, 50%)`)
const hyperRenderer = new HyperRenderer(1.5, 5)

let hyperMesh, hyperEdges, hyperPoints
const hyperGeometry = new HyperGeometryMergedVertices(
  // const hyperGeometry = new HyperGeometry(
  shape.vertices,
  shape.faces,
  shape.cells,
  hyperRenderer
)
const materials = shape.cells.map((_, i) => {
  const material = new MeshLambertMaterial()
  material.transparent = !false
  material.opacity = 0.15
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

const hyperEdgesGeometry = new HyperEdgesGeometry(hyperGeometry, hyperRenderer)

const edgeMaterials = shape.cells.map((_, i) => {
  const material = new LineBasicMaterial()
  material.opacity = 0.1
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
// const hyperEdgesGeometry = new HyperEdgesGeometryMergedEdges(
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

const slicePointsMaterial = new ShaderMaterial({
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
slicePointsMaterial.transparent = true
slicePointsMaterial.opacity = 0.15
slicePointsMaterial.blending = AdditiveBlending
slicePointsMaterial.depthWrite = false

const sliceEdgesMaterial = new LineBasicMaterial()
sliceEdgesMaterial.opacity = 0.5
sliceEdgesMaterial.transparent = true
sliceEdgesMaterial.blending = AdditiveBlending
// sliceEdgesMaterial.depthWrite = false
sliceEdgesMaterial.linewidth = 5
sliceEdgesMaterial.vertexColors = true

const sliceMaterial = new MeshPhongMaterial()
// sliceMaterial.opacity = 0.75
// sliceMaterial.transparent = true
sliceMaterial.shininess = 50
sliceMaterial.vertexColors = true
// sliceMaterial.blending = CustomBlending
// sliceMaterial.depthWrite = false
sliceMaterial.side = DoubleSide
// sliceMaterial.color = new Color(0xffffff)

const slices = new HyperSliceGeometry(shape, hyperRenderer, {
  useColors: true,
  useFaces: showSliceFaces,
  useEdges: showSliceEdges,
  usePoints: showSlicePoints,
  colors: lotsofcolors,
})

const slicesPointsMesh = new Points(slices.pointGeometry, slicePointsMaterial)
slicesPointsMesh.visible = showSlicePoints
slicesPointsMesh.scale.setScalar(scale)
scene.add(slicesPointsMesh)

const slicesEdgesMesh = new LineSegments(
  slices.edgeGeometry,
  sliceEdgesMaterial
)
slicesEdgesMesh.visible = showSliceEdges
slicesEdgesMesh.scale.setScalar(scale)
scene.add(slicesEdgesMesh)

const slicesMesh = new Mesh(slices.geometry, sliceMaterial)
slicesMesh.visible = showSliceFaces
slicesMesh.scale.setScalar(scale)

scene.add(slicesMesh)

function render() {
  stats.update()
  requestAnimationFrame(render)
  // hyperRenderer.rotate({ xy: 2, xz: 2, xw: 2, yz: 2, yw: 2, zw: 2 })
  hyperRenderer.shiftSlice(0.25, wmin, wmax)
  hyperMesh.update()
  showEdges && hyperEdges.update()
  showPoints && hyperPoints.update()
  ;(showSliceFaces || showSliceEdges || showSlicePoints) && slices.update()
  renderer.render(scene, camera)
}

render()
