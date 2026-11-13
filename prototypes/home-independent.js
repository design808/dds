// The landing page only introduces the service and links to the writing flow.
document.querySelectorAll('[data-icon]').forEach(node => {
 const glyph = window.lucide.icons[node.dataset.icon];
 if (glyph) node.replaceWith(window.lucide.createElement(glyph, {class:'icon', 'stroke-width':1.7, 'aria-hidden':'true', focusable:'false'}));
});

(() => {
 const header=document.querySelector('.site-header'),toggle=document.querySelector('#independent-mobile-nav'),nav=document.querySelector('#independent-service-nav');
 const desktopNavigation=matchMedia('(min-width:701px)');
 let headerFocus=null;
 document.addEventListener('focusin',event=>{if(event.target!==document.body)headerFocus=header.contains(event.target)?event.target:null;});
 document.addEventListener('pointerdown',event=>{if(!header.contains(event.target))headerFocus=null;});
 const setMenu=(open,restoreFocus=false)=>{
  header.classList.toggle('nav-open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');
  toggle.replaceChildren(window.lucide.createElement(window.lucide.icons[open?'X':'Menu'],{class:'icon','stroke-width':1.7,'aria-hidden':'true',focusable:'false'}));
  if(restoreFocus)toggle.focus({preventScroll:true});
 };
 const resetMenu=()=>{headerFocus=null;if(header.classList.contains('nav-open'))setMenu(false);};
 for(const type of ['pagehide','popstate','hashchange'])window.addEventListener(type,resetMenu);
 window.addEventListener('pageshow',event=>{if(event.persisted)resetMenu();});
 toggle.addEventListener('click',()=>setMenu(!header.classList.contains('nav-open')));
 header.addEventListener('keydown',event=>{if(event.key==='Escape'&&header.classList.contains('nav-open')){event.preventDefault();event.stopPropagation();setMenu(false,true);}});
 nav.addEventListener('click',event=>{if(event.target.closest('a')&&header.classList.contains('nav-open'))setMenu(false,true);});
 desktopNavigation.addEventListener('change',event=>{
  const active=header.contains(document.activeElement)?document.activeElement:document.activeElement===document.body?headerFocus:null,inNav=!!active&&nav.contains(active),wasToggle=active===toggle;
  setMenu(false);
  if(!event.matches&&inNav)toggle.focus({preventScroll:true});
  else if(event.matches&&wasToggle)nav.querySelector('a')?.focus({preventScroll:true});
 });
})();
