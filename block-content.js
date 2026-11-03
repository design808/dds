import {icon} from './icons.js?v=54c3eb9808c7bdad';
import {collectionCount, statusBadge} from './visibility.js?v=54c3eb9808c7bdad';
import {chartData, chartDemo} from './chart-system.js?v=54c3eb9808c7bdad';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const safeId = value => String(value || 'content').replace(/[^a-zA-Z0-9_-]/g, '-');

export const contentBlocks = [
  {id:'hero', title:'랜딩 히어로', category:'marketing', description:'서비스 소개와 시작 행동, 문서 미리보기를 함께 배치합니다.', components:['button','card','badge']},
  {id:'feature-navigation', title:'기능 탐색', category:'marketing', description:'사용자가 필요한 작업을 선택하고 해당 화면으로 이동합니다.', components:['card']},
  {id:'activity-dashboard', title:'활동 현황', category:'data', description:'활동 합계와 추이를 확인하고 최근 문서를 찾아봅니다.', components:['card','badge','tabs','area-chart-stacked','table','button']},
  {id:'assessment-report', title:'역량 평가', category:'data', description:'평가 요약과 분포, 항목별 점수를 함께 확인합니다.', components:['card','badge','tabs','radar-chart','table','progress','button']},
];

const documentExcerpt = '사용자의 작은 불편을 발견하고, 팀과 함께 해결하는 과정에서 성장해 왔습니다. 고객 인터뷰와 사용성 검증을 바탕으로 문제를 정의하고, 더 쉽게 이해하고 사용할 수 있는 경험을 설계하겠습니다.';
const recentDocuments = [
  {kind:'coverletter', title:'프로덕트 디자이너 지원서', description:'자기소개서 · 지원 동기', date:'2026.11.02', datetime:'2026-11-02', state:'draft', stateLabel:'작성 중', href:'./prototypes/coverletter-write.html'},
  {kind:'interview', title:'프로덕트 디자인 면접', description:'AI 면접 · 직무 면접', date:'2026.11.01', datetime:'2026-11-01', state:'complete', stateLabel:'완료', href:'./prototypes/interview-setup.html'},
  {kind:'coverletter', title:'서비스 기획자 지원서', description:'자기소개서 · 문제 해결 경험', date:'2026.10.30', datetime:'2026-10-30', state:'complete', stateLabel:'검토 완료', href:'./prototypes/coverletter-write.html'},
  {kind:'interview', title:'서비스 기획 직무 면접', description:'AI 면접 · 경험 면접', date:'2026.10.28', datetime:'2026-10-28', state:'complete', stateLabel:'완료', href:'./prototypes/interview-setup.html'},
];
const activity = chartData('area-chart', 'stacked');
const activityTotals = activity.series.map(series => ({name:series.name, value:series.values.reduce((sum, value) => sum + (value ?? 0), 0)}));
const assessment = chartData('radar-chart', 'single');
const assessmentItems = assessment.labels.map((label, index) => ({label, value:assessment.series[0].values[index]}));
const assessmentAverage = Math.round(assessmentItems.reduce((sum, item) => sum + item.value, 0) / assessmentItems.length);
const highestAssessment = assessmentItems.reduce((highest, item) => item.value > highest.value ? item : highest);
const lowestAssessment = assessmentItems.reduce((lowest, item) => item.value < lowest.value ? item : lowest);
const assessmentTips = [
  '지원 직무의 업무와 자신의 경험을 연결해 보세요.',
  '결론을 먼저 말하고 근거를 이어가는 흐름을 유지하세요.',
  '본인의 역할·행동·결과를 수치나 사례로 설명해 보세요.',
  '문제를 발견한 과정과 해결 기준을 함께 설명해 보세요.',
  '팀 안에서 맡은 역할과 의견을 조율한 경험을 정리해 보세요.',
  '자신의 강점을 보여 주는 경험을 다음 답변에도 연결해 보세요.',
];

function actionLink(label, href, {variant='solid', color='primary', size='md', trailing=false}={}) {
  return `<a class="dds-button" data-variant="${variant}" data-color="${color}" data-control-size="${size}" href="${escapeHTML(href)}"><span class="dds-button-label">${escapeHTML(label)}</span>${trailing ? icon('ArrowRight') : ''}</a>`;
}

function blockChart(id, uid) {
  // Keep the existing chart, table, legend and keyboard behavior. The service
  // block supplies its own context instead of the catalog-only data caption.
  return `<div class="dbc-data-chart">${chartDemo(id, uid).replace('<span>예제 데이터</span>', '')}</div>`;
}

function hero(prefix) {
  return `<section class="dbc-hero" data-dbc-block="hero" aria-labelledby="${prefix}-title">
    <div class="dbc-hero-copy">
      <h2 class="dbc-hero-title" id="${prefix}-title">나의 경험이<br>좋은 자기소개서가 되도록.</h2>
      <p class="db-muted">어디서부터 써야 할지 막막하다면,<br>경험을 정리하는 것부터 딥레쥬메와 함께 시작하세요.</p>
      <div class="db-inline dbc-hero-actions">${actionLink('AI 자기소개서 작성', './prototypes/coverletter-info.html', {trailing:true})}${actionLink('내 문서 보기', './prototypes/mypage.html', {variant:'outlined',color:'assistive'})}</div>
    </div>
    <article class="dds-content-card dbc-hero-document" aria-labelledby="${prefix}-document">
      <div class="db-header">${statusBadge('draft','작성 중',icon)}<span class="dds-meta-date">자기소개서</span></div>
      <h3 class="dds-card-title" id="${prefix}-document">프로덕트 디자이너 지원서</h3>
      <p class="dds-meta-primary">지원 동기</p>
      <p class="dbc-document-copy">${escapeHTML(documentExcerpt)}</p>
      <div class="dbc-document-footer"><span class="dds-meta-date">공백 포함</span>${collectionCount(documentExcerpt.length,{label:'작성한 글자',unit:'자'})}</div>
    </article>
  </section>`;
}

function featureNavigation(prefix) {
  const features = [
    {title:'AI 자기소개서', description:'나의 경험을 정리하고 지원 직무에 맞는 문장을 완성하세요.', action:'작성 시작하기', href:'./prototypes/coverletter-info.html'},
    {title:'이력서', description:'학력과 경력, 프로젝트를 빠짐없이 담아 정리하세요.', action:'이력서 작성하기', href:'./prototypes/resume-write.html'},
    {title:'AI 면접', description:'직무와 경험을 바탕으로 질문에 답하고 면접을 준비하세요.', action:'면접 준비하기', href:'./prototypes/interview-setup.html'},
    {title:'내 작업 공간', description:'작성한 문서를 모아 보고 이어서 작업하세요.', action:'내 문서 확인하기', href:'./prototypes/mypage.html'},
  ];
  return `<section class="db-stack dbc-features" data-dbc-block="feature-navigation" aria-labelledby="${prefix}-title">
    <header><h2 class="db-title" id="${prefix}-title">무엇부터 시작할까요?</h2><p class="db-muted">지금 필요한 작업을 선택하세요.</p></header>
    <div class="dbc-feature-grid">${features.map(feature => `<article class="dds-content-card dbc-feature-card"><h3 class="dds-card-title"><a class="dds-card-link" href="${feature.href}">${escapeHTML(feature.title)}</a></h3><p class="dds-meta-secondary">${escapeHTML(feature.description)}</p><span class="dbc-feature-action" aria-hidden="true">${escapeHTML(feature.action)}${icon('ArrowRight')}</span></article>`).join('')}</div>
  </section>`;
}

function documentRows() {
  return recentDocuments.map(document => `<li data-dbc-kind="${document.kind}"><a class="dds-nav-link dbc-activity-row" href="${document.href}"><div class="dbc-activity-description"><span class="dds-meta-primary">${escapeHTML(document.title)}</span><span class="dds-meta-secondary">${escapeHTML(document.description)}</span></div>${statusBadge(document.state,document.stateLabel,icon)}<time class="dds-meta-date" datetime="${document.datetime}">${document.date}</time></a></li>`).join('');
}

function activityDashboard(prefix) {
  const total = activityTotals.reduce((sum, item) => sum + item.value, 0);
  const filters = [{key:'all',label:'전체'}, {key:'coverletter',label:'자기소개서'}, {key:'interview',label:'면접'}];
  return `<section class="db-stack dbc-activity" data-dbc-block="activity-dashboard" aria-labelledby="${prefix}-title">
    <header class="db-header"><div><h2 class="db-title" id="${prefix}-title">학습 활동</h2><p class="db-muted">최근 ${activity.labels.length}주 동안의 준비 과정을 확인하세요.</p></div>${actionLink('내 문서', './prototypes/mypage.html', {variant:'outlined',color:'assistive',size:'sm'})}</header>
    <dl class="dbc-stat-grid"><div class="dds-content-card dbc-stat"><dt>전체 활동</dt><dd>${total}<span>회</span></dd><dd class="dds-meta-date dbc-stat-note">${activity.labels.length}주 합계</dd></div>${activityTotals.map(item => `<div class="dds-content-card dbc-stat"><dt>${escapeHTML(item.name)}</dt><dd>${item.value}<span>회</span></dd><dd class="dds-meta-date dbc-stat-note">${activity.labels.length}주 합계</dd></div>`).join('')}</dl>
    <section class="dds-content-card dbc-chart-card" aria-label="주별 활동 추이">${blockChart('area-chart-stacked',prefix+'-activity-chart')}<p class="dbc-chart-scroll-hint dds-meta-date">좌우로 이동해 차트를 확인할 수 있습니다.</p></section>
    <section class="dds-content-card dbc-recent-documents" aria-labelledby="${prefix}-recent">
      <div class="db-header"><h3 class="db-section-title" id="${prefix}-recent">최근 문서</h3><span data-dbc-document-count>${collectionCount(recentDocuments.length,{label:'표시한 문서'})}</span></div>
      <div class="segmented dbc-tabs" role="tablist" aria-label="최근 문서 종류">${filters.map((filter,index) => `<button type="button" id="${prefix}-filter-${filter.key}" role="tab" aria-controls="${prefix}-documents" aria-selected="${index===0}" tabindex="${index===0 ? '0' : '-1'}" data-dbc-tab="${filter.key}">${filter.label}</button>`).join('')}</div>
      <div role="tabpanel" id="${prefix}-documents" aria-labelledby="${prefix}-filter-all" class="dbc-documents-panel"><ul class="dbc-activity-list">${documentRows()}</ul></div>
      <span class="sr-only" role="status" data-dbc-filter-status></span>
    </section>
  </section>`;
}

function assessmentReport(prefix) {
  return `<section class="db-stack dbc-report" data-dbc-block="assessment-report" aria-labelledby="${prefix}-title">
    <header class="db-header"><div><h2 class="db-title" id="${prefix}-title">면접 역량 분석</h2><p class="db-muted">프로덕트 디자인 · <time datetime="2026-11-02">2026.11.02</time></p></div>${statusBadge('complete','분석 완료',icon)}</header>
    <div class="segmented dbc-tabs" role="tablist" aria-label="평가 결과 보기"><button type="button" id="${prefix}-tab-overview" role="tab" aria-controls="${prefix}-overview" aria-selected="true" tabindex="0" data-dbc-tab="overview">종합 분석</button><button type="button" id="${prefix}-tab-scores" role="tab" aria-controls="${prefix}-scores" aria-selected="false" tabindex="-1" data-dbc-tab="scores">항목별 점수</button></div>
    <div id="${prefix}-overview" role="tabpanel" aria-labelledby="${prefix}-tab-overview" data-dbc-panel="overview" class="db-stack">
      <dl class="dbc-stat-grid"><div class="dds-content-card dbc-stat"><dt>종합 점수</dt><dd>${assessmentAverage}<span>/ 100점</span></dd><dd class="dds-meta-date dbc-stat-note">${assessmentItems.length}개 항목의 평균</dd></div><div class="dds-content-card dbc-stat"><dt>가장 높은 역량</dt><dd class="dbc-stat-name">${escapeHTML(highestAssessment.label)}</dd><dd class="dds-meta-secondary dbc-stat-note">${highestAssessment.value}점</dd></div><div class="dds-content-card dbc-stat"><dt>보완할 역량</dt><dd class="dbc-stat-name">${escapeHTML(lowestAssessment.label)}</dd><dd class="dds-meta-secondary dbc-stat-note">${lowestAssessment.value}점</dd></div></dl>
      <section class="dds-content-card dbc-chart-card" aria-label="평가 항목별 점수 분포">${blockChart('radar-chart',prefix+'-assessment-chart')}<p class="dbc-chart-scroll-hint dds-meta-date">좌우로 이동하거나 원본 데이터 표에서 점수를 확인하세요.</p></section>
      <section class="dds-content-card dbc-feedback" aria-labelledby="${prefix}-feedback"><h3 class="db-section-title" id="${prefix}-feedback">다음 면접을 위한 준비</h3><p class="dds-meta-secondary">${escapeHTML(lowestAssessment.label)} 항목은 ${lowestAssessment.value}점입니다. 경험을 설명할 때 본인이 맡은 역할과 행동, 그 결과를 구체적인 사례로 정리해 보세요.</p><div>${actionLink('다시 연습하기','./prototypes/interview-setup.html',{variant:'outlined',color:'assistive',size:'sm'})}</div></section>
    </div>
    <section id="${prefix}-scores" role="tabpanel" aria-labelledby="${prefix}-tab-scores" data-dbc-panel="scores" class="dds-content-card dbc-score-panel" hidden>
      <div class="db-header"><h3 class="db-section-title">항목별 점수</h3>${collectionCount(assessmentItems.length,{label:'평가 항목'})}</div>
      <div class="dbc-score-table-wrap"><table class="dbc-score-table"><caption class="sr-only">면접 역량 ${assessmentItems.length}개 항목의 점수와 준비 방법</caption><thead><tr><th scope="col">평가 항목</th><th scope="col">점수</th><th scope="col">다음 준비</th></tr></thead><tbody>${assessmentItems.map((item,index) => `<tr><th scope="row" id="${prefix}-score-${index}">${escapeHTML(item.label)}</th><td><div class="dbc-score-meter"><progress value="${item.value}" max="100" aria-labelledby="${prefix}-score-${index}">${item.value} / 100</progress><strong>${item.value}<span>점</span></strong></div></td><td>${escapeHTML(assessmentTips[index])}</td></tr>`).join('')}</tbody></table></div>
    </section>
  </section>`;
}

export function renderContentBlock(id, uid) {
  const prefix = safeId(uid || 'block-'+id);
  const renderers = {'hero':hero, 'feature-navigation':featureNavigation, 'activity-dashboard':activityDashboard, 'assessment-report':assessmentReport};
  return renderers[id] ? renderers[id](prefix) : '';
}

const bindings = new WeakMap();

export function bindContentBlocks(root=document) {
  bindings.get(root)?.();
  const controller = new AbortController();
  const options = {signal:controller.signal};

  function selectTab(tab, focus=false) {
    const block = tab.closest('[data-dbc-block]');
    if (!block || !root.contains(block)) return;
    const selected = tab.dataset.dbcTab;
    for (const item of block.querySelectorAll('[data-dbc-tab]')) {
      item.setAttribute('aria-selected', String(item === tab));
      item.tabIndex = item === tab ? 0 : -1;
    }
    if (block.dataset.dbcBlock === 'activity-dashboard') {
      let count = 0;
      for (const item of block.querySelectorAll('[data-dbc-kind]')) {
        item.hidden = selected !== 'all' && item.dataset.dbcKind !== selected;
        if (!item.hidden) count++;
      }
      block.querySelector('[data-dbc-document-count]').innerHTML = collectionCount(count,{label:'표시한 문서'});
      block.querySelector('.dbc-documents-panel').setAttribute('aria-labelledby', tab.id);
      block.querySelector('[data-dbc-filter-status]').textContent = `${tab.textContent.trim()} 문서 ${count}개`;
    } else {
      for (const panel of block.querySelectorAll('[data-dbc-panel]')) panel.hidden = panel.dataset.dbcPanel !== selected;
    }
    if (focus) tab.focus({preventScroll:true});
  }

  root.addEventListener('click', event => {
    const tab = event.target.closest?.('[data-dbc-tab]');
    if (tab) selectTab(tab);
  }, options);

  // The chart's own handler replaces its content. Capture its containing block
  // before the clicked legend node is detached, then remove the catalog caption.
  root.addEventListener('click', event => {
    const block = event.target.closest?.('[data-chart-legend]')?.closest('[data-dbc-block]');
    if (block) queueMicrotask(() => {
      if (!controller.signal.aborted) block.querySelectorAll('.dds-chart-heading > span').forEach(caption => caption.remove());
    });
  }, {...options,capture:true});

  root.addEventListener('keydown', event => {
    const tab = event.target.closest?.('[data-dbc-tab]');
    if (!tab || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    const tabs = [...tab.closest('[role=tablist]').querySelectorAll('[data-dbc-tab]')];
    const index = tabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : (index+(event.key === 'ArrowRight' ? 1 : -1)+tabs.length)%tabs.length;
    event.preventDefault();
    event.stopPropagation();
    selectTab(tabs[next], true);
  }, options);

  const cleanup = () => {
    controller.abort();
    if (bindings.get(root) === cleanup) bindings.delete(root);
  };
  bindings.set(root, cleanup);
  return cleanup;
}
