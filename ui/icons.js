import {iconNodes} from './lucide-data.js?v=f9086ddd38cf7f33';
const aliases={arrow:'ArrowUpRight',plus:'Plus',check:'Check',file:'FileText',grid:'LayoutGrid',search:'Search',copy:'Copy',chevron:'ChevronRight',close:'X',sun:'Sun',moon:'Moon',layers:'Layers',more:'Ellipsis',info:'Info',calendar:'CalendarDays',left:'ChevronLeft',right:'ChevronRight',down:'ChevronDown',upload:'Upload',menu:'Menu'};
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function icon(name,cls=''){
 const key=aliases[name]||name,nodes=iconNodes[key];
 if(!nodes)throw new Error('Unknown Lucide icon: '+key);
 const contents=nodes.map(([tag,attributes])=>`<${tag} ${Object.entries(attributes).filter(([k])=>k!=='key').map(([k,v])=>`${k}="${escapeHTML(v)}"`).join(' ')}></${tag}>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon lucide lucide-${escapeHTML(key)} ${escapeHTML(cls)}" aria-hidden="true" focusable="false">${contents}</svg>`;
}
