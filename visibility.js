// Optional, pure markup helpers. State and event handling stay in the host service.
const escapeText=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const stateIcons=Object.freeze({draft:'PencilLine',complete:'Check',pending:'Clock3',error:'CircleAlert'});

export function collectionCount(count,{label='항목',unit='개'}={}) {
  if(!Number.isSafeInteger(count)||count<0)throw new TypeError('Collection count must be a non-negative safe integer.');
  const value=String(count)+unit;
  return `<span class="badge dds-collection-count" aria-label="${escapeText(label)} ${escapeText(value)}">${escapeText(value)}</span>`;
}

export function statusBadge(state,label,renderIcon) {
  if(!Object.hasOwn(stateIcons,state))throw new TypeError('Unknown DDS status: '+state);
  if(typeof label!=='string'||!label.trim())throw new TypeError('A visible status label is required.');
  if(typeof renderIcon!=='function')throw new TypeError('Pass the service Lucide renderer as renderIcon.');
  // renderIcon is trusted application code, not user content. It must return an
  // aria-hidden, non-focusable Lucide SVG. No DOM or icon library is loaded here.
  return `<span class="badge dds-status" data-status="${state}">${renderIcon(stateIcons[state])}<span>${escapeText(label)}</span></span>`;
}
