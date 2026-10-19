(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 960px) and (min-height: 650px) and (pointer: fine)');
  const map = document.querySelector('.map-section');
  const mapPoints = map ? [...map.querySelectorAll('.map-point')] : [];
  const mapPaths = map ? [...map.querySelectorAll('.map-lines path')] : [];
  const clamp = value => Math.max(0, Math.min(1, value));
  let mapProgress = 0;
  function prepareMap() {
    if (!map) return;
    const shell = map.querySelector('.map-shell');
    const status = document.createElement('div');
    status.className = 'map-scroll-status';
    status.innerHTML = '<span>SCROLL TO TRACE THE CONNECTION</span><strong>00 / 05</strong>';
    shell.append(status);
    alignMapLines();
    if ('ResizeObserver' in window) new ResizeObserver(alignMapLines).observe(shell);
    else window.addEventListener('resize', alignMapLines, { passive: true });
    mapPaths.forEach((path, index) => {
      const length = Math.max(1, path.getTotalLength());
      path.dataset.pathLength = String(length);
      if (index === 0) {
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = reduced.matches ? '0' : String(length);
      } else {
        path.style.opacity = reduced.matches ? '.27' : '0';
      }
    });
    if (reduced.matches) {
      mapPoints.forEach(point => point.classList.add('is-lit'));
      status.querySelector('strong').textContent = '05 / 05';
      setMapProgress(1);
      return;
    }
    updateMap(0);
  }

  function alignMapLines() {
    if (!map || mapPoints.length !== 5 || mapPaths.length < 2) return;
    const shell = map.querySelector('.map-shell');
    const width = shell.clientWidth;
    const height = shell.clientHeight;
    if (!width || !height) return;
    const stars = mapPoints.map(point => {
      const star = point.querySelector('i');
      return [point.offsetLeft + star.offsetLeft + star.offsetWidth / 2,
        point.offsetTop + star.offsetTop + star.offsetHeight / 2];
    });
    const at = index => stars[index].map(value => value.toFixed(2)).join(' ');
    const svg = map.querySelector('.map-lines');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    mapPaths[0].setAttribute('d', `M${at(0)} L${at(1)} L${at(2)} L${at(3)} L${at(4)}`);
    mapPaths[1].setAttribute('d', `M${at(0)} L${at(2)} M${at(1)} L${at(3)}`);
    const length = Math.max(1, mapPaths[0].getTotalLength());
    mapPaths[0].dataset.pathLength = String(length);
    mapPaths[0].style.strokeDasharray = String(length);
    mapPaths[0].style.strokeDashoffset = String(length * (1 - clamp((mapProgress - 0.03) / 0.76)));
  }

  function setMapProgress(value) {
    const percent = Math.round(clamp(value) * 100);
    const progress = map.querySelector('.map-progress');
    if (!progress) return;
    progress.querySelector('strong').textContent = `${percent}%`;
    progress.querySelector('.map-progress-track span').style.width = `${percent}%`;
    progress.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', String(percent));
  }

  function updateMap(value) {
    if (!map || reduced.matches) return;
    mapProgress = clamp(value);
    const primary = clamp((mapProgress - 0.03) / 0.76);
    const secondary = clamp((mapProgress - 0.78) / 0.19);
    mapPaths.forEach((path, index) => {
      if (index === 0) {
        const length = Number(path.dataset.pathLength);
        path.style.strokeDashoffset = String(length * (1 - primary));
      } else {
        path.style.opacity = String(0.27 * secondary);
      }
    });
    const lit = mapPoints.filter((point, index) => {
      const visible = mapProgress >= 0.07 + index * 0.17;
      point.classList.toggle('is-lit', visible);
      return visible;
    }).length;
    const counter = map.querySelector('.map-scroll-status strong');
    if (counter) counter.textContent = `${String(lit).padStart(2, '0')} / 05`;
    setMapProgress(mapProgress);
    map.classList.toggle('is-complete', mapProgress >= 0.999);
  }

  function syncMobileMap() {
    if (!map || desktop.matches || reduced.matches) return;
    const shellTop = map.querySelector('.map-shell').getBoundingClientRect().top;
    const firstTop = shellTop + mapPoints[0].offsetTop;
    const lastTop = shellTop + mapPoints[mapPoints.length - 1].offsetTop;
    const threshold = window.innerHeight * 0.84;
    mapPoints.forEach(point => {
      if (point.getBoundingClientRect().top < threshold) point.classList.add('is-lit');
    });
    const lit = mapPoints.filter(point => point.classList.contains('is-lit')).length;
    const counter = map.querySelector('.map-scroll-status strong');
    if (counter) counter.textContent = `${String(lit).padStart(2, '0')} / 05`;
    setMapProgress(clamp((threshold - firstTop) / Math.max(1, lastTop - firstTop)));
    map.classList.toggle('is-complete', lit === mapPoints.length);
  }
  prepareMap();
  window.addEventListener('scroll', syncMobileMap, { passive: true });
  window.addEventListener('resize', syncMobileMap, { passive: true });
  desktop.addEventListener('change', () => { if (map && !desktop.matches) syncMobileMap(); });
  syncMobileMap();
  window.PortfolioConstellation = { element: map, getProgress: () => mapProgress, update: updateMap };
})();
