export const generateOctahedraloidBiPyramid = (
  [xmin, xmax],
  [ymin, ymax],
  [zmin, zmax],
  [wmin, wmax]
) => ({
  vertices: [
    [xmin, 0.0, 0.0, 0.0],
    [0.0, ymin, 0.0, 0.0],
    [0.0, 0.0, zmin, 0.0],
    [0.0, 0.0, 0.0, wmin],
    [0.0, 0.0, 0.0, wmax],
    [0.0, 0.0, zmax, 0.0],
    [0.0, ymax, 0.0, 0.0],
    [xmax, 0.0, 0.0, 0.0],
  ],
  faces: [
    [4, 5, 6],
    [3, 5, 6],
    [3, 4, 6],
    [3, 4, 5],
    [2, 5, 6],
    [2, 4, 6],
    [2, 4, 5],
    [1, 5, 6],
    [1, 3, 6],
    [1, 3, 5],
    [1, 2, 6],
    [1, 2, 5],
    [0, 4, 6],
    [0, 3, 6],
    [0, 3, 4],
    [0, 2, 6],
    [0, 2, 4],
    [0, 1, 6],
    [0, 1, 3],
    [0, 1, 2],
  ],
  cells: [
    [0, 1, 2, 3],
    [0, 4, 5, 6],
    [1, 7, 8, 9],
    [4, 7, 10, 11],
    [2, 12, 13, 14],
    [5, 12, 15, 16],
    [8, 13, 17, 18],
    [10, 15, 17, 19],
    [3, 6, 9, 11, 14, 16, 18, 19],
  ],
})

export const generateOctahedralBiPyramid = d =>
  generateOctahedraloidBiPyramid([-d, d], [-d, d], [-d, d], [-d, d])

export const octahedraloidBiPyramid = generateOctahedraloidBiPyramid(
  [-0.25, 0.25],
  [-0.5, 0.5],
  [-0.75, 0.75],
  [-1, 1]
)
export default generateOctahedralBiPyramid(1)
