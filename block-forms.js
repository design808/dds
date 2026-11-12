import {icon} from './icons.js?v=c0b7fefa1c3d8659';
import {collectionCount,statusBadge} from './visibility.js?v=c0b7fefa1c3d8659';
import {renderExtended} from './ui/extended.js?v=c0b7fefa1c3d8659';
import {mountDDS} from './ui/index.js?v=c0b7fefa1c3d8659';

export const formBlocks = [
  {id:'login',title:'로그인',category:'account',description:'소셜 계정 또는 이메일 로그인과 비밀번호 찾기.',components:['input','button']},
  {id:'signup',title:'가입',category:'account',description:'이름·이메일·비밀번호 입력과 형식 확인.',components:['input','button']},
  {id:'notifications',title:'알림',category:'account',description:'전체·읽지 않은 알림과 읽음 표시.',components:['avatar','badge','tabs','button']},
  {id:'settings',title:'설정',category:'account',description:'프로필·일반·알림·보안·청구 정보 설정.',components:['sidebar','avatar','input','select','switch','radio','button']},
  {id:'header',title:'헤더',category:'marketing',description:'로고·주 메뉴·하위 메뉴와 언어·계정 도구.',components:['top-navigation','navigation-menu','button','avatar']},
  {id:'footer',title:'푸터',category:'marketing',description:'브랜드 정보와 네 열의 바로가기 링크.',components:['navigation-menu','text-button','separator']}
];

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const bindings = new WeakMap();
let sequence = 0;

function button(label,{variant='solid',color='primary',type='button',attrs='',image='',fullWidth=true,size='md',before=''}={}) {
  return `<button type="${type}" class="dds-button" data-variant="${variant}" data-color="${color}" data-full-width="${fullWidth}" data-control-size="${size}" ${attrs}><span class="dds-button-label">${before?icon(before):''}${image?`<img class="df-social-logo" src="${image}" width="18" height="18" alt="" aria-hidden="true">`:''}<span>${escapeHTML(label)}</span></span></button>`;
}

function field(prefix,name,label,{type='text',value='',autocomplete='off',placeholder='',minlength=0,hint=''}={}) {
  const id=`${prefix}-${name}`;
  return `<div class="field df-field" data-control-size="md"><label for="${id}">${escapeHTML(label)}</label><input id="${id}" name="${name}" type="${type}" value="${escapeHTML(value)}" placeholder="${escapeHTML(placeholder)}" autocomplete="${autocomplete}" ${type==='email'?'inputmode="email" autocapitalize="none" spellcheck="false"':''} ${minlength?`minlength="${minlength}"`:''} required data-df-validate data-df-label="${escapeHTML(label)}" aria-describedby="${hint?id+'-hint ':''}${id}-error">${hint?`<p class="df-field-hint" id="${id}-hint">${escapeHTML(hint)}</p>`:''}<p class="df-error" id="${id}-error" data-df-error hidden></p></div>`;
}

const feedback = () => '<p class="df-feedback" data-df-feedback role="status" aria-live="polite"></p>';
const textAction = (label,view) => `<button type="button" class="df-text-action" data-df-view="${view}">${escapeHTML(label)}</button>`;

function header(prefix,title,description='',showMark=true) {
  return `<header class="df-login-heading">${showMark?'<img class="df-login-mark" src="./assets/deepresume-mark.png" width="40" height="40" alt="딥레쥬메">':''}<h2 class="db-title" id="${prefix}-heading" tabindex="-1">${title}</h2>${description?`<p class="db-muted">${description}</p>`:''}</header>`;
}

function login(prefix,email) {
  return `${header(prefix,'환영합니다')}
    <div class="df-social-actions">
      ${button('Apple로 로그인',{variant:'outlined',color:'assistive',attrs:'data-df-provider="Apple"'})}
      ${button('Google로 로그인',{variant:'outlined',color:'assistive',attrs:'data-df-provider="Google"',image:'./assets/blocks/google-login.png'})}
    </div>
    <form class="df-auth-form" data-df-form="login" novalidate aria-labelledby="${prefix}-heading">
      ${field(prefix,'email','이메일',{type:'email',value:email,autocomplete:'username',placeholder:'name@company.com'})}
      <div class="field df-field" data-control-size="md"><div class="df-password-heading"><label for="${prefix}-password">비밀번호</label>${textAction('비밀번호를 잊으셨나요?','recover')}</div><input id="${prefix}-password" name="password" type="password" autocomplete="current-password" minlength="8" required data-df-validate data-df-label="비밀번호" aria-describedby="${prefix}-password-error"><p class="df-error" id="${prefix}-password-error" data-df-error hidden></p></div>
      ${button('로그인',{type:'submit'})}${feedback()}
    </form>
    <p class="df-auth-footer"><span>아직 계정이 없으신가요?</span>${textAction('가입하기','signup')}</p>`;
}

function recover(prefix,email) {
  return `${header(prefix,'비밀번호 찾기','계정에 등록한 이메일을 입력해 주세요.')}
    <form class="df-auth-form" data-df-form="recover" novalidate aria-labelledby="${prefix}-heading">
      ${field(prefix,'email','이메일',{type:'email',value:email,autocomplete:'email',placeholder:'name@company.com'})}
      ${button('이메일 확인',{type:'submit'})}${feedback()}
    </form><p class="df-auth-footer">${textAction('로그인으로 돌아가기','login')}</p>`;
}

function signup(prefix,email) {
  return `${header(prefix,'회원 가입','',false)}
    <form class="df-auth-form" data-df-form="signup" novalidate aria-labelledby="${prefix}-heading">
      ${field(prefix,'name','이름',{autocomplete:'name'})}
      ${field(prefix,'email','이메일',{type:'email',value:email,autocomplete:'email',placeholder:'name@company.com'})}
      ${field(prefix,'password','비밀번호',{type:'password',autocomplete:'new-password',minlength:8,hint:'8자 이상'})}
      ${field(prefix,'passwordConfirm','비밀번호 확인',{type:'password',autocomplete:'new-password',minlength:8})}
      ${button('가입하기',{type:'submit'})}${feedback()}
    </form><p class="df-auth-footer"><span>이미 계정이 있으신가요?</span>${textAction('로그인','login')}</p>`;
}

function social(prefix,email,provider) {
  return `${header(prefix,`${escapeHTML(provider)} 계정 선택`,'사용할 이메일을 입력해 주세요.')}
    <form class="df-auth-form" data-df-form="social" novalidate aria-labelledby="${prefix}-heading">
      ${field(prefix,'email','이메일',{type:'email',value:email,autocomplete:'email',placeholder:'name@company.com'})}
      ${button('이 이메일 사용',{type:'submit'})}${feedback()}
    </form><p class="df-auth-footer">${textAction('이메일로 로그인','login')}</p>`;
}

function sceneContent(prefix,state) {
  const content=state.view==='recover'?recover(prefix,state.email):state.view==='signup'?signup(prefix,state.email):state.view==='social'?social(prefix,state.email,state.provider):login(prefix,state.email);
  return `<div class="df-login-layout"><section class="df-login-panel" aria-labelledby="${prefix}-heading">${content}</section></div>`;
}

const noticeSeeds=[
  {id:'review',title:'검토 요청',description:'김민서님이 자기소개서 검토를 요청했어요.',time:'2분 전',avatar:'민',read:false},
  {id:'handoff',title:'자료 준비 완료',description:'이준호님이 면접 준비 자료를 공유했어요.',time:'18분 전',avatar:'준',read:false},
  {id:'check',title:'확인이 필요한 항목',description:'자기소개서에 입력하지 않은 항목이 있어요.',time:'42분 전',glyph:'TriangleAlert',tone:'warning',read:false},
  {id:'ready',title:'분석 완료',description:'면접 결과를 확인할 수 있어요.',time:'1시간 전',glyph:'CircleCheck',tone:'success',read:true},
  {id:'comment',title:'피드백 확인',description:'박지수님이 남긴 의견을 확인했어요.',time:'어제',avatar:'지',read:true}
];
const settingsTabs=[['general','일반','Settings2'],['profile','프로필','UserRound'],['notifications','알림','Bell'],['security','보안','ShieldCheck'],['billing','결제','CreditCard']];
const initialState=id=>({view:id==='signup'?'signup':'login',email:'',provider:'',notificationFilter:'all',notices:noticeSeeds.map(item=>({...item})),settingsTab:'profile',photo:'',settings:{name:'김민서',job:'프로덕트 디자이너',email:'minseo@example.com',workspace:'디자인팀',workspaceUrl:'design-team',language:'ko',timezone:'seoul',week:'monday',emailNotice:true,weeklyNotice:false,productNotice:true,newDevice:true,billingEmail:'billing@example.com',currency:'USD'}});

function notifications(prefix,state) {
  const unread=state.notices.filter(item=>!item.read).length,items=state.notices.filter(item=>state.notificationFilter==='all'||!item.read);
  return `<section class="df-notifications" aria-labelledby="${prefix}-heading"><header class="df-notifications-header"><div class="db-inline"><h2 class="db-section-title" id="${prefix}-heading">알림</h2>${collectionCount(unread,{label:'읽지 않은 알림',unit:''})}</div><div class="df-notification-toolbar"><div class="segmented" role="tablist" aria-label="알림 필터">${[['all','전체'],['unread','읽지 않음']].map(([value,label])=>`<button type="button" role="tab" id="${prefix}-filter-${value}" aria-controls="${prefix}-list" aria-selected="${state.notificationFilter===value}" tabindex="${state.notificationFilter===value?0:-1}" data-df-notification-filter="${value}">${label}</button>`).join('')}</div><button type="button" class="df-text-action" data-df-read-all ${unread?'':'disabled'}>모두 읽음으로 표시</button></div></header><div id="${prefix}-list" role="tabpanel" aria-labelledby="${prefix}-filter-${state.notificationFilter}"><ul class="df-notification-list">${items.map(item=>`<li><button type="button" class="df-notice${item.read?' is-read':''}" data-df-notice="${item.id}" aria-label="${item.title}${item.read?', 읽음':', 읽지 않음'}">${item.avatar?`<span class="avatar df-notice-avatar" aria-hidden="true">${item.avatar}</span>`:`<span class="df-notice-glyph" data-tone="${item.tone}" aria-hidden="true">${icon(item.glyph)}</span>`}<span class="df-notice-copy"><span class="df-notice-title">${item.title}${item.read?'':'<span class="df-notice-dot" aria-hidden="true"></span>'}</span><span class="df-notice-description">${item.description}</span></span><span class="dds-meta-date">${item.time}</span></button></li>`).join('')}</ul>${items.length?'':'<p class="df-notification-empty">읽지 않은 알림이 없습니다.</p>'}</div><span class="sr-only" data-df-notice-status role="status"></span></section>`;
}

function settingField(prefix,key,label,state,{type='text',readonly=false,hint=''}={}) {
  const id=`${prefix}-${key}`;
  return `<div class="field df-field" data-control-size="md"><label for="${id}">${label}</label><input id="${id}" type="${type}" name="${key}" value="${escapeHTML(state.settings[key])}" data-df-setting="${key}" ${readonly?'readonly':''} ${hint?`aria-describedby="${id}-hint"`:''}>${hint?`<p class="df-field-hint" id="${id}-hint">${hint}</p>`:''}</div>`;
}
function settingSelect(prefix,key,label,values,state) {
  return `<div class="field df-field" data-control-size="md"><label for="${prefix}-${key}">${label}</label><select id="${prefix}-${key}" name="${key}" data-df-setting="${key}">${values.map(([value,text])=>`<option value="${value}" ${state.settings[key]===value?'selected':''}>${text}</option>`).join('')}</select></div>`;
}
function settingSwitch(prefix,key,label,state) {
  return `<label class="switch-label df-setting-switch"><span>${label}</span><input id="${prefix}-${key}" type="checkbox" role="switch" aria-label="${label}" data-df-setting="${key}" ${state.settings[key]?'checked':''}><span class="switch-track" aria-hidden="true"></span></label>`;
}
const timezones=[['seoul','서울 (GMT+9)'],['lisbon','리스본 (GMT+1)'],['london','런던 (GMT+0)'],['newyork','뉴욕 (GMT-5)']];

function settingsContent(prefix,state) {
  const tab=state.settingsTab;
  if(tab==='general')return `<div class="df-settings-fields">${settingField(prefix,'workspace','워크스페이스 이름',state)}${settingField(prefix,'workspaceUrl','워크스페이스 URL',state,{hint:'주소를 바꾸면 연결된 링크를 함께 확인해 주세요.'})}${settingSelect(prefix,'language','언어',[['ko','한국어'],['en-gb','English (UK)'],['en-us','English (US)']],state)}${settingSelect(prefix,'timezone','시간대',timezones,state)}<fieldset class="df-week-start"><legend>주 시작일</legend>${[['monday','월요일'],['sunday','일요일']].map(([value,label])=>`<label><input type="radio" name="${prefix}-week" data-df-setting="week" value="${value}" ${state.settings.week===value?'checked':''}><span>${label}</span></label>`).join('')}</fieldset></div>`;
  if(tab==='notifications')return `<div class="df-setting-switches">${settingSwitch(prefix,'emailNotice','이메일 알림',state)}${settingSwitch(prefix,'weeklyNotice','주간 요약',state)}${settingSwitch(prefix,'productNotice','제품 업데이트',state)}</div>`;
  if(tab==='security')return `<div class="df-settings-fields">${settingSwitch(prefix,'newDevice','새 기기 로그인 알림',state)}<div class="df-settings-session"><div><p>Chrome · 현재 브라우저</p><span class="dds-meta-secondary">현재 세션</span></div>${statusBadge('complete','활성',icon)}</div></div>`;
  if(tab==='billing')return `<div class="df-settings-fields"><div class="df-settings-plan"><div><strong>팀 요금제</strong><p class="dds-meta-secondary">사용자 5명</p></div><strong>$49 <span class="dds-meta-secondary">/ 월</span></strong></div>${settingField(prefix,'billingEmail','청구 이메일',state,{type:'email'})}${settingSelect(prefix,'currency','통화',[['USD','USD'],['KRW','KRW'],['EUR','EUR']],state)}</div>`;
  return `<div class="df-settings-fields"><div class="df-profile-row"><span class="avatar df-profile-avatar">${state.photo?`<img src="${state.photo}" alt="프로필 사진">`:'민'}</span><div class="df-profile-copy"><p>${escapeHTML(state.settings.name)}</p><p class="dds-meta-secondary">${escapeHTML(state.settings.job)} · ${escapeHTML(state.settings.workspace)}</p><div class="db-inline">${button('사진 변경',{variant:'outlined',color:'assistive',size:'sm',fullWidth:false,before:'Upload',attrs:'data-df-photo-pick'})}${button('삭제',{variant:'outlined',color:'assistive',size:'sm',fullWidth:false,attrs:`data-df-photo-remove ${state.photo?'':'disabled'}`})}</div></div><input type="file" accept="image/*" data-custom="true" data-df-photo hidden aria-label="프로필 사진 선택"></div><div class="db-fields">${settingField(prefix,'name','이름',state)}${settingField(prefix,'job','직무',state)}</div>${settingField(prefix,'email','이메일',state,{type:'email',readonly:true})}${settingSelect(prefix,'timezone','시간대',timezones,state)}</div>`;
}
function settings(prefix,state) {
  const current=settingsTabs.find(([id])=>id===state.settingsTab);
  return `<section class="df-settings-layout"><nav class="df-settings-nav" aria-label="설정 메뉴">${settingsTabs.map(([id,label,glyph])=>`<button type="button" class="dds-nav-link dds-nav-control" id="${prefix}-nav-${id}" data-df-settings-tab="${id}" aria-controls="${prefix}-settings-panel" ${state.settingsTab===id?'aria-current="page"':''}>${icon(glyph)}<span>${label}</span></button>`).join('')}</nav><section class="df-settings-content" id="${prefix}-settings-panel" aria-labelledby="${prefix}-nav-${state.settingsTab}"><h3 class="db-section-title" tabindex="-1">${current[1]}</h3>${settingsContent(prefix,state)}${feedback()}</section></section>`;
}

function headerBlock(prefix){return '<div class="dds-ui" data-dds-component="top-navigation">'+renderExtended('top-navigation',prefix)+'</div>';}
const footerGroups=[
  ['둘러보기',[['살펴보기','#/'],['색상','#/foundations/color'],['컴포넌트','#/components'],['블록','#/blocks']]],
  ['리소스',[['타이포그래피','#/foundations/typography'],['아이콘','#/foundations/icons'],['AI로 적용하기','#/setup'],['개발 적용 안내','#/handoff']]],
  ['안내',[['디자인 원칙','#/principles'],['디자인 프로세스','#/process'],['디자인 시스템 안내','./design-system-guide.html']]],
  ['서비스',[['딥레쥬메','./prototypes/home-independent.html'],['자기소개서','./prototypes/coverletter-info.html'],['이력서','./prototypes/resume-write.html'],['AI 면접','./prototypes/interview-setup.html'],['내 작업 공간','./prototypes/mypage.html']]]
];
function footerBlock(prefix) {
  return `<footer class="df-product-footer"><div class="df-footer-upper"><div class="df-footer-brand"><img src="./assets/deepresume-mark.png" width="40" height="40" alt="딥레쥬메"><p>Deep Design System</p><p>© ${new Date().getFullYear()} PENa Labs.</p></div><nav class="df-footer-groups" aria-label="하단 메뉴">${footerGroups.map(([label,links],index)=>`<section aria-labelledby="${prefix}-footer-${index}"><h3 id="${prefix}-footer-${index}">${label}</h3><ul>${links.map(([text,href])=>`<li><a href="${href}">${text}</a></li>`).join('')}</ul></section>`).join('')}</nav><a class="df-footer-contact" href="#/handoff">적용 방법${icon('ArrowUpRight')}</a></div></footer>`;
}
function renderScene(id,prefix,state) {
  return id==='notifications'?notifications(prefix,state):id==='settings'?settings(prefix,state):id==='header'?headerBlock(prefix,state):id==='footer'?footerBlock(prefix):sceneContent(prefix,state);
}

export function renderFormBlock(id,uid) {
  if(!formBlocks.some(block=>block.id===id))return '';
  const prefix=`fb-${String(uid||`scene-${++sequence}`).replace(/[^a-zA-Z0-9_-]/g,'-')}-${id}`;
  return `<div class="df-scene" data-form-block="${id}" data-form-block-uid="${prefix}">${renderScene(id,prefix,initialState(id))}</div>`;
}

export function bindFormBlocks(root) {
  if(!root?.querySelectorAll||!root?.addEventListener)return ()=>{};
  bindings.get(root)?.();
  const controller=new AbortController(),options={signal:controller.signal},states=new WeakMap(),photoURLs=new Set();
  const sceneOf=target=>{const scene=target?.closest?.('[data-form-block]');return scene&&(scene===root||root.contains(scene))?scene:null;};
  const stateOf=scene=>{if(!states.has(scene))states.set(scene,initialState(scene.dataset.formBlock));return states.get(scene);};
  const redraw=(scene,focusSelector='')=>{
    scene.innerHTML=renderScene(scene.dataset.formBlock,scene.dataset.formBlockUid,stateOf(scene));
    if(focusSelector)scene.querySelector(focusSelector)?.focus({preventScroll:true});
  };
  const headerScenes=[...(root.matches?.('[data-form-block="header"]')?[root]:[]),...root.querySelectorAll('[data-form-block="header"]')];
  const headerControllers=headerScenes.map(scene=>mountDDS(scene,{controls:false,charts:false,tooltips:false}));
  const fieldMessage=field=>{
    const value=field.value.trim();
    if(!value){
      const label=field.dataset.dfLabel,last=label.charCodeAt(label.length-1);
      const particle=last>=0xAC00&&last<=0xD7A3&&(last-0xAC00)%28===0?'를':'을';
      return `${label}${particle} 입력해 주세요.`;
    }
    if(field.type==='email'&&field.validity.typeMismatch)return '이메일 주소의 형식을 확인해 주세요.';
    if(field.minLength>0&&value.length<field.minLength)return `${field.minLength}자 이상 입력해 주세요.`;
    if(field.name==='passwordConfirm'&&field.value!==field.form.elements.namedItem('password').value)return '비밀번호가 일치하지 않습니다.';
    return '';
  };
  const markField=field=>{
    const message=fieldMessage(field),error=field.closest('.df-field').querySelector('[data-df-error]');
    field.setAttribute('aria-invalid',String(Boolean(message)));error.textContent=message;error.hidden=!message;
    return !message;
  };
  const changeView=(scene,view,provider='')=>{
    const state=stateOf(scene),email=scene.querySelector('[name="email"]');
    if(email)state.email=email.value.trim();
    state.view=view;state.provider=provider;
    redraw(scene,'h2');
  };
  root.addEventListener('click',event=>{
    const scene=sceneOf(event.target),control=event.target.closest?.('button');
    if(!scene||!control||control.disabled)return;
    const state=stateOf(scene);
    if(control.hasAttribute('data-df-view'))changeView(scene,control.dataset.dfView);
    else if(control.hasAttribute('data-df-provider'))changeView(scene,'social',control.dataset.dfProvider);
    else if(control.hasAttribute('data-df-notification-filter')){
      state.notificationFilter=control.dataset.dfNotificationFilter;redraw(scene,`[data-df-notification-filter="${state.notificationFilter}"]`);
    }else if(control.hasAttribute('data-df-read-all')){
      state.notices.forEach(item=>{item.read=true;});redraw(scene,`[data-df-notification-filter="${state.notificationFilter}"]`);scene.querySelector('[data-df-notice-status]').textContent='모든 알림을 읽음으로 표시했습니다.';
    }else if(control.hasAttribute('data-df-notice')){
      const item=state.notices.find(item=>item.id===control.dataset.dfNotice);if(item)item.read=true;
      redraw(scene,state.notificationFilter==='all'?`[data-df-notice="${control.dataset.dfNotice}"]`:'[data-df-notification-filter="unread"]');scene.querySelector('[data-df-notice-status]').textContent='알림을 읽음으로 표시했습니다.';
    }else if(control.hasAttribute('data-df-settings-tab')){
      state.settingsTab=control.dataset.dfSettingsTab;redraw(scene,'.df-settings-content h3');
    }else if(control.hasAttribute('data-df-photo-pick'))scene.querySelector('[data-df-photo]').click();
    else if(control.hasAttribute('data-df-photo-remove')){
      if(state.photo){URL.revokeObjectURL(state.photo);photoURLs.delete(state.photo);state.photo='';}redraw(scene,'[data-df-photo-pick]');
    }
  },options);
  const update=event=>{
    const scene=sceneOf(event.target);if(!scene)return;
    const field=event.target;
    if(field.matches('[data-df-setting]')){
      stateOf(scene).settings[field.dataset.dfSetting]=field.type==='checkbox'?field.checked:field.value;
      if(field.dataset.dfSetting==='name')scene.querySelector('.df-profile-copy>p').textContent=field.value;
      if(field.dataset.dfSetting==='job')scene.querySelector('.df-profile-copy>.dds-meta-secondary').textContent=field.value+' · '+stateOf(scene).settings.workspace;
    }
    if(field.matches('[data-df-validate][aria-invalid="true"]'))markField(field);
    if(field.name==='password'){
      const confirm=field.form?.elements.namedItem('passwordConfirm');
      if(confirm?.getAttribute('aria-invalid')==='true')markField(confirm);
    }
    const message=scene.querySelector('[data-df-feedback]');if(message)message.textContent='';
  };
  root.addEventListener('input',update,options);
  root.addEventListener('change',event=>{
    update(event);
    const scene=sceneOf(event.target);if(!scene||!event.target.matches('[data-df-photo]'))return;
    const file=event.target.files?.[0];if(!file)return;
    if(!file.type.startsWith('image/')||file.size>5*1024*1024){scene.querySelector('[data-df-feedback]').textContent='5MB 이하의 이미지 파일을 선택해 주세요.';return;}
    const state=stateOf(scene);if(state.photo){URL.revokeObjectURL(state.photo);photoURLs.delete(state.photo);}
    state.photo=URL.createObjectURL(file);photoURLs.add(state.photo);redraw(scene,'[data-df-photo-pick]');
  },options);
  root.addEventListener('keydown',event=>{
    const scene=sceneOf(event.target);if(!scene)return;
    const tab=event.target.closest('[data-df-notification-filter]');
    if(tab&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();event.stopPropagation();const next=event.key==='Home'?'all':event.key==='End'?'unread':tab.dataset.dfNotificationFilter==='all'?'unread':'all';stateOf(scene).notificationFilter=next;redraw(scene,`[data-df-notification-filter="${next}"]`);return;
    }
  },options);
  root.addEventListener('submit',event=>{
    const form=event.target.closest('[data-df-form]'),scene=sceneOf(form);if(!form||!scene)return;
    event.preventDefault();
    const fields=[...form.querySelectorAll('[data-df-validate]')];fields.forEach(markField);
    const invalid=fields.find(field=>field.getAttribute('aria-invalid')==='true');
    if(invalid){invalid.focus({preventScroll:true});return;}
    const state=stateOf(scene);state.email=form.elements.namedItem('email').value.trim();
    const result=form.querySelector('[data-df-feedback]');
    if(form.dataset.dfForm==='login')result.textContent='이메일과 비밀번호의 입력 형식이 올바릅니다.';
    else if(form.dataset.dfForm==='recover')result.textContent='이메일 주소의 입력 형식이 올바릅니다.';
    else if(form.dataset.dfForm==='signup')result.textContent='이름·이메일·비밀번호의 입력 형식이 올바릅니다.';
    else result.textContent=`사용할 이메일로 ${state.email} 주소를 선택했습니다.`;
  },options);
  const cleanup=()=>{controller.abort();for(const stop of headerControllers)stop();for(const url of photoURLs)URL.revokeObjectURL(url);photoURLs.clear();if(bindings.get(root)===cleanup)bindings.delete(root);};
  bindings.set(root,cleanup);
  return cleanup;
}
