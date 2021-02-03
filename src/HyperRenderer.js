export default class HyperRenderer {
  constructor(fov, w, initialRotation) {
    this.fov = fov || Math.PI / 2
    this.w = w || 10 // Camera ana

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
