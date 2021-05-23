import sage.all
from json import dumps
from pathlib import Path

shape = sage.all.polytopes.omnitruncated_six_hundred_cellj(
    exact=True, backend="normaliz"
)
print("Calculating vertex adjacency matrix")
adjency = shape.vertex_adjacency_matrix()

print("Getting vertices")
vertices = shape.vertices()
faces = []
cells = []
print("Getting facets")
facets = shape.facets()
facets_len = len(facets)


for i, cell in enumerate(facets):
    print(f"Linking cell {i}/{facets_len}")
    c = []
    for face in cell.as_polyhedron().facets():
        vs = sorted([vertices.index(vertex) for vertex in face.vertices()])
        f = []
        f.append(vs[0])
        vs.remove(vs[0])

        while len(vs):
            for v in vs:
                if adjency[f[-1]][v]:
                    f.append(v)
                    vs.remove(v)
                    break

        if f not in faces:
            faces.append(f)
        c.append(faces.index(f))
    cells.append(c)

print("Generating json")
json = {
    "vertices": [[float(coord) for coord in v.vector()] for v in vertices],
    "faces": faces,
    "cells": cells,
}

with open(
    Path().absolute().parent
    / "shape_sandbox"
    / "shape_omnitruncated_six_hundred_cellj.js",
    "w",
) as f:
    f.write(f"export default {dumps(json, indent=2)}")
