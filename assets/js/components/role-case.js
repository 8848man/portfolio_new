window.PortfolioRoleCase = function renderRoleCase(item, index) {
  const { create, add, link } = window.PortfolioDOM;
  const card = create('article', 'role-case');
  const top = add(card, 'div', 'role-case-top');
  add(top, 'span', '', `0${index + 1} / ${item.label}`);
  add(top, 'span', '', '✦');
  add(card, 'h3', '', item.name);
  [
    ['QUESTION / 질문', item.question],
    ['ACTION / 실행', item.action],
    ['SIGNAL / 확인한 것', item.signal],
    ['BOUNDARY / 해석의 한계', item.boundary]
  ].forEach(([label, value]) => {
    const row = add(card, 'div', 'role-case-row');
    add(row, 'span', '', label);
    add(row, 'p', '', value);
  });
  link(card, `${item.linkLabel} ↗`, item.link, 'role-case-link');
  return card;
};
