# four.js

An attemp to render 4 dimensional objects with three.js.

**Full demo: [anakata](https://florian.mounier.dev/anakataGL/)**

## Installation

```bash
yarn add four-js
# or
npm --save install four-js
```

## Usage

Full working example [here](https://github.com/paradoxxxzero/four.js/blob/master/examples/tesseract.html)

To run it: `git clone https://github.com/paradoxxxzero/four.js && cd four.js && yarn install && yarn start` then open http://localhost:44444/examples/tesseract.html

### Creating

```js
import { HyperGeometry, shapes } from 'four-js'

// Import tesseract preset shape
const { tesseract } = shapes

// Create an HyperRenderer which will be used to make 4d -> 3d projections
const hyperRenderer = new HyperRenderer(1.5, 5)

// Declare an HyperGeometry (it will generate a BufferGeometry per cell)
const hyperGeometry = new HyperGeometry(
  tesseract.vertices,
  tesseract.faces,
  tesseract.cells,
  hyperRenderer
)
// Create a material as usual
const material = new MeshLambertMaterial()
material.transparent = true
material.opacity = 0.1
material.blending = AdditiveBlending
material.side = DoubleSide
material.depthWrite = false
material.color = new Color(0x00ff99)

// And them make an HyperMesh which is actually a three.js Group of cell Mesh
// If you want different materials per cells, just replace material with
// a material array with the same length as the number of cells
const hyperMesh = new HyperMesh(hyperGeometry, material)

// (...) Setup the three.js scene as usual and add the HyperMesh:
scene.add(hyperMesh)
```

### Updating

This will render a tesseract that you can then rotate by updating the HyperRenderer rotation:

```js
update() {
  requestAnimationFrame(update)
  // Rotate takes the rotation speed around the 6 planes:
  hyperRenderer.rotate({ xy: 0, xz: 0, xw: 5, yz: 0, yw: 10, zw: 10 })
  // Update the hyperMesh
  hyperMesh.update()
}
```

### Alternate rendering

It's possible to render only the edges of the 4d mesh with `HyperEdgeGeometry`:

```js
const hyperGeometry = new HyperEdgeGeometry(
  tesseract.vertices,
  tesseract.faces,
  tesseract.cells,
  hyperRenderer
)
const material = new LineBasicMaterial()
// (...)

// HyperMesh here will contain an array of LineSegments instead of Mesh
const hyperEdges = new HyperMesh(hyperGeometry, material, LineSegments)
```

or only the vertices with `HyperPointsGeometry`:
```js
const hyperGeometry = new HyperPointsGeometry(
  tesseract.vertices,
  tesseract.faces,
  tesseract.cells,
  hyperRenderer
)
const material = new PointsMaterial()
// (...)

// HyperMesh here will contain an array of Points instead of Mesh
const hyperEdges = new HyperMesh(hyperGeometry, material, Points)
```

## Shape definition

The 4 dimensional mesh descriptions are composed of vertices, faces and cells.

Here's what the tesseract description look like:

```js
const tesseract = {
  // These are the classic vertices
  vertices: [
    [1, 1, 1, 1], // 0
    [1, 1, -1, 1], // 1
    [1, -1, -1, 1], // 2
    [1, -1, 1, 1], // 3
    [-1, 1, 1, 1], // 4
    [-1, 1, -1, 1], // 5
    [-1, -1, -1, 1], // 6
    [-1, -1, 1, 1], // 7
    [1, 1, 1, -1], // 8
    [1, 1, -1, -1], // 9
    [1, -1, -1, -1], // 10
    [1, -1, 1, -1], // 11
    [-1, 1, 1, -1], // 12
    [-1, 1, -1, -1], // 13
    [-1, -1, -1, -1], // 14
    [-1, -1, 1, -1], // 15
  ],
  // Each face is made by listing its vertices index
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
  // Each cell is made by listing its faces index
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
}
```

This means that the first cell

```js
    [0, 1, 2, 3, 4, 5], // 0
```

is composed of 6 faces:

```js
    [0, 1, 2, 3], // 0
    [0, 4, 5, 1], // 1
    [0, 3, 7, 4], // 2
    [3, 2, 6, 7], // 3
    [1, 5, 6, 2], // 4
    [4, 7, 6, 5], // 5
```

and the first face here

```js
    [0, 1, 2, 3], // 0
```

is composed of 4 vertices:

```js
    [1, 1, 1, 1], // 0
    [1, 1, -1, 1], // 1
    [1, -1, -1, 1], // 2
    [1, -1, 1, 1], // 3
```

Following that logic you can try to draw your own 4d models.

Feel free to make pull requests with your own creations!
