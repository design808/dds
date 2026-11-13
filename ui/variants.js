/** Official, opt-in presentation axes. Content, items and business logic stay with the host. */
import {icon} from './icons.js?v=37572f4be3f4fe6a';

const choice=(label,values,defaultValue,labels)=>Object.freeze({label,type:'enum',values:Object.freeze(values),default:defaultValue,labels:Object.freeze(labels||Object.fromEntries(values.map(value=>[value,value])))});
const flag=(label,defaultValue=false)=>Object.freeze({label,type:'boolean',default:defaultValue});
const size=()=>choice('크기',['sm','md','lg'],'md',{sm:'Small',md:'Medium',lg:'Large'});
const state=(readOnly=true)=>choice('상태',['default','disabled',...(readOnly?['readOnly']:[]),'error','success'],'default',{default:'기본',disabled:'비활성',readOnly:'읽기 전용',error:'오류',success:'확인 완료'});
const tone=(primary=false)=>choice('의미',['neutral',...(primary?['primary']:[]),'info','success','warning','error'],'neutral',{neutral:'중립',primary:'브랜드',info:'안내',success:'성공',warning:'주의',error:'오류'});
const field=(readOnly=true)=>({size:size(),state:state(readOnly)});
const visibility=()=>({title:flag('제목',true),description:flag('설명',true),actions:flag('행동'),closeButton:flag('닫기 버튼')});
const schemas={
 'icon-button':{size:size(),appearance:choice('형태',['ghost','outlined'],'outlined',{ghost:'배경 없음',outlined:'경계선'}),disabled:flag('비활성')},
 chip:{size:choice('크기',['sm','md'],'md',{sm:'Small',md:'Medium'}),appearance:choice('형태',['outlined','soft'],'outlined',{outlined:'경계선',soft:'연한 배경'}),selected:flag('선택'),disabled:flag('비활성')},
 input:field(),textarea:field(),select:field(false),combobox:field(),'date-picker':field(),search:field(),editor:field(),
 checkbox:{size:size(),disabled:flag('비활성'),invalid:flag('오류')},radio:{size:size(),disabled:flag('비활성'),invalid:flag('오류')},switch:{size:size(),disabled:flag('비활성')},
 upload:{state:state(false)},
 tabs:{appearance:choice('형태',['segmented','underline'],'segmented',{segmented:'분할형',underline:'밑줄형'}),width:choice('너비',['content','stretch'],'content',{content:'내용에 맞춤',stretch:'영역 채우기'})},
 stepper:{orientation:choice('방향',['horizontal','vertical'],'horizontal',{horizontal:'가로',vertical:'세로'})},
 dialog:{content:choice('본문',['document','plain','form'],'document',{document:'문서 미리보기',plain:'일반 본문',form:'입력 폼'}),size:size(),closeButton:flag('닫기 버튼',true),actions:flag('하단 행동',true)},
 alert:{tone:tone(),icon:flag('상태 아이콘',true),...visibility()},
 toast:{tone:tone(),icon:flag('상태 아이콘'),actions:flag('행동'),closeButton:flag('닫기 버튼')},
 progress:{indeterminate:flag('진행률 미정')},
 skeleton:{shape:choice('구성',['card','text','avatar'],'card',{card:'카드',text:'본문',avatar:'아바타'})},
 empty:{reason:choice('상황',['empty','search','error'],'empty',{empty:'비어 있음',search:'검색 결과 없음',error:'문제 발생'}),actions:flag('행동',true)},
 badge:{tone:tone(true),appearance:choice('형태',['soft','outlined','solid'],'soft',{soft:'연한 배경',outlined:'경계선',solid:'채움'}),kind:choice('용도',['status','label','count'],'status',{status:'상태',label:'분류',count:'개수'})},
 avatar:{size:choice('크기',['xs','sm','md','lg','xl'],'md',{xs:'Extra small',sm:'Small',md:'Medium',lg:'Large',xl:'Extra large'}),shape:choice('모양',['circle','rounded'],'circle',{circle:'원형',rounded:'둥근 사각형'})},
 card:{appearance:choice('표면',['outlined','plain'],'outlined',{outlined:'카드',plain:'내용만'}),status:flag('상태',true),metadata:flag('보조정보',true),date:flag('날짜',true),tools:flag('보조 행동',true)},
 table:{density:choice('밀도',['comfortable','compact'],'comfortable',{comfortable:'기본',compact:'조밀하게'}),striped:flag('교차 행 배경'),stickyHeader:flag('고정 헤더')},
 accordion:{selection:choice('펼침',['multiple','single'],'multiple',{multiple:'여러 항목',single:'한 항목'})},
 'action-area':{align:choice('정렬',['start','end','between'],'end',{start:'왼쪽',end:'오른쪽',between:'양쪽'}),layout:choice('배치',['inline','stack'],'inline',{inline:'가로',stack:'세로'})},
 'text-button':{size:size(),tone:choice('의미',['primary','assistive','negative'],'assistive',{primary:'주요 행동',assistive:'보조 행동',negative:'주의 행동'}),disabled:flag('비활성')},
 'button-group':{orientation:choice('방향',['horizontal','vertical'],'horizontal',{horizontal:'가로',vertical:'세로'}),size:size()},
 toggle:{size:size(),selected:flag('선택'),disabled:flag('비활성')},
 'toggle-group':{size:size(),disabled:flag('비활성')},
 'filter-button':{size:size(),selected:flag('조건 적용'),disabled:flag('비활성')},
 field:field(), 'input-group':field(), 'input-otp':field(),label:field(),'time-picker':field(false),
 slider:{disabled:flag('비활성')},
 'segmented-control':{size:size(),disabled:flag('비활성')},'framed-style':{disabled:flag('비활성')},
 'alert-dialog':{size:size(),closeButton:flag('닫기 버튼',true)},
 sheet:{size:size(),edge:choice('위치',['right','left'],'right',{right:'오른쪽',left:'왼쪽'}),closeButton:flag('닫기 버튼',true)},
 drawer:{size:size(),edge:choice('위치',['bottom','top'],'bottom',{bottom:'아래',top:'위'}),closeButton:flag('닫기 버튼',true)},
 snackbar:{tone:tone(),actions:flag('되돌리기 행동',true),closeButton:flag('닫기 버튼',true)},
 spinner:{size:size(),label:flag('상태 문구',true)},
 'fallback-view':{reason:choice('원인',['network','error','permission'],'network',{network:'네트워크',error:'오류',permission:'접근 권한'}),actions:flag('복구 행동',true)},
 'aspect-ratio':{ratio:choice('비율',['16:9','4:3','1:1'],'16:9')},
 thumbnail:{ratio:choice('비율',['intrinsic','16:9','4:3','1:1'],'intrinsic',{intrinsic:'원본','16:9':'16:9','4:3':'4:3','1:1':'1:1'}),fit:choice('이미지 맞춤',['contain','cover'],'contain',{contain:'전체 표시',cover:'영역 채우기'})},
 'avatar-group':{size:choice('크기',['xs','sm','md','lg'],'md',{xs:'Extra small',sm:'Small',md:'Medium',lg:'Large'})},
 'list-card':{image:flag('미디어',true),metadata:flag('보조정보',true)},
 item:{appearance:choice('형태',['outlined','divided'],'outlined',{outlined:'외곽선',divided:'행 구분선'}),icon:flag('앞 아이콘',true),metadata:flag('보조정보',true),status:flag('상태',true),chevron:flag('이동 표시',true)},
 'section-header':{description:flag('설명',true),count:flag('개수',true),actions:flag('행동',true)},
 attachment:{disabled:flag('비활성')},
 separator:{orientation:choice('방향',['horizontal','vertical'],'horizontal',{horizontal:'가로',vertical:'세로'})},
 bubble:{direction:choice('방향',['incoming','outgoing'],'incoming',{incoming:'받은 메시지',outgoing:'보낸 메시지'})},
 message:{direction:choice('방향',['incoming','outgoing'],'incoming',{incoming:'받은 메시지',outgoing:'보낸 메시지'}),avatar:flag('아바타',true),author:flag('보낸 사람',true),time:flag('시간',true)}
};
export const componentVariants=Object.freeze(Object.fromEntries(Object.entries(schemas).map(([id,axes])=>[id,Object.freeze(axes)])));

/** Only explicit axes are returned. Native attributes and optional content are never reset implicitly. */
export function normalizeVariants(id,options={}){
 if(!options||typeof options!=='object'||Array.isArray(options))throw new TypeError('DDS variants must be an object.');
 const axes=componentVariants[id]||{},result={};
 for(const [name,value] of Object.entries(options)){
  const axis=axes[name];if(!axis)throw new TypeError(`Unknown DDS variant: ${id}.${name}`);
  if(axis.type==='boolean'?typeof value!=='boolean':!axis.values.includes(value))throw new TypeError(`Unsupported DDS variant value: ${id}.${name}`);
  result[name]=value;
 }
 return result;
}
const first=(root,selector)=>root.matches?.(selector)?root:root.querySelector(selector);
const all=(root,selector)=>[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)];
const hosts={alert:'.alert',toast:'.dds-toast',tabs:'.tab-demo',dialog:'.dds-dialog',card:'.dds-document-card',table:'.dds-table-scroll',avatar:'.demo-row','avatar-group':'.dds-avatar-group',chip:'.demo-row',badge:'.badge-demo',stepper:'.stepper',skeleton:'.skeleton-card',empty:'.empty-state','action-area':'.dds-action-area','button-group':'.dds-button-group','alert-dialog':'.dds-overlay',sheet:'.dds-overlay',drawer:'.dds-overlay',snackbar:'.dds-snackbar',thumbnail:'.dds-thumbnail','aspect-ratio':'.dds-ratio',spinner:'[role="status"]',separator:'hr',message:'.dds-message','fallback-view':'.dds-fallback','list-card':'.dds-list-card',item:'.dds-items','section-header':'.dds-section-header'};
const fieldSizedComponents=new Set(['input','textarea','select','combobox','date-picker','search','editor','field','input-group','input-otp','label','time-picker','segmented-control']);
const buttonSizedComponents=new Set(['icon-button','button-group','toggle','toggle-group','filter-button','text-button']);
function mark(host,key,value){host?.setAttribute('data-dds-'+key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase()),String(value));}
function show(root,selector,value){
 for(const item of all(root,selector)){
  // SVGElement.hidden is not a reflected HTML property. The shared [hidden]
  // attribute works for both namespaces, including leading/trailing list icons.
  // A presentation option must not restore omitted specimen-only service copy.
  const visible=value&&item.getAttribute('data-dds-optional')!=='omitted';
  item.toggleAttribute('hidden',!visible);
 }
}
function collapseEmptyGroups(root,selector){
 for(const group of all(root,selector))if(group.children.length)group.toggleAttribute('hidden',[...group.children].every(child=>child.hasAttribute('hidden')));
}
function replaceIcon(element,name){if(!element)return;const template=element.ownerDocument.createElement('template');template.innerHTML=icon(name);element.replaceChildren(template.content);}
const toneIcon={neutral:'Info',primary:'Info',info:'Info',success:'CircleCheck',warning:'TriangleAlert',error:'CircleX'};

/** Mutate only the provided canonical instance. This function has no listeners or global DOM dependency. */
export function applyComponentVariants(root,id,options={}){
 if(!root?.querySelectorAll)throw new TypeError('DDS variants require a component root.');
 const selected=normalizeVariants(id,options);
 if(!Object.keys(selected).length)return selected;
 const host=first(root,hosts[id]||'.field,.dds-component,.dds-demo')||root.firstElementChild||root;
 host.classList.add('dds-variant');
 for(const [key,value] of Object.entries(selected))mark(host,key,value);
 const controls=all(root,'input,select,textarea');
 if(selected.size&&fieldSizedComponents.has(id)){
  for(const field of all(root,'.field,.dds-input-group,.dds-time,.dds-segmented'))field.dataset.controlSize=selected.size;
  if(!all(root,'.field').length)host.dataset.controlSize=selected.size;
 }
 // An overlay's size controls its width; avatars/spinners own their own size.
 // Neither may overwrite independent controls supplied in a content slot.
 if(selected.size&&buttonSizedComponents.has(id))for(const control of all(root,'button'))control.dataset.controlSize=selected.size;
 if(selected.state){
  for(const control of controls){control.disabled=selected.state==='disabled';if('readOnly' in control)control.readOnly=selected.state==='readOnly';control.setAttribute('aria-invalid',String(selected.state==='error'));}
  for(const action of all(root,'[data-ext-password],[data-dds-password],[data-ext-validate],[data-dds-validate],.editor-demo [data-dialog],.editor-demo [data-dds-action="dialog"]'))action.disabled=selected.state==='disabled';
  for(const field of all(root,'.field,.dds-input-group,.search-field,.upload-zone,.editor-demo,.dds-component,.dds-demo')){field.dataset.ddsState=selected.state;field.classList.add('dds-variant-field');}
 }
 if(Object.hasOwn(selected,'disabled'))for(const control of all(root,'input,select,textarea,button'))control.disabled=selected.disabled;
 if(Object.hasOwn(selected,'invalid'))for(const control of controls)control.setAttribute('aria-invalid',String(selected.invalid));
 if(Object.hasOwn(selected,'selected'))for(const control of all(root,'button[aria-pressed],.chip,button[data-ext-filter],button[data-dds-action="ext-filter"]')){control.setAttribute('aria-pressed',String(selected.selected));control.classList.toggle('selected',selected.selected);}

 if(['alert','toast'].includes(id)){
  host.classList.add('dds-variant-feedback');host.setAttribute('data-dds-dismissible','');
  if(selected.tone){for(const oldTone of ['info','success','warning','error','neutral','danger'])host.classList.remove(oldTone);replaceIcon(first(host,'[data-dds-feedback-icon]'),toneIcon[selected.tone]);}
  if(Object.hasOwn(selected,'icon'))show(host,'[data-dds-feedback-icon]',selected.icon);
  if(Object.hasOwn(selected,'title'))show(host,'[data-dds-alert-title]',selected.title);
  if(Object.hasOwn(selected,'description'))show(host,'[data-dds-alert-description]',selected.description);
  if(Object.hasOwn(selected,'actions'))show(host,'[data-dds-feedback-actions]',selected.actions);
  if(Object.hasOwn(selected,'closeButton'))show(host,'[data-dds-dismiss]',selected.closeButton);
 }
 if(id==='badge'){
  const badges=all(host,'.badge');for(const badge of badges){badge.classList.add('dds-badge');for(const key of ['tone','appearance'])if(selected[key])mark(badge,key,selected[key]);}
  if(selected.kind){
   show(host,'.badge-count-example',selected.kind==='count');show(host,'.badge-demo > .demo-row,.demo-row',selected.kind!=='count');
   // Kind changes presentation without deleting service-owned status metadata.
   // Returning from a label to a status restores its original status icon.
   for(const badge of badges){mark(badge,'kind',selected.kind);show(badge,'.icon',selected.kind!=='label');}
  }
 }
 if(id==='chip')for(const chip of all(host,'.chip')){for(const key of ['appearance','size'])if(selected[key])mark(chip,key,selected[key]);}
 if(['avatar','avatar-group'].includes(id))for(const avatar of all(host,'.avatar')){for(const key of ['shape','size'])if(selected[key])mark(avatar,key,selected[key]);}
 if(id==='tabs'){const list=first(host,'[role="tablist"]');for(const key of ['appearance','width'])if(selected[key])mark(list,key,selected[key]);}
 if(['dialog','alert-dialog','sheet','drawer'].includes(id)){
  host.classList.add('dds-variant-overlay');
  if(selected.content)mark(first(host,'.sample-document,.dds-dialog-content'),'content',selected.content);
  if(Object.hasOwn(selected,'closeButton'))show(host,'.dialog-heading>button',selected.closeButton);
  if(Object.hasOwn(selected,'actions'))show(host,':scope > button,:scope > .dds-action-area',selected.actions);
 }
 if(id==='card'){
  for(const [key,selector] of Object.entries({status:'.dds-status',metadata:'.dds-meta-primary,.dds-meta-secondary',date:'.dds-meta-date',tools:'.dds-card-tools'}))if(Object.hasOwn(selected,key))show(host,selector,selected[key]);
  collapseEmptyGroups(host,'.dds-card-header');
 }
 if(id==='accordion'&&selected.selection){const name='dds-accordion-'+(host.dataset.ddsAccordionGroup||host.id||root.dataset.ddsInstance||'group');for(const details of all(host,'details'))selected.selection==='single'?details.setAttribute('name',name):details.removeAttribute('name');}
 if(id==='progress'&&Object.hasOwn(selected,'indeterminate')){
  const progress=first(root,'progress');
  if(progress){
   if(selected.indeterminate){
    // Reapplying the same state must not replace the saved value with the native
    // indeterminate value (0), and choosing false initially retains real data.
    if(progress.hasAttribute('value')){progress.dataset.ddsDeterminateValue=String(progress.value);progress.dataset.ddsDeterminateAria=progress.getAttribute('aria-valuenow')||'';}
    progress.removeAttribute('value');progress.removeAttribute('aria-valuenow');progress.textContent='진행 중';
   }else{
    if(progress.dataset.ddsDeterminateValue!==undefined){
     progress.value=Number(progress.dataset.ddsDeterminateValue);
     progress.dataset.ddsDeterminateAria?progress.setAttribute('aria-valuenow',progress.dataset.ddsDeterminateAria):progress.removeAttribute('aria-valuenow');
     delete progress.dataset.ddsDeterminateValue;delete progress.dataset.ddsDeterminateAria;
    }else if(!progress.hasAttribute('value'))progress.value=0;
    progress.textContent=Math.round(progress.value/progress.max*100)+'%';
   }
   show(root,'.row-between>span',!selected.indeterminate);
  }
 }
 if(id==='skeleton'&&selected.shape){show(host,'.skeleton.circle',selected.shape!=='text');show(host,'.skeleton:not(.circle)',selected.shape!=='avatar');}
 if(id==='empty'){
  if(selected.reason){const glyph=first(host,':scope>.icon');if(glyph){const template=host.ownerDocument.createElement('template');template.innerHTML=icon({empty:'FileText',search:'SearchX',error:'TriangleAlert'}[selected.reason]);glyph.replaceWith(template.content);}}
  if(Object.hasOwn(selected,'actions'))show(host,'a,button',selected.actions);
 }
 if(id==='snackbar'){if(Object.hasOwn(selected,'actions'))show(host,'[data-snack-undo],[data-dds-snack-undo]',selected.actions);if(Object.hasOwn(selected,'closeButton'))show(host,'[data-snack-close],[data-dds-snack-close]',selected.closeButton);}
 if(id==='spinner'&&Object.hasOwn(selected,'label'))show(host,'.demo-row>span:last-child',selected.label);
 if(id==='fallback-view'){
  if(selected.reason){const glyph=first(host,':scope>.icon');if(glyph){const template=host.ownerDocument.createElement('template');template.innerHTML=icon({network:'CloudOff',error:'TriangleAlert',permission:'LockKeyhole'}[selected.reason]);glyph.replaceWith(template.content);}}
  if(Object.hasOwn(selected,'actions'))show(host,'.dds-fallback-actions',selected.actions);
 }
 if(id==='list-card'){if(Object.hasOwn(selected,'image'))show(host,'.dds-mini-image',selected.image);if(Object.hasOwn(selected,'metadata'))show(host,'.dds-meta-secondary',selected.metadata);}
 if(id==='item'){
  for(const [key,selector]of Object.entries({icon:'.dds-list-leading',chevron:'.dds-list-chevron',metadata:'.dds-list-meta>:not(.dds-status)',status:'.dds-list-meta>.dds-status'}))if(Object.hasOwn(selected,key))show(root,selector,selected[key]);
  collapseEmptyGroups(root,'.dds-list-meta');
 }
 if(id==='section-header')for(const [key,selector]of Object.entries({description:'.dds-section-header-content>p',count:'.dds-collection-count',actions:'.dds-section-header-action'}))if(Object.hasOwn(selected,key))show(root,selector,selected[key]);
 if(id==='separator'&&selected.orientation)host.setAttribute('aria-orientation',selected.orientation);
 if(['bubble','message'].includes(id)&&selected.direction)for(const message of all(root,id==='message'?'.dds-message':'.dds-bubble'))message.classList.toggle('outgoing',selected.direction==='outgoing');
 if(id==='message'){
  for(const [key,selector]of Object.entries({avatar:':scope>.avatar',author:'.dds-message-meta>b',time:'.dds-message-meta>time'}))if(Object.hasOwn(selected,key))show(host,selector,selected[key]);
  collapseEmptyGroups(host,'.dds-message-meta');
 }
 return selected;
}

const unchanged={
 button:'공식 props에서 형태·색·크기·아이콘·비활성·로딩·전체 너비를 선택합니다.',
 breadcrumb:'계층 경로와 현재 위치는 링크 데이터로 구성합니다.',pagination:'페이지 수·현재 페이지·이동 가능 여부는 데이터로 구성합니다.',sidebar:'실제 탐색 항목과 현재 위치를 사용합니다.',dropdown:'실제 명령 항목과 비활성·주의 행동을 연결합니다.',tooltip:'기능 설명과 화면 경계에 따른 자동 위치를 사용합니다.',
 calendar:'선택 날짜·월·범위는 실제 값과 min/max 조건을 사용합니다.',questionnaire:'질문·단계·입력 조건은 데이터와 실제 응답을 사용합니다.','navigation-menu':'실제 링크와 하위 메뉴를 구성합니다.','top-navigation':'공통 반응형 헤더에 브랜드·탐색·도구 콘텐츠를 연결합니다.','bottom-navigation':'실제 목적지와 현재 위치를 사용합니다.',category:'항목과 선택값을 실제 분류 데이터로 구성합니다.','page-counter':'현재·전체 페이지와 이동 가능 여부를 사용합니다.','pagination-dots':'실제 슬라이드 수와 현재 위치를 사용합니다.',menubar:'실제 명령과 활성 상태를 연결합니다.',command:'명령 목록과 검색·실행 가능 여부를 사용합니다.','context-menu':'실제 대상의 명령과 활성 상태를 사용합니다.',popover:'실제 콘텐츠와 트리거를 연결합니다.','hover-card':'대상의 실제 요약 콘텐츠와 트리거를 연결합니다.','push-badge':'실제 읽지 않은 개수와 접근성 이름을 연결합니다.','play-badge':'실제 미디어·재생 시간·재생 가능 여부를 연결합니다.',carousel:'실제 슬라이드와 현재 위치를 연결합니다.',collapsible:'실제 본문과 open 속성으로 펼침을 제어합니다.',kbd:'실제 키 이름을 표시합니다.','scroll-area':'콘텐츠와 접근성 이름·영역 높이를 서비스에서 정합니다.',resizable:'실제 패널 내용·min/max·현재 비율을 사용합니다.',direction:'dir 속성으로 실제 문서의 LTR·RTL 방향을 설정합니다.',marker:'실제 단계·시점 문구를 표시합니다.','message-scroller':'실제 대화 목록과 최신 위치를 사용합니다.',video:'실제 미디어·권한·연결 상태를 사용합니다.'
};
const chartIds=['chart','area-chart','area-chart-linear','area-chart-step','area-chart-stacked','area-chart-normalized','area-chart-gradient','bar-chart','bar-chart-horizontal','bar-chart-multiple','bar-chart-stacked','bar-chart-labels','bar-chart-negative','line-chart','line-chart-smooth','line-chart-step','line-chart-dots','line-chart-multiple','pie-chart','pie-chart-labels','donut-chart-basic','donut-chart','radar-chart','radar-chart-multiple','radial-chart','radial-chart-multiple','chart-tooltip-dot','contributions','scatter-chart'];
export const componentVariantAudit=Object.freeze(Object.fromEntries([
 ...Object.keys(componentVariants).map(id=>[id,Object.freeze({status:'implemented',reason:'공식 variants 축을 선택하며 콘텐츠·값·실제 동작은 서비스에서 연결합니다.'})]),
 ...Object.entries(unchanged).map(([id,reason])=>[id,Object.freeze({status:id==='button'?'existing':'content-driven',reason})]),
 ...chartIds.map(id=>[id,Object.freeze({status:'existing',reason:'독립 차트 유형과 실제 data·단위·범례·표·선택 상태를 재사용합니다.'})])
]));
