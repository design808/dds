import {thumbnailSceneWidth,fitThumbnailScene} from './preview-scenes.js?v=6cad35b561008178';

// Only inert gallery thumbnails are fitted. Detail examples and variants retain
// their real container width and the component's own scrolling/interaction.
const observed=new Map();
const textareaHeights=new WeakMap();
let scheduled=false;

function setStyle(element,name,value){
  if(element.style.getPropertyValue(name)!==value)element.style.setProperty(name,value);
}

function expandTextareas(scene){
  for(const input of scene.querySelectorAll('textarea')){
    if(!textareaHeights.has(input))textareaHeights.set(input,input.style.height);
    input.style.height=textareaHeights.get(input);
    if(input.scrollHeight>input.clientHeight+1){
      const css=getComputedStyle(input);
      const border=(parseFloat(css.borderTopWidth)||0)+(parseFloat(css.borderBottomWidth)||0);
      input.style.height=Math.ceil(input.scrollHeight+border)+'px';
    }
  }
}

function fit(){
  scheduled=false;
  for(const [box,record] of observed){
    const {scene,stage}=record;
    if(!box.isConnected||!box.contains(scene)){
      observer.unobserve(box);observer.unobserve(scene);observed.delete(box);continue;
    }
    const css=getComputedStyle(box);
    const width=box.clientWidth-(parseFloat(css.paddingLeft)||0)-(parseFloat(css.paddingRight)||0)-2;
    const height=box.clientHeight-(parseFloat(css.paddingTop)||0)-(parseFloat(css.paddingBottom)||0)-2;
    if(width<=0||height<=0)continue;
    const component=box.closest('[data-component]')?.dataset.component;
    setStyle(scene,'--preview-scene-width',thumbnailSceneWidth(component)+'px');
    // Wide intrinsic content (for example long chart labels) remains intact.
    // Increasing only this document scene also prevents centered left overflow.
    for(let pass=0;pass<3;pass++){
      const overflow=scene.scrollWidth-scene.clientWidth;
      if(overflow<=1)break;
      const next=parseFloat(scene.style.getPropertyValue('--preview-scene-width'))+overflow;
      setStyle(scene,'--preview-scene-width',Math.ceil(next)+'px');
    }
    expandTextareas(scene);
    const fitted=fitThumbnailScene(width,height,Math.max(scene.offsetWidth,scene.scrollWidth),Math.max(scene.offsetHeight,scene.scrollHeight));
    if(!fitted)continue;
    setStyle(stage,'width',fitted.width+'px');
    setStyle(stage,'height',fitted.height+'px');
    setStyle(scene,'--preview-scale',String(fitted.scale));
    box.dataset.previewReady='true';
  }
}

function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(fit);
}

const observer=new ResizeObserver(schedule);
function discover(){
  for(const box of document.querySelectorAll('#main .component-preview')){
    if(observed.has(box))continue;
    const scene=box.querySelector('.preview-inner.inert-preview');
    if(!scene)continue;
    const stage=document.createElement('div');
    stage.className='preview-stage';
    stage.setAttribute('aria-hidden','true');
    box.append(stage);stage.append(scene);
    observed.set(box,{scene,stage});
    observer.observe(box);observer.observe(scene);
  }
  schedule();
}

const main=document.getElementById('main');
if(main)new MutationObserver(discover).observe(main,{childList:true,characterData:true,subtree:true});
window.addEventListener('dds-design-settings-change',schedule);
document.fonts?.addEventListener('loadingdone',schedule);
document.fonts?.ready.then(schedule);
discover();
