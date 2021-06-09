export const normalizeShape = (shape, base = 1) => {
  const max = Math.max(
    ...shape.vertices.map(p => Math.sqrt(p.reduce((s, c) => s + c * c, 0)))
  )
  const scale = base / max
  return {
    ...shape,
    vertices: shape.vertices.map(p => p.map(c => c * scale)),
  }
}
