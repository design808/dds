import {createComponent,mountDDS,icon,collectionCount,statusBadge} from '../ui/index.js?v=a0e474a8a17e958f';
import {jobs,categories,filterOptions,sortOptions,filterJobs,sortJobs,getJobById,getCompanyById} from './careers-data.js?v=a0e474a8a17e958f';

const $=selector=>document.querySelector(selector);
const main=$('[data-co-main]');
const storageKeys={saved:'careeron.saved.v1',drafts:'careeron.drafts.v1',theme:'careeron.theme.v1'};
const filters={query:'',category:'',location:'',experience:'',workMode:'',sort:'latest'};
let uid=0,cleanupMain=()=>{},cleanupDialog=()=>{},cleanupPage=()=>{},dialogReturn=null,toastTimer=null;
let resultsHost=null,resultTitle=null,resultCountHost=null,filterCountHost=null,searchInput=null;
let route={view:'jobs',job:null};
const lifetime=new AbortController();

function node(tag,className='',text){const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=String(text);return element;}
function component(id,options={}){return createComponent(id,{idPrefix:`careeron-${id}-${++uid}`,...options});}
function trustedNode(markup){const template=document.createElement('template');template.innerHTML=markup;return template.content.firstElementChild;}
function copy(text,className='dds-meta-secondary'){return node('p',className,text);}
function count(value,label='공고'){return trustedNode(collectionCount(value,{label,unit:'개'}));}
function button(label,options={},data={}){const result=component('button',{props:{label,size:'md',...options}});Object.assign(result.querySelector('button').dataset,data);return result;}
function surface(contents,id){return component('card',{idPrefix:id,slots:{content:contents}});}
function isRecord(value){return value!==null&&typeof value==='object'&&!Array.isArray(value);}
function readStorage(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}}
const savedRaw=readStorage(storageKeys.saved,[]);
let saved=new Set(Array.isArray(savedRaw)?savedRaw.filter(id=>typeof id==='string'&&getJobById(id)):[]);
function normalizeDrafts(raw){return Object.fromEntries(Object.entries(isRecord(raw)?raw:{}).filter(([id,value])=>getJobById(id)&&isRecord(value)).map(([id,value])=>[id,{
 jobId:id,name:String(value.name||'').slice(0,80),email:String(value.email||'').slice(0,160),motivation:String(value.motivation||'').slice(0,3000),updatedAt:typeof value.updatedAt==='string'?value.updatedAt:''
}]));}
let drafts=normalizeDrafts(readStorage(storageKeys.drafts,{}));
function persist(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{announce('브라우저 저장 공간을 사용할 수 없어요. 저장 설정을 확인해 주세요.');return false;}}

const toast=component('toast',{text:{label:'알림',content:''}});
toast.querySelector('button').remove();
$('[data-co-status]').append(toast);
function announce(message){const host=toast.querySelector('.dds-toast');clearTimeout(toastTimer);host.querySelector('[data-dds-toast-message]').textContent=message;host.hidden=false;host.classList.add('show');toastTimer=setTimeout(()=>{host.classList.remove('show');host.hidden=true;},3500);}
function formatDate(value){if(!value)return '상시 채용';return value.slice(0,10).replaceAll('-','.');}
function deadlineText(job){return job.deadline?`${formatDate(job.deadline)} 마감`:'상시 채용';}
function draftDate(value){if(!value)return '작성 중';const date=new Date(value);if(Number.isNaN(date.getTime()))return '작성 중';return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')} 저장`;}

function makeHeader(){
 const links=document.createDocumentFragment();
 for(const [href,label] of [['#/jobs','채용공고'],['#/saved','관심공고'],['#/drafts','지원서 보관함']]){const link=node('a','dds-nav-link dds-nav-control',label);link.href=href;links.append(link);}
 const header=component('top-navigation',{
  idPrefix:'careeron-header',text:{brand:'커리어온'},
  attributes:{brandLink:{href:'#/jobs','aria-label':'커리어온 채용공고',translate:'no'},header:{'aria-label':'커리어온 메뉴'}},
  slots:{links,tools:document.createDocumentFragment()}
 });
 header.querySelector('.dds-topnav-tools').hidden=true;
 $('[data-co-header]').append(header);
 return mountDDS(header,{charts:false});
}
const cleanupHeader=makeHeader();
function updateNavigation(){for(const link of document.querySelectorAll('.co-site-header .dds-topnav-links>a,.co-footer-links>a')){const current=link.getAttribute('href')===`#/${route.view==='detail'?'jobs':route.view}`;current?link.setAttribute('aria-current','page'):link.removeAttribute('aria-current');}}

let theme='light';try{theme=localStorage.getItem(storageKeys.theme)==='dark'?'dark':'light';}catch{}
const themeButton=button('다크 모드로 전환',{variant:'outlined',color:'assistive',size:'sm',iconOnly:true,before:'Moon'},{coTheme:''});
$('[data-co-theme]').append(themeButton);
function updateTheme(){document.documentElement.dataset.theme=theme;const control=themeButton.querySelector('button'),label=theme==='dark'?'라이트 모드로 전환':'다크 모드로 전환';control.setAttribute('aria-label',label);control.dataset.tooltip=label;control.querySelector('.dds-button-label').innerHTML=icon(theme==='dark'?'Sun':'Moon');$('meta[name=theme-color]').content=theme==='dark'?'#14161b':'#ffffff';}
updateTheme();
themeButton.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';updateTheme();try{localStorage.setItem(storageKeys.theme,theme);}catch{}});
const cleanupFooter=mountDDS($('[data-co-theme]'),{controls:false,charts:false});

function companyAvatar(job,size='sm'){const company=getCompanyById(job.companyId);const source=component('avatar',{text:{firstInitial:company?.initial||job.company.slice(0,1)},variants:{size,shape:'rounded'}});source.querySelector('.avatar').setAttribute('aria-hidden','true');return source;}
function bookmark(job){const active=saved.has(job.id),label=`${job.title} 관심공고 ${active?'해제':'저장'}`;const result=button(label,{variant:'outlined',color:'assistive',size:'sm',iconOnly:true,before:active?'BookmarkCheck':'Bookmark'},{coBookmark:job.id});const control=result.querySelector('button');control.classList.add('dds-card-tools');control.setAttribute('aria-pressed',String(active));return result;}
function companyIdentity(job,avatar=true){const result=node('div','co-job-company');if(avatar)result.append(companyAvatar(job,'md'));const text=node('div','co-job-company-copy');text.append(copy(job.company,'dds-meta-primary'),copy(getCompanyById(job.companyId)?.industry||job.category,'dds-meta-secondary'));result.append(text);return result;}
function jobCard(job){
 const row=node('div','co-job-row');
 const title=node('h3','dds-card-title co-job-title'),link=node('a','dds-card-link',job.title);link.href=`#/jobs/${encodeURIComponent(job.id)}`;title.append(link);
 const context=node('div','co-job-context');context.append(companyAvatar(job),copy(job.company,'dds-meta-primary'),copy(`${job.location} · ${job.experience}`));
 const deadline=node(job.deadline?'time':'span','dds-meta-secondary co-job-deadline',deadlineText(job));if(job.deadline)deadline.dateTime=job.deadline;
 const savedButton=bookmark(job);savedButton.querySelector('button').classList.add('co-job-bookmark');
 row.append(title,context,deadline,savedButton);
 return surface(row,`job-card-${job.id}-${++uid}`);
}
function jobGrid(values){const grid=node('div','co-job-list');for(const job of values)grid.append(jobCard(job));return grid;}
function empty(title,description,label='채용공고 보기',href='#/jobs',reset=false){const result=component('empty',{text:{title,description,action:label},attributes:{actionControl:{href}}});if(reset)result.querySelector('a').dataset.coReset='';return result;}
function collectionHeading(title,description,amount,label){const heading=node('div','co-collection-heading dds-ui'),row=node('div','co-results-title');const h1=node('h1','dds-type-title-1',title);h1.tabIndex=-1;row.append(h1,count(amount,label));heading.append(row,copy(description));return heading;}

function selectField(label,name,values,value,onChange){
 const options=document.createDocumentFragment();
 for(const item of values){const option=node('option','',typeof item==='string'?item:item.label);option.value=typeof item==='string'?item:item.value;options.append(option);}
 const result=component('select',{text:{label},slots:{options},attributes:{control:{name,value,'aria-label':label}},variants:{size:'sm'}});
 result.querySelector('select').addEventListener('change',event=>onChange(event.target.value));
 return result;
}
function categoryControls(){
 const items=['전체',...categories].map(category=>({label:category,value:category==='전체'?'':category,selected:(category==='전체'?'':category)===filters.category}));
 const result=component('chip',{items,variants:{size:'sm'}});result.querySelector('.demo-row').setAttribute('aria-label','직무 선택');
 [...result.querySelectorAll('button')].forEach((control,index)=>{control.dataset.coCategory=items[index].value;control.removeAttribute('data-dds-toggle');});return result;
}
function renderBrowse(){
 const intro=node('section','co-browse-intro dds-ui');intro.setAttribute('aria-labelledby','careeron-title');
 const heading=node('div','co-heading');heading.append(node('h1','dds-type-heading-1','채용공고'),copy('나에게 맞는 일을 찾아보세요.'));heading.querySelector('h1').id='careeron-title';
 const form=node('form','co-search-form');form.setAttribute('role','search');
 const search=component('search',{idPrefix:'careeron-search',text:{label:'채용공고 검색'},attributes:{control:{name:'query',value:filters.query,placeholder:'직무, 기업명 또는 키워드','aria-label':'채용공고 검색',autocomplete:'off'}}});
 search.querySelector('label').classList.add('sr-only');
 searchInput=search.querySelector('input');
 form.append(search,button('검색',{attributes:{type:'submit'}}));
 form.addEventListener('submit',event=>{event.preventDefault();filters.query=searchInput.value;updateResults();resultTitle.focus();resultTitle.scrollIntoView({block:'nearest',behavior:'smooth'});});
 intro.append(heading,form);
 const layout=node('div','co-explore-layout'),sidebar=node('aside','co-filter-sidebar');sidebar.setAttribute('aria-label','공고 검색 조건');
 const filterPanel=component('collapsible',{text:{firstDescription:'',secondDescription:''}}),details=filterPanel.querySelector('details'),summary=details.querySelector('summary');
 const summaryLabel=node('span','co-filter-summary-label','검색 조건');filterCountHost=node('span');summaryLabel.append(filterCountHost);summary.replaceChildren(summaryLabel,summary.querySelector('.icon'));
 details.querySelectorAll(':scope>p').forEach(paragraph=>paragraph.remove());
 const conditions=node('div','co-filter-content'),category=node('section','co-filter-section');category.setAttribute('aria-labelledby','category-title');const categoryTitle=node('h2','dds-type-label-1','직무');categoryTitle.id='category-title';category.append(categoryTitle,categoryControls());conditions.append(category);
 for(const [key,label] of [['location','지역'],['experience','경력'],['workMode','근무 방식']])conditions.append(selectField(label,key,[{value:'',label:`${label} 전체`},...(filterOptions[key]||[])],filters[key],value=>{filters[key]=value;updateResults();}));
 conditions.append(button('조건 초기화',{variant:'outlined',color:'assistive',size:'sm',before:'RotateCcw',fullWidth:true},{coReset:''}));details.append(conditions);sidebar.append(filterPanel);
 const narrow=window.matchMedia('(max-width:900px)');details.open=!narrow.matches;
 const syncFilterPanel=()=>{const active=document.activeElement,focused=details.contains(active)&&active!==summary||[...details.querySelectorAll('[aria-controls]')].some(control=>(control.getAttribute('aria-controls')||'').split(/\s+/).some(id=>document.getElementById(id)?.contains(active)));if(narrow.matches&&focused)summary.focus({preventScroll:true});details.open=!narrow.matches;};
 narrow.addEventListener('change',syncFilterPanel);cleanupPage=()=>narrow.removeEventListener('change',syncFilterPanel);
 const results=node('section','co-results dds-ui');results.setAttribute('aria-labelledby','results-title');const toolbar=node('div','co-results-header'),title=node('div','co-results-title');resultTitle=node('h2','dds-type-headline-1','전체 공고');resultTitle.id='results-title';resultTitle.tabIndex=-1;resultCountHost=node('span');resultCountHost.setAttribute('role','status');resultCountHost.setAttribute('aria-live','polite');title.append(resultTitle,resultCountHost);
 const sort=node('div','co-sort');sort.append(selectField('공고 정렬','sort',sortOptions,filters.sort,value=>{filters.sort=value;updateResults();}));sort.querySelector('label').hidden=true;
 resultsHost=node('div','co-stack');toolbar.append(title,sort);results.append(toolbar,resultsHost);layout.append(sidebar,results);main.append(intro,layout);updateResults();
}
function updateResults(){
 if(route.view!=='jobs'||!resultsHost)return;
 const values=sortJobs(filterJobs(jobs,filters),filters.sort);
 const activeConditions=['category','location','experience','workMode'].filter(key=>Boolean(filters[key])).length;
 resultTitle.textContent=filters.query?'검색 결과':filters.category?`${filters.category} 공고`:activeConditions?'조건에 맞는 공고':'전체 공고';resultCountHost.replaceChildren(count(values.length));
 filterCountHost.replaceChildren(count(activeConditions,'선택한 검색 조건'));filterCountHost.hidden=activeConditions===0;
 resultsHost.replaceChildren(values.length?jobGrid(values):empty('조건에 맞는 공고가 없어요','검색어를 바꾸거나 선택한 조건을 줄여보세요.','검색 조건 초기화','#/jobs',true));
}
function resetFilters(){Object.assign(filters,{query:'',category:'',location:'',experience:'',workMode:'',sort:'latest'});renderRoute(false);const input=main.querySelector('input[type=search]');input?.focus();}

function renderSaved(){
 const values=jobs.filter(job=>saved.has(job.id));
 main.append(collectionHeading('관심공고','마음에 드는 공고를 모아두고, 나에게 맞는 기회를 비교하세요.',values.length,'관심공고'));
 main.append(values.length?jobGrid(values):empty('아직 관심공고가 없어요','공고의 북마크 버튼을 눌러 관심 있는 채용을 모아보세요.'));
}
function renderDrafts(){
 const values=Object.values(drafts).filter(value=>getJobById(value.jobId)).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
 main.append(collectionHeading('지원서 보관함','작성하던 지원서를 이어가세요. 초안은 이 브라우저에 보관됩니다.',values.length,'지원서 초안'));
 if(!values.length){main.append(empty('작성 중인 지원서가 없어요','관심 있는 공고에서 지원서 초안을 작성해 보세요.'));return;}
 const grid=node('div','co-drafts-grid');
 for(const draft of values){
  const job=getJobById(draft.jobId),content=document.createDocumentFragment(),header=node('div','dds-card-header');
  const remove=button(`${job.title} 초안 삭제`,{variant:'outlined',color:'assistive',size:'sm',iconOnly:true,before:'Trash2'},{coDeleteDraft:job.id});remove.querySelector('button').classList.add('dds-card-tools');
  header.append(trustedNode(statusBadge('draft','작성 중',icon)),remove);
  const title=node('h2','dds-card-title'),link=node('a','dds-card-link',job.title);link.href=`#/jobs/${encodeURIComponent(job.id)}`;title.append(link);
  const bottom=node('div','co-draft-actions');bottom.append(node('time','dds-meta-date',draftDate(draft.updatedAt)),button('이어서 작성',{variant:'outlined',color:'primary',size:'sm'},{coApply:job.id}));bottom.querySelector('button').classList.add('dds-card-tools');
  content.append(header,title,copy(job.company,'dds-meta-primary'),copy(`${job.location} · ${job.experience}`),bottom);
  grid.append(surface(content,`draft-card-${job.id}`));
 }
 main.append(grid);
}

function detailSection(title,values){const section=node('section','co-detail-section dds-ui');section.append(node('h2','dds-type-headline-1',title));if(Array.isArray(values)){const list=node('ul','co-detail-list dds-type-body-1-reading');for(const value of values)list.append(node('li','',value));section.append(list);}else section.append(copy(values,'dds-type-body-1-reading'));return section;}
function renderDetail(job){
 const back=node('div','co-detail-back dds-ui'),backLink=node('a','dds-nav-link','채용공고로 돌아가기');backLink.href='#/jobs';back.append(backLink);main.append(back);
 if(!job){main.append(empty('공고를 찾을 수 없어요','주소를 확인하거나 채용공고 목록에서 다시 찾아주세요.'));return;}
 const layout=node('div','co-detail-layout'),body=node('article','co-detail-main'),heading=node('div','co-detail-heading dds-ui');
 heading.append(companyIdentity(job),node('h1','dds-type-title-1',job.title));
 const meta=node('div','co-detail-heading-bottom');meta.append(node('span','dds-meta-primary',`${job.location} · ${job.experience} · ${job.employmentType}`),node('span','badge dds-badge',job.workMode));heading.append(meta,copy(job.summary,'dds-type-body-1-reading'));
 body.append(heading,detailSection('이런 일을 함께해요',job.responsibilities),detailSection('이런 분을 찾고 있어요',job.requirements));
 if(job.preferred?.length)body.append(detailSection('이런 경험이 있으면 더 좋아요',job.preferred));
 if(job.benefits?.length)body.append(detailSection('함께 일하는 환경',job.benefits));
 if(job.process?.length)body.append(detailSection('채용 절차',job.process));
 body.append(detailSection(job.company,job.companyDescription));
 const sidebar=node('aside','co-detail-sidebar'),contents=node('div','co-stack');
 contents.append(node('h2','dds-type-headline-1','공고 정보'));
 const facts=node('dl','co-facts');for(const [label,value] of [['직무',job.category],['근무지',job.location],['경력',job.experience],['고용 형태',job.employmentType],['근무 방식',job.workMode],['마감일',job.deadline?formatDate(job.deadline):'상시 채용']]){const item=node('div');item.append(node('dt','dds-meta-secondary',label),node('dd','dds-meta-primary',value));facts.append(item);}contents.append(facts);
 const actions=node('div','co-sidebar-actions');actions.append(button(drafts[job.id]?'지원서 이어서 작성':'지원서 작성',{fullWidth:true,before:'PenLine'},{coApply:job.id}),button(saved.has(job.id)?'관심공고에서 해제':'관심공고 저장',{variant:'outlined',color:'assistive',fullWidth:true,before:saved.has(job.id)?'BookmarkCheck':'Bookmark'},{coBookmark:job.id}));
 contents.append(actions,copy('지원서 초안은 이 브라우저에 저장됩니다.','dds-meta-secondary'));sidebar.append(surface(contents,`job-facts-${job.id}`));
 layout.append(body,sidebar);main.append(layout);
}

function parseRoute(){const path=location.hash.replace(/^#\/?/,'').split('?')[0].split('/').filter(Boolean);if(path[0]==='jobs'&&path[1])return {view:'detail',job:getJobById(decodeURIComponentSafe(path[1]))};if(['saved','drafts'].includes(path[0]))return {view:path[0],job:null};return {view:'jobs',job:null};}
function decodeURIComponentSafe(value){try{return decodeURIComponent(value);}catch{return '';}}
function renderRoute(focus=false){
 cleanupMain();cleanupPage();cleanupPage=()=>{};route=parseRoute();resultsHost=null;resultTitle=null;resultCountHost=null;filterCountHost=null;searchInput=null;main.replaceChildren();
 if(route.view==='detail')renderDetail(route.job);else if(route.view==='saved')renderSaved();else if(route.view==='drafts')renderDrafts();else renderBrowse();
 document.title=`${route.view==='detail'?(route.job?.title||'공고 찾기'):route.view==='saved'?'관심공고':route.view==='drafts'?'지원서 보관함':'채용공고'} · 커리어온`;
 updateNavigation();cleanupMain=mountDDS(main,{charts:false});
 if(focus){const target=main.querySelector('h1')||main;target.tabIndex=-1;target.focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});}
}

function refreshBookmarks(id){
 const active=saved.has(id),job=getJobById(id);if(!job)return;
 for(const control of document.querySelectorAll(`[data-co-bookmark="${CSS.escape(id)}"]`)){
  const iconOnly=control.dataset.iconOnly==='true';
  const label=iconOnly?`${job.title} 관심공고 ${active?'해제':'저장'}`:active?'관심공고에서 해제':'관심공고 저장';
  control.setAttribute('aria-pressed',String(active));
  if(iconOnly){control.setAttribute('aria-label',label);control.dataset.tooltip=label;control.querySelector('.dds-button-label').innerHTML=icon(active?'BookmarkCheck':'Bookmark');}
  else{const content=control.querySelector('.dds-button-label');content.replaceChildren(trustedNode(icon(active?'BookmarkCheck':'Bookmark')),document.createTextNode(label));}
 }
}
function toggleBookmark(id,trigger){
 const next=new Set(saved);next.has(id)?next.delete(id):next.add(id);
 if(!persist(storageKeys.saved,[...next]))return;
 saved=next;announce(saved.has(id)?'관심공고에 저장했어요.':'관심공고에서 해제했어요.');
 if(route.view==='saved'){const cards=[...main.querySelectorAll('.co-job-list> .dds-ui')],index=cards.findIndex(card=>card.contains(trigger));renderRoute(false);const following=main.querySelectorAll('.dds-card-link');(following[Math.min(Math.max(index,0),following.length-1)]||main.querySelector('h1'))?.focus();}else refreshBookmarks(id);
}

function applicationField(label,name,value,placeholder,required=false){
 const field=component('input',{text:{label},attributes:{control:{name,value,placeholder,required,type:name==='email'?'email':'text',maxlength:name==='email'?160:80,'aria-label':label,autocomplete:name==='name'?'name':'email'}}});
 return field;
}
function refreshApplicationLabel(jobId){
 if(route.view!=='detail')return;
 const label=main.querySelector(`[data-co-apply="${CSS.escape(jobId)}"] .dds-button-label>span`);
 if(label)label.textContent=drafts[jobId]?'지원서 이어서 작성':'지원서 작성';
}
function openApplication(jobId,trigger){
 const job=getJobById(jobId);if(!job)return;
 cleanupDialog();$('[data-co-dialog]').replaceChildren();dialogReturn=trigger;
 const draft=drafts[job.id]||{name:'',email:'',motivation:''};
 const form=node('form','co-form-content');form.id=`application-form-${job.id}`;
 const pair=node('div','co-form-pair');pair.append(applicationField('이름','name',draft.name,'이름을 입력하세요'),applicationField('이메일','email',draft.email,'name@example.com'));
 const motivation=component('textarea',{idPrefix:'careeron-motivation',text:{label:'지원 동기',body:draft.motivation,limit:'공백 포함 · 최대 3,000자',counter:`${draft.motivation.length} / 3000`},attributes:{control:{name:'motivation',value:draft.motivation,placeholder:'이 일에 관심을 갖게 된 이유와 나의 경험을 적어보세요.',maxlength:3000,'aria-label':'지원 동기'}}});
 const note=copy('초안은 이 브라우저에만 저장됩니다. 입력한 내용이 기업으로 전송되지 않습니다.');
 const saveStatus=copy(draft.updatedAt?`마지막 저장: ${draftDate(draft.updatedAt)}`:'이름, 이메일, 지원 동기를 작성하고 나중에 이어갈 수 있어요.');saveStatus.setAttribute('role','status');
 form.append(pair,motivation,note,saveStatus);
 const source=component('dialog',{idPrefix:'careeron-application',variants:{content:'form'},text:{title:'지원서 작성',body:`${job.company} · ${job.title}`,confirm:'임시저장'},slots:{content:form},attributes:{control:{hidden:true},close:{'aria-label':'지원서 작성 닫기'}}});
 const dialog=source.querySelector('dialog'),defaultConfirm=dialog.querySelector(':scope>button');
 defaultConfirm.replaceWith(button('임시저장',{fullWidth:true,attributes:{type:'submit',form:form.id}}));
 const originalClose=dialog.querySelector('[data-dds-close]');originalClose.dataset.tooltip='지원서 작성 닫기';
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const values=new FormData(form);const nextDraft={jobId:job.id,name:String(values.get('name')||'').trim(),email:String(values.get('email')||'').trim(),motivation:String(values.get('motivation')||''),updatedAt:new Date().toISOString()};
  if(!nextDraft.name&&!nextDraft.email&&!nextDraft.motivation.trim()){saveStatus.textContent='이름, 이메일 또는 지원 동기를 입력해 주세요.';form.querySelector('input').focus();return;}
  const next={...drafts,[job.id]:nextDraft};if(!persist(storageKeys.drafts,next)){saveStatus.textContent='초안을 저장하지 못했어요. 브라우저 저장 설정을 확인해 주세요.';return;}
  drafts=next;refreshApplicationLabel(job.id);dialog.close();announce('지원서 초안을 저장했어요. 지원서 보관함에서 이어갈 수 있어요.');
  if(route.view==='drafts')renderRoute(false);
 });
 dialog.addEventListener('close',()=>{const returnTo=dialogReturn?.isConnected?dialogReturn:main.querySelector(`[data-co-apply="${CSS.escape(job.id)}"]`)||main.querySelector('h1');returnTo?.focus({preventScroll:true});});
 $('[data-co-dialog]').append(source);cleanupDialog=mountDDS(source,{charts:false});dialog.showModal();
}

main.addEventListener('click',event=>{
 const bookmarkControl=event.target.closest('[data-co-bookmark]');if(bookmarkControl){event.preventDefault();toggleBookmark(bookmarkControl.dataset.coBookmark,bookmarkControl);return;}
 const apply=event.target.closest('[data-co-apply]');if(apply){openApplication(apply.dataset.coApply,apply);return;}
 const reset=event.target.closest('[data-co-reset]');if(reset){event.preventDefault();resetFilters();return;}
 const category=event.target.closest('[data-co-category]');if(category){filters.category=category.dataset.coCategory;for(const control of main.querySelectorAll('[data-co-category]')){const active=control===category;control.classList.toggle('selected',active);control.setAttribute('aria-pressed',String(active));}updateResults();return;}
 const remove=event.target.closest('[data-co-delete-draft]');if(remove){const id=remove.dataset.coDeleteDraft,next={...drafts};delete next[id];if(!persist(storageKeys.drafts,next))return;drafts=next;renderRoute(false);main.querySelector('h1')?.focus();announce('지원서 초안을 삭제했어요.');}
},{signal:lifetime.signal});
window.addEventListener('hashchange',()=>{const opened=$('[data-co-dialog] dialog[open]');opened?.close();renderRoute(true);},{signal:lifetime.signal});
window.addEventListener('storage',event=>{
 if(event.key===storageKeys.saved){try{const value=JSON.parse(event.newValue||'[]');saved=new Set(Array.isArray(value)?value.filter(id=>getJobById(id)):[]);}catch{return;}if(route.view==='saved')renderRoute(false);else for(const job of jobs)refreshBookmarks(job.id);}
 if(event.key===storageKeys.drafts){drafts=normalizeDrafts(readStorage(storageKeys.drafts,{}));if(route.view==='drafts')renderRoute(false);else if(route.job)refreshApplicationLabel(route.job.id);}
},{signal:lifetime.signal});
window.addEventListener('pagehide',event=>{if(event.persisted)return;lifetime.abort();cleanupHeader();cleanupFooter();cleanupMain();cleanupDialog();cleanupPage();clearTimeout(toastTimer);},{signal:lifetime.signal});
renderRoute();
