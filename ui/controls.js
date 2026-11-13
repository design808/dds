import {icon} from './icons.js?v=f9086ddd38cf7f33';

// Enhancement is explicit. Importing this module does not inspect or modify a page.
const mounts=new WeakMap(),owners=new WeakMap();
let serial=0,activeMount;
const stateAttributes=['disabled','readonly','required','aria-required','aria-readonly','aria-label','aria-labelledby','aria-describedby','aria-errormessage','aria-invalid'];
const sizeProperties=['height','type-role','font-size','line-height','font-weight','tracking','padding-inline','gap','icon-size'];
const iso=date=>`${String(date.getFullYear()).padStart(4,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const makeDate=(year,month,day)=>{const date=new Date(0);date.setHours(0,0,0,0);date.setFullYear(year,month,day);return date;};
const parse=value=>{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
 const [year,month,day]=value.split('-').map(Number),date=makeDate(year,month-1,day);
 return year>0&&iso(date)===value?date:null;
};
const dateDigits=value=>String(value).normalize('NFKC').replace(/\D/g,'');

function formatDateInput(input){
 const raw=input.value,digits=dateDigits(raw).slice(0,8);
 const formatted=digits.slice(0,4)+(digits.length>4?'-'+digits.slice(4,6):'')+(digits.length>6?'-'+digits.slice(6,8):'');
 if(raw===formatted)return;
 const caret=position=>{const count=Math.min(8,dateDigits(raw.slice(0,position)).length);return Math.min(formatted.length,count+(count>4?1:0)+(count>6?1:0));};
 const start=caret(input.selectionStart??raw.length),end=caret(input.selectionEnd??raw.length);
 input.value=formatted;input.setSelectionRange(start,end);
}

export function mountControls(root,{onlyDDS=false}={}){
 if(!root?.querySelectorAll||!root?.contains)throw new TypeError('mountControls requires a DOM root.');
 if(mounts.has(root))return mounts.get(root);
 const document=root.ownerDocument||root,window=document.defaultView;
 if(!window)throw new TypeError('The controls root must belong to a browser document.');
 const controller=new window.AbortController(),records=new Map(),timers=new Set();
 const create=(tag,className='')=>{const node=document.createElement(tag);node.className=className;return node;};
 const svg=name=>icon(name==='chevron'?'down':name);
 const listen=(target,type,listener,options={})=>target?.addEventListener(type,listener,{...options,signal:controller.signal});
 const on=(record,target,type,listener,options={})=>target.addEventListener(type,listener,{...options,signal:record.controller.signal});
 const labelOf=input=>{
  if(input.getAttribute('aria-label'))return input.getAttribute('aria-label');
  const source=input.labels?.[0];if(!source)return '옵션';
  const label=source.cloneNode(true);label.querySelectorAll('input,select,textarea,button,.custom-control,[aria-hidden="true"]').forEach(node=>node.remove());
  return label.textContent.trim()||'옵션';
 };
 const unavailable=input=>input.matches(':disabled')||input.readOnly;
 const uniqueId=prefix=>{const safePrefix=String(prefix).replace(/[^a-zA-Z0-9_-]/g,'-');let id;do{id=`${safePrefix}-${++serial}`;}while(document.getElementById(id));return id;};
 let opened,disposed=false,listening=false,invalidFocusQueued=false;

 function close(restore=false){
  if(!opened)return;
  const previous=opened;opened=null;
  previous.controller.abort();previous.themeObserver.disconnect();for(const timer of previous.timers)window.clearTimeout(timer);
  previous.portal.remove();previous.trigger.setAttribute('aria-expanded','false');previous.trigger.removeAttribute('aria-activedescendant');
  if(activeMount===close)activeMount=undefined;
  if(restore&&previous.trigger.isConnected&&!previous.trigger.matches(':disabled'))previous.trigger.focus({preventScroll:true});
 }
 function position(){
  if(!opened)return;
  if(!opened.trigger.isConnected){close();return;}
  const {trigger,popup}=opened,bounds=trigger.closest('.custom-control')?.getBoundingClientRect()||trigger.getBoundingClientRect(),view=window.visualViewport;
  const left=view?.offsetLeft||0,top=view?.offsetTop||0,width=view?.width||window.innerWidth,height=view?.height||window.innerHeight;
  const popupWidth=Math.min(Math.max(bounds.width,popup.classList.contains('calendar-popup')?308:200),Math.max(0,width-24));
  popup.style.width=popupWidth+'px';popup.style.left=Math.max(left+12,Math.min(bounds.left,left+width-popupWidth-12))+'px';
  const down=top+height-bounds.bottom-18,up=bounds.top-top-18,desired=Math.min(popup.scrollHeight,352,height-24);
  const below=down>=Math.min(desired,240)||down>=up,available=Math.max(0,below?down:up),popupHeight=Math.min(352,height-24,available);
  popup.style.maxHeight=Math.max(0,popupHeight)+'px';
  const renderedHeight=Math.min(desired,popupHeight);
  popup.style.top=Math.max(top+12,Math.min(below?bounds.bottom+6:bounds.top-renderedHeight-6,top+height-renderedHeight-12))+'px';
 }
 function show(record,trigger,kind,label){
  if(activeMount&&activeMount!==close)activeMount();
  close();
  const portal=create('div','dds-ui dds-ui-portal'),popup=create('div','control-popup '+kind),computed=window.getComputedStyle(trigger);
  const inheritTheme=()=>{
   const style=window.getComputedStyle(trigger);
   for(const property of style)if(property.startsWith('--'))portal.style.setProperty(property,style.getPropertyValue(property));
   for(const property of ['font-family','font-size','font-weight','line-height','letter-spacing','color','direction'])portal.style.setProperty(property,style.getPropertyValue(property));
   const theme=trigger.closest('[data-theme]')?.getAttribute('data-theme')||document.documentElement.getAttribute('data-theme');
   if(theme)portal.setAttribute('data-theme',theme);else portal.removeAttribute('data-theme');
   portal.dir=style.direction;
  };
  inheritTheme();
  popup.id=uniqueId('control-popup');popup.setAttribute('role',kind==='calendar-popup'?'dialog':'listbox');popup.setAttribute('aria-label',label);
  for(const property of sizeProperties)popup.style.setProperty('--control-'+property,computed.getPropertyValue('--control-'+property));
  portal.append(popup);(trigger.closest('dialog[open],[popover]:popover-open')||document.body).append(portal);
  trigger.setAttribute('aria-controls',popup.id);trigger.setAttribute('aria-expanded','true');
  const themeObserver=new window.MutationObserver(()=>{inheritTheme();position();});
  for(let ancestor=trigger;ancestor;ancestor=ancestor.parentElement)themeObserver.observe(ancestor,{attributes:true,attributeFilter:['style','class','data-theme','dir']});
  opened={record,trigger,popup,portal,themeObserver,controller:new window.AbortController(),timers:new Set()};activeMount=close;
  return popup;
 }
 function popupOn(target,type,listener){target.addEventListener(type,listener,{signal:opened.controller.signal});}
 function copyState(native,target,field=false){
  for(const name of field?['aria-labelledby','aria-describedby','aria-errormessage','aria-invalid','aria-required','aria-readonly']:['aria-describedby','aria-errormessage']){
   const value=native.getAttribute(name);if(value===null)target.removeAttribute(name);else target.setAttribute(name,value);
  }
  if(field&&native.required)target.setAttribute('aria-required','true');
  if(field&&native.readOnly)target.setAttribute('aria-readonly','true');
  target.disabled=unavailable(native);
 }
 function managed(record,name,value){
  if(!record.original.has(name))record.original.set(name,record.native.getAttribute(name));
  const next=value===null?null:String(value);record.managed.set(name,next);
  if(record.native.getAttribute(name)!==next){if(next===null)record.native.removeAttribute(name);else record.native.setAttribute(name,next);}
 }
 function wrapControl(record,tag,className){
  const wrapper=create(tag,className);
  for(const name of ['data-control-size','data-control-width'])if(record.native.hasAttribute(name))wrapper.setAttribute(name,record.native.getAttribute(name));
  record.native.before(wrapper);wrapper.append(record.native);record.wrapper=wrapper;return wrapper;
 }
 function watch(record,sync,{reset=sync,subtree=false,attributes=[]}={}){
  record.reset=reset;
  const observer=new window.MutationObserver(mutations=>{
   const relevant=mutations.filter(mutation=>!record.wrapper?.contains(mutation.target)||mutation.target===record.native||record.native.contains(mutation.target));
   if(relevant.length)sync(relevant);
  });record.observers.push(observer);
  observer.observe(record.native,{attributes:true,attributeFilter:[...stateAttributes,...attributes],childList:subtree,subtree,characterData:subtree});
  for(let parent=record.native.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='FIELDSET')observer.observe(parent,{attributes:true,attributeFilter:['disabled']});
  for(const label of record.native.labels||[])observer.observe(label,{childList:true,subtree:true,characterData:true});
  sync();
 }
 function optionList(record,trigger,options,selected,onPick,searchable=false){
  const popup=show(record,trigger,'select-popup',labelOf(trigger)),session=opened;let active=-1,typed='',timer;
  const rows=options.map((option,index)=>{
   const row=create('button','custom-option');row.type='button';row.id=popup.id+'-'+index;row.setAttribute('role','option');row.setAttribute('aria-selected',String(option.value===selected));row.disabled=!!option.disabled;row.tabIndex=-1;
   const text=create('span');text.textContent=option.label;if(option.fontFamily)text.style.fontFamily=option.fontFamily;row.append(text);
   if(option.value===selected)row.insertAdjacentHTML('beforeend',svg('check'));
   popupOn(row,'click',()=>{onPick(option.value);close();if(trigger.isConnected)trigger.focus({preventScroll:true});});popup.append(row);return row;
  });
  if(!rows.length){const message=create('p','helper');message.textContent='검색 결과가 없습니다.';popup.append(message);}
  const enabled=()=>rows.map((row,index)=>!row.disabled?index:-1).filter(index=>index>=0);
  const activate=index=>{
   if(!rows[index]||rows[index].disabled)return;active=index;
   rows.forEach((row,current)=>row.classList.toggle('highlighted',current===index));trigger.setAttribute('aria-activedescendant',rows[index].id);
   rows[index].scrollIntoView({block:'nearest'});if(!searchable)rows[index].focus({preventScroll:true});
  };
  const keys=event=>{
   if(event.isComposing||event.keyCode===229)return;
   const valid=enabled();
   if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
    event.preventDefault();const index=valid.indexOf(active);
    activate(event.key==='Home'?valid[0]:event.key==='End'?valid.at(-1):index<0?(event.key==='ArrowDown'?valid[0]:valid.at(-1)):valid[(index+(event.key==='ArrowDown'?1:-1)+valid.length)%valid.length]);
   }else if(event.key==='Enter'&&active>=0){event.preventDefault();rows[active].click();}
   else if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close(true);}
   else if(event.key==='Tab')close(true);
   else if(event.key.length===1&&!event.ctrlKey&&!event.metaKey){
    if(searchable)return;
    typed+=event.key.toLowerCase();window.clearTimeout(timer);session.timers.delete(timer);
    timer=window.setTimeout(()=>{typed='';session.timers.delete(timer);},600);session.timers.add(timer);
    activate(options.findIndex((option,index)=>!rows[index].disabled&&option.label.toLowerCase().startsWith(typed)));
   }
  };
  popupOn(popup,'keydown',keys);session.keys=keys;position();
  if(!searchable){const selectedIndex=rows.findIndex(row=>row.getAttribute('aria-selected')==='true'&&!row.disabled);activate(selectedIndex>=0?selectedIndex:enabled()[0]);}
 }
 function selectControl(record){
  const native=record.native,wrapper=wrapControl(record,'div','custom-control custom-select'),trigger=create('button','custom-trigger');
  trigger.type='button';trigger.id=uniqueId((native.id||'select')+'-dds-trigger');trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label',labelOf(native));
  managed(record,'hidden','');managed(record,'tabindex','-1');wrapper.append(trigger);
  const measure=create('span','custom-select-measure');measure.setAttribute('aria-hidden','true');wrapper.append(measure);
  const sync=mutations=>{
   trigger.replaceChildren();const text=create('span'),selected=native.selectedOptions[0];text.textContent=selected?.textContent||'선택해 주세요';if(selected?.style.fontFamily)text.style.fontFamily=selected.style.fontFamily;trigger.append(text);trigger.insertAdjacentHTML('beforeend',svg('chevron'));
   copyState(native,trigger,true);trigger.setAttribute('aria-label',labelOf(native));
   measure.replaceChildren(...[...native.options].map(option=>{const label=create('span');label.textContent=option.textContent;if(option.style.fontFamily)label.style.fontFamily=option.style.fontFamily;return label;}));
   if(opened?.trigger===trigger&&(trigger.disabled||Array.isArray(mutations)&&mutations.some(mutation=>mutation.type==='childList'||mutation.type==='characterData'||mutation.target!==native)))close();
  };
  on(record,native,'change',sync);
  on(record,native,'invalid',event=>{
   event.preventDefault();trigger.setAttribute('aria-invalid','true');
   if(!invalidFocusQueued){invalidFocusQueued=true;trigger.focus({preventScroll:true});window.queueMicrotask(()=>{invalidFocusQueued=false;});}
  });
  for(const label of native.labels||[])on(record,label,'click',event=>{
   if(event.target.closest('button,a,input,select,textarea'))return;
   event.preventDefault();if(!trigger.disabled)trigger.focus({preventScroll:true});
  });
  watch(record,sync,{subtree:true,attributes:['selected','label'],reset:()=>{if(opened?.trigger===trigger)close();sync();}});
  const open=()=>{
   if(trigger.disabled)return;
   optionList(record,trigger,[...native.options].map(option=>({value:option.value,label:option.textContent,fontFamily:option.style.fontFamily,disabled:option.disabled||option.parentElement?.tagName==='OPTGROUP'&&option.parentElement.disabled})),native.value,value=>{native.value=value;native.dispatchEvent(new window.Event('change',{bubbles:true}));});
  };
  on(record,trigger,'click',()=>opened?.trigger===trigger?close():open());
  on(record,trigger,'keydown',event=>{if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();open();}});
 }
 function comboControl(record){
  const input=record.native,data=document.getElementById(input.getAttribute('list'));
  const options=()=>[...(data?.options||[])].map(option=>({value:option.value,label:option.label||option.value,disabled:option.disabled}));
  managed(record,'list',null);managed(record,'role','combobox');managed(record,'aria-autocomplete','list');managed(record,'aria-haspopup','listbox');managed(record,'aria-expanded','false');managed(record,'autocomplete','off');
  const wrapper=wrapControl(record,'div','custom-control custom-combo'),toggle=create('button','control-icon');toggle.type='button';toggle.innerHTML=svg('chevron');wrapper.append(toggle);
  const sync=()=>{copyState(input,toggle);toggle.setAttribute('aria-label',labelOf(input)+' 선택지 열기');if(toggle.disabled&&opened?.trigger===input)close();};
  watch(record,sync,{reset:()=>{if(opened?.trigger===input)close();sync();}});
  const open=(all=false)=>{
   if(unavailable(input))return;
   optionList(record,input,options().filter(option=>all||option.label.toLowerCase().includes(input.value.toLowerCase())),input.value,value=>{input.value=value;input.dispatchEvent(new window.Event('input',{bubbles:true}));input.dispatchEvent(new window.Event('change',{bubbles:true}));},true);input.focus({preventScroll:true});
  };
  on(record,toggle,'click',()=>opened?.trigger===input?close():open(true));
  on(record,input,'input',event=>{if(!event.isComposing)open();});
  on(record,input,'compositionend',()=>open());
  on(record,input,'keydown',event=>{if(event.isComposing||event.keyCode===229)return;if(opened?.trigger===input)opened.keys(event);else if(event.key==='ArrowDown'&&!unavailable(input)){event.preventDefault();open(true);}});
 }
 function dateControl(record){
  const input=record.native,name=labelOf(input);
  for(const [attribute,value] of Object.entries({type:'text',inputmode:'numeric',placeholder:'YYYY-MM-DD',pattern:'[0-9]{4}-[0-9]{2}-[0-9]{2}',maxlength:'10',autocomplete:'off'}))managed(record,attribute,value);
  const wrapper=wrapControl(record,'div','custom-control custom-date'),button=create('button','control-icon');button.type='button';button.innerHTML=svg('calendar');button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');wrapper.append(button);
  const hint=create('span','sr-only');hint.id=uniqueId('date-hint');hint.textContent='연도 네 자리, 월 두 자리, 일 두 자리의 숫자 8자리를 입력하세요. 20260916을 입력하면 2026-09-16으로 표시됩니다. 아래 방향키로 달력을 열 수 있습니다.';wrapper.append(hint);
  managed(record,'aria-describedby',((input.getAttribute('aria-describedby')||'')+' '+hint.id).trim());
  const valid=value=>!value||(!!parse(value)&&(!input.min||value>=input.min)&&(!input.max||value<=input.max));
  const validationMessage='숫자 8자리로 올바른 날짜를 입력하고 허용 범위를 확인해 주세요.';
  const validate=()=>{const ok=valid(input.value);input.setCustomValidity(ok?'':validationMessage);managed(record,'aria-invalid',String(!ok));};
  const sync=mutations=>{
   copyState(input,button);button.setAttribute('aria-label',labelOf(input)+' 달력 열기');
   const constraintsChanged=mutations?.some(mutation=>['min','max'].includes(mutation.attributeName));
   if(opened?.trigger===button&&(button.disabled||constraintsChanged))close();
   if(input.value&&constraintsChanged)validate();
  };
  watch(record,sync,{attributes:['min','max'],reset:()=>{if(opened?.trigger===button)close();if(input.validationMessage===validationMessage)input.setCustomValidity('');input.removeAttribute('aria-invalid');sync();}});
  record.restore.push(()=>{
   const description=(input.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==hint.id).join(' ');
   if(description)input.setAttribute('aria-describedby',description);else input.removeAttribute('aria-describedby');
   if(input.validationMessage===validationMessage)input.setCustomValidity('');
  });
  on(record,input,'beforeinput',event=>{
   if(event.isComposing||input.selectionStart!==input.selectionEnd)return;
   const caret=input.selectionStart;
   if(event.inputType==='deleteContentBackward'&&input.value[caret-1]==='-')input.setSelectionRange(caret-2,caret);
   if(event.inputType==='deleteContentForward'&&input.value[caret]==='-')input.setSelectionRange(caret,caret+2);
  });
  on(record,input,'paste',event=>{
   if(!event.clipboardData||unavailable(input))return;
   event.preventDefault();input.setRangeText(dateDigits(event.clipboardData.getData('text')).slice(0,8),input.selectionStart,input.selectionEnd,'end');input.dispatchEvent(new window.Event('input',{bubbles:true}));
  });
  on(record,input,'input',event=>{if(!event.isComposing){formatDateInput(input);validate();}});
  on(record,input,'change',()=>{formatDateInput(input);validate();});
  on(record,input,'compositionend',()=>input.dispatchEvent(new window.Event('input',{bubbles:true})));
  const open=()=>{
   if(unavailable(input))return;
   let cursor=parse(input.value)||new Date();if(input.min&&iso(cursor)<input.min)cursor=parse(input.min)||cursor;if(input.max&&iso(cursor)>input.max)cursor=parse(input.max)||cursor;
   let month=makeDate(cursor.getFullYear(),cursor.getMonth(),1);
   const popup=show(record,button,'calendar-popup',name+' 날짜 선택');
   const pick=date=>{input.value=iso(date);input.setCustomValidity('');input.removeAttribute('aria-invalid');input.dispatchEvent(new window.Event('input',{bubbles:true}));input.dispatchEvent(new window.Event('change',{bubbles:true}));close(true);};
   const moveMonth=amount=>{month=makeDate(month.getFullYear(),month.getMonth()+amount,1);cursor=makeDate(month.getFullYear(),month.getMonth(),Math.min(cursor.getDate(),makeDate(month.getFullYear(),month.getMonth()+1,0).getDate()));render(true);};
   const render=(focus=false)=>{
    popup.replaceChildren();const head=create('div','calendar-head'),previous=create('button','control-icon calendar-nav'),next=create('button','control-icon calendar-nav'),title=create('b');
    previous.type=next.type='button';previous.innerHTML=svg('left');next.innerHTML=svg('right');previous.setAttribute('aria-label','이전 달');next.setAttribute('aria-label','다음 달');title.textContent=`${month.getFullYear()}년 ${month.getMonth()+1}월`;title.setAttribute('aria-live','polite');head.append(previous,title,next);popup.append(head);
    popupOn(previous,'click',()=>moveMonth(-1));popupOn(next,'click',()=>moveMonth(1));
    const week=create('div','calendar-week');week.setAttribute('aria-hidden','true');for(const day of ['일','월','화','수','목','금','토']){const label=create('span');label.textContent=day;week.append(label);}popup.append(week);
    const grid=create('div','calendar-grid');grid.setAttribute('role','grid');grid.setAttribute('aria-label',title.textContent);popup.append(grid);
    const offset=month.getDay();let focusCell;
    for(let row=0;row<6;row++){
     const line=create('div','calendar-row');line.setAttribute('role','row');
     for(let column=0;column<7;column++){
      const date=makeDate(month.getFullYear(),month.getMonth(),row*7+column-offset+1),value=iso(date),cell=create('button','calendar-day');cell.type='button';cell.setAttribute('role','gridcell');cell.textContent=date.getDate();cell.setAttribute('aria-label',`${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`);cell.setAttribute('aria-selected',String(value===input.value));cell.disabled=!valid(value);cell.tabIndex=-1;
      if(date.getMonth()!==month.getMonth())cell.classList.add('outside');if(value===iso(new Date()))cell.setAttribute('aria-current','date');if(value===iso(cursor)){cell.tabIndex=0;focusCell=cell;}
      popupOn(cell,'click',()=>pick(date));
      popupOn(cell,'keydown',event=>{
       const target=new Date(date);
       if(event.key==='ArrowLeft')target.setDate(date.getDate()-1);else if(event.key==='ArrowRight')target.setDate(date.getDate()+1);else if(event.key==='ArrowUp')target.setDate(date.getDate()-7);else if(event.key==='ArrowDown')target.setDate(date.getDate()+7);else if(event.key==='Home')target.setDate(date.getDate()-date.getDay());else if(event.key==='End')target.setDate(date.getDate()+6-date.getDay());else if(event.key==='PageUp'||event.key==='PageDown'){event.preventDefault();moveMonth(event.key==='PageUp'?-1:1);return;}else return;
       event.preventDefault();if(!valid(iso(target)))return;cursor=target;month=makeDate(target.getFullYear(),target.getMonth(),1);render(true);
      });line.append(cell);
     }grid.append(line);
    }
    const footer=create('div','calendar-footer'),today=create('button','btn ghost sm'),clear=create('button','btn ghost sm');today.type=clear.type='button';today.textContent='오늘';clear.textContent='선택 해제';today.disabled=!valid(iso(new Date()));
    popupOn(today,'click',()=>pick(new Date()));popupOn(clear,'click',()=>{input.value='';input.setCustomValidity('');input.removeAttribute('aria-invalid');input.dispatchEvent(new window.Event('change',{bubbles:true}));close(true);});
    footer.append(today,clear);popup.append(footer);position();if(focus)focusCell?.focus({preventScroll:true});
   };render(true);
  };
  on(record,button,'click',()=>opened?.trigger===button?close():open());
  on(record,input,'keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();open();}});
 }
 function fileControl(record){
  const input=record.native,wrapper=wrapControl(record,'div','custom-control custom-file'),hadClass=input.classList.contains('custom-file-input');input.classList.add('custom-file-input');managed(record,'tabindex','-1');
  const button=create('button','btn'),name=create('span','helper');button.type='button';button.innerHTML=svg('upload')+' 파일 선택';name.setAttribute('aria-live','polite');wrapper.append(button,name);
  const sync=()=>{name.textContent=[...input.files].map(file=>file.name).join(', ')||'선택한 파일 없음';copyState(input,button);button.setAttribute('aria-label',labelOf(input)+' 파일 선택');};
  on(record,button,'click',()=>{if(!unavailable(input))input.click();});on(record,input,'change',sync);watch(record,sync);
  record.restore.push(()=>{if(!hadClass)input.classList.remove('custom-file-input');});
 }
 function searchControl(record){
  const input=record.native,wrapper=wrapControl(record,'span','custom-control custom-search'),clear=create('button','control-icon search-clear');clear.type='button';clear.innerHTML=svg('close');wrapper.append(clear);
  const sync=()=>{clear.hidden=!input.value;clear.disabled=unavailable(input);clear.setAttribute('aria-label',labelOf(input)+' 지우기');};
  on(record,input,'input',sync);on(record,input,'change',sync);
  on(record,clear,'click',()=>{if(unavailable(input))return;input.value='';input.dispatchEvent(new window.Event('input',{bubbles:true}));input.focus({preventScroll:true});});watch(record,sync);
 }
 function disposeRecord(record){
  if(opened?.record===record)close();record.controller.abort();record.observers.forEach(observer=>observer.disconnect());
  for(const [name,original] of record.original)if(record.native.getAttribute(name)===record.managed.get(name)){if(original===null)record.native.removeAttribute(name);else record.native.setAttribute(name,original);}
  record.restore.forEach(restore=>restore());
  if(record.wrapper?.contains(record.native)){record.wrapper.before(record.native);record.wrapper.remove();}else record.wrapper?.remove();
  records.delete(record.native);owners.delete(record.native);
 }
 function ensureListeners(){
  if(listening)return;listening=true;
  listen(document,'reset',event=>{
   const form=event.target;
   // Native reset values are applied after the reset event's default action.
   const timer=window.setTimeout(()=>{timers.delete(timer);if(disposed||event.defaultPrevented)return;for(const record of records.values())if(record.native.form===form)record.reset?.();},0);timers.add(timer);
  },{capture:true});
  listen(document,'pointerdown',event=>{if(opened&&!opened.popup.contains(event.target)&&!opened.trigger.closest('.custom-control')?.contains(event.target))close();});
  listen(document,'keydown',event=>{if(event.key==='Escape'&&opened){event.preventDefault();event.stopPropagation();close(true);}},{capture:true});
  listen(document,'focusin',event=>{if(opened&&!opened.popup.contains(event.target)&&!opened.trigger.closest('.custom-control')?.contains(event.target))close();});
  listen(document,'close',event=>{if(opened&&event.target.tagName==='DIALOG'&&event.target.contains(opened.trigger))close();},{capture:true});
  listen(document,'toggle',event=>{if(opened&&event.newState==='closed'&&event.target.hasAttribute?.('popover')&&event.target.contains(opened.trigger))close();},{capture:true});
  const dismissForNavigation=()=>close();
  for(const event of ['pagehide','popstate','hashchange'])listen(window,event,dismissForNavigation);
  listen(window,'pageshow',event=>{if(event.persisted)dismissForNavigation();});
  listen(window,'resize',position);listen(document,'scroll',event=>{if(opened&&!opened.popup.contains(event.target))position();},{capture:true});
  listen(window.visualViewport,'resize',position);listen(window.visualViewport,'scroll',position);
 }
 function enhance(){
  if(disposed)return;
  for(const record of records.values())if(!root.contains(record.native)||onlyDDS&&!record.native.closest('.dds-ui'))disposeRecord(record);
  if(opened&&!opened.trigger.isConnected)close();
  const entries=[['select:not([data-custom])',selectControl],['input[list]:not([data-custom])',comboControl],['input[type=date]:not([data-custom])',dateControl],['input[type=file]:not([data-custom])',fileControl],['input[type=search]:not([data-custom])',searchControl]];
  for(const [selector,enhanceControl] of entries){
   const natives=[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)];
   for(const native of natives){
    if(owners.has(native)||native.hidden||onlyDDS&&!native.closest('.dds-ui')||native.tagName==='SELECT'&&(native.multiple||native.size>1))continue;
    const record={native,controller:new window.AbortController(),observers:[],original:new Map(),managed:new Map(),restore:[],wrapper:null,reset:null};records.set(native,record);owners.set(native,record);managed(record,'data-custom','true');ensureListeners();
    try{enhanceControl(record);}catch(error){disposeRecord(record);throw error;}
   }
  }
 }
 const observer=new window.MutationObserver(enhance);
 observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['type','list','hidden','data-custom',...(onlyDDS?['class']:[])]});
 const cleanup=()=>{
  if(disposed)return;disposed=true;observer.disconnect();controller.abort();close();for(const timer of timers)window.clearTimeout(timer);timers.clear();
  for(const record of [...records.values()])disposeRecord(record);
  if(mounts.get(root)===cleanup)mounts.delete(root);
 };
 mounts.set(root,cleanup);
 try{enhance();}catch(error){cleanup();throw error;}
 return cleanup;
}
