/** Canonical core markup. No DOM access, listeners, storage, or document UI. */
import {icon} from './icons.js?v=124c9ad30d73cda6';
import {renderButton} from './button.js?v=124c9ad30d73cda6';
import {collectionCount,statusBadge} from '../visibility.js?v=124c9ad30d73cda6';

const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeId=(value,id)=>String(value||'dds-'+id).replace(/[^a-zA-Z0-9_-]/g,'-');
function safeHref(value){
 const href=String(value??'').trim(),protocol=href.replace(/[\u0000-\u0020\u007f]/g,'');
 if(/^[a-z][a-z0-9+.-]*:/i.test(protocol)&&!/^(https?|mailto|tel):/i.test(protocol))throw new TypeError('Unsupported DDS link protocol.');
 return escapeHTML(href);
}
// Labels containing SVG and action attributes below are authored constants,
// never interpolated service content. Named service parts are handled separately.
const btn=(label,classes='',attributes='')=>`<button type="button" class="btn ${escapeHTML(classes)}" ${attributes}>${label}</button>`;
const badge=(label,tone='')=>({success:'complete',info:'pending',danger:'error'}[tone]?statusBadge({success:'complete',info:'pending',danger:'error'}[tone],label,icon):`<span class="badge dds-badge ${escapeHTML(tone)}">${escapeHTML(label)}</span>`);

/** A document card. Navigation and secondary actions remain separate elements. */
export function renderDocumentCard(title='프로덕트 디자이너 자기소개서',status='임시저장',{
 href='/prototypes/coverletter-write.html',primary='딥레쥬메 · 프로덕트 디자이너',
 secondary='IT 서비스 · 신입',datetime='2026-09-16',dateLabel='2026.09.16 수정'
}={}){
 return `<article class="dds-document-card dds-content-card"><div class="dds-card-header">${statusBadge(status==='저장 완료'?'complete':'draft',status,icon)}<button class="icon-btn dds-card-tools" type="button" data-dialog aria-label="${escapeHTML(title)} 미리보기">${icon('Eye')}</button></div><h3 class="dds-card-title"><a class="dds-card-link" href="${safeHref(href)}">${escapeHTML(title)}</a></h3><p class="dds-meta-primary">${escapeHTML(primary)}</p><p class="dds-meta-secondary">${escapeHTML(secondary)}</p><time class="dds-meta-date" datetime="${escapeHTML(datetime)}">${escapeHTML(dateLabel)}</time></article>`;
}

/** Return null for IDs owned by another canonical module. */
export function renderCore(id,instanceId,mini=false){
 const uid=safeId(instanceId,id);
 switch(id){
case 'button':return renderButton({label:'작성 시작'});
case 'icon-button':return `<div class="demo-row">${['plus','copy','more'].map((i,n)=>`<button type="button" class="icon-btn bordered" aria-label="${['문항 추가','문항 복사','추가 메뉴'][n]}" data-toast="${['문항 추가','문항 복사','추가 메뉴'][n]} 예제입니다.">${icon(i)}</button>`).join('')}</div>`;
case 'chip':return `<div class="demo-row"><button type="button" class="chip selected" aria-pressed="true" data-chip>프로덕트 디자인</button><button type="button" class="chip" aria-pressed="false" data-chip>사용자 리서치</button><button type="button" class="chip" aria-pressed="false" data-chip>프로토타이핑</button></div>`;
case 'input':return `<div class="field"><label for="${uid}"><span data-dds-part="label">자기소개서 제목</span> <span class="required">*</span></label><input id="${uid}" placeholder="지원 직무가 드러나는 제목" ${mini?'value="함께 성장하는 디자이너"':''}><p class="helper">나의 강점이 드러나는 제목을 작성해 주세요.</p></div>`;
case 'textarea':return `<div class="field"><label for="${uid}"><span data-dds-part="label">지원 동기</span></label><textarea id="${uid}" maxlength="500" placeholder="지원하게 된 계기를 작성해 주세요." data-counter>${mini?'사용자의 문제를 발견하고 더 나은 경험을 설계합니다.':''}</textarea><div class="row-between helper"><span>공백 포함 · 최대 500자</span><span data-count>${mini?'34':'0'} / 500</span></div></div>`;
case 'select':return `<div class="field"><label for="${uid}"><span data-dds-part="label">지원 직종</span></label><select id="${uid}"><option value="">직종을 선택해 주세요</option><option>디자인</option><option>IT·전기·전자·통신</option><option>마케팅·광고·홍보</option></select></div>`;
case 'combobox':return `<div class="field"><label for="${uid}"><span data-dds-part="label">관심 직무</span></label><input id="${uid}" list="${uid}-options" placeholder="직무를 검색하세요"><datalist id="${uid}-options"><option value="프로덕트 디자이너"><option value="UX 리서처"><option value="프론트엔드 개발자"><option value="서비스 기획자"></datalist><p class="helper">검색어와 방향키로 후보를 탐색하는 커스텀 선택 UI입니다.</p></div>`;
case 'checkbox':return `<div class="stack"><label class="check-label"><input type="checkbox" checked> <span data-dds-part="label">작성 중인 자기소개서</span></label><label class="check-label"><input type="checkbox"> <span data-dds-part="label">완성한 이력서</span></label><label class="check-label muted"><input type="checkbox" disabled> <span data-dds-part="label">선택할 수 없는 문서</span></label></div>`;
case 'radio':return `<fieldset class="radio-set"><legend>지원 경력</legend><label class="check-label"><input type="radio" name="${uid}" checked> <span data-dds-part="label">신입</span></label><label class="check-label"><input type="radio" name="${uid}"> <span data-dds-part="label">경력</span></label></fieldset>`;
case 'switch':return `<label class="switch-label"><span data-dds-part="label">예제 자동 저장</span><input type="checkbox" role="switch" aria-label="예제 자동 저장" checked><span class="switch-track" aria-hidden="true"></span></label>`;
case 'date-picker':return `<div class="field"><label for="${uid}"><span data-dds-part="label">경력 시작일</span></label><input id="${uid}" type="date" value="2026-09-16"></div>`;
case 'upload':return `<div class="upload-zone">${icon('file')}<label for="${uid}"><span data-dds-part="label">문서 파일 선택</span></label><p class="helper">PDF · 최대 10MB · 이 예제는 파일을 전송하지 않습니다.</p><input id="${uid}" type="file" accept=".pdf" data-file><p class="helper file-state" role="status">선택한 파일이 없습니다.</p></div>`;
case 'search':return `<div class="field"><label for="${uid}"><span data-dds-part="label">문서 검색</span></label><div class="search-field">${icon('search')}<input id="${uid}" type="search" placeholder="예: 자기소개서" data-demo-search></div><p class="helper" data-search-count>문서 제목을 입력해 검색 예제를 확인하세요.</p></div>`;
case 'tabs':return `<div class="tab-demo"><div class="segmented" role="tablist" aria-label="예제 문서 종류">${['자기소개서','이력서','면접'].map((t,i)=>`<button type="button" role="tab" id="${uid}-tab-${i}" aria-controls="${uid}-panel" aria-selected="${!i}" tabindex="${i?-1:0}" data-demo-tab>${t}</button>`).join('')}</div><div role="tabpanel" id="${uid}-panel" aria-labelledby="${uid}-tab-0" class="tab-body">자기소개서 목록을 확인하고 작성을 이어가세요.</div></div>`;
case 'breadcrumb':return `<nav class="breadcrumbs" aria-label="예제 경로"><a href="#/">홈</a><span>/</span><a href="#/patterns/document-list">내 문서</a><span>/</span><span aria-current="page">자기소개서</span></nav>`;
case 'pagination':return `<nav class="pagination" aria-label="예제 페이지">${[1,2,3,4].map((n,i)=>`<button type="button" class="btn sm ${i?'':'primary'}" ${i?'':'aria-current="page"'} data-page>${n}</button>`).join('')}<span class="helper" data-page-state>1 / 4 페이지</span></nav>`;
case 'stepper':return `<ol class="stepper">${['지원정보','문항 작성','검토·저장'].map((s,i)=>`<li class="${i===0?'done':i===1?'current':''}" ${i===1?'aria-current="step"':''}><span>${i===0?icon('check'):i+1}</span><b>${s}</b></li>`).join('')}</ol>`;
case 'sidebar':return `<nav class="sample-sidebar" aria-label="예제 마이페이지"><b>내 작업 공간</b><a href="#/patterns/document-list" class="dds-nav-link dds-nav-control selected" aria-current="page"><span data-dds-part="item-label">내 자기소개서</span> ${collectionCount(3,{label:'자기소개서'})}</a><a class="dds-nav-link dds-nav-control" href="#/patterns/resume-builder">내 이력서</a><a class="dds-nav-link dds-nav-control" href="#/patterns/consulting">컨설팅 신청내역</a></nav>`;
case 'dropdown':return `<details class="sample-dropdown"><summary class="btn"><span data-dds-part="label">문서 작업</span> ${icon('chevron')}</summary><div>${btn('미리보기','ghost','data-dialog')}${btn('코드 복사','ghost','data-toast="실제 문서 복사는 원본 서비스에서 진행합니다."')}</div></details>`;
case 'dialog':return `${btn('<span data-dds-part="trigger-label">미리보기 열기</span> '+icon('arrow'),'',`data-dds-dialog="${uid}-dialog"`)}<dialog class="dds-dialog" id="${uid}-dialog" aria-labelledby="${uid}-dialog-title"><div class="dialog-heading"><h2 id="${uid}-dialog-title">자기소개서 미리보기</h2><button class="icon-btn" type="button" data-dds-close aria-label="미리보기 닫기">${icon('close')}</button></div><p>이곳은 디자인 시스템 안의 예제입니다. 실제 자기소개서 데이터는 사용하지 않습니다.</p><div class="sample-document" data-dds-dialog-content><span class="badge">예제 데이터</span><h3>함께 성장하는 프로덕트 디자이너</h3><p>사용자의 문제를 발견하고, 팀과 함께 더 나은 경험을 만들어 갑니다.</p></div><button class="btn primary" type="button" data-dds-close>확인</button></dialog>`;
case 'alert':return `<div class="alert info" data-dds-dismissible><span class="dds-feedback-icon" data-dds-feedback-icon aria-hidden="true">${icon('info')}</span><div class="dds-feedback-content"><b data-dds-alert-title>AI가 작성한 내용은 검토가 필요해요.</b><p data-dds-alert-description>나의 실제 경험과 맞는지 확인하고 수정해 주세요.</p><div class="dds-feedback-actions" data-dds-feedback-actions hidden>${renderButton({label:'내용 확인',variant:'outlined',color:'assistive',size:'sm',attributes:{'data-dds-action':'alert-action'}})}</div></div>${renderButton({label:'안내 닫기',before:'X',iconOnly:true,variant:'outlined',color:'assistive',size:'sm',attributes:{'data-dds-dismiss':'',hidden:true}})}</div>`;
case 'toast':return `${btn('저장 알림 확인하기','',`data-dds-toast="${uid}-toast" data-dds-message="자기소개서 예제를 저장했습니다."`)}<div id="${uid}-toast" class="dds-toast" role="status" aria-live="polite" data-dds-dismissible hidden><span class="dds-feedback-icon" data-dds-feedback-icon aria-hidden="true" hidden>${icon('Info')}</span><span data-dds-toast-message>자기소개서 예제를 저장했습니다.</span><span class="dds-feedback-actions" data-dds-feedback-actions hidden>${renderButton({label:'되돌리기',variant:'outlined',color:'assistive',size:'sm',attributes:{'data-dds-action':'toast-action'}})}</span>${renderButton({label:'알림 닫기',before:'X',iconOnly:true,variant:'outlined',color:'assistive',size:'sm',attributes:{'data-dds-dismiss':'',hidden:true}})}</div>`;
case 'tooltip':return `<button type="button" class="icon-btn bordered" aria-label="글자 수 계산 도움말" data-tooltip="공백과 줄바꿈을 포함해 계산합니다.">${icon('info')}</button>`;
case 'progress':return `<div class="field"><div class="row-between"><label for="${uid}"><span data-dds-part="label">파일 업로드 예제</span></label><span>64%</span></div><progress id="${uid}" max="100" value="64">64%</progress><p class="helper">실제 업로드와 연결되지 않은 상태 예제입니다.</p></div>`;
case 'skeleton':return `<div class="skeleton-card" role="status" aria-label="문서 불러오는 중"><div class="skeleton circle"></div><div class="skeleton"></div><div class="skeleton short"></div><span class="sr-only">불러오는 중</span></div>`;
case 'empty':return `<div class="empty-state">${icon('file')}<h3>첫 자기소개서를 작성해 보세요</h3><p>나의 경험을 정리하는 것부터 시작해요.</p><a href="#/patterns/ai-writing" class="btn primary">${icon('plus')} <span data-dds-part="action-label">작성 흐름 보기</span></a></div>`;
case 'badge':return `<div class="badge-demo"><div class="demo-row">${statusBadge('draft','임시저장',icon)}${statusBadge('pending','승인 대기',icon)}${statusBadge('complete','저장 완료',icon)}${!mini?statusBadge('error','반려',icon):''}</div>${!mini?`<div class="badge-count-example"><span class="dds-meta-primary">내 자기소개서</span>${collectionCount(3,{label:'자기소개서'})}</div>`:''}</div>`;
case 'avatar':return `<div class="demo-row"><span class="avatar">김</span><span class="avatar orange">이</span><span class="avatar dark">박</span><div><b>김디자인 컨설턴트</b><p class="helper">프로덕트 디자인 · 예제 프로필</p></div></div>`;
case 'card':return renderDocumentCard();
case 'table':return `<div class="table-wrap dds-table-scroll" role="region" aria-label="컨설팅 신청 목록" tabindex="0"><table class="dds-data-table"><caption class="sr-only">컨설팅 신청 예제</caption><thead><tr><th>문서</th><th>상태</th><th>신청일</th></tr></thead><tbody><tr><td>프로덕트 디자이너</td><td>${badge('검토 중','info')}</td><td>09.16</td></tr><tr><td>서비스 기획자</td><td>${badge('완료','success')}</td><td>09.12</td></tr></tbody></table></div>`;
case 'accordion':return `<div class="accordion" data-dds-accordion-group="${uid}"><details open><summary>어떤 경험을 작성하면 좋을까요?</summary><p>지원 직무와 연결되는 프로젝트에서 나의 역할과 결과를 구체적으로 정리해 주세요.</p></details><details><summary>자소서는 언제 저장되나요?</summary><p>실서비스의 저장 정책을 확인한 뒤 자동 저장과 직접 저장 상태를 구분해 안내합니다.</p></details></div>`;
case 'editor':return `<div class="editor-demo"><div class="row-between"><b>지원 동기</b>${badge('예제 편집')}</div><label class="sr-only" for="${uid}">자기소개서 본문</label><textarea id="${uid}" data-counter maxlength="500">사용자의 문제를 발견하고 팀과 함께 더 나은 경험을 설계합니다.</textarea><div class="row-between"><span class="helper" data-count>36 / 500</span>${btn('미리보기','sm','data-dialog')}</div></div>`;
case 'video':return `<div class="media-demo"><div class="dds-media-placeholder">${icon('file')}<b>면접 영상 영역</b><p>카메라·마이크 권한을 요청하기 전 상태</p>${btn('권한 안내 보기','sm','data-toast="실제 서비스에서 면접 시작 전에 카메라와 마이크 권한을 요청합니다."')}</div></div>`;
default:return null;
 }
}

const text=selector=>({selector,kind:'text'});
const attrs=(selector,...attributes)=>({selector,kind:'attributes',attributes});
const slot=selector=>({selector,kind:'slot'});
const fieldParts=control=>({
 label:text('[data-dds-part="label"]'),
 control:attrs(control,'name','value','type','placeholder','maxlength','minlength','pattern','inputmode','min','max','step','required','disabled','readonly','autocomplete','aria-label','aria-describedby','aria-invalid'),
 hint:text('.helper')
});

/** Editable content regions. Structural classes, icons and spacing stay canonical.
 * Slots accept host-authored component content, not untrusted user HTML.
 * Attribute names are explicit allowlists for the service create API.
 */
export const coreParts=Object.freeze({
 button:{label:text('.dds-button-label > span'),control:attrs('.dds-button','id','name','value','type','disabled','aria-label')},
 'icon-button':{
  add:attrs('button:nth-child(1)','aria-label','data-tooltip','disabled'),
  copy:attrs('button:nth-child(2)','aria-label','data-tooltip','disabled'),
  more:attrs('button:nth-child(3)','aria-label','data-tooltip','disabled')
 },
 chip:{
  items:slot('.demo-row'),
  firstLabel:text('button:nth-child(1)'),secondLabel:text('button:nth-child(2)'),thirdLabel:text('button:nth-child(3)'),
  firstControl:attrs('button:nth-child(1)','aria-pressed','disabled','value'),
  secondControl:attrs('button:nth-child(2)','aria-pressed','disabled','value'),
  thirdControl:attrs('button:nth-child(3)','aria-pressed','disabled','value')
 },
 input:fieldParts('input'),
 textarea:{label:text('[data-dds-part="label"]'),body:text('textarea'),control:attrs('textarea','name','value','placeholder','maxlength','minlength','rows','required','disabled','readonly','aria-label','aria-invalid'),counter:text('[data-count]'),limit:text('.row-between > span:first-child')},
 select:{label:text('[data-dds-part="label"]'),options:slot('select'),control:attrs('select','name','value','required','disabled','aria-label')},
 combobox:{...fieldParts('input'),options:slot('datalist')},
 checkbox:{
  items:slot('.stack'),
  firstLabel:text('label:nth-child(1) [data-dds-part="label"]'),secondLabel:text('label:nth-child(2) [data-dds-part="label"]'),thirdLabel:text('label:nth-child(3) [data-dds-part="label"]'),
  firstControl:attrs('label:nth-child(1) input','name','value','checked','disabled','required','aria-label'),
  secondControl:attrs('label:nth-child(2) input','name','value','checked','disabled','required','aria-label'),
  thirdControl:attrs('label:nth-child(3) input','name','value','checked','disabled','required','aria-label')
 },
 radio:{
  legend:text('legend'),
  firstLabel:text('label:nth-of-type(1) [data-dds-part="label"]'),secondLabel:text('label:nth-of-type(2) [data-dds-part="label"]'),
  firstControl:attrs('label:nth-of-type(1) input','name','value','checked','disabled','required','aria-label'),
  secondControl:attrs('label:nth-of-type(2) input','name','value','checked','disabled','required','aria-label')
 },
 switch:{label:text('[data-dds-part="label"]'),control:attrs('input','name','value','checked','disabled','aria-label')},
 'date-picker':{label:text('[data-dds-part="label"]'),control:attrs('input','name','value','min','max','required','disabled','readonly','aria-label')},
 upload:{label:text('[data-dds-part="label"]'),hint:text('.helper:not(.file-state)'),state:text('.file-state'),control:attrs('input','name','accept','multiple','disabled','required','aria-label')},
 search:{...fieldParts('input'),result:text('[data-search-count]')},
 tabs:{
  firstLabel:text('[role="tab"]:nth-child(1)'),secondLabel:text('[role="tab"]:nth-child(2)'),thirdLabel:text('[role="tab"]:nth-child(3)'),
  panel:text('[role="tabpanel"]'),panelContent:slot('[role="tabpanel"]'),
  group:attrs('[role="tablist"]','aria-label'),
  firstControl:attrs('[role="tab"]:nth-child(1)','aria-selected','disabled'),secondControl:attrs('[role="tab"]:nth-child(2)','aria-selected','disabled'),thirdControl:attrs('[role="tab"]:nth-child(3)','aria-selected','disabled')
 },
 breadcrumb:{home:text('a:nth-of-type(1)'),parent:text('a:nth-of-type(2)'),current:text('[aria-current="page"]'),homeLink:attrs('a:nth-of-type(1)','href'),parentLink:attrs('a:nth-of-type(2)','href'),group:attrs('nav','aria-label')},
 pagination:{pages:slot('.pagination'),state:text('[data-page-state]'),group:attrs('nav','aria-label')},
 stepper:{steps:slot('.stepper'),firstLabel:text('li:nth-child(1) b'),secondLabel:text('li:nth-child(2) b'),thirdLabel:text('li:nth-child(3) b')},
 sidebar:{title:text('.sample-sidebar > b'),firstLabel:text('[data-dds-part="item-label"]'),secondLabel:text('a:nth-of-type(2)'),thirdLabel:text('a:nth-of-type(3)'),firstLink:attrs('a:nth-of-type(1)','href','aria-current'),secondLink:attrs('a:nth-of-type(2)','href','aria-current'),thirdLink:attrs('a:nth-of-type(3)','href','aria-current'),count:text('.dds-collection-count'),countControl:attrs('.dds-collection-count','aria-label')},
 dropdown:{label:text('[data-dds-part="label"]'),items:slot('.sample-dropdown > div'),firstLabel:text('.sample-dropdown > div > button:nth-child(1)'),secondLabel:text('.sample-dropdown > div > button:nth-child(2)')},
 dialog:{trigger:text('[data-dds-part="trigger-label"]'),title:text('.dialog-heading > h2'),body:text('.dds-dialog > p'),content:slot('.sample-document'),documentTitle:text('.sample-document > h3'),documentBody:text('.sample-document > p'),confirm:text('.dds-dialog > button'),close:attrs('.dialog-heading > button','aria-label'),control:attrs('[data-dds-dialog]','aria-label','disabled','hidden')},
 alert:{title:text('[data-dds-alert-title]'),description:text('[data-dds-alert-description]'),content:slot('.alert > .dds-feedback-content'),actions:slot('[data-dds-feedback-actions]'),actionLabel:text('[data-dds-action="alert-action"] .dds-button-label > span'),action:attrs('[data-dds-action="alert-action"]','disabled','aria-label'),close:attrs('[data-dds-dismiss]','aria-label','disabled'),control:attrs('.alert','role','aria-live')},
 toast:{label:text('[data-dds-toast]'),message:attrs('[data-dds-toast]','data-dds-message'),content:text('[data-dds-toast-message]'),actions:slot('[data-dds-feedback-actions]'),actionLabel:text('[data-dds-action="toast-action"] .dds-button-label > span'),action:attrs('[data-dds-action="toast-action"]','disabled','aria-label'),close:attrs('[data-dds-dismiss]','aria-label','disabled'),control:attrs('[data-dds-toast]','aria-label','disabled')},
 tooltip:{control:attrs('button','aria-label','data-tooltip','disabled')},
 progress:{label:text('[data-dds-part="label"]'),value:text('.row-between > span'),hint:text('.helper'),control:attrs('progress','value','max','aria-label','aria-valuetext')},
 skeleton:{label:text('.sr-only'),control:attrs('.skeleton-card','aria-label','aria-busy')},
 empty:{title:text('h3'),description:text('p'),action:text('[data-dds-part="action-label"]'),actionControl:attrs('a','href','aria-label')},
 badge:{statuses:slot('.badge-demo > .demo-row'),countLabel:text('.badge-count-example > .dds-meta-primary'),count:text('.dds-collection-count'),countControl:attrs('.dds-collection-count','aria-label')},
 avatar:{firstInitial:text('.avatar:nth-child(1)'),secondInitial:text('.avatar:nth-child(2)'),thirdInitial:text('.avatar:nth-child(3)'),name:text('.demo-row > div > b'),description:text('.helper')},
 card:{content:slot('.dds-document-card'),container:attrs('.dds-document-card','aria-label','role'),title:text('.dds-card-link'),link:attrs('.dds-card-link','href','aria-label'),status:text('.dds-status > span'),primary:text('.dds-meta-primary'),secondary:text('.dds-meta-secondary'),date:text('.dds-meta-date'),dateControl:attrs('.dds-meta-date','datetime'),action:attrs('.dds-card-tools','aria-label','disabled')},
 table:{caption:text('caption'),head:slot('thead'),rows:slot('tbody'),region:attrs('.dds-table-scroll','aria-label'),firstTitle:text('tbody tr:nth-child(1) td:nth-child(1)'),secondTitle:text('tbody tr:nth-child(2) td:nth-child(1)')},
 accordion:{firstTitle:text('details:nth-child(1) summary'),firstBody:text('details:nth-child(1) p'),secondTitle:text('details:nth-child(2) summary'),secondBody:text('details:nth-child(2) p'),firstControl:attrs('details:nth-child(1)','open'),secondControl:attrs('details:nth-child(2)','open')},
 editor:{title:text('.row-between > b'),status:text('.badge'),label:text('label'),body:text('textarea'),control:attrs('textarea','name','value','placeholder','maxlength','required','disabled','readonly','aria-label'),counter:text('[data-count]'),action:text('button')},
 video:{title:text('.dds-media-placeholder > b'),description:text('.dds-media-placeholder > p'),action:text('button'),media:slot('.media-demo')}
});

export const coreIds=Object.freeze(Object.keys(coreParts));
