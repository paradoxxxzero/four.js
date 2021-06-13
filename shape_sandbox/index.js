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
  MeshPhysicalMaterial,
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

const showFaces = true
const showEdges = true
const showPoints = !true
const showSliceFaces = !true
const showSliceEdges = !true
const showSlicePoints = !true
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
controls.maxDistance = 9
// Lights setup
scene.add(new AmbientLight(0x222222))
let light = new PointLight(0xffffff, 1)
light.position.set(-1, 1, 5)
camera.add(light)
// light = new PointLight(0xffffff, 1)
// light.position.set(1, -2, 4)
// camera.add(light)
// light = new PointLight(0xffffff, 1)
// light.position.set(-3, -1, 2)
// camera.add(light)
// light = new PointLight(0xffffff, 1)
// light.position.set(4, -6, -4)
// camera.add(light)

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
    // reuse: 0,
    // split: 1,
    splitScale,
    // material: new ShaderMaterial({
    //   transparent: true,
    //   blending: NormalBlending,
    //   depthTest: false,
    //   depthWrite: false,
    //   uniforms: {
    //     mRefractionRatio: { value: 1.02 },
    //     mFresnelBias: { value: 0.1 },
    //     mFresnelPower: { value: 2.0 },
    //     mFresnelScale: { value: 1.0 },
    //     tCube: { value: textureCube },
    //   },
    //   vertexShader: `
    //   uniform float mRefractionRatio;
    //   uniform float mFresnelBias;
    //   uniform float mFresnelScale;
    //   uniform float mFresnelPower;
    //   varying vec3 vReflect;
    //   varying vec3 vRefract[3];
    //   varying float vReflectionFactor;
    //   void main() {
    //     vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    //     vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    //     vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    //     vec3 I = worldPosition.xyz - cameraPosition;
    //     vReflect = reflect( I, worldNormal );
    //     vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
    //     vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );
    //     vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );
    //     vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );
    //     gl_Position = projectionMatrix * mvPosition;
    //   }`,
    //   fragmentShader: `
    //   uniform samplerCube tCube;
    //   varying vec3 vReflect;
    //   varying vec3 vRefract[3];
    //   varying float vReflectionFactor;
    //   void main() {
    //     vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
    //     vec4 refractedColor = vec4( 1.0 );
    //     refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
    //     refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
    //     refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

    //     gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );
    //   }`,
    // }),
    material: new MeshPhysicalMaterial({
      transparent: true,
      // opacity: 1,
      transmission: 0.9,
      blending: CustomBlending,
      // depthTest: false,
      depthWrite: false,
      side: DoubleSide,
      premultipliedAlpha: true,
      vertexColors: true,
      // color: new Color(0x0000ff),
      // shininess: 100,
      roughness: 0.7,
      clearcoat: 1,
      clearcoatRoughness: 0.4,
      // metalness: 1,
      // reflectivity: 1,
    }),
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
    material: new LineBasicMaterial({
      transparent: true,
      opacity: 0.1,
      // blending: AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      linewidth: 2,
      // color: new Color(0x2244ff),
    }),
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

const slices = new HyperSlice(shape, {
  faces: {
    enabled: showSliceFaces,
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
    enabled: showSliceEdges,
    useColors: true,
    // colorGenerator: depthColors,
    // colors: primaryColors,
    // reuse: 0,
    // split: 1,
    splitScale,
  },
  points: {
    enabled: showSlicePoints,
    useColors: true,
    // colorGenerator: depthColors,
    // colors: primaryColors,
    // reuse: 2,
    // split: 2,
    splitScale,
  },
})
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
