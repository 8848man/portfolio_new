const {nodes,relations,skills,skillScale}=window.PORTFOLIO;
const $=selector=>document.querySelector(selector);
const section=$('#constellation');
const stage=$('.sky-stage');
const chart=$('#starChart');
const starsLayer=$('#starsLayer');
const svg=$('#connectionLayer');
const relationPopover=$('#relationPopover');
const dialog=$('#detailDialog');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let progress=0;
let visibleCount=-1;
let ticking=false;
let lastFocus=null;
let pinnedRelation=null;
let hoveredSkill=null;
let pinnedSkill=null;

function esc(text){return String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));}
function node(id){return nodes.find(item=>item.id===id);}
function prepareIntroMotion(){
  if(reduced.matches)return;
  const copy=$('.intro-copy');
  const lines=[...copy.childNodes].map(part=>part.nodeName==='BR'?'\n':part.textContent).join('').split('\n').map(line=>line.trim());
  let index=0;
  const animated=lines.map(line=>`<span class="intro-copy-line">${Array.from(line).map(char=>`<span class="intro-copy-char" style="--char-index:${index++}">${char===' '?'&nbsp;':esc(char)}</span>`).join('')}</span>`).join('');
  copy.innerHTML=`<span class="sr-only">${esc(lines.join(' '))}</span><span aria-hidden="true">${animated}</span>`;
}
function relationPath(from,to,kind){
  const a=node(from),b=node(to),x1=a.x*10,y1=a.y*6,x2=b.x*10,y2=b.y*6,dx=x2-x1,dy=y2-y1;
  if(kind==='integration')return `M ${x1} ${y1} C ${x1+90} ${y1+90}, ${x2-60} ${y2-95}, ${x2} ${y2}`;
  if(kind==='flutter')return `M ${x1} ${y1} C ${x1+50} ${y1-70}, ${x2-60} ${y2-40}, ${x2} ${y2}`;
  if(kind==='catalyst')return `M ${x1} ${y1} C ${x1+150} ${y1-230}, ${x2-170} ${y2+190}, ${x2} ${y2}`;
  return `M ${x1} ${y1} C ${x1+Math.max(30,dx*.4)} ${y1+dy*.1}, ${x2-Math.max(30,dx*.4)} ${y2-dy*.1}, ${x2} ${y2}`;
}
const starGlyph=`<svg class="star-glyph" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path class="star-glyph-diagonal" d="M32 9 C34 24 40 30 55 32 C40 34 34 40 32 55 C30 40 24 34 9 32 C24 30 30 24 32 9Z" transform="rotate(45 32 32)"/><path class="star-glyph-main" d="M32 2 C34 22 42 30 62 32 C42 34 34 42 32 62 C30 42 22 34 2 32 C22 30 30 22 32 2Z"/><circle class="star-glyph-core" cx="32" cy="32" r="3"/><circle class="star-glyph-spark" cx="54" cy="12" r="1.35"/><circle class="star-glyph-spark" cx="10" cy="51" r="1"/></svg>`;
function createChart(){
  $('#totalCount').textContent=String(nodes.length).padStart(2,'0');
  starsLayer.innerHTML=nodes.map(item=>`<button type="button" class="star ${item.kind==='personal'?'is-gold':''}" data-id="${item.id}" data-group="${item.group}" style="--x:${item.x}%;--y:${item.y}%" aria-label="${esc(item.title)} 상세 보기" tabindex="-1">${starGlyph}<span class="star-label">${esc(item.short)}</span></button>`).join('');
  svg.innerHTML=relations.map((item,index)=>{const d=relationPath(item.from,item.to,item.kind);return `<g class="relation relation-${item.kind}" data-index="${index}" role="button" tabindex="-1" aria-label="${esc(item.title)} 관계 설명"><path class="relation-visible" d="${d}"/><path class="relation-hit" d="${d}"/></g>`;}).join('');
  svg.querySelectorAll('.relation-visible').forEach(path=>{const length=path.getTotalLength();path.style.setProperty('--length',`${length}px`);});
  const random=value=>((value*9301+49297)%233280)/233280;
  $('#ambientStars').innerHTML=Array.from({length:76},(_,index)=>`<i style="left:${(random(index*17+3)*100).toFixed(1)}%;top:${(random(index*37+11)*82).toFixed(1)}%;--twinkle:${(.17+random(index*57+7)*.45).toFixed(2)}"></i>`).join('');
  $('#experienceList').innerHTML=[...nodes].reverse().map(item=>{
    const projectLink=item.kind==='personal'&&item.link?`<a class="list-project-link" href="${esc(item.link)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(item.title)} 서비스 새 탭에서 열기">${esc(new URL(item.link).hostname)} <span aria-hidden="true">↗</span></a>`:'';
    const ongoing=item.status==='ongoing';
    return `<li class="${item.kind}${ongoing?' is-ongoing':''}"><span class="date">${esc(item.date)}</span><div><h3>${esc(item.title)}${ongoing?'<span class="status-badge">진행 중</span>':''}</h3><p>${esc(item.summary)}</p><div class="experience-actions"><button class="list-detail" type="button" data-id="${item.id}">업무 디테일 보기 <span aria-hidden="true">↗</span></button>${projectLink}</div></div></li>`;
  }).join('');
  $('#skillRows').innerHTML=skills.map(skill=>`<button class="skill-row" type="button" data-skill="${skill.key}" aria-label="${esc(skill.label)} 관련 경험 강조" aria-pressed="false"><span class="skill-row-head"><span>${esc(skill.label)}</span><small>0 / ${skillScale}</small></span><span class="skill-cells" style="--skill-scale:${skillScale}">${Array.from({length:skillScale},(_,index)=>`<i data-cell="${index+1}" class="${skill.color}"></i>`).join('')}</span></button>`).join('');
  $('#skillRows').querySelectorAll('.skill-row').forEach(row=>{
    row.addEventListener('pointerenter',()=>{hoveredSkill=row.dataset.skill;updateSkillFocus();});
    row.addEventListener('pointerleave',()=>{hoveredSkill=null;updateSkillFocus();});
    row.addEventListener('focus',()=>{hoveredSkill=row.dataset.skill;updateSkillFocus();});
    row.addEventListener('blur',()=>{hoveredSkill=null;updateSkillFocus();});
    row.addEventListener('click',()=>{pinnedSkill=pinnedSkill===row.dataset.skill?null:row.dataset.skill;updateSkillFocus();});
  });
  starsLayer.querySelectorAll('.star').forEach(button=>button.addEventListener('click',()=>openDialog(button.dataset.id)));
  document.querySelectorAll('.list-detail').forEach(button=>button.addEventListener('click',()=>openDialog(button.dataset.id)));
  svg.querySelectorAll('.relation').forEach(group=>{
    group.addEventListener('pointerenter',()=>showRelation(Number(group.dataset.index),group));
    group.addEventListener('pointerleave',()=>{if(pinnedRelation!==Number(group.dataset.index))hideRelation();});
    group.addEventListener('focus',()=>showRelation(Number(group.dataset.index),group));
    group.addEventListener('blur',()=>{if(pinnedRelation!==Number(group.dataset.index))hideRelation();});
    group.addEventListener('click',()=>{pinnedRelation=Number(group.dataset.index);showRelation(pinnedRelation,group);});
    group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();pinnedRelation=Number(group.dataset.index);showRelation(pinnedRelation,group);}});
  });
}

function showRelation(index,group){
  if(!group.classList.contains('is-revealed'))return;
  const item=relations[index];
  $('#relationLabel').textContent=`${node(item.from).short} → ${node(item.to).short}`;
  $('#relationTitle').textContent=item.title;
  $('#relationBody').textContent=item.insight;
  relationPopover.hidden=false;
  svg.querySelectorAll('.relation').forEach(line=>line.classList.toggle('is-active',line===group));
  const end=node(item.to);
  relationPopover.style.setProperty('--relation-x',`${end.x>60?22:76}%`);
}
function hideRelation(){relationPopover.hidden=true;svg.querySelectorAll('.relation').forEach(line=>line.classList.remove('is-active'));}
function closeRelation(){pinnedRelation=null;hideRelation();}

function openDialog(id){
  const item=node(id);if(!item)return;
  lastFocus=document.activeElement;
  $('#dialogGroup').textContent=`${item.group.toUpperCase()} / ${item.kind==='official'?'OFFICIAL':'PROJECT'}`;
  $('#dialogDate').textContent=item.date;
  $('#dialogTitle').textContent=item.title;
  $('#dialogSummary').textContent=item.summary;
  const serviceData=window.PORTFOLIO.services?.[item.id];
  let service=$('#dialogService');
  if(!service){
    service=document.createElement('section');service.id='dialogService';service.className='dialog-service';
    service.innerHTML='<span>01 / SERVICE</span><h3>어떤 서비스인가</h3><p class="service-intro"></p><p class="service-verified"></p>';
    $('.dialog-hero').after(service);
  }
  service.hidden=!serviceData;
  if(serviceData){
    service.querySelector('.service-intro').textContent=serviceData.intro;
    service.querySelector('.service-verified').textContent=`직접 확인한 범위 · ${serviceData.verified}`;
  }
  const stepOffset=serviceData?1:0;
  $('#dialogProblem').parentElement.querySelector('span').textContent=`0${1+stepOffset} / PROBLEM`;
  $('#dialogSolution').parentElement.querySelector('span').textContent=`0${2+stepOffset} / SOLUTION`;
  $('.dialog-metrics>span').textContent=`0${3+stepOffset} / EVIDENCE`;
  $('#dialogProblem').textContent=item.problem;
  $('#dialogSolution').textContent=item.solution;
  $('#dialogMetrics').innerHTML=item.metrics.map(metric=>`<li>${esc(metric)}</li>`).join('');
  const extraContent=item.insight||item.extra;
  $('#dialogExtra').hidden=!extraContent;
  $('#dialogExtra').querySelector('span').textContent=`0${4+stepOffset} / ${item.insight?'INSIGHT':'IMPLEMENTATION'}`;
  $('#dialogExtra').querySelector('h3').textContent=item.insight?'무엇을 배웠나':'구현 기록';
  $('#dialogExtraText').textContent=extraContent||'';
  let access=$('#dialogAccess');
  if(item.access){
    if(!access){
      access=document.createElement('section');access.id='dialogAccess';access.className='dialog-access';
      access.innerHTML='<span>05 / TEST ACCESS</span><h3>테스트 계정</h3><p>공개 테스트 서버에서 사용할 수 있는 계정입니다.</p><dl><div><dt>ID</dt><dd id="accessId"></dd></div><div><dt>PW</dt><dd id="accessPassword"></dd></div></dl>';
      $('#modelGallery').before(access);
    }
    $('#accessId').textContent=item.access.id;
    $('#accessPassword').textContent=item.access.password;
    access.querySelector('span').textContent=`0${(extraContent?5:4)+stepOffset} / TEST ACCESS`;
    access.querySelector('p').textContent=item.link?'테스트 서버에서 사용할 수 있는 계정입니다.':'프로젝트를 체험할 때 사용할 수 있는 계정입니다.';
    access.hidden=false;
  }else if(access)access.hidden=true;
  $('#modelGallery').hidden=!item.showModels;
  const link=$('#dialogLink');link.hidden=!item.link;
  link.parentElement.hidden=!item.link;
  if(item.link){link.href=item.link;link.textContent=`서비스 열기 · ${new URL(item.link).hostname} ↗`;}
  dialog.showModal();
  dialog.querySelector('.dialog-scroll').scrollTop=0;
  $('#dialogClose').focus();
}
function closeDialog(){dialog.close();lastFocus?.focus();}

function updateModel(){
  const users=Number($('#userRange').value),lookups=users*20,master=Math.min(100,lookups),saving=Number(((1-master/lookups)*100).toFixed(1));
  $('#userOutput').textContent=`${users.toLocaleString('ko-KR')}명`;
  $('#vocaBaseline').textContent=lookups.toLocaleString('ko-KR');
  $('#vocaOptimized').textContent=master.toLocaleString('ko-KR');
  $('#vocaSaving').textContent=`AI 호출 ${saving}% 감소(모델)`;
  $('#vocaOptimized').nextElementSibling.style.setProperty('--bar',`${master/lookups*100}%`);
}

function updateSkills(count){
  const shown=nodes.slice(0,count),values=Object.fromEntries(skills.map(skill=>[skill.key,0]));
  for(const item of shown)if(item.skill)values[item.skill.key]=Math.max(values[item.skill.key],item.skill.value);
  for(const skill of skills){const row=document.querySelector(`[data-skill="${skill.key}"]`);row.querySelector('small').textContent=`${values[skill.key]} / ${skillScale}`;row.querySelectorAll('[data-cell]').forEach(cell=>cell.classList.toggle('filled',Number(cell.dataset.cell)<=values[skill.key]));}
  const latest=shown.at(-1);
  $('#skillEvent').textContent=latest?.skill?`${latest.skill.label} ${latest.skill.value}/${skillScale} · ${latest.skill.level}`:latest?`${latest.short} · 단계 변화 없음`:'경험이 쌓이면 변합니다';
  $('#skillTrace').classList.toggle('has-experience',count>0);
  $('#skillTrace').classList.toggle('has-skill',Object.values(values).some(value=>value>0));
}

function updateSkillFocus(){
  const active=hoveredSkill||pinnedSkill;
  chart.classList.toggle('is-skill-focus',Boolean(active));
  starsLayer.querySelectorAll('.star').forEach(star=>star.classList.toggle('is-skill-match',Boolean(active&&node(star.dataset.id).skill?.key===active&&star.classList.contains('is-visible'))));
  $('#skillRows').querySelectorAll('.skill-row').forEach(row=>{
    row.classList.toggle('is-active',row.dataset.skill===active);
    row.setAttribute('aria-pressed',String(row.dataset.skill===pinnedSkill));
  });
}

function updateStage(){
  ticking=false;
  if(reduced.matches||scrollY+innerHeight>section.offsetTop+180)stage.classList.add('has-entered');
  const range=Math.max(1,section.offsetHeight-innerHeight);
  progress=reduced.matches?1:Math.max(0,Math.min(1,(scrollY-section.offsetTop)/range));
  const count=nodes.filter((_,index)=>progress>=.055+index*.052).length;
  starsLayer.querySelectorAll('.star').forEach((star,index)=>{const shown=index<count;star.classList.toggle('is-visible',shown);star.tabIndex=shown?0:-1;});
  if(count!==visibleCount){visibleCount=count;updateSkills(count);}
  $('#stageCount').textContent=String(count).padStart(2,'0');
  $('#progressFill').style.width=`${Math.round(progress*100)}%`;
  $('#progressLabel').textContent=`${Math.round(progress*100)}%`;
  $('#stagePhase').textContent=progress>=.9?'THE CONSTELLATION':progress>=.78?'THE RELATIONSHIPS':progress>=.48?'THE BRANCHES':'THE TIMELINE';
  svg.querySelectorAll('.relation').forEach((group,index)=>{
    const relationDuration=.03;
    const relationStagger=(.895-.785-relationDuration)/Math.max(1,relations.length-1);
    const local=Math.max(0,Math.min(1,(progress-(.785+index*relationStagger))/relationDuration));
    const visible=local>0;
    group.classList.toggle('is-revealed',visible);
    group.tabIndex=visible?0:-1;
    const path=group.querySelector('.relation-visible');path.style.strokeDashoffset=`${(1-local)*path.getTotalLength()}px`;path.classList.toggle('is-complete',local>=1);
  });
  if(progress<.785)closeRelation();
  updateSkillFocus();
}
function requestStage(){if(!ticking){ticking=true;requestAnimationFrame(updateStage);}}

$('#dialogClose').addEventListener('click',closeDialog);
$('#relationClose').addEventListener('click',closeRelation);
dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});
$('#userRange').addEventListener('input',updateModel);
$('#skillToggle').addEventListener('click',()=>{const panel=$('#skillTrace'),open=panel.classList.toggle('is-open');$('#skillToggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&pinnedSkill){pinnedSkill=null;hoveredSkill=null;updateSkillFocus();}});
window.addEventListener('scroll',requestStage,{passive:true});
window.addEventListener('resize',requestStage);
reduced.addEventListener('change',requestStage);
prepareIntroMotion();createChart();updateModel();updateStage();
