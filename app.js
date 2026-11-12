import {handoffPage} from './developer-guide.js?v=a2951f06bdfb22b5';
import {getDesignSettings} from './design-settings.js?v=a2951f06bdfb22b5';
import {textColorSection} from './text-colors.js?v=a2951f06bdfb22b5';
import {setupPage,ddsRelease} from './adoption-content.js?v=a2951f06bdfb22b5';
import {refreshSetupPrompt,downloadSetupPrompt} from './setup-source-page.js?v=a2951f06bdfb22b5';
import {bindComponentVariants} from './component-variants.js?v=a2951f06bdfb22b5';
import {renderJobListExample,bindListBlocks} from './block-list.js?v=a2951f06bdfb22b5';
import {bindTypography} from './typography-system.js?v=a2951f06bdfb22b5';
import {bindServiceGuidelines} from './service-guidelines.js?v=a2951f06bdfb22b5';
import {sidebarContent,overviewContent,componentContent,componentDetailContent,renderPattern,searchableDocuments} from './document-shell.js?v=a2951f06bdfb22b5';
import {componentCardStructure,componentIndexStructure} from './document-layout-templates.js?v=a2951f06bdfb22b5';
import {controlSizingSpec,foundationsDocument} from './document-foundations.js?v=a2951f06bdfb22b5';
import {principlesContent,processContent} from './document-content.js?v=a2951f06bdfb22b5';
import {icon,iconGallery,bindIconGallery} from './icons.js?v=a2951f06bdfb22b5';
import {collectionCount,statusBadge} from './visibility.js?v=a2951f06bdfb22b5';
import {renderComponentSource} from './ui/source.js?v=a2951f06bdfb22b5';
import {renderDocumentCard} from './ui/core.js?v=a2951f06bdfb22b5';
import {mountDDS} from './ui/index.js?v=a2951f06bdfb22b5';
import './interactions.js?v=a2951f06bdfb22b5';
import {extensionDemo,bindExtensions} from './extension-demos.js?v=a2951f06bdfb22b5';
import {chartDemo,bindCharts} from './chart-system.js?v=a2951f06bdfb22b5';
import {buttonDemo,buttonCodeExample,bindButtonDemos} from './button-demos.js?v=a2951f06bdfb22b5';
import {blocksPage,bindBlocks} from './blocks.js?v=a2951f06bdfb22b5';
import {chartRouteAliases} from './chart-catalog.js?v=a2951f06bdfb22b5';
import {colorPage} from './color-system.js?v=a2951f06bdfb22b5';
import {components,groups,patterns,foundations} from './catalog.js?v=a2951f06bdfb22b5';
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
function card(c){return componentCardStructure(c,demo(c.id,true),icon('arrow'));}
function overview(){return overviewContent(card);}

function componentList(){return componentIndexStructure({components,groups,selectedGroup},card,icon);}
const fieldControlIds=['input','select','combobox','date-picker','search','input-group','time-picker','field','input-otp'];


function componentDetail(c){return componentDetailContent(c,{demo,buttonCodeExample,buttonDemo,renderJobListExample});}

function foundationsPage(id){return foundationsDocument(id,{head,sectionTitle,demo,getDesignSettings,badge,controlSizingSpec});}
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
 $('#main').removeAttribute('data-dds-loading');
 $('#main').removeAttribute('inert');
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
