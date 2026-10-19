(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  function prepareCounters() {
    const cards = [...document.querySelectorAll('.signal-grid article')];
    cards.forEach(card => {
      const strong = card.querySelector('strong');
      if (!strong) return;
      strong.setAttribute('aria-label', strong.textContent.trim());
      const walker = document.createTreeWalker(strong, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach(textNode => {
        const parts = textNode.textContent.split(/(\d[\d,]*)/g);
        if (parts.length < 2) return;
        const fragment = document.createDocumentFragment();
        parts.forEach(part => {
          if (/^\d[\d,]*$/.test(part)) {
            const counter = document.createElement('span');
            counter.className = 'count-up';
            counter.dataset.target = part.replace(/,/g, '');
            counter.setAttribute('aria-hidden', 'true');
            counter.textContent = reduced.matches ? part : '0';
            fragment.append(counter);
          } else if (part) {
            fragment.append(document.createTextNode(part));
          }
        });
        textNode.replaceWith(fragment);
      });
    });
    if (reduced.matches) return;
    const signal = document.querySelector('.signal-section');
    if (!signal) return;
    let started = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      observer.disconnect();
      cards.forEach((card, index) => {
        const counters = [...card.querySelectorAll('.count-up')];
        const begin = performance.now() + index * 130;
        const duration = 1150;
        function tick(now) {
          const progress = clamp((now - begin) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          counters.forEach(counter => {
            counter.classList.add('is-counting');
            const target = Number(counter.dataset.target);
            counter.textContent = Math.round(target * eased).toLocaleString('ko-KR');
          });
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.18 });
    observer.observe(signal);
  }
  prepareCounters();
})();
