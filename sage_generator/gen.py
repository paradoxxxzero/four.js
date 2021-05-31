import sys
import sage.all
from json import dumps, loads

input = sys.argv[1] if len(sys.argv) > 1 else None

if len(sys.argv) == 1:
    name = "truncated_six_hundred_cell"
    print(f"Computing polytope {name}")
    shape = sage.all.polytopes.truncated_six_hundred_cell(
        exact=True, backend="normaliz"
    )
    print("Getting vertices")
    vertices = shape.vertices()
    vlen = len(vertices)
    print("Calculating vertex adjacency matrix")
    adjency = []
    for i, h in enumerate(shape.vertex_adjacency_matrix()):
        a = []
        print(f"{i}/{vlen} | {len(h)}", end=": ")
        for j, v in enumerate(h):
            print(f"{j}", end=" ")
            if v:
                a.append(j)
        adjency.append(a)
        print()

    print("Getting facets")
    facets = shape.facets()
    facets_len = len(facets)

    print(f"Getting cell faces, {facets_len}")
    cells_faces = []
    for i, cell in enumerate(facets):
        print(f"{i}", end=" ")
        cells_faces.append(cell.as_polyhedron().facets())
    print()

    print("Hashing vertices")
    hash_vertices = {vertex: i for i, vertex in enumerate(vertices)}

    print("Getting cell face vertices")
    cells_faces_vertices = []
    for i, cell_faces in enumerate(cells_faces):
        c = []
        print(f"{i}/{len(cells_faces)} | {len(cell_faces)}", end=": ")
        for j, cell_face in enumerate(cell_faces):
            print(f"{j}", end=" ")
            c.append(sorted([hash_vertices[vertex] for vertex in cell_face.vertices()]))
        cells_faces_vertices.append(c)
        print()

    json = {
        "cells_faces_vertices": cells_faces_vertices,
        "adjency": adjency,
        "vertices": [[float(coord) for coord in v.vector()] for v in vertices],
    }
    print("Writting json")
    with open(
        f"{name}.vx.json",
        "w",
    ) as f:
        f.write(dumps(json))
    sys.exit(0)


vxf = sys.argv[1]
print("Reading json")
with open(vxf) as f:
    vx = loads(f.read())

cells_faces_vertices = vx["cells_faces_vertices"]
adjency = vx["adjency"]
vertices = vx["vertices"]

print("Generating cells")
cells = []
faces = []
for i, cell_faces_vertices in enumerate(cells_faces_vertices):
    print(
        f"Linking cell {i+1}/{len(cells_faces_vertices)}. {len(cell_faces_vertices)}:",
        end=" ",
    )
    c = []

    for j, cell_face_vertices in enumerate(cell_faces_vertices):
        print(f"{j+1}", end=" ")
        vs = cell_face_vertices[:]
        f = []
        f.append(vs[0])
        vs.remove(vs[0])

        while len(vs):
            for adj in adjency[f[-1]]:
                if adj in vs:
                    f.append(adj)
                    vs.remove(adj)
                    break

        if f not in faces:
            faces.append(f)
        c.append(faces.index(f))
    cells.append(c)
    print()

print("Generating json")
json = {
    "vertices": vertices,
    "faces": faces,
    "cells": cells,
}

with open(
    vxf.replace(".vx.json", ".js"),
    "w",
) as f:
    f.write(f"export default {dumps(json, indent=2)}")
