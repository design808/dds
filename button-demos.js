import {renderButton as buttonMarkup} from './ui/button.js?v=2ba405c41d82bf19';
import {formatHTML} from './format-html.js?v=2ba405c41d82bf19';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const safeId = value => String(value || 'dds-button').replace(/[^a-zA-Z0-9_-]/g, '-');
const combinations = [
  {variant: 'solid', color: 'primary', name: 'Primary', label: '작성 시작'},
  {variant: 'solid', color: 'assistive', name: 'Assistive', label: '임시저장'},
  {variant: 'solid', color: 'negative', name: 'Negative', label: '삭제'},
  {variant: 'outlined', color: 'primary', name: 'Primary', label: '작성 시작'},
  {variant: 'outlined', color: 'assistive', name: 'Assistive', label: '임시저장'}
];

function sampleButtons(items, options = {}) {
  return items.map(item => buttonMarkup({...item, ...options})).join('\n');
}

function sampleCells(items, options = {}) {
  return `<div class="dds-button-sample-grid">${items.map(item => `<div class="dds-button-sample-cell"><div class="dds-button-sample-control">${buttonMarkup({
    ...item, ...options,
    attributes: {...options.attributes, ...(!options.disabled && !options.busy ? {'data-button-doc-action': `${item.variant === 'solid' ? 'Solid' : 'Outlined'} · ${item.name}`} : {})}
  })}</div><div class="dds-button-sample-caption"><span>${escapeHTML(item.name)}</span></div></div>`).join('')}</div>`;
}

function codeDetails(markup, label) {
  const formatted = formatHTML(markup);
  return `<details class="dds-button-code"><summary>코드 보기</summary><div class="dds-button-code-content"><div class="dds-button-code-tools">${buttonMarkup({variant: 'outlined', color: 'assistive', size: 'sm', label: '복사', before: 'Copy', attributes: {'data-copy': formatted, 'aria-label': `${label} HTML 코드 복사`}})}</div><pre tabindex="0" aria-label="${escapeHTML(label)} HTML 코드"><code>${escapeHTML(formatted)}</code></pre></div></details>`;
}

function example(title, contents, markup, note = '') {
  return `<div class="dds-button-example"><div class="dds-button-example-body"><div class="dds-button-example-heading"><h3>${escapeHTML(title)}</h3>${note ? `<p>${escapeHTML(note)}</p>` : ''}</div>${contents}</div>${codeDetails(markup, title)}</div>`;
}

function section(id, title, description, contents) {
  return `<section class="dds-button-doc-section" id="${id}" aria-labelledby="${id}-title"><div class="section-heading dds-button-doc-heading"><h2 id="${id}-title">${escapeHTML(title)}</h2><p>${escapeHTML(description)}</p></div>${contents}</section>`;
}

/** A component snippet only; documentation frames and event hooks are excluded. */
export function buttonCodeExample() {
  return [
    sampleButtons(combinations),
    buttonMarkup({label: '문항 추가', before: 'Plus'}),
    buttonMarkup({variant: 'outlined', color: 'assistive', label: '다음 단계', after: 'ArrowRight'}),
    buttonMarkup({label: '문항 추가', before: 'Plus', iconOnly: true}),
    buttonMarkup({size: 'sm', label: 'Small'}),
    buttonMarkup({size: 'lg', label: 'Large'}),
    buttonMarkup({label: '작성 시작', disabled: true}),
    buttonMarkup({label: '저장', busy: true}),
    buttonMarkup({label: '변경 사항을 저장하고 다음 단계로 이동', fullWidth: true})
  ].join('\n\n');
}

export function buttonDemo(mini = false, uid = 'dds-button') {
  if (mini) return `<div class="dds-button-mini">${buttonMarkup({label: '작성 시작'})}${buttonMarkup({variant: 'outlined', color: 'assistive', label: '임시저장'})}</div>`;
  const base = safeId(uid);
  const solid = combinations.filter(item => item.variant === 'solid');
  const outlined = combinations.filter(item => item.variant === 'outlined');
  const withIcon = [
    {label: '문항 추가', before: 'Plus'},
    {variant: 'outlined', color: 'assistive', label: '다음 단계', after: 'ArrowRight'}
  ];
  const iconOnly = combinations.map(item => ({...item,
    label: item.color === 'negative' ? '문항 삭제' : '문항 추가',
    before: item.color === 'negative' ? 'Trash2' : 'Plus', iconOnly: true}));
  const sizes = [
    {size: 'sm', label: 'Small', spec: '36px · Label 2 · 13/18'},
    {size: 'md', label: 'Medium', spec: '44px · Label 1 · 14/20'},
    {size: 'lg', label: 'Large', spec: '52px · Body 1 Normal · 16/24'}
  ];
  const sizeContents = `<div class="dds-button-size-grid">${sizes.map(item => `<div class="dds-button-sample-cell"><div class="dds-button-sample-control">${buttonMarkup({...item, attributes: {'data-button-doc-action': item.label}})}</div><div class="dds-button-sample-caption"><span>${escapeHTML(item.spec)}</span></div></div>`).join('')}</div>`;
  const loadingButton = buttonMarkup({label: '로딩 실행', loading: true, attributes: {'data-button-loading-demo': '', 'aria-describedby': `${base}-loading-status`}});
  const loadingContents = `<div class="dds-button-loading-example" data-button-loading-example>${loadingButton}<p class="dds-button-loading-status" id="${base}-loading-status" role="status" aria-live="polite">버튼을 누르면 0.9초 동안 로딩 상태로 바뀝니다.</p></div>`;
  const fullWidth = [
    {label: '변경 사항을 저장하고 다음 단계로 이동', fullWidth: true},
    {variant: 'outlined', color: 'assistive', label: '이전 단계', fullWidth: true}
  ];
  return `<div class="dds-button-docs" data-button-docs>
    ${section('button-variants', 'Variants', '중요도와 행동의 성격에 따라 채움과 색상을 선택합니다.',
      example('Solid', sampleCells(solid), sampleButtons(solid), 'Primary는 주요 행동, Assistive는 보조 행동, Negative는 삭제처럼 되돌리기 어려운 행동에 사용합니다.') +
      example('Outlined', sampleCells(outlined), sampleButtons(outlined), '채움 없이 경계와 글자로 행동을 표시합니다.'))}
    ${section('button-icons', 'Icons', '아이콘은 글자의 앞이나 뒤에 둘 수 있습니다. 아이콘만 있으면 기능 이름과 툴팁을 제공합니다.',
      example('With icon', `<div class="dds-button-sample-row">${sampleButtons(withIcon.map(item => ({...item, attributes: {'data-button-doc-action': item.label}})))}</div>`, sampleButtons(withIcon)) +
      example('Icon only', sampleCells(iconOnly), sampleButtons(iconOnly)))}
    ${section('button-sizes', 'Sizes', '높이·글자·패딩·아이콘을 같은 크기 규격으로 적용합니다.', example('Small / Medium / Large', sizeContents, sampleButtons(sizes)))}
    ${section('button-disabled', 'Disabled', '실행할 수 없는 버튼은 native disabled로 클릭과 키보드 실행을 막습니다.',
      example('Disabled', sampleCells(combinations, {disabled: true}), sampleButtons(combinations, {disabled: true})))}
    ${section('button-loading', 'Loading', '처리 중에는 로딩 상태를 표시하고 중복 실행을 막습니다. 원래 라벨과 버튼 너비를 유지합니다.',
      example('Loading states', sampleCells(combinations, {busy: true}), sampleButtons(combinations, {busy: true})) +
      example('로딩 동작', loadingContents, loadingButton, '로딩이 끝나면 같은 버튼으로 다시 실행할 수 있습니다.'))}
    ${section('button-width', 'Full width', '버튼을 부모 영역의 가용 너비에 맞춥니다. 긴 문구는 줄바꿈합니다.',
      example('Full width', `<div class="dds-button-full-width-example">${sampleButtons(fullWidth.map(item => ({...item, attributes: {'data-button-doc-action': item.label}})))}</div>`, sampleButtons(fullWidth)))}
  </div>`;
}

const bindings = new WeakMap();

/** Documentation interaction only. Production async work belongs to the host. */
export function bindButtonDemos(root, {notify} = {}) {
  if (!root?.addEventListener || !root?.contains) return () => {};
  bindings.get(root)?.();
  const controller = new AbortController();
  const pending = new Map();
  let disposed = false;
  const announce = message => {if (typeof notify === 'function') {try {notify(message);} catch { /* Notifications do not control button state. */ }}};
  const restore = (button, previous) => {
    button.disabled = previous.disabled;
    if (previous.busy === null) button.removeAttribute('aria-busy');
    else button.setAttribute('aria-busy', previous.busy);
  };
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    for (const [button, previous] of pending) {
      clearTimeout(previous.timer);
      restore(button, previous);
      if (previous.status) previous.status.textContent = previous.statusText;
    }
    pending.clear();
    if (bindings.get(root) === cleanup) bindings.delete(root);
  };
  root.addEventListener('click', event => {
    const button = event.target?.closest?.('button[data-button-loading-demo], button[data-button-doc-action]');
    if (!button || !root.contains(button) || button.disabled || button.getAttribute('aria-busy') === 'true') return;
    if (!button.hasAttribute('data-button-loading-demo')) {
      announce(`${button.dataset.buttonDocAction} 버튼을 눌렀습니다.`);
      return;
    }
    if (pending.has(button)) return;
    const status = button.closest('[data-button-loading-example]')?.querySelector('[role="status"]');
    const previous = {disabled: button.disabled, busy: button.getAttribute('aria-busy'), status, statusText: status?.textContent || ''};
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    if (status) status.textContent = '처리 중입니다.';
    previous.timer = setTimeout(() => {
      pending.delete(button);
      restore(button, previous);
      if (disposed || !root.contains(button)) return;
      if (status?.isConnected) status.textContent = '로딩이 끝났습니다. 다시 실행할 수 있습니다.';
      announce('로딩 예제가 완료되었습니다.');
    }, 900);
    pending.set(button, previous);
  }, {signal: controller.signal});
  bindings.set(root, cleanup);
  return cleanup;
}
