import {createComponent,mountDDS,icon,statusBadge} from '../ui/index.js?v=51550a0206825bac';

const tasks=[
 {id:'onboarding',title:'온보딩 가이드 문서 정리',owner:'박서연',due:'오늘',state:'pending',status:'검토 중',body:'새로 합류하는 팀원이 첫 주에 확인할 내용을 정리합니다. 계정 준비, 팀 소개, 첫 프로젝트 안내를 함께 확인해 주세요.'},
 {id:'landing',title:'랜딩 페이지 사용성 점검',owner:'김민준',due:'내일',state:'draft',status:'진행 예정',body:'새로운 방문자가 기능과 요금을 이해하고 필요한 화면으로 이동할 수 있는지 확인합니다. 발견한 문제는 화면과 함께 기록해 주세요.'},
 {id:'interview',title:'고객 인터뷰 질문 합의',owner:'이하은',due:'11월 7일',state:'complete',status:'완료',body:'사용자의 업무 흐름을 이해하기 위한 질문을 정리했습니다. 인터뷰에서는 최근의 실제 경험을 중심으로 이야기를 나눕니다.'},
 {id:'sprint',title:'다음 스프린트 우선순위',owner:'박서연',due:'11월 8일',state:'draft',status:'진행 예정',body:'이번 주에 확인한 고객 요청과 진행 중인 업무를 함께 검토합니다. 목표와 담당자를 정한 뒤 다음 스프린트에 포함할 일을 선택합니다.'}
];
const documents=[
 {id:'brand',title:'브랜드 사용 가이드',owner:'디자인팀 · 이하은',meta:'로고와 문구 사용 기준',date:'2026.11.04 수정',body:'서비스 이름, 로고, 주요 문구를 사용할 때 확인하는 팀의 공통 기준입니다. 최신 파일의 위치와 적용 예시를 함께 정리합니다.'},
 {id:'meeting',title:'이번 주 팀 회의록',owner:'프로덕트팀 · 박서연',meta:'결정한 내용과 다음 업무',date:'2026.11.03 수정',body:'팀이 함께 결정한 내용과 다음에 할 일을 기록합니다. 업무마다 담당자와 확인할 날짜를 남겨 후속 논의에 연결합니다.'}
];

const node=(tag,className='',text)=>{
 const result=document.createElement(tag);
 if(className)result.className=className;
 if(text!==undefined)result.textContent=text;
 return result;
};
const fragment=(...nodes)=>{const result=document.createDocumentFragment();result.append(...nodes);return result;};
const status=(state,label)=>{const template=document.createElement('template');template.innerHTML=statusBadge(state,label,icon);return template.content.firstElementChild;};
const component=(id,options={})=>createComponent(id,options);
const action=(label,target,assistive=false)=>component('button',{props:{label,variant:assistive?'outlined':'solid',color:assistive?'assistive':'primary',attributes:{'data-tw-scroll':target}}});
const surface=(contents,id)=>component('card',{idPrefix:id,slots:{content:contents}});
const secondary=text=>node('p','dds-meta-secondary',text);

function navigationLink(label,href){
 const link=node('a','dds-nav-link dds-nav-control',label);
 link.href=href;
 return link;
}
function header(){
 const navigation=fragment(navigationLink('기능','#features'),navigationLink('작업 공간','#workspace'),navigationLink('자주 묻는 질문','#faq'));
 return component('top-navigation',{
  idPrefix:'moa-navigation',text:{brand:'모아'},attributes:{brandLink:{href:'#top','aria-label':'모아 홈'}},
  slots:{links:navigation,tools:action('요금 알아보기','#pricing',true)}
 });
}
function sectionHeader(title,count,description,actionLabel='전체 보기',href='#workspace'){
 return component('section-header',{text:{title,count:`${count}개`,description,actionLabel},attributes:{countAttributes:{'aria-label':`${title} ${count}개`},action:{href}}});
}
function taskList(values,scope){
 const rows=document.createDocumentFragment();
 for(const task of values){
  const source=component('item',{
   idPrefix:`${scope}-${task.id}`,text:{firstTitle:task.title,firstMetadata:`${task.owner} · ${task.due}`,firstStatus:task.status},
   attributes:{firstLink:{href:'#workspace','aria-label':`${task.title} 자세히 보기`}}
  });
  const row=source.querySelector('.dds-items > li:first-child');
  row.querySelector('.dds-status').replaceWith(status(task.state,task.status));
  if(scope!=='hero')row.querySelector('a').dataset.twTask=task.id;
  rows.append(row);
 }
 return component('item',{idPrefix:`${scope}-list`,slots:{items:rows}});
}
function documentCard(documentData,prefix){
 const result=component('card',{
  idPrefix:`${prefix}-${documentData.id}`,
  text:{title:documentData.title,primary:documentData.owner,secondary:documentData.meta,date:documentData.date},
  attributes:{link:{href:'#workspace','aria-label':`${documentData.title} 읽기`},dateControl:{datetime:documentData.id==='brand'?'2026-11-04':'2026-11-03'},action:{'aria-label':`${documentData.title} 미리보기`}}
 });
 result.querySelector('.dds-status').replaceWith(status('complete','공유됨'));
 result.querySelector('.dds-card-link').dataset.twDocument=documentData.id;
 result.querySelector('.dds-card-tools').dataset.twDocument=documentData.id;
 return result;
}
function documentList(values,prefix,stack=false){
 const list=node('div','tw-document-list'+(stack?' tw-document-list--stack':''));
 for(const documentData of values)list.append(documentCard(documentData,prefix));
 return list;
}

document.querySelector('[data-tw-header]').append(header());
document.querySelector('[data-tw-hero-actions]').append(action('작업 공간 살펴보기','#workspace'),action('요금 알아보기','#pricing',true));
const heroContents=node('div','tw-stack');
heroContents.append(sectionHeader('이번 주 팀 업무',tasks.length,'함께 확인하고, 다음 일을 이어가세요.'),taskList(tasks.slice(0,3),'hero'),secondary(`진행 예정 ${tasks.filter(task=>task.state==='draft').length}개 · 검토 중 ${tasks.filter(task=>task.state==='pending').length}개 · 완료 ${tasks.filter(task=>task.state==='complete').length}개`));
document.querySelector('[data-tw-hero-preview]').append(surface(heroContents,'hero-workspace'));

for(const feature of [
 ['누가 맡았는지 명확하게','업무마다 담당자와 확인할 날짜를 정하세요. 대화 속에서 다시 묻지 않아도 다음 행동을 알 수 있습니다.'],
 ['필요한 문서를 가까이에','업무에 필요한 기준과 기록을 같은 공간에 모으세요. 제목으로 찾고, 팀이 공유한 최신 내용을 확인하세요.'],
 ['팀의 흐름을 함께 보기','진행 예정, 검토 중, 완료 상태를 구분하세요. 새로 확인할 일과 마무리한 일을 한눈에 볼 수 있습니다.']
]){
 const contents=node('div','tw-feature-copy');contents.append(node('h3','dds-card-title',feature[0]),secondary(feature[1]));
 document.querySelector('[data-tw-features]').append(surface(contents));
}

const workspaceLayout=node('div','tw-workspace-layout');
const workspaceMain=node('div','tw-workspace-main');
const search=component('search',{
 idPrefix:'moa-work-search',text:{label:'업무와 문서 검색',hint:'제목이나 담당자로 검색하세요.'},
 attributes:{control:{placeholder:'제목 또는 담당자',name:'workspace-query','aria-label':'업무와 문서 검색'}}
});
const tabs=component('tabs',{
 idPrefix:'moa-work-tabs',text:{firstLabel:'전체',secondLabel:'내 업무',thirdLabel:'문서'},
 attributes:{group:{'aria-label':'작업 공간 보기'}},slots:{panelContent:node('div','tw-task-area')}
});
workspaceMain.append(search,tabs);
const workspaceSide=node('div','tw-workspace-side');
workspaceSide.append(sectionHeader('팀 문서',documents.length,'기준과 기록을 가까이에 두세요.','문서 보기','#workspace'),documentList(documents,'side-documents'));
const completeCount=tasks.filter(task=>task.state==='complete').length;
workspaceSide.append(component('progress',{
 idPrefix:'moa-completion',text:{label:'이번 주 업무 완료',value:`${completeCount} / ${tasks.length}`,hint:`전체 ${tasks.length}개 업무 중 ${completeCount}개를 마쳤어요.`},
 attributes:{control:{max:tasks.length,value:completeCount,'aria-label':'이번 주 업무 완료','aria-valuetext':`${tasks.length}개 중 ${completeCount}개 완료`}}
}));
workspaceLayout.append(workspaceMain,workspaceSide);
document.querySelector('[data-tw-workspace]').append(surface(workspaceLayout,'main-workspace'));

const input=search.querySelector('input');
const tabButtons=[...tabs.querySelectorAll('[role="tab"]')];
const panel=tabs.querySelector('[role="tabpanel"]');
let selectedTab=0;
function renderWorkspace(){
 const query=input.value.trim().toLocaleLowerCase('ko');
 const includes=value=>!query||value.toLocaleLowerCase('ko').includes(query);
 const filteredTasks=tasks.filter(task=>(selectedTab!==1||task.owner==='박서연')&&includes(`${task.title} ${task.owner}`));
 const filteredDocuments=documents.filter(documentData=>includes(`${documentData.title} ${documentData.owner}`));
 const matches=selectedTab===2?filteredDocuments:filteredTasks;
 const contents=node('div','tw-task-area');
 if(matches.length){
  contents.append(secondary(selectedTab===2?`문서 ${matches.length}개`:`${selectedTab===1?'박서연님의 ':''}업무 ${matches.length}개`));
  contents.append(selectedTab===2?documentList(filteredDocuments,'filtered-documents',true):taskList(filteredTasks,'workspace'));
 }else{
  const empty=component('empty',{text:{title:'검색 결과가 없어요',description:'다른 제목이나 담당자로 검색해 보세요.',action:'검색 초기화'},attributes:{actionControl:{href:'#workspace'}}});
  empty.querySelector('a').dataset.twResetSearch='';contents.append(empty);
 }
 panel.replaceChildren(contents);
 const result=search.querySelector('[data-search-count]');
 result.textContent=query?`“${input.value.trim()}” 검색 결과 ${matches.length}개`:'제목이나 담당자로 검색하세요.';
 result.setAttribute('role','status');result.setAttribute('aria-live','polite');
}
input.addEventListener('input',renderWorkspace);
tabs.addEventListener('click',event=>{const tab=event.target.closest('[role="tab"]');if(!tab)return;selectedTab=tabButtons.indexOf(tab);renderWorkspace();});
tabs.addEventListener('keydown',event=>{
 const tab=event.target.closest('[role="tab"]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 const current=tabButtons.indexOf(tab);selectedTab=event.key==='Home'?0:event.key==='End'?tabButtons.length-1:(current+(event.key==='ArrowRight'?1:-1)+tabButtons.length)%tabButtons.length;
 queueMicrotask(renderWorkspace);
});
workspaceSide.querySelector('.dds-section-header-action').addEventListener('click',event=>{event.preventDefault();selectedTab=2;tabButtons[2].click();document.querySelector('#workspace').scrollIntoView({behavior:'smooth'});});
renderWorkspace();

for(const plan of [
 {name:'개인',price:'무료',unit:'개인의 업무를 정리할 때',features:['내 업무와 문서 정리','업무 상태와 일정 관리','이름과 제목으로 검색'],label:'작업 방식 살펴보기',assistive:true},
 {name:'팀',price:'9,900원',unit:'1인 / 월',features:['개인 플랜의 모든 기능','팀 문서와 업무 공유','담당자별 업무 확인'],label:'팀 작업 공간 살펴보기'}
]){
 const contents=node('div','tw-plan-copy');
 const amount=node('div','tw-plan-price');amount.append(node('strong','dds-type-title-1',plan.price),node('span','dds-type-body-2-normal tw-secondary',plan.unit));
 const features=node('ul','tw-plan-features');
 for(const feature of plan.features){const item=node('li','dds-meta-primary');const mark=node('span');mark.innerHTML=icon('Check');item.append(mark,document.createTextNode(feature));features.append(item);}
 contents.append(node('h3','dds-card-title',plan.name),amount,features,action(plan.label,'#workspace',plan.assistive));
 document.querySelector('[data-tw-plans]').append(surface(contents));
}
document.querySelector('[data-tw-faq]').append(component('accordion',{
 text:{firstTitle:'팀에서는 어떤 내용을 함께 관리할 수 있나요?',firstBody:'업무의 담당자, 확인할 날짜, 진행 상태와 팀 문서를 함께 볼 수 있습니다. 업무 목록에서 항목을 선택하면 상세 내용을 확인할 수 있어요.',secondTitle:'개인의 업무와 팀 문서를 나눠 볼 수 있나요?',secondBody:'작업 공간의 ‘내 업무’에서는 내가 맡은 업무를, ‘문서’에서는 팀이 공유한 문서를 모아 볼 수 있습니다. 검색 조건은 탭을 바꿔도 유지됩니다.'}
}));

const detail=component('dialog',{
 idPrefix:'moa-detail',text:{trigger:'상세 보기',title:'업무 상세',body:'담당자와 진행 상황을 함께 확인하세요.',confirm:'닫기'},
 attributes:{control:{hidden:true},close:{'aria-label':'상세 닫기'}},slots:{content:node('div','tw-detail-copy')}
});
document.querySelector('[data-tw-detail]').append(detail);
const dialog=detail.querySelector('dialog');
let detailOrigin;
function openDetail(value,kind,origin){
 detailOrigin=origin;
 detail.querySelector('.dialog-heading h2').textContent=value.title;
 detail.querySelector('.dds-dialog > p').textContent=kind==='task'?'업무의 담당자와 진행 상황을 확인하세요.':'팀이 공유한 문서를 확인하세요.';
 const content=node('div','tw-detail-copy');
 content.append(kind==='task'?status(value.state,value.status):status('complete','공유됨'),node('p','dds-meta-primary',kind==='task'?`${value.owner} · ${value.due}`:value.owner),node('p','dds-type-body-1-reading',value.body));
 detail.querySelector('.sample-document').replaceChildren(content);
 dialog.showModal();
}
dialog.addEventListener('close',()=>detailOrigin?.focus({preventScroll:true}));

function currentTheme(){try{return localStorage.getItem('moa-theme')==='dark'?'dark':'light';}catch{return 'light';}}
let theme=currentTheme();
document.documentElement.dataset.theme=theme;
const themeButton=component('button',{props:{iconOnly:true,variant:'outlined',color:'assistive',before:theme==='dark'?'Sun':'Moon',label:theme==='dark'?'라이트 모드로 전환':'다크 모드로 전환',attributes:{'data-tw-theme-toggle':''}}});
document.querySelector('[data-tw-theme]').append(themeButton);

document.addEventListener('click',event=>{
 const scroll=event.target.closest('[data-tw-scroll]');
 if(scroll){
  const menu=scroll.closest('[data-dds-topnav]')?.querySelector('[data-dds-topnav-toggle][aria-expanded="true"]');
  if(menu){menu.click();menu.focus({preventScroll:true});}
  document.querySelector(scroll.dataset.twScroll)?.scrollIntoView({behavior:'smooth',block:'start'});return;
 }
 const reset=event.target.closest('[data-tw-reset-search]');
 if(reset){event.preventDefault();input.value='';renderWorkspace();input.focus();return;}
 const task=event.target.closest('[data-tw-task]');
 if(task){event.preventDefault();openDetail(tasks.find(value=>value.id===task.dataset.twTask),'task',task);return;}
 const documentLink=event.target.closest('[data-tw-document]');
 if(documentLink){event.preventDefault();openDetail(documents.find(value=>value.id===documentLink.dataset.twDocument),'document',documentLink);return;}
 const toggle=event.target.closest('[data-tw-theme-toggle]');
 if(toggle){
  theme=theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;
  const label=theme==='dark'?'라이트 모드로 전환':'다크 모드로 전환';
  toggle.setAttribute('aria-label',label);toggle.dataset.tooltip=label;
  toggle.querySelector('.dds-button-label').innerHTML=icon(theme==='dark'?'Sun':'Moon');
  try{localStorage.setItem('moa-theme',theme);}catch{}
 }
});

const cleanup=mountDDS(document.body,{controls:true});
window.addEventListener('pagehide',event=>{if(!event.persisted)cleanup();});
