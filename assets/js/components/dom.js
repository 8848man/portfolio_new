(() => {
  function create(tag, className = '', value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = value;
    return element;
  }
  function add(parent, tag, className = '', value) {
    const element = create(tag, className, value);
    parent.append(element);
    return element;
  }
  function link(parent, label, href, className = '') {
    const element = add(parent, 'a', className, label);
    element.href = href;
    if (/^https?:/.test(href)) {
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
    }
    return element;
  }
  window.PortfolioDOM = { create, add, link };
})();
