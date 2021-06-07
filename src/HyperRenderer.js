export default class HyperRenderer {
  constructor(fov, w, initialRotation) {
    this.fov = fov || Math.PI / 2
    this.w = w || 10 // Camera ana

    this.wt = 0
    this.wSlice = 0

    this.rotation = initialRotation || {
      xy: 0,
      xz: 0,
      xw: 0,
      yz: 0,
      yw: 0,
      zw: 0,
    }
  }

  project([xo, yo, zo, wo]) {
    const [x, y, z, w] = this.rotatePoint([xo, yo, zo, wo])
    const zoom = 1 + (w * this.fov) / this.w
    return [x / zoom, y / zoom, z / zoom]
  }

  sliceProject(p1, p2) {
    const [x1, y1, z1, w1] = p1
    const [x2, y2, z2, w2] = p2
    // const [x1, y1, z1, w1] = this.rotatePoint(p1)
    // const [x2, y2, z2, w2] = this.rotatePoint(p2)
    if ((this.wSlice - w1) * (this.wSlice - w2) >= 0) {
      return
    }
    const a = (this.wSlice - w1) / (w2 - w1)
    const x = x1 + a * (x2 - x1)
    const y = y1 + a * (y2 - y1)
    const z = z1 + a * (z2 - z1)

    return this.project([x, y, z, this.wSlice])
    // const zoom = 1 + (this.wSlice * this.fov) / this.w
    // return [x / zoom, y / zoom, z / zoom]
  }

  slice(p1, p2) {
    const [x1, y1, z1, w1] = this.rotatePoint(p1)
    const [x2, y2, z2, w2] = this.rotatePoint(p2)
    if ((this.wSlice - w1) * (this.wSlice - w2) >= 0) {
      return
    }
    const a = (this.wSlice - w1) / (w2 - w1)
    const x = x1 + a * (x2 - x1)
    const y = y1 + a * (y2 - y1)
    const z = z1 + a * (z2 - z1)

    return [x, y, z]
  }

  shiftSlice(delta, min, max) {
    this.wt += delta / 100
    const t = (1 + Math.cos(this.wt)) * 0.5
    this.wSlice = min + (max - min) * t
  }

  rotate(delta) {
    Object.keys(this.rotation).forEach(k => {
      this.rotation[k] =
        (this.rotation[k] + (delta[k] || 0) / 1000) % (2 * Math.PI)
    })
  }

  rotatePoint([x, y, z, w]) {
    const { xy, xz, xw, yz, yw, zw } = this.rotation
    const cxy = Math.cos(xy)
    const sxy = Math.sin(xy)
    const cxz = Math.cos(xz)
    const sxz = Math.sin(xz)
    const cxw = Math.cos(xw)
    const sxw = Math.sin(xw)
    const cyz = Math.cos(yz)
    const syz = Math.sin(yz)
    const cyw = Math.cos(yw)
    const syw = Math.sin(yw)
    const czw = Math.cos(zw)
    const szw = Math.sin(zw)

    let t = x
    x = x * cxy + y * sxy
    y = y * cxy - t * sxy
    t = x
    x = x * cxz + z * sxz
    z = z * cxz - t * sxz
    t = x
    x = x * cxw + w * sxw
    w = w * cxw - t * sxw
    t = y
    y = y * cyz + z * syz
    z = z * cyz - t * syz
    t = y
    y = y * cyw + w * syw
    w = w * cyw - t * syw
    t = z
    z = z * czw + w * szw
    w = w * czw - t * szw
    return [x, y, z, w]
  }
}
