import {icon} from './icons.js?v=3ea17f0ff21b92cc';
document.querySelectorAll('[data-glyph]').forEach(el=>{el.innerHTML=icon(el.dataset.glyph);});
document.querySelectorAll('.sample-chips button').forEach(button=>button.addEventListener('click',()=>{const selected=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',selected);button.classList.toggle('selected',selected);}));
document.querySelectorAll('.sample-tabs button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.sample-tabs button').forEach(b=>b.setAttribute('aria-pressed',b===button));}));
document.querySelectorAll('[data-sample-save]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#sample-status').textContent='입력한 내용을 저장했습니다.';}));
