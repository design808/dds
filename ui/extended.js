// Canonical extended-component markup. No document listeners or automatic mounting.
import {icon} from './icons.js?v=fbe7d307629a0ab1';
import {collectionCount,statusBadge} from '../visibility.js?v=fbe7d307629a0ab1';
const button=(text,attrs='',cls='')=>`<button type="button" class="btn ${cls}" ${attrs}>${text}</button>`;
const ic=(name,label,attrs='')=>`<button type="button" class="icon-btn" aria-label="${label}" ${attrs}>${icon(name)}</button>`;
const link=(text,route,current=false)=>`<a class="dds-nav-link dds-nav-control" href="#${route}" ${current?'aria-current="page"':''}>${text}</a>`;
const status='<p class="helper" data-ext-status role="status"></p>';
const choices=(name,values,type='radio')=>values.map((t,i)=>`<label class="dds-choice"><input type="${type}" name="${name}" value="${t}" ${i===0?'checked':''}><span>${t}</span></label>`).join('');
const menu=(uid,title,items=['새 문서','문서 복사','내보내기'])=>`<div class="dds-menu-unit">${button(title,`data-ext-menu="${uid}" aria-haspopup="menu" aria-expanded="false" aria-controls="${uid}"`)}<div id="${uid}" class="dds-menu" role="menu" aria-label="${title}" hidden>${items.map(t=>`<button type="button" role="menuitem" data-ext-command="${t}">${t}</button>`).join('')}</div></div>`;
// Intrinsic controls use their content width. Their placement and alignment
// belong to the page or document container, not the component itself.
const contentSizedComponents=new Set(['text-button','button-group','toggle','toggle-group','alert-dialog','sheet','drawer','popover','hover-card','push-badge','avatar-group','spinner','play-badge']);
const bubble=(text,out=false)=>`<div class="dds-bubble ${out?'outgoing':''}">${text}</div>`;
const message=(text,who='DDS 코치',out=false)=>`<article class="dds-message ${out?'outgoing':''}"><span class="avatar">${out?'나':'D'}</span><div><div class="dds-message-meta"><b>${who}</b><time>09:30</time></div>${bubble(text,out)}</div></article>`;
const escapeItemText=value=>String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
function itemHref(value){
 const href=String(value??'#').trim(),protocol=href.replace(/[\u0000-\u0020\u007f]/g,'');
 if(/^[a-z][a-z0-9+.-]*:/i.test(protocol)&&!/^(https?|mailto|tel):/i.test(protocol))throw new TypeError('Unsupported DDS Item link protocol.');
 return escapeItemText(href);
}
/** Shared Item anatomy for service templates and document blocks.
 * title/href/metadata/label are escaped. slots contain trusted, authored DDS HTML;
 * never pass user-provided HTML into a slot. DOM callers use the registered slots.
 */
export function renderItemList(items,{appearance='outlined',label}={}){
 if(!Array.isArray(items))throw new TypeError('DDS Item requires an array.');
 if(!['outlined','divided'].includes(appearance))throw new TypeError('Unsupported DDS Item appearance.');
 const rows=items.map(item=>{
  if(!item||typeof item!=='object'||!String(item.title??'').trim())throw new TypeError('DDS Item requires a title.');
  const slots=item.slots||{};
  for(const [name,value]of Object.entries(slots))if(!['leading','metadata','trailingInfo','actions'].includes(name)||value!=null&&typeof value!=='string')throw new TypeError('DDS Item slots require authored HTML strings.');
  const leading=Object.hasOwn(slots,'leading')?slots.leading||'':icon('file');
  const metadata=Object.hasOwn(slots,'metadata')?slots.metadata||'':item.metadata?`<span class="dds-meta-secondary">${escapeItemText(item.metadata)}</span>`:'';
  const trailingInfo=slots.trailingInfo||'',actions=slots.actions||'';
  return `<li class="dds-list-item"><a class="dds-list-link" href="${itemHref(item.href)}"><span class="dds-list-leading" aria-hidden="true"${leading?'':' hidden'}>${leading}</span><span class="dds-list-content"><b class="dds-card-title">${escapeItemText(item.title)}</b><span class="dds-list-meta"${metadata?'':' hidden'}>${metadata}</span></span><span class="dds-list-trailing-info"${trailingInfo?'':' hidden'}>${trailingInfo}</span>${icon('right','dds-list-chevron').replace('<svg ','<svg '+(item.chevron===false?'hidden ':''))}</a><div class="dds-list-actions"${actions?'':' hidden'}>${actions}</div></li>`;
 }).join('');
 return `<ul class="dds-items" data-dds-appearance="${appearance}"${label?' aria-label="'+escapeItemText(label)+'"':''}>${rows}</ul>`;
}
const topnavMenus=[
 ['brand','브랜드',[['Palette','색상과 서체','화면의 기본 규칙','#/foundations/color']]],
 ['components','컴포넌트',[['Layers','컴포넌트','화면을 구성하는 기본 요소','#/components'],['Sparkles','모션','조작에 응답하는 움직임','#/foundations/motion']]],
 ['blocks','블록',[['LayoutGrid','블록 갤러리','컴포넌트를 조합한 화면','#/blocks']]],
 ['docs','문서',[['BookOpen','개발 적용 안내','서비스에 연결하는 방법','#/handoff']]]
];
function topNavigation(uid){
 const prefix='topnav-'+String(uid||'dds-top-navigation').replace(/[^a-zA-Z0-9_-]/g,'-');
 return `<div class="dds-demo dds-topnav-demo"><header class="dds-topnav" data-dds-topnav data-dds-language="ko"><div class="dds-topnav-bar"><a class="dds-topnav-brand" href="#/" aria-label="딥레쥬메 홈"><img src="/assets/deepresume-logo.png" width="174" height="29" alt="딥레쥬메"></a><button type="button" class="dds-topnav-icon dds-topnav-toggle" data-dds-topnav-toggle aria-label="메뉴 열기" data-tooltip="메뉴 열기" aria-expanded="false" aria-controls="${prefix}-panel"><span class="dds-button-label">${icon('Menu')}</span></button><div class="dds-topnav-panel" id="${prefix}-panel" data-dds-topnav-panel><nav class="dds-topnav-links" aria-label="주 메뉴">${topnavMenus.map(([id,label,links])=>`<details class="dds-nav-details dds-topnav-menu" name="${prefix}-menus"><summary class="dds-nav-link dds-nav-control" ${id==='blocks'?'aria-current="page"':''}>${label}${icon('ChevronDown')}</summary><div class="dds-topnav-dropdown">${links.map(([glyph,title,description,href])=>`<a href="${href}"><span class="dds-topnav-link-icon" aria-hidden="true">${icon(glyph)}</span><span><strong>${title}</strong><span>${description}</span></span></a>`).join('')}</div></details>`).join('')}<a class="dds-nav-link dds-nav-control" href="#/setup">AI로 적용</a></nav><div class="dds-topnav-tools"><details class="dds-nav-details dds-topnav-menu" name="${prefix}-menus"><summary class="dds-topnav-icon dds-topnav-language" data-dds-nav-language-trigger aria-label="언어 선택" data-tooltip="언어 선택">${icon('Languages')}<span class="dds-topnav-tool-label"><span>언어 선택</span><span class="dds-topnav-tool-value" data-dds-part="language-value">한국어</span></span><span class="dds-topnav-tool-chevron" aria-hidden="true">${icon('ChevronDown')}</span></summary><div class="dds-topnav-dropdown dds-topnav-dropdown--compact" role="group" aria-label="언어 선택">${[['ko','한국어'],['en','English']].map(([value,label])=>`<button type="button" data-dds-nav-language="${value}" aria-pressed="${value==='ko'}"><span>${label}</span>${value==='ko'?icon('Check'):''}</button>`).join('')}</div></details><details class="dds-nav-details dds-topnav-menu" name="${prefix}-menus"><summary class="dds-topnav-profile" aria-label="프로필 메뉴" data-tooltip="프로필 메뉴"><span class="avatar dds-topnav-avatar" aria-hidden="true">민</span><span class="dds-topnav-tool-label"><span>프로필</span><span class="dds-topnav-tool-value" data-dds-part="profile-value">김민서</span></span><span class="dds-topnav-tool-chevron" aria-hidden="true">${icon('ChevronDown')}</span></summary><div class="dds-topnav-dropdown dds-topnav-dropdown--compact dds-topnav-profile-panel"><strong>김민서</strong><a href="#/blocks">계정 블록</a><a href="#/setup">설정과 적용 방법</a></div></details></div></div></div><span class="sr-only" data-dds-nav-status role="status"></span></header></div>`;
}
export function renderExtended(id,uid,mini=false){
 uid=String(uid||'dds-'+id).replace(/[^a-zA-Z0-9_-]/g,'-');
 const box=(html,extra='')=>`<div class="dds-demo${contentSizedComponents.has(id)?' dds-size-content':''}" ${extra}>${html}</div>`;
 switch(id){
 case 'action-area':return box(`<p class="helper">변경사항을 확인한 뒤 저장해 주세요.</p><div class="dds-action-area">${button('취소','data-ext-notice="편집을 계속합니다."')}${button('저장','data-ext-notice="예제 내용이 저장되었습니다."','primary')}</div>${status}`);
 case 'text-button':return box(button('전체 보기 '+icon('right'),'data-ext-notice="전체 목록 보기 예제입니다."','ghost')+status);
 case 'button-group':return box(`<div class="dds-button-group" role="group" aria-label="문서 행동">${button('저장','data-ext-notice="저장되었습니다."')}${button('복사','data-ext-notice="문서 복사 예제입니다."')}${button('공유','data-ext-notice="공유 설정 예제입니다."')}</div>${status}`);
 case 'toggle':return box(button(icon('Bookmark')+' 북마크','data-ext-toggle aria-pressed="false"')+status);
 case 'toggle-group':return box(`<div class="dds-button-group" role="group" aria-label="텍스트 서식">${['Bold','Italic','Underline'].map((n,i)=>button(icon(n),`data-ext-toggle aria-pressed="false" aria-label="${['굵게','기울임','밑줄'][i]}"`)).join('')}</div>${status}`);
 case 'filter-button':return box(`<div class="demo-row">${button(icon('SlidersHorizontal')+' <span class="dds-stable-label" data-size-label="경력 3년 이상 · 1"><span data-filter-label>경력 전체</span></span>','data-ext-filter')}${button('초기화','data-ext-filter-reset','ghost')}</div><p data-ext-filter-result class="helper">전체 경력을 표시합니다.</p>`);
 case 'calendar':return box(`<div class="dds-calendar" data-ext-calendar data-year="2026" data-month="8" data-selected="2026-09-17"><div class="row-between">${ic('left','이전 달','data-month-shift="-1"')}<b data-month-label>2026년 9월</b>${ic('right','다음 달','data-month-shift="1"')}</div><div class="dds-calendar-week" aria-hidden="true">${['일','월','화','수','목','금','토'].map(x=>`<span>${x}</span>`).join('')}</div><div data-calendar-grid class="dds-calendar-grid" role="group" aria-label="날짜 선택">${calendarDays(2026,8,'2026-09-17')}</div><p class="helper" data-date-result role="status">선택: 2026-09-17</p></div>`);
 case 'field':return box(`<form data-ext-form novalidate><fieldset><legend>연락 정보</legend><label for="${uid}">이메일 <span class="required">*</span></label><input id="${uid}" name="email" type="email" autocomplete="off" placeholder="name@example.com" required aria-describedby="${uid}-hint ${uid}-error"><p id="${uid}-hint" class="helper">연락받을 이메일을 입력해 주세요.</p><p id="${uid}-error" class="dds-error" data-field-error aria-live="polite"></p>${button('입력 확인','data-ext-validate','primary')}</fieldset>${status}</form>`);
 case 'input-group':return box(`<label for="${uid}">비밀번호</label><div class="dds-input-group">${icon('LockKeyhole')}<input id="${uid}" type="password" autocomplete="off" placeholder="비밀번호 입력"><button type="button" class="icon-btn" data-ext-password aria-label="비밀번호 표시" aria-pressed="false">${icon('Eye')}</button></div>`);
 case 'input-otp':return box(`<label for="${uid}">6자리 인증번호</label><input class="dds-otp" id="${uid}" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" placeholder="000000" data-ext-otp aria-describedby="${uid}-hint"><p id="${uid}-hint" class="helper" data-otp-status>숫자 6자리를 입력해 주세요.</p>`);
 case 'label':return box(`<label for="${uid}">이력서 이름 <span class="required">*</span></label><input id="${uid}" placeholder="예: 서비스 기획자 이력서" required><p class="helper">필수 항목은 별표로 표시합니다.</p>`);
 case 'slider':return box(`<label for="${uid}">재생 음량 <output data-slider-output>50%</output></label><input id="${uid}" class="dds-slider" type="range" min="0" max="100" value="50" data-ext-slider style="--value:50%">`);
 case 'segmented-control':return box(`<fieldset><legend>경력 구분</legend><div class="dds-segmented">${choices(uid,['신입','경력','전체'])}</div></fieldset>`);
 case 'framed-style':return box(`<fieldset><legend>첨삭 방식</legend><div class="dds-framed">${choices(uid,['문서 첨삭','화상 상담'])}</div></fieldset>`);
 case 'time-picker':return box(`<fieldset data-ext-time><legend>상담 시작 시간</legend><div class="dds-time">${icon('Clock')}<select aria-label="시">${Array.from({length:24},(_,i)=>`<option ${i===9?'selected':''}>${String(i).padStart(2,'0')}</option>`).join('')}</select><span>:</span><select aria-label="분">${['00','15','30','45'].map(t=>`<option>${t}</option>`).join('')}</select></div><p class="helper" data-time-result role="status">09:00 · Asia/Seoul (KST)</p></fieldset>`);
 case 'questionnaire':return box(`<form data-ext-questionnaire><p class="helper" data-question-progress>1 / 3 질문</p><fieldset data-question="0"><legend>지원 단계는 무엇인가요?</legend>${choices(uid+'-stage',['첫 지원','지원 경험 있음'])}</fieldset><fieldset data-question="1" hidden><legend>도움이 필요한 항목 (선택)</legend>${choices(uid+'-help',['지원 동기','직무 경험'],'checkbox')}</fieldset><fieldset data-question="2" hidden><legend>추가로 전달할 내용 (선택)</legend><textarea aria-label="추가로 전달할 내용" placeholder="자유롭게 작성해 주세요."></textarea></fieldset><div class="dds-action-area">${button('이전','data-question-back disabled')}${button('다음','data-question-next','primary')}</div>${status}</form>`);
 case 'navigation-menu':return box(`<nav aria-label="서비스 탐색"><details class="dds-nav-details"><summary class="dds-nav-link dds-nav-control">자기소개서 ${icon('down')}</summary><div>${link('내 문서','/patterns/document-list')}${link('AI 작성','/patterns/ai-writing')}${link('검사와 피드백','/patterns/analysis')}</div></details></nav>`);
 case 'top-navigation':return topNavigation(uid);
 case 'bottom-navigation':return box(`<nav class="dds-bottomnav" aria-label="모바일 주요 메뉴">${[['House','홈','/'],['FileText','문서','/patterns/document-list'],['Users','컨설팅','/patterns/consulting']].map(([i,t,r],n)=>`<a class="dds-bottomnav-link" href="#${r}" ${n===0?'aria-current="page"':''}>${icon(i)}<span>${t}</span></a>`).join('')}</nav>`);
 case 'category':return box(`<div class="demo-row" role="group" aria-label="콘텐츠 분류">${['전체','자기소개서','면접'].map((t,i)=>button(t,`data-ext-category aria-pressed="${i===0}"`,i===0?'selected':'')).join('')}</div><p class="helper" data-category-result>전체 콘텐츠</p>`);
 case 'page-counter':return box(`<div class="dds-pager" data-ext-pager>${ic('left','이전 페이지','data-page-shift="-1" disabled')}<output aria-live="polite" data-pager-output>1 / 5</output>${ic('right','다음 페이지','data-page-shift="1"')}</div>`);
 case 'pagination-dots':return box(`<nav class="dds-dots" aria-label="슬라이드 이동">${Array.from({length:4},(_,i)=>`<button type="button" data-ext-dot aria-label="슬라이드 ${i+1}" ${i===0?'aria-current="true"':''}></button>`).join('')}</nav><p class="helper" data-dot-result>슬라이드 1</p>`);
 case 'menubar':return box(`<div class="dds-menubar" role="menubar" aria-label="문서 편집">${menu(uid+'-file','파일')}${menu(uid+'-edit','편집',['실행 취소','다시 실행'])}</div>${status}`);
 case 'command':return box(`<div class="dds-command"><div class="search-field dds-command-field">${icon('Search')}<input type="search" aria-label="명령 검색" placeholder="명령 검색…" data-ext-command-search></div><div class="dds-command-results" role="group" aria-label="명령 목록">${[['FilePlus','새 자기소개서'],['FileText','이력서 열기'],['ChartColumn','면접 결과 보기']].map(([glyph,t])=>`<button type="button" class="dds-command-option" data-ext-command="${t}">${icon(glyph)}<span>${t}</span></button>`).join('')}</div><p data-command-empty hidden>일치하는 명령이 없습니다.</p></div>${status}`);
 case 'context-menu':return box(`<div class="dds-context" tabindex="0" data-ext-context><div class="dds-context-content"><p>자기소개서 예제</p><span class="helper">우클릭 또는 Shift+F10</span></div>${menu(uid,'문서 메뉴',['문서 복사','이름 변경','내보내기'])}</div>${status}`);
 case 'alert-dialog':case 'sheet':case 'drawer':{const title=id==='alert-dialog'?'예제 문서를 삭제할까요?':id==='sheet'?'문서 상세':'컨설팅 방식 선택';const content=id==='alert-dialog'?'<p>이 동작은 확인 UI 예제이며 실제 문서를 삭제하지 않습니다.</p>':`<p>현재 작업을 유지하며 추가 정보를 확인합니다.</p>${choices(uid,['문서 첨삭','화상 상담'])}`;return box(button(id==='alert-dialog'?'삭제 확인 열기':id==='sheet'?'사이드 시트 열기':'하단 시트 열기',`data-ext-dialog="${uid}"`)+`<dialog id="${uid}" class="dds-overlay ${id}" ${id==='alert-dialog'?'role="alertdialog"':''} aria-labelledby="${uid}-title"><div class="dialog-heading"><h2 id="${uid}-title">${title}</h2>${ic('close','닫기','data-ext-close')}</div>${content}<div class="dds-action-area">${button('취소','data-ext-close autofocus')}${button('확인','data-ext-confirm','primary')}</div></dialog>`+status);}
 case 'popover':case 'hover-card':return box(`<span class="dds-popover-host">${button(id==='popover'?'표시 설정':'DDS 코치 프로필',`data-ext-popover="${uid}" ${id==='hover-card'?'data-ext-hover':''} aria-expanded="false" aria-controls="${uid}"`)}<div id="${uid}" class="dds-popover" popover="auto" role="dialog" aria-label="${id==='popover'?'표시 설정':'코치 프로필'}"><div class="row-between"><b>${id==='popover'?'표시 설정':'DDS 코치'}</b>${ic('close','닫기',`data-popover-close="${uid}"`)}</div>${id==='popover'?choices(uid,['완료 문서도 표시'],'checkbox'):'<p>프로덕트 디자인 · 경력 상담</p><p class="helper">합성 예제 프로필</p>'}</div></span>`);
 case 'snackbar':return box(`<div class="dds-snackbar"><span data-snack-message role="status">문서를 보관했습니다.</span>${button('되돌리기','data-snack-undo','ghost')}${ic('close','알림 닫기','data-snack-close')}</div>${button('알림 다시 보기','data-snack-show','ghost')}`);
 case 'spinner':return box(`<div class="demo-row" role="status"><span class="dds-spinner" aria-hidden="true"></span><span>문서를 준비하고 있어요</span></div>`);
 case 'fallback-view':return box(`<div class="dds-fallback">${icon('CloudOff')}<h3 data-fallback-title>연결을 확인해 주세요</h3><p data-fallback-copy>잠시 후 다시 시도할 수 있습니다.</p><div class="dds-fallback-actions"><button type="button" class="dds-button" data-ext-retry>다시 시도</button></div></div>`);
 case 'push-badge':return box(`<button class="icon-btn dds-push" aria-label="읽지 않은 알림 3개" data-ext-notice="읽지 않은 예제 알림 3개">${icon('Bell')}<span aria-hidden="true">3</span></button>${status}`);
 case 'aspect-ratio':return box(`<div class="dds-ratio" role="img" aria-label="16대9 미디어 영역 예제"><div class="dds-ratio-placeholder">${icon('Image')}<span>16 : 9</span></div></div>`);
 case 'thumbnail':return box(`<div class="dds-thumbnail"><img src="/assets/deepresume-logo.png" alt="DeepResume 브랜드 이미지" width="240" height="40"></div>`);
 case 'play-badge':return box(button(icon('Play')+' 02:34','data-ext-notice="재생 표시 예제입니다. 실제 영상은 연결하지 않았습니다."','dds-play')+status);
 case 'avatar-group':return box(`<div class="dds-avatar-group" role="img" aria-label="예제 참여자: 가람, 나래, 다온 외 2명">${['가','나','다','+2'].map(t=>`<span class="avatar">${t}</span>`).join('')}</div><p class="helper">참여자 5명</p>`);
 case 'list-card':return box(`<article class="dds-list-card dds-content-card"><div class="dds-mini-image">${icon('FileText')}</div><div><h3 class="dds-card-title"><a class="dds-card-link" href="#/patterns/interview">면접 준비 가이드</a></h3><p class="dds-meta-secondary">3분 읽기 · 커리어 가이드</p></div></article>`);
 case 'item':return box(renderItemList(['프로덕트 디자이너','서비스 기획자'].map(title=>({title,href:'/prototypes/coverletter-write.html',slots:{metadata:`<span class="dds-meta-secondary">자기소개서</span>${statusBadge('draft','임시저장',icon)}`}}))));
 case 'section-header':return box(`<div class="dds-section-header"><div class="dds-section-header-content"><h3 class="dds-section-heading"><span>내 자기소개서</span>${collectionCount(3,{label:'자기소개서'})}</h3><p class="dds-meta-secondary">최근 작성한 문서</p></div><a class="dds-nav-link dds-section-header-action" href="#/patterns/document-list">전체 보기</a></div>`);
 case 'attachment':return box(`<div class="dds-attachment">${icon('FileText')}<div><b>포트폴리오.pdf</b><p class="helper">PDF · 2.4 MB · 선택됨</p></div>${ic('close','포트폴리오.pdf 제거','data-attachment-remove')}</div>${button('첨부 예제 복원','data-attachment-restore','ghost')}${status}`);
 case 'carousel':return box(`<section class="dds-carousel" aria-roledescription="캐러셀" aria-label="커리어 가이드"><div data-carousel-slide class="dds-ratio"><div class="dds-ratio-placeholder"><span class="eyebrow">CAREER GUIDE 01</span><b>나의 경험을 발견하기</b></div></div><div class="row-between">${ic('left','이전 슬라이드','data-carousel-shift="-1" disabled')}<output data-carousel-count aria-live="polite">1 / 3</output>${ic('right','다음 슬라이드','data-carousel-shift="1"')}</div></section>`);
 case 'collapsible':return box(`<details class="dds-collapsible"><summary>지원 정보 상세 ${icon('down')}</summary><p>지원 직무: 프로덕트 디자이너</p><p>고용 형태: 정규직</p></details>`);
 case 'separator':return box(`<p>지원 정보</p><hr><p>문항 작성</p>`);
 case 'kbd':return box(`<div class="demo-row"><kbd>Ctrl</kbd><span>+</span><kbd>K</kbd><span class="helper">문서 검색</span></div>`);
 case 'scroll-area':return box(`<div class="dds-scroll" role="region" aria-label="예제 알림 목록" tabindex="0"><ul>${Array.from({length:12},(_,i)=>`<li>문서 검토 알림 ${i+1}</li>`).join('')}</ul></div>`);
 case 'resizable':return box(`<div class="dds-resizable"><section><b>원문</b><p>나의 경험과 역할을 구체적으로 작성합니다.</p></section><div class="dds-resize-handle" tabindex="0" role="separator" aria-label="원문 영역 너비" aria-orientation="vertical" aria-valuemin="25" aria-valuemax="75" aria-valuenow="50">${icon('GripVertical')}</div><section><b>피드백</b><p>성과 수치를 추가해 보세요.</p></section></div>`);
 case 'direction':return box(`<div class="dds-direction" dir="ltr"><span>시작</span>${icon('right')}<b>DDS</b></div><div class="dds-direction" dir="rtl"><span>시작</span>${icon('left')}<b>DDS</b></div><p class="helper">LTR / RTL 논리 방향 예제</p>`);
 case 'bubble':return box(bubble('지원 경험을 정리하고 싶어요.',true)+bubble('어떤 프로젝트를 진행했나요?'));
 case 'message':return box(message('성과와 본인의 역할을 함께 작성해 보세요.')+status);
 case 'marker':return box(`<div class="dds-marker"><span></span>${icon('check')}<b>문서 분석 완료</b><span></span></div>`);
 case 'message-scroller':return box(`<div class="dds-thread" data-ext-thread><div class="dds-scroll" tabindex="0" role="region" aria-label="예제 대화" data-thread-log>${message('프로젝트 경험을 알려 주세요.')}${message('사용자 인터뷰를 진행했어요.','나',true)}${message('발견한 문제와 결과를 연결해 보세요.')}</div><div class="dds-action-area">${button('예제 메시지 추가','data-thread-add')}${button('최신으로','data-thread-bottom','ghost')}</div><p class="helper" data-thread-status role="status"></p></div>`);
 default:return '';
 }
}
const pad=n=>String(n).padStart(2,'0');
function calendarDays(y,m,selected){const start=new Date(y,m,1).getDay(),count=new Date(y,m+1,0).getDate();return Array.from({length:start},()=>'<span></span>').join('')+Array.from({length:count},(_,i)=>{const v=`${y}-${pad(m+1)}-${pad(i+1)}`;return `<button type="button" data-calendar-date="${v}" aria-label="${y}년 ${m+1}월 ${i+1}일" aria-pressed="${v===selected}" tabindex="${v===selected||(!selected.startsWith(`${y}-${pad(m+1)}`)&&i===0)?0:-1}">${i+1}</button>`;}).join('');}

export {calendarDays, message as renderExtendedMessage};

const text=selector=>({selector,kind:'text'});
const attributes=selector=>({selector,kind:'attributes'});
const slot=selector=>({selector,kind:'slot'});
const parts={
 'action-area':{description:text('.dds-demo > .helper'),actions:slot('.dds-action-area'),cancelLabel:text('.dds-action-area > button:first-child'),confirmLabel:text('.dds-action-area > button:last-child'),status:text('[data-ext-status]')},
 'text-button':{button:attributes('.dds-demo > .btn'),content:slot('.dds-demo > .btn'),status:text('[data-ext-status]')},
 'button-group':{group:attributes('.dds-button-group'),actions:slot('.dds-button-group'),firstLabel:text('.dds-button-group > button:first-child'),status:text('[data-ext-status]')},
 'toggle':{button:attributes('[data-ext-toggle]'),content:slot('[data-ext-toggle]'),status:text('[data-ext-status]')},
 'toggle-group':{group:attributes('.dds-button-group'),options:slot('.dds-button-group'),status:text('[data-ext-status]')},
 'filter-button':{button:attributes('[data-ext-filter]'),label:text('[data-filter-label]'),resetLabel:text('[data-ext-filter-reset]'),result:text('[data-ext-filter-result]')},
 calendar:{calendar:attributes('[data-ext-calendar]'),month:text('[data-month-label]'),days:slot('[data-calendar-grid]'),selectedDate:text('[data-date-result]')},
 field:{form:attributes('[data-ext-form]'),legend:text('legend'),label:slot('label'),input:attributes('input'),description:text('.helper[id]'),error:text('[data-field-error]'),buttonLabel:text('[data-ext-validate]'),status:text('[data-ext-status]')},
 'input-group':{label:text('label'),input:attributes('.dds-input-group > input'),visibilityButton:attributes('[data-ext-password]')},
 'input-otp':{label:text('label'),input:attributes('[data-ext-otp]'),description:text('[data-otp-status]')},
 label:{label:slot('label'),input:attributes('input'),description:text('.helper')},
 slider:{label:slot('label'),input:attributes('[data-ext-slider]'),value:text('[data-slider-output]')},
 'segmented-control':{legend:text('legend'),group:attributes('.dds-segmented'),options:slot('.dds-segmented')},
 'framed-style':{legend:text('legend'),group:attributes('.dds-framed'),options:slot('.dds-framed')},
 'time-picker':{legend:text('legend'),hours:attributes('select[aria-label="시"]'),minutes:attributes('select[aria-label="분"]'),result:text('[data-time-result]')},
 questionnaire:{form:attributes('[data-ext-questionnaire]'),progress:text('[data-question-progress]'),firstQuestion:text('[data-question="0"] > legend'),firstChoices:slot('[data-question="0"]'),secondQuestion:text('[data-question="1"] > legend'),secondChoices:slot('[data-question="1"]'),thirdQuestion:text('[data-question="2"] > legend'),answer:attributes('textarea'),previousLabel:text('[data-question-back]'),nextLabel:text('[data-question-next]'),status:text('[data-ext-status]')},
 'navigation-menu':{navigation:attributes('nav'),trigger:attributes('summary'),links:slot('.dds-nav-details > div'),firstLink:attributes('.dds-nav-details > div > a:first-child')},
 'top-navigation':{header:attributes('[data-dds-topnav]'),brand:text('.dds-topnav-brand'),brandContent:slot('.dds-topnav-brand'),brandImage:attributes('.dds-topnav-brand > img'),brandLink:attributes('.dds-topnav-brand'),menuButton:attributes('[data-dds-topnav-toggle]'),links:slot('.dds-topnav-links'),tools:slot('.dds-topnav-tools'),language:attributes('[data-dds-nav-language-trigger]'),languageTrigger:attributes('[data-dds-nav-language-trigger]'),languageLabel:text('[data-dds-part="language-value"]'),languageOptions:slot('[aria-label="언어 선택"][role="group"]'),korean:attributes('[data-dds-nav-language="ko"]'),english:attributes('[data-dds-nav-language="en"]'),profileTrigger:attributes('.dds-topnav-profile'),profileLabel:text('[data-dds-part="profile-value"]'),profileName:text('.dds-topnav-profile-panel > strong'),profileContent:slot('.dds-topnav-profile-panel'),accountLabel:text('.dds-topnav-profile-panel > a:first-of-type'),accountLink:attributes('.dds-topnav-profile-panel > a:first-of-type')},
 'bottom-navigation':{navigation:attributes('.dds-bottomnav'),links:slot('.dds-bottomnav'),firstLink:attributes('.dds-bottomnav-link:first-child'),firstLabel:text('.dds-bottomnav-link:first-child > span')},
 category:{group:attributes('[role="group"]'),options:slot('[role="group"]'),result:text('[data-category-result]')},
 'page-counter':{counter:attributes('[data-ext-pager]'),value:text('[data-pager-output]'),previous:attributes('[data-page-shift="-1"]'),next:attributes('[data-page-shift="1"]')},
 'pagination-dots':{navigation:attributes('.dds-dots'),dots:slot('.dds-dots'),result:text('[data-dot-result]')},
 menubar:{bar:attributes('.dds-menubar'),menus:slot('.dds-menubar'),firstLabel:text('.dds-menu-unit:first-child > [data-ext-menu]'),status:text('[data-ext-status]')},
 command:{search:attributes('[data-ext-command-search]'),commands:slot('.dds-command-results'),firstLabel:text('.dds-command-option:first-child > span'),empty:text('[data-command-empty]'),status:text('[data-ext-status]')},
 'context-menu':{target:attributes('[data-ext-context]'),content:slot('.dds-context-content'),title:text('.dds-context-content > p'),description:text('.dds-context-content > .helper'),triggerLabel:text('[data-ext-menu]'),commands:slot('[role="menu"]'),status:text('[data-ext-status]')},
 'alert-dialog':{triggerLabel:text('.dds-demo > button'),dialog:attributes('.dds-overlay'),title:text('.dialog-heading > h2'),description:text('.dds-overlay > p'),actions:slot('.dds-action-area'),cancelLabel:text('.dds-action-area > button:first-child'),confirmLabel:text('[data-ext-confirm]'),status:text('[data-ext-status]')},
 sheet:{triggerLabel:text('.dds-demo > button'),dialog:attributes('.dds-overlay'),title:text('.dialog-heading > h2'),description:text('.dds-overlay > p'),actions:slot('.dds-action-area'),cancelLabel:text('.dds-action-area > button:first-child'),confirmLabel:text('[data-ext-confirm]'),status:text('[data-ext-status]')},
 drawer:{triggerLabel:text('.dds-demo > button'),dialog:attributes('.dds-overlay'),title:text('.dialog-heading > h2'),description:text('.dds-overlay > p'),actions:slot('.dds-action-area'),cancelLabel:text('.dds-action-area > button:first-child'),confirmLabel:text('[data-ext-confirm]'),status:text('[data-ext-status]')},
 popover:{triggerLabel:text('.dds-popover-host > button'),trigger:attributes('.dds-popover-host > button'),panel:attributes('.dds-popover'),title:text('.dds-popover .row-between > b'),choice:slot('.dds-popover > .dds-choice')},
 'hover-card':{triggerLabel:text('.dds-popover-host > button'),trigger:attributes('.dds-popover-host > button'),panel:attributes('.dds-popover'),title:text('.dds-popover .row-between > b'),description:text('.dds-popover > p:not(.helper)'),metadata:text('.dds-popover > .helper')},
 snackbar:{message:text('[data-snack-message]'),undoLabel:text('[data-snack-undo]'),dismiss:attributes('[data-snack-close]'),showLabel:text('[data-snack-show]')},
 spinner:{status:attributes('[role="status"]'),label:text('.demo-row > span:last-child')},
 'fallback-view':{title:text('[data-fallback-title]'),description:text('[data-fallback-copy]'),retryLabel:text('[data-ext-retry]'),retry:attributes('[data-ext-retry]')},
 'push-badge':{button:attributes('.dds-push'),count:text('.dds-push > span'),status:text('[data-ext-status]')},
 'aspect-ratio':{media:attributes('.dds-ratio'),content:slot('.dds-ratio'),label:text('.dds-ratio-placeholder > span')},
 thumbnail:{image:attributes('.dds-thumbnail > img'),content:slot('.dds-thumbnail')},
 'play-badge':{button:attributes('.dds-play'),content:slot('.dds-play'),status:text('[data-ext-status]')},
 'avatar-group':{group:attributes('.dds-avatar-group'),avatars:slot('.dds-avatar-group'),description:text('.helper')},
 'list-card':{card:attributes('.dds-list-card'),image:slot('.dds-mini-image'),title:text('.dds-card-link'),link:attributes('.dds-card-link'),metadata:text('.dds-meta-secondary')},
 item:{list:attributes('.dds-items'),items:slot('.dds-items'),firstLink:attributes('.dds-items > li:first-child .dds-list-link'),firstTitle:text('.dds-items > li:first-child .dds-card-title'),firstMetadata:text('.dds-items > li:first-child .dds-meta-secondary'),firstStatus:text('.dds-items > li:first-child .dds-status > span'),firstLeading:slot('.dds-items > li:first-child .dds-list-leading'),firstMetadataContent:slot('.dds-items > li:first-child .dds-list-meta'),firstTrailingInfo:slot('.dds-items > li:first-child .dds-list-trailing-info'),firstActions:slot('.dds-items > li:first-child .dds-list-actions')},
 'section-header':{title:text('.dds-section-heading > span:first-child'),count:text('.dds-collection-count'),countAttributes:attributes('.dds-collection-count'),description:text('.dds-section-header-content > p'),actionLabel:text('.dds-section-header-action'),action:attributes('.dds-section-header-action')},
 attachment:{filename:text('.dds-attachment > div > b'),metadata:text('.dds-attachment .helper'),remove:attributes('[data-attachment-remove]'),restoreLabel:text('[data-attachment-restore]'),status:text('[data-ext-status]')},
 carousel:{carousel:attributes('.dds-carousel'),slide:slot('[data-carousel-slide]'),label:text('[data-carousel-slide] > .dds-ratio-placeholder > span'),title:text('[data-carousel-slide] > .dds-ratio-placeholder > b'),counter:text('[data-carousel-count]'),previous:attributes('[data-carousel-shift="-1"]'),next:attributes('[data-carousel-shift="1"]')},
 collapsible:{details:attributes('.dds-collapsible'),trigger:attributes('.dds-collapsible > summary'),firstDescription:text('.dds-collapsible > p:first-of-type'),secondDescription:text('.dds-collapsible > p:last-of-type')},
 separator:{before:text('.dds-demo > p:first-of-type'),after:text('.dds-demo > p:last-of-type'),rule:attributes('hr')},
 kbd:{firstKey:text('kbd:first-of-type'),lastKey:text('kbd:last-of-type'),description:text('.helper')},
 'scroll-area':{region:attributes('.dds-scroll'),items:slot('.dds-scroll > ul')},
 resizable:{panels:attributes('.dds-resizable'),firstTitle:text('.dds-resizable > section:first-of-type > b'),firstContent:text('.dds-resizable > section:first-of-type > p'),secondTitle:text('.dds-resizable > section:last-of-type > b'),secondContent:text('.dds-resizable > section:last-of-type > p'),handle:attributes('.dds-resize-handle')},
 direction:{forward:attributes('.dds-direction[dir="ltr"]'),forwardLabel:text('.dds-direction[dir="ltr"] > span'),forwardBrand:text('.dds-direction[dir="ltr"] > b'),reverse:attributes('.dds-direction[dir="rtl"]'),reverseLabel:text('.dds-direction[dir="rtl"] > span'),reverseBrand:text('.dds-direction[dir="rtl"] > b'),description:text('.helper')},
 bubble:{outgoing:text('.dds-bubble.outgoing'),incoming:text('.dds-bubble:not(.outgoing)')},
 message:{message:attributes('.dds-message'),avatar:slot('.dds-message > .avatar'),author:text('.dds-message-meta > b'),time:text('.dds-message-meta > time'),timeAttributes:attributes('.dds-message-meta > time'),body:text('.dds-message .dds-bubble'),status:text('[data-ext-status]')},
 marker:{label:text('.dds-marker > b')},
 'message-scroller':{region:attributes('[data-thread-log]'),messages:slot('[data-thread-log]'),addLabel:text('[data-thread-add]'),latestLabel:text('[data-thread-bottom]'),status:text('[data-thread-status]')}
};

export const extendedParts=Object.freeze(Object.fromEntries(Object.entries(parts).map(([id,definitions])=>[
 id,Object.freeze(Object.fromEntries(Object.entries({root:attributes('.dds-demo'),...definitions}).map(([name,definition])=>[name,Object.freeze(definition)])))
])));
