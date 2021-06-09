import HyperGeometry from './HyperGeometry'
import HyperMesh from './HyperMesh'
import HyperRenderer from './HyperRenderer'
import HyperSliceGeometry from './HyperSliceGeometry'
import * as shapes from './shapes'
import {
  uniformColors,
  cellColors,
  faceColors,
  wDepthColors,
  depthColors,
} from './colorGenerators'
import { normalizeShape } from './helpers'

export {
  HyperMesh,
  HyperRenderer,
  HyperGeometry,
  HyperSliceGeometry,
  normalizeShape,
  uniformColors,
  cellColors,
  faceColors,
  wDepthColors,
  depthColors,
  shapes,
}
