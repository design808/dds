// Fit each complete component scene into its thumbnail without clipping.
const observed=new Set();
let scheduled=false;
function fit(){
 scheduled=false;
 for(const box of observed){
  if(!box.isConnected){observer.unobserve(box);observed.delete(box);continue;}
  const scene=box.querySelector('.preview-inner');if(!scene)continue;
  const css=getComputedStyle(box);
  const w=box.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight);
  const h=box.clientHeight-parseFloat(css.paddingTop)-parseFloat(css.paddingBottom);
  if(!w||!h)continue;
  const scale=Math.min(1,w/Math.max(scene.offsetWidth,scene.scrollWidth),h/Math.max(scene.offsetHeight,scene.scrollHeight));
  box.style.setProperty('--preview-scale',String(Math.max(.1,scale)));
 }
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(fit);}}
const observer=new ResizeObserver(schedule);
function discover(){for(const box of document.querySelectorAll('.component-preview'))if(!observed.has(box)){observed.add(box);observer.observe(box);}schedule();}
new MutationObserver(discover).observe(document.getElementById('main'),{childList:true,subtree:true});
document.fonts.ready.then(schedule);discover();
