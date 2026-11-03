// Axis density is presentation only: every data point and full value stays intact.
const bindings = new WeakMap();

/** Select non-overlapping horizontal labels; reserve both endpoints when they fit. */
export function selectNonOverlappingTicks(items, {gap = 12} = {}) {
  const spacing = Number.isFinite(gap) ? Math.max(0, gap) : 12;
  // DOM/data order identifies the endpoints. start/end anchors can move a text
  // box's center past the next tick, so sorting by that center loses real dates.
  const valid = items.filter(item => Number.isFinite(item.start) && Number.isFinite(item.end) && item.end > item.start);
  if (valid.length < 2) return valid.map(item => item.index);
  const first = valid[0], last = valid.at(-1);
  const keepLast = last.start >= first.end + spacing;
  const selected = [first.index];
  let end = first.end;
  for (const item of valid.slice(1, -1)) {
    if (item.start < end + spacing || keepLast && item.end + spacing > last.start) continue;
    selected.push(item.index);
    end = item.end;
  }
  if (keepLast && last.start >= end + spacing) selected.push(last.index);
  return selected;
}

/** Value labels may share an x position when they occupy different vertical rows. */
export function selectNonOverlappingLabels(items, {gap = 6} = {}) {
  const spacing = Number.isFinite(gap) ? Math.max(0, gap) : 6;
  const sorted = items.filter(item => [item.start,item.end,item.top,item.bottom].every(Number.isFinite) && item.end > item.start && item.bottom > item.top)
    .slice().sort((a, b) => a.start - b.start);
  const selected = [];
  let active = [];
  for (const item of sorted) {
    active = active.filter(other => other.end + spacing > item.start);
    if (active.some(other => item.top < other.bottom + spacing && other.top < item.bottom + spacing)) continue;
    selected.push(item.index); active.push(item);
  }
  return selected;
}

/** Measure rendered SVG text after layout/fonts change. Returns an idempotent cleanup. */
export function bindChartLayout(root) {
  if (!root) return () => {};
  const existing = bindings.get(root);
  if (existing) {existing.schedule(); return existing.dispose;}
  const doc = root.nodeType === 9 ? root : root.ownerDocument;
  const win = doc?.defaultView;
  if (!win) return () => {};
  // A parent observer also covers dynamic child charts and modal contents.
  for (let parent = root.parentNode; parent; parent = parent.parentNode) {
    const owner = bindings.get(parent);
    if (owner) {owner.schedule(); return () => {};}
  }
  const host = root.nodeType === 9 ? root.body : root;
  if (!host) return () => {};
  const svgs = new Set(), changed = new Set(), originals = new WeakMap();
  let frame = 0, disposed = false;

  function remember(text) {
    if (!changed.has(text)) {changed.add(text); resize?.observe(text);}
    if (originals.has(text)) return;
    originals.set(text, {visibility:text.style.visibility, hidden:text.getAttribute('aria-hidden'), density:text.getAttribute('data-chart-tick-hidden')});
  }

  function restore(text) {
    const state = originals.get(text);
    if (!state) return;
    text.style.visibility = state.visibility;
    if (state.hidden === null) text.removeAttribute('aria-hidden'); else text.setAttribute('aria-hidden', state.hidden);
    if (state.density === null) text.removeAttribute('data-chart-tick-hidden'); else text.setAttribute('data-chart-tick-hidden', state.density);
  }

  function measure() {
    frame = 0;
    if (disposed) return;
    for (const svg of svgs) {
      if (!svg.isConnected || !host.contains(svg)) {resize?.unobserve(svg); svgs.delete(svg); continue;}
      const bounds = svg.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) continue;
      for (const group of svg.querySelectorAll('[data-chart-axis]')) {
        const labels = [...group.querySelectorAll('text[data-chart-tick]')].filter(text => text.closest('[data-chart-axis]') === group);
        if (!labels.length) continue;
        for (const text of labels) {remember(text); restore(text);}
        const rendered = labels.filter(text => win.getComputedStyle(text).visibility === 'visible');
        const items = rendered.map((text, index) => {
          const box = text.getBoundingClientRect();
          return {index, start:box.left, end:box.right, top:box.top, bottom:box.bottom};
        });
        const values = group.getAttribute('data-chart-axis') === 'values';
        const gap = Number(group.getAttribute('data-chart-tick-gap') || (values ? 6 : 12));
        const visible = new Set((values ? selectNonOverlappingLabels : selectNonOverlappingTicks)(items, {gap}));
        rendered.forEach((text, index) => {
          if (visible.has(index)) return;
          text.style.visibility = 'hidden';
          text.setAttribute('aria-hidden', 'true');
          text.setAttribute('data-chart-tick-hidden', 'true');
        });
      }
    }
    for (const text of changed) if (!text.isConnected || !host.contains(text)) {resize?.unobserve(text); changed.delete(text);}
  }

  function schedule() {if (!frame && !disposed) frame = win.requestAnimationFrame(measure);}
  const resize = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(schedule) : null;
  function discover() {
    const candidates = [...host.querySelectorAll('svg')].filter(svg => svg.querySelector('[data-chart-axis]'));
    if (host.matches?.('svg') && host.querySelector('[data-chart-axis]')) candidates.unshift(host);
    for (const svg of candidates) if (!svgs.has(svg)) {svgs.add(svg); resize?.observe(svg);}
    schedule();
  }
  const mutations = new win.MutationObserver(discover);
  mutations.observe(host, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['open','hidden','viewBox']});
  win.addEventListener('resize', schedule);
  win.addEventListener('dds-design-settings-change', schedule);
  doc.fonts?.addEventListener('loadingdone', schedule);
  doc.fonts?.ready.then(schedule);
  function dispose() {
    if (disposed) return;
    disposed = true;
    if (frame) win.cancelAnimationFrame(frame);
    mutations.disconnect(); resize?.disconnect();
    win.removeEventListener('resize', schedule);
    win.removeEventListener('dds-design-settings-change', schedule);
    doc.fonts?.removeEventListener('loadingdone', schedule);
    for (const text of changed) restore(text);
    changed.clear(); svgs.clear();
    if (bindings.get(root)?.dispose === dispose) bindings.delete(root);
  }
  bindings.set(root, {schedule, dispose});
  discover();
  return dispose;
}
