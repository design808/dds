import {componentVariants,applyComponentVariants} from './ui/variants.js?v=07d93ae023b5f009';
import {renderComponentSource,serviceMarkup} from './ui/source.js?v=07d93ae023b5f009';
import {renderButton} from './ui/button.js?v=07d93ae023b5f009';
import {connectFieldDescriptions} from './ui/content.js?v=07d93ae023b5f009';

const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeId=value=>String(value||'component-variants').replace(/[^a-zA-Z0-9_-]/g,'-');
const bindings=new WeakMap();

export function componentVariantsSection(id,uid='component-variants'){
 const axes=componentVariants[id];if(!axes)return '';
 const prefix=safeId(uid+'-'+id);
 const controls=Object.entries(axes).map(([name,axis])=>{
  const controlId=prefix+'-'+name;
  return axis.type==='boolean'?`<label class="check-label"><input id="${controlId}" type="checkbox" data-variant-axis="${name}" ${axis.default?'checked':''}>${escape(axis.label)}</label>`:
   `<div class="field" data-control-size="sm"><label for="${controlId}">${escape(axis.label)}</label><select id="${controlId}" data-variant-axis="${name}">${axis.values.map(value=>`<option value="${escape(value)}" ${value===axis.default?'selected':''}>${escape(axis.labels[value]||value)}</option>`).join('')}</select></div>`;
 }).join('');
 return `<section id="component-variants" class="dds-variant-docs" data-component-variants="${escape(id)}" data-variant-prefix="${prefix}"><div class="section-heading"><h2>Variants</h2></div><div class="dds-variant-controls">${controls}</div><div class="dds-variant-preview" data-variant-preview="${escape(id)}"></div><div class="dds-variant-toolbar">${renderButton({label:'다시 보기',before:'RotateCcw',variant:'outlined',color:'assistive',size:'sm',attributes:{'data-variant-reset':''}})}</div><p class="helper" data-variant-status role="status" aria-live="polite"></p><details class="dds-variant-code"><summary>사용 코드</summary><div class="dds-variant-code-tools" data-variant-copy></div><pre tabindex="0"><code data-variant-code></code></pre></details></section>`;
}

/** Documentation specimens share the service variant implementation and local UI controller. */
export function bindComponentVariants(root,id){
 if(!root?.querySelectorAll)return ()=>{};
 bindings.get(root)?.();
 const sections=[...(root.matches?.('[data-component-variants]')?[root]:[]),...root.querySelectorAll('[data-component-variants]')].filter(section=>!id||section.dataset.componentVariants===id);
 const view=root.ownerDocument.defaultView,abort=new view.AbortController();
 let disposed=false;
 function values(section){return Object.fromEntries([...section.querySelectorAll('[data-variant-axis]')].map(control=>[control.dataset.variantAxis,control.type==='checkbox'?control.checked:control.value]));}
 function render(section){
  const componentId=section.dataset.componentVariants,selected=values(section),doc=root.ownerDocument;
  const instance=doc.createElement('div');instance.className='dds-ui';instance.dataset.ddsComponent=componentId;
  instance.innerHTML=serviceMarkup(renderComponentSource(componentId,section.dataset.variantPrefix+'-preview',false));
  applyComponentVariants(instance,componentId,selected);
  if(selected.state==='error'||selected.state==='success')for(const hint of instance.querySelectorAll('.helper:not([role=status]),.dds-error')){const target=hint.matches('.row-between')?hint.firstElementChild:hint;if(target)target.textContent=selected.state==='error'?'입력한 내용을 확인해 주세요.':'입력 내용을 확인했습니다.';}
  if(selected.state==='readOnly')for(const control of instance.querySelectorAll('input:not([type=checkbox],[type=radio]),textarea'))if(!control.value)control.value='작성된 내용';
  connectFieldDescriptions(instance,section.dataset.variantPrefix+'-preview');
  section.querySelector('[data-variant-preview]').replaceChildren(instance);
  const code=`createComponent(${JSON.stringify(componentId)}, {\n  variants: ${JSON.stringify(selected,null,2).replaceAll('\n','\n  ')}\n});`;
  section.querySelector('[data-variant-code]').textContent=code;
  section.querySelector('[data-variant-copy]').innerHTML=renderButton({label:'복사',before:'Copy',variant:'outlined',color:'assistive',size:'sm',attributes:{'data-copy':code,'aria-label':componentId+' 변형 사용 코드 복사'}});
 }
 for(const section of sections)render(section);
 root.addEventListener('change',event=>{const control=event.target.closest?.('[data-variant-axis]');const section=control?.closest('[data-component-variants]');if(section&&sections.includes(section)){section.querySelector('[data-variant-status]').textContent='';render(section);}},{signal:abort.signal});
 root.addEventListener('click',event=>{const button=event.target.closest?.('[data-variant-reset]');const section=button?.closest('[data-component-variants]');if(section&&sections.includes(section)){section.querySelector('[data-variant-status]').textContent='';render(section);}},{signal:abort.signal});
 const cleanup=()=>{if(disposed)return;disposed=true;abort.abort();if(bindings.get(root)===cleanup)bindings.delete(root);};
 bindings.set(root,cleanup);return cleanup;
}
