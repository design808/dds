// Animate only a user-selected tab's content, never the page or the tab width.
document.addEventListener('click',event=>{
 const trigger=event.target.closest('[data-demo-tab],[data-doc-tab]');
 if(!trigger)return;
 requestAnimationFrame(()=>{
  const panel=trigger.hasAttribute('data-demo-tab')
   ? trigger.closest('.tab-demo')?.querySelector('[role=tabpanel]')
   : document.querySelector('[data-doc-panel]:not([hidden])');
  if(!panel)return;
  panel.getAnimations().forEach(animation=>animation.cancel());
  panel.animate([{opacity:.5},{opacity:1}],{duration:180,easing:'cubic-bezier(.16,1,.3,1)'});
 });
});
