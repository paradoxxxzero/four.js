export const generateCuboidPyramid = (
  [xmin, xmax],
  [ymin, ymax],
  [zmin, zmax],
  w
) => ({
  vertices: [
    [xmin, ymin, zmin, 0.0],
    [xmin, ymin, zmax, 0.0],
    [xmin, ymax, zmin, 0.0],
    [xmin, ymax, zmax, 0.0],
    [xmax, ymin, zmin, 0.0],
    [xmax, ymin, zmax, 0.0],
    [xmax, ymax, zmin, 0.0],
    [xmax, ymax, zmax, 0.0],
    [0.0, 0.0, 0.0, w],
  ],
  faces: [
    [1, 5, 8],
    [4, 5, 8],
    [0, 4, 8],
    [0, 1, 8],
    [0, 1, 5, 4],
    [2, 6, 8],
    [4, 6, 8],
    [0, 2, 8],
    [0, 2, 6, 4],
    [1, 3, 8],
    [2, 3, 8],
    [0, 1, 3, 2],
    [5, 7, 8],
    [6, 7, 8],
    [4, 5, 7, 6],
    [3, 7, 8],
    [2, 3, 7, 6],
    [1, 3, 7, 5],
  ],
  cells: [
    [0, 1, 2, 3, 4],
    [5, 6, 2, 7, 8],
    [9, 10, 7, 3, 11],
    [12, 13, 6, 1, 14],
    [15, 13, 5, 10, 16],
    [15, 12, 0, 9, 17],
    [4, 8, 11, 14, 16, 17],
  ],
})
export const generateCubicPyramid = d =>
  generateCuboidPyramid([-d, d], [-d, d], [-d, d], d)

export const cuboidPyramid = generateCuboidPyramid(
  [-0.25, 0.25],
  [-0.5, 0.5],
  [-0.75, 0.75],
  1
)
export default generateCubicPyramid(1)
