// All icon geometry comes from the unmodified, locally vendored Lucide release.
const aliases={arrow:'ArrowUpRight',plus:'Plus',check:'Check',file:'FileText',grid:'LayoutGrid',search:'Search',copy:'Copy',chevron:'ChevronRight',close:'X',sun:'Sun',moon:'Moon',layers:'Layers',more:'Ellipsis',info:'Info',calendar:'CalendarDays',left:'ChevronLeft',right:'ChevronRight',down:'ChevronDown',upload:'Upload',menu:'Menu'};
export function icon(name,cls=''){
 const key=aliases[name]||name,node=window.lucide.icons[key];
 if(!node)throw new Error('Unknown Lucide icon: '+key);
 return window.lucide.createElement(node,{class:'icon lucide lucide-'+key+' '+cls,width:24,height:24,'stroke-width':2,'aria-hidden':'true',focusable:'false'}).outerHTML;
}
let query='',page=0;
const names=()=>Object.keys(window.lucide.icons).sort();
const matches=()=>names().filter(n=>n.toLowerCase().includes(query.toLowerCase().replace(/[\s-]/g,'')));
const results=()=>{
 const all=matches(),pages=Math.max(1,Math.ceil(all.length/96));page=Math.min(page,pages-1);
 return `<div class="row-between results-heading"><span>${all.length}개 아이콘 이름 <span class="muted">· 별칭 포함</span></span><span>${page+1} / ${pages}</span></div><div class="lucide-grid">${all.slice(page*96,(page+1)*96).map(n=>`<button class="lucide-card" data-lucide-copy="${n}" aria-label="${n} SVG 복사">${icon(n)}<span>${n}</span></button>`).join('')||'<p>검색 결과가 없습니다.</p>'}</div><div class="pagination"><button class="btn" data-icon-page="-1" ${page===0?'disabled':''}>이전</button><span>${page+1} / ${pages}</span><button class="btn" data-icon-page="1" ${page+1===pages?'disabled':''}>다음</button></div>`;
};
export function iconGallery(){return `<div class="breadcrumbs"><a href="#/">DDS</a><span>/</span><span>Foundations</span></div><div class="page-heading"><div><h1>Iconography</h1><p class="lead">아이콘 검색, SVG 복사와 크기·선 두께 규칙.</p></div><span class="badge">Lucide 1.46.0</span></div><div class="reading"><p>DDS는 <a href="https://lucide.dev/" target="_blank" rel="noreferrer">Lucide</a> 아이콘을 사용합니다. ${names().length}개 아이콘 이름(별칭 포함)을 로컬에 포함했으며, 아래에서 검색하고 SVG를 복사할 수 있습니다.</p><div class="two-col"><div class="guideline"><b>크기와 선 두께</b><p>24px 그리드 · 2px 선 두께. 기본 UI는 18px, 버튼은 16px, 독립 아이콘은 24px로 사용합니다.</p></div><div class="guideline"><b>의미와 접근성</b><p>같은 행동에는 같은 아이콘을 사용합니다. 아이콘 전용 버튼에는 행동 이름을 제공하고, 글자와 함께 쓰는 아이콘은 장식 요소로 처리합니다.</p></div></div><p class="helper">아이콘은 Lucide 원본이며 로고는 서비스 소스의 DeepResume 브랜드 자산입니다. <a href="./vendor/lucide/LICENSE" download>Lucide 라이선스</a> · <a href="./vendor/lucide/lucide.min.js?v=bdc234b2469c85f9" download>전체 라이브러리 다운로드</a></p></div><label class="search-field icon-search">${icon('search')}<input id="icon-search" type="search" aria-label="아이콘 검색" placeholder="예: calendar, arrow, user" value="${query}"></label><div id="icon-results">${results()}</div>`;}
export function bindIconGallery(){document.getElementById('icon-search')?.addEventListener('input',e=>{query=e.target.value.replace(/[<>"&]/g,'');page=0;document.getElementById('icon-results').innerHTML=results();});}
document.addEventListener('click',async e=>{
 const copy=e.target.closest('[data-lucide-copy]');
 if(copy){const svg=window.lucide.createElement(window.lucide.icons[copy.dataset.lucideCopy]).outerHTML;try{await navigator.clipboard.writeText(svg);copy.querySelector('span').textContent='복사 완료';setTimeout(()=>{if(copy.isConnected)copy.querySelector('span').textContent=copy.dataset.lucideCopy;},1400);}catch{copy.querySelector('span').textContent='복사 권한을 확인해 주세요';}}
 const p=e.target.closest('[data-icon-page]');if(p){page+=Number(p.dataset.iconPage);document.getElementById('icon-results').innerHTML=results();document.getElementById('icon-search').scrollIntoView({block:'start'});}
});
