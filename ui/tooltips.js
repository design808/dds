// Shared tooltip interaction for explicit SDK roots and the document bootstrap.
// Importing this module does not read or modify the ambient document.
let tooltipId=0;
const documentBindings=new WeakMap();
const actionSelector='button,a[href],summary,[role="button"]';
const navigationKeys=new Set(['Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End']);
const elementOf=node=>node?.nodeType===1?node:node?.parentElement;

/** Hover and deliberate keyboard navigation only; native/programmatic focus is silent. */
export function mountTooltips(root,{signal,owns=node=>root.contains(node),priority=0,createPortal,removePortal,refreshPortal}={}){
 if(!root?.ownerDocument||!root.addEventListener)throw new TypeError('Tooltips require an explicit root element.');
 if(signal?.aborted)return ()=>{};
 const doc=root.ownerDocument,view=doc.defaultView,abort=new view.AbortController(),events={signal:abort.signal};
 const bindings=documentBindings.get(doc)||new Set();documentBindings.set(doc,bindings);
 const binding={root,owns,priority,reconcile:()=>{if(active&&!ownsAction(active))hide();}};
 // The document bootstrap is a fallback. Explicit SDK roots own their actions,
 // including portals, so loading both entry points never creates duplicate tips.
 function ownsAction(node){
  if(!owns(node))return false;
  for(const other of bindings)if(other!==binding&&other.owns(node)
   &&(other.priority>priority||(other.priority===priority&&root!==other.root&&root.contains(other.root))))return false;
  return true;
 }
 let active,tip,scope,hovered,focused,overTip=false,hideTimer,navigationTimer,navigating=false,disposed=false,lastName,lastDetail;
 const dismissed=new WeakSet();
 const nameOf=button=>button.getAttribute('aria-label')?.trim()
  ||(button.getAttribute('aria-labelledby')||'').split(/\s+/).map(id=>doc.getElementById(id)?.textContent||'').join(' ').trim()
  ||button.getAttribute('title')?.trim()||button.querySelector('.sr-only')?.textContent.trim()||'';
 const isAction=button=>{
  if(!button?.matches(actionSelector)||!ownsAction(button)||button.hasAttribute('data-tooltip-disabled'))return false;
  if(button.hasAttribute('data-tooltip'))return true;
  if(!button.querySelector('svg,[data-icon],.icon')&&!button.matches('.icon-btn,.control-icon'))return false;
  const copy=button.cloneNode(true);
  copy.querySelectorAll('svg,[data-icon],.icon,[hidden],.sr-only,[role="tooltip"]').forEach(node=>node.remove());
  return !copy.textContent.trim();
 };
 const targetOf=node=>{const button=elementOf(node)?.closest(actionSelector);return isAction(button)?button:null;};
 const valid=button=>{
  if(!button?.isConnected||!isAction(button)||!button.getClientRects().length||button.closest('[hidden],[inert]'))return false;
  const visibility=view.getComputedStyle(button).visibility;if(visibility==='hidden'||visibility==='collapse')return false;
  // showModal makes the background inert without adding an [inert] attribute.
  // Its focused dialog identifies the currently active modal, including nesting.
  const dialog=doc.activeElement?.closest('dialog[open]');
  if(dialog&&!dialog.contains(button)){try{if(dialog.matches(':modal'))return false;}catch{return false;}}
  return true;
 };
 const cancelHide=()=>{view.clearTimeout(hideTimer);hideTimer=undefined;};
 function hide(){
  cancelHide();
  if(active&&tip){
   const ids=(active.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==tip.id);
   ids.length?active.setAttribute('aria-describedby',ids.join(' ')):active.removeAttribute('aria-describedby');
  }
  tip?.remove();if(scope&&removePortal)removePortal(scope);
  active=tip=scope=null;overTip=false;
 }
 function dismiss(){
  for(const button of [active,hovered,focused])if(button)dismissed.add(button);
  hide();
 }
 function position(){
  if(!valid(active))return hide();
  refreshPortal?.(scope,active);
  const anchor=active.getBoundingClientRect(),viewport=view.visualViewport;
  const x=viewport?.offsetLeft||0,y=viewport?.offsetTop||0,width=viewport?.width||view.innerWidth,height=viewport?.height||view.innerHeight;
  if(anchor.bottom<y||anchor.top>y+height||anchor.right<x||anchor.left>x+width)return dismiss();
  tip.style.maxWidth=Math.max(0,Math.min(280,width-24))+'px';
  const bounds=tip.getBoundingClientRect();
  tip.style.left=Math.max(x+12,Math.min(anchor.left+(anchor.width-bounds.width)/2,x+width-bounds.width-12))+'px';
  tip.style.top=Math.max(y+12,Math.min(anchor.top-bounds.height-8>=y+12?anchor.top-bounds.height-8:anchor.bottom+8,y+height-bounds.height-12))+'px';
 }
 function update(){
  if(!valid(active))return hide();
  const name=nameOf(active);let detail=active.getAttribute('data-tooltip')||'';
  // Toggle actions often update aria-label first. Keep a copied old label in sync,
  // while retaining deliberately different explanatory tooltip text.
  if(name!==lastName&&detail===lastDetail&&detail===lastName){detail=name;active.setAttribute('data-tooltip',name);}
  lastName=name;lastDetail=detail;
  const text=name&&detail&&detail!==name?name+' · '+detail:detail||name;
  if(!text)return hide();
  if(tip.textContent!==text)tip.textContent=text;
  position();
 }
 function show(button){
  if(!valid(button)||dismissed.has(button))return;
  cancelHide();if(active===button)return update();
  const name=nameOf(button),detail=button.getAttribute('data-tooltip')||'';if(!name&&!detail)return;
  hide();active=button;lastName=name;lastDetail=detail;
  if(button.hasAttribute('title')){if(!button.hasAttribute('aria-label')&&name)button.setAttribute('aria-label',name);button.removeAttribute('title');}
  scope=createPortal?createPortal(button):(button.closest('dialog[open],[popover]:popover-open')||doc.body);
  tip=doc.createElement('div');tip.id='dds-icon-tooltip-'+(++tooltipId);tip.className='dds-icon-tooltip';tip.setAttribute('role','tooltip');tip.setAttribute('popover','manual');
  scope.append(tip);
  // The manual top layer prevents clipping by modal, popover and scroll containers.
  try{tip.showPopover?.();}catch{/* Fixed positioning remains available without the Popover API. */}
  const ids=new Set((button.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean));ids.add(tip.id);button.setAttribute('aria-describedby',[...ids].join(' '));
  update();
 }
 function scheduleHide(){
  cancelHide();hideTimer=view.setTimeout(()=>{
   if(active&&(hovered===active||focused===active||overTip))return;
   hide();show(hovered||focused);
  },120);
 }
 function reset(){dismiss();hovered=focused=null;navigating=false;view.clearTimeout(navigationTimer);}
 doc.addEventListener('pointerover',event=>{
  if(event.pointerType==='touch')return;
  if(tip?.contains(event.target)){overTip=true;cancelHide();return;}
  const button=targetOf(event.target);if(!button)return;
  // Descendant pointer transitions are not a new hover after Escape or a click.
  const entering=hovered!==button&&!button.contains(elementOf(event.relatedTarget));
  hovered=button;if(entering)dismissed.delete(button);show(button);
 },events);
 doc.addEventListener('pointerout',event=>{
  const related=elementOf(event.relatedTarget);
  if(tip?.contains(event.target)&&!tip.contains(related)){overTip=false;scheduleHide();}
  if(!hovered||!hovered.contains(elementOf(event.target))||hovered.contains(related))return;
  hovered=null;scheduleHide();
 },events);
 doc.addEventListener('focusin',event=>{
  if(active&&!valid(active))hide();
  const button=targetOf(event.target);
  // :focus-visible also matches showModal autofocus and script-driven focus.
  // Only a Tab/arrow navigation event in this task authorizes a focus tooltip.
  focused=navigating?button:null;
  if(focused){dismissed.delete(focused);show(focused);}else scheduleHide();
 },events);
 doc.addEventListener('focusout',event=>{
  if(focused?.contains(elementOf(event.target))&&!focused.contains(elementOf(event.relatedTarget))){focused=null;scheduleHide();}
 },events);
 doc.addEventListener('pointerdown',()=>{navigating=false;focused=null;view.clearTimeout(navigationTimer);dismiss();},{...events,capture:true});
 doc.addEventListener('touchstart',reset,{...events,capture:true,passive:true});
 doc.addEventListener('pointercancel',reset,events);
 view.addEventListener('keydown',event=>{
  navigating=navigationKeys.has(event.key)&&!event.altKey&&!event.ctrlKey&&!event.metaKey;
  view.clearTimeout(navigationTimer);
  if(navigating)navigationTimer=view.setTimeout(()=>{navigating=false;},0);
  if(event.key!=='Escape'||!tip)return;
  const header=elementOf(event.target)?.closest('[data-dds-topnav]');
  const headerLayer=header?.querySelector('.dds-topnav-menu[open],[data-dds-topnav-toggle][aria-expanded="true"]');
  dismiss();
  // An expanded header closes on the same Escape; a tooltip in a dialog is
  // dismissed first, leaving the dialog's next Escape available to close it.
  if(!headerLayer){event.preventDefault();event.stopPropagation();}
 },{...events,capture:true});
 doc.addEventListener('close',event=>{if(event.target.tagName==='DIALOG')reset();},{...events,capture:true});
 doc.addEventListener('toggle',event=>{if(event.target===tip&&event.newState==='closed')dismiss();},{...events,capture:true});
 doc.addEventListener('scroll',dismiss,{...events,capture:true});
 view.addEventListener('blur',reset,events);
 view.addEventListener('pagehide',reset,events);
 view.addEventListener('hashchange',reset,events);
 view.addEventListener('popstate',reset,events);
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)reset();},events);
 const reposition=()=>{if(active)position();};
 view.addEventListener('resize',reposition,events);
 view.visualViewport?.addEventListener('resize',reposition,events);
 view.visualViewport?.addEventListener('scroll',dismiss,events);
 doc.fonts?.addEventListener('loadingdone',reposition,events);
 const observer=new view.MutationObserver(records=>{
  // Position and inherited tokens write to our own tooltip/portal styles. Ignore
  // those records while still handling class/style visibility changes elsewhere.
  if(active&&records.some(record=>!tip?.contains(record.target)&&!(createPortal&&record.target===scope)))update();
 });
 observer.observe(doc.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','aria-labelledby','data-tooltip','data-tooltip-disabled','title','hidden','inert','open','class','style']});
 function dispose(){
  if(disposed)return;disposed=true;abort.abort();observer.disconnect();view.clearTimeout(navigationTimer);hide();hovered=focused=null;
  bindings.delete(binding);if(!bindings.size)documentBindings.delete(doc);
  signal?.removeEventListener('abort',dispose);
 }
 bindings.add(binding);for(const other of bindings)if(other!==binding)other.reconcile();
 signal?.addEventListener('abort',dispose,{once:true});
 return dispose;
}
