import {icon} from './icons.js?v=3ea17f0ff21b92cc';
// Progressive enhancement: retain form values/events; replace browser-drawn controls.
const svg=name=>icon(name==='chevron'?'down':name);
const el=(tag,cls)=>{const x=document.createElement(tag);x.className=cls;return x;};
let serial=0,opened;
const labelOf=x=>x.getAttribute('aria-label')||x.labels?.[0]?.textContent.trim()||'옵션';
const resetControls=new WeakMap();
const controlStateAttributes=['disabled','readonly','required','aria-required','aria-readonly','aria-label','aria-labelledby','aria-describedby','aria-errormessage','aria-invalid'];
const unavailable=input=>input.matches(':disabled')||input.readOnly;
function copyControlState(native,target,field=false){
 const attributes=field?['aria-labelledby','aria-describedby','aria-errormessage','aria-invalid','aria-required','aria-readonly']:['aria-describedby','aria-errormessage'];
 for(const name of attributes){
  const value=native.getAttribute(name);if(value===null)target.removeAttribute(name);else target.setAttribute(name,value);
 }
 if(field&&native.required)target.setAttribute('aria-required','true');
 if(field&&native.readOnly)target.setAttribute('aria-readonly','true');
 target.disabled=unavailable(native);
}
function watchControl(native,sync,{reset=sync,subtree=false,attributes=[]}={}){
 resetControls.set(native,reset);
 const observer=new MutationObserver(sync);
 observer.observe(native,{attributes:true,attributeFilter:[...controlStateAttributes,...attributes],childList:subtree,subtree,characterData:subtree});
 // Disabled fieldsets also disable native descendants without changing their own attributes.
 for(let parent=native.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='FIELDSET')observer.observe(parent,{attributes:true,attributeFilter:['disabled']});
 sync();
}
function close(restore=false){if(!opened)return;const old=opened;opened=null;old.popup.remove();old.trigger.setAttribute('aria-expanded','false');old.trigger.removeAttribute('aria-activedescendant');if(restore&&old.trigger.isConnected)old.trigger.focus();}
function position(){
 if(!opened)return;const {trigger,popup}=opened;
 const r=trigger.closest('.custom-control')?.getBoundingClientRect()||trigger.getBoundingClientRect(),view=window.visualViewport;
 const left=view?.offsetLeft||0,top=view?.offsetTop||0,w=view?.width||innerWidth,h=view?.height||innerHeight;
 const width=Math.min(Math.max(r.width,popup.classList.contains('calendar-popup')?308:200),Math.max(0,w-24));
 popup.style.width=width+'px';popup.style.left=Math.max(left+12,Math.min(r.left,left+w-width-12))+'px';
 const down=top+h-r.bottom-18,up=r.top-top-18,desired=Math.min(popup.scrollHeight,352,h-24);
 const below=down>=Math.min(desired,240)||down>=up;
 const available=Math.max(0,below?down:up),height=Math.min(352,h-24,available);
 popup.style.maxHeight=Math.max(0,height)+'px';
 const renderedHeight=Math.min(desired,height);
 popup.style.top=Math.max(top+12,Math.min(below?r.bottom+6:r.top-renderedHeight-6,top+h-renderedHeight-12))+'px';
}
const sizeProperties=['height','type-role','font-size','line-height','font-weight','tracking','padding-inline','gap','icon-size'];
function show(trigger,kind,label){close();const popup=el('div','control-popup '+kind);popup.id='control-popup-'+(++serial);popup.setAttribute('role',kind==='calendar-popup'?'dialog':'listbox');popup.setAttribute('aria-label',label);const computed=getComputedStyle(trigger);for(const property of sizeProperties)popup.style.setProperty('--control-'+property,computed.getPropertyValue('--control-'+property));(trigger.closest('dialog')||document.body).append(popup);trigger.setAttribute('aria-controls',popup.id);trigger.setAttribute('aria-expanded','true');opened={trigger,popup};return popup;}
function copyControlLayout(native,wrap){for(const name of ['data-control-size','data-control-width'])if(native.hasAttribute(name))wrap.setAttribute(name,native.getAttribute(name));}
function optionList(trigger,options,selected,onPick,searchable=false){
 const popup=show(trigger,'select-popup',labelOf(trigger));let active=-1;
 const rows=options.map((o,i)=>{const b=el('button','custom-option');b.type='button';b.id=popup.id+'-'+i;b.setAttribute('role','option');b.setAttribute('aria-selected',String(o.value===selected));b.disabled=!!o.disabled;b.tabIndex=-1;const text=el('span','');text.textContent=o.label;b.append(text);if(o.value===selected)b.insertAdjacentHTML('beforeend',svg('check'));b.onclick=()=>{onPick(o.value);close();trigger.focus();};popup.append(b);return b;});
 if(!rows.length){const msg=el('p','helper');msg.textContent='검색 결과가 없습니다.';popup.append(msg);}
 const enabled=()=>rows.map((x,i)=>!x.disabled?i:-1).filter(i=>i>=0);
 const activate=i=>{if(!rows[i]||rows[i].disabled)return;active=i;rows.forEach((x,n)=>x.classList.toggle('highlighted',i===n));trigger.setAttribute('aria-activedescendant',rows[i].id);rows[i].scrollIntoView({block:'nearest'});if(!searchable)rows[i].focus();};
 let typed='',timer;
 const keys=e=>{if(e.isComposing||e.keyCode===229)return;const valid=enabled();if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const at=valid.indexOf(active);activate(e.key==='Home'?valid[0]:e.key==='End'?valid.at(-1):at<0?(e.key==='ArrowDown'?valid[0]:valid.at(-1)):valid[(at+(e.key==='ArrowDown'?1:-1)+valid.length)%valid.length]);}else if(e.key==='Enter'&&active>=0){e.preventDefault();rows[active].click();}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close(true);}else if(e.key==='Tab'){close(true);}else if(!searchable&&e.key.length===1&&!e.ctrlKey&&!e.metaKey){typed+=e.key.toLowerCase();clearTimeout(timer);timer=setTimeout(()=>typed='',600);activate(options.findIndex((x,i)=>!rows[i].disabled&&x.label.toLowerCase().startsWith(typed)));}};
 popup.onkeydown=keys;opened.keys=keys;position();if(!searchable){const selectedIndex=rows.findIndex(x=>x.getAttribute('aria-selected')==='true'&&!x.disabled);activate(selectedIndex>=0?selectedIndex:enabled()[0]);}
}
function selectControl(native){
 native.dataset.custom='true';const wrap=el('div','custom-control custom-select');copyControlLayout(native,wrap);native.before(wrap);wrap.append(native);const trigger=el('button','custom-trigger');trigger.type='button';trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label',labelOf(native));trigger.disabled=native.disabled;
 if(native.id){trigger.id=native.id;native.id+='-native';}native.hidden=true;native.tabIndex=-1;wrap.append(trigger);
 const measure=el('span','custom-select-measure');measure.setAttribute('aria-hidden','true');wrap.append(measure);
 const originalLabel=trigger.getAttribute('aria-label');
 const sync=()=>{trigger.replaceChildren();const text=el('span','');text.textContent=native.selectedOptions[0]?.textContent||'선택해 주세요';trigger.append(text);trigger.insertAdjacentHTML('beforeend',svg('chevron'));copyControlState(native,trigger,true);trigger.setAttribute('aria-label',native.getAttribute('aria-label')||trigger.labels?.[0]?.textContent.trim()||originalLabel);measure.replaceChildren(...[...native.options].map(option=>{const label=el('span','');label.textContent=option.textContent;return label;}));if(trigger.disabled&&opened?.trigger===trigger)close();};native.addEventListener('change',sync);
 watchControl(native,sync,{subtree:true,attributes:['selected','label'],reset:()=>{if(opened?.trigger===trigger)close();sync();}});
 const open=()=>{if(trigger.disabled)return;optionList(trigger,[...native.options].map(o=>({value:o.value,label:o.textContent,disabled:o.disabled||o.parentElement?.tagName==='OPTGROUP'&&o.parentElement.disabled})),native.value,value=>{native.value=value;native.dispatchEvent(new Event('change',{bubbles:true}));});};
 trigger.onclick=()=>opened?.trigger===trigger?close():open();trigger.onkeydown=e=>{if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();open();}};
}
function comboControl(input){
 input.dataset.custom='true';const data=document.getElementById(input.getAttribute('list'));const options=[...(data?.options||[])].map(o=>({value:o.value,label:o.label||o.value}));input.removeAttribute('list');input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-haspopup','listbox');input.setAttribute('aria-expanded','false');input.autocomplete='off';
 const wrap=el('div','custom-control custom-combo');copyControlLayout(input,wrap);input.before(wrap);wrap.append(input);const toggle=el('button','control-icon');toggle.type='button';toggle.innerHTML=svg('chevron');toggle.setAttribute('aria-label',labelOf(input)+' 선택지 열기');wrap.append(toggle);
 const sync=()=>{copyControlState(input,toggle);toggle.setAttribute('aria-label',labelOf(input)+' 선택지 열기');if(toggle.disabled&&opened?.trigger===input)close();};
 watchControl(input,sync,{reset:()=>{if(opened?.trigger===input)close();sync();}});
 const open=(all=false)=>{if(unavailable(input))return;optionList(input,options.filter(o=>all||o.label.toLowerCase().includes(input.value.toLowerCase())),input.value,v=>{input.value=v;input.dispatchEvent(new Event('change',{bubbles:true}));},true);input.focus();};
 toggle.onclick=()=>opened?.trigger===input?close():open(true);input.addEventListener('input',e=>{if(!e.isComposing)open();});input.addEventListener('compositionend',()=>open());input.addEventListener('keydown',e=>{if(e.isComposing||e.keyCode===229)return;if(opened?.trigger===input){opened.keys(e);}else if(e.key==='ArrowDown'&&!unavailable(input)){e.preventDefault();open(true);}});
}
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parse=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return null;const [y,m,d]=v.split('-').map(Number),x=new Date(y,m-1,d);return iso(x)===v?x:null;};
const dateDigits=value=>value.normalize('NFKC').replace(/\D/g,'');
function formatDateInput(input){
 const raw=input.value,digits=dateDigits(raw).slice(0,8);
 const formatted=digits.slice(0,4)+(digits.length>4?'-'+digits.slice(4,6):'')+(digits.length>6?'-'+digits.slice(6,8):'');
 if(raw===formatted)return;
 // Keep the caret next to the same digit when separators are inserted/removed.
 const caret=position=>{const n=Math.min(8,dateDigits(raw.slice(0,position)).length);return Math.min(formatted.length,n+(n>4?1:0)+(n>6?1:0));};
 const start=caret(input.selectionStart??raw.length),end=caret(input.selectionEnd??raw.length);
 input.value=formatted;input.setSelectionRange(start,end);
}
function dateControl(input){
 // Ten display characters = eight digits + two automatically inserted separators.
 input.dataset.custom='true';const name=labelOf(input),min=input.min,max=input.max;input.type='text';input.inputMode='numeric';input.placeholder='YYYY-MM-DD';input.pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}';input.maxLength=10;input.autocomplete='off';
 const wrap=el('div','custom-control custom-date');copyControlLayout(input,wrap);input.before(wrap);wrap.append(input);const button=el('button','control-icon');button.type='button';button.innerHTML=svg('calendar');button.setAttribute('aria-label',name+' 달력 열기');button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');button.disabled=input.disabled||input.readOnly;wrap.append(button);
 const hint=el('span','sr-only');hint.id='date-hint-'+(++serial);hint.textContent='연도 네 자리, 월 두 자리, 일 두 자리의 숫자 8자리를 입력하세요. 20260916을 입력하면 2026-09-16으로 표시됩니다. 아래 방향키로 달력을 열 수 있습니다.';wrap.append(hint);input.setAttribute('aria-describedby',((input.getAttribute('aria-describedby')||'')+' '+hint.id).trim());
 const sync=()=>{copyControlState(input,button);button.setAttribute('aria-label',labelOf(input)+' 달력 열기');if(button.disabled&&opened?.trigger===button)close();};
 watchControl(input,sync,{reset:()=>{if(opened?.trigger===button)close();input.setCustomValidity('');input.removeAttribute('aria-invalid');sync();}});
 const valid=v=>!v||(!!parse(v)&&(!min||v>=min)&&(!max||v<=max));
 input.addEventListener('beforeinput',event=>{
  if(event.isComposing||input.selectionStart!==input.selectionEnd)return;
  const caret=input.selectionStart;
  // Delete the adjacent digit as well, so Backspace/Delete never gets stuck on a dash.
  if(event.inputType==='deleteContentBackward'&&input.value[caret-1]==='-')input.setSelectionRange(caret-2,caret);
  if(event.inputType==='deleteContentForward'&&input.value[caret]==='-')input.setSelectionRange(caret,caret+2);
 });
 input.addEventListener('paste',event=>{
  if(!event.clipboardData||input.disabled||input.readOnly)return;
  event.preventDefault();
  // Normalize before the browser's ten-character display limit can truncate a pasted date.
  input.setRangeText(dateDigits(event.clipboardData.getData('text')).slice(0,8),input.selectionStart,input.selectionEnd,'end');
  input.dispatchEvent(new Event('input',{bubbles:true}));
 });
 input.addEventListener('input',event=>{
  if(event.isComposing)return;
  formatDateInput(input);const ok=valid(input.value);
  input.setCustomValidity(ok?'':'숫자 8자리로 올바른 날짜를 입력하고 허용 범위를 확인해 주세요.');input.setAttribute('aria-invalid',String(!ok));
 });
 input.addEventListener('compositionend',()=>input.dispatchEvent(new Event('input',{bubbles:true})));
 const open=()=>{
  if(unavailable(input))return;let cursor=parse(input.value)||new Date();if(min&&iso(cursor)<min)cursor=parse(min);if(max&&iso(cursor)>max)cursor=parse(max);let month=new Date(cursor.getFullYear(),cursor.getMonth(),1);const popup=show(button,'calendar-popup',name+' 날짜 선택');
  const pick=d=>{input.value=iso(d);input.setCustomValidity('');input.removeAttribute('aria-invalid');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));close(true);};
  const moveMonth=n=>{month=new Date(month.getFullYear(),month.getMonth()+n,1);cursor=new Date(month.getFullYear(),month.getMonth(),Math.min(cursor.getDate(),new Date(month.getFullYear(),month.getMonth()+1,0).getDate()));render(true);};
  const render=(focus=false)=>{
   popup.replaceChildren();const head=el('div','calendar-head');const prev=el('button','control-icon calendar-nav'),next=el('button','control-icon calendar-nav'),title=el('b','');prev.type=next.type='button';prev.innerHTML=svg('left');next.innerHTML=svg('right');prev.setAttribute('aria-label','이전 달');next.setAttribute('aria-label','다음 달');title.textContent=`${month.getFullYear()}년 ${month.getMonth()+1}월`;title.setAttribute('aria-live','polite');head.append(prev,title,next);popup.append(head);prev.onclick=()=>moveMonth(-1);next.onclick=()=>moveMonth(1);
   const week=el('div','calendar-week');week.setAttribute('aria-hidden','true');for(const d of ['일','월','화','수','목','금','토']){const x=el('span','');x.textContent=d;week.append(x);}popup.append(week);const grid=el('div','calendar-grid');grid.setAttribute('role','grid');grid.setAttribute('aria-label',title.textContent);popup.append(grid);const offset=month.getDay();let focusCell;
   for(let row=0;row<6;row++){const tr=el('div','calendar-row');tr.setAttribute('role','row');for(let col=0;col<7;col++){const d=new Date(month.getFullYear(),month.getMonth(),row*7+col-offset+1),v=iso(d),cell=el('button','calendar-day');cell.type='button';cell.setAttribute('role','gridcell');cell.textContent=d.getDate();cell.setAttribute('aria-label',`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`);cell.setAttribute('aria-selected',String(v===input.value));cell.disabled=!valid(v);cell.tabIndex=-1;if(d.getMonth()!==month.getMonth())cell.classList.add('outside');if(v===iso(new Date()))cell.setAttribute('aria-current','date');if(v===iso(cursor)){cell.tabIndex=0;focusCell=cell;}cell.onclick=()=>pick(d);cell.onkeydown=e=>{let target=new Date(d);if(e.key==='ArrowLeft')target.setDate(d.getDate()-1);else if(e.key==='ArrowRight')target.setDate(d.getDate()+1);else if(e.key==='ArrowUp')target.setDate(d.getDate()-7);else if(e.key==='ArrowDown')target.setDate(d.getDate()+7);else if(e.key==='Home')target.setDate(d.getDate()-d.getDay());else if(e.key==='End')target.setDate(d.getDate()+6-d.getDay());else if(e.key==='PageUp'||e.key==='PageDown'){e.preventDefault();moveMonth(e.key==='PageUp'?-1:1);return;}else return;e.preventDefault();if(!valid(iso(target)))return;cursor=target;month=new Date(target.getFullYear(),target.getMonth(),1);render(true);};tr.append(cell);}grid.append(tr);}
   const foot=el('div','calendar-footer');const today=el('button','btn ghost sm'),clear=el('button','btn ghost sm');today.type=clear.type='button';today.textContent='오늘';clear.textContent='선택 해제';today.disabled=!valid(iso(new Date()));today.onclick=()=>pick(new Date());clear.onclick=()=>{input.value='';input.setCustomValidity('');input.removeAttribute('aria-invalid');input.dispatchEvent(new Event('change',{bubbles:true}));close(true);};foot.append(today,clear);popup.append(foot);position();if(focus)focusCell?.focus();
  };render(true);
 };button.onclick=()=>opened?.trigger===button?close():open();input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();open();}});
}
function fileControl(input){input.dataset.custom='true';const wrap=el('div','custom-control custom-file');copyControlLayout(input,wrap);input.before(wrap);wrap.append(input);input.classList.add('custom-file-input');input.tabIndex=-1;const button=el('button','btn'),name=el('span','helper');button.type='button';button.innerHTML=svg('upload')+' 파일 선택';button.onclick=()=>{if(!unavailable(input))input.click();};name.setAttribute('aria-live','polite');const sync=()=>{name.textContent=[...input.files].map(f=>f.name).join(', ')||'선택한 파일 없음';copyControlState(input,button);button.setAttribute('aria-label',labelOf(input)+' 파일 선택');};input.addEventListener('change',sync);wrap.append(button,name);watchControl(input,sync);}
function searchControl(input){input.dataset.custom='true';const wrap=el('span','custom-control custom-search');copyControlLayout(input,wrap);input.before(wrap);wrap.append(input);const clear=el('button','control-icon search-clear');clear.type='button';clear.innerHTML=svg('close');const sync=()=>{clear.hidden=!input.value;clear.disabled=unavailable(input);clear.setAttribute('aria-label',labelOf(input)+' 지우기');};input.addEventListener('input',sync);clear.onclick=()=>{if(unavailable(input))return;input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();};wrap.append(clear);watchControl(input,sync);}
function enhance(){
 if(opened&&!opened.trigger.isConnected)close();
 document.querySelectorAll('select:not([data-custom])').forEach(selectControl);
 document.querySelectorAll('input[list]:not([data-custom])').forEach(comboControl);
 document.querySelectorAll('input[type=date]:not([data-custom])').forEach(dateControl);
 document.querySelectorAll('input[type=file]:not([data-custom])').forEach(fileControl);
 document.querySelectorAll('input[type=search]:not([data-custom])').forEach(searchControl);
}
enhance();new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
document.addEventListener('reset',event=>{const form=event.target;queueMicrotask(()=>{if(event.defaultPrevented)return;for(const control of form.elements||[])resetControls.get(control)?.();});},true);
document.addEventListener('pointerdown',e=>{if(opened&&!opened.popup.contains(e.target)&&!opened.trigger.closest('.custom-control')?.contains(e.target))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened){e.preventDefault();e.stopPropagation();close(true);}},true);
document.addEventListener('focusin',e=>{if(opened&&!opened.popup.contains(e.target)&&!opened.trigger.closest('.custom-control')?.contains(e.target))close();});
window.addEventListener('resize',position);window.addEventListener('scroll',e=>{if(opened&&!opened.popup.contains(e.target))position();},true);
window.visualViewport?.addEventListener('resize',position);window.visualViewport?.addEventListener('scroll',position);
