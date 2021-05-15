import sage.all
from json import dumps
from pathlib import Path

shape = sage.all.polytopes.cube()
adjency = shape.vertex_adjacency_matrix()

vertices = shape.vertices()
faces = []
cells = []

for cell in shape.facets():
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


json = {
    "vertices": [[float(coord) for coord in v.vector()] for v in vertices],
    "faces": faces,
    "cells": cells,
}

with open(Path().absolute().parent / "shape_sandbox" / "shape.js", "w") as f:
    f.write(f"export default {dumps(json, indent=2)}")
