(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [...document.querySelectorAll('main > section')];
  function wrapHeadingLines(heading) {
    if (heading.dataset.motionWrapped) return;
    const original = heading.innerHTML;
    const pieces = /<br\s*\/?\s*>/i.test(original)
      ? original.split(/<br\s*\/?\s*>/i)
      : heading.textContent.includes('\n')
        ? heading.textContent.split('\n')
        : [original];
    heading.innerHTML = '';
    pieces.forEach((piece, index) => {
      const mask = document.createElement('span');
      mask.className = 'motion-line-mask';
      mask.style.setProperty('--motion-delay', `${index * 138}ms`);
      const line = document.createElement('span');
      line.className = 'motion-line';
      line.innerHTML = piece;
      mask.append(line);
      heading.append(mask);
    });
    heading.dataset.motionWrapped = 'true';
  }

  chapters.forEach(chapter => {
    chapter.querySelectorAll('h1,h2').forEach(wrapHeadingLines);
    const selectors = [
      '.section-eyebrow', '.small-label', '.kicker', '.hero-description',
      '.hero-actions', '.hero-visual', '.section-title-row > p',
      '.signal-layout > p', '.route-grid > a', '.signal-grid > article',
      '.experiment-grid > article', '.about-copy', '.about-panel',
      '.contact-links', '.role-breadcrumb', '.role-intro',
      '.role-focus-grid > article', '.role-case', '.role-closing-links',
      '.case-card'
    ];
    chapter.querySelectorAll(selectors.join(',')).forEach((element, index) => {
      element.classList.add('motion-item');
      const isText = element.matches('.section-eyebrow,.small-label,.kicker,.hero-description,.section-title-row > p,.signal-layout > p,.role-intro');
      if (isText) element.classList.add('motion-text');
      element.style.setProperty('--motion-delay', `${Math.min(index, 8) * (isText ? 102 : 85)}ms`);
    });
  });

  if (!reduced.matches) {
    document.documentElement.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.motion-line-mask,.motion-item').forEach(element => revealObserver.observe(element));
  }

})();
