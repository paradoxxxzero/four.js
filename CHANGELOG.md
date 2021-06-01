# Changelog

## [Unreleased]

## [1.1.0] - 2021-06-01

## Breaking Changes

- Renamed `HyperEdgeGeometry` to `HyperEdgesGeometry`
- Changed signature of `HyperEdgesGeometry` and `HyperPointsGeometry` to accept an `HyperGeometry` instead of shape `vertices`, `faces`, `cells` to avoid multiple projections. The `HyperGeometry` must now be updated even if not rendered.

## Added

- `HyperGeometryMergedVertices` which further reuse vertices at the expense of having one normal by vertex.

- `HyperEdgesGeometryMergedEdges` which use only one Line for performance (but doesn't support cellSize).

## [1.0.3] - 2021-05-31

## Added

- Add remaining sage shapes:
  - `hecatonicosachoronRectified`
  - `hecatonicosachoronRuncinated`
  - `hecatonicosachoronRuncitruncated`
  - `hecatonicosachoronOmnitruncated`
  - `hecatonicosachoronTruncated`
  - `hexacosichoronRectified`
  - `hexacosichoronRuncitruncated`
  - `hexacosichoronOmnitruncated`
  - `hexacosichoronTruncated`
  - `permutahedronH`

## [1.0.2] - 2021-05-23

## Added

- `uLoop`, `vLoop` parameters for `generateUVSurface` to control if the surface should close on itself
- `uLoop`, `vLoop`, `wLoop` parameters for `generateUVWHyperSurface` to control if the hypersurface should close on itself

- `hecatonicosachoronCantitruncated` and `hexacosichoronCantitruncated` shapes

## [1.0.1] - 2021-05-22

- Rerelease (with correct built version...)

## [1.0.0] - 2021-05-22

### Breaking Changes

- Some shapes has been renamed:
  - `threesphere` -> `glome`
  - `threetorus` -> `diTorus`
  - `flattorus` -> `flatTorus`

## Added

- Add generators for simple polytopes to generate custom sizes: `generateTesseract`, `generateHyperCuboid`, `generateCuboidPyramid`, `generateCubicPyramid`, `generateGlome`, `generateDiTorus`, `generateFlatTorus`,`generateDuoCylinder`
- Add uv surface generator and uvw hypersurface generator: `generateUVSurface`, `generateUVWHyperSurface`
- Add lot of shapes:

  - `hyperCuboid`
  - `cubicPyramid`
  - `cubicBiPyramid`
  - `cuboidPyramid`
  - `cuboidBiPyramid`
  - `octahedralPyramid`
  - `octahedralBiPyramid`
  - `octahedraloidPyramid`
  - `octahedraloidBiPyramid`
  - `grandAntiPrism`
  - `hecatonicosachoron`
  - `hecatonicosachoronCantellated`
  - `hexacosichoron`
  - `hexacosichoronBitTruncated`
  - `hexacosichoronCantellated`
  - `icositetrachoron`
  - `buckyBallPyramid`
  - `minkowskiSumOfTesseractAndHexadecachoron`
  - `permutahedronA`
  - `permutahedronAIrregular`
  - `permutahedronB`
  - `permutahedronBIrregular`
  - `permutahedronC`
  - `permutahedronCIrregular`
  - `permutahedronD`
  - `permutahedronDIrregular`
  - `permutahedronF`
  - `permutahedronFIrregular`
  - `permutahedronH`
  - `permutahedronHIrregular`
  - `crossHyperSurface`
  - `rightHyperCone`
  - `obliqueHyperCone`
  - `spherinder`
  - `torinder`
  - `duoCylinder`
  - `cubinder`
  - `tiger`
  - `torisphere`
  - `spheritorus`

- Glome and DiTorus are now generated with generateUVWHyperSurface

## [0.1.3] - 2021-05-15

### Added

- Cubic pyramid
- Grand Antiprism
- Hecatonicosachoron (120-cell)
- Hexacosichoron (600-cell)
- Icositetrachoron (24-cell)

## [0.1.2] - 2021-03-01

### Added

- 3-torus and flat-torus shapes thanks to @FranzPoise via #2

## [0.1.1] - 2021-02-11

### Added

- 3-sphere shape thanks to @FranzPoise via #1

## [0.1.0] - 2021-02-03

### Added

- All rendering components: `HyperMesh`, `HyperRenderer`, `HyperGeometry` `HyperEdgeGeometry`, `HyperPointsGeometry` and 3 shapes: `tesseract`, `pentachoron`, `hexadecachoron`.

[unreleased]: https://github.com/paradoxxxzero/four.js/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/paradoxxxzero/four.js/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/paradoxxxzero/four.js/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/paradoxxxzero/four.js/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/paradoxxxzero/four.js/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/paradoxxxzero/four.js/compare/v0.1.3...v1.0.0
[0.1.3]: https://github.com/paradoxxxzero/four.js/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/paradoxxxzero/four.js/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/paradoxxxzero/four.js/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/paradoxxxzero/four.js/compare/...v0.1.0
