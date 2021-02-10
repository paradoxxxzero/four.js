function createSphere(radius, step=Math.PI/8) {
  const vertices = [];
  const faces = [];
  const cells = [];
  let facesIndex = 0;

  const classOfVertex = {
    theta: {},
    phi: {},
    gamma: {},
  }

  for (let theta = 0; theta <=  Math.PI; theta += step) {
    for (let phi = 0; phi <=  Math.PI; phi += step) {
      for (let gamma = 0; gamma <= 2 * Math.PI; gamma += step) {
        if (!classOfVertex.theta[theta]) {
          classOfVertex.theta[theta] = [];
        }
        if (!classOfVertex.phi[phi]) {
          classOfVertex.phi[phi] = [];
        }
        if (!classOfVertex.gamma[gamma]) {
          classOfVertex.gamma[gamma] = [];
        }

        classOfVertex.theta[theta].push(vertices.length)
        classOfVertex.phi[phi].push(vertices.length)
        classOfVertex.gamma[gamma].push(vertices.length)

        vertices.push([
          radius * Math.cos(theta),
          radius * Math.sin(theta) * Math.cos(phi),
          radius * Math.sin(theta) * Math.sin(phi) * Math.cos(gamma),
          radius * Math.sin(theta) * Math.sin(phi) * Math.sin(gamma),
        ]);

      }
    }
  }

  for (let key in classOfVertex.theta) {
    const vertexClass = classOfVertex.theta[key];
    for (let i = 0; i < vertexClass.length; i++) {
      faces.push([
        vertexClass[i],
        vertexClass[(i + 1) % vertexClass.length],
        vertexClass[(i + 2 + (2 * Math.PI / step)) % vertexClass.length],
        vertexClass[(i + 1 + (2 * Math.PI / step)) % vertexClass.length],
      ])
      cells.push(facesIndex);
      facesIndex++;
    }
  }

  for (let key in classOfVertex.phi) {
    const vertexClass = classOfVertex.phi[key];
    for (let i = 0; i < vertexClass.length; i++) {
      faces.push([
        vertexClass[i],
        vertexClass[(i + 1) % vertexClass.length],
        vertexClass[(i + 2 + (2 * Math.PI / step)) % vertexClass.length],
        vertexClass[(i + 1 + (2 * Math.PI / step)) % vertexClass.length],
      ])
      cells.push(facesIndex);
      facesIndex++;
    }
  }

  for (let key in classOfVertex.gamma) {
    const vertexClass = classOfVertex.gamma[key];
    for (let i = 0; i < vertexClass.length; i++) {
      faces.push([
        vertexClass[i],
        vertexClass[(i + 1) % vertexClass.length],
        vertexClass[(i + 2 + (Math.PI / step)) % vertexClass.length],
        vertexClass[(i + 1 +  (Math.PI / step)) % vertexClass.length],
      ])
      cells.push(facesIndex);
      facesIndex++;
    }
  }

  return {
    vertices,
    faces,
    cells: [cells],
  }
}

export default createSphere;
