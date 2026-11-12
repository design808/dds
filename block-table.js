import {icon} from './icons.js?v=a2951f06bdfb22b5';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
const safeId = value => String(value || 'address-book').replace(/[^a-zA-Z0-9_-]/g, '-');
const contacts = Array.from({length:42}, (_, index) => {
  const number = index + 1;
  const suffix = String(number).padStart(2, '0');
  return {
    name:'Member'+suffix,
    email:'member'+suffix+'@example.com',
    book:number % 3 === 0 ? 'test' : 'member',
    language:number % 5 === 0 ? 'en' : 'ko',
    subscription:number % 7 === 0 ? 'unsubscribed' : 'subscribed',
  };
});
const bookLabels = {test:'테스트', member:'일반회원'};
const languageLabels = {ko:'한국어', en:'영어'};
const subscriptionLabels = {subscribed:'구독 중', unsubscribed:'수신 거부'};

export const tableBlocks = [
  {id:'basic-table', title:'기본 표', category:'workspace', description:'주소록을 검색하고 분류와 언어, 수신 상태로 필터링하는 표.', components:['table','select','search','pagination','badge','button','icon-button']},
];

function filterContacts(state) {
  const query = state.search.trim().toLocaleLowerCase();
  return contacts.filter(contact => (state.book === 'all' || contact.book === state.book)
    && (state.language === 'all' || contact.language === state.language)
    && (state.subscription === 'all' || contact.subscription === state.subscription)
    && (!query || contact.email.toLocaleLowerCase().includes(query)));
}

function pageData(state) {
  const filtered = filterContacts(state);
  const pageCount = Math.ceil(filtered.length / state.pageSize);
  state.page = pageCount ? Math.max(1, Math.min(pageCount, state.page || 1)) : 0;
  const offset = state.page ? (state.page - 1) * state.pageSize : 0;
  return {filtered, pageCount, rows:filtered.slice(offset, offset + state.pageSize), start:filtered.length ? offset + 1 : 0, end:Math.min(offset + state.pageSize, filtered.length)};
}

function tableRows(rows) {
  if (!rows.length) return '<tr><td colspan="5"><div class="dbt-empty"><p>검색 조건에 맞는 연락처가 없습니다.</p><button class="dds-button" type="button" data-variant="outlined" data-color="assistive" data-control-size="sm" data-dbt-action="reset">필터 초기화</button></div></td></tr>';
  return rows.map(contact => `<tr><th scope="row">${escapeHTML(contact.name)}</th><td>${escapeHTML(contact.email)}</td><td>${bookLabels[contact.book]}</td><td>${languageLabels[contact.language]}</td><td><span class="badge dds-badge dbt-subscription" data-subscription="${contact.subscription}">${icon(contact.subscription === 'subscribed' ? 'Check' : 'Minus')}<span>${subscriptionLabels[contact.subscription]}</span></span></td></tr>`).join('');
}

function filterSelect(prefix, key, label, options) {
  return `<div class="dbt-filter"><label class="sr-only" for="${prefix}-${key}">${label}</label><select id="${prefix}-${key}" aria-label="${label}" data-dbt-filter="${key}" data-control-size="sm" data-control-width="content">${options.map(([value,text]) => `<option value="${value}">${text}</option>`).join('')}</select></div>`;
}

function navigationButton(action, label, glyph, disabled=false) {
  return `<button class="dds-button" type="button" data-variant="outlined" data-color="assistive" data-control-size="sm" data-icon-only="true" data-dbt-action="${action}" aria-label="${label}" data-tooltip="${label}" ${disabled ? 'disabled' : ''}>${icon(glyph)}</button>`;
}

function summary(data) {
  return `전체 ${data.filtered.length}개 · ${data.start}–${data.end} 표시 · 총 ${data.pageCount}페이지`;
}

export function renderTableBlock(id, uid) {
  if (id !== 'basic-table') return '';
  const prefix = safeId(uid);
  const state = {book:'all', language:'all', subscription:'all', search:'', pageSize:10, page:1};
  const data = pageData(state);
  return `<section class="dds-content-card dbt-address-book" data-dbt-block="basic-table" aria-labelledby="${prefix}-title">
    <h2 class="db-title" id="${prefix}-title">주소록</h2>
    <div class="dbt-toolbar" role="group" aria-label="주소록 검색과 내보내기">
      ${filterSelect(prefix,'book','주소록',[['all','전체 주소록'],['test','테스트'],['member','일반회원']])}
      ${filterSelect(prefix,'language','언어',[['all','모든 언어'],['ko','한국어'],['en','영어']])}
      ${filterSelect(prefix,'subscription','수신 상태',[['all','전체 상태'],['subscribed','구독 중'],['unsubscribed','수신 거부']])}
      <div class="search-field dbt-search" data-control-size="sm">${icon('Search')}<label class="sr-only" for="${prefix}-search">이메일 검색</label><input type="search" id="${prefix}-search" aria-label="이메일 검색" placeholder="이메일 검색" autocomplete="off" data-dbt-search></div>
      <button class="dds-button dbt-export" type="button" data-control-size="sm" data-variant="solid" data-color="primary" data-dbt-action="export">내보내기</button>
    </div>
    <div class="table-wrap dbt-table-wrap" tabindex="0" role="region" aria-labelledby="${prefix}-title" aria-describedby="${prefix}-summary">
      <table class="dbt-table"><caption class="sr-only">이름, 이메일, 주소록, 언어와 수신 상태</caption><colgroup><col class="dbt-col-name"><col class="dbt-col-email"><col class="dbt-col-book"><col class="dbt-col-language"><col class="dbt-col-status"></colgroup><thead><tr><th scope="col">이름</th><th scope="col">이메일</th><th scope="col">주소록</th><th scope="col">언어</th><th scope="col">상태</th></tr></thead><tbody data-dbt-rows>${tableRows(data.rows)}</tbody></table>
    </div>
    <footer class="dbt-footer"><p class="dbt-summary" id="${prefix}-summary" role="status" aria-live="polite" data-dbt-summary>${summary(data)}</p><div class="dbt-footer-controls">
      <div class="dbt-page-size"><label class="sr-only" for="${prefix}-page-size">한 페이지에 표시할 행 수</label><select id="${prefix}-page-size" aria-label="한 페이지에 표시할 행 수" data-dbt-page-size data-control-size="sm" data-control-width="content"><option value="10">10개씩</option><option value="20">20개씩</option><option value="50">50개씩</option></select></div>
      <nav class="dbt-pagination" aria-label="주소록 페이지 이동">${navigationButton('first','첫 페이지','ChevronsLeft',true)}${navigationButton('previous','이전 페이지','ChevronLeft',true)}<span class="dbt-page-position" data-control-size="sm"><label class="sr-only" for="${prefix}-page">현재 페이지</label><input class="dbt-page-input" type="text" id="${prefix}-page" value="1" inputmode="numeric" pattern="[0-9]*" maxlength="4" aria-label="현재 페이지" aria-describedby="${prefix}-summary" data-dbt-page><span class="dbt-page-total">/ <span data-dbt-page-total>${data.pageCount}</span></span></span>${navigationButton('next','다음 페이지','ChevronRight')}${navigationButton('last','마지막 페이지','ChevronsRight')}</nav>
    </div></footer>
  </section>`;
}

const bindings = new WeakMap();

export function bindTableBlocks(root=document) {
  bindings.get(root)?.();
  const controller = new AbortController();
  const options = {signal:controller.signal};
  const states = new Map();
  const downloads = new Map();
  const blocks = [...root.querySelectorAll('[data-dbt-block="basic-table"]')];
  if (root.matches?.('[data-dbt-block="basic-table"]')) blocks.unshift(root);

  function update(block, state) {
    const data = pageData(state);
    block.querySelector('[data-dbt-rows]').innerHTML = tableRows(data.rows);
    block.querySelector('[data-dbt-summary]').textContent = summary(data);
    block.querySelector('[data-dbt-page-total]').textContent = data.pageCount;
    const pageInput = block.querySelector('[data-dbt-page]');
    pageInput.value = state.page;
    pageInput.disabled = !data.pageCount;
    for (const action of ['first','previous','next','last']) block.querySelector(`[data-dbt-action="${action}"]`).disabled = !data.pageCount || (['first','previous'].includes(action) ? state.page <= 1 : state.page >= data.pageCount);
    block.querySelector('[data-dbt-action="export"]').disabled = !data.filtered.length;
    return data;
  }

  function refreshFilters(block, state) {
    for (const key of ['book','language','subscription']) state[key] = block.querySelector(`[data-dbt-filter="${key}"]`).value;
    state.search = block.querySelector('[data-dbt-search]').value;
    state.page = 1;
    update(block, state);
  }

  function commitPage(block, state) {
    const field = block.querySelector('[data-dbt-page]');
    const value = field.value.trim();
    if (/^\d+$/.test(value)) state.page = Number(value);
    update(block, state);
  }

  for (const block of blocks) {
    const state = {
      book:block.querySelector('[data-dbt-filter="book"]').value,
      language:block.querySelector('[data-dbt-filter="language"]').value,
      subscription:block.querySelector('[data-dbt-filter="subscription"]').value,
      search:block.querySelector('[data-dbt-search]').value,
      pageSize:Number(block.querySelector('[data-dbt-page-size]').value),
      page:Number(block.querySelector('[data-dbt-page]').value) || 1,
    };
    states.set(block, state);
    update(block, state);
  }

  function context(target) {
    const block = target.closest?.('[data-dbt-block="basic-table"]');
    return block && states.has(block) ? [block,states.get(block)] : [];
  }

  function exportCSV(state) {
    const rows = filterContacts(state);
    if (!rows.length) return;
    const cell = value => '"'+String(value).replace(/"/g,'""')+'"';
    const csv = [['이름','이메일','주소록','언어','상태'],...rows.map(contact => [contact.name,contact.email,bookLabels[contact.book],languageLabels[contact.language],subscriptionLabels[contact.subscription]])].map(row => row.map(cell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;link.download = '주소록.csv';link.hidden = true;
    document.body.append(link);link.click();link.remove();
    const timer = setTimeout(() => {URL.revokeObjectURL(url);downloads.delete(url);},1000);
    downloads.set(url,timer);
  }

  root.addEventListener('input', event => {
    if (event.isComposing || !event.target.matches?.('[data-dbt-search]')) return;
    const [block,state] = context(event.target);
    if (block) refreshFilters(block,state);
  },options);
  root.addEventListener('compositionend', event => {
    if (!event.target.matches?.('[data-dbt-search]')) return;
    const [block,state] = context(event.target);
    if (block) refreshFilters(block,state);
  },options);
  root.addEventListener('change', event => {
    const [block,state] = context(event.target);
    if (!block) return;
    if (event.target.matches('[data-dbt-filter]')) refreshFilters(block,state);
    else if (event.target.matches('[data-dbt-page-size]')) {
      const size = Number(event.target.value);
      if (![10,20,50].includes(size)) return;
      state.pageSize = size;state.page = 1;update(block,state);
    } else if (event.target.matches('[data-dbt-page]')) commitPage(block,state);
  },options);
  root.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || !event.target.matches?.('[data-dbt-page]')) return;
    const [block,state] = context(event.target);
    if (!block) return;
    event.preventDefault();event.stopPropagation();commitPage(block,state);
  },options);
  root.addEventListener('click', event => {
    const button = event.target.closest?.('[data-dbt-action]');
    if (!button || button.disabled) return;
    const [block,state] = context(button);
    if (!block) return;
    const action = button.dataset.dbtAction;
    if (action === 'export') {exportCSV(state);return;}
    if (action === 'reset') {
      for (const select of block.querySelectorAll('[data-dbt-filter]')) {select.value='all';select.dispatchEvent(new Event('change',{bubbles:true}));}
      const search = block.querySelector('[data-dbt-search]');search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));
      refreshFilters(block,state);search.focus();return;
    }
    const count = Math.ceil(filterContacts(state).length/state.pageSize);
    if (action === 'first') state.page = 1;
    else if (action === 'previous') state.page--;
    else if (action === 'next') state.page++;
    else if (action === 'last') state.page = count;
    else return;
    update(block,state);
  },options);

  const cleanup = () => {
    controller.abort();
    for (const [url,timer] of downloads) {clearTimeout(timer);URL.revokeObjectURL(url);}
    downloads.clear();
    states.clear();
    if (bindings.get(root) === cleanup) bindings.delete(root);
  };
  bindings.set(root,cleanup);
  return cleanup;
}
