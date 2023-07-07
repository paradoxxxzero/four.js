import HyperMesh from './HyperMesh'
import HyperRenderer from './HyperRenderer'
import HyperRendererCached from './HyperRendererCached'
import HyperSlice from './HyperSlice'
import {
  uniformColors,
  cellColors,
  faceColors,
  wDepthColors,
  depthColors,
} from './colorGenerators'
import { normalizeShape } from './helpers'
import {
  cuboidPyramid,
  generateCubicPyramid,
  generateCuboidPyramid,
  cuboidBiPyramid,
  generateCubicBiPyramid,
  generateCuboidBiPyramid,
  hexadecachoron,
  icositetrachoron,
  octahedraloidPyramid,
  generateOctahedralPyramid,
  generateOctahedraloidPyramid,
  octahedraloidBiPyramid,
  generateOctahedralBiPyramid,
  generateOctahedraloidBiPyramid,
  pentachoron,
  tesseract,
  hyperCuboid,
  generateTesseract,
  generateHyperCuboid,
} from './shapes'

const shapes = {
  cuboidPyramid,
  generateCubicPyramid,
  generateCuboidPyramid,
  cuboidBiPyramid,
  generateCubicBiPyramid,
  generateCuboidBiPyramid,
  hexadecachoron,pentachoron,icositetrachoron,
  octahedraloidPyramid,
  generateOctahedralPyramid,
  generateOctahedraloidPyramid,
  octahedraloidBiPyramid,
  generateOctahedralBiPyramid,
  generateOctahedraloidBiPyramid,
  pentachoron,
  tesseract,
  hyperCuboid,
  generateTesseract,
  generateHyperCuboid,
}

export {
  HyperMesh,
  HyperRenderer,
  HyperRendererCached,
  HyperSlice,
  normalizeShape,
  uniformColors,
  cellColors,
  faceColors,
  wDepthColors,
  depthColors,
  shapes
}
