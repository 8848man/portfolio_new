(() => {
  const list = document.getElementById('caseList');
  if (!list) return;
  window.PORTFOLIO_V2.projects.forEach(project => list.append(window.PortfolioComponents.renderProjectCard(project)));
})();
