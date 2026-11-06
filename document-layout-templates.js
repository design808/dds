// Shared documentation layout. Loading placeholders and resolved content use
// these exact containers, labels and responsive classes. No DOM or runtime imports.
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const screenExamples = [
  {name:'메인화면 · 독립안', url:'./prototypes/home-independent.html', description:'다른 구성의 메인화면'},
  {name:'자기소개서 · 지원정보', url:'./prototypes/coverletter-info.html', description:'제목과 지원정보 입력'},
  {name:'자기소개서 · 문항 작성', url:'./prototypes/coverletter-write.html', description:'문항·경험 입력과 AI 작성'},
  {name:'마이페이지', url:'./prototypes/mypage.html', description:'내 자기소개서와 이력서 목록'},
  {name:'이력서 작성', url:'./prototypes/resume-write.html?document=resume-1', description:'인적사항·학력·경력 편집'},
  {name:'AI 면접 · 준비', url:'./prototypes/interview-setup.html', description:'면접 안내·환경 확인·지원정보 선택'},
  {name:'AI 면접 · 진행', url:'./prototypes/interview-session.html', description:'질문 확인·답변·재응답·제출'}
];

export function sidebarStructure(view, {components, groups, foundations}) {
  const route = view.split('?')[0];
  const item = (href, text) => `<a href="#${href}" class="${route === href ? 'active' : ''}"${route === href ? ' aria-current="page"' : ''}>${escapeHTML(text)}</a>`;
  const currentGroup = components.find(c => '/components/' + c.id === route)?.group;
  return `<div class="sidebar-intro"><span class="sidebar-title">Deep Design System</span></div>
    <div class="nav-section">${item('/', '시작하기')}${item('/principles', '디자인 원칙')}${item('/process', '디자인 프로세스')}${item('/setup', 'AI로 적용하기')}${item('/handoff', '개발 적용 안내')}${item('/blocks', '블록')}</div>
    <div class="nav-label">FOUNDATIONS</div><div class="nav-section">${foundations.map(([id, , ko]) => item('/foundations/' + id, ko)).join('')}</div>
    <div class="nav-label">COMPONENTS</div><div class="nav-section">${item('/components', '전체 컴포넌트')}${groups.map(group => `<details ${currentGroup === group ? 'open' : ''}><summary>${group}</summary>${components.filter(c => c.group === group).map(c => item('/components/' + c.id, c.name)).join('')}</details>`).join('')}</div>
    <div class="nav-label">적용 예시</div><div class="nav-section">${screenExamples.map(screen => `<a href="${screen.url}">${screen.name}</a>`).join('')}</div>`;
}

export function overviewStructure(card, icon) {
  return `<section class="overview-heading"><h1>Deep Design System</h1><p>회사 서비스가 함께 사용하는 디자인 규칙, 컴포넌트와 적용 방법.</p><a class="btn overview-guide-link" href="./design-system-guide.html" target="_blank" rel="noopener noreferrer" aria-label="디자인시스템이 뭔가요? (새 창)">디자인시스템이 뭔가요?</a></section>
    <div class="entry-grid">${[
      ['기반 규칙', '색상·글자·간격·접근성', '/foundations/color'],
      ['컴포넌트', '용도·규격·상태·조작·코드', '/components'],
      ['AI로 적용하기', '설정 프롬프트·고정 버전 파일', '/setup']
    ].map(([title, description, url]) => `<a href="#${url}" class="entry-card"><div><h3>${title}</h3><p>${description}</p></div>${icon('arrow')}</a>`).join('')}</div>
    <div class="section-heading"><h2>주요 컴포넌트</h2><a class="section-link" href="#/components" aria-label="전체 컴포넌트 보기">전체 보기</a></div>
    <div class="component-grid">${['button','input','card','tabs','badge','dialog'].map(id => card(id)).join('')}</div>
    <div class="section-heading"><h2>적용 예시</h2></div><div class="entry-grid">${screenExamples.map(screen => `<a href="${screen.url}" class="entry-card"><div><h3>${screen.name}</h3><p>${screen.description}</p></div>${icon('arrow')}</a>`).join('')}</div>`;
}

export function componentCardStructure(c, previewHTML, arrowHTML){return `<article class="component-card" data-component="${c.id}"><div class="component-preview"><div class="preview-inner inert-preview" inert aria-hidden="true">${previewHTML}</div></div><div class="card-caption"><div><h3><a class="component-card-link" href="#/components/${c.id}" aria-label="${escapeHTML(c.name)} · ${escapeHTML(c.ko)} 컴포넌트 보기">${escapeHTML(c.name)}</a></h3><p>${escapeHTML(c.ko)}</p></div><span class="component-card-arrow" aria-hidden="true">${arrowHTML}</span></div></article>`;}

export function componentIndexStructure({components, groups, selectedGroup='All'}, card, icon) {
  const head=(category,title,description,tag='')=>`<div class="breadcrumbs"><a href="#/">DDS</a><span>/</span><span>${category}</span></div><div class="page-heading"><div><h1>${title}</h1><p class="lead">${description}</p></div>${tag}</div>`;
  const badge=label=>`<span class="badge dds-badge ">${escapeHTML(label)}</span>`;
  const btn=(label,cls='',extra='')=>`<button class="btn ${cls}" ${extra}>${label}</button>`;
  return head('COMPONENTS','Components','컴포넌트별 구조, 상태, 사용법과 코드 예제.',badge(`${components.length} components`))+`<div class="filter-bar"><div class="pill-tabs" role="group" aria-label="컴포넌트 분류">${['All',...groups].map(g=>btn(g,g===selectedGroup?'selected':'',`data-group="${g}" aria-pressed="${g===selectedGroup}"`)).join('')}</div><label class="search-field">${icon('search')}<input type="search" id="component-search" placeholder="컴포넌트 검색" aria-label="컴포넌트 검색"></label></div><div id="component-results" class="component-grid">${components.filter(c=>selectedGroup==='All'||c.group===selectedGroup).map(card).join('')}</div>`;}
