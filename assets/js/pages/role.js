const role = window.PORTFOLIO_ROLE_PAGES[document.body.dataset.role];
const main = document.getElementById('rolePage');
const { add, link } = window.PortfolioDOM;

if (role && main) {
  const hero=add(main,'section','role-hero');
  const heroWrap=add(hero,'div','wrap role-hero-inner');
  const breadcrumb=add(heroWrap,'div','role-breadcrumb');
  link(breadcrumb,'전체 포트폴리오','../index.html');
  add(breadcrumb,'span','',' / '+role.label);
  add(heroWrap,'p','kicker',role.label+' / 2026');
  add(heroWrap,'h1','',role.title);
  add(heroWrap,'p','role-intro',role.intro);
  const heroActions=add(heroWrap,'div','hero-actions');
  link(heroActions,'사례 살펴보기 ↘','#roleCases','button button-primary');
  link(heroActions,'이력서 PDF ↗','../김락원_이력서.pdf','button button-quiet');
  add(heroWrap,'span','role-hero-star','✦');

  const focus=add(main,'section','role-focus');
  const focusWrap=add(focus,'div','wrap');
  const focusHead=add(focusWrap,'div','section-eyebrow');
  add(focusHead,'span','','01 / MY ANGLE'); add(focusHead,'span','',role.thesis);
  add(focusWrap,'h2','role-section-title','이 경로에서 보여드릴 것');
  const focusGrid=add(focusWrap,'div','role-focus-grid');
  role.focus.forEach((item,i)=>{const card=add(focusGrid,'article','');add(card,'span','',`0${i+1} / FOCUS`);add(card,'h3','',item[0]);add(card,'p','',item[1]);});

  const cases=add(main,'section','role-cases'); cases.id='roleCases';
  const casesWrap=add(cases,'div','wrap');
  const casesHead=add(casesWrap,'div','section-eyebrow');
  add(casesHead,'span','','02 / SELECTED EVIDENCE'); add(casesHead,'span','','QUESTION → ACTION → SIGNAL → LIMIT');
  add(casesWrap,'h2','role-section-title','경험으로 답합니다');
  const caseGrid=add(casesWrap,'div','role-case-grid');
  role.cases.forEach((item,i)=>caseGrid.append(window.PortfolioRoleCase(item,i)));

  const closing=add(main,'section','role-closing');
  const closeWrap=add(closing,'div','wrap role-closing-grid');
  const left=add(closeWrap,'div','');
  add(left,'p','small-label','SCOPE & CONTACT');
  add(left,'h2','',role.note);
  const right=add(closeWrap,'div','role-closing-links');
  add(right,'p','','공통 경력과 다른 지원 분야의 사례도 확인할 수 있습니다.');
  link(right,'전체 포트폴리오 ↗','../index.html');
  link(right,'GitHub 프로필 ↗','https://github.com/8848man');
  link(right,'이메일 보내기 ↗','mailto:8848man@naver.com');
}
