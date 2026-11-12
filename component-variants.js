import {componentVariants} from './ui/variants.js?v=027b0a50880ecefb';
import {createComponent,icon} from './ui/index.js?v=027b0a50880ecefb';
import {renderItemList} from './ui/extended.js?v=027b0a50880ecefb';
import {statusBadge} from './visibility.js?v=027b0a50880ecefb';
import {renderButton} from './ui/button.js?v=027b0a50880ecefb';
import {optionalContent} from './ui/content.js?v=027b0a50880ecefb';

const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeId=value=>String(value||'component-variants').replace(/[^a-zA-Z0-9_-]/g,'-');
const bindings=new WeakMap();

/** Explicit documentation content; the preview and its copied code use the same options. */
export function variantPreviewOptions(id,selected,doc=globalThis.document,idPrefix='dds-variant-'+id){
 const options={variants:{...selected}};
 const aliases={action:'actions',actionLabel:'actions',actionControl:'actions',confirm:'actions',primary:'metadata',secondary:'metadata'};
 const optional=Object.fromEntries(Object.keys(optionalContent[id]||{}).map(name=>{
  const axis=Object.hasOwn(selected,name)?name:aliases[name];
  return [name,typeof selected[axis]==='boolean'?selected[axis]:true];
 }));
 if(Object.keys(optional).length)options.optional=optional;
 const inputs={
  input:{part:'control',placeholder:'지원 직무가 드러나는 제목',value:'프로덕트 디자이너 자기소개서'},
  textarea:{part:'control',placeholder:'지원하게 된 계기를 작성해 주세요.',value:'사용자의 문제를 발견하고 더 나은 경험을 설계합니다.',maxlength:500},
  combobox:{part:'control',placeholder:'직무를 검색하세요',value:'프로덕트 디자이너'},
  'date-picker':{part:'control',value:'2026-09-16'},
  search:{part:'control',placeholder:'문서 제목으로 검색',value:'자기소개서'},
  editor:{part:'control',value:'사용자의 문제를 발견하고 팀과 함께 더 나은 경험을 설계합니다.',maxlength:500},
  field:{part:'input',placeholder:'name@example.com',value:'designer@example.com',required:true},
  'input-group':{part:'input',placeholder:'비밀번호 입력',value:'example-password'},
  'input-otp':{part:'input',placeholder:'000000',value:'123456',maxlength:6,pattern:'[0-9]{6}'},
  label:{part:'input',placeholder:'예: 서비스 기획자 이력서',value:'서비스 기획자 이력서',required:true}
 };
 if(inputs[id]){
  const {part,value,...attributes}=inputs[id];
  if(selected.state==='readOnly'||id==='date-picker'||id==='editor')attributes.value=value;
  options.attributes={[part]:attributes};
 }
 if(selected.state==='error'||selected.state==='success'){
  const copy=selected.state==='error'?'입력한 내용을 확인해 주세요.':'입력 내용을 확인했습니다.';
  if(['input','combobox','search'].includes(id))options.text={hint:copy};
  else if(id==='field')options.text=selected.state==='error'?{error:copy}:{description:copy};
  else if(['input-otp','label'].includes(id))options.text={description:copy};
 }
 if(id==='dialog'){
  const content=doc.createElement('template'),fieldId=safeId(idPrefix+'-content-field');
  content.innerHTML=selected.content==='form'?`<div class="field"><label for="${fieldId}">문서 제목</label><input id="${fieldId}" value="프로덕트 디자이너 자기소개서"></div>`:
   selected.content==='plain'?'<p>작성한 내용을 확인한 후 저장해 주세요.</p>':'<span class="badge">저장 완료</span><h3>프로덕트 디자이너 자기소개서</h3><p>사용자의 문제를 발견하고 더 나은 경험을 설계합니다.</p>';
  options.slots={content:content.content};
  options.text={title:'자기소개서 미리보기',body:'작성한 문서의 내용을 확인하세요.',confirm:'확인'};
 }
 if(id==='item'&&selected.appearance==='divided'){
  const template=doc.createElement('template');
  template.innerHTML=renderItemList([
   {title:'백엔드 엔지니어',href:'#/blocks?block=job-list',slots:{metadata:`<span class="dds-meta-secondary">개발팀 · 서울 · 경력 3년 이상</span>${statusBadge('pending','접수 중',icon)}`,trailingInfo:'D-9',actions:renderButton({label:'관심 공고',before:'Bookmark',iconOnly:true,variant:'outlined',color:'assistive',size:'md',attributes:{'aria-pressed':'false','data-dds-toggle':''}})}},
   {title:'프로덕트 디자이너',metadata:'디자인팀 · 서울 · 경력 2년 이상',href:'#/blocks?block=job-list',slots:{trailingInfo:'D-14'}}
  ],{appearance:'divided'});
  const rows=doc.createDocumentFragment();rows.append(...template.content.querySelector('.dds-items').children);
  options.slots={items:rows};
 }
 return options;
}

export function variantPreviewCode(id,options){
 const slots=new Map(),declarations=[];
 for(const [name,node]of Object.entries(options.slots||{}))if(node?.nodeType){
  const variable=safeId(name).replaceAll('-','_')+'Content',container=node.ownerDocument.createElement('div');
  container.append(node.cloneNode(true));slots.set(node,variable+'.content');
  declarations.push(`const ${variable} = document.createElement('template');\n${variable}.innerHTML = ${JSON.stringify(container.innerHTML)};`);
 }
 function format(value,level=0){
  if(slots.has(value))return slots.get(value);
  if(value&&typeof value==='object'){
   const entries=Object.entries(value),indent='  '.repeat(level+1),close='  '.repeat(level);
   return entries.length?`{\n${entries.map(([key,item])=>indent+JSON.stringify(key)+': '+format(item,level+1)).join(',\n')}\n${close}}`:'{}';
  }
  return JSON.stringify(value);
 }
 return [...declarations,`createComponent(${JSON.stringify(id)}, ${format(options)});`].join('\n\n');
}

export function componentVariantsSection(id,uid='component-variants'){
 const axes=componentVariants[id];if(!axes)return '';
 const prefix=safeId(uid+'-'+id);
 const controls=Object.entries(axes).map(([name,axis])=>{
  const controlId=prefix+'-'+name;
  return axis.type==='boolean'?`<label class="check-label"><input id="${controlId}" type="checkbox" data-variant-axis="${name}" ${axis.default?'checked':''}>${escape(axis.label)}</label>`:
   `<div class="field" data-control-size="sm"><label for="${controlId}">${escape(axis.label)}</label><select id="${controlId}" data-variant-axis="${name}">${axis.values.map(value=>`<option value="${escape(value)}" ${value===axis.default?'selected':''}>${escape(axis.labels[value]||value)}</option>`).join('')}</select></div>`;
 }).join('');
 return `<section id="component-variants" class="dds-variant-docs" data-component-variants="${escape(id)}" data-variant-prefix="${prefix}"><div class="section-heading"><h2>Variants</h2></div><div class="dds-variant-controls">${controls}</div><div class="dds-variant-preview" data-variant-preview="${escape(id)}"></div><div class="dds-variant-toolbar">${renderButton({label:'초기화',before:'RotateCcw',variant:'outlined',color:'assistive',size:'sm',attributes:{'data-variant-reset':''}})}</div><p class="helper" data-variant-status role="status" aria-live="polite"></p><details class="dds-variant-code"><summary>사용 코드</summary><div class="dds-variant-code-tools" data-variant-copy></div><pre tabindex="0"><code data-variant-code></code></pre></details></section>`;
}

/** Documentation specimens share the service variant implementation and local UI controller. */
export function bindComponentVariants(root,id){
 if(!root?.querySelectorAll)return ()=>{};
 bindings.get(root)?.();
 const sections=[...(root.matches?.('[data-component-variants]')?[root]:[]),...root.querySelectorAll('[data-component-variants]')].filter(section=>!id||section.dataset.componentVariants===id);
 const view=root.ownerDocument.defaultView,abort=new view.AbortController();
 let disposed=false,resetting=false;
 function values(section){return Object.fromEntries([...section.querySelectorAll('[data-variant-axis]')].map(control=>[control.dataset.variantAxis,control.type==='checkbox'?control.checked:control.value]));}
 function render(section){
  const componentId=section.dataset.componentVariants,selected=values(section),doc=root.ownerDocument;
  const options=variantPreviewOptions(componentId,selected,doc,section.dataset.variantPrefix+'-preview');
  const code=variantPreviewCode(componentId,options);
  const instance=createComponent(componentId,{...options,idPrefix:section.dataset.variantPrefix+'-preview'},doc);
  section.querySelector('[data-variant-preview]').replaceChildren(instance);
  section.querySelector('[data-variant-code]').textContent=code;
  section.querySelector('[data-variant-copy]').innerHTML=renderButton({label:'복사',before:'Copy',variant:'outlined',color:'assistive',size:'sm',attributes:{'data-copy':code,'aria-label':componentId+' 변형 사용 코드 복사'}});
 }
 for(const section of sections)render(section);
 root.addEventListener('change',event=>{if(resetting)return;const control=event.target.closest?.('[data-variant-axis]');const section=control?.closest('[data-component-variants]');if(section&&sections.includes(section)){section.querySelector('[data-variant-status]').textContent='';render(section);}},{signal:abort.signal});
 root.addEventListener('click',event=>{const button=event.target.closest?.('[data-variant-reset]');const section=button?.closest('[data-component-variants]');if(section&&sections.includes(section)){resetting=true;try{for(const control of section.querySelectorAll('[data-variant-axis]')){const axis=componentVariants[section.dataset.componentVariants][control.dataset.variantAxis];if(control.type==='checkbox')control.checked=axis.default;else control.value=axis.default;control.dispatchEvent(new view.Event('change',{bubbles:true}));}}finally{resetting=false;}section.querySelector('[data-variant-status]').textContent='';render(section);}},{signal:abort.signal});
 const cleanup=()=>{if(disposed)return;disposed=true;abort.abort();if(bindings.get(root)===cleanup)bindings.delete(root);};
 bindings.set(root,cleanup);return cleanup;
}
