/* Load this classic script in the document head to prepare the first DDS view. */
(() => {
  const script=document.currentScript;
  if(!script?.hasAttribute('data-dds-font-loading')||!document.fonts)return;

  const page=document.documentElement;
  const state='data-dds-font-loading';
  const region='[data-dds-font-content]';
  if(page.hasAttribute(state))return;
  page.setAttribute(state,'pending');
  let finished=false;
  const deadline=setTimeout(()=>finish('fallback'),1800);

  function finish(result){
    if(finished)return;
    finished=true;
    clearTimeout(deadline);
    if(result==='fallback')page.setAttribute(state,result);
    else page.removeAttribute(state);
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
