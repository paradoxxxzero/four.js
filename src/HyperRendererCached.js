import HyperRenderer from './HyperRenderer'

export default class HyperRendererCached extends HyperRenderer {
  constructor(fov, w, initialRotation) {
    super(fov, w, initialRotation)
    this.rotatedVertices = null
  }

  project(_, i) {
    return this._directProject(this.rotatedVertices[i])
  }

  slice(p1, p2, i1, i2) {
    return this._directSlice(this.rotatedVertices[i1], this.rotatedVertices[i2])
  }

  rotate(delta) {
    super.rotate(delta)
    this.rotatedVertices = null
  }

  prepare(vertices) {
    if (this.rotatedVertices) {
      return
    }
    this.rotatedVertices = vertices.map(vertex => this.rotatePoint(vertex))
  }
}
