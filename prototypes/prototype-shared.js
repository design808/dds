import {icon} from '../icons.js?v=f6c1f153a6058e30';
export {icon};
export const $=s=>document.querySelector(s);
export const $$=s=>[...document.querySelectorAll(s)];
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const sampleInfo={title:'사용자의 문제를 발견하고, 더 나은 경험을 만드는 디자이너',job:'디자인',ind:'IT·전기·전자',cor:'스타트업',supportArea:'프로덕트 디자이너',com:'딥레쥬메',exp:'신입',hashtag:['사용자 리서치','문제해결']};
export const blankInfo={title:'',job:'',ind:'',cor:'',supportArea:'',com:'',exp:'',hashtag:[]};
export function load(key,fallback){try{return JSON.parse(sessionStorage.getItem('dds-prototype-'+key))??structuredClone(fallback);}catch{return structuredClone(fallback);}}
export function save(key,data){try{sessionStorage.setItem('dds-prototype-'+key,JSON.stringify(data));return true;}catch{toast('저장하지 못했습니다. 다시 시도해 주세요.');return false;}}
export function icons(root=document){root.querySelectorAll('[data-icon]').forEach(e=>{const svg=document.createElement('span');svg.innerHTML=icon(e.dataset.icon);const node=svg.firstElementChild;if(e.id)node.id=e.id;e.replaceWith(node);});}
let timer,origin,afterClose;
export function toast(text){clearTimeout(timer);$('#preview-status').textContent=text;timer=setTimeout(()=>$('#preview-status').textContent='',4000);}
export function modal(title,html,onConfirm){origin=document.activeElement;afterClose=onConfirm;$('#dialog-confirm').textContent='확인';$('#dialog-title').textContent=title;$('#dialog-body').innerHTML=html;$('#preview-dialog').showModal();icons($('#preview-dialog'));}
export function summary(info){for(const key of ['job','ind','cor','supportArea','com','exp','hashtag']){const e=$('#'+key+'_text');if(!e)continue;const value=Array.isArray(info[key])?info[key].join(' · '):info[key];e.textContent=value||'선택 전';e.classList.toggle('empty',!value);e.parentElement.classList.toggle('complete',!!value);const old=$('#'+key+'_icon');if(old){const host=document.createElement('span');host.innerHTML=icon(value?'CircleCheck':'Circle');host.firstElementChild.id=old.id;old.replaceWith(host.firstElementChild);}}}
export function common(){
 icons();
 const closeMenus=()=>{$$('.gnb-trigger').forEach(b=>{b.setAttribute('aria-expanded','false');$('#'+b.getAttribute('aria-controls')).hidden=true;});};
 $('#mobile-nav').addEventListener('click',()=>{const open=$('.product-header').classList.toggle('nav-open');$('#mobile-nav').setAttribute('aria-expanded',open);$('#mobile-nav').setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');if(!open)closeMenus();});
 for(const b of $$('.gnb-trigger')){
  const show=()=>{closeMenus();b.setAttribute('aria-expanded','true');$('#'+b.getAttribute('aria-controls')).hidden=false;};
  b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')==='true';closeMenus();if(!open||matchMedia('(min-width:1101px)').matches)show();});
  b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();show();$('#'+b.getAttribute('aria-controls')).querySelector('a,button').focus();}});
  b.parentElement.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:1101px)').matches)show();});
  b.parentElement.addEventListener('pointerleave',()=>{if(!b.parentElement.contains(document.activeElement))closeMenus();});
  b.parentElement.addEventListener('focusout',e=>{if(!b.parentElement.contains(e.relatedTarget))closeMenus();});
 }
 document.addEventListener('click',e=>{if(!e.target.closest('.gnb-item'))closeMenus();});
 $('.product-header').addEventListener('keydown',e=>{if(e.key==='Escape'){const active=$('.gnb-trigger[aria-expanded=true]');closeMenus();active?.focus();}});
 $('#dialog-close').addEventListener('click',()=>$('#preview-dialog').close());
 $('#dialog-confirm').addEventListener('click',()=>{const callback=afterClose;afterClose=null;$('#preview-dialog').close();callback?.();});
 $('#preview-dialog').addEventListener('close',()=>{origin?.focus();afterClose=null;$('#dialog-confirm').hidden=false;});
 const languages=[['kr','한국어'],['en','English'],['zh-hans','简体中文'],['zh-hant','繁體中文'],['ja','日本語'],['es','Español'],['fr','Français'],['de','Deutsch'],['ar','العربية'],['pt','Português'],['ru','Русский'],['uz','O‘zbekcha'],['vi','Tiếng Việt'],['kk','Қазақша'],['km','ភាសាខ្មែរ'],['mn','Монгол'],['my','မြန်မာစာ'],['ne','नेपाली'],['lo','ລາວ'],['fil','Filipino'],['id','Bahasa Indonesia'],['it','Italiano'],['hi','हिन्दी'],['he','עברית'],['fa','فارسی'],['ms','Bahasa Melayu'],['th','ไทย'],['tr','Türkçe']];
 $('#language-menu').addEventListener('click',()=>{modal('언어 선택',`<div class="language-grid">${languages.map(([code,label])=>`<button type="button" data-language="${code}" aria-label="${label}"><img src="/prototypes/assets/flags/${code}.png" alt="${label}" width="40" height="40"></button>`).join('')}</div>`);$('#dialog-confirm').hidden=true;});
 $('#dialog-body').addEventListener('click',e=>{const b=e.target.closest('[data-language]');if(!b)return;$('#preview-dialog').close();});
}
