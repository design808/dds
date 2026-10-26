// Icon actions always expose their function on hover and keyboard focus.
// Delegation also covers controls created inside dialogs, calendars and repeaters.
const selector='button,a[href],summary,[role="button"]';
let active,tip,hideTimer,hovered,focused,dismissed;
const labelOf=button=>button.getAttribute('aria-label')?.trim()
  || (button.getAttribute('aria-labelledby')||'').split(/\s+/).map(id=>document.getElementById(id)?.textContent||'').join(' ').trim()
  || button.getAttribute('title')?.trim()
  || button.querySelector('.sr-only')?.textContent.trim();
function isIconAction(button){
  if(!button?.matches(selector))return false;
  if(button.hasAttribute('data-tooltip'))return true;
  if(!button.querySelector('svg,[data-icon],.icon')&&!button.matches('.icon-btn,.control-icon'))return false;
  const copy=button.cloneNode(true);
  copy.querySelectorAll('svg,[data-icon],.icon,[hidden],.sr-only,[role="tooltip"]').forEach(x=>x.remove());
  return !copy.textContent.trim();
}
function targetOf(node){const button=node instanceof Element?node.closest(selector):null;return isIconAction(button)?button:null;}
function hide(){
  clearTimeout(hideTimer);
  if(active&&tip){const ids=(active.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==tip.id);if(ids.length)active.setAttribute('aria-describedby',ids.join(' '));else active.removeAttribute('aria-describedby');}
  tip?.remove();tip=null;active=null;
}
function position(){
  if(!active?.isConnected||!active.getClientRects().length){hide();return;}
  const r=active.getBoundingClientRect(),v=window.visualViewport;
  const x=v?.offsetLeft||0,y=v?.offsetTop||0,w=v?.width||innerWidth,h=v?.height||innerHeight;
  if(r.bottom<y||r.top>y+h){hide();return;}
  tip.style.maxWidth=Math.max(0,Math.min(280,w-24))+'px';
  const t=tip.getBoundingClientRect();
  tip.style.left=Math.max(x+12,Math.min(r.left+(r.width-t.width)/2,x+w-t.width-12))+'px';
  tip.style.top=Math.max(y+12,Math.min(r.top-t.height-8>=y+12?r.top-t.height-8:r.bottom+8,y+h-t.height-12))+'px';
}
function show(button){
  if(!button||button===dismissed)return;
  const name=labelOf(button),detail=button.getAttribute('data-tooltip');
  if(!name)return; // Missing names must be fixed in the component source.
  clearTimeout(hideTimer);
  if(active===button){position();return;}
  hide();active=button;
  if(button.hasAttribute('title')){if(!button.hasAttribute('aria-label'))button.setAttribute('aria-label',name);button.removeAttribute('title');}
  tip=document.createElement('div');tip.id='dds-icon-tooltip';tip.className='dds-icon-tooltip';tip.setAttribute('role','tooltip');
  tip.textContent=detail&&detail!==name?name+' · '+detail:name;
  tip.setAttribute('popover','manual');
  (button.closest('dialog[open]')||document.body).append(tip);
  if(tip.showPopover)tip.showPopover();
  const ids=new Set((button.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean));ids.add(tip.id);button.setAttribute('aria-describedby',[...ids].join(' '));
  position();
  tip.addEventListener('pointerenter',()=>clearTimeout(hideTimer));
  tip.addEventListener('pointerleave',()=>scheduleHide());
}
function scheduleHide(){clearTimeout(hideTimer);hideTimer=setTimeout(()=>{if(hovered===active||focused===active||tip?.matches(':hover'))return;hide();if(focused)show(focused);},120);}
document.addEventListener('pointerover',event=>{
  if(event.pointerType==='touch')return;
  const button=targetOf(event.target);if(!button)return;
  hovered=button;if(dismissed!==button)dismissed=null;show(button);
});
document.addEventListener('pointerout',event=>{
  if(!hovered||hovered.contains(event.relatedTarget))return;
  if(hovered.contains(event.target)){if(dismissed===hovered)dismissed=null;hovered=null;scheduleHide();}
});
document.addEventListener('focusin',event=>{focused=targetOf(event.target);if(focused?.matches(':focus-visible')){dismissed=null;show(focused);}else focused=null;});
document.addEventListener('focusout',()=>{focused=null;scheduleHide();});
document.addEventListener('pointerdown',()=>{dismissed=active;hide();},true);
// Capture first so Escape dismisses the tooltip before closing its parent dialog.
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&tip){event.preventDefault();event.stopImmediatePropagation();dismissed=active;hide();}},true);
document.addEventListener('close',hide,true);
window.addEventListener('scroll',()=>{if(tip)position();},true);
window.addEventListener('resize',()=>{if(tip)position();});
window.visualViewport?.addEventListener('resize',()=>{if(tip)position();});
window.visualViewport?.addEventListener('scroll',()=>{if(tip)position();});
new MutationObserver(()=>{
  if(!active)return;
  if(!active.isConnected||!isIconAction(active)){hide();return;}
  const name=labelOf(active),detail=active.getAttribute('data-tooltip');
  const text=detail&&detail!==name?name+' · '+detail:name;
  if(!text){hide();return;}if(tip.textContent!==text){tip.textContent=text;position();}
}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','aria-labelledby','data-tooltip']});
