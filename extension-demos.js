import {icon} from './icons.js?v=b011fb4a3d820cd2';
import {renderExtended,calendarDays,renderExtendedMessage as message} from './ui/extended.js?v=b011fb4a3d820cd2';
export {renderExtended as extensionDemo};
const pad=n=>String(n).padStart(2,'0');
function renderCalendar(c,focusDate){const y=+c.dataset.year,m=+c.dataset.month;c.querySelector('[data-month-label]').textContent=`${y}년 ${m+1}월`;c.querySelector('[data-calendar-grid]').innerHTML=calendarDays(y,m,c.dataset.selected);if(focusDate){const b=c.querySelector(`[data-calendar-date="${focusDate}"]`);c.querySelectorAll('[data-calendar-date]').forEach(x=>x.tabIndex=x===b?0:-1);b?.focus();}}
function announce(node,text){const out=node.closest('.dds-demo')?.querySelector('[data-ext-status]');if(out)out.textContent=text;}
function closeMenus(){document.querySelectorAll('[data-ext-menu][aria-expanded=true]').forEach(t=>{t.setAttribute('aria-expanded','false');document.getElementById(t.dataset.extMenu).hidden=true;});}
function openMenu(t){
 closeMenus();const p=document.getElementById(t.dataset.extMenu);p.hidden=false;t.setAttribute('aria-expanded','true');
 const bounds=t.getBoundingClientRect(),edge=8;
 p.style.position='fixed';p.style.inset='auto';p.style.width=`${Math.min(180,innerWidth-edge*2)}px`;
 p.style.maxHeight=`${Math.max(44,innerHeight-edge*2)}px`;p.style.overflowY='auto';
 const menuBounds=p.getBoundingClientRect(),roomBelow=innerHeight-bounds.bottom-edge-6,roomAbove=bounds.top-edge-6;
 const below=roomBelow>=menuBounds.height||roomBelow>=roomAbove;
 const available=Math.max(44,below?roomBelow:roomAbove);
 p.style.maxHeight=`${Math.min(innerHeight-edge*2,available)}px`;
 const height=Math.min(menuBounds.height,available);
 p.style.left=`${Math.max(edge,Math.min(bounds.left,innerWidth-menuBounds.width-edge))}px`;
 p.style.top=`${Math.max(edge,Math.min(below?bounds.bottom+6:bounds.top-height-6,innerHeight-height-edge))}px`;
 p.querySelector('button')?.focus({preventScroll:true});
}
function dismissMenusOnLayoutChange(){
 const active=document.activeElement,unit=active?.closest('.dds-menu');
 const trigger=unit?.closest('.dds-menu-unit')?.querySelector('[data-ext-menu]');
 closeMenus();trigger?.focus({preventScroll:true});
}
window.addEventListener('resize',dismissMenusOnLayoutChange);
document.addEventListener('scroll',e=>{if(!e.target.closest?.('.dds-menu'))dismissMenusOnLayoutChange();},true);
const dialogOrigins=new WeakMap();
export function bindExtensions(){
 document.querySelectorAll('.dds-overlay').forEach(d=>{if(d.dataset.bound)return;d.dataset.bound='true';d.addEventListener('close',()=>dialogOrigins.get(d)?.focus());});
 document.querySelectorAll('[data-ext-form]').forEach(f=>{f.onsubmit=e=>{e.preventDefault();validate(f);};});
 document.querySelectorAll('[data-ext-questionnaire]').forEach(f=>f.onsubmit=e=>e.preventDefault());
 document.querySelectorAll('.dds-popover').forEach(p=>{if(p.dataset.bound)return;p.dataset.bound='true';p.addEventListener('toggle',e=>{const t=document.querySelector(`[data-ext-popover="${p.id}"]`);t?.setAttribute('aria-expanded',e.newState==='open');});});
 document.querySelectorAll('[data-ext-hover]').forEach(t=>{t.onpointerenter=()=>showPopover(t,false);t.onfocus=()=>showPopover(t,false);});
 document.querySelectorAll('.dds-menubar>.dds-menu-unit>.btn').forEach(t=>t.setAttribute('role','menuitem'));
 document.querySelectorAll('.dds-resize-handle').forEach(h=>{h.onpointerdown=e=>{h.setPointerCapture(e.pointerId);h.dataset.drag='true';};h.onpointermove=e=>{if(h.dataset.drag==='true'){const r=h.parentElement.getBoundingClientRect();resize(h,(e.clientX-r.left)/r.width*100);}};h.onpointerup=()=>delete h.dataset.drag;h.onlostpointercapture=()=>delete h.dataset.drag;});
}
function validate(f){const i=f.querySelector('input'),ok=i.validity.valid;f.querySelector('[data-field-error]').textContent=ok?'':'올바른 이메일 주소를 입력해 주세요.';i.setAttribute('aria-invalid',!ok);announce(i,ok?'입력 형식을 확인했습니다. 전송하지 않았습니다.':'');if(!ok)i.focus();}
function resize(h,n){n=Math.max(25,Math.min(75,Math.round(n)));h.setAttribute('aria-valuenow',n);h.parentElement.style.setProperty('--panel',n+'%');}
function showPopover(t,focus){const p=document.getElementById(t.dataset.extPopover);if(p.matches(':popover-open')){if(focus)p.querySelector('button,input')?.focus();return;}p.showPopover();const r=t.getBoundingClientRect(),w=p.offsetWidth,h=p.offsetHeight;p.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';p.style.top=Math.max(8,r.bottom+h+8>innerHeight?r.top-h-8:r.bottom+8)+'px';t.setAttribute('aria-expanded','true');if(focus)p.querySelector('button,input')?.focus();}
document.addEventListener('click',e=>{
 if(!e.target.closest('.dds-menu-unit'))closeMenus();
 const t=e.target.closest('button');if(!t)return;
 if(t.hasAttribute('data-ext-notice'))announce(t,t.dataset.extNotice);
 if(t.hasAttribute('data-ext-toggle')){const on=t.getAttribute('aria-pressed')!=='true';t.setAttribute('aria-pressed',on);announce(t,(t.getAttribute('aria-label')||t.textContent.trim())+(on?' 켜짐':' 꺼짐'));}
 if(t.hasAttribute('data-ext-filter')||t.hasAttribute('data-ext-filter-reset')){const p=t.closest('.dds-demo'),b=p.querySelector('[data-ext-filter]'),on=t.hasAttribute('data-ext-filter');b.querySelector('[data-filter-label]').textContent=on?'경력 3년 이상 · 1':'경력 전체';b.classList.toggle('dds-applied',on);p.querySelector('[data-ext-filter-result]').textContent=on?'경력 3년 이상 조건 적용':'전체 경력을 표시합니다.';}
 if(t.hasAttribute('data-ext-password')){const i=t.parentElement.querySelector('input'),show=i.type==='password';i.type=show?'text':'password';t.setAttribute('aria-pressed',show);t.setAttribute('aria-label',show?'비밀번호 숨기기':'비밀번호 표시');t.innerHTML=icon(show?'EyeOff':'Eye');}
 if(t.hasAttribute('data-ext-validate'))validate(t.closest('form'));
 if(t.hasAttribute('data-month-shift')){const c=t.closest('[data-ext-calendar]'),d=new Date(+c.dataset.year,+c.dataset.month+Number(t.dataset.monthShift),1);c.dataset.year=d.getFullYear();c.dataset.month=d.getMonth();renderCalendar(c);}
 if(t.hasAttribute('data-calendar-date')){const c=t.closest('[data-ext-calendar]');c.dataset.selected=t.dataset.calendarDate;c.querySelectorAll('[data-calendar-date]').forEach(b=>{b.setAttribute('aria-pressed',b===t);b.tabIndex=b===t?0:-1;});c.querySelector('[data-date-result]').textContent='선택: '+t.dataset.calendarDate;}
 if(t.hasAttribute('data-question-next')||t.hasAttribute('data-question-back')){const f=t.closest('form'),n=+(f.dataset.step||0),next=n+(t.hasAttribute('data-question-back')?-1:1);if(next>2){announce(t,'응답을 확인했습니다. 서버로 전송하지 않았습니다.');t.disabled=true;return;}f.dataset.step=next;f.querySelectorAll('[data-question]').forEach(p=>p.hidden=+p.dataset.question!==next);f.querySelector('[data-question-progress]').textContent=`${next+1} / 3 질문`;f.querySelector('[data-question-back]').disabled=next===0;const b=f.querySelector('[data-question-next]');b.disabled=false;b.textContent=next===2?'완료':'다음';f.querySelector(`[data-question="${next}"] input,[data-question="${next}"] textarea`)?.focus();}
 if(t.hasAttribute('data-ext-category')){const p=t.closest('.dds-demo');p.querySelectorAll('[data-ext-category]').forEach(b=>{b.setAttribute('aria-pressed',b===t);b.classList.toggle('selected',b===t);});p.querySelector('[data-category-result]').textContent=t.textContent+' 콘텐츠';}
 if(t.hasAttribute('data-page-shift')){const p=t.closest('[data-ext-pager]'),n=Math.max(1,Math.min(5,+(p.dataset.page||1)+Number(t.dataset.pageShift)));p.dataset.page=n;p.querySelector('output').textContent=`${n} / 5`;p.querySelector('[data-page-shift="-1"]').disabled=n===1;p.querySelector('[data-page-shift="1"]').disabled=n===5;}
 if(t.hasAttribute('data-ext-dot')){const p=t.parentElement;[...p.children].forEach(b=>b===t?b.setAttribute('aria-current','true'):b.removeAttribute('aria-current'));t.closest('.dds-demo').querySelector('[data-dot-result]').textContent=t.getAttribute('aria-label');}
 if(t.hasAttribute('data-ext-menu')){const open=t.getAttribute('aria-expanded')==='true';closeMenus();if(!open)openMenu(t);}
 if(t.hasAttribute('data-ext-command')){announce(t,t.dataset.extCommand+' 명령을 선택했습니다. (예제)');const origin=t.closest('.dds-menu-unit')?.querySelector('[data-ext-menu]');closeMenus();origin?.focus();}
 if(t.hasAttribute('data-ext-dialog')){const d=document.getElementById(t.dataset.extDialog);dialogOrigins.set(d,t);d.showModal();d.querySelector('[autofocus]')?.focus();}
 if(t.hasAttribute('data-ext-close')||t.hasAttribute('data-ext-confirm')){const d=t.closest('dialog'),o=dialogOrigins.get(d);d.close();if(o)announce(o,t.hasAttribute('data-ext-confirm')?'확인했습니다. 실제 데이터는 변경하지 않았습니다.':'취소했습니다.');}
 if(t.hasAttribute('data-ext-popover')){const p=document.getElementById(t.dataset.extPopover);if(p.matches(':popover-open')&&!t.hasAttribute('data-ext-hover'))p.hidePopover();else showPopover(t,true);}
 if(t.hasAttribute('data-popover-close')){document.getElementById(t.dataset.popoverClose).hidePopover();const origin=document.querySelector(`[data-ext-popover="${t.dataset.popoverClose}"]`);if(origin&&!origin.hasAttribute('data-ext-hover'))origin.focus();}
 if(t.hasAttribute('data-snack-undo')){t.closest('.dds-snackbar').querySelector('[data-snack-message]').textContent='보관을 되돌렸습니다.';t.disabled=true;}
 if(t.hasAttribute('data-snack-close'))t.closest('.dds-snackbar').hidden=true;
 if(t.hasAttribute('data-snack-show')){const s=t.closest('.dds-demo').querySelector('.dds-snackbar');s.hidden=false;s.querySelector('[data-snack-undo]').disabled=false;s.querySelector('[data-snack-message]').textContent='문서를 보관했습니다.';}
 if(t.hasAttribute('data-ext-retry')){const p=t.closest('.dds-fallback');p.querySelector('h3').textContent='다시 연결되었습니다';p.querySelector('[data-fallback-copy]').textContent='로컬 복구 상태 예제입니다.';t.disabled=true;}
 if(t.hasAttribute('data-attachment-remove')){t.closest('.dds-attachment').hidden=true;announce(t,'포트폴리오.pdf가 예제 목록에서 제거되었습니다.');t.closest('.dds-demo').querySelector('[data-attachment-restore]').focus();}
 if(t.hasAttribute('data-attachment-restore')){t.closest('.dds-demo').querySelector('.dds-attachment').hidden=false;announce(t,'예제 파일을 복원했습니다.');}
 if(t.hasAttribute('data-carousel-shift')){const p=t.closest('.dds-carousel'),n=Math.max(0,Math.min(2,+(p.dataset.slide||0)+Number(t.dataset.carouselShift)));p.dataset.slide=n;p.querySelector('[data-carousel-slide]').innerHTML=`<span class="eyebrow">CAREER GUIDE 0${n+1}</span><b>${['나의 경험을 발견하기','직무와 경험 연결하기','성과를 구체적으로 쓰기'][n]}</b>`;p.querySelector('output').textContent=`${n+1} / 3`;p.querySelector('[data-carousel-shift="-1"]').disabled=n===0;p.querySelector('[data-carousel-shift="1"]').disabled=n===2;}
 if(t.hasAttribute('data-thread-add')){const p=t.closest('[data-ext-thread]'),log=p.querySelector('[data-thread-log]'),follow=log.scrollHeight-log.scrollTop-log.clientHeight<24;log.insertAdjacentHTML('beforeend',message('새 피드백: 결과를 수치로 표현해 보세요.'));if(follow)log.scrollTop=log.scrollHeight;p.querySelector('[data-thread-status]').textContent=follow?'새 예제 메시지를 표시했습니다.':'새 메시지가 있습니다. 최신으로 이동할 수 있습니다.';}
 if(t.hasAttribute('data-thread-bottom')){const p=t.closest('[data-ext-thread]'),log=p.querySelector('[data-thread-log]');log.scrollTop=log.scrollHeight;p.querySelector('[data-thread-status]').textContent='최신 메시지';}
});

document.addEventListener('input',e=>{const t=e.target;if(t.matches('[data-ext-slider]')){t.style.setProperty('--value',t.value+'%');t.closest('.dds-demo').querySelector('output').textContent=t.value+'%';}if(t.matches('[data-ext-otp]')){t.value=t.value.replace(/\D/g,'').slice(0,6);t.closest('.dds-demo').querySelector('[data-otp-status]').textContent=t.value.length===6?'6자리 입력 완료 · 인증 요청 전':`${t.value.length} / 6자리 입력`;}if(t.matches('[data-ext-command-search]')){const p=t.closest('.dds-command');let count=0;p.querySelectorAll('[data-ext-command]').forEach(b=>{b.hidden=!b.textContent.includes(t.value);if(!b.hidden)count++;});p.querySelector('[data-command-empty]').hidden=count!==0;}});
document.addEventListener('change',e=>{const p=e.target.closest('[data-ext-time]');if(p){const values=[...p.querySelectorAll('select')].map(s=>s.value);p.querySelector('[data-time-result]').textContent=values.join(':')+' · Asia/Seoul (KST)';}});
document.addEventListener('contextmenu',e=>{const p=e.target.closest('[data-ext-context]');if(p){e.preventDefault();openMenu(p.querySelector('[data-ext-menu]'));}});
document.addEventListener('keydown',e=>{
 const t=e.target;
 if(e.key==='Escape'){const m=t.closest('.dds-menu-unit');closeMenus();m?.querySelector('[data-ext-menu]')?.focus();const d=t.closest('.dds-nav-details');if(d&&!d.closest('[data-dds-topnav]')){d.open=false;d.querySelector('summary').focus();}}
 if(e.shiftKey&&e.key==='F10'&&t.closest('[data-ext-context]')){e.preventDefault();openMenu(t.closest('[data-ext-context]').querySelector('[data-ext-menu]'));}
 if(t.matches('.dds-resize-handle')&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();resize(t,e.key==='Home'?25:e.key==='End'?75:+t.getAttribute('aria-valuenow')+(e.key==='ArrowRight'?5:-5));}
 if(t.matches('[data-calendar-date]')&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(e.key)){e.preventDefault();const c=t.closest('[data-ext-calendar]'),d=new Date(t.dataset.calendarDate+'T12:00:00');if(e.key==='PageUp'||e.key==='PageDown')d.setMonth(d.getMonth()+(e.key==='PageUp'?-1:1),1);else d.setDate(d.getDate()+({ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,Home:-d.getDay(),End:6-d.getDay()}[e.key]));c.dataset.year=d.getFullYear();c.dataset.month=d.getMonth();renderCalendar(c,`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`);}
 const menuRoot=t.closest('[role=menu],.dds-command');
 if(menuRoot&&['ArrowUp','ArrowDown','Home','End'].includes(e.key)&&!(t.matches('input')&&['Home','End'].includes(e.key))){
  const buttons=[...menuRoot.querySelectorAll(menuRoot.classList.contains('dds-command')?'[data-ext-command]:not([hidden])':'button:not([hidden])')];
  if(buttons.length){e.preventDefault();const i=buttons.indexOf(t),next=e.key==='Home'?0:e.key==='End'?buttons.length-1:i<0?(e.key==='ArrowUp'?buttons.length-1:0):(i+(e.key==='ArrowUp'?-1:1)+buttons.length)%buttons.length;buttons[next].focus();}
 }
 if(e.key==='Escape'&&t.closest('.dds-command'))t.closest('.dds-command').querySelector('input').focus();
 if(t.matches('[data-ext-menu]')&&['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();openMenu(t);}
 if(t.matches('.dds-menubar [data-ext-menu]')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const all=[...t.closest('.dds-menubar').querySelectorAll('[data-ext-menu]')];all[(all.indexOf(t)+(e.key==='ArrowRight'?1:-1)+all.length)%all.length].focus();}
});
