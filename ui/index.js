import {renderComponentSource,serviceMarkup,componentParts,componentIds,isChart,layoutContract} from './source.js?v=30a3948cfc3adddc';
import {renderButton} from './button.js?v=30a3948cfc3adddc';
import {icon} from './icons.js?v=30a3948cfc3adddc';
import {mountControls} from './controls.js?v=30a3948cfc3adddc';
import {mountTooltips} from './tooltips.js?v=30a3948cfc3adddc';
import {bindCharts,chartDemo} from './charts.js?v=30a3948cfc3adddc';
import {calendarDays,renderItemList} from './extended.js?v=30a3948cfc3adddc';
import {UI_VERSION} from './version.js?v=30a3948cfc3adddc';
import {prepareServiceContent,finalizeServiceContent,configureServiceItems,connectFieldDescriptions,optionalContent} from './content.js?v=30a3948cfc3adddc';
import {applyComponentVariants,componentVariants} from './variants.js?v=30a3948cfc3adddc';
export {renderButton,renderItemList,icon,componentIds,componentParts,renderComponentSource,layoutContract};
export {componentVariants,optionalContent};
export {collectionCount,statusBadge,metricTrend,metricContent} from '../visibility.js?v=30a3948cfc3adddc';
export const version=UI_VERSION;
let serial=0;
const booleans=new Set(['checked','selected','disabled','required','readonly','multiple','open','hidden','autofocus','formnovalidate']);
const safeAttributes=new Set(['id','name','value','placeholder','type','min','max','step','pattern','maxlength','minlength','rows','accept','autocomplete','inputmode','tabindex','title','role','href','src','alt','target','rel','datetime','download','for','dir','lang','translate','width','height','colspan','rowspan',...booleans]);
function safeAttribute(node,name,value,definition){
 if(!/^[a-zA-Z][a-zA-Z0-9_.:-]*$/.test(name)||/^on/i.test(name)||['class','style','srcdoc','innerHTML'].includes(name))throw new TypeError('DDS design or executable attribute is not configurable: '+name);
 if(!safeAttributes.has(name)&&! /^(aria|data)-[a-z0-9_.:-]+$/.test(name))throw new TypeError('Unsupported DDS attribute: '+name);
 if(definition.attributes&&!definition.attributes.includes(name)&&name!=='id'&&! /^(aria|data)-/.test(name))throw new TypeError('Attribute '+name+' is not part of this DDS component part.');
 if(name==='type'&&node.matches('input')&&value!=null&&!['text','email','url','tel','password','search','number','date','checkbox','radio','range','file'].includes(String(value)))throw new TypeError('Unsupported DDS input type: '+value);
 if(['href','src'].includes(name)&&value!=null){const url=String(value).replace(/[\u0000-\u0020\u007f]/g,'');if(/^[a-z][a-z0-9+.-]*:/i.test(url)&&! /^(https?|mailto|tel):/i.test(url))throw new TypeError('Unsupported DDS URL protocol.');}
 if(booleans.has(name)){const on=value!==false&&value!==null&&value!==undefined;node.toggleAttribute(name,on);const property=name==='readonly'?'readOnly':name;if(property in node)node[property]=on;return;}
 if(value===null||value===undefined){node.removeAttribute(name);return;}
 if(name==='id'){const previous=node.id;if(previous){const scope=node.closest('.dds-ui');for(const item of scope.querySelectorAll('[for],[aria-controls],[aria-labelledby],[aria-describedby],[aria-errormessage]'))for(const key of ['for','aria-controls','aria-labelledby','aria-describedby','aria-errormessage'])if(item.hasAttribute(key))item.setAttribute(key,item.getAttribute(key).split(/\s+/).map(id=>id===previous?String(value):id).join(' '));}}
 node.setAttribute(name,String(value));
 if(name==='value'&&'value' in node){node.value=String(value);if(node.matches('textarea,input'))node.defaultValue=String(value);if(node.matches('select'))for(const option of node.options)option.defaultSelected=option.selected;}
}
function partNode(root,parts,name,kind){const part=parts[name];if(!part)throw new TypeError('Unknown DDS part: '+name);if(part.kind!==kind)throw new TypeError('DDS part '+name+' expects '+part.kind);const node=root.querySelector(part.selector);if(!node)throw new Error('DDS part is absent: '+name+' ('+part.selector+')');return [node,part];}
function resolveAssets(root){for(const node of root.querySelectorAll('[src]')){const src=node.getAttribute('src');if(src?.startsWith('/assets/'))node.setAttribute('src',new URL('..'+src,import.meta.url).href);}}

/** Create canonical UI with service-owned content, optional copy, and variants. */
export function createComponent(id,options={},doc=globalThis.document){
 if(!doc?.createElement)throw new Error('createComponent requires a DOM. Server templates use the canonical HTML in ui/registry.json or renderComponentSource().');
 if(!componentIds.includes(id))throw new TypeError('Unknown DDS component: '+id);
 if(isChart(id)&&options.data===undefined)throw new TypeError('A DDS chart requires explicit service data; reference data is not a service default.');
 const uid=String(options.idPrefix||'dds-'+id+'-'+(++serial)).replace(/[^a-zA-Z0-9_-]/g,'-');
 const wrapper=doc.createElement('div');wrapper.className='dds-ui';wrapper.dataset.ddsComponent=id;
 wrapper.dataset.ddsInstance=uid;
 const markup=id==='button'&&options.props?renderButton(options.props):renderComponentSource(id,uid,false,options.data);
 wrapper.innerHTML=serviceMarkup(markup);resolveAssets(wrapper);
 prepareServiceContent(wrapper,id);
 const variants={...(id==='dialog'&&Object.hasOwn(options.slots||{},'content')?{content:'plain'}:{}),...(options.variants||{})};
 const parts=componentParts(id);
 for(const [name,value] of Object.entries(options.text||{})){const [node]=partNode(wrapper,parts,name,'text');node.textContent=String(value??'');if(node.matches('textarea'))node.value=String(value??'');}
 for(const [name,value] of Object.entries(options.slots||{})){const [node]=partNode(wrapper,parts,name,'slot');const items=Array.isArray(value)?value:[value];if(items.some(item=>item!=null&&typeof item!=='string'&&!item.nodeType))throw new TypeError('DDS slots accept DOM nodes or plain text, not HTML objects.');node.replaceChildren(...items.filter(x=>x!=null));}
 for(const [name,attributes] of Object.entries(options.attributes||{})){const [node,part]=partNode(wrapper,parts,name,'attributes');for(const [key,value] of Object.entries(attributes))safeAttribute(node,key,value,part);}
 for(const progress of wrapper.querySelectorAll('progress'))progress.textContent=progress.hasAttribute('value')?Math.round(progress.value/progress.max*100)+'%':'진행 중';
 if(options.tabs)configureTabs(wrapper,options.tabs,uid);
 configureServiceItems(wrapper,id,options,uid);
 finalizeServiceContent(wrapper,id,options,parts);
 // Apply explicit presentation axes to the actual supplied content/items. The
 // optional-content policy remains authoritative for omitted specimen copy.
 applyComponentVariants(wrapper,id,variants);
 connectFieldDescriptions(wrapper,uid);
 return wrapper;
}
function configureTabs(wrapper,items,uid){
 const list=wrapper.querySelector('[role=tablist]'),panel=wrapper.querySelector('[role=tabpanel]');
 if(!list||!panel||!Array.isArray(items)||!items.length)throw new TypeError('DDS tabs require a non-empty tabs array.');
 const button=list.querySelector('[role=tab]').cloneNode(true),parent=panel.parentElement;
 list.replaceChildren();panel.remove();
 items.forEach((item,index)=>{const tab=button.cloneNode(true),content=panel.cloneNode(false),key=uid+'-'+index;tab.textContent=String(item.label);tab.id=key+'-tab';tab.setAttribute('aria-controls',key+'-panel');tab.setAttribute('aria-selected',String(index===0));tab.tabIndex=index===0?0:-1;tab.removeAttribute('data-demo-tab');tab.setAttribute('data-dds-tab','');content.id=key+'-panel';content.setAttribute('aria-labelledby',tab.id);content.hidden=index!==0;content.replaceChildren(item.content?.nodeType?item.content:String(item.content??''));list.append(tab);parent.append(content);});
}
export function componentHTML(id,options={}){return createComponent(id,options).outerHTML;}
export function componentSource(id,{idPrefix='dds-instance',data}={}){return {id,version,markup:serviceMarkup(renderComponentSource(id,idPrefix,false,data)),parts:componentParts(id),variants:componentVariants[id]||{},optionalParts:optionalContent[id]||{},templatePurpose:'specimen',layout:layoutContract,styles:['tokens.css','ui/dds.css']};}

const bindings=new WeakMap();
const asElement=target=>target?.nodeType===1?target:target?.parentElement;
function refreshPortal(scope,trigger){
 const computed=trigger.ownerDocument.defaultView.getComputedStyle(trigger);
 for(const property of computed)if(property.startsWith('--'))scope.style.setProperty(property,computed.getPropertyValue(property));
 scope.style.fontFamily=computed.fontFamily;
 const theme=trigger.closest('[data-theme]')?.getAttribute('data-theme')||trigger.ownerDocument.documentElement.getAttribute('data-theme');
 theme?scope.setAttribute('data-theme',theme):scope.removeAttribute('data-theme');
}
function portalFor(trigger){
 const doc=trigger.ownerDocument,scope=doc.createElement('div');scope.className='dds-ui dds-ui-portal';
 const component=trigger.closest('[data-dds-component]')?.dataset.ddsComponent;if(component)scope.dataset.ddsComponent=component;
 refreshPortal(scope,trigger);(trigger.closest('dialog[open],[popover]:popover-open')||doc.body).append(scope);return scope;
}
/** Local UI only. Business actions are emitted; no requests or storage are used. */
export function mountDDS(root,{controls=true,charts=true,tooltips=true,onAction}={}){
 if(!root?.addEventListener||!root.ownerDocument)throw new TypeError('mountDDS requires an explicit root element.');
 bindings.get(root)?.();
 const doc=root.ownerDocument,view=doc.defaultView,abort=new view.AbortController(),signal=abort.signal;
 const stops=[],timers=new Set(),portals=new Set(),floating=new Map(),navs=new Map(),dragging=new Map(),toastTimers=new Map();
 const questionnaireLabels=new WeakMap(),timeSuffixes=new WeakMap(),sliderSuffixes=new WeakMap();
 let disposed=false,scanPending=false;
 const owns=target=>{
  const element=asElement(target);if(!element)return false;
  for(const portal of portals)if(portal.contains(element))return true;
  if(!root.contains(element)||!element.closest('.dds-ui'))return false;
  for(let parent=element;parent&&parent!==root;parent=parent.parentElement)if(bindings.has(parent))return false;
  return true;
 };
 const all=selector=>[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)].filter(owns);
 const scopeOf=target=>target.closest('[data-dds-component],.dds-component')||root;
 const byId=(node,id)=>{const found=id?node.ownerDocument.getElementById(id):null;return found&&(root.contains(found)||[...portals].some(portal=>portal.contains(found)))?found:null;};
 const later=(callback,delay)=>{const timer=view.setTimeout(()=>{timers.delete(timer);if(!disposed)callback();},delay);timers.add(timer);return timer;};
 const cancel=timer=>{if(timer!==undefined){view.clearTimeout(timer);timers.delete(timer);}};
 const notify=(target,action,value)=>{
  const detail={component:target.closest('[data-dds-component]')?.dataset.ddsComponent,action,value,target};
  (root.contains(target)?target:root).dispatchEvent(new view.CustomEvent('dds:action',{bubbles:true,detail}));onAction?.(detail);
 };
 const focus=node=>{if(node?.isConnected)node.focus({preventScroll:true});};
 const focusAfterDismiss=host=>{
  // Host-authored controls are valid focus destinations even though mountDDS
  // deliberately does not bind their events or enhance their native behavior.
  const context=host.closest('dialog[open]')||(root.matches('[data-dds-component]')?root.parentElement?.closest('form,section,article,main,[role="main"]'):root)||root;
  const candidates=[...context.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')].filter(node=>!host.contains(node)&&!node.disabled&&node.tabIndex>=0&&!node.closest('[hidden],[inert]')&&node.getClientRects().length);
  return candidates.find(node=>host.compareDocumentPosition(node)&view.Node.DOCUMENT_POSITION_FOLLOWING)||candidates.at(-1);
 };
 const createPortal=trigger=>{const scope=portalFor(trigger);portals.add(scope);return scope;};
 const removePortal=scope=>{scope.remove();portals.delete(scope);};
 if(controls)stops.push(mountControls(root,{onlyDDS:true}));if(charts)stops.push(bindCharts(root));
 function relocate(panel,trigger,kind,returnFocus=trigger){
  let record=floating.get(panel);if(record)return record;
  // Native popovers already render in the top layer. Keep their form controls
  // in the mounted DOM so form ownership and control adapters stay attached.
  if(kind==='popover'){record={panel,trigger,kind,marker:null,scope:null,returnFocus,style:panel.getAttribute('style'),hidden:panel.hidden,hoverTimer:undefined};floating.set(panel,record);return record;}
  const marker=doc.createComment('dds-'+kind+'-position'),scope=createPortal(trigger);
  panel.before(marker);record={panel,trigger,kind,marker,scope,returnFocus,style:panel.getAttribute('style'),hidden:panel.hidden,hoverTimer:undefined};
  scope.append(panel);floating.set(panel,record);return record;
 }
 function restore(record,restoreFocus=false){
  if(!record||!floating.has(record.panel))return;
  const {panel,trigger,marker,scope}=record;
  for(const child of [...floating.values()])if(child!==record&&panel.contains(child.trigger))restore(child);
  cancel(record.hoverTimer);floating.delete(panel);
  if(record.kind==='popover'&&panel.matches(':popover-open'))panel.hidePopover();
  if(record.kind==='menu')panel.hidden=true;else panel.hidden=record.hidden;
  record.style===null?panel.removeAttribute('style'):panel.setAttribute('style',record.style);
  if(marker){if(marker.parentNode&&trigger.isConnected)marker.replaceWith(panel);else{marker.remove();panel.remove();}}
  trigger.setAttribute('aria-expanded','false');if(scope)removePortal(scope);if(restoreFocus)focus(record.returnFocus);
 }
 function positionFloating(record,point){
  if(!record.trigger.isConnected)return restore(record);
  const panel=record.panel,anchor=point?{left:point.x,top:point.y,bottom:point.y}:record.trigger.getBoundingClientRect(),edge=8;
  if(record.scope)refreshPortal(record.scope,record.trigger);panel.style.position='fixed';panel.style.inset='auto';panel.style.margin='0';
  if(record.kind==='menu')panel.style.width=Math.max(1,Math.min(180,view.innerWidth-edge*2))+'px';
  panel.style.maxHeight=Math.max(1,view.innerHeight-edge*2)+'px';panel.style.overflowY='auto';
  const rect=panel.getBoundingClientRect(),below=view.innerHeight-anchor.bottom-edge-6,above=anchor.top-edge-6,down=below>=rect.height||below>=above;
  const height=Math.min(rect.height,Math.max(1,down?below:above));panel.style.maxHeight=Math.max(1,height)+'px';
  panel.style.left=Math.max(edge,Math.min(anchor.left,view.innerWidth-rect.width-edge))+'px';
  panel.style.top=Math.max(edge,Math.min(down?anchor.bottom+6:anchor.top-height-6,view.innerHeight-height-edge))+'px';
 }
 function closeMenus(restoreActive=false){for(const record of [...floating.values()])if(record.kind==='menu')restore(record,restoreActive&&record.panel.contains(doc.activeElement));}
 function openMenu(trigger,{point,returnFocus=trigger,last=false}={}){
  const panel=byId(trigger,trigger.dataset.ddsMenu);if(!panel||!owns(trigger))return;
  closeMenus();const record=relocate(panel,trigger,'menu',returnFocus);panel.hidden=false;trigger.setAttribute('aria-expanded','true');positionFloating(record,point);
  const items=[...panel.querySelectorAll('button,a')].filter(node=>!node.hidden&&!node.disabled);focus(last?items.at(-1):items[0]);
 }
 function openPopover(trigger,{takeFocus=false,toggle=false}={}){
  const panel=byId(trigger,trigger.dataset.ddsPopover);if(!panel)return;
  const old=floating.get(panel);if(old){cancel(old.hoverTimer);if(toggle)restore(old,true);else if(takeFocus)focus(panel.querySelector('button,input,select,a,[tabindex]'));return;}
  const record=relocate(panel,trigger,'popover');panel.showPopover();trigger.setAttribute('aria-expanded','true');positionFloating(record);
  if(takeFocus)focus(panel.querySelector('button,input,select,a,[tabindex]'));
 }
 function closeHoverLater(record){cancel(record.hoverTimer);record.hoverTimer=later(()=>{if(!record.panel.contains(doc.activeElement)&&!record.trigger.contains(doc.activeElement))restore(record);},140);}
 const setTab=tab=>{
  const list=tab.closest('[role=tablist]'),selectedPanel=tab.getAttribute('aria-controls'),panels=new Set();
  for(const item of list.querySelectorAll('[role=tab]')){const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;const panel=byId(item,item.getAttribute('aria-controls'));if(panel)panels.add(panel);}
  for(const panel of panels){panel.hidden=panel.id!==selectedPanel;if(!panel.hidden)panel.setAttribute('aria-labelledby',tab.id);}notify(tab,'tab',tab.id);
 };
 function closeNestedControl(panel){const trigger=panel.querySelector('.custom-trigger[aria-expanded="true"],.control-icon[aria-expanded="true"]');if(!trigger)return false;trigger.dispatchEvent(new view.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));return true;}
 const primaryNavMenu='.dds-topnav-links > .dds-topnav-menu';
 const navPositionProperties=['--dds-topnav-dropdown-y','--dds-topnav-hover-bridge'];
 function clearNavHover(state){
  cancel(state.hoverTimer);
  state.hoverTimer=undefined;
  state.hoveredMenu=null;
 }
 function cleanNav(header,state){
  clearNavHover(state);
  for(const details of header.querySelectorAll('.dds-topnav-menu'))for(const property of navPositionProperties)details.style.removeProperty(property);
  for(const [dropdown,inert] of state.inertPanels)dropdown.inert=inert;
  state.inertPanels.clear();
 }
 function positionNavDropdowns(header){
  const state=navs.get(header),bar=header?.querySelector('.dds-topnav-bar');if(!state||!bar)return;
  const dropdownTop=bar.getBoundingClientRect().bottom+12;
  for(const details of header.querySelectorAll('.dds-topnav-menu')){
   const dropdown=details.querySelector(':scope > .dds-topnav-dropdown');
   if(dropdown){
    if(!state.inertPanels.has(dropdown))state.inertPanels.set(dropdown,dropdown.inert);
    dropdown.inert=state.inertPanels.get(dropdown)||(!state.mobile&&!details.open);
   }
   if(state.mobile){for(const property of navPositionProperties)details.style.removeProperty(property);continue;}
   // Preserve the panel position while its closing transition is visible.
   const bounds=details.getBoundingClientRect();
   details.style.setProperty('--dds-topnav-dropdown-y',`${dropdownTop-bounds.top}px`);
   details.style.setProperty('--dds-topnav-hover-bridge',`${Math.max(0,dropdownTop-bounds.bottom)}px`);
  }
 }
 function setNavMenuOpen(menu,open){
  menu.open=open;
  const header=menu.closest('[data-dds-topnav]');
  if(header)positionNavDropdowns(header);
 }
 function hoverNavMenu(element){
  const menu=element?.closest(primaryNavMenu),header=menu?.closest('[data-dds-topnav]'),state=navs.get(header);
  return state?.mobile===false?{menu,header,state}:null;
 }
 function closeNavMenuLater(menu,state){
  cancel(state.hoverTimer);
  state.hoverTimer=later(()=>{
   state.hoverTimer=undefined;
   const active=doc.activeElement;
   const keepFocus=menu.contains(active)&&(active.matches(':focus-visible')||active.closest('.dds-topnav-dropdown'));
   if(!state.mobile&&state.hoveredMenu!==menu&&!keepFocus&&owns(menu))setNavMenuOpen(menu,false);
  },140);
 }
 function dismissHoveredNavMenu(){
  for(const state of navs.values()){
   if(!state.hoveredMenu?.open)continue;
   setNavMenuOpen(state.hoveredMenu,false);
   return true;
  }
  return false;
 }
 function setNav(header,open,restoreFocus=false,width){
  const state=navs.get(header),toggle=header.querySelector('[data-dds-topnav-toggle]'),panel=header.querySelector('[data-dds-topnav-panel]');if(!state||!toggle||!panel)return;
  const current=doc.activeElement,remembered=(current===doc.body||!current)&&state.lastFocused&&!state.lastFocused.getClientRects().length?state.lastFocused:current;
  const mobile=(width??state.wrapper.clientWidth)<=900,changed=state.mobile!==null&&state.mobile!==mobile,expanded=mobile&&!changed&&(open??state.open);
  const activeMenu=remembered?.closest?.('.dds-topnav-menu[open]'),menuSummary=activeMenu?.querySelector('summary');
  let floatingClosed=false;
  if(changed||mobile&&!expanded){clearNavHover(state);for(const details of header.querySelectorAll('.dds-topnav-menu[open]'))details.open=false;for(const record of [...floating.values()])if(header.contains(record.trigger)){floatingClosed=floatingClosed||record.panel.contains(current);restore(record);}}
  const controlClosed=(changed||mobile&&!expanded)&&closeNestedControl(panel);state.mobile=mobile;state.open=!!expanded;
  const label=expanded?'메뉴 닫기':'메뉴 열기';toggle.hidden=!mobile;toggle.setAttribute('aria-expanded',String(!!expanded));toggle.setAttribute('aria-label',label);toggle.setAttribute('data-tooltip',label);
  const labelNode=toggle.querySelector('.dds-button-label');if(labelNode)labelNode.innerHTML=icon(expanded?'X':'Menu');
  if(mobile&&!expanded&&(restoreFocus||panel.contains(remembered)||controlClosed||floatingClosed)&&doc.hasFocus())focus(toggle);
  if(!mobile&&remembered===toggle&&doc.hasFocus())focus(header.querySelector('.dds-topnav-brand'));
  else if(!mobile&&changed&&activeMenu&&doc.hasFocus())focus(menuSummary);
  panel.hidden=mobile&&!expanded;panel.inert=panel.hidden;header.dataset.ddsMobile=String(mobile);
  positionNavDropdowns(header);
 }
 const resize=new view.ResizeObserver(entries=>{for(const entry of entries){const header=entry.target.querySelector('[data-dds-topnav]');if(header)setNav(header,undefined,false,entry.contentRect.width);}});
 function syncCounter(input){const output=input.closest('.field,.editor-demo')?.querySelector('[data-count]'),text=input.value.length+(input.maxLength>0?' / '+input.maxLength:'');if(output&&output.textContent!==text)output.textContent=text;}
 function scan(){
  if(disposed)return;
  for(const [header,state]of navs)if(!owns(header)){cleanNav(header,state);resize.unobserve(state.wrapper);navs.delete(header);}
  for(const header of all('[data-dds-topnav]'))if(!navs.has(header)){const wrapper=header.closest('.dds-topnav-demo');if(wrapper){navs.set(header,{wrapper,mobile:null,open:false,lastFocused:null,hoveredMenu:null,hoverTimer:undefined,inertPanels:new Map()});setNav(header,false);resize.observe(wrapper);}}
  for(const input of all('[data-dds-counter]'))syncCounter(input);
  for(const trigger of all('.dds-menubar > .dds-menu-unit > [data-dds-menu]'))trigger.setAttribute('role','menuitem');
  for(const record of [...floating.values()])if(!owns(record.trigger))restore(record);
 }
 const mutation=new view.MutationObserver(()=>{if(!scanPending){scanPending=true;view.queueMicrotask(()=>{scanPending=false;scan();});}});
 mutation.observe(root,{childList:true,subtree:true});scan();stops.push(()=>{resize.disconnect();mutation.disconnect();});
 const pad=value=>String(value).padStart(2,'0'),iso=date=>`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
 function renderCalendar(calendar,focusDate){
  const year=Number(calendar.dataset.year),month=Number(calendar.dataset.month);if(!Number.isInteger(year)||!Number.isInteger(month))return;
  calendar.querySelector('[data-month-label]').textContent=year+'년 '+(month+1)+'월';calendar.querySelector('[data-calendar-grid]').innerHTML=serviceMarkup(calendarDays(year,month,calendar.dataset.selected||''));
  if(focusDate){const buttons=[...calendar.querySelectorAll('[data-dds-calendar-date]')],active=buttons.find(button=>button.dataset.ddsCalendarDate===focusDate);for(const button of buttons)button.tabIndex=button===active?0:-1;focus(active);}
 }
 function resizePanel(handle,value){
  const minimum=Number(handle.getAttribute('aria-valuemin')||25),maximum=Number(handle.getAttribute('aria-valuemax')||75),next=Math.max(minimum,Math.min(maximum,Math.round(value)));if(!Number.isFinite(next))return;
  handle.setAttribute('aria-valuenow',String(next));handle.parentElement.style.setProperty('--panel',next+'%');notify(handle,'resize',next);
 }
 function validateForm(form){
  let first;for(const input of form.querySelectorAll('input,select,textarea'))if(!input.disabled){const valid=input.validity.valid;input.setAttribute('aria-invalid',String(!valid));if(!valid&&!first)first=input;}
  const error=form.querySelector('[data-field-error]');if(error)error.textContent=first?first.validationMessage:'';if(first)focus(first);return !first;
 }
 function questionnaire(target,back){
  const form=target.closest('[data-dds-questionnaire]'),steps=[...form.querySelectorAll('[data-question]')],current=Number(form.dataset.step||0),next=current+(back?-1:1);
  if(!back){const invalid=[...steps[current].querySelectorAll('input,select,textarea')].find(input=>!input.disabled&&!input.validity.valid);if(invalid){invalid.setAttribute('aria-invalid','true');focus(invalid);return;}}
  if(next>=steps.length){notify(target,'questionnaire-submit',{form,values:[...new view.FormData(form).entries()]});return;}if(next<0)return;
  form.dataset.step=String(next);steps.forEach((step,index)=>step.hidden=index!==next);form.querySelector('[data-question-progress]').textContent=`${next+1} / ${steps.length} 질문`;
  const previous=form.querySelector('[data-dds-question-back]'),forward=form.querySelector('[data-dds-question-next]');previous.disabled=next===0;
  if(!questionnaireLabels.has(forward))questionnaireLabels.set(forward,forward.textContent);forward.textContent=next===steps.length-1?(forward.dataset.ddsCompleteLabel||'완료'):questionnaireLabels.get(forward);
  focus(steps[next].querySelector('input:not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled)'));notify(target,'step',next);
 }
 function click(event){
  if(!owns(event.target))return;const target=asElement(event.target).closest('button,a,summary');if(!target||target.disabled||target.getAttribute('aria-disabled')==='true')return;
  if(target.matches(primaryNavMenu+' > summary')&&hoverNavMenu(target)){
   const mouseClick=event.pointerType==='mouse'||(!event.pointerType&&event.detail>0&&!event.sourceCapabilities?.firesTouchEvents&&view.matchMedia('(any-hover: hover)').matches);
   if(mouseClick){event.preventDefault();return;}
  }
  if(target.hasAttribute('data-dds-tab'))setTab(target);
  if(target.hasAttribute('data-dds-toggle')){const on=target.getAttribute('aria-pressed')!=='true';target.setAttribute('aria-pressed',String(on));target.classList.toggle('selected',on);notify(target,'toggle',on);}
  if(target.hasAttribute('data-dds-password')){const input=target.parentElement.querySelector('input'),show=input.type==='password';input.type=show?'text':'password';const label=show?'비밀번호 숨기기':'비밀번호 표시';target.setAttribute('aria-label',label);target.setAttribute('data-tooltip',label);target.setAttribute('aria-pressed',String(show));target.innerHTML=icon(show?'EyeOff':'Eye');}
  if(target.hasAttribute('data-dds-menu')){const panel=byId(target,target.dataset.ddsMenu);floating.has(panel)?restore(floating.get(panel)):openMenu(target);}
  if(target.hasAttribute('data-dds-dialog')){const dialog=byId(target,target.dataset.ddsDialog);if(dialog){dialog.showModal();dialog.addEventListener('close',()=>focus(target),{once:true,signal});}}
  if(target.hasAttribute('data-dds-close')||target.hasAttribute('data-dds-confirm')){target.closest('dialog')?.close();if(target.hasAttribute('data-dds-confirm'))notify(target,'confirm');}
  if(target.hasAttribute('data-dds-toast')){const host=byId(target,target.dataset.ddsToast);if(host){cancel(toastTimers.get(host));const message=host.querySelector('[data-dds-toast-message]')||host;message.textContent=target.dataset.ddsMessage||message.textContent;host.hidden=false;host.classList.add('show');toastTimers.set(host,later(()=>{host.hidden=true;host.classList.remove('show');toastTimers.delete(host);},3500));}}
  if(target.hasAttribute('data-dds-dismiss')){const host=target.closest('.alert,.dds-toast,.dds-snackbar');if(host){const restore=host.contains(doc.activeElement),destination=all('[data-dds-toast]').find(node=>node.dataset.ddsToast===host.id&&!node.hidden)||focusAfterDismiss(host);host.hidden=true;host.classList.remove('show');notify(target,'dismiss');if(restore)focus(destination);}}
  if(target.hasAttribute('data-dds-popover'))openPopover(target,{takeFocus:true,toggle:!target.hasAttribute('data-dds-hover')});
  if(target.hasAttribute('data-dds-popover-close'))restore(floating.get(byId(target,target.dataset.ddsPopoverClose)),true);
  if(target.hasAttribute('data-dds-topnav-toggle'))setNav(target.closest('[data-dds-topnav]'),target.getAttribute('aria-expanded')!=='true');
  if(target.hasAttribute('data-dds-nav-language')){
   const header=target.closest('[data-dds-topnav]'),value=target.dataset.ddsNavLanguage,label=target.querySelector('span')?.textContent||target.textContent.trim();
   for(const button of header.querySelectorAll('[data-dds-nav-language]')){const selected=button===target;button.setAttribute('aria-pressed',String(selected));button.querySelector(':scope > svg')?.remove();if(selected){const template=doc.createElement('template');template.innerHTML=icon('Check');button.append(template.content);}}
   header.dataset.ddsLanguage=value;const visible=header.querySelector('[data-dds-part="language-value"]');if(visible)visible.textContent=label;
   const details=target.closest('details');setNavMenuOpen(details,false);focus(details.querySelector('summary'));const status=header.querySelector('[data-dds-nav-status]');if(status)status.textContent=label+' 선택';notify(target,'language',value);
  }
  if(target.matches('.dds-topnav-panel a'))setNav(target.closest('[data-dds-topnav]'),false);
  if(target.hasAttribute('data-dds-page')){const nav=target.closest('nav');for(const button of nav.querySelectorAll('[data-dds-page]')){button.classList.toggle('primary',button===target);button===target?button.setAttribute('aria-current','page'):button.removeAttribute('aria-current');}const out=nav.querySelector('[data-page-state]');if(out)out.textContent=target.textContent+' / '+nav.querySelectorAll('[data-dds-page]').length+' 페이지';notify(target,'page',Number(target.textContent));}
  if(target.hasAttribute('data-dds-page-shift')){
   const pager=target.closest('[data-dds-pager],.dds-pager'),output=pager.querySelector('output'),numbers=output.textContent.match(/\d+/g)||[],total=Math.max(0,Number(pager.dataset.ddsTotal??numbers[1]??0)),current=Number(pager.dataset.page??numbers[0]??0),next=total?Math.max(1,Math.min(total,current+Number(target.dataset.ddsPageShift))):0;
   pager.dataset.page=String(next);output.textContent=`${next} / ${total}`;pager.querySelector('[data-dds-page-shift="-1"]').disabled=next<=1;pager.querySelector('[data-dds-page-shift="1"]').disabled=next>=total;notify(target,'page',next);
  }
  if(target.hasAttribute('data-dds-dot')){for(const button of target.parentElement.children)button===target?button.setAttribute('aria-current','true'):button.removeAttribute('aria-current');const out=scopeOf(target).querySelector('[data-dot-result]');if(out)out.textContent=target.getAttribute('aria-label');notify(target,'slide',Array.from(target.parentElement.children).indexOf(target));}
  if(target.hasAttribute('data-dds-category')){const scope=scopeOf(target);for(const button of scope.querySelectorAll('[data-dds-category]')){button.setAttribute('aria-pressed',String(button===target));button.classList.toggle('selected',button===target);}const out=scope.querySelector('[data-category-result]');if(out)out.textContent=target.textContent.trim();notify(target,'category',target.value||target.textContent.trim());}
  if(target.hasAttribute('data-dds-calendar-date')){const calendar=target.closest('[data-dds-calendar]');calendar.dataset.selected=target.dataset.ddsCalendarDate;for(const button of calendar.querySelectorAll('[data-dds-calendar-date]')){button.setAttribute('aria-pressed',String(button===target));button.tabIndex=button===target?0:-1;}const out=calendar.querySelector('[data-date-result]');if(out)out.textContent='선택: '+target.dataset.ddsCalendarDate;notify(target,'date',target.dataset.ddsCalendarDate);}
  if(target.hasAttribute('data-dds-month-shift')){const calendar=target.closest('[data-dds-calendar]'),date=new Date(Number(calendar.dataset.year),Number(calendar.dataset.month)+Number(target.dataset.ddsMonthShift),1);calendar.dataset.year=String(date.getFullYear());calendar.dataset.month=String(date.getMonth());renderCalendar(calendar);}
  if(target.hasAttribute('data-dds-validate')){const form=target.closest('form');notify(target,'validate',validateForm(form));}
  if(target.hasAttribute('data-dds-question-next')||target.hasAttribute('data-dds-question-back'))questionnaire(target,target.hasAttribute('data-dds-question-back'));
  if(target.hasAttribute('data-dds-snack-close'))target.closest('.dds-snackbar').hidden=true;
  if(target.hasAttribute('data-dds-snack-show'))scopeOf(target).querySelector('.dds-snackbar').hidden=false;
  if(target.hasAttribute('data-dds-snack-undo'))notify(target,'undo');
  if(target.hasAttribute('data-dds-thread-bottom')){const log=target.closest('.dds-thread').querySelector('[data-thread-log]');log.scrollTop=log.scrollHeight;}
  if(target.hasAttribute('data-dds-action')){notify(target,target.dataset.ddsAction,target.dataset.ddsActionValue);const panel=target.closest('.dds-menu');if(panel)restore(floating.get(panel),true);}
 }
 doc.addEventListener('click',click,{signal});
 doc.addEventListener('input',event=>{
  const target=asElement(event.target);if(!owns(target))return;
  if(target.hasAttribute('data-dds-counter'))syncCounter(target);
  if(target.hasAttribute('data-dds-command-search')){const command=target.closest('.dds-command');let count=0;for(const item of command.querySelectorAll('.dds-command-option')){item.hidden=!item.textContent.toLocaleLowerCase().includes(target.value.toLocaleLowerCase());if(!item.hidden)count++;}command.querySelector('[data-command-empty]').hidden=count>0;}
  if(target.hasAttribute('data-dds-slider')){const minimum=Number(target.min||0),maximum=Number(target.max||100),ratio=maximum>minimum?(Number(target.value)-minimum)/(maximum-minimum)*100:0;target.style.setProperty('--value',Math.max(0,Math.min(100,ratio))+'%');const out=scopeOf(target).querySelector('output');if(out){if(!sliderSuffixes.has(out))sliderSuffixes.set(out,out.textContent.match(/[^\d.\s-]+$/)?.[0]||'');out.textContent=target.value+sliderSuffixes.get(out);}}
  if(target.hasAttribute('data-dds-otp')){target.value=target.value.replace(/\D/g,'').slice(0,6);const out=scopeOf(target).querySelector('[data-otp-status]');if(out)out.textContent=target.value.length===6?'6자리 입력 · 인증 요청 전':`${target.value.length} / 6자리 입력`;notify(target,'otp',target.value);}
 },{signal});
 doc.addEventListener('paste',event=>{
  const target=asElement(event.target);if(!owns(target)||!target.hasAttribute('data-dds-otp'))return;
  const digits=event.clipboardData?.getData('text').replace(/\D/g,'');if(digits===undefined)return;
  event.preventDefault();if(target.selectionStart!==null)target.setRangeText(digits,target.selectionStart,target.selectionEnd,'end');else target.value=digits;
  target.value=target.value.replace(/\D/g,'').slice(0,6);target.dispatchEvent(new view.Event('input',{bubbles:true}));
 },{signal});
 doc.addEventListener('change',event=>{const target=asElement(event.target);if(!owns(target))return;const time=target.closest('[data-dds-time]');if(time){const out=time.querySelector('[data-time-result]');if(!timeSuffixes.has(out))timeSuffixes.set(out,out.textContent.includes('·')?' · '+out.textContent.split('·').slice(1).join('·').trim():'');const value=[...time.querySelectorAll('select')].map(select=>select.value).join(':');out.textContent=value+timeSuffixes.get(out);notify(target,'time',value);}},{signal});
 doc.addEventListener('submit',event=>{if(!owns(event.target)||!event.target.matches('[data-dds-form],[data-dds-questionnaire]'))return;event.preventDefault();notify(event.target,'submit',{valid:validateForm(event.target),values:[...new view.FormData(event.target).entries()]});},{signal});
 doc.addEventListener('contextmenu',event=>{if(!owns(event.target))return;const context=asElement(event.target).closest('[data-dds-context]');if(context){event.preventDefault();openMenu(context.querySelector('[data-dds-menu]'),{point:{x:event.clientX,y:event.clientY},returnFocus:context});}},{signal});
 doc.addEventListener('keydown',event=>{
  if(!owns(event.target)){
   if(event.key==='Escape'&&!event.defaultPrevented&&dismissHoveredNavMenu())event.preventDefault();
   return;
  }
  const target=asElement(event.target);
  if(target.hasAttribute('data-dds-tab')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();event.stopPropagation();const tabs=[...target.closest('[role=tablist]').querySelectorAll('[data-dds-tab]:not(:disabled)')],index=tabs.indexOf(target),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setTab(tabs[next]);focus(tabs[next]);}
  if((event.shiftKey&&event.key==='F10'||event.key==='ContextMenu')&&target.closest('[data-dds-context]')){event.preventDefault();const context=target.closest('[data-dds-context]');openMenu(context.querySelector('[data-dds-menu]'),{returnFocus:context});}
  if(target.matches('.dds-resize-handle')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const rtl=view.getComputedStyle(target.parentElement).direction==='rtl',step=(event.key==='ArrowRight'?!rtl:rtl)?5:-5;resizePanel(target,event.key==='Home'?Number(target.getAttribute('aria-valuemin')||25):event.key==='End'?Number(target.getAttribute('aria-valuemax')||75):Number(target.getAttribute('aria-valuenow')||50)+step);}
  if(target.hasAttribute('data-dds-calendar-date')&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)){
   event.preventDefault();const calendar=target.closest('[data-dds-calendar]'),date=new Date(target.dataset.ddsCalendarDate+'T12:00:00');
   if(event.key==='PageUp'||event.key==='PageDown'){const nextMonth=date.getMonth()+(event.key==='PageUp'?-1:1),last=new Date(date.getFullYear(),nextMonth+1,0).getDate();date.setMonth(nextMonth,Math.min(date.getDate(),last));}else date.setDate(date.getDate()+({ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,Home:-date.getDay(),End:6-date.getDay()}[event.key]));
   calendar.dataset.year=String(date.getFullYear());calendar.dataset.month=String(date.getMonth());renderCalendar(calendar,iso(date));
  }
  const menu=target.closest('.dds-menu,.dds-command');
  const headerMenu=target.closest('.dds-topnav-menu'),headerDropdown=target.closest('.dds-topnav-dropdown');
  if(target.matches('.dds-topnav-menu > summary')&&['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();setNavMenuOpen(headerMenu,true);const items=[...headerMenu.querySelectorAll('.dds-topnav-dropdown a,.dds-topnav-dropdown button')].filter(item=>!item.disabled&&!item.hidden);focus(event.key==='ArrowUp'?items.at(-1):items[0]);}
  else if(headerDropdown&&['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const items=[...headerDropdown.querySelectorAll('a,button')].filter(item=>!item.disabled&&!item.hidden),index=items.indexOf(target),next=event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowUp'?-1:1)+items.length)%items.length;focus(items[next]);}
  if(menu&&['ArrowDown','ArrowUp','Home','End'].includes(event.key)&&!(target.matches('input')&&['Home','End'].includes(event.key))){const selector=menu.classList.contains('dds-command')?'.dds-command-option:not([hidden]):not(:disabled)':'button:not([hidden]):not(:disabled),a[href]:not([hidden])',items=[...menu.querySelectorAll(selector)],index=items.indexOf(target);if(items.length){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?items.length-1:index<0?(event.key==='ArrowUp'?items.length-1:0):(index+(event.key==='ArrowUp'?-1:1)+items.length)%items.length;focus(items[next]);}}
  if(target.hasAttribute('data-dds-menu')&&['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();openMenu(target,{last:event.key==='ArrowUp'});}
  if(target.matches('.dds-menubar [data-dds-menu]')&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();closeMenus();const items=[...target.closest('.dds-menubar').querySelectorAll('[data-dds-menu]')],index=items.indexOf(target),next=event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowRight'?1:-1)+items.length)%items.length;focus(items[next]);}
  if(event.key==='Escape'){
   const panel=target.closest('.dds-menu,.dds-popover');if(panel&&floating.has(panel)){event.preventDefault();event.stopPropagation();restore(floating.get(panel),true);return;}
   const popover=target.hasAttribute('data-dds-popover')&&byId(target,target.dataset.ddsPopover);if(popover&&floating.has(popover)){event.preventDefault();restore(floating.get(popover),true);return;}
   const command=target.closest('.dds-command');if(command){event.preventDefault();focus(command.querySelector('input'));}
   const navigation=target.closest('.dds-nav-details');if(navigation?.open){event.preventDefault();event.stopPropagation();setNavMenuOpen(navigation,false);focus(navigation.querySelector('summary'));return;}
   const header=target.closest('[data-dds-topnav]');if(header?.querySelector('[data-dds-topnav-toggle]')?.getAttribute('aria-expanded')==='true'){event.preventDefault();event.stopPropagation();setNav(header,false,true);return;}
   if(!event.defaultPrevented&&dismissHoveredNavMenu()){event.preventDefault();event.stopPropagation();}
  }
 },{signal});
 doc.addEventListener('pointerdown',event=>{
  const element=asElement(event.target);for(const [header,state]of navs)if(!header.contains(element))state.lastFocused=null;
  for(const details of all('.dds-topnav-menu[open]'))if(!details.contains(element))setNavMenuOpen(details,false);
  for(const record of [...floating.values()])if(record.kind==='menu'&&!record.panel.contains(element)&&!record.trigger.contains(element))restore(record);
  if(!owns(element))return;const handle=element.closest('.dds-resize-handle');if(handle&&(event.button===0||event.pointerType==='touch')){event.preventDefault();dragging.set(handle,event.pointerId);try{handle.setPointerCapture(event.pointerId);}catch{}}
 },{capture:true,signal});
 doc.addEventListener('pointermove',event=>{if(!owns(event.target))return;const handle=asElement(event.target).closest('.dds-resize-handle');if(!handle||dragging.get(handle)!==event.pointerId)return;const bounds=handle.parentElement.getBoundingClientRect(),ratio=(event.clientX-bounds.left)/bounds.width;resizePanel(handle,(view.getComputedStyle(handle.parentElement).direction==='rtl'?1-ratio:ratio)*100);},{signal});
 const endDrag=event=>{const handle=asElement(event.target)?.closest('.dds-resize-handle');if(handle&&dragging.get(handle)===event.pointerId){dragging.delete(handle);try{handle.releasePointerCapture(event.pointerId);}catch{}}};
 doc.addEventListener('pointerup',endDrag,{signal});doc.addEventListener('pointercancel',endDrag,{signal});doc.addEventListener('lostpointercapture',endDrag,{signal});
 doc.addEventListener('focusin',event=>{
  const element=asElement(event.target);
  for(const [header,state]of navs){if(element===doc.body){if(state.lastFocused?.getClientRects().length)state.lastFocused=null;}else state.lastFocused=header.contains(element)?element:null;}
  for(const record of [...floating.values()])if(record.kind==='menu'&&!record.panel.contains(element)&&!record.trigger.contains(element))restore(record);
  if(!owns(element))return;const trigger=element.closest('[data-dds-hover]');if(trigger)openPopover(trigger);
  const panel=element.closest('.dds-popover');if(panel&&floating.has(panel))cancel(floating.get(panel).hoverTimer);
 },{signal});
 doc.addEventListener('focusout',event=>{
  if(!owns(event.target))return;
  const element=asElement(event.target),hover=hoverNavMenu(element);
  if(hover?.menu.open&&hover.state.hoveredMenu!==hover.menu&&!hover.menu.contains(asElement(event.relatedTarget)))closeNavMenuLater(hover.menu,hover.state);
  for(const record of floating.values())if(record.kind==='popover'&&record.trigger.hasAttribute('data-dds-hover')&&(record.trigger.contains(element)||record.panel.contains(element)))closeHoverLater(record);
 },{signal});
 doc.addEventListener('pointerover',event=>{
  if(event.pointerType==='touch'||!owns(event.target))return;const element=asElement(event.target),trigger=element.closest('[data-dds-hover]');if(trigger)openPopover(trigger);
  const hover=event.pointerType==='mouse'&&hoverNavMenu(element);
  if(hover&&!hover.menu.contains(asElement(event.relatedTarget))){
   const {menu,header,state}=hover;
   const activeDropdown=doc.activeElement?.closest('.dds-topnav-menu[open] > .dds-topnav-dropdown');
   if(!activeDropdown||!header.contains(activeDropdown)||menu.contains(activeDropdown)){
    clearNavHover(state);
    state.hoveredMenu=menu;
    if(!menu.open)setNavMenuOpen(menu,true);
   }
  }
  const panel=element.closest('.dds-popover');if(panel&&floating.has(panel))cancel(floating.get(panel).hoverTimer);
 },{signal});
 doc.addEventListener('pointerout',event=>{
  if(!owns(event.target))return;
  const element=asElement(event.target),related=asElement(event.relatedTarget),hover=event.pointerType==='mouse'&&hoverNavMenu(element);
  if(hover&&hover.state.hoveredMenu===hover.menu&&!hover.menu.contains(related)){
   hover.state.hoveredMenu=null;
   if(hover.menu.open)closeNavMenuLater(hover.menu,hover.state);
  }
  for(const record of floating.values())if(record.kind==='popover'&&record.trigger.hasAttribute('data-dds-hover')&&(record.trigger.contains(element)||record.panel.contains(element))&&!record.trigger.contains(related)&&!record.panel.contains(related))closeHoverLater(record);
 },{signal});
 doc.addEventListener('toggle',event=>{const record=floating.get(event.target);if(record?.kind==='popover'&&event.newState==='closed')restore(record);if(owns(event.target)&&event.target.matches('.dds-topnav-menu'))positionNavDropdowns(event.target.closest('[data-dds-topnav]'));},{capture:true,signal});
 doc.addEventListener('close',event=>{if(!owns(event.target)||event.target.tagName!=='DIALOG')return;for(const record of [...floating.values()])if(event.target.contains(record.trigger))restore(record);},{capture:true,signal});
 const dismissMenus=()=>closeMenus(true);
 view.addEventListener('resize',()=>{dismissMenus();for(const record of [...floating.values()])if(record.kind==='popover')positionFloating(record);},{signal});
 doc.addEventListener('scroll',event=>{for(const record of floating.values())if(record.panel.contains(event.target))return;dismissMenus();for(const record of [...floating.values()])if(record.kind==='popover')positionFloating(record);},{capture:true,signal});
 if(tooltips)stops.push(mountTooltips(root,{signal,owns,priority:1,createPortal,removePortal,refreshPortal}));
 const cleanup=()=>{
  if(disposed)return;disposed=true;abort.abort();for(const timer of timers)view.clearTimeout(timer);timers.clear();
  for(const record of [...floating.values()])restore(record);for(const [handle,pointer]of dragging)try{handle.releasePointerCapture(pointer);}catch{}dragging.clear();
  for(const host of toastTimers.keys()){host.hidden=true;host.classList.remove('show');}
  for(const [header,state] of navs)cleanNav(header,state);
  for(const stop of stops)stop();for(const scope of [...portals])removePortal(scope);navs.clear();toastTimers.clear();if(bindings.get(root)===cleanup)bindings.delete(root);
 };
 bindings.set(root,cleanup);return cleanup;
}

