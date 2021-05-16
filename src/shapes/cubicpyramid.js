export const generateCuboidPyramid = (
  [xmin, xmax],
  [ymin, ymax],
  [zmin, zmax],
  w
) => ({
  vertices: [
    [xmin, ymin, zmin, w],
    [xmin, ymax, zmin, w],
    [xmin, ymin, zmax, w],
    [xmax, ymin, zmin, w],
    [xmin, ymax, zmax, w],
    [xmax, ymin, zmax, w],
    [xmax, ymax, zmin, w],
    [xmax, ymax, zmax, w],
    [0, 0, 0, 0],
  ],
  faces: [
    [0, 1, 6, 3], // 0
    [6, 8, 1], // 1
    [3, 8, 6], // 2
    [0, 8, 3], // 3
    [1, 8, 0], // 4
    [0, 3, 5, 2], // 5
    [3, 8, 5], // 6
    [5, 8, 2], // 7
    [2, 8, 0], // 8
    [1, 0, 2, 4], // 9
    [4, 8, 2], // 10
    [1, 8, 4], // 11
    [4, 1, 6, 7], // 12
    [7, 8, 6], // 13
    [4, 8, 7], // 14
    [3, 5, 7, 6], // 15
    [5, 8, 7], // 16
    [2, 4, 7, 5], // 17
  ],
  cells: [
    [0, 1, 2, 3, 4],
    [5, 2, 6, 7, 8],
    [9, 4, 8, 10, 11],
    [12, 1, 11, 13, 14],
    [15, 2, 6, 13, 16],
    [17, 7, 10, 14, 16],
    [0, 5, 9, 12, 15, 17],
  ],
})
export const generateCubicPyramid = d =>
  generateCuboidPyramid([-d, d], [-d, d], [-d, d], d)

export const cuboidpyramid = generateCuboidPyramid(
  [-0.25, 0.25],
  [-0.5, 0.5],
  [-0.75, 0.75],
  1
)
export default generateCubicPyramid(1)
