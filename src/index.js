import HyperMesh from './HyperMesh'
import HyperRenderer from './HyperRenderer'
import HyperRendererCached from './HyperRendererCached'
import HyperSlice from './HyperSlice'
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
  HyperRendererCached,
  HyperSlice,
  normalizeShape,
  uniformColors,
  cellColors,
  faceColors,
  wDepthColors,
  depthColors,
  shapes,
}
