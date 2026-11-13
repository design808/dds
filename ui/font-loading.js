/* Load this classic script in the document head to prepare the first DDS view. */
(() => {
  const script=document.currentScript;
  if(!script?.hasAttribute('data-dds-font-loading')||!document.fonts)return;

  const page=document.documentElement;
  const state='data-dds-font-loading';
  const region='[data-dds-font-content]';
  if(page.hasAttribute(state))return;
  page.setAttribute(state,'pending');
  page.setAttribute('data-dds-font-skeleton-active','');
  const events=new AbortController();
  let canvas,context,frame,observer;
  let finished=false;
  const deadline=setTimeout(()=>finish('fallback'),1800);

  function finish(result){
    if(finished)return;
    finished=true;
    clearTimeout(deadline);
    events.abort();
    observer?.disconnect();
    cancelAnimationFrame(frame);
    page.setAttribute(state,result==='fallback'?'fallback':'settling');
    const reveal=()=>{
      canvas?.remove();
      page.removeAttribute('data-dds-font-skeleton-active');
      if(result!=='fallback')page.removeAttribute(state);
    };
    if(!context){reveal();return;}
    try{paint();}catch{reveal();return;}
    // Let the skeleton paint in the final geometry before exposing the content.
    requestAnimationFrame(()=>requestAnimationFrame(reveal));
  }

  function roots(){
    return [...document.querySelectorAll(region)].filter(root=>!root.parentElement?.closest(region));
  }

  const block='button,summary,input,select,textarea,progress,meter,.badge,.chip,.custom-control,img,svg,canvas,video,iframe';
  const surface='.dds-content-card,.sample-document,.dds-panel,.dds-chart-plot,[data-dds-skeleton-block]';
  const ignored='script,style,template,noscript,option,[hidden],.sr-only,details:not([open]) > :not(summary)';
  function paint(){
    const width=page.clientWidth,height=window.innerHeight,ratio=Math.min(devicePixelRatio||1,2);
    if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){
      canvas.width=Math.round(width*ratio);
      canvas.height=Math.round(height*ratio);
    }
    context.setTransform(ratio,0,0,ratio,0,0);
    context.clearRect(0,0,width,height);
    const range=document.createRange();
    const draw=(bounds,fill,thickness=bounds.height)=>{
      const x=bounds.left,y=bounds.top+(bounds.height-thickness)/2,w=bounds.width;
      if(w<=0||thickness<=0||x>=width||y>=height||x+w<=0||y+thickness<=0)return;
      context.fillStyle=fill;
      context.beginPath();
      context.roundRect(x,y,w,thickness,Math.min(4,w/2,thickness/2));
      context.fill();
    };
    for(const root of roots()){
      const dark=root.closest('[data-theme]')?.getAttribute('data-theme')==='dark';
      const fill=dark?'#3d3d3d':'#e8e8e8',panel=dark?'#292929':'#f1f1f1';
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT,{
        acceptNode:node=>node.matches(ignored)||node.parentElement?.closest(block)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT,
      });
      for(let node=root;node;node=walker.nextNode()){
        if(node.matches(block)){draw(node.getBoundingClientRect(),fill);continue;}
        if(node.matches(surface))draw(node.getBoundingClientRect(),panel);
        for(const text of node.childNodes){
          if(text.nodeType!==Node.TEXT_NODE||!text.textContent.trim())continue;
          range.selectNodeContents(text);
          for(const bounds of range.getClientRects())draw(bounds,fill,bounds.height*.58);
        }
      }
    }
  }

  function showSkeleton(){
    if(!roots().length)return;
    canvas=document.createElement('canvas');
    canvas.className='dds-font-skeleton';
    canvas.setAttribute('aria-hidden','true');
    Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',zIndex:'2147483646',pointerEvents:'none'});
    context=canvas.getContext('2d');
    if(!context||typeof context.roundRect!=='function'){context=null;return;}
    // The body itself can be a marked region, so keep the layer outside it.
    page.append(canvas);
    paint();
    const schedule=()=>{
      if(finished)return;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(paint);
    };
    const options={passive:true,signal:events.signal};
    window.addEventListener('resize',schedule,options);
    document.addEventListener('scroll',schedule,{...options,capture:true});
    observer=new MutationObserver(schedule);
    for(const root of roots())observer.observe(root,{childList:true,subtree:true,characterData:true});
  }

  function requestsFor(root){
    const groups=new Map();
    const pageStyles=getComputedStyle(root);
    const familyOf=value=>value.split(',')[0].trim().replace(/^['"]|['"]$/g,'');
    const documentStyles=getComputedStyle(page);
    const families=new Set([
      pageStyles.getPropertyValue('--font-sans'),
      pageStyles.getPropertyValue('--font-heading'),
      documentStyles.getPropertyValue('--font-sans'),
      documentStyles.getPropertyValue('--font-heading'),
    ].filter(Boolean).map(familyOf));
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT,{
      acceptNode:node=>node.matches('script,style,template,noscript,option,[hidden]')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT,
    });
    const bottom=window.innerHeight*2,viewportWidth=window.innerWidth;
    for(let node=root;node;node=walker.nextNode()){
      const formControl=node.matches('input:not([type=hidden]),textarea,select');
      const text=formControl
        ? node.selectedOptions?.[0]?.textContent||node.value||node.placeholder||''
        : [...node.childNodes].filter(child=>child.nodeType===Node.TEXT_NODE).map(child=>child.textContent).join(' ');
      if(!text.trim())continue;
      const bounds=node.getBoundingClientRect();
      if(!bounds.width||!bounds.height||bounds.bottom<0||bounds.top>=bottom||bounds.right<0||bounds.left>=viewportWidth)continue;
      const styles=getComputedStyle(node),family=familyOf(styles.fontFamily);
      if(!families.has(family))continue;
      const descriptor=`${styles.fontStyle} ${styles.fontWeight} 16px ${JSON.stringify(family)}`;
      if(!groups.has(descriptor))groups.set(descriptor,{family,chars:new Set()});
      for(const char of text)if(char.trim()||char===' ')groups.get(descriptor).chars.add(char);
    }
    return groups;
  }

  async function prepare(){
    if(finished)return;
    try{
      const links=[...document.head.querySelectorAll('link[rel=stylesheet]:not([disabled])')];
      await Promise.all(links.filter(link=>!link.sheet&&(!link.media||matchMedia(link.media).matches)).map(link=>new Promise(resolve=>{
        link.addEventListener('load',resolve,{once:true});
        link.addEventListener('error',resolve,{once:true});
      })));
      if(finished)return;
      showSkeleton();
      const requests=[...document.querySelectorAll(region)].flatMap(root=>[...requestsFor(root)]);
      const expectedFamilies=new Set(requests.map(([,request])=>request.family));
      const faces=await Promise.all(requests.map(([descriptor,{chars}])=>document.fonts.load(descriptor,[...chars].join(''))));
      const loadedFamilies=new Set(faces.flat().map(face=>face.family.replace(/^['"]|['"]$/g,'')));
      finish([...expectedFamilies].every(family=>loadedFamilies.has(family))?'ready':'fallback');
    }catch{
      finish('fallback');
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepare,{once:true});
  else prepare();
})();
