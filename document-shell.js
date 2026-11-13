import {components, groups, patterns, foundations} from './catalog.js?v=7a9142d15652404b';
import {screenExamples,sidebarStructure,overviewStructure} from './document-layout-templates.js?v=7a9142d15652404b';
export {screenExamples} from './document-layout-templates.js?v=7a9142d15652404b';
import {icon} from './icons.js?v=7a9142d15652404b';
import {formatHTML} from './format-html.js?v=7a9142d15652404b';
import {componentContract} from './component-contracts.js?v=7a9142d15652404b';
import {exampleScope, patternRequirements} from './service-guidelines.js?v=7a9142d15652404b';
import {blocks} from './blocks.js?v=7a9142d15652404b';
import {renderComponentSource,serviceMarkup} from './ui/source.js?v=7a9142d15652404b';
import {componentVariantsSection} from './component-variants.js?v=7a9142d15652404b';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = items => `<ul class="plain-list">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
const assetReferences = groups => [
  ['service','UI 원본과 서비스 기준'],['adapter','개별 연결 검토'],['documentation','문서 예제 전용']
].filter(([key])=>groups[key]?.length).map(([key,label])=>`<div class="asset-reference-group"><h3>${label}</h3><ul>${groups[key].map(file=>`<li><a href="./${esc(file)}" download>${esc(file)}</a></li>`).join('')}</ul></div>`).join('');
const section = (id, title, content) => `<section id="${id}"><div class="section-heading"><h2>${title}</h2></div>${content}</section>`;
const header = (category, title, description = '') => `<div class="breadcrumbs"><a href="#/">DDS</a><span>/</span><span>${esc(category)}</span></div><div class="page-heading"><div><h1>${esc(title)}</h1>${description ? `<p class="lead">${esc(description)}</p>` : ''}</div></div>`;

export function sidebarContent(view) {
  return sidebarStructure(view,{components,groups,foundations});
}

export function overviewContent(card) {
  return overviewStructure(id=>card(components.find(c=>c.id===id)),icon);
}

export function componentContent(c, html, {previewHTML, previewToc} = {}) {
  const contract = componentContract(c);
  const sourceHTML = `<div class="dds-ui" data-dds-component="${c.id}">${serviceMarkup(renderComponentSource(c.id,'dds-instance',false))}</div>`;
  const variations=componentVariantsSection(c.id,'doc-variants-'+c.id);
  const toc = [...(previewToc || [['preview','예제']]),...(variations?[['component-variants','유형과 변형']]:[]),['anatomy','구성'],['guidelines','사용 기준'],['specification','규격'],['states','상태'],['keyboard','조작'],['checks','검수']];
  const usage = `<div class="table-wrap"><table class="dds-rules-table"><tbody><tr><th scope="row">사용할 때</th><td>${esc(contract.usage.when)}</td></tr><tr><th scope="row">다른 선택</th><td>${esc(contract.usage.alternative)}</td></tr></tbody></table></div>${list(contract.rules)}`;
  const spec = `<div class="table-wrap"><table class="dds-rules-table"><thead><tr><th scope="col">항목</th><th scope="col">규격</th></tr></thead><tbody>${contract.specification.map(([name, value]) => `<tr><th scope="row">${esc(name)}</th><td>${esc(value)}</td></tr>`).join('')}</tbody></table></div>`;
  return header('컴포넌트 / ' + c.group, c.name, c.description) + `<div class="doc-layout"><article>
    <div class="doc-tabs" role="tablist" aria-label="컴포넌트 문서"><button role="tab" aria-selected="true" data-doc-tab="design">사용법</button><button role="tab" aria-selected="false" data-doc-tab="code" tabindex="-1">코드</button></div>
    <div data-doc-panel="design">
      ${previewHTML ?? section('preview','예제', `<div class="playground"><div class="playground-inner">${html}</div></div>${exampleScope(c.id)}`)}
      ${variations}
      ${section('anatomy','구성', `<div class="anatomy-list">${c.anatomy.split(' · ').map((part, i) => `<div><span>${i + 1}</span>${esc(part)}</div>`).join('')}</div>`)}
      ${section('guidelines','사용 기준', usage)}
      ${section('specification','규격', spec)}
      ${section('states','상태', `<div class="state-list">${c.states.split(' · ').map(state => `<span class="badge dds-badge">${esc(state)}</span>`).join('')}</div>`)}
      ${section('keyboard','조작', list(contract.keyboard))}
      ${section('checks','검수', list(contract.checks))}
    </div>
    <div data-doc-panel="code" hidden><h2>HTML</h2><p>미리보기와 같은 UI 원본입니다. <code>ui/tokens-scoped.css</code>와 <code>ui/dds.css</code>를 연결하고 <code>.dds-ui</code> 범위를 유지합니다. 예제 문구·도움말·개수·묶음 배치는 필수 요소가 아닙니다. 필요한 콘텐츠만 넣고 <code>variants</code>와 <code>optional</code>로 구성합니다. 기존 id·name·이벤트·제출값을 보존합니다.${c.group==='Charts'?' 차트는 실제 항목·계열·단위를 createComponent의 data로 전달합니다.':''}</p>
      <button class="btn sm copy-code">${icon('copy')} 코드 복사</button><pre class="html-example" tabindex="0" aria-label="서비스용 HTML 원본"><code>${esc(formatHTML(sourceHTML))}</code></pre>
      <p><a href="./${esc(contract.source.template)}" download>HTML 템플릿</a> · <a href="./ui/README.md">연결 방법</a> · <a href="./ui/registry.json">컴포넌트 레지스트리</a> · <a href="./ui/index.js?v=7a9142d15652404b">생성·동작 API</a> · <a href="./ui/source.js?v=7a9142d15652404b">HTML 원본 API</a> · <a href="./ui/tokens-scoped.css?v=7a9142d15652404b">토큰 CSS</a> · <a href="./ui/dds.css?v=7a9142d15652404b">UI CSS</a></p>
      <details><summary>연결 파일</summary><p>HTML은 renderComponentSource와 serviceMarkup으로 생성하며 ui/templates에도 같은 원본을 제공합니다. UI 폴더와 registry에 기록된 의존성을 함께 유지합니다. 선택·탭·열기와 닫기는 mountDDS를 연결하고, 저장·AI·업로드·권한은 기존 서비스 함수와 연결합니다. 문서 셸과 문서 예제 전용 파일은 서비스에 연결하지 않습니다.</p>${contract.assets.includes('service-typography.css')?'<p>service-typography.css는 현재 적용 예시의 매핑입니다. 대상 서비스에 맞게 다시 생성합니다.</p>':''}${assetReferences(contract.assetGroups)}</details>
    </div></article><aside class="toc"><span>이 페이지</span>${toc.map(([id, label]) => `<button data-scroll="${id}">${label}</button>`).join('')}</aside></div>`;
}

export function componentDetailContent(c,{demo,buttonCodeExample,buttonDemo,renderJobListExample}){
 if(c.id==='item')return componentContent(c,demo(c.id),{
  previewHTML:`<section id="preview"><div class="section-heading"><h2>외곽선형</h2></div><div class="playground"><div class="playground-inner">${demo(c.id)}</div></div></section><section id="item-divided"><div class="section-heading"><h2>구분선형 목록</h2></div><p>외곽 테두리 없이 행 사이를 구분합니다. 후행 정보와 별도 행동은 필요한 경우에만 넣습니다.</p>${renderJobListExample('item-divided-example')}<p><a href="#/blocks?block=job-list">채용 공고 목록 블록 보기</a></p></section>`,
  previewToc:[['preview','외곽선형'],['item-divided','구분선형 목록']]
 });
 if(c.id==='top-navigation')return componentContent(c,`<div class="doc-header-preview-set">${demo(c.id)}<details class="doc-header-desktop-details"><summary>데스크톱 헤더 보기</summary><div class="doc-header-scroll" role="region" aria-label="데스크톱 헤더" tabindex="0"><div class="doc-header-desktop">${demo(c.id,false,'-desktop')}</div></div></details></div>`);
 if(c.id==='button')return componentContent(c,buttonCodeExample(),{
   previewHTML:buttonDemo(),
   previewToc:[['button-variants','Variants'],['button-icons','아이콘'],['button-sizes','크기'],['button-disabled','비활성'],['button-loading','로딩'],['button-width','너비']]
 });
 return componentContent(c,demo(c.id));
}

export function renderPattern(p, sample) {
  const preview = p.id === 'service-footer' ? '<div class="demo-row"><a class="btn" href="./prototypes/home-independent.html">메인 푸터 보기</a><a class="btn" href="./prototypes/coverletter-info.html">서브 화면 보기</a></div>' : `<div class="playground pattern-preview">${sample}</div>`;
  return header('패턴', p.ko, p.desc) + `<div class="reading wide">
    <div class="pattern-flow">${p.flow.split(' → ').map((step, i) => `<span><small>${String(i + 1).padStart(2, '0')}</small>${esc(step)}</span>`).join('')}</div>
    <h2>사용 컴포넌트</h2><div class="state-list">${p.parts.map(name => {const c = components.find(c => c.name === name); return `<a href="#/components/${c.id}" class="chip">${esc(name)} ${icon('arrow')}</a>`;}).join('')}</div>
    ${preview}<h2>상태</h2><div class="state-list">${p.states.split(' / ').map(state => `<span class="badge dds-badge">${esc(state)}</span>`).join('')}</div>
    <h2>적용 규칙</h2><p>${esc(p.decision)}</p>${patternRequirements(p.id)}</div>`;
}

export function searchableDocuments() {
  return [
    {name:'시작하기', ko:'DDS', url:'/'},
    {name:'디자인 원칙', ko:'규칙 검수', url:'/principles'},
    {name:'디자인 프로세스', ko:'적용 순서', url:'/process'},
    {name:'개발 적용 안내', ko:'AI 핸드오프 기준 파일 적용 검수', url:'/handoff'},
    {name:'AI로 적용하기', ko:'DDS 설정 설치 프롬프트 고정 버전 매니페스트', url:'/setup'},
    {name:'블록', ko:'컴포넌트 조합 예시', aliases:blocks.map(block=>block.title), url:'/blocks'},
    ...components.map(c => ({...c, url:'/components/' + c.id})),
    ...foundations.map(([id, name, ko]) => ({name, ko, url:'/foundations/' + id})),
    ...patterns.map(p => ({name:p.ko, ko:p.name, url:'/patterns/' + p.id})),
    ...screenExamples.map(screen => ({name:screen.name, ko:screen.description, url:screen.url, external:true}))
  ];
}
