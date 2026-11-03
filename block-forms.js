import {icon} from './icons.js?v=54c3eb9808c7bdad';
import {collectionCount, statusBadge} from './visibility.js?v=54c3eb9808c7bdad';

export const formBlocks = [
  {id: 'login', title: '계정 로그인', category: 'account', description: '이메일·비밀번호와 로그인 상태 유지.', components: ['input', 'input-group', 'checkbox', 'button']},
  {id: 'profile', title: '계정 정보', category: 'account', description: '기본 정보 입력과 알림 설정.', components: ['avatar', 'input', 'switch', 'button']},
  {id: 'application', title: '지원 정보 입력', category: 'workspace', description: '지원 기업·직무·경험과 입력 진행률.', components: ['input', 'textarea', 'chip', 'progress', 'button']},
  {id: 'documents', title: '문서 탐색', category: 'workspace', description: '검색·종류 필터·문서 카드와 내용 편집.', components: ['search', 'segmented-control', 'card', 'badge', 'input', 'textarea', 'button', 'empty']}
];

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
const localDate = () => {const value = new Date(); return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;};
let sequence = 0;
const documentSeeds = [
  {id: 'cover-1', type: 'coverletter', title: '경험을 연결해 더 나은 서비스를 만듭니다', company: '원티드랩', job: '프로덕트 디자이너', status: 'draft', date: '2026-11-03', body: '사용자 인터뷰를 통해 서비스 이용 과정의 불편을 발견했습니다.\n\n팀과 함께 문제의 우선순위를 정하고 가입 절차를 개선했습니다. 역할이 다른 동료들과 근거를 공유하며 사용자에게 필요한 경험을 만드는 방법을 배웠습니다.'},
  {id: 'cover-2', type: 'coverletter', title: '작은 불편에서 시작한 서비스 개선', company: '네이버', job: 'UX 디자이너', status: 'complete', date: '2026-11-01', body: '반복해서 접수되는 고객 문의를 살펴보며 사용자가 정보를 찾기 어려운 구간을 발견했습니다.\n\n문의 내용을 유형별로 정리하고 메뉴 이름과 정보 구조를 개선했습니다. 결과를 확인한 뒤 다음 개선 과제까지 팀과 함께 정리했습니다.'},
  {id: 'resume-1', type: 'resume', title: '김민서 · 프로덕트 디자인 이력서', company: '지원 기업 공통', job: '프로덕트 디자이너', status: 'complete', date: '2026-10-30', body: '김민서\n프로덕트 디자이너\n\n주요 경험\n사용자 리서치, 서비스 화면 설계, 디자인 시스템 구축\n\n사용 도구\nFigma, FigJam, HTML, CSS'},
  {id: 'cover-3', type: 'coverletter', title: '함께 일하며 만든 변화', company: '카카오', job: '서비스 기획자', status: 'draft', date: '2026-10-28', body: '공통의 문제를 해결하기 위해 개발자와 디자이너가 함께 참여하는 검토 시간을 만들었습니다.\n\n각자의 관점과 제약을 이해하고 구현 가능한 개선안을 찾았습니다. 합의한 내용을 기록하고 다음 작업에서도 활용했습니다.'}
];

function button(label, {variant = 'solid', color = 'primary', size = 'md', before = '', after = '', type = 'button', attrs = ''} = {}) {
  return `<button type="${type}" class="dds-button" data-variant="${variant}" data-color="${color}" data-control-size="${size}" ${attrs}><span class="dds-button-label">${before ? icon(before) : ''}<span>${escapeHTML(label)}</span>${after ? icon(after) : ''}</span></button>`;
}

function field(prefix, name, label, {type = 'text', value = '', placeholder = '', required = false, autocomplete = 'off', textarea = false, attrs = ''} = {}) {
  const id = `${prefix}-${name}`;
  const props = `id="${id}" name="${name}" data-df-validate data-df-label="${escapeHTML(label)}" aria-describedby="${id}-error" ${required ? 'required' : ''} autocomplete="${autocomplete}" placeholder="${escapeHTML(placeholder)}" ${attrs}`;
  return `<div class="field df-field" data-control-size="md"><label for="${id}">${escapeHTML(label)}${required ? ' <span class="required" aria-hidden="true">*</span>' : ''}</label>${textarea ? `<textarea ${props}>${escapeHTML(value)}</textarea>` : `<input type="${type}" ${props} value="${escapeHTML(value)}">`}<p class="df-error" id="${id}-error" data-df-error hidden></p></div>`;
}

function summary(prefix) {
  return `<section class="df-summary db-stack" id="${prefix}-summary" data-df-summary hidden tabindex="-1" aria-label="입력 내용 확인"></section>`;
}

function login(prefix) {
  return `<div class="df-login-layout"><section class="dds-content-card db-surface df-login-card db-stack"><header class="db-stack df-heading"><h2 class="db-title">로그인</h2><p class="db-muted">작업을 이어가려면 계정으로 로그인해 주세요.</p></header><form class="db-stack" data-df-form="login" novalidate>
    ${field(prefix, 'email', '이메일', {type: 'email', placeholder: 'name@company.com', required: true, autocomplete: 'username'})}
    <div class="field df-field" data-control-size="md"><label for="${prefix}-password">비밀번호 <span class="required" aria-hidden="true">*</span></label><div class="dds-input-group df-password"><input id="${prefix}-password" name="password" type="password" data-df-password data-df-validate data-df-label="비밀번호" autocomplete="current-password" placeholder="비밀번호 입력" minlength="8" required aria-describedby="${prefix}-password-hint ${prefix}-password-error"><button type="button" class="df-password-toggle" data-df-password-toggle aria-label="비밀번호 표시" data-tooltip="비밀번호 표시" aria-controls="${prefix}-password" aria-pressed="false">${icon('Eye')}</button></div><p class="db-muted df-field-hint" id="${prefix}-password-hint">8자 이상 입력해 주세요.</p><p class="df-error" id="${prefix}-password-error" data-df-error hidden></p></div>
    <label class="df-checkbox"><input type="checkbox" name="remember"><span>로그인 상태 유지</span></label>
    ${button('로그인', {type: 'submit', attrs: 'data-full-width="true"'})}<p class="df-feedback db-muted" data-df-feedback role="status" aria-live="polite"></p>
  </form></section></div>`;
}

function profile(prefix) {
  return `<section class="df-profile db-stack"><header class="db-header"><div class="db-stack df-heading"><h2 class="db-title">계정 정보</h2><p class="db-muted">연락 정보와 알림 수신 여부를 관리하세요.</p></div><span class="avatar df-profile-avatar" aria-hidden="true">김</span></header><form class="db-stack" data-df-form="profile" novalidate>
    <section class="db-stack"><h3 class="db-section-title">기본 정보</h3><div class="db-fields">${field(prefix, 'name', '이름', {value: '김민서', required: true, autocomplete: 'name'})}${field(prefix, 'email', '이메일', {type: 'email', value: 'minseo.kim@example.com', required: true, autocomplete: 'email'})}${field(prefix, 'organization', '소속', {value: '브랜드디자인팀', autocomplete: 'organization'})}${field(prefix, 'job', '직무', {value: '프로덕트 디자이너', autocomplete: 'organization-title'})}</div></section>
    <hr class="db-rule"><section class="db-stack"><div class="db-header"><h3 class="db-section-title">알림 설정</h3><span class="db-muted" data-df-notification-count>2개 사용 중</span></div><div class="df-preference-list">
    ${[['updates', '서비스 이용 알림', '문서 검토와 상담 진행 소식을 받습니다.', true], ['emailNews', '이메일 소식', '채용과 커리어에 도움이 되는 소식을 받습니다.', true], ['marketing', '혜택 및 이벤트', '새로운 혜택과 이벤트 안내를 받습니다.', false]].map(([name, title, description, checked]) => `<label class="switch-label df-preference"><span class="df-preference-copy"><span>${title}</span><span class="db-muted">${description}</span></span><input id="${prefix}-${name}" type="checkbox" role="switch" name="${name}" data-df-preference aria-label="${title}" ${checked ? 'checked' : ''}><span class="switch-track" aria-hidden="true"></span></label>`).join('')}
    </div></section><div class="df-actions">${button('변경 내용 확인', {type: 'submit'})}</div><p class="df-feedback db-muted" data-df-feedback role="status" aria-live="polite"></p>${summary(prefix)}
  </form></section>`;
}

function application(prefix) {
  return `<section class="df-application db-stack"><header class="db-stack df-heading"><h2 class="db-title">지원 정보</h2><p class="db-muted">지원하는 기업과 직무에 맞춰 경험을 정리하세요.</p></header><div class="df-progress-block db-stack"><div class="db-header"><span class="df-label">필수 정보</span><output class="db-muted" data-df-progress-label>2 / 4 항목 입력</output></div><progress max="4" value="2" data-df-progress aria-label="필수 정보 입력 진행률">50%</progress></div>
    <form class="db-stack" data-df-form="application" novalidate><div class="db-fields">${field(prefix, 'title', '문서 제목', {value: '사용자의 문제를 해결하는 디자이너', required: true})}${field(prefix, 'company', '지원 기업', {placeholder: '기업명을 입력해 주세요', required: true})}</div>
    <fieldset class="df-choices db-stack"><legend class="df-label">지원 직무 <span class="required" aria-hidden="true">*</span></legend><div class="df-chip-list" role="group" aria-label="지원 직무" aria-describedby="${prefix}-jobs-hint ${prefix}-jobs-error">${['프로덕트 디자인', '서비스 기획', '프론트엔드 개발', '마케팅'].map((label, index) => `<button type="button" class="chip${index === 0 ? ' selected' : ''}" data-df-chip aria-pressed="${index === 0}" value="${label}">${label}</button>`).join('')}</div><p class="db-muted" id="${prefix}-jobs-hint">관련된 직무를 모두 선택할 수 있습니다.</p><p class="df-error" id="${prefix}-jobs-error" data-df-jobs-error hidden></p></fieldset>
    ${field(prefix, 'experience', '직무 관련 경험', {textarea: true, placeholder: '어떤 문제를 발견했고, 나의 역할과 결과는 무엇이었나요?', required: true, attrs: 'maxlength="300"'})}<div class="df-character-count db-muted"><output data-df-experience-count>0</output><span> / 300자</span></div>
    <div class="df-actions">${button('지원 정보 확인', {type: 'submit', after: 'ArrowRight'})}</div><p class="df-feedback db-muted" data-df-feedback role="status" aria-live="polite"></p>${summary(prefix)}</form></section>`;
}

function documentCards(documents, prefix) {
  return documents.map(item => `<article class="dds-content-card dds-document-card df-document-card"><div class="dds-card-header">${statusBadge(item.status, item.status === 'complete' ? '작성 완료' : '작성 중', icon)}</div><h3 class="dds-card-title"><button type="button" class="df-document-open" data-df-open-doc="${escapeHTML(item.id)}" aria-controls="${prefix}-editor">${escapeHTML(item.title)}</button></h3><p class="dds-meta-primary">${escapeHTML(item.company)} · ${escapeHTML(item.job)}</p><p class="dds-meta-secondary">${item.type === 'resume' ? '이력서' : '자기소개서'}</p><time class="dds-meta-date" datetime="${item.date}">${item.date.replaceAll('-', '.')} 수정</time></article>`).join('');
}

function documents(prefix) {
  return `<section class="df-documents db-stack"><header class="db-header"><div class="db-inline df-title-row"><h2 class="db-title">내 문서</h2><span data-df-document-count>${collectionCount(documentSeeds.length, {label: '문서'})}</span></div>${button('새 문서', {size: 'sm', before: 'Plus', attrs: 'data-df-new-doc'})}</header>
    <div class="db-stack" data-df-document-list><div class="df-document-toolbar"><fieldset class="df-document-filters"><legend class="sr-only">문서 종류</legend><div class="dds-segmented">${[['all', '전체'], ['coverletter', '자기소개서'], ['resume', '이력서']].map(([value, label], index) => `<label class="dds-choice"><input type="radio" name="${prefix}-document-type" value="${value}" data-df-document-filter ${index === 0 ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div></fieldset><div class="field df-document-search" data-control-size="sm"><label class="sr-only" for="${prefix}-search">문서 검색</label><div class="search-field">${icon('Search')}<input id="${prefix}-search" type="search" data-df-document-search placeholder="제목, 기업, 직무 검색"></div></div></div>
    <p class="db-muted df-results-label" data-df-results-label role="status" aria-live="polite">전체 문서 ${documentSeeds.length}개</p><div class="df-document-grid" data-df-document-results>${documentCards(documentSeeds, prefix)}</div><div class="df-document-empty db-stack" data-df-document-empty hidden><h3 class="db-section-title">검색 결과가 없습니다</h3><p class="db-muted">다른 검색어를 입력하거나 필터를 초기화해 주세요.</p>${button('조건 초기화', {variant: 'outlined', color: 'assistive', size: 'sm', attrs: 'data-df-clear-search'})}</div></div>
    <section class="df-document-editor db-stack" id="${prefix}-editor" data-df-document-editor hidden aria-label="문서 편집"><div class="db-header">${button('문서 목록', {variant: 'outlined', color: 'assistive', size: 'sm', before: 'ArrowLeft', attrs: 'data-df-close-editor'})}<span data-df-editor-type class="db-muted">자기소개서</span></div><form class="db-stack" data-df-form="document" novalidate>${field(prefix, 'documentTitle', '제목', {required: true})}${field(prefix, 'documentBody', '내용', {textarea: true, required: true})}<div class="df-actions">${button('변경 내용 적용', {type: 'submit'})}</div><p class="df-feedback db-muted" data-df-feedback role="status" aria-live="polite"></p></form></section>
  </section>`;
}

export function renderFormBlock(id, uid) {
  const prefix = `fb-${String(uid || `scene-${++sequence}`).replace(/[^a-zA-Z0-9_-]/g, '-')}-${id}`;
  const render = {login, profile, application, documents}[id];
  return render ? `<div class="df-scene" data-form-block="${id}" data-form-block-uid="${prefix}">${render(prefix)}</div>` : '';
}

const bindings = new WeakMap();

export function bindFormBlocks(root) {
  if (!root?.addEventListener || !root?.querySelectorAll) return () => {};
  bindings.get(root)?.();
  const controller = new AbortController();
  const states = new WeakMap();
  const scenes = [...root.querySelectorAll('[data-form-block]')];
  if (root.matches?.('[data-form-block]')) scenes.unshift(root);
  const sceneOf = target => {
    const scene = target?.closest?.('[data-form-block]');
    return scene && (scene === root || root.contains(scene)) ? scene : null;
  };
  const input = (scene, name) => scene.querySelector(`[name="${name}"]`);
  const feedback = (form, message) => {const target = form.querySelector('[data-df-feedback]'); if (target) target.textContent = message;};
  const fieldError = field => {
    const value = field.value.trim();
    if (field.required && !value) {
      const label = field.dataset.dfLabel || '값', last = label.charCodeAt(label.length - 1);
      return `${label}${last >= 0xAC00 && last <= 0xD7A3 && (last - 0xAC00) % 28 === 0 ? '를' : '을'} 입력해 주세요.`;
    }
    if (value && field.type === 'email' && field.validity.typeMismatch) return '이메일 주소를 확인해 주세요.';
    if (value && field.minLength > 0 && value.length < field.minLength) return `${field.minLength}자 이상 입력해 주세요.`;
    return '';
  };
  const markField = field => {
    const message = fieldError(field), error = field.closest('.df-field')?.querySelector('[data-df-error]');
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) {error.textContent = message; error.hidden = !message;}
    return !message;
  };
  const validate = form => {
    const fields = [...form.querySelectorAll('[data-df-validate]')];
    fields.forEach(markField);
    const firstInvalid = fields.find(field => field.getAttribute('aria-invalid') === 'true');
    if (firstInvalid) {feedback(form, '입력한 내용을 확인해 주세요.'); firstInvalid.focus(); return false;}
    return true;
  };
  const showSummary = (scene, items) => {
    const panel = scene.querySelector('[data-df-summary]');
    if (!panel) return;
    panel.innerHTML = `<h3 class="db-section-title">입력 내용 확인</h3><dl class="df-summary-list">${items.map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value || '입력하지 않음')}</dd></div>`).join('')}</dl>`;
    panel.hidden = false; panel.focus({preventScroll: true});
  };
  const documentState = scene => {
    if (!states.has(scene)) states.set(scene, {documents: documentSeeds.map(item => ({...item})), editing: '', newType: 'coverletter', sequence: 0});
    return states.get(scene);
  };
  const updateApplication = scene => {
    const filled = ['title', 'company', 'experience'].filter(name => input(scene, name)?.value.trim()).length + Number(Boolean(scene.querySelector('[data-df-chip][aria-pressed="true"]')));
    const progress = scene.querySelector('[data-df-progress]');
    progress.value = filled; progress.textContent = `${filled * 25}%`;
    scene.querySelector('[data-df-progress-label]').textContent = `${filled} / 4 항목 입력`;
    scene.querySelector('[data-df-experience-count]').textContent = input(scene, 'experience').value.length;
  };
  const updateDocuments = scene => {
    const state = documentState(scene), filter = scene.querySelector('[data-df-document-filter]:checked')?.value || 'all';
    const query = (scene.querySelector('[data-df-document-search]')?.value || '').trim().toLocaleLowerCase();
    const found = state.documents.filter(item => (filter === 'all' || item.type === filter) && `${item.title} ${item.company} ${item.job}`.toLocaleLowerCase().includes(query));
    scene.querySelector('[data-df-document-results]').innerHTML = documentCards(found, scene.dataset.formBlockUid);
    scene.querySelector('[data-df-document-empty]').hidden = found.length > 0;
    scene.querySelector('[data-df-document-count]').innerHTML = collectionCount(found.length, {label: '문서'});
    scene.querySelector('[data-df-results-label]').textContent = `${filter === 'coverletter' ? '자기소개서' : filter === 'resume' ? '이력서' : '전체 문서'} ${found.length}개${query ? ` · “${scene.querySelector('[data-df-document-search]').value.trim()}” 검색` : ''}`;
  };
  const openDocument = (scene, id = '') => {
    const state = documentState(scene), found = state.documents.find(item => item.id === id);
    state.editing = id;
    state.newType = scene.querySelector('[data-df-document-filter]:checked')?.value === 'resume' ? 'resume' : 'coverletter';
    input(scene, 'documentTitle').value = found?.title || '';
    input(scene, 'documentBody').value = found?.body || '';
    scene.querySelector('[data-df-editor-type]').textContent = (found?.type || state.newType) === 'resume' ? '이력서' : '자기소개서';
    scene.querySelector('[data-df-document-list]').hidden = true;
    scene.querySelector('[data-df-document-editor]').hidden = false;
    scene.querySelector('[data-df-new-doc]').hidden = true;
    const form = scene.querySelector('[data-df-form="document"]');
    form.querySelectorAll('[data-df-validate]').forEach(field => field.removeAttribute('aria-invalid'));
    form.querySelectorAll('[data-df-error]').forEach(error => {error.hidden = true; error.textContent = '';});
    feedback(form, ''); input(scene, 'documentTitle').focus({preventScroll: true});
  };
  for (const scene of scenes) {
    if (scene.dataset.formBlock === 'documents') updateDocuments(scene);
    if (scene.dataset.formBlock === 'application') updateApplication(scene);
  }
  root.addEventListener('click', event => {
    const scene = sceneOf(event.target); if (!scene) return;
    const control = event.target.closest('button'); if (!control || control.disabled) return;
    if (control.hasAttribute('data-df-password-toggle')) {
      const field = scene.querySelector('[data-df-password]'), visible = field.type === 'password';
      field.type = visible ? 'text' : 'password';
      const label = visible ? '비밀번호 숨기기' : '비밀번호 표시';
      control.setAttribute('aria-label', label); control.dataset.tooltip = label; control.setAttribute('aria-pressed', String(visible)); control.innerHTML = icon(visible ? 'EyeOff' : 'Eye');
    } else if (control.hasAttribute('data-df-chip')) {
      const selected = control.getAttribute('aria-pressed') !== 'true';
      control.setAttribute('aria-pressed', String(selected)); control.classList.toggle('selected', selected);
      const error = scene.querySelector('[data-df-jobs-error]'); error.hidden = true; error.textContent = ''; updateApplication(scene);
      scene.querySelector('[data-df-summary]').hidden = true;
    } else if (control.hasAttribute('data-df-open-doc')) openDocument(scene, control.dataset.dfOpenDoc);
    else if (control.hasAttribute('data-df-new-doc')) openDocument(scene);
    else if (control.hasAttribute('data-df-close-editor')) {
      scene.querySelector('[data-df-document-editor]').hidden = true;
      scene.querySelector('[data-df-document-list]').hidden = false;
      scene.querySelector('[data-df-new-doc]').hidden = false;
      updateDocuments(scene);
      const state = documentState(scene);
      const replacement = state.editing ? scene.querySelector(`[data-df-open-doc="${state.editing}"]`) : null;
      (replacement || scene.querySelector('[data-df-new-doc]')).focus({preventScroll: true});
    } else if (control.hasAttribute('data-df-clear-search')) {
      const search = scene.querySelector('[data-df-document-search]'); search.value = '';
      scene.querySelector('[data-df-document-filter][value="all"]').checked = true;
      search.dispatchEvent(new Event('input', {bubbles: true}));
      updateDocuments(scene); search.focus({preventScroll: true});
    }
  }, {signal: controller.signal});
  const update = event => {
    const scene = sceneOf(event.target); if (!scene) return;
    if (event.target.matches('[data-df-validate][aria-invalid="true"]')) markField(event.target);
    if (scene.dataset.formBlock === 'application') updateApplication(scene);
    if (event.target.matches('[data-df-preference]')) scene.querySelector('[data-df-notification-count]').textContent = `${scene.querySelectorAll('[data-df-preference]:checked').length}개 사용 중`;
    if (event.target.matches('[data-df-document-search], [data-df-document-filter]')) updateDocuments(scene);
    const form = event.target.closest('form'); if (form) feedback(form, '');
    const panel = scene.querySelector('[data-df-summary]'); if (panel) panel.hidden = true;
  };
  root.addEventListener('input', update, {signal: controller.signal});
  root.addEventListener('change', update, {signal: controller.signal});
  root.addEventListener('submit', event => {
    const form = event.target.closest('[data-df-form]'), scene = sceneOf(form);
    if (!form || !scene) return;
    event.preventDefault();
    if (!validate(form)) return;
    if (form.dataset.dfForm === 'login') feedback(form, '이메일과 비밀번호의 입력 형식이 올바릅니다.');
    if (form.dataset.dfForm === 'profile') showSummary(scene, [['이름', input(scene, 'name').value], ['이메일', input(scene, 'email').value], ['소속', input(scene, 'organization').value], ['직무', input(scene, 'job').value], ['수신 알림', [...scene.querySelectorAll('[data-df-preference]:checked')].map(field => field.getAttribute('aria-label')).join(', ') || '선택하지 않음']]);
    if (form.dataset.dfForm === 'application') {
      const jobs = [...scene.querySelectorAll('[data-df-chip][aria-pressed="true"]')].map(chip => chip.value);
      if (!jobs.length) {const error = scene.querySelector('[data-df-jobs-error]'); error.textContent = '지원 직무를 한 개 이상 선택해 주세요.'; error.hidden = false; scene.querySelector('[data-df-chip]').focus(); return;}
      showSummary(scene, [['문서 제목', input(scene, 'title').value], ['지원 기업', input(scene, 'company').value], ['지원 직무', jobs.join(', ')], ['직무 관련 경험', input(scene, 'experience').value]]);
    }
    if (form.dataset.dfForm === 'document') {
      const state = documentState(scene), existing = state.documents.find(item => item.id === state.editing);
      const title = input(scene, 'documentTitle').value.trim(), body = input(scene, 'documentBody').value.trim();
      if (existing) {existing.title = title; existing.body = body; existing.status = 'draft'; existing.date = localDate();}
      else {
        const item = {id: `new-${++state.sequence}`, type: state.newType, title, body, company: '지원 기업 미지정', job: '직무 미지정', status: 'draft', date: localDate()};
        state.documents.unshift(item); state.editing = item.id;
      }
      updateDocuments(scene); feedback(form, '변경 내용을 적용했습니다.');
    }
  }, {signal: controller.signal});
  let disposed = false;
  const cleanup = () => {if (disposed) return; disposed = true; controller.abort(); if (bindings.get(root) === cleanup) bindings.delete(root);};
  bindings.set(root, cleanup);
  return cleanup;
}
