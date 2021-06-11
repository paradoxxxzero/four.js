import { Color } from 'three'

export const uniformColors =
  ({ colors }) =>
  ({ type }) =>
    colors[
      (type.startsWith('faces') ? 0 : type.startsWith('edges') ? 1 : 2) %
        colors.length
    ]

export const cellColors =
  ({ colors }) =>
  ({ cell }) =>
    colors[(cell || 0) % colors.length]

export const faceColors =
  ({ colors }) =>
  ({ cell, face, type }) =>
    colors[((type === 'faces' ? face : cell) || 0) % colors.length]

export const wDepthColors = ({ shape, colors }) => {
  const ws = shape.vertices.map(([, , , w]) => w)
  const wmin = Math.min(...ws)
  const wmax = Math.max(...ws)
  return ({ vertex }) =>
    new Color().lerpColors(
      colors[0],
      colors[1],
      (shape.vertices[vertex][3] - wmin) / (wmax - wmin)
    )
}

export const depthColors = ({ shape, colors }) => {
  const xs = shape.vertices.map(([x]) => x)
  const ys = shape.vertices.map(([, y]) => y)
  const zs = shape.vertices.map(([, , z]) => z)
  const ws = shape.vertices.map(([, , , w]) => w)
  const xmin = Math.min(...xs)
  const xmax = Math.max(...xs)
  const ymin = Math.min(...ys)
  const ymax = Math.max(...ys)
  const zmin = Math.min(...zs)
  const zmax = Math.max(...zs)
  const wmin = Math.min(...ws)
  const wmax = Math.max(...ws)

  return ({ vertex }) => {
    const [x, y, z, w] = shape.vertices[vertex]
    const xColor = new Color().lerpColors(
      colors[0],
      colors[1],
      (x - xmin) / (xmax - xmin)
    )
    const yColor = new Color().lerpColors(
      colors[2],
      colors[3],
      (y - ymin) / (ymax - ymin)
    )
    const zColor = new Color().lerpColors(
      colors[4],
      colors[5],
      (z - zmin) / (zmax - zmin)
    )
    const wColor = new Color().lerpColors(
      colors[6],
      colors[7],
      (w - wmin) / (wmax - wmin)
    )
    return xColor.lerp(yColor, 0.5).lerp(zColor, 0.5).lerp(wColor, 0.5)
  }
}
