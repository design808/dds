import {handoffPage} from './developer-guide.js?v=cbfddd8310a75f76';
import {getDesignSettings} from './design-settings.js?v=cbfddd8310a75f76';
import {textColorSection} from './text-colors.js?v=cbfddd8310a75f76';
import {setupPage,ddsRelease} from './adoption-content.js?v=cbfddd8310a75f76';
import {refreshSetupPrompt,downloadSetupPrompt} from './setup-source-page.js?v=cbfddd8310a75f76';
import {bindComponentVariants} from './component-variants.js?v=cbfddd8310a75f76';
import {renderJobListExample,bindListBlocks} from './block-list.js?v=cbfddd8310a75f76';
import {typographyPage,bindTypography} from './typography-system.js?v=cbfddd8310a75f76';
import {formValidationSpec,contentBehaviorSpec,bindServiceGuidelines} from './service-guidelines.js?v=cbfddd8310a75f76';
import {sidebarContent,overviewContent,componentContent,renderPattern,searchableDocuments} from './document-shell.js?v=cbfddd8310a75f76';
import {principlesContent,processContent} from './document-content.js?v=cbfddd8310a75f76';
import {icon,iconGallery,bindIconGallery} from './icons.js?v=cbfddd8310a75f76';
import {collectionCount,statusBadge} from './visibility.js?v=cbfddd8310a75f76';
import {renderComponentSource} from './ui/source.js?v=cbfddd8310a75f76';
import {renderDocumentCard} from './ui/core.js?v=cbfddd8310a75f76';
import {mountDDS} from './ui/index.js?v=cbfddd8310a75f76';
import './interactions.js?v=cbfddd8310a75f76';
import {extensionDemo,bindExtensions} from './extension-demos.js?v=cbfddd8310a75f76';
import {chartDemo,bindCharts} from './chart-system.js?v=cbfddd8310a75f76';
import {buttonDemo,buttonCodeExample,bindButtonDemos} from './button-demos.js?v=cbfddd8310a75f76';
import {blocksPage,bindBlocks} from './blocks.js?v=cbfddd8310a75f76';
import {chartRouteAliases} from './chart-catalog.js?v=cbfddd8310a75f76';
import {colorPage} from './color-system.js?v=cbfddd8310a75f76';
import {components,groups,patterns,foundations} from './catalog.js?v=cbfddd8310a75f76';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const releaseBadge=document.querySelector('[data-dds-release]');
if(releaseBadge){releaseBadge.textContent='v'+ddsRelease;releaseBadge.setAttribute('aria-label','DDS 버전 '+ddsRelease);}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('#search-open').setAttribute('aria-label','문서 검색');
$('#search-open').setAttribute('data-tooltip','Ctrl K');

let demoSequence=0;
let view='/',selectedGroup='All';
let cleanupButtonDemos=()=>{};
let cleanupBlocks=()=>{};
let cleanupListExamples=()=>{};
let cleanupCharts=()=>{};
let cleanupVariants=()=>{};
let theme=localStorage.getItem('deep-theme')||'light';document.documentElement.dataset.theme=theme;document.querySelector('#theme-toggle').innerHTML=icon(theme==='light'?'moon':'sun');$("#theme-toggle").setAttribute("aria-label",theme==="light"?"다크 모드로 전환":"라이트 모드로 전환");
const badge=(s,t='')=>({success:'complete',info:'pending',danger:'error'}[t]?statusBadge({success:'complete',info:'pending',danger:'error'}[t],s,icon):`<span class="badge dds-badge ${t}">${esc(s)}</span>`);
const btn=(label,cls='',extra='')=>`<button class="btn ${cls}" ${extra}>${label}</button>`;
const sectionTitle=(title,note='')=>`<div class="section-heading"><h2>${title}</h2>${note?`<span class="muted small">${note}</span>`:''}</div>`;
const head=(category,title,description,tag='')=>`<div class="breadcrumbs"><a href="#/">DDS</a><span>/</span><span>${category}</span></div><div class="page-heading"><div><h1>${title}</h1><p class="lead">${description}</p></div>${tag}</div>`;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),3500);}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('클립보드에 복사했습니다.');}catch{toast('복사 권한이 없습니다. 코드 내용을 선택해 복사해 주세요.');}}
window.addEventListener('dds-design-profile-change',()=>refreshSetupPrompt(document));
document.addEventListener('click',event=>{if(event.target.closest('[data-dds-prompt-download]'))downloadSetupPrompt(document);});
function nav(){
 $('#sidebar').innerHTML=sidebarContent(view);
 const active=view.startsWith('/foundations')?'foundations':view.startsWith('/components')?'components':view.startsWith('/blocks')?'blocks':['/handoff','/setup'].includes(view)?'handoff':['/','/principles','/process'].includes(view)?'overview':'';
 $$('.topbar nav a').forEach(a=>{
   const selected=a.dataset.top===active;
   a.classList.toggle('active',selected);
   if(selected)a.setAttribute('aria-current',a.getAttribute('href').slice(1)===view.split('?')[0]?'page':'location');
   else a.removeAttribute('aria-current');
 });
}

function documentCard(...args){return renderDocumentCard(...args);}
function demo(id,mini=false,instanceSuffix=''){
 const uid='demo-'+id+(mini?'-mini-'+(++demoSequence):'')+instanceSuffix;
 const markup=id==='button'?buttonDemo(mini,uid):id==='chart'?chartDemo(id,uid,mini):renderComponentSource(id,uid,mini);
 const resolved=markup.replace(/(\bsrc=["'])\/assets\//g,(_,prefix)=>prefix+new URL('./assets/',import.meta.url).href);
 return `<div class="dds-ui" data-dds-component="${id}">${resolved}</div>`;
}
function card(c){return `<article class="component-card" data-component="${c.id}"><div class="component-preview"><div class="preview-inner inert-preview" inert aria-hidden="true">${demo(c.id,true)}</div></div><div class="card-caption"><div><h3><a class="component-card-link" href="#/components/${c.id}" aria-label="${esc(c.name)} · ${esc(c.ko)} 컴포넌트 보기">${esc(c.name)}</a></h3><p>${esc(c.ko)}</p></div><span class="component-card-arrow" aria-hidden="true">${icon('arrow')}</span></div></article>`;}
function overview(){return overviewContent(card);}

function componentList(){return head('COMPONENTS','Components','컴포넌트별 구조, 상태, 사용법과 코드 예제.',badge(`${components.length} components`))+`<div class="filter-bar"><div class="pill-tabs" role="group" aria-label="컴포넌트 분류">${['All',...groups].map(g=>btn(g,g===selectedGroup?'selected':'',`data-group="${g}" aria-pressed="${g===selectedGroup}"`)).join('')}</div><label class="search-field">${icon('search')}<input type="search" id="component-search" placeholder="컴포넌트 검색" aria-label="컴포넌트 검색"></label></div><div id="component-results" class="component-grid">${components.filter(c=>selectedGroup==='All'||c.group===selectedGroup).map(card).join('')}</div>`;}
const fieldControlIds=['input','select','combobox','date-picker','search','input-group','time-picker','field','input-otp'];
function controlSizingSpec(){return `<div class="guideline"><b>입력 크기와 콘텐츠 대응</b><p>크기는 높이·글자·패딩·아이콘을 함께 바꿉니다. Small은 도구 모음의 짧은 입력·선택에, Medium은 일반 폼에, Large는 문서 제목처럼 강조하는 입력에 사용합니다. 화면이 좁다는 이유만으로 Small로 바꾸지 않습니다.</p><p>높이는 한 줄일 때의 테두리 포함 기준입니다. 선택값이 길면 Select는 줄바꿈하며 높이가 늘어납니다. 직접 입력하는 한 줄 텍스트는 내부에서 스크롤하고, 긴 작성 본문은 Textarea를 사용합니다.</p></div>
<div class="table-wrap"><table><thead><tr><th>크기</th><th>한 줄 높이</th><th>입력·선택 값</th><th>좌우 여백 / 아이콘</th></tr></thead><tbody><tr><td>Small</td><td>36px</td><td>Body 2 Normal · 14 / 22</td><td>10px / 16px</td></tr><tr><td>Medium · 기본</td><td>44px</td><td>Body 1 Normal · 16 / 24</td><td>12px / 18px</td></tr><tr><td>Large</td><td>52px</td><td>Body 1 Normal · 16 / 24</td><td>16px / 20px</td></tr></tbody></table></div>
<p><code>data-control-size="sm|md|lg"</code>를 필드 또는 부모에 지정합니다. 펼친 선택 목록도 같은 글자 크기를 사용합니다. Small 버튼은 Label 2(13 / 18)와 최소 높이 36px를 사용합니다. <a href="./control-sizing.css?v=cbfddd8310a75f76" download>control-sizing.css</a>를 컴포넌트·화면 스타일 뒤에 로드합니다.</p>
<div class="control-size-examples">${[['sm','Small · 36px / 14px'],['md','Medium · 44px / 16px'],['lg','Large · 52px / 16px']].map(([size,label])=>`<div class="control-size-row" data-control-size="${size}"><p>${label}</p><div><div class="field"><label for="sizing-${size}-text">텍스트 입력</label><input id="sizing-${size}-text" placeholder="내용을 입력해 주세요"></div><div class="field"><label for="sizing-${size}-select">선택 상자</label><select id="sizing-${size}-select"><option>선택해 주세요</option><option>디자인</option><option>개발</option></select></div><div class="field"><label for="sizing-${size}-date">날짜 입력</label><input id="sizing-${size}-date" type="date"></div></div></div>`).join('')}</div>
<h3>내용에 맞는 너비와 줄바꿈</h3><p>폼은 가용 너비를 채우고, 짧은 도구 모음은 <code>data-control-width="content"</code>로 가장 긴 옵션의 너비를 확보합니다. 선택값이 바뀌어도 버튼 위치가 흔들리지 않습니다. 가용 공간보다 긴 값은 줄임표 대신 줄바꿈합니다. 버튼·칩·상태·도움말도 내용에 따라 높이가 늘어나며 아이콘은 줄어들지 않습니다.</p>
<div class="content-fit-examples"><div class="fit-toolbar" data-control-size="sm"><select aria-label="콘텐츠 너비 번역 언어" data-control-width="content"><option>한국어</option><option>English</option><option>日本語</option><option>简体中文</option><option>Español (Latinoamérica)</option></select><button class="btn sm">번역 결과를 확인하고 적용하기</button></div><div class="field"><label for="fit-long-selection">긴 선택값</label><select id="fit-long-selection"><option>서비스 기획·사용자 경험 설계와 프로덕트 디자인을 함께 담당하는 직무</option><option>짧은 항목</option></select></div><div class="fit-toolbar"><button class="btn">작성한 자기소개서를 저장하고 다음 단계로 이동하기</button><span class="badge">담당 컨설턴트의 상세 검토와 피드백 작성을 기다리고 있습니다</span><button class="chip">사용자 리서치와 서비스 경험을 개선한 프로젝트</button></div><div class="alert info">${icon('info')}<div><b>긴 안내 문장도 생략하지 않습니다.</b><p>첨부 파일: DeepResume_Application_DesignResearch_ProjectPortfolio_FinalReview_2026.pdf</p></div></div></div>`;}
function componentDetail(c){
 if(c.id==='item')return componentContent(c,demo(c.id),{
  previewHTML:`<section id="preview"><div class="section-heading"><h2>외곽선형</h2></div><div class="playground"><div class="playground-inner">${demo(c.id)}</div></div></section><section id="item-divided"><div class="section-heading"><h2>구분선형 목록</h2></div><p>외곽 테두리 없이 행 사이를 구분합니다. 후행 정보와 별도 행동은 필요한 경우에만 넣습니다.</p>${renderJobListExample('item-divided-example')}<p><a href="#/blocks?block=job-list">채용 공고 목록 블록 보기</a></p></section>`,
  previewToc:[['preview','외곽선형'],['item-divided','구분선형 목록']]
 });
 if(c.id==='top-navigation')return componentContent(c,`<div class="doc-header-preview-set">${demo(c.id)}<details class="doc-header-desktop-details"><summary>데스크톱 헤더 보기</summary><div class="doc-header-scroll" role="region" aria-label="데스크톱 헤더" tabindex="0"><div class="doc-header-desktop">${demo(c.id,false,'-desktop')}</div></div></details></div>`);
 if(c.id==='button')return componentContent(c,buttonCodeExample(),{
   previewHTML:buttonDemo(),
   previewToc:[['button-variants','Variants'],['button-icons','아이콘'],['button-sizes','크기'],['button-disabled','비활성'],['button-loading','로딩'],['button-width','너비']]
 });
 return componentContent(c,demo(c.id));
}

function foundationsPage(id){const f=foundations.find(x=>x[0]===id);let body='';if(id==='color'){body=colorPage(getDesignSettings());}
else if(id==='typography'){body=typographyPage();}
else if(id==='spacing'){body=`${sectionTitle('4px spacing system')}<div class="spacing-list">${[4,8,12,16,20,24,32,40,48,64].map(v=>`<div><code>space.${v/4}</code><div style="width:${v*3}px"></div><span>${v}px</span></div>`).join('')}</div><h2>입력 요소 크기</h2>${controlSizingSpec()}<h2>DDS 문서 사이트의 반응형 배치</h2><div class="table-wrap"><table><thead><tr><th>구간</th><th>레이아웃</th><th>여백</th></tr></thead><tbody><tr><td>Mobile · &lt; 768px</td><td>1열 · 메뉴 접기 · 문서 우선</td><td>20px</td></tr><tr><td>Tablet · 768–1199px</td><td>2열 · 보조 목차 숨김</td><td>32px</td></tr><tr><td>Desktop · ≥ 1200px</td><td>사이드바 + 본문 + 문서 목차</td><td>48–64px</td></tr></tbody></table></div><p>긴 편집 화면은 문서 본문과 보조 행동 영역을 분리하고, 작은 화면에서는 주 행동을 읽기 흐름 마지막에 배치합니다.</p>`;}
else if(id==='shape'){body=`${sectionTitle('Radius')}<div class="shape-grid">${[4,8,12,16].map(n=>`<div><div style="border-radius:${n}px">${n}</div><code>radius.${n}px</code></div>`).join('')}</div><h2>Elevation</h2><div class="two-col"><div class="elevation" style="box-shadow:var(--shadow-sm)"><b>Surface / level 1</b><p>일반 카드와 고정 내비게이션</p></div><div class="elevation" style="box-shadow:var(--shadow-overlay)"><b>Overlay / level 2</b><p>다이얼로그와 메뉴</p></div></div><h2>Iconography</h2><div class="demo-row icon-gallery">${['file','search','plus','copy','check','close','arrow','layers'].map(i=>icon(i)).join('')}</div><p>Lucide 원본의 24px 그리드, 2px 선 두께를 사용합니다. <a href="#/foundations/icons">전체 아이콘 보기</a>. 아이콘만 있는 행동은 접근 가능한 이름을 제공하고 작은 아이콘에도 충분한 클릭 영역을 확보합니다.</p>`;}
else if(id==='motion'){body=`<div class="two-col"><div class="guideline"><b>120ms / 상태 피드백</b><p>버튼·칩·입력 경계의 색상 전환, 메뉴와 선택 목록의 등장.</p></div><div class="guideline"><b>180ms / 맥락 전환</b><p>모달·시트의 열림과 닫힘, 펼침 패널, 탭 내용과 토스트.</p></div></div><h2>인터랙션 규칙</h2><ul class="plain-list"><li>선택·입력·저장은 즉시 반영합니다. 애니메이션이 끝날 때까지 행동을 막지 않습니다.</li><li>버튼 누름은 최대 1px, 메뉴와 모달의 등장은 4–6px 이동합니다. 시트는 방향을 알 수 있도록 16px 이내로 이동합니다.</li><li>카드와 탭의 크기를 내용 전환에 따라 확대·축소하지 않습니다. 페이지 전체 등장 효과나 순차 지연을 적용하지 않습니다.</li><li>닫기 아이콘은 22px, 클릭 영역은 40px입니다. 호버·키보드 포커스 시 중립색 배경을 표시합니다.</li><li>키보드 포커스 경계는 즉시 표시하고, 모달을 닫으면 실행한 요소로 돌아갑니다.</li></ul><h2>동작 확인</h2><div class="playground pattern-preview">${demo('dialog')}${demo('tabs')}${demo('accordion')}${demo('toast')}</div><h2>모션 적용 기준</h2><p>운영체제의 동작 줄이기 설정과 관계없이 DDS의 전환을 동일하게 적용합니다. 반복 모션은 로딩 상태에만 사용하고 처리 상태를 문구로도 안내합니다. 최신 CSS 전환을 지원하지 않는 브라우저에서도 기능과 최종 상태는 동일하게 유지됩니다.</p><div class="guideline"><b>공통 구현</b><p><code>interactions.css</code>의 공통 전환과 <code>--duration-fast</code>·<code>--duration-normal</code> 토큰을 사용합니다. 입력값과 데이터 처리 코드는 모션과 분리합니다.</p></div>`;}
else if(id==='accessibility'){body=`<div class="alert info">${icon('info')}<p>목표는 WCAG 2.2 AA입니다. 아래는 설계·검토 기준이며 제품 전체의 적합성 인증을 의미하지 않습니다.</p></div><div class="checklist">${['일반 텍스트 대비 4.5:1 이상, 큰 텍스트 3:1 이상','UI 경계·상태 표현은 필요한 곳에 3:1 이상의 대비','모든 행동을 키보드로 사용, 눈에 보이는 포커스 유지','입력 라벨과 오류를 연결하고 오류 요약 제공','200% 확대와 좁은 화면에서 읽기·조작 가능','모달 초점 관리, Escape 닫기, 닫은 후 트리거 복귀','녹화 권한·남은 시간·업로드 실패를 명확하게 안내','차트의 수치 대안과 영상의 자막·텍스트 대안 검토'].map(t=>`<div>${icon('check')}<span>${t}</span></div>`).join('')}</div><p>터치 영역은 가급적 44×44px를 권장합니다. WCAG 2.2 AA의 Target Size (Minimum)는 24×24 CSS px 또는 정해진 예외 조건을 기준으로 검토합니다.</p><a class="btn" href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noreferrer">W3C 공식 기준 ${icon('arrow')}</a>`;}
else{body=`<h2>차분하고 구체적인 안내</h2><p>사용자가 지금 할 수 있는 행동을 중심으로 씁니다. 기술적 원인보다 이해할 수 있는 상태와 해결 방법을 먼저 전합니다.</p><div class="table-wrap"><table><thead><tr><th>상황</th><th>권장 문구</th><th>피할 문구</th></tr></thead><tbody><tr><td>저장 성공</td><td>자기소개서를 저장했어요.</td><td>성공!</td></tr><tr><td>필수 입력</td><td>지원 직무를 입력해 주세요.</td><td>잘못된 입력입니다.</td></tr><tr><td>AI 생성 실패</td><td>문장을 생성하지 못했어요. 입력 내용은 유지됩니다. 다시 시도해 주세요.</td><td>API Error 500</td></tr><tr><td>접근 제한</td><td>이 기능은 일반회원 계정에서 이용할 수 있어요.</td><td>권한 없음</td></tr></tbody></table></div><h2>용어 사전</h2><div class="state-list">${['자기소개서','이력서','임시저장','저장 완료','승인 대기','컨설팅 중','컨설팅 완료','반려'].map(s=>badge(s)).join('')}</div><p>본문에는 ‘자기소개서’를 사용하고, 공간이 제한된 내비게이션에서는 승인된 축약어 ‘자소서’를 사용할 수 있습니다.</p>`;}
return head('FOUNDATIONS',f[1],f[2]+'의 공통 기준과 적용 방법.')+`<div class="reading">${body}${id==='accessibility'?formValidationSpec():id==='content'?contentBehaviorSpec():''}</div>`;}
function patternPage(p){const sample=p.id==='account-access'?demo('field')+demo('input-group'):p.id==='public-home'?demo('top-navigation')+demo('carousel'):p.id==='order-history'?demo('item')+demo('badge'):p.id==='document-list'?`<div class="two-col">${documentCard()}${documentCard('서비스 기획자 이력서','저장 완료')}</div>`:p.id==='ai-writing'?demo('stepper')+demo('editor'):p.id==='interview-report'?demo('radar-chart-multiple')+demo('line-chart-multiple')+demo('accordion'):p.id==='interview'?demo('stepper')+demo('video'):p.id==='consultant-workspace'?demo('table'):p.id==='analysis'?demo('alert')+demo('accordion'):p.id==='swot'?`<div class="two-col">${['강점 S','약점 W','기회 O','위협 T'].map(s=>`<div class="guideline"><b>${s}</b><p>나의 경험을 구체적으로 정리해 보세요.</p></div>`).join('')}</div>`:p.id==='resume-builder'?demo('input')+demo('date-picker'):p.id==='community'?demo('search')+demo('textarea'):demo('card')+demo('badge');return renderPattern(p,sample);}

function principles(){return head('시작하기','디자인 원칙','화면을 설계하고 구현할 때 적용하는 기준.')+principlesContent();}

function processPage(){return head('시작하기','디자인 프로세스','기존 화면에 DDS를 적용하는 순서.')+processContent();}

function render(){
 cleanupButtonDemos();
 cleanupBlocks();
 cleanupListExamples();
 cleanupCharts?.();
 view=location.hash.slice(1)||'/';if(view.split('?')[0]==='/directions'){history.replaceState(null,'','#/');view='/';}const chartAlias=chartRouteAliases[view.split('?')[0].replace('/components/','')];if(view.startsWith('/components/')&&chartAlias){view='/components/'+chartAlias;history.replaceState(null,'','#'+view);}const route=view.split('?')[0];let html;
 document.body.classList.toggle('dds-blocks-page',route==='/blocks');
 if(route==='/')html=overview();
 else if(route==='/blocks')html=blocksPage();
 else if(route==='/components')html=componentList();
 else if(route.startsWith('/components/')){const c=components.find(c=>c.id===route.split('/')[2]);html=c?componentDetail(c):notFound();}
 else if(route==='/foundations/icons')html=iconGallery();
 else if(route.startsWith('/foundations/'))html=foundations.some(f=>f[0]===route.split('/')[2])?foundationsPage(route.split('/')[2]):notFound();
 else if(route.startsWith('/patterns/')){const p=patterns.find(p=>p.id===route.split('/')[2]);html=p?patternPage(p):notFound();}
 else html=({'/setup':setupPage,'/handoff':handoffPage,'/principles':principles,'/process':processPage}[route]||notFound)();
 $('#main').innerHTML=html;
 $('#main').removeAttribute('aria-busy');
 document.title=route==='/'?'Deep Design System':($('#main h1')?.textContent||'DDS')+' — Deep Design System';
 nav();bind();syncDesignDocs();window.scrollTo(0,0);document.body.classList.remove('menu-open');$('#mobile-menu').setAttribute('aria-expanded','false');
}

function notFound(){return head('404','문서를 찾을 수 없습니다.','메뉴에서 문서를 선택해 주세요.')+'<a class="btn" href="#/">살펴보기로 이동</a>';}
let cleanupDDS=()=>{};
function bind(){ cleanupVariants();cleanupVariants=bindComponentVariants($('#main'),view.split('/')[2]); cleanupDDS();cleanupDDS=mountDDS($('#main'),{controls:false,charts:false,tooltips:false}); cleanupButtonDemos=bindButtonDemos($('#main'),{notify:toast}); cleanupBlocks=bindBlocks($('#main')); cleanupListExamples=view.split('?')[0]==='/components/item'?bindListBlocks($('#main')):()=>{}; cleanupCharts=bindCharts($('#main')); bindServiceGuidelines(); bindTypography(); bindExtensions(); bindIconGallery(); document.querySelectorAll('[data-doc-tab]').forEach(t=>{const key=t.dataset.docTab;t.id='doc-tab-'+key;t.setAttribute('aria-controls','doc-panel-'+key);const p=document.querySelector('[data-doc-panel="'+key+'"]');p.id='doc-panel-'+key;p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby',t.id);}); $$('[data-counter]').forEach(t=>{const count=()=>{const el=t.closest('.field,.editor-demo')?.querySelector('[data-count]');if(el)el.textContent=`${t.value.length} / ${t.maxLength}`;};count();t.addEventListener('input',count);});$('#component-search')?.addEventListener('input',e=>{$('#component-results').innerHTML=components.filter(c=>(selectedGroup==='All'||c.group===selectedGroup)&&`${c.name} ${c.ko} ${(c.aliases||[]).join(" ")}`.toLowerCase().includes(e.target.value.toLowerCase())).map(card).join('')||'<p>검색 결과가 없습니다.</p>';});$$('[data-demo-search]').forEach(el=>el.addEventListener('input',()=>{el.closest('.field').querySelector('[data-search-count]').textContent=el.value?`“${el.value}” 검색 · ${'자기소개서'.includes(el.value)?1:0}개 예제 문서`:'문서 제목을 입력해 검색 예제를 확인하세요.';}));$$('[data-file]').forEach(el=>el.addEventListener('change',()=>{const f=el.files[0];el.closest('.upload-zone').querySelector('.file-state').textContent=!f?'선택한 파일이 없습니다.':f.size>10*1024*1024?'10MB 이하 파일을 선택해 주세요.':!f.name.toLowerCase().endsWith('.pdf')?'PDF 파일을 선택해 주세요.':`${f.name} · 선택 완료 (업로드하지 않음)`;}));}
document.addEventListener('click',e=>{const t=e.target.closest('button,[data-copy]');if(!t)return;if(t.hasAttribute('data-toast'))toast(t.dataset.toast);if(t.hasAttribute('data-copy'))copy(t.dataset.copy);if(t.hasAttribute('data-dialog')){$('#demo-dialog').showModal();}if(t.hasAttribute('data-close'))t.closest('dialog').close();if(t.hasAttribute('data-chip')){const s=t.getAttribute('aria-pressed')!=='true';t.setAttribute('aria-pressed',s);t.classList.toggle('selected',s);}if(t.hasAttribute('data-demo-tab')){const container=t.closest('.tab-demo');container.querySelectorAll('[role=tab]').forEach(x=>{x.setAttribute('aria-selected',x===t);x.tabIndex=x===t?0:-1;});const panel=container.querySelector('[role=tabpanel]');panel.textContent=t.textContent+' 목록을 확인하고 작성을 이어가세요.';panel.setAttribute('aria-labelledby',t.id);}if(t.hasAttribute('data-page')){const nav=t.closest('nav');nav.querySelectorAll('[data-page]').forEach(x=>{x.classList.toggle('primary',x===t);x.removeAttribute('aria-current');});t.setAttribute('aria-current','page');nav.querySelector('[data-page-state]').textContent=t.textContent+' / 4 페이지';}if(t.hasAttribute('data-group')){selectedGroup=t.dataset.group;render();}if(t.hasAttribute('data-doc-tab')){const chosen=t.dataset.docTab;$$('[data-doc-tab]').forEach(x=>{x.setAttribute('aria-selected',x===t);x.tabIndex=x===t?0:-1;});$$('[data-doc-panel]').forEach(p=>p.hidden=p.dataset.docPanel!==chosen);}if(t.classList.contains('copy-code'))copy(t.parentElement.querySelector('pre code').textContent);if(t.hasAttribute('data-scroll')){$('[data-doc-tab="design"]')?.click();$('#'+t.dataset.scroll)?.scrollIntoView({behavior:'smooth',block:'start'});}});
document.addEventListener('keydown',e=>{if(e.target.matches('[role=tab]')&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const tabs=[...e.target.parentElement.querySelectorAll('[role=tab]')];let i=tabs.indexOf(e.target);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[i].focus();tabs[i].click();}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}if(e.key==='Escape'){document.body.classList.remove('menu-open');$('#mobile-menu').setAttribute('aria-expanded','false');}});
function openSearch(){$('#search-dialog').showModal();$('#global-search').value='';search('');$('#global-search').focus();}
function search(q){const docs=searchableDocuments();const results=docs.filter(d=>`${d.name} ${d.ko} ${(d.aliases||[]).join(" ")}`.toLowerCase().includes(q.toLowerCase())).slice(0,12);$('#search-results').innerHTML=results.map(d=>`<a href="${d.external?d.url:'#'+d.url}">${icon('file')}<span><b>${esc(d.name)}</b><small>${esc(d.ko)}</small></span>${icon('chevron')}</a>`).join('')||'<p class="empty-state">검색 결과가 없습니다.</p>';}

$('#search-open').onclick=openSearch;$('#global-search').oninput=e=>search(e.target.value);$('#search-results').onclick=e=>{if(e.target.closest('a'))$('#search-dialog').close();};$('#theme-toggle').onclick=()=>{theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;localStorage.setItem('deep-theme',theme);$('#theme-toggle').innerHTML=icon(theme==='light'?'moon':'sun');$('#theme-toggle').setAttribute('aria-label',theme==='light'?'다크 모드로 전환':'라이트 모드로 전환');};$('#mobile-menu').onclick=()=>{const open=document.body.classList.toggle('menu-open');$('#mobile-menu').setAttribute('aria-expanded',open);};document.querySelector('.skip').onclick=e=>{e.preventDefault();document.querySelector('#main').focus();};window.addEventListener('hashchange',()=>{render();$('#main').focus({preventScroll:true});});
function syncDesignDocs(){const settings=getDesignSettings(),colors=document.querySelector('#main .color-docs');if(colors)colors.outerHTML=colorPage(settings);else{const text=document.querySelector('#main .text-color-section');if(text)text.outerHTML=textColorSection({settings});}}
window.addEventListener('dds-design-settings-change',syncDesignDocs);
render();
