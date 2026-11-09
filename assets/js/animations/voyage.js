(() => {
  const section = document.querySelector('.time-voyage');
  if (!section) return;
  const stage = section.querySelector('.voyage-stage');
  const planetLayer = section.querySelector('#voyagePlanets');
  const starfield = section.querySelector('#voyageStarfield');
  const record = section.querySelector('#voyageRecord');
  const finale = section.querySelector('#voyageFinale');
  const progress = section.querySelector('.voyage-progress');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const projects = [
    {theme:'daily',title:'Daily School',date:'2024 초 — 2025 초',year:'2024',copy:'첫 Flutter 팀 프로젝트. 인증·상태·통신의 공통 구조를 구현했습니다.',href:'#case-daily',side:-1,y:-12},
    {theme:'machat',title:'MaChat',date:'2024 하반기 — 2025 하반기',year:'2024',copy:'기획부터 구현까지 단독으로, 채팅과 AI 학습 경험을 만들었습니다.',href:'#case-machat',side:1,y:8},
    {theme:'sentinel',title:'Sentinel',date:'2026.03 — 06',year:'2026',copy:'장애 대응의 혼란을 줄일 수 있을지 데모와 MVP로 물었습니다.',href:'#experiments',side:-1,y:8},
    {theme:'hypora',title:'Hypora',date:'2026.06 — 07',year:'2026',copy:'막연한 아이디어를 실행 가능한 구조로 바꾸는 실험을 했습니다.',href:'#experiments',side:1,y:-10},
    {theme:'persoracle',title:'Persoracle',date:'2026.07 — 08',year:'2026',copy:'AI 페르소나를 통해 아이디어 검증의 쓰임을 다시 물었습니다.',href:'#experiments',side:-1,y:-7},
    {theme:'pactfive',title:'PactFive',date:'2026.08 — 09',year:'2026',copy:'5인 팀의 작업 경계와 통합 흐름을 설계하고 운영했습니다.',href:'#case-pactfive',side:1,y:10},
    {theme:'vencubator',title:'Vencubator',date:'2026.09 시작',year:'2026',copy:'앞선 실험을 게임화된 창업 학습 경험으로 연결했습니다.',href:'#experiments',side:-1,y:-8}
  ];
  planetLayer.innerHTML = projects.map(item => `<div class="voyage-planet" data-theme="${item.theme}" aria-hidden="true"><img class="voyage-planet-image" src="assets/images/planets/${item.theme}.png" alt="" decoding="async"><span class="voyage-planet-label">${item.title}</span></div>`).join('');
  const planets = [...planetLayer.children];
  const stars = Array.from({length:46}, (_, index) => {
    const element = document.createElement('i');
    element.className = 'voyage-streak';
    starfield.append(element);
    return {element,seed:((index*73+19)%101)/101,angle:index*2.39996};
  });
  const clamp = value => Math.max(0,Math.min(1,value));
  let active = -1, frame = 0;
  function render() {
    frame = 0;
    if (reduced.matches) { progress.setAttribute('aria-valuenow','100'); return; }
    const p = clamp((scrollY-section.offsetTop)/Math.max(1,section.offsetHeight-innerHeight));
    if (scrollY<section.offsetTop-innerHeight || scrollY>section.offsetTop+section.offsetHeight+innerHeight) return;
    stage.style.setProperty('--opening-opacity',(1-clamp((p-.045)/.11)).toFixed(3));
    stage.style.setProperty('--record-opacity',(clamp((p-.105)/.055)*(1-clamp((p-.855)/.055))).toFixed(3));
    stage.style.setProperty('--finale-opacity',clamp((p-.895)/.055).toFixed(3));
    stage.style.setProperty('--nebula-scale',(1+p*1.4).toFixed(3));
    stage.style.setProperty('--nebula-opacity',(.72-p*.22).toFixed(3));
    stage.style.setProperty('--tunnel-scale',(.2+(p*3.2)%1.1).toFixed(3));
    record.classList.toggle('is-available',p>.14&&p<.88);
    finale.classList.toggle('is-available',p>.94);
    const percent=Math.round(p*100);
    section.querySelector('#voyageProgressFill').style.width=`${percent}%`;
    progress.setAttribute('aria-valuenow',String(percent));
    const q=clamp((p-.1)/.78), position=q*projects.length;
    const index=Math.min(projects.length-1,Math.floor(position));
    if(index!==active){
      active=index;
      const item=projects[index];
      section.querySelector('#voyageRecordMeta').textContent=`${String(index+1).padStart(2,'0')} / 07 · ${item.date}`;
      section.querySelector('#voyageRecordTitle').textContent=item.title;
      section.querySelector('#voyageRecordCopy').textContent=item.copy;
      section.querySelector('#voyageRecordLink').href=item.href;
      section.querySelector('#voyageYear').textContent=item.year;
    }
    section.querySelector('#voyageCount').textContent=`${String(p<.1?0:index+1).padStart(2,'0')} / 07`;
    planets.forEach((planet,i)=>{
      const u=position-i;
      if(u<-.28||u>1.18||p>.94){planet.style.opacity='0';return;}
      const near=Math.max(0,u);
      const pass=clamp((near-.48)/.58);
      const scale=.12+Math.pow(clamp((u+.2)/1.2),2)*3.15;
      const x=projects[i].side*(2+Math.pow(near,1.35)*(innerWidth<760?47:56))*(1+pass*pass*.12);
      const y=(projects[i].y+near*7)*(1+pass*pass*.16);
      const opacity=clamp((u+.28)/.28)*(1-clamp((u-.87)/.31));
      planet.style.transform=`translate(-50%,-50%) translate3d(${x.toFixed(2)}vw,${y.toFixed(2)}vh,0) scale(${scale.toFixed(3)})`;
      planet.style.setProperty('--warp-x',(1+pass*pass*.22).toFixed(3));
      planet.style.setProperty('--warp-y',(1-pass*pass*.08).toFixed(3));
      planet.style.setProperty('--warp-skew',`${(projects[i].side*pass*pass*5).toFixed(2)}deg`);
      planet.style.opacity=opacity.toFixed(3);
      planet.style.zIndex=String(Math.round(scale*10));
    });
    stars.forEach(({element,seed,angle})=>{
      const depth=(p*5.6+seed)%1;
      const radius=Math.pow(depth,1.65)*82*(1+Math.pow(depth,3)*.28);
      element.style.width=`${(2+Math.pow(depth,2.6)*94).toFixed(1)}px`;
      element.style.height=`${(.7+Math.pow(depth,2)*1.8).toFixed(1)}px`;
      element.style.opacity=(.14+Math.pow(depth,1.5)*.8).toFixed(2);
      element.style.transform=`translate3d(${(Math.cos(angle)*radius).toFixed(2)}vw,${(Math.sin(angle)*radius*1.2).toFixed(2)}vh,0) rotate(${(angle*180/Math.PI).toFixed(1)}deg) translateX(-100%)`;
    });
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render);}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  reduced.addEventListener?.('change',schedule);
  render();
})();
