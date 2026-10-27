import {components, groups, patterns, foundations} from './catalog.js?v=7561e6f428411d29';
import {icon} from './icons.js?v=7561e6f428411d29';
import {formatHTML} from './format-html.js?v=7561e6f428411d29';
import {componentContract} from './component-contracts.js?v=7561e6f428411d29';
import {exampleScope, patternRequirements} from './service-guidelines.js?v=7561e6f428411d29';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = items => `<ul class="plain-list">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
const section = (id, title, content) => `<section id="${id}"><div class="section-heading"><h2>${title}</h2></div>${content}</section>`;
const header = (category, title, description = '') => `<div class="breadcrumbs"><a href="#/">DDS</a><span>/</span><span>${esc(category)}</span></div><div class="page-heading"><div><h1>${esc(title)}</h1>${description ? `<p class="lead">${esc(description)}</p>` : ''}</div></div>`;

export const screenExamples = [
  {name:'메인화면 · 서비스안', url:'./prototypes/home.html', description:'기존 콘텐츠를 적용한 메인화면'},
  {name:'메인화면 · 독립안', url:'./prototypes/home-independent.html', description:'다른 구성의 메인화면'},
  {name:'자기소개서 · 지원정보', url:'./prototypes/coverletter-info.html', description:'제목과 지원정보 입력'},
  {name:'자기소개서 · 문항 작성', url:'./prototypes/coverletter-write.html', description:'문항·경험 입력과 AI 작성'},
  {name:'마이페이지', url:'./prototypes/mypage.html', description:'내 자기소개서와 이력서 목록'},
  {name:'이력서 작성', url:'./prototypes/resume-write.html?document=resume-1', description:'인적사항·학력·경력 편집'},
  {name:'AI 면접 · 준비', url:'./prototypes/interview-setup.html', description:'면접 안내·환경 확인·지원정보 선택'},
  {name:'AI 면접 · 진행', url:'./prototypes/interview-session.html', description:'질문 확인·답변·재응답·제출'}
];

export function sidebarContent(view) {
  const route = view.split('?')[0];
  const item = (href, text) => `<a href="#${href}" class="${route === href ? 'active' : ''}"${route === href ? ' aria-current="page"' : ''}>${esc(text)}</a>`;
  const currentGroup = components.find(c => '/components/' + c.id === route)?.group;
  return `<div class="sidebar-intro"><span class="sidebar-title">Deep Design System</span></div>
    <div class="nav-section">${item('/', '시작하기')}${item('/principles', '디자인 원칙')}${item('/process', '디자인 프로세스')}${item('/setup', 'AI로 적용하기')}${item('/handoff', '개발 적용 안내')}</div>
    <div class="nav-label">FOUNDATIONS</div><div class="nav-section">${foundations.map(([id, , ko]) => item('/foundations/' + id, ko)).join('')}</div>
    <div class="nav-label">COMPONENTS</div><div class="nav-section">${item('/components', '전체 컴포넌트')}${groups.map(group => `<details ${currentGroup === group ? 'open' : ''}><summary>${group}</summary>${components.filter(c => c.group === group).map(c => item('/components/' + c.id, c.name)).join('')}</details>`).join('')}</div>
    <div class="nav-label">PATTERNS</div><div class="nav-section">${patterns.map(p => item('/patterns/' + p.id, p.ko)).join('')}</div>
    <div class="nav-label">적용 예시</div><div class="nav-section">${screenExamples.map(screen => `<a href="${screen.url}">${screen.name}</a>`).join('')}</div>`;
}

export function overviewContent(card) {
  return `<section class="overview-heading"><h1>Deep Design System</h1><p>딥레쥬메의 디자인 규칙, 컴포넌트와 서비스 적용 방법.</p></section>
    <div class="entry-grid">${[
      ['기반 규칙', '색상·글자·간격·접근성', '/foundations/color'],
      ['컴포넌트', '용도·규격·상태·조작·코드', '/components'],
      ['AI로 적용하기', '설정 프롬프트·고정 버전 파일', '/setup']
    ].map(([title, description, url]) => `<a href="#${url}" class="entry-card"><div><h3>${title}</h3><p>${description}</p></div>${icon('arrow')}</a>`).join('')}</div>
    <div class="section-heading"><h2>주요 컴포넌트</h2><a href="#/components">전체 보기</a></div>
    <div class="component-grid">${['button','input','card','tabs','badge','dialog'].map(id => card(components.find(c => c.id === id))).join('')}</div>
    <div class="section-heading"><h2>적용 예시</h2></div><div class="entry-grid">${screenExamples.map(screen => `<a href="${screen.url}" class="entry-card"><div><h3>${screen.name}</h3><p>${screen.description}</p></div>${icon('arrow')}</a>`).join('')}</div>`;
}

export function componentContent(c, html) {
  const contract = componentContract(c);
  const toc = [['preview','예제'],['anatomy','구성'],['guidelines','사용 기준'],['specification','규격'],['states','상태'],['keyboard','조작'],['checks','검수']];
  const usage = `<div class="table-wrap"><table class="dds-rules-table"><tbody><tr><th scope="row">사용할 때</th><td>${esc(contract.usage.when)}</td></tr><tr><th scope="row">다른 선택</th><td>${esc(contract.usage.alternative)}</td></tr></tbody></table></div>${list(contract.rules)}`;
  const spec = `<div class="table-wrap"><table class="dds-rules-table"><thead><tr><th scope="col">항목</th><th scope="col">규격</th></tr></thead><tbody>${contract.specification.map(([name, value]) => `<tr><th scope="row">${esc(name)}</th><td>${esc(value)}</td></tr>`).join('')}</tbody></table></div>`;
  return header('컴포넌트 / ' + c.group, c.name, c.description) + `<div class="doc-layout"><article>
    <div class="doc-tabs" role="tablist" aria-label="컴포넌트 문서"><button role="tab" aria-selected="true" data-doc-tab="design">사용법</button><button role="tab" aria-selected="false" data-doc-tab="code" tabindex="-1">코드</button></div>
    <div data-doc-panel="design">
      ${section('preview','예제', `<div class="playground"><div class="playground-inner">${html}</div></div>${exampleScope(c.id)}`)}
      ${section('anatomy','구성', `<div class="anatomy-list">${c.anatomy.split(' · ').map((part, i) => `<div><span>${i + 1}</span>${esc(part)}</div>`).join('')}</div>`)}
      ${section('guidelines','사용 기준', usage)}
      ${section('specification','규격', spec)}
      ${section('states','상태', `<div class="state-list">${c.states.split(' · ').map(state => `<span class="badge">${esc(state)}</span>`).join('')}</div>`)}
      ${section('keyboard','조작', list(contract.keyboard))}
      ${section('checks','검수', list(contract.checks))}
    </div>
    <div data-doc-panel="code" hidden><h2>HTML</h2><p>문서 예제의 마크업입니다. 기존 서비스의 이벤트 연결은 <a href="#/handoff">개발 적용 안내</a>에 따라 확인합니다.</p>
      <button class="btn sm copy-code">${icon('copy')} 코드 복사</button><pre class="html-example" tabindex="0" aria-label="HTML 코드 예제"><code>${esc(formatHTML(html))}</code></pre>
      <details><summary>예제 참조 파일</summary><ul>${contract.assets.map(file => `<li><a href="./${esc(file)}" download>${esc(file)}</a></li>`).join('')}</ul></details>
    </div></article><aside class="toc"><span>이 페이지</span>${toc.map(([id, label]) => `<button data-scroll="${id}">${label}</button>`).join('')}</aside></div>`;
}

export function renderPattern(p, sample) {
  const preview = p.id === 'service-footer' ? '<div class="demo-row"><a class="btn" href="./prototypes/home.html#contact-section">메인 푸터 보기</a><a class="btn" href="./prototypes/coverletter-info.html">서브 화면 보기</a></div>' : `<div class="playground pattern-preview">${sample}</div>`;
  return header('패턴', p.ko, p.desc) + `<div class="reading wide">
    <div class="pattern-flow">${p.flow.split(' → ').map((step, i) => `<span><small>${String(i + 1).padStart(2, '0')}</small>${esc(step)}</span>`).join('')}</div>
    <h2>사용 컴포넌트</h2><div class="state-list">${p.parts.map(name => {const c = components.find(c => c.name === name); return `<a href="#/components/${c.id}" class="chip">${esc(name)} ${icon('arrow')}</a>`;}).join('')}</div>
    ${preview}<h2>상태</h2><div class="state-list">${p.states.split(' / ').map(state => `<span class="badge">${esc(state)}</span>`).join('')}</div>
    <h2>적용 규칙</h2><p>${esc(p.decision)}</p>${patternRequirements(p.id)}</div>`;
}

export function searchableDocuments() {
  return [
    {name:'시작하기', ko:'DDS', url:'/'},
    {name:'디자인 원칙', ko:'규칙 검수', url:'/principles'},
    {name:'디자인 프로세스', ko:'적용 순서', url:'/process'},
    {name:'개발 적용 안내', ko:'AI 핸드오프 기준 파일 적용 검수', url:'/handoff'},
    {name:'AI로 적용하기', ko:'DDS 설정 설치 프롬프트 고정 버전 매니페스트', url:'/setup'},
    ...components.map(c => ({...c, url:'/components/' + c.id})),
    ...foundations.map(([id, name, ko]) => ({name, ko, url:'/foundations/' + id})),
    ...patterns.map(p => ({name:p.ko, ko:p.name, url:'/patterns/' + p.id})),
    ...screenExamples.map(screen => ({name:screen.name, ko:screen.description, url:screen.url, external:true}))
  ];
}
