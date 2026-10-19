(() => {
  const visual = document.querySelector('.hero-visual');
  const svg = visual?.querySelector('.hero-tetrahedron');
  if (!svg) return;

  const vertices = [
    [1, 1, 1],
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1]
  ];
  const faces = [...svg.querySelectorAll('[data-face]')].map(element => ({
    element,
    indices: element.dataset.face.split(',').map(Number)
  }));
  const edges = [...svg.querySelectorAll('[data-edge]')].map(element => ({
    element,
    indices: element.dataset.edge.split(',').map(Number)
  }));
  const points = [...svg.querySelectorAll('[data-vertex]')];
  const faceLayer = svg.querySelector('.tetra-faces');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let frame = 0;

  function draw(elapsed) {
    // Rotation changes the four actual 3D vertices; negative Z moves into the screen.
    const angleX = -0.22 + elapsed * 0.000115;
    const angleY = 0.48 - elapsed * 0.000155;
    const depth = -92 - 82 * (0.5 + 0.5 * Math.sin(elapsed * 0.00045));
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const projected = vertices.map(([x, y, z]) => {
      x *= 152; y *= 152; z *= 152;
      const rotatedY = y * cosX - z * sinX;
      const rotatedZ = y * sinX + z * cosX;
      const rotatedX = x * cosY + rotatedZ * sinY;
      const finalZ = depth - x * sinY + rotatedZ * cosY;
      const perspective = 740 / (740 - finalZ);
      return { x: 300 + rotatedX * perspective, y: 300 + rotatedY * perspective, z: finalZ, scale: perspective };
    });

    faces.sort((a, b) =>
      a.indices.reduce((sum, i) => sum + projected[i].z, 0) -
      b.indices.reduce((sum, i) => sum + projected[i].z, 0)
    );
    faces.forEach(({ element, indices }, order) => {
      element.setAttribute('points', indices.map(i => `${projected[i].x.toFixed(2)},${projected[i].y.toFixed(2)}`).join(' '));
      element.style.opacity = (0.12 + order * 0.075).toFixed(3);
      faceLayer.appendChild(element);
    });

    edges.forEach(({ element, indices: [a, b] }) => {
      element.setAttribute('x1', projected[a].x.toFixed(2));
      element.setAttribute('y1', projected[a].y.toFixed(2));
      element.setAttribute('x2', projected[b].x.toFixed(2));
      element.setAttribute('y2', projected[b].y.toFixed(2));
      const near = (projected[a].scale + projected[b].scale) / 2;
      element.style.opacity = Math.min(0.93, Math.max(0.3, near * 0.86)).toFixed(3);
      element.style.strokeWidth = (1.15 + near * 0.9).toFixed(2);
    });

    points.forEach((element, i) => {
      element.setAttribute('cx', projected[i].x.toFixed(2));
      element.setAttribute('cy', projected[i].y.toFixed(2));
      element.setAttribute('r', (3.8 + projected[i].scale * 2.4).toFixed(2));
      element.style.opacity = Math.min(1, projected[i].scale * 1.04).toFixed(3);
    });
  }

  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || reducedMotion.matches) return;
    draw(now);
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (reducedMotion.matches) draw(0);
    else if (visible && !document.hidden) frame = requestAnimationFrame(tick);
  }

  draw(0);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0 }).observe(visual);
  }
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener?.('change', sync);
  sync();
})();
