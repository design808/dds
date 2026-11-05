/** Production content policy. Specimen copy is not a required UI part. */
export const optionalContent=Object.freeze({
 input:{hint:'.helper'},
 search:{hint:'.helper',result:'[data-search-count]'},
 combobox:{hint:'.helper'},
 textarea:{limit:'.row-between.helper > span:first-child',counter:'[data-count]'},
 upload:{hint:'.helper:not(.file-state)'},
 progress:{hint:'.helper'},
 dialog:{trigger:'[data-dds-dialog]',body:'.dds-dialog > p',content:'.sample-document,.dds-dialog-content',confirm:'.dds-dialog > button'},
 alert:{description:'.alert p'},
 toast:{label:'[data-dds-toast]'},
 empty:{description:'.empty-state > p',action:'.empty-state > a'},
 avatar:{description:'.helper'},
 card:{status:'.dds-status',primary:'.dds-meta-primary',secondary:'.dds-meta-secondary',date:'.dds-meta-date',action:'.dds-card-tools'},
 item:{firstTrailingInfo:'.dds-items > li:first-child .dds-list-trailing-info',firstActions:'.dds-items > li:first-child .dds-list-actions'},
 field:{description:'.helper[id]'},
 label:{description:'.helper'},
 'input-otp':{description:'[data-otp-status]'},
 'action-area':{description:'.dds-component > .helper'},
 'section-header':{description:'.dds-section-header-content > p',count:'.dds-collection-count',actionLabel:'.dds-section-header-action'},
 'context-menu':{description:'.dds-context-content > .helper'},
 'alert-dialog':{description:'.dds-overlay > p'},
 sheet:{description:'.dds-overlay > p'},
 drawer:{description:'.dds-overlay > p'},
 'hover-card':{description:'.dds-popover > p:not(.helper)',metadata:'.dds-popover > .helper'},
 'avatar-group':{description:'.helper'},
 kbd:{description:'.helper'},
 direction:{description:'.helper'},
 'fallback-view':{description:'[data-fallback-copy]'}
});
const own=(value,key)=>value!=null&&Object.prototype.hasOwnProperty.call(value,key);
const scalarFields=new Set(['input','search','textarea','combobox','date-picker','editor','field','input-group','input-otp']);

/** Remove example restrictions/values before connecting the caller's actual data. */
export function prepareServiceContent(root,id){
 if(scalarFields.has(id))for(const control of root.querySelectorAll('input,textarea')){
  if(control.matches('[type=checkbox],[type=radio],[type=range]'))continue;
  control.removeAttribute('value');control.value='';control.defaultValue='';
  if(control.matches('textarea'))control.textContent='';
  for(const name of ['placeholder','maxlength','minlength','required','min','max','pattern'])control.removeAttribute(name);
 }
 // Status paragraphs in specimens explain local demo interactions. Real messages
 // come from the host's validation/request result and start empty.
 for(const node of root.querySelectorAll('[data-dds-status]'))node.textContent='';
}

/** Optional copy appears only when supplied, or explicitly enabled by its owner. */
export function finalizeServiceContent(root,id,options={},parts={}){
 const definitions=optionalContent[id]||{},optional=options.optional||{};
 const ownedSlots=Object.keys(options.slots||{}).map(name=>parts[name]?.selector).filter(Boolean).flatMap(selector=>[...root.querySelectorAll(selector)]);
 for(const [name,value]of Object.entries(optional)){
  if(!own(definitions,name))throw new TypeError('Unknown optional DDS content part: '+id+'.'+name);
  if(typeof value!=='boolean')throw new TypeError('DDS optional content must be true or false: '+name);
 }
 const nodes=new Map();
 for(const [name,selector]of Object.entries(definitions))for(const node of root.querySelectorAll(selector)){
  if(!own(optional,name)&&ownedSlots.some(slot=>slot!==node&&slot.contains(node)))continue;
  const aliases={action:'actionControl',actionLabel:'action',date:'dateControl',count:'countAttributes',trigger:'control',label:'control'};
  const specified=own(options.text,name)||own(options.slots,name)||own(options.attributes,name)||own(options.attributes,aliases[name]);
  const value=options.text?.[name];
  const explicitlyHidden=options.attributes?.[name]?.hidden===true||options.attributes?.[aliases[name]]?.hidden===true;
  const visible=!explicitlyHidden&&(own(optional,name)?optional[name]:specified&&(value===undefined||String(value??'').trim()!==''));
  nodes.set(node,(nodes.get(node)||false)||visible);
 }
 for(const [node,visible]of nodes){node.hidden=!visible;if(!visible)node.dataset.ddsOptional='omitted';else delete node.dataset.ddsOptional;}
 // A counter row is not a mandatory footer on every textarea.
 for(const row of root.querySelectorAll('.row-between.helper'))if([...row.children].length&&[...row.children].every(node=>node.hidden))row.hidden=true;
 // Required markers reflect the real native control, not the specimen's asterisk.
 for(const field of root.querySelectorAll('.field'))for(const marker of field.querySelectorAll('.required'))marker.hidden=!field.querySelector('input,select,textarea')?.required;
 // Never leave aria-describedby pointing at hidden helper/example content.
 for(const control of root.querySelectorAll('[aria-describedby],[aria-errormessage]'))for(const name of ['aria-describedby','aria-errormessage']){
  const ids=(control.getAttribute(name)||'').split(/\s+/).filter(Boolean).filter(id=>{const node=[...root.querySelectorAll('[id]')].find(node=>node.id===id);return !node||!node.hidden;});
  ids.length?control.setAttribute(name,ids.join(' ')):control.removeAttribute(name);
 }
 // Empty document-preview content must not leak into a general purpose dialog.
 if(id==='dialog'&&!own(options.slots,'content')&&!optional.content)root.querySelector('.sample-document,.dds-dialog-content')?.replaceChildren();
 if(id==='top-navigation'){
  const tools=root.querySelector('.dds-topnav-tools');if(tools&&!tools.children.length)tools.hidden=true;
 }
 for(const header of root.querySelectorAll('.dds-card-header'))if([...header.children].every(node=>node.hidden))header.hidden=true;
 connectFieldDescriptions(root,root.dataset.ddsInstance||'dds-field');
}

/** Connect only visible, service-supplied help/errors to the native form control. */
export function connectFieldDescriptions(root,idPrefix='dds-field'){
 let serial=0;
 for(const control of root.querySelectorAll('input,textarea,select')){
  const field=control.closest('.field,fieldset,.editor-demo');if(!field||!root.contains(field))continue;
  const helpers=[...field.querySelectorAll('.helper,.dds-error')].filter(node=>!node.closest('[hidden]')&&node.textContent.trim()&&node.closest('.field,fieldset,.editor-demo')===field);
  if(!helpers.length)continue;
  for(const helper of helpers)if(!helper.id)helper.id=idPrefix+'-description-'+(++serial);
  const previous=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
  control.setAttribute('aria-describedby',[...new Set([...previous,...helpers.map(node=>node.id)])].join(' '));
  if(control.getAttribute('aria-invalid')==='true'){
   const error=helpers.find(node=>node.classList.contains('dds-error'))||helpers.find(node=>node.closest('[data-dds-state="error"]'));
   if(error)control.setAttribute('aria-errormessage',error.id);
  }
 }
}

/** A primitive is one item, not the three-column specimen arrangement. */
export function configureServiceItems(root,id,options,uid){
 const definitions={chip:{group:'.demo-row',item:'button'},checkbox:{group:'.stack',item:'label'},radio:{group:'.radio-set',item:'label'}};
 const definition=definitions[id];
 if(definition&&options.items!==undefined){
  if(!Array.isArray(options.items)||!options.items.length)throw new TypeError('DDS items must be a non-empty array.');
  const group=root.querySelector(definition.group),template=group.querySelector(definition.item).cloneNode(true);
  group.querySelectorAll(definition.item).forEach(node=>node.remove());
  let radioSelected=false;
  options.items.forEach((item,index)=>{
   if(item==null||typeof item!=='object'||!String(item.label??'').trim())throw new TypeError('Every DDS item requires a label.');
   const node=template.cloneNode(true),control=node.matches('button')?node:node.querySelector('input'),label=node.querySelector('[data-dds-part="label"]');
   if(label)label.textContent=String(item.label);else node.textContent=String(item.label);
   const selected=Boolean(item.selected??item.checked)&&!(id==='radio'&&radioSelected);if(selected&&id==='radio')radioSelected=true;
   control.value=String(item.value??index);control.disabled=Boolean(item.disabled);
   if(control.matches('button')){control.setAttribute('aria-pressed',String(selected));control.classList.toggle('selected',selected);}
   else{control.id=uid+'-item-'+index;control.name=String(item.name??options.name??uid);control.checked=selected;control.defaultChecked=selected;control.toggleAttribute('checked',selected);}
   group.append(node);
  });
  return;
 }
 const plural=own(options.slots,'items')||own(options.text,'secondLabel')||own(options.text,'thirdLabel')||own(options.attributes,'secondControl')||own(options.attributes,'thirdControl');
 if(definition&&!plural){
  const nodes=root.querySelectorAll(definition.group+' > '+definition.item);[...nodes].slice(1).forEach(node=>node.remove());
 }
 if(id==='avatar'){
  const avatars=[...root.querySelectorAll('.avatar')];
  if(!own(options.text,'secondInitial'))avatars[1]?.remove();
  if(!own(options.text,'thirdInitial'))avatars[2]?.remove();
  if(!own(options.text,'name')&&!own(options.text,'description'))root.querySelector('.demo-row > div')?.remove();
 }
 if(id==='icon-button'&&!options.group)root.querySelectorAll('.demo-row > button:not(:first-child)').forEach(node=>node.remove());
 if(id==='badge'&&!own(options.slots,'statuses')){
  root.querySelectorAll('.badge-demo > .demo-row > :not(:first-child)').forEach(node=>node.remove());
  const count=root.querySelector('.badge-count-example');if(count)count.hidden=options.variants?.kind!=='count';
 }
}
