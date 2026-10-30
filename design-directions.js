import {applyDirection} from './direction-preview.js?v=bdc234b2469c85f9';
import {icon} from './icons.js?v=bdc234b2469c85f9';

// Review values only. They do not change the DDS token source or release files.
export const directionOptions = [
  {id:'current',code:'A',name:'현재 DDS',detail:'비교 기준',font:'pretendard',multicolor:false,colors:{primary:'#FFAD31',secondary:'#FFAD31',accent:'#FFAD31',positive:'#18734B'}},
  {id:'multi',code:'B',name:'기능별 컬러',detail:'기능 카드별 색상 구분',font:'pretendard',multicolor:true,featureColors:true,colors:{primary:'#FFAD31',secondary:'#356AE6',accent:'#7B61C8',positive:'#1E846B'}},
  {id:'cobalt',code:'C',name:'코발트',detail:'파란 Primary',font:'pretendard',multicolor:true,neutralLogo:true,colors:{primary:'#3659D9',secondary:'#4C6EAD',accent:'#8E66BE',positive:'#247D6D'}},
  {id:'teal',code:'D',name:'그린 멀티',detail:'녹색 Primary + 기능별 컬러',font:'pretendard',multicolor:true,featureColors:true,neutralLogo:true,colors:{primary:'#0F766E',secondary:'#3974D6',accent:'#8B60C7',positive:'#27845D'}},
  {id:'plex',code:'E',name:'IBM Plex Sans KR',detail:'색상 고정 · 서체만 변경',font:'plex',preserveColors:true,multicolor:false,colors:{primary:'#FFAD31',secondary:'#FFAD31',accent:'#FFAD31',positive:'#18734B'}},
  {id:'suite',code:'F',name:'SUITE',detail:'색상 고정 · 서체만 변경',font:'suite',preserveColors:true,multicolor:false,colors:{primary:'#FFAD31',secondary:'#FFAD31',accent:'#FFAD31',positive:'#18734B'}},
  {id:'serif',code:'G',name:'Noto Serif KR',detail:'명조 계열 · 서체만 변경',font:'serif',preserveColors:true,multicolor:false,colors:{primary:'#FFAD31',secondary:'#FFAD31',accent:'#FFAD31',positive:'#18734B'}},
  {id:'studio',code:'H',name:'컬러 + Plex',detail:'기능별 컬러와 서체 조합',font:'plex',multicolor:true,featureColors:true,colors:{primary:'#FFAD31',secondary:'#3857B7',accent:'#7965C1',positive:'#267E70'}}
];
const screens=[
  {id:'components',name:'조합 예시',url:'./prototypes/direction-sample.html'},
  {id:'catalog',name:'전체 컴포넌트',url:'./index.html#/components'},
  {id:'home',name:'메인화면',url:'./prototypes/home-independent.html'},
  {id:'writing',name:'자소서 작성',url:'./prototypes/coverletter-write.html'},
  {id:'interview',name:'딥인터뷰',url:'./prototypes/interview-setup.html'}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function initialState(){const q=new URLSearchParams(location.hash.split('?')[1]||'');return {variant:directionOptions.some(p=>p.id===q.get('variant'))?q.get('variant'):'multi',screen:screens.some(p=>p.id===q.get('screen'))?q.get('screen'):'components',compare:q.get('compare')==='1',theme:q.get('theme')==='dark'?'dark':'light',mobile:q.get('size')==='mobile'};}
const option=id=>directionOptions.find(p=>p.id===id)||directionOptions[0];
let disposeReview=()=>{};
export function disposeDirections(){disposeReview();disposeReview=()=>{};}
export function directionsPage(){
  const state=initialState();
  return `<div class="breadcrumbs"><a href="#/">DDS</a><span>/</span><span>디자인 방향 비교</span></div><div class="page-heading"><div><h1>디자인 방향 비교</h1><p class="lead">같은 화면에서 색상과 서체의 차이를 확인합니다.</p></div></div>
  <div class="directions" id="direction-review">
    <p class="direction-note">검토용 비교입니다. 현재 DDS 토큰·프롬프트·서비스 시안은 유지합니다.</p>
    <div class="direction-options" role="group" aria-label="디자인 방향 선택">${directionOptions.map(p=>`<button type="button" class="direction-choice" data-direction="${p.id}" aria-pressed="${p.id===state.variant}"><span class="direction-choice-title"><span>${p.code}</span>${p.name}</span><span class="direction-choice-note">${p.detail}</span><span class="direction-swatches" aria-hidden="true">${Object.values(p.colors).map(c=>`<i style="background:${c}"></i>`).join('')}</span></button>`).join('')}</div>
    <div class="direction-tools"><div class="direction-screen-tabs" role="tablist" aria-label="비교할 화면">${screens.map(s=>`<button type="button" role="tab" data-direction-screen="${s.id}" aria-selected="${s.id===state.screen}" tabindex="${s.id===state.screen?0:-1}">${s.name}</button>`).join('')}</div><div class="direction-view-tools"><span id="direction-inline-name"></span><button type="button" class="btn ghost sm" id="direction-previous">이전 안</button><button type="button" class="btn ghost sm" id="direction-next">다음 안</button><button type="button" class="btn sm" id="direction-compare" aria-pressed="${state.compare}">현재 DDS와 나란히</button><button type="button" class="btn sm" id="direction-size" aria-pressed="${state.mobile}">모바일 폭</button><button type="button" class="btn sm" id="direction-mode" aria-pressed="${state.theme==='dark'}">다크 비교</button><button type="button" class="btn sm" id="direction-share">링크 복사</button></div></div>
    <div class="direction-summary" id="direction-summary"></div>
    <div class="direction-stages" id="direction-stages" data-compare="${state.compare}">
      <section class="direction-pane" id="direction-reference" ${state.compare?'':'hidden'}><div class="direction-pane-heading"><h2>A · 현재 DDS</h2></div><div class="direction-viewport"><iframe id="direction-baseline-frame" title="현재 DDS 기준 화면" sandbox="allow-scripts allow-same-origin" loading="lazy"></iframe></div></section>
      <section class="direction-pane"><div class="direction-pane-heading"><h2 id="direction-selected-name"></h2><button type="button" class="icon-btn" id="direction-expand" aria-label="비교 화면 크게 보기" aria-expanded="false" aria-controls="direction-stages">${icon('Maximize2')}</button></div><div class="direction-viewport"><iframe id="direction-selected-frame" title="선택한 디자인 방향" sandbox="allow-scripts allow-same-origin"></iframe></div></section>
    </div><p id="direction-announcement" class="sr-only" role="status" aria-live="polite"></p>
  </div>`;
}

export function bindDirections(){
  disposeDirections();
  const root=document.querySelector('#direction-review');if(!root)return;
  let state=initialState();
  const frame=root.querySelector('#direction-selected-frame'),baseline=root.querySelector('#direction-baseline-frame');
  const summary=root.querySelector('#direction-summary');
  function announce(text){root.querySelector('#direction-announcement').textContent=text;}
  function frameGuard(doc){
    if(doc.documentElement.dataset.directionGuard)return;
    doc.documentElement.dataset.directionGuard='true';
    if(doc.querySelector('.workspace'))doc.body.classList.add('direction-gallery-frame');
    doc.addEventListener('click',e=>{const theme=e.target.closest('#appearance-toggle');if(theme){e.preventDefault();e.stopImmediatePropagation();state.theme=state.theme==='light'?'dark':'light';update();return;}const link=e.target.closest('a[href]');if(link&&!link.getAttribute('href').startsWith('#')){e.preventDefault();e.stopImmediatePropagation();}},true);
    doc.addEventListener('keydown',e=>{if(e.key==='Escape')setExpanded(false);});
  }
  async function paint(target,profile){
    if(!target.contentDocument?.body||!target.dataset.loaded)return;
    frameGuard(target.contentDocument);
    await applyDirection(target.contentDocument,profile,state.theme);
    const appearance=target.contentDocument.querySelector('#appearance-toggle');
    if(appearance){const label=state.theme==='dark'?'라이트 모드로 전환':'다크 모드로 전환';appearance.setAttribute('aria-label',label);const lib=target.contentWindow.lucide;if(lib?.icons){appearance.replaceChildren(lib.createElement(lib.icons[state.theme==='dark'?'Sun':'Moon'],{width:20,height:20,'stroke-width':2,'aria-hidden':'true',class:'icon'}));}}
    target.dataset.ready='true';
  }
  function setFrame(target,profile,load){
    const source=screens.find(s=>s.id===state.screen).url;
    if(load||target.dataset.screen!==state.screen){
      target.dataset.screen=state.screen;delete target.dataset.loaded;delete target.dataset.ready;
      target.src=source;
      target.onload=()=>{target.dataset.loaded='true';paint(target,target===baseline?directionOptions[0]:option(state.variant)).catch(()=>announce('화면을 불러오지 못했습니다. 다시 선택해 주세요.'));};
    }else paint(target,profile).catch(()=>announce('디자인 적용을 확인해 주세요.'));
  }
  function update(){
    const profile=option(state.variant);
    root.querySelectorAll('[data-direction]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.direction===state.variant));
    root.querySelectorAll('[data-direction-screen]').forEach(b=>{const active=b.dataset.directionScreen===state.screen;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});
    for(const [id,value] of [['direction-compare',state.compare],['direction-size',state.mobile],['direction-mode',state.theme==='dark']])root.querySelector('#'+id).setAttribute('aria-pressed',value);
    root.querySelector('#direction-stages').dataset.compare=state.compare;
    root.querySelector('#direction-stages').dataset.mobile=state.mobile;
    root.querySelector('#direction-reference').hidden=!state.compare;
    root.querySelector('#direction-selected-name').textContent=profile.code+' · '+profile.name;
    root.querySelector('#direction-inline-name').textContent=profile.code+' · '+profile.name;
    summary.innerHTML=`<p>${profile.id==='current'?'현재 DDS를 그대로 표시합니다.':profile.preserveColors?'색상과 레이아웃은 그대로 두고 서체만 바꿉니다.':profile.featureColors?'기능별 카드·아이콘·AI 보조 영역에 색을 배치하고 본문과 입력은 차분하게 유지합니다.':profile.multicolor?'주 행동 · 탐색/선택 · AI 보조 · 완료를 구분해 색을 배치합니다.':'현재 레이아웃에 다른 색상을 적용합니다.'}</p><div>${[['주 행동',profile.colors.primary],['탐색·선택',profile.colors.secondary],['AI 보조',profile.colors.accent],['완료',profile.colors.positive]].map(([role,color])=>`<span><i style="background:${color}"></i>${role}<b>${color}</b></span>`).join('')}</div>`;
    setFrame(frame,profile,false);if(state.compare)setFrame(baseline,directionOptions[0],false);
    const q=new URLSearchParams({variant:state.variant,screen:state.screen,theme:state.theme});if(state.compare)q.set('compare','1');if(state.mobile)q.set('size','mobile');
    history.replaceState(null,'','#/directions?'+q.toString());
    announce(profile.name+' · '+screens.find(s=>s.id===state.screen).name+' · '+(state.theme==='dark'?'다크':'라이트'));
    fitFrames();
  }
  root.querySelectorAll('[data-direction]').forEach(b=>b.addEventListener('click',()=>{state.variant=b.dataset.direction;update();}));
  root.querySelectorAll('[data-direction-screen]').forEach(b=>b.addEventListener('click',()=>{state.screen=b.dataset.directionScreen;update();}));
  root.querySelector('#direction-compare').onclick=()=>{state.compare=!state.compare;update();};
  root.querySelector('#direction-size').onclick=()=>{state.mobile=!state.mobile;update();};
  root.querySelector('#direction-mode').onclick=()=>{state.theme=state.theme==='light'?'dark':'light';update();};
  for(const [id,step] of [['direction-previous',-1],['direction-next',1]])root.querySelector('#'+id).onclick=()=>{state.variant=directionOptions[(directionOptions.findIndex(p=>p.id===state.variant)+step+directionOptions.length)%directionOptions.length].id;update();};
  root.querySelector('#direction-share').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);announce('비교 링크를 복사했습니다.');const b=root.querySelector('#direction-share');b.textContent='복사 완료';setTimeout(()=>{if(b.isConnected)b.textContent='링크 복사';},1800);}catch{announce('주소창의 링크를 복사해 주세요.');}};
  function setExpanded(expanded){const stages=root.querySelector('#direction-stages'),button=root.querySelector('#direction-expand');stages.classList.toggle('direction-expanded',expanded);button.setAttribute('aria-label',expanded?'비교 화면 크게 보기 닫기':'비교 화면 크게 보기');button.setAttribute('aria-expanded',String(expanded));button.innerHTML=icon(expanded?'Minimize2':'Maximize2');fitFrames();if(expanded)stages.scrollTop=0;}
  root.querySelector('#direction-expand').onclick=()=>setExpanded(!root.querySelector('#direction-stages').classList.contains('direction-expanded'));
  root.addEventListener('keydown',e=>{if(e.key==='Escape')setExpanded(false);});
  function fitFrames(){for(const pane of root.querySelectorAll('.direction-viewport')){const scaled=state.compare&&!state.mobile&&!root.querySelector('.direction-expanded')&&pane.clientWidth>=360&&innerWidth>1100;pane.classList.toggle('direction-scaled',scaled);const scale=scaled?Math.min(1,pane.clientWidth/960):1;pane.style.setProperty('--direction-frame-scale',scale);pane.style.height=scaled?`${820*scale}px`:'';}}
  const resize=new ResizeObserver(fitFrames);root.querySelectorAll('.direction-viewport').forEach(p=>resize.observe(p));
  disposeReview=()=>resize.disconnect();
  update();
}
