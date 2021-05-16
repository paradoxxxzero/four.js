export const generateHyperCuboid = (
  [xmin, xmax],
  [ymin, ymax],
  [zmin, zmax],
  [wmin, wmax]
) => ({
  vertices: [
    [xmax, ymax, zmax, wmax], // 0
    [xmax, ymax, zmin, wmax], // 1
    [xmax, ymin, zmin, wmax], // 2
    [xmax, ymin, zmax, wmax], // 3
    [xmin, ymax, zmax, wmax], // 4
    [xmin, ymax, zmin, wmax], // 5
    [xmin, ymin, zmin, wmax], // 6
    [xmin, ymin, zmax, wmax], // 7
    [xmax, ymax, zmax, wmin], // 8
    [xmax, ymax, zmin, wmin], // 9
    [xmax, ymin, zmin, wmin], // 10
    [xmax, ymin, zmax, wmin], // 11
    [xmin, ymax, zmax, wmin], // 12
    [xmin, ymax, zmin, wmin], // 13
    [xmin, ymin, zmin, wmin], // 14
    [xmin, ymin, zmax, wmin], // 15
  ],
  faces: [
    [0, 1, 2, 3], // 0
    [0, 4, 5, 1], // 1
    [0, 3, 7, 4], // 2
    [3, 2, 6, 7], // 3
    [1, 5, 6, 2], // 4
    [4, 7, 6, 5], // 5

    [0, 1, 9, 8], // 6
    [4, 5, 13, 12], // 7
    [3, 2, 10, 11], // 8
    [7, 6, 14, 15], // 9

    [0, 3, 11, 8], // 10
    [4, 7, 15, 12], // 11
    [1, 2, 10, 9], // 12
    [5, 6, 14, 13], // 13

    [0, 4, 12, 8], // 14
    [1, 5, 13, 9], // 15
    [2, 6, 14, 10], // 16
    [3, 7, 15, 11], // 17

    [11, 10, 9, 8], // 18
    [9, 13, 12, 8], // 19
    [12, 15, 11, 8], // 20
    [15, 14, 10, 11], // 21
    [10, 14, 13, 9], // 22
    [13, 14, 15, 12], // 23
  ],
  cells: [
    [0, 1, 2, 3, 4, 5], // 0
    [0, 6, 12, 8, 10, 18], // 1
    [1, 6, 14, 7, 15, 19], // 2
    [4, 12, 16, 13, 15, 22], // 3
    [3, 8, 16, 9, 17, 21], // 4
    [2, 10, 17, 11, 14, 20], // 5
    [5, 7, 13, 9, 11, 23], // 6
    [18, 19, 20, 21, 22, 23], // 7
  ],
})

export const hypercuboid = generateHyperCuboid(
  [-0.25, 0.25],
  [-0.5, 0.5],
  [-0.75, 0.75],
  [-1, 1]
)
export const generateTesseract = d =>
  generateHyperCuboid([-d, d], [-d, d], [-d, d], [-d, d])

export default generateTesseract(1)
