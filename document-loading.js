// Critical, document-only bootstrap. The build embeds this function and the
// shared layout renderers in index.html, before the application module loads.
export function bootDocumentLoading(data, templates) {
  const doc=document, root=doc.documentElement, main=doc.getElementById('main');
  if(!main)return;
  const read=key=>{try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
  const settings=read('dds-design-settings-v1')||{};
  let theme='light';
  try{if(localStorage.getItem('deep-theme')==='dark')theme='dark';}catch{}
  root.dataset.theme=theme;
  const releaseBadge=doc.querySelector('[data-dds-release]');
  if(releaseBadge){releaseBadge.textContent='v'+data.release;releaseBadge.setAttribute('aria-label','DDS 버전 '+data.release);}
  root.dataset.ddsBootstrap='';
  const font=value=>data.fonts.find(item=>item.value===value)||data.fonts[0];
  const bodyFont=font(settings.bodyFont),headingFont=font(settings.headingFont);
  const color=(value,fallback)=>typeof value==='string'&&/^#[a-f\d]{6}$/i.test(value)?value:fallback;
  const canvas=color(settings[theme==='dark'?'pageBackgroundDark':'pageBackground'],theme==='dark'?'#17191C':'#FDFDFD');
  const preferenceStyle=doc.createElement('style');
  preferenceStyle.id='dds-bootstrap-preferences';
  preferenceStyle.textContent=`html[data-dds-bootstrap]{--font-sans:${bodyFont.family};--font-heading:${headingFont.family};--page-background:${canvas};--workspace-background:var(--page-background)}html[data-dds-bootstrap] body{background:var(--page-background)}html[data-dds-bootstrap] :is(h1,h2,h3,h4,h5,h6){font-family:var(--font-heading)}`;
  doc.head.append(preferenceStyle);
  for(const chosen of new Set([bodyFont.value,headingFont.value])){
    const sheet=data.fontSheets[chosen];
    if(!sheet)continue;
    const href=new URL(sheet,doc.baseURI).href;
    if([...doc.querySelectorAll('link[rel=stylesheet]')].some(link=>link.href===href))continue;
    const link=doc.createElement('link');link.rel='stylesheet';link.href=href;doc.head.append(link);
  }
  const status=doc.createElement('span');
  status.id='dds-document-loading-status';status.className='sr-only';status.setAttribute('role','status');
  status.textContent='문서를 불러오는 중입니다.';main.before(status);
  const arrow='<span class="icon" aria-hidden="true"></span>';
  const icon=()=>arrow;
  const card=component=>templates.componentCardStructure(component,'',arrow);
  function blocksMarkup(){
    return `<div class="dds-blocks-page-content"><h1 class="sr-only">블록</h1><div class="dds-blocks-toolbar"><div class="segmented dds-blocks-filters" role="tablist" aria-label="블록 분류">${data.blockCategories.map((category,index)=>`<button type="button" role="tab" aria-selected="${index===0}" tabindex="-1">${templates.escapeHTML(category.name)}</button>`).join('')}</div></div><div class="dds-blocks-grid">${data.blocks.map(block=>`<article class="dds-block-card" data-block-id="${templates.escapeHTML(block.id)}"><div class="dds-block-thumbnail"></div><div class="dds-block-card-caption"><h2>${templates.escapeHTML(block.title)}</h2><span class="dds-block-expand" aria-hidden="true">${arrow}</span></div></article>`).join('')}</div></div>`;
  }
  function maskText(){
    const walker=doc.createTreeWalker(main,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()){
      const node=walker.currentNode;
      if(!node.textContent.trim()||node.parentElement.closest('script,style,textarea,option,svg,.sr-only'))continue;
      nodes.push(node);
    }
    // A custom tag avoids matching component rules such as `.stepper span`.
    for(const node of nodes){const text=doc.createElement('dds-skeleton-text');text.className='dds-skeleton-text';node.replaceWith(text);text.append(node);}
  }
  function render(){
    if(main.getAttribute('aria-busy')!=='true')return;
    let route=(location.hash.slice(1)||'/').split('?')[0];
    if(route==='/directions')route='/';
    if(route.startsWith('/components/')){
      const id=route.slice('/components/'.length);
      if(data.aliases[id])route='/components/'+data.aliases[id];
    }
    doc.body.classList.toggle('dds-blocks-page',route==='/blocks');
    main.dataset.ddsLoading=route;
    main.inert=true;
    if(route==='/')main.innerHTML=templates.overviewStructure(id=>card(data.components.find(c=>c.id===id)),icon);
    else if(route==='/components')main.innerHTML=templates.componentIndexStructure({...data,selectedGroup:'All'},card,icon);
    else if(route==='/blocks')main.innerHTML=blocksMarkup();
    else main.innerHTML=data.pages[route]||data.notFound;
    doc.getElementById('sidebar').innerHTML=templates.sidebarStructure(route,data);
    const active=route.startsWith('/foundations')?'foundations':route.startsWith('/components')?'components':route==='/blocks'?'blocks':['/handoff','/setup'].includes(route)?'handoff':'overview';
    for(const link of doc.querySelectorAll('.topbar nav a')){
      link.classList.toggle('active',link.dataset.top===active);
      if(link.dataset.top===active)link.setAttribute('aria-current',link.getAttribute('href').slice(1)===route?'page':'location');
      else link.removeAttribute('aria-current');
    }
    maskText();
  }
  render();
  addEventListener('hashchange',render);
  const observer=new MutationObserver(()=>{
    if(main.getAttribute('aria-busy')!=='true'){
      doc.getElementById('dds-document-loading-status')?.remove();
      removeEventListener('hashchange',render);
    }
    if(root.dataset.ddsSettingsReady==='true'){
      preferenceStyle.remove();root.removeAttribute('data-dds-bootstrap');
    }
    if(main.getAttribute('aria-busy')!=='true'&&root.dataset.ddsSettingsReady==='true')observer.disconnect();
  });
  observer.observe(main,{attributes:true,attributeFilter:['aria-busy']});
  observer.observe(root,{attributes:true,attributeFilter:['data-dds-settings-ready']});
}
