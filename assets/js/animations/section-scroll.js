(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 960px) and (min-height: 650px) and (pointer: fine)');
  const chapters = [...document.querySelectorAll('main > section')];
  const constellation = window.PortfolioConstellation;
  const map = constellation?.element;
  let wheelSum = 0;
  let lockedUntil = 0;
  function chapterIndex() {
    const probe = window.scrollY + window.innerHeight * 0.46;
    let index = chapters.findIndex(section => probe >= section.offsetTop && probe < section.offsetTop + section.offsetHeight);
    if (index < 0) index = probe < chapters[0].offsetTop ? 0 : chapters.length - 1;
    return index;
  }

  function navigate(index, direction) {
    const target = chapters[index];
    if (!target) return;
    const long = target.offsetHeight > window.innerHeight + 70;
    const top = long && direction < 0 && target !== map
      ? target.offsetTop + target.offsetHeight - window.innerHeight
      : target.offsetTop;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    lockedUntil = performance.now() + 850;
    wheelSum = 0;
  }

  function onWheel(event) {
    if (!desktop.matches || reduced.matches || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const index = chapterIndex();
    const chapter = chapters[index];
    const direction = Math.sign(event.deltaY);
    if (!direction) return;
    const top = chapter.offsetTop;
    const bottom = top + chapter.offsetHeight;
    const isLong = chapter !== map && chapter.offsetHeight > window.innerHeight + 70;
    const canReadWithin = isLong && (
      direction > 0 ? window.scrollY + window.innerHeight < bottom - 12 : window.scrollY > top + 12
    );
    if (canReadWithin) return;
    if ((index === 0 && direction < 0) || (index === chapters.length - 1 && direction > 0)) return;
    event.preventDefault();
    if (performance.now() < lockedUntil) return;
    wheelSum += event.deltaY;
    if (Math.abs(wheelSum) < 36) return;
    wheelSum = 0;
    if (chapter === map) {
      if (direction > 0 && constellation.getProgress() < 0.999) {
        constellation.update(Math.min(1, constellation.getProgress() + 0.14));
        lockedUntil = performance.now() + 470;
        return;
      }
      if (direction < 0 && constellation.getProgress() > 0.001) {
        constellation.update(Math.max(0, constellation.getProgress() - 0.14));
        lockedUntil = performance.now() + 470;
        return;
      }
    }
    navigate(index + direction, direction);
  }
  window.addEventListener('wheel', onWheel, { passive: false });
})();
