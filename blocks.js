import {icon} from './icons.js?v=30a3948cfc3adddc';
import {components} from './catalog.js?v=30a3948cfc3adddc';
import {bindCharts} from './chart-system.js?v=30a3948cfc3adddc';
import {formBlocks,renderFormBlock,bindFormBlocks} from './block-forms.js?v=30a3948cfc3adddc';
import {contentBlocks,renderContentBlock,bindContentBlocks} from './block-content.js?v=30a3948cfc3adddc';
import {tableBlocks,renderTableBlock,bindTableBlocks} from './block-table.js?v=30a3948cfc3adddc';
import {workspaceBlocks,renderWorkspaceBlock,bindWorkspaceBlocks} from './block-workspace.js?v=30a3948cfc3adddc';
import {listBlocks,renderListBlock,bindListBlocks} from './block-list.js?v=30a3948cfc3adddc';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const blockCategories=[
  {id:'all',name:'전체'}, {id:'marketing',name:'랜딩'},
  {id:'account',name:'계정'}, {id:'workspace',name:'업무'}
];
const blockOrder=['social-proof','feature-navigation','basic-table','job-list','login','signup','dashboard','data-flow','journey-flow','cohort-retention','sidebar','notifications','settings','kanban','metric-explorer','invoice-studio','hero','content-gallery','how-it-works','pricing','faq','header','footer'];
export const blocks=[...contentBlocks,...tableBlocks,...formBlocks,...workspaceBlocks,...listBlocks].sort((a,b)=>blockOrder.indexOf(a.id)-blockOrder.indexOf(b.id));
const formIds=new Set(formBlocks.map(block=>block.id));
const tableIds=new Set(tableBlocks.map(block=>block.id));
const workspaceIds=new Set(workspaceBlocks.map(block=>block.id));
const listIds=new Set(listBlocks.map(block=>block.id));
let selectedCategory='all';
let sceneSequence=0;
const componentName=id=>components.find(component=>component.id===id)?.name||id;
const matchingBlocks=()=>blocks.filter(block=>selectedCategory==='all'||block.category===selectedCategory);

function scene(block,prefix){
  const uid=`${prefix}-${block.id}-${++sceneSequence}`;
  const html=formIds.has(block.id)?renderFormBlock(block.id,uid):tableIds.has(block.id)?renderTableBlock(block.id,uid):workspaceIds.has(block.id)?renderWorkspaceBlock(block.id,uid):listIds.has(block.id)?renderListBlock(block.id,uid):renderContentBlock(block.id,uid);
  const resolved=html.replace(/(\bsrc=["'])\/assets\//g,(_,before)=>before+new URL('./assets/',import.meta.url).href);
  return `<div class="dds-block-example">${resolved}</div>`;
}

function cards(items){
  if(!items.length)return '<div class="dds-blocks-empty"><h2>등록된 블록이 없습니다.</h2></div>';
  return items.map(block=>`<article class="dds-block-card" data-block-id="${esc(block.id)}">
    <div class="dds-block-thumbnail"><div class="dds-block-scene" inert aria-hidden="true">${scene(block,'thumbnail')}</div></div>
    <div class="dds-block-card-caption"><h2>${esc(block.title)}</h2><span class="dds-block-expand" aria-hidden="true">${icon('Expand')}</span></div>
    <button type="button" class="dds-block-card-trigger" data-block-open="${esc(block.id)}" aria-label="${esc(block.title)} 크게 보기"></button>
  </article>`).join('');
}

export function blocksPage(){
  const requested=new URLSearchParams(globalThis.location?.hash.split('?')[1]||'').get('block');
  if(requested&&blocks.some(block=>block.id===requested)&&!matchingBlocks().some(block=>block.id===requested))selectedCategory='all';
  const matches=matchingBlocks();
  return `<div class="dds-blocks-page-content">
    <h1 class="sr-only">블록</h1>
    <div class="dds-blocks-toolbar">
      <div class="segmented dds-blocks-filters" role="tablist" aria-label="블록 분류">${blockCategories.map(category=>`<button type="button" role="tab" id="block-category-${category.id}" aria-selected="${category.id===selectedCategory}" aria-controls="block-results" tabindex="${category.id===selectedCategory?0:-1}" data-block-category="${category.id}">${category.name}</button>`).join('')}</div>
    </div>
    <div class="dds-blocks-grid" id="block-results" role="tabpanel" aria-labelledby="block-category-${selectedCategory}">${cards(matches)}</div>
    <dialog class="dds-block-dialog" id="dds-block-dialog" aria-labelledby="dds-block-dialog-title" data-device="desktop">
      <header class="dds-block-dialog-header"><h2 id="dds-block-dialog-title"></h2>
        <div class="segmented dds-block-device-tabs" role="tablist" aria-label="블록 화면 크기"><button type="button" role="tab" id="block-device-desktop" aria-selected="true" tabindex="0" aria-controls="dds-block-preview" data-block-device="desktop">PC</button><button type="button" role="tab" id="block-device-mobile" aria-selected="false" tabindex="-1" aria-controls="dds-block-preview" data-block-device="mobile">모바일</button></div>
        <button type="button" class="dds-block-dialog-close" data-block-close aria-label="블록 닫기">${icon('X')}</button>
      </header>
      <div class="dds-block-dialog-body"><div class="dds-block-viewport" id="dds-block-preview" role="tabpanel" aria-labelledby="block-device-desktop"><div data-block-expanded></div></div></div>
      <footer class="dds-block-dialog-footer"><span>사용한 컴포넌트</span><div data-block-components></div></footer>
    </dialog>
  </div>`;
}

export function bindBlocks(root){
  const results=root?.querySelector('#block-results');
  if(!results)return ()=>{};
  const controller=new AbortController();
  const signal=controller.signal;
  const dialog=root.querySelector('#dds-block-dialog');
  const expanded=root.querySelector('[data-block-expanded]');
  let cleanupExample=()=>{};
  let cleanupGalleryCharts=()=>{};
  let returnFocus;
  let closingTimer;
  let fitFrame;
  let disposed=false;
  const observed=new Set();
  const fit=()=>{
    fitFrame=undefined;
    for(const frame of observed){
      if(!frame.isConnected){resize.unobserve(frame);observed.delete(frame);continue;}
      const picture=frame.querySelector('.dds-block-scene');
      if(!picture)continue;
      const scale=Math.min(1,(frame.clientWidth-32)/Math.max(picture.scrollWidth,picture.offsetWidth));
      picture.style.setProperty('--block-preview-scale',String(Math.max(.1,scale)));
      picture.style.setProperty('--block-preview-top',`${Math.max(16,(frame.clientHeight-picture.offsetHeight*scale)/2)}px`);
    }
  };
  const scheduleFit=()=>{if(!fitFrame&&!disposed)fitFrame=requestAnimationFrame(fit);};
  const resize=new ResizeObserver(scheduleFit);
  function discover(){
    for(const frame of results.querySelectorAll('.dds-block-thumbnail'))if(!observed.has(frame)){
      observed.add(frame);resize.observe(frame);resize.observe(frame.querySelector('.dds-block-scene'));
    }
    scheduleFit();
  }
  const update=()=>{
    const matches=matchingBlocks();
    cleanupGalleryCharts?.();
    resize.disconnect();observed.clear();
    results.innerHTML=cards(matches);
    results.setAttribute('aria-labelledby',`block-category-${selectedCategory}`);
    discover();cleanupGalleryCharts=bindCharts(results);
  };
  const setDevice=device=>{
    dialog.dataset.device=device;
    root.querySelector('#dds-block-preview').setAttribute('aria-labelledby',`block-device-${device}`);
    root.querySelectorAll('[data-block-device]').forEach(button=>{
      const selected=button.dataset.blockDevice===device;
      button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;
    });
  };
  const close=()=>{if(dialog.open)dialog.close();};
  const open=(id,trigger)=>{
    const block=blocks.find(item=>item.id===id);
    if(!block)return;
    clearTimeout(closingTimer);cleanupExample();
    returnFocus=trigger;
    dialog.querySelector('h2').textContent=block.title;
    expanded.innerHTML=scene(block,'expanded');
    root.querySelector('[data-block-components]').innerHTML=block.components.map(id=>`<a class="chip" href="#/components/${esc(id)}">${esc(componentName(id))}</a>`).join('');
    const stopForms=bindFormBlocks(expanded),stopContent=bindContentBlocks(expanded),stopTable=bindTableBlocks(expanded),stopWorkspace=bindWorkspaceBlocks(expanded),stopLists=bindListBlocks(expanded);
    const stopCharts=bindCharts(expanded);
    cleanupExample=()=>{stopForms?.();stopContent?.();stopTable?.();stopWorkspace?.();stopLists?.();stopCharts?.();};
    setDevice('desktop');
    if(!dialog.open)dialog.showModal();
    root.querySelector('[data-block-close]').focus({preventScroll:true});
  };
  root.addEventListener('click',event=>{
    const opener=event.target.closest('[data-block-open]');
    if(opener){open(opener.dataset.blockOpen,opener);return;}
    const category=event.target.closest('[data-block-category]');
    if(category){
      selectedCategory=category.dataset.blockCategory;
      root.querySelectorAll('[data-block-category]').forEach(button=>{const selected=button===category;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});
      update();return;
    }
    const device=event.target.closest('[data-block-device]');
    if(device){setDevice(device.dataset.blockDevice);return;}
    if(event.target.closest('[data-block-close]'))close();
  },{signal});
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();
  },{signal});
  dialog.addEventListener('close',()=>{
    cleanupExample();cleanupExample=()=>{};
    if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
    closingTimer=setTimeout(()=>{if(!dialog.open)expanded.replaceChildren();},220);
  },{signal});
  discover();document.fonts?.ready.then(scheduleFit);
  const requested=new URLSearchParams(window.location.hash.split('?')[1]||'').get('block');
  if(requested&&blocks.some(block=>block.id===requested))open(requested,results.querySelector('[data-block-open="'+requested+'"]'));
  window.addEventListener('dds-design-settings-change',scheduleFit,{signal});
  return ()=>{
    disposed=true;controller.abort();cleanupExample();cleanupGalleryCharts?.();clearTimeout(closingTimer);
    if(fitFrame)cancelAnimationFrame(fitFrame);
    resize.disconnect();if(dialog.open)dialog.close();
  };
}
