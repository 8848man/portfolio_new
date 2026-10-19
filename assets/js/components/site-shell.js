(() => {
  const roleNames = { pm: 'PM', 'ai-developer': 'AI DEV', marketer: 'GROWTH' };
  const routeNames = { pm: 'PM', 'ai-developer': 'AI 개발자', marketer: '마케터' };
  const footerNames = { pm: 'PM', 'ai-developer': 'AI DEVELOPER', marketer: 'MARKETING' };
  const role = document.body.dataset.role;
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  if (!roleNames[role] || !header || !footer) return;

  const { add, link } = window.PortfolioDOM;
  header.className = 'site-header';
  const logo = link(header, '', '../index.html', 'logo');
  add(logo, 'span', 'logo-star', '✦').setAttribute('aria-hidden', 'true');
  const logoText = add(logo, 'span', '', 'KIM RAKWON');
  add(logoText, 'span', 'logo-slash', ' / ');
  logoText.append(roleNames[role]);
  const nav = add(header, 'nav');
  nav.setAttribute('aria-label', '지원 분야');
  link(nav, '전체', '../index.html');
  Object.keys(routeNames).filter(key => key !== role).forEach(key => {
    link(nav, routeNames[key], `../${key}/index.html`);
  });
  link(header, 'Let\'s talk ↗', 'mailto:8848man@naver.com', 'header-contact');

  footer.className = 'site-footer';
  const wrap = add(footer, 'div', 'wrap');
  add(wrap, 'span', '', `✦ KIM RAKWON / ${footerNames[role]}`);
  link(wrap, '전체 포트폴리오 ↑', '../index.html');
})();
