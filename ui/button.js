/** Canonical button markup. State changes and requests belong to the host. */
import {icon} from './icons.js?v=ec6f1fc7745acd41';

const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const nativeBooleans=new Set(['disabled','hidden','formnovalidate']);
const attributeNames=new Set(['id','name','value','type','form','formaction','formenctype','formmethod','formnovalidate','formtarget','tabindex','hidden','disabled','title','role']);
const reserved=new Set(['data-variant','data-color','data-control-size','data-icon-only','data-full-width','aria-busy']);

function attributesHTML(values){
 return Object.entries(values).filter(([,value])=>value!==null&&value!==undefined).map(([name,value])=>{
  if(name!=='class'&&!attributeNames.has(name)&&! /^(aria|data)-[a-z0-9_.:-]+$/.test(name))throw new TypeError('Unsupported DDS button attribute: '+name);
  if(nativeBooleans.has(name))return value===false?null:name;
  return `${name}="${escapeHTML(value)}"`;
 }).filter(Boolean).join(' ');
}

function validateAttributes(attributes){
 if(!attributes||typeof attributes!=='object'||Array.isArray(attributes))throw new TypeError('Button attributes must be an object.');
 for(const [name,value] of Object.entries(attributes)){
  if(reserved.has(name))throw new TypeError('Use a typed button property for '+name+'.');
  if(!attributeNames.has(name)&&! /^(aria|data)-[a-z0-9_.:-]+$/.test(name))throw new TypeError('Unsupported DDS button attribute: '+name);
  if(name==='type'&&!['button','submit','reset'].includes(value))throw new TypeError('Unsupported button type.');
  if(name==='formaction'){
   const url=String(value??'').replace(/[\s\u0000-\u001f\u007f]/g,'');
   if(/^[a-z][a-z0-9+.-]*:/i.test(url)&&!/^https?:/i.test(url))throw new TypeError('Unsupported button form action protocol.');
  }
 }
}

/** Solid primary/assistive/negative or outlined primary/assistive. */
export function renderButton({variant='solid',color='primary',size='md',label='작성 시작',
 before='',after='',iconOnly=false,busy=false,loading=false,disabled=false,
 fullWidth=false,loadingLabel='처리 중',attributes={}}={}){
 if(!['solid','outlined'].includes(variant))throw new TypeError('Unsupported DDS button variant.');
 if(!['primary','assistive','negative'].includes(color)||variant==='outlined'&&color==='negative')throw new TypeError('Unsupported DDS button color.');
 if(!['sm','md','lg'].includes(size))throw new TypeError('Unsupported DDS button size.');
 if(iconOnly&&!String(label??'').trim())throw new TypeError('An icon-only button needs a function label.');
 validateAttributes(attributes);
 const props={
  type:'button',class:'dds-button','data-variant':variant,'data-color':color,'data-control-size':size,
  ...(iconOnly?{'data-icon-only':'true','aria-label':label,'data-tooltip':label}:{}),
  ...(busy||loading?{'aria-label':label}:{}),
  ...(fullWidth?{'data-full-width':'true'}:{}),
  ...(busy?{'aria-busy':'true'}:{}),
  ...((disabled||busy)?{disabled:true}:{}),
  ...attributes
 };
 // A processing state always blocks a duplicate native action.
 if(disabled||busy)props.disabled=true;
 if((iconOnly||busy||loading)&&!String(props['aria-label']??'').trim())throw new TypeError('The button function label must remain available.');
 if(iconOnly&&!String(props['data-tooltip']??'').trim())props['data-tooltip']=props['aria-label'];
 const loadingContents=loading||busy?`<span class="dds-button-loading"><span class="dds-button-spinner" aria-hidden="true"></span>${iconOnly?'':`<span>${escapeHTML(loadingLabel)}</span>`}</span>`:'';
 const labelContents=iconOnly?icon(before||'Plus'):`${before?icon(before):''}<span>${escapeHTML(label)}</span>${after?icon(after):''}`;
 return `<button ${attributesHTML(props)}><span class="dds-button-label">${labelContents}</span>${loadingContents}</button>`;
}
