import {icon} from './icons.js?v=37572f4be3f4fe6a';
import {statusBadge, collectionCount} from './visibility.js?v=37572f4be3f4fe6a';
import {chartData, chartDemo} from './chart-system.js?v=37572f4be3f4fe6a';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
let renderSequence = 0;
const safeId = value => String(value).replace(/[^a-zA-Z0-9_-]/g, '-');

export const contentBlocks = [
  {id: 'social-proof', title: '소셜 프루프', category: 'marketing', description: '인용문과 작성자 정보를 담은 여섯 개의 후기 카드.', components: ['card', 'avatar']},
  {id: 'feature-navigation', title: '여러 기능 탐색', category: 'marketing', description: '선택한 기능의 설명과 화면 구성을 함께 보여 주는 탐색.', components: ['accordion', 'button', 'chip', 'input', 'card', 'badge']},
  {id: 'hero', title: '히어로', category: 'marketing', description: '소개와 주요 행동 아래에 배치한 여섯 개의 작업 UI.', components: ['button', 'input', 'select', 'checkbox', 'switch', 'card', 'progress', 'area-chart']},
  {id: 'content-gallery', title: '콘텐츠 갤러리', category: 'marketing', description: '대표 컴포넌트를 보여 주는 여섯 개의 미리보기 카드.', components: ['button', 'segmented-control', 'badge', 'avatar', 'progress', 'contributions']},
  {id: 'how-it-works', title: '작동 방식', category: 'marketing', description: '시각 예시와 설명으로 안내하는 세 단계.', components: ['card', 'chip', 'button']},
  {id: 'pricing', title: '프라이싱', category: 'marketing', description: '결제 주기별 두 플랜의 가격과 포함 항목 비교.', components: ['card', 'button', 'segmented-control']},
  {id: 'faq', title: '자주 묻는 질문', category: 'marketing', description: '여섯 개의 질문과 답변을 접고 펼치는 안내.', components: ['accordion', 'button']}
];

// Fictional, original copy for the composition example. No customer endorsement
// or measured service outcome is claimed.
const testimonials = [
  {quote: '경험을 한곳에 모아 보니 어떤 이야기를 자기소개서에 담을지 정리하기 쉬웠어요.', name: '김○○', job: '프로덕트 디자이너', initial: '김'},
  {quote: '무엇을 했는지 적는 데서 그치지 않고, 그 일을 한 이유까지 생각하게 됐어요.', name: '이○○', job: '서비스 기획자', initial: '이'},
  {quote: '문서 작성과 면접 준비를 오가면서 필요한 내용을 같은 방식으로 찾을 수 있었어요.', name: '박○○', job: '프론트엔드 개발자', initial: '박'},
  {quote: '입력할 항목과 순서가 분명해서 처음 준비할 때도 차근차근 시작할 수 있었어요.', name: '최○○', job: '마케터', initial: '최'},
  {quote: '지나쳤던 작은 경험도 제 역할과 배운 점을 중심으로 다시 돌아보게 됐어요.', name: '정○○', job: '데이터 분석가', initial: '정'},
  {quote: '작성한 내용을 다시 읽고 고치는 과정에 집중할 수 있어서 준비가 한결 편해졌어요.', name: '서○○', job: 'UX 리서처', initial: '서'}
];

function action(label, href, {variant = 'outlined', color = 'assistive', size = 'sm'} = {}) {
  return `<a class="dds-button" data-variant="${variant}" data-color="${color}" data-control-size="${size}" href="${href}"><span class="dds-button-label"><span>${escapeHTML(label)}</span>${icon('ArrowRight')}</span></a>`;
}

function socialProof() {
  return `<section class="dbc-social-proof" data-dbc-block="social-proof" aria-label="서비스 사용 후기"><div class="dbc-testimonial-grid">${testimonials.map(item => `<figure class="dds-content-card dbc-testimonial"><blockquote><p>“${escapeHTML(item.quote)}”</p></blockquote><figcaption class="dbc-testimonial-author"><span class="avatar dbc-testimonial-avatar" aria-hidden="true">${item.initial}</span><span class="dbc-testimonial-identity"><span class="dbc-testimonial-name">${item.name}</span><span class="db-muted">${item.job}</span></span></figcaption></figure>`).join('')}</div></section>`;
}

function appearancePreview() {
  return `<div class="dbc-appearance-preview" aria-hidden="true" inert>
    <div class="dbc-brand-tiles"><div class="dds-content-card dbc-logo-tile"><span class="dbc-monogram">DDS</span></div><div class="dds-content-card dbc-wordmark-tile"><span>Deep<br>Design System</span></div></div>
    <div class="dbc-brand-palette"><div class="dbc-brand-swatch dbc-brand-swatch--primary"><span>Primary</span></div><div class="dbc-brand-swatch dbc-brand-swatch--light"><span>Light</span></div><div class="dbc-brand-swatch dbc-brand-swatch--deep"><span>Deep</span></div></div>
    <div class="dds-content-card dbc-type-specimen"><p class="dbc-type-korean">경험을 연결해,<br>다음 가능성으로.</p><p class="dbc-type-english">Design for your next step.</p></div>
  </div>`;
}

function componentsPreview(prefix) {
  return `<div class="dbc-components-preview" aria-hidden="true" inert>
    <div class="dds-content-card dbc-component-samples"><div class="db-inline"><button type="button" class="dds-button" data-variant="solid" data-color="primary" data-control-size="sm" tabindex="-1"><span class="dds-button-label">작성 시작</span></button><button type="button" class="dds-button" data-variant="outlined" data-color="assistive" data-control-size="sm" tabindex="-1"><span class="dds-button-label">이전 단계</span></button></div><div class="db-inline"><span class="chip selected">프로덕트 디자인</span><span class="chip">사용자 리서치</span></div><div class="field" data-control-size="sm"><label for="${prefix}-sample-title">문서 제목</label><input id="${prefix}-sample-title" value="프로덕트 디자이너 지원서" readonly tabindex="-1"></div></div>
    <article class="dds-content-card dbc-composed-card"><div class="db-header"><h3 class="db-section-title">지원 정보</h3>${statusBadge('draft', '작성 중', icon)}</div><div class="dbc-composed-copy"><p class="dds-card-title">더 나은 경험을 만드는 디자이너</p><p class="dds-meta-primary">프로덕트 디자인 · 사용자 경험</p></div><p class="db-muted">문제를 발견하고 해결한 경험을 구체적으로 정리해 보세요.</p><div><button type="button" class="dds-button" data-variant="outlined" data-color="assistive" data-control-size="sm" tabindex="-1"><span class="dds-button-label">이어서 작성${icon('ArrowRight')}</span></button></div></article>
  </div>`;
}

function adoptionPreview() {
  return `<div class="dds-content-card dbc-adoption-preview" aria-hidden="true" inert>
    <div class="dbc-guide-sidebar"><span class="dbc-guide-name">적용 가이드</span><ul><li class="is-current">적용 순서</li><li>타이포그래피</li><li>간격</li><li>연결할 요소</li></ul></div>
    <div class="dbc-guide-content"><h3 class="db-section-title">화면 적용 기준</h3><section class="dbc-guide-section"><h4>글자 역할</h4><p class="dbc-guide-body">내용을 편하게 읽을 수 있도록</p><p class="db-muted">보조 설명은 한 단계 낮은 위계로</p></section><section class="dbc-guide-section"><h4>공통 간격</h4><div class="dbc-spacing-samples"><span><i class="dbc-space-8"></i>8px</span><span><i class="dbc-space-16"></i>16px</span><span><i class="dbc-space-24"></i>24px</span></div></section><section class="dbc-guide-section"><h4>연결할 요소</h4><div class="db-inline"><span class="badge dds-badge">입력창</span><span class="badge dds-badge">선택 상자</span><span class="badge dds-badge">버튼</span></div></section><div class="dbc-guide-check">${icon('Check')}<span>기존 기능과 입력 값을 유지합니다.</span></div></div>
  </div>`;
}

const features = [
  {id: 'appearance', title: '디자인 설정', description: '브랜드 색상과 서체를 골라 서비스에 어울리는 조합을 확인하세요.', action: '색상 문서 보기', href: '#/foundations/color', previewLabel: '로고, 브랜드 색상 세 가지와 한글·영문 타이포그래피 구성'},
  {id: 'components', title: '컴포넌트와 블록', description: '버튼과 입력창부터 화면 구성까지, 필요한 요소를 같은 규칙으로 조합하세요.', action: '컴포넌트 보기', href: '#/components', previewLabel: '버튼, 직무 칩과 입력창을 조합한 지원 정보 카드'},
  {id: 'adoption', title: '적용 가이드', description: '글자와 간격, 연결할 요소를 확인하고 기존 기능을 유지하며 화면에 적용하세요.', action: '적용 가이드 보기', href: '#/handoff', previewLabel: '글자 역할, 공통 간격과 연결할 요소를 정리한 적용 가이드'}
];

function featureNavigation(prefix) {
  const previews = [appearancePreview(), componentsPreview(prefix), adoptionPreview()];
  return `<section class="dbc-feature-navigation" data-dbc-block="feature-navigation" aria-labelledby="${prefix}-title"><div class="dbc-feature-copy"><h2 class="dbc-feature-title" id="${prefix}-title">서비스 화면을 만드는<br>Deep Design System</h2><div class="dbc-feature-accordion">${features.map((feature, index) => `<section class="dbc-feature-item"><h3><button type="button" class="dbc-feature-trigger" id="${prefix}-trigger-${feature.id}" data-dbc-feature="${feature.id}" aria-expanded="${index === 0}" aria-controls="${prefix}-description-${feature.id}"><span>${feature.title}</span>${icon('ChevronDown')}</button></h3><div class="dbc-feature-description" id="${prefix}-description-${feature.id}" role="region" aria-labelledby="${prefix}-trigger-${feature.id}" ${index === 0 ? '' : 'hidden'}><p class="db-muted">${feature.description}</p>${action(feature.action, feature.href)}</div></section>`).join('')}</div></div><div class="dbc-feature-previews">${features.map((feature, index) => `<div class="dbc-feature-preview" id="${prefix}-preview-${feature.id}" data-dbc-preview="${feature.id}" role="img" aria-label="${feature.previewLabel}" ${index === 0 ? '' : 'hidden'}>${previews[index]}</div>`).join('')}</div></section>`;
}

function button(label, attrs = '', variant = 'solid', color = 'primary', size = 'sm') {
  return `<button type="button" class="dds-button" data-variant="${variant}" data-color="${color}" data-control-size="${size}" ${attrs}><span class="dds-button-label">${escapeHTML(label)}</span></button>`;
}
function tabs(prefix, label, items, hook, separate = false) {
  return `<div class="segmented dbc-tabs" role="tablist" aria-label="${label}">${items.map(([value, name], index) => `<button type="button" role="tab" id="${prefix}-tab-${value}" aria-controls="${prefix}-panel${separate ? `-${value}` : ''}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" ${hook}="${value}">${name}</button>`).join('')}</div>`;
}
function taskList(prefix) {
  const tasks = ['요구사항 정리', '정보 구조 검토', '화면 구성', '사용성 확인'];
  const done = 2;
  return `<section class="dbc-task-group db-stack" data-dbc-task-group><div class="db-header"><h3 class="db-section-title">출시 준비</h3><output data-dbc-task-count>${done}/${tasks.length}</output></div><progress max="${tasks.length}" value="${done}" data-dbc-task-progress aria-label="준비 완료 비율"></progress>${tabs(prefix, '준비 작업 보기', [['all', '전체'], ['unfinished', '진행 중']], 'data-dbc-task-filter')}<div id="${prefix}-panel" role="tabpanel" aria-labelledby="${prefix}-tab-all"><ul class="dbc-task-list">${tasks.map((task, index) => `<li data-dbc-task-row><label><input type="checkbox" id="${prefix}-task-${index}" data-dbc-task ${index < done ? 'checked' : ''}><span>${task}</span></label></li>`).join('')}</ul><p class="db-muted" data-dbc-task-empty role="status" hidden>진행 중인 작업이 없습니다.</p></div></section>`;
}
function activityCard(prefix) {
  const data = chartData('area-chart', 'basic'), values = data.series[0].values;
  return `<section class="dbc-activity-mini db-stack" data-dbc-data-card><div class="db-header"><h3 class="db-section-title">검토 활동</h3><span class="db-muted">최근 ${data.labels.length}주</span></div><div class="dbc-activity-total"><span class="db-muted">검토 횟수</span><strong>${values.reduce((sum, value) => sum + value, 0)}<span>회</span></strong></div>${tabs(prefix, '활동 표시 방식', [['chart', '추이'], ['values', '수치']], 'data-dbc-data-mode', true)}<div role="tabpanel" id="${prefix}-panel-chart" aria-labelledby="${prefix}-tab-chart" data-dbc-data-panel="chart"><div class="dbc-mini-chart" aria-hidden="true" inert>${chartDemo('area-chart', prefix + '-chart', true)}</div></div><div role="tabpanel" id="${prefix}-panel-values" aria-labelledby="${prefix}-tab-values" data-dbc-data-panel="values" hidden><dl class="dbc-activity-values">${data.labels.map((label, index) => `<div><dt>${label}</dt><dd>${values[index]}회</dd></div>`).join('')}</dl></div></section>`;
}
const projects = [['고객센터 개선', 'team', 5, 8], ['채용 페이지', 'personal', 2, 5], ['디자인 가이드', 'team', 7, 9]];
function projectRow(title, scope, done, total) {
  const percent = Math.round(done / total * 100);
  return `<li data-dbc-project-row data-dbc-project-title="${escapeHTML(title)}" data-dbc-project-scope="${scope}"><div class="db-header"><span>${escapeHTML(title)}</span><span class="db-muted">${percent}%</span></div><progress max="${total}" value="${done}" aria-label="${escapeHTML(title)} 진행률"></progress></li>`;
}
function hero(prefix) {
  return `<section class="dbc-hero-block db-stack" data-dbc-block="hero" aria-labelledby="${prefix}-title"><header class="dbc-landing-heading"><h2 id="${prefix}-title">같은 기준으로,<br>더 자연스러운 화면을.</h2><p class="db-muted">일관된 컴포넌트와 화면 구성으로<br>제품을 만드는 과정에 집중하세요.</p><div class="db-inline dbc-centered-actions">${action('컴포넌트 보기', '#/components', {variant: 'solid', color: 'primary', size: 'md'})}${action('적용 가이드', '#/handoff', {size: 'md'})}</div></header><div class="dbc-hero-columns" data-control-size="sm">
    <div class="dbc-hero-column"><section class="dds-content-card dbc-ui-card db-stack"><h3 class="db-section-title">프로젝트 만들기</h3><form class="db-stack" data-dbc-project-form novalidate><div class="field"><label for="${prefix}-project-name">프로젝트 이름</label><input id="${prefix}-project-name" data-dbc-project-name placeholder="프로젝트 이름 입력" required aria-describedby="${prefix}-project-feedback"></div><div class="field"><label for="${prefix}-team">팀</label><select id="${prefix}-team"><option>디자인팀</option><option>서비스기획팀</option><option>개발팀</option></select></div><fieldset class="dbc-radio-group"><legend>공개 범위</legend><label><input type="radio" name="${prefix}-scope" value="team" checked>팀 공개</label><label><input type="radio" name="${prefix}-scope" value="personal">나만 보기</label></fieldset><div class="db-inline">${button('초기화', 'data-dbc-project-reset', 'outlined', 'assistive')}<button type="submit" class="dds-button" data-variant="solid" data-color="primary" data-control-size="sm"><span class="dds-button-label">만들기</span></button></div><p class="db-muted dbc-feedback" id="${prefix}-project-feedback" data-dbc-project-feedback role="status"></p></form></section>
    <section class="dds-content-card dbc-ui-card db-stack"><h3 class="db-section-title">알림 설정</h3><label class="switch-label dbc-notification-switch"><span>알림 받기</span><input type="checkbox" role="switch" data-dbc-notification-switch aria-label="알림 받기" checked><span class="switch-track" aria-hidden="true"></span></label><fieldset class="db-stack dbc-notification-options"><div class="db-inline"><label class="dbc-check"><input type="checkbox" data-dbc-notification-option value="이메일" checked>이메일</label><label class="dbc-check"><input type="checkbox" data-dbc-notification-option value="푸시 알림">푸시 알림</label></div><div class="field"><label for="${prefix}-frequency">이메일 요약</label><select id="${prefix}-frequency" data-dbc-frequency><option>매주</option><option>매일</option><option>받지 않음</option></select></div><div class="db-header"><label for="${prefix}-volume">알림음</label><output data-dbc-volume-output>60%</output></div><input id="${prefix}-volume" class="dds-slider" type="range" min="0" max="100" value="60" data-dbc-volume style="--value:60%"></fieldset>${button('설정 확인', 'data-dbc-notification-review', 'outlined', 'assistive')}<p class="db-muted dbc-feedback" data-dbc-notification-result role="status"></p></section></div>
    <div class="dbc-hero-column"><section class="dds-content-card dbc-ui-card db-stack" data-dbc-members><div class="db-header"><h3 class="db-section-title">팀 멤버</h3><button type="button" class="dds-button" data-variant="outlined" data-color="assistive" data-control-size="sm" data-icon-only="true" data-dbc-member-toggle aria-label="멤버 추가" data-tooltip="멤버 추가" aria-expanded="false" aria-controls="${prefix}-member-form"><span class="dds-button-label">${icon('Plus')}</span></button></div><ul class="dbc-member-list" data-dbc-member-list>${[['김○○', '소유자'], ['박○○', '편집자'], ['이○○', '뷰어']].map(([name, role]) => `<li><span class="avatar" aria-hidden="true">${name[0]}</span><span class="dbc-member-name">${name}</span><span class="db-muted">${role}</span></li>`).join('')}</ul><span data-dbc-member-count>${collectionCount(3, {label: '멤버', unit: '명'})}</span><form class="db-stack" id="${prefix}-member-form" data-dbc-member-form hidden novalidate><div class="field"><label for="${prefix}-member-name">이름</label><input id="${prefix}-member-name" data-dbc-member-name required placeholder="이름 입력"></div><div class="field"><label for="${prefix}-member-role">역할</label><select id="${prefix}-member-role" data-dbc-member-role><option>뷰어</option><option>편집자</option></select></div><button type="submit" class="dds-button" data-variant="solid" data-color="primary" data-control-size="sm"><span class="dds-button-label">목록에 추가</span></button><p class="db-muted dbc-feedback" data-dbc-member-feedback role="status"></p></form></section><section class="dds-content-card dbc-ui-card">${activityCard(prefix + '-hero-activity')}</section></div>
    <div class="dbc-hero-column"><section class="dds-content-card dbc-ui-card">${taskList(prefix + '-readiness')}</section><section class="dds-content-card dbc-ui-card db-stack" data-dbc-projects><div class="db-header"><h3 class="db-section-title">내 프로젝트</h3><span data-dbc-project-count>${collectionCount(projects.length, {label: '프로젝트'})}</span></div><label class="search-field"><span class="sr-only">프로젝트 검색</span>${icon('Search')}<input type="search" data-dbc-project-search aria-label="프로젝트 검색" placeholder="프로젝트 검색"></label>${tabs(prefix + '-projects', '프로젝트 보기', [['all', '전체'], ['personal', '나만 보기']], 'data-dbc-project-filter')}<div role="tabpanel" id="${prefix}-projects-panel" aria-labelledby="${prefix}-projects-tab-all"><ul class="dbc-project-list" data-dbc-project-list>${projects.map(args => projectRow(...args)).join('')}</ul><p class="db-muted" data-dbc-project-empty hidden>일치하는 프로젝트가 없습니다.</p></div></section></div>
  </div></section>`;
}
function contentGallery(prefix) {
  const examples = [
    ['button', '버튼', `<span class="dds-button" data-variant="solid" data-color="primary" data-control-size="md"><span class="dds-button-label">시작하기</span></span>`],
    ['segmented-control', '세그멘티드 컨트롤', `<div class="dds-segmented">${['전체', '작성 중', '완료'].map((name, index) => `<label class="dds-choice"><input type="radio" name="${prefix}-gallery-segment" ${index === 0 ? 'checked' : ''}><span>${name}</span></label>`).join('')}</div>`],
    ['badge', '상태 배지', `<div class="db-stack">${statusBadge('draft', '작성 중', icon)}${statusBadge('complete', '검토 완료', icon)}</div>`],
    ['avatar', '아바타', `<div class="dbc-gallery-avatars">${['김', '박', '이'].map(name => `<span class="avatar">${name}</span>`).join('')}</div>`],
    ['progress', '진행률', `<div class="dbc-gallery-progress"><div class="db-header"><span>입력 완료</span><span>64%</span></div><progress max="11" value="7" aria-label="입력 완료 비율"></progress></div>`],
    ['contributions', '활동량 히트맵', chartDemo('contributions', prefix + '-gallery-heatmap', true)]
  ];
  return `<section class="dbc-content-gallery db-stack" data-dbc-block="content-gallery"><header class="dbc-landing-heading"><h2>하나의 기준으로,<br>필요한 화면을 조합하세요.</h2><p class="db-muted">기본 입력부터 상태 표시까지, 자주 쓰는 요소를 같은 방식으로 사용합니다.</p></header><div class="dbc-gallery-grid">${examples.map(([id, title, preview]) => `<article class="dds-content-card dbc-gallery-card"><div class="dbc-gallery-preview" aria-hidden="true" inert>${preview}</div><h3 class="db-section-title"><a class="dds-card-link" href="#/components/${id}">${title}</a></h3><span class="dbc-gallery-arrow" aria-hidden="true">${icon('ArrowUpRight')}</span></article>`).join('')}</div><div class="dbc-centered-actions">${action('모든 컴포넌트 보기', '#/components')}</div></section>`;
}
function howItWorks() {
  const visuals = [
    `<div class="dds-content-card dbc-step-brand"><span>브랜드 스타일</span><div class="dbc-step-swatches">${[500, 400, 200, 100].map(step => `<i style="background:var(--brand-${step})"></i>`).join('')}</div><div class="db-inline"><strong>Aa</strong><span class="db-muted">하나의 디자인 기준</span></div></div>`,
    `<div class="dbc-step-blocks">${['히어로', '갤러리', 'FAQ', '프라이싱'].map(name => `<span class="chip">${name}</span>`).join('')}</div>`,
    `<div class="dbc-phone"><span class="dbc-phone-speaker"></span><span class="dbc-phone-title">내 작업</span><div class="dbc-phone-card"><span>새로운 문서</span><i></i><i></i></div><span class="dds-button" data-variant="solid" data-color="primary" data-control-size="sm"><span class="dds-button-label">문서 보기</span></span></div>`
  ];
  const steps = [['브랜드 기준 정하기', '서비스의 색상과 서체를 정하고 화면 전체에 같은 기준을 적용합니다.'], ['필요한 구성 조합하기', '목적에 맞는 블록을 골라 페이지의 흐름과 정보를 배치합니다.'], ['서비스에 맞춰 완성하기', '실제 콘텐츠와 기능을 연결하고 다양한 화면 크기에서 확인합니다.']];
  return `<section class="dbc-how-it-works db-stack" data-dbc-block="how-it-works"><header><h2 class="dbc-large-title">화면을 완성하는<br>세 가지 단계</h2></header><div class="dbc-steps-grid">${steps.map(([title, description], index) => `<article class="dbc-step"><div class="dbc-step-visual" aria-hidden="true" inert>${visuals[index]}</div><h3 class="db-section-title">${index + 1}. ${title}</h3><p class="db-muted">${description}</p></article>`).join('')}</div></section>`;
}
const planFeatures = ['개인 작업 공간', '문서 작성과 보관', '문서 검색과 필터', '기본 보기 설정', '표준 컴포넌트', '팀 작업 공간', '문서 공동 검토', '공유 설정'];
function pricing(prefix) {
  return `<section class="dbc-pricing db-stack" data-dbc-block="pricing"><header class="dbc-landing-heading"><h2>필요한 만큼 선택하세요.</h2><p class="db-muted">혼자 시작하는 작업부터 팀의 협업까지<br>사용 방식에 맞는 플랜을 선택하세요.</p></header>${tabs(prefix + '-billing', '결제 주기', [['yearly', '연 결제'], ['monthly', '월 결제']], 'data-dbc-billing')}<p class="db-muted dbc-pricing-discount">연 결제 시 <strong>20%</strong> 할인</p><div class="dbc-plan-grid" role="tabpanel" id="${prefix}-billing-panel" aria-labelledby="${prefix}-billing-tab-yearly">${[['basic', '기본', 0], ['team', '팀', 12000]].map(([id, title, price]) => `<article class="dds-content-card dbc-plan${id === 'team' ? ' dbc-plan--team' : ''}" data-dbc-plan="${id}"><h3 class="db-section-title">${title}</h3><p class="dbc-plan-price"><strong data-dbc-price>${price.toLocaleString('ko-KR')}</strong><span>원${price ? ' / 월' : ''}</span></p><p class="db-muted" data-dbc-price-note>${price ? '연 144,000원 결제' : '무료'}</p><ul class="dbc-plan-features">${planFeatures.map((name, index) => `<li${id === 'basic' && index >= 5 ? ' class="is-excluded"' : ''}>${icon(id === 'basic' && index >= 5 ? 'Minus' : 'Check')}<span>${id === 'basic' && index >= 5 ? '<span class="sr-only">미포함: </span>' : '<span class="sr-only">포함: </span>'}${name}</span></li>`).join('')}</ul>${button('이 플랜 선택', `data-dbc-plan-select="${id}" aria-pressed="false" data-full-width="true"`, id === 'team' ? 'solid' : 'outlined', id === 'team' ? 'primary' : 'assistive')}</article>`).join('')}</div><p class="dbc-plan-selection db-muted" data-dbc-plan-result role="status" aria-live="polite"></p></section>`;
}
const questions = [
  ['DDS에는 무엇이 들어 있나요?', '색상과 타이포그래피 규칙, 기본 컴포넌트와 화면 블록을 제공합니다. 사용 방법과 개발 적용 기준도 함께 확인할 수 있습니다.'],
  ['컴포넌트와 블록은 언제 사용하나요?', '버튼이나 입력창처럼 개별 요소가 필요하면 컴포넌트를 사용합니다. 로그인과 문서 탐색처럼 여러 요소가 함께 필요한 경우 블록의 구성을 참고합니다.'],
  ['다른 서비스의 브랜드에도 적용할 수 있나요?', '디자인 설정에서 브랜드 색상과 서체를 조합할 수 있습니다. 서비스에 적용할 때는 정해진 토큰과 컴포넌트 역할을 유지합니다.'],
  ['AI와 작업할 때는 무엇을 전달하나요?', 'AI로 적용하기의 프롬프트와 프로젝트 규칙, 고정된 DDS 버전 자료를 전달합니다. 기존 코드와 실제 업무 흐름도 함께 확인해야 합니다.'],
  ['라이트·다크 화면을 함께 만들 수 있나요?', '공통 색상 토큰에 라이트·다크 값이 연결돼 있습니다. 직접 지정한 색상이나 이미지, 차트 설정은 두 화면에서 따로 확인합니다.'],
  ['기존 화면에는 어떻게 적용하나요?', '개발 적용 안내에서 환경과 연결할 요소를 먼저 확인합니다. 기존 데이터와 이벤트를 유지하면서 스타일과 필요한 마크업을 적용합니다.']
];
function faq(prefix) {
  return `<section class="dbc-faq db-stack" data-dbc-block="faq"><h2 class="dbc-large-title">자주 묻는 질문</h2><div class="dbc-faq-list">${questions.map(([question, answer], index) => `<details class="dbc-faq-item" name="${prefix}-faq" ${index === 0 ? 'open' : ''}><summary id="${prefix}-question-${index}" aria-controls="${prefix}-answer-${index}" aria-expanded="${index === 0}"><span>${question}</span>${icon('ChevronDown')}</summary><div id="${prefix}-answer-${index}" role="region" aria-labelledby="${prefix}-question-${index}"><p class="db-muted">${answer}</p></div></details>`).join('')}</div><p class="db-muted dbc-faq-footer">더 자세한 적용 방법이 궁금하신가요? <a href="#/handoff">개발 적용 안내 보기</a></p></section>`;
}

export function renderContentBlock(id, uid) {
  const prefix = `dbc-${safeId(uid || `content-${++renderSequence}`)}`;
  const renderers = {'social-proof': socialProof, 'feature-navigation': featureNavigation, hero, 'content-gallery': contentGallery, 'how-it-works': howItWorks, pricing, faq};
  return renderers[id]?.(prefix) || '';
}

const bindings = new WeakMap();

export function bindContentBlocks(root = document) {
  if (!root?.addEventListener || !root?.contains) return () => {};
  bindings.get(root)?.();
  const controller = new AbortController();
  const options = {signal: controller.signal};
  const blockOf = trigger => {
    const block = trigger?.closest?.('[data-dbc-block="feature-navigation"]');
    return block && (block === root || root.contains(block)) ? block : null;
  };
  function selectFeature(trigger) {
    const block = blockOf(trigger);
    if (!block) return;
    const selected = trigger.dataset.dbcFeature;
    for (const item of block.querySelectorAll('[data-dbc-feature]')) {
      const active = item === trigger;
      item.setAttribute('aria-expanded', String(active));
      item.closest('.dbc-feature-item').querySelector('.dbc-feature-description').hidden = !active;
    }
    for (const panel of block.querySelectorAll('[data-dbc-preview]')) panel.hidden = panel.dataset.dbcPreview !== selected;
  }
  function selectTab(trigger) {
    const group = trigger.closest('[role="tablist"]');
    for (const item of group.querySelectorAll('[role="tab"]')) {item.setAttribute('aria-selected', String(item === trigger)); item.tabIndex = item === trigger ? 0 : -1;}
    return group;
  }
  function updateTasks(group) {
    const fields = [...group.querySelectorAll('[data-dbc-task]')], done = fields.filter(field => field.checked).length;
    const active = group.ownerDocument.activeElement, activeIndex = fields.indexOf(active);
    group.querySelector('[data-dbc-task-count]').textContent = `${done}/${fields.length}`;
    const progress = group.querySelector('[data-dbc-task-progress]'); if (progress) progress.value = done;
    const unfinished = group.querySelector('[data-dbc-task-filter][aria-selected="true"]')?.dataset.dbcTaskFilter === 'unfinished';
    fields.forEach(field => {field.closest('[data-dbc-task-row]').hidden = unfinished && field.checked;});
    const empty = unfinished && done === fields.length;
    group.querySelector('[data-dbc-task-empty]').hidden = !empty;
    if (activeIndex >= 0 && active.closest('[data-dbc-task-row]').hidden) {
      const next = fields.slice(activeIndex + 1).find(field => !field.closest('[data-dbc-task-row]').hidden) || fields.slice(0, activeIndex).reverse().find(field => !field.closest('[data-dbc-task-row]').hidden);
      (next || group.querySelector('[data-dbc-task-filter][aria-selected="true"]')).focus({preventScroll: true});
    }
  }
  function updateProjects(block) {
    const scene = block.querySelector('[data-dbc-projects]'), query = scene.querySelector('[data-dbc-project-search]').value.trim().toLocaleLowerCase();
    const personal = scene.querySelector('[data-dbc-project-filter][aria-selected="true"]')?.dataset.dbcProjectFilter === 'personal';
    let count = 0;
    for (const row of scene.querySelectorAll('[data-dbc-project-row]')) {row.hidden = !row.dataset.dbcProjectTitle.toLocaleLowerCase().includes(query) || (personal && row.dataset.dbcProjectScope !== 'personal'); if (!row.hidden) count++;}
    scene.querySelector('[data-dbc-project-count]').innerHTML = collectionCount(count, {label: '프로젝트'});
    scene.querySelector('[data-dbc-project-empty]').hidden = count > 0;
  }
  function updatePricing(block) {
    const yearly = block.querySelector('[data-dbc-billing][aria-selected="true"]').dataset.dbcBilling === 'yearly';
    const paid = block.querySelector('[data-dbc-plan="team"]');
    paid.querySelector('[data-dbc-price]').textContent = (yearly ? 12000 : 15000).toLocaleString('ko-KR');
    paid.querySelector('[data-dbc-price-note]').textContent = yearly ? '연 144,000원 결제' : '매월 15,000원 결제';
    const selected = block.querySelector('[data-dbc-plan-select][aria-pressed="true"]');
    if (selected) block.querySelector('[data-dbc-plan-result]').textContent = selected.dataset.dbcPlanSelect === 'basic' ? '선택한 플랜: 기본 · 무료' : `선택한 플랜: 팀 · ${yearly ? '연 결제 · 연 144,000원' : '월 결제 · 월 15,000원'}`;
  }
  root.addEventListener('click', event => {
    const trigger = event.target?.closest?.('[data-dbc-feature]');
    if (trigger) selectFeature(trigger);
    const control = event.target?.closest?.('button'), block = control?.closest('[data-dbc-block]');
    if (!control || !block || !root.contains(block)) return;
    if (control.hasAttribute('data-dbc-data-mode')) {
      selectTab(control);
      const card = control.closest('[data-dbc-data-card]');
      card.querySelectorAll('[data-dbc-data-panel]').forEach(panel => {panel.hidden = panel.dataset.dbcDataPanel !== control.dataset.dbcDataMode;});
    } else if (control.hasAttribute('data-dbc-task-filter')) {
      selectTab(control); const group = control.closest('[data-dbc-task-group]');
      group.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', control.id); updateTasks(group);
    } else if (control.hasAttribute('data-dbc-project-filter')) {
      selectTab(control); control.closest('[data-dbc-projects]').querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', control.id); updateProjects(block);
    } else if (control.hasAttribute('data-dbc-project-reset')) {control.closest('form').reset(); control.closest('form').querySelector('[data-dbc-project-feedback]').textContent = ''; control.closest('form').querySelector('[data-dbc-project-name]').removeAttribute('aria-invalid');}
    else if (control.hasAttribute('data-dbc-member-toggle')) {
      const form = block.querySelector('[data-dbc-member-form]'); form.hidden = !form.hidden; control.setAttribute('aria-expanded', String(!form.hidden)); if (!form.hidden) form.querySelector('input').focus({preventScroll: true});
    } else if (control.hasAttribute('data-dbc-notification-review')) {
      const enabled = block.querySelector('[data-dbc-notification-switch]').checked;
      const names = [...block.querySelectorAll('[data-dbc-notification-option]:checked')].map(field => field.value);
      block.querySelector('[data-dbc-notification-result]').textContent = enabled ? `${names.join(', ') || '수신 채널 없음'} · 요약 ${block.querySelector('[data-dbc-frequency]').value} · 알림음 ${block.querySelector('[data-dbc-volume]').value}%` : '알림 받기가 꺼져 있습니다.';
    } else if (control.hasAttribute('data-dbc-billing')) {selectTab(control); block.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', control.id); updatePricing(block);}
    else if (control.hasAttribute('data-dbc-plan-select')) {block.querySelectorAll('[data-dbc-plan-select]').forEach(item => item.setAttribute('aria-pressed', String(item === control))); updatePricing(block);}
  }, options);
  const updateControl = event => {
    const field = event.target, block = field.closest?.('[data-dbc-block]'); if (!block || !root.contains(block)) return;
    if (field.matches('[data-dbc-task]')) updateTasks(field.closest('[data-dbc-task-group]'));
    if (field.matches('[data-dbc-project-search]')) updateProjects(block);
    if (field.matches('[data-dbc-volume]')) {block.querySelector('[data-dbc-volume-output]').textContent = `${field.value}%`; field.style.setProperty('--value', `${field.value}%`);}
    if (field.matches('[data-dbc-notification-switch]')) block.querySelector('.dbc-notification-options').disabled = !field.checked;
  };
  root.addEventListener('input', updateControl, options);
  root.addEventListener('change', updateControl, options);
  root.addEventListener('submit', event => {
    const form = event.target, block = form.closest?.('[data-dbc-block]');
    if (!block || !root.contains(block) || !form.matches('[data-dbc-project-form],[data-dbc-member-form]')) return;
    event.preventDefault();
    const field = form.querySelector('input'), value = field.value.trim();
    const message = form.querySelector('[role="status"]');
    if (!value) {field.setAttribute('aria-invalid', 'true'); message.textContent = '이름을 입력해 주세요.'; field.focus({preventScroll: true}); return;}
    field.removeAttribute('aria-invalid');
    if (form.hasAttribute('data-dbc-project-form')) {
      const scope = form.querySelector('[type="radio"]:checked').value;
      block.querySelector('[data-dbc-project-list]').insertAdjacentHTML('afterbegin', projectRow(value, scope, 0, 4)); updateProjects(block);
      message.textContent = `프로젝트 목록에 “${value}” 항목을 추가했습니다.`;
    } else {
      const role = form.querySelector('[data-dbc-member-role]').value;
      const list = block.querySelector('[data-dbc-member-list]');
      list.insertAdjacentHTML('beforeend', `<li><span class="avatar" aria-hidden="true">${escapeHTML(value[0])}</span><span class="dbc-member-name">${escapeHTML(value)}</span><span class="db-muted">${escapeHTML(role)}</span></li>`);
      block.querySelector('[data-dbc-member-count]').innerHTML = collectionCount(list.children.length, {label: '멤버', unit: '명'});
      message.textContent = `멤버 목록에 “${value}” 항목을 추가했습니다.`;
    }
  }, options);
  root.addEventListener('toggle', event => {
    const details = event.target;
    if (!details.matches?.('.dbc-faq-item')) return;
    const block = details.closest('[data-dbc-block="faq"]'); if (!block || !root.contains(block)) return;
    if (details.open) for (const sibling of block.querySelectorAll('.dbc-faq-item')) if (sibling !== details) sibling.open = false;
    details.querySelector('summary').setAttribute('aria-expanded', String(details.open));
  }, {...options, capture: true});
  root.addEventListener('keydown', event => {
    const tab = event.target?.closest?.('.dbc-tabs [role="tab"]');
    if (tab && root.contains(tab) && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      const items = [...tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')], index = items.indexOf(tab);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
      event.preventDefault(); event.stopPropagation(); items[next].focus({preventScroll: true}); items[next].click(); return;
    }
    const trigger = event.target?.closest?.('[data-dbc-feature]'), block = blockOf(trigger);
    if (!block || !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const triggers = [...block.querySelectorAll('[data-dbc-feature]')], index = triggers.indexOf(trigger);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? triggers.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + triggers.length) % triggers.length;
    event.preventDefault(); event.stopPropagation(); triggers[next].focus({preventScroll: true});
  }, options);
  let disposed = false;
  const cleanup = () => {if (disposed) return; disposed = true; controller.abort(); if (bindings.get(root) === cleanup) bindings.delete(root);};
  bindings.set(root, cleanup);
  return cleanup;
}
