import {icon} from './icons.js?v=54c3eb9808c7bdad';
import {components} from './catalog.js?v=54c3eb9808c7bdad';
import {collectionCount} from './visibility.js?v=54c3eb9808c7bdad';
import {bindCharts} from './chart-system.js?v=54c3eb9808c7bdad';
import {formBlocks,renderFormBlock,bindFormBlocks} from './block-forms.js?v=54c3eb9808c7bdad';
import {contentBlocks,renderContentBlock,bindContentBlocks} from './block-content.js?v=54c3eb9808c7bdad';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const blockCategories=[
  {id:'all',name:'전체'}, {id:'marketing',name:'랜딩'},
  {id:'account',name:'계정'}, {id:'workspace',name:'업무'}, {id:'data',name:'데이터'}
];
export const blocks=[...contentBlocks.filter(b=>b.category==='marketing'),...formBlocks,...contentBlocks.filter(b=>b.category!=='marketing')];
const formIds=new Set(formBlocks.map(block=>block.id));
let selectedCategory='all';
let searchValue='';
let sceneSequence=0;
const componentName=id=>components.find(component=>component.id===id)?.name||id;
const categoryName=id=>blockCategories.find(category=>category.id===id)?.name||id;
const matchingBlocks=()=>blocks.filter(block=>(selectedCategory==='all'||block.category===selectedCategory)&&
  `${block.title} ${block.description} ${block.components.map(componentName).join(' ')}`.toLowerCase().includes(searchValue.trim().toLowerCase()));

function scene(block,prefix){
  const uid=`${prefix}-${block.id}-${++sceneSequence}`;
  const html=formIds.has(block.id)?renderFormBlock(block.id,uid):renderContentBlock(block.id,uid);
  return `<div class="dds-block-example">${html}</div>`;
}

function cards(items){
  if(!items.length)return '<div class="dds-blocks-empty"><h2>일치하는 블록이 없습니다.</h2><p>다른 검색어를 입력하거나 전체 분류를 선택해 주세요.</p></div>';
  return items.map(block=>`<article class="dds-block-card">
    <div class="dds-block-thumbnail"><div class="dds-block-scene" inert aria-hidden="true">${scene(block,'thumbnail')}</div></div>
    <div class="dds-block-card-caption"><div><span class="dds-block-category">${esc(categoryName(block.category))}</span><h2>${esc(block.title)}</h2></div><span class="dds-block-expand" aria-hidden="true">${icon('Expand')}</span></div>
    <p class="dds-block-card-description">${esc(block.description)}</p>
    <button type="button" class="dds-block-card-trigger" data-block-open="${esc(block.id)}" aria-label="${esc(block.title)} 크게 보기"></button>
  </article>`).join('');
}

export function blocksPage(){
  const matches=matchingBlocks();
  return `<div class="dds-blocks-page-content">
    <div class="page-heading"><div><h1>블록</h1><p class="lead">DDS 컴포넌트를 조합한 화면 구성 예시입니다.</p></div></div>
    <div class="dds-blocks-toolbar">
      <div class="segmented dds-blocks-filters" role="tablist" aria-label="블록 분류">${blockCategories.map(category=>`<button type="button" role="tab" id="block-category-${category.id}" aria-selected="${category.id===selectedCategory}" aria-controls="block-results" tabindex="${category.id===selectedCategory?0:-1}" data-block-category="${category.id}">${category.name}</button>`).join('')}</div>
      <div class="dds-blocks-search"><label class="sr-only" for="block-search">블록 검색</label><div class="search-field" data-control-size="sm">${icon('Search')}<input type="search" id="block-search" value="${esc(searchValue)}" placeholder="블록 검색" autocomplete="off"></div></div>
    </div>
    <div class="dds-blocks-results-heading"><span>블록</span><span data-block-count aria-live="polite">${collectionCount(matches.length,{label:'블록'})}</span></div>
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
    resize.disconnect();observed.clear();
    results.innerHTML=cards(matches);
    results.setAttribute('aria-labelledby',`block-category-${selectedCategory}`);
    root.querySelector('[data-block-count]').innerHTML=collectionCount(matches.length,{label:'블록'});
    discover();bindCharts(results);
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
    const stopForms=bindFormBlocks(expanded),stopContent=bindContentBlocks(expanded);
    cleanupExample=()=>{stopForms?.();stopContent?.();};
    bindCharts(expanded);setDevice('desktop');
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
  root.querySelector('#block-search').addEventListener('input',event=>{searchValue=event.target.value;update();},{signal});
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
  window.addEventListener('dds-design-settings-change',scheduleFit,{signal});
  return ()=>{
    disposed=true;controller.abort();cleanupExample();clearTimeout(closingTimer);
    if(fitFrame)cancelAnimationFrame(fitFrame);
    resize.disconnect();if(dialog.open)dialog.close();
  };
}
