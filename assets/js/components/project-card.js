(() => {
  const { create: el, add: addText } = window.PortfolioDOM;

function renderProjectCard(project) {
  const article = el('article', `case-card case-${project.type}`);
  article.id = `case-${project.id}`;
  const imageCol = el('div', 'case-image-col');
  const imageFrame = el('div', 'case-image-frame');
  if (project.image) {
    const image = el('img');
    image.src = project.image;
    image.alt = project.imageAlt;
    image.loading = 'lazy';
    imageFrame.append(image);
  } else {
    addText(imageFrame, 'span', 'image-placeholder-mark', '✦');
    addText(imageFrame, 'p', 'image-placeholder-copy', 'FIELD OPERATIONS / C# WINFORMS');
  }
  imageCol.append(imageFrame);
  addText(imageCol, 'p', 'image-caption', project.image ? `SCREEN / ${project.title.toUpperCase()}` : 'FIELD WORK / C# WINFORMS · SQL');

  const body = el('div', 'case-body');
  const meta = el('div', 'case-meta');
  addText(meta, 'span', '', `${project.number} / ${project.category}`);
  addText(meta, 'span', '', project.period);
  body.append(meta);
  addText(body, 'h3', '', project.title);
  addText(body, 'p', 'case-subtitle', project.subtitle);
  const tags = el('div', 'case-tags');
  project.stack.forEach(tag => addText(tags, 'span', '', tag));
  body.append(tags);

  const facts = el('div', 'case-facts');
  [['ROLE / 직접 맡은 범위', project.role], ['CHALLENGE / 문제', project.problem], ['DECISION / 구현 판단', project.approach], ['MY CONTRIBUTION / 개인 기여', project.contribution], ['OUTCOME / 확인된 결과', project.result], ['RETROSPECT / 다음 선택', project.learning]].forEach(([label, value]) => {
    const row = el('div', 'case-fact');
    addText(row, 'span', '', label);
    addText(row, 'p', '', value);
    facts.append(row);
  });
  body.append(facts);

  if (project.scenario) {
    const scenario = el('section', 'case-scenario');
    addText(scenario, 'span', 'evidence-label', 'DESIGN SCENARIO / 가정 기반 비교');
    const list = el('ul');
    project.scenario.forEach(item => addText(list, 'li', '', item));
    scenario.append(list);
    body.append(scenario);
  }

  const evidence = el('div', 'case-evidence');
  addText(evidence, 'span', 'evidence-label', project.link ? 'EXPLORE / 서비스에서 보기' : 'FIELD RECORD / 실무 기록');
  addText(evidence, 'p', '', project.evidence);
  if (project.link) {
    const link = el('a', 'evidence-link', `${project.linkLabel} ↗`);
    link.href = project.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    evidence.append(link);
  }
  body.append(evidence);

  article.append(imageCol, body);
  return article;
}

  window.PortfolioComponents = { renderProjectCard };
})();
