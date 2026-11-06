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

/** Direction is numeric; desirability is a metric-specific business decision. */
export function metricTrend(value,previous,{mode='relative',better='neutral',digits=1}={}) {
  if(typeof value!=='number'||!Number.isFinite(value))throw new TypeError('Metric value must be finite.');
  if(!['relative','points','absolute'].includes(mode)||!['higher','lower','neutral'].includes(better)||!Number.isInteger(digits)||digits<0||digits>4)throw new TypeError('Unsupported metric comparison options.');
  if(previous==null)return {direction:'unavailable',impact:'neutral',amount:null,label:'비교 데이터 없음',icon:'Minus'};
  if(typeof previous!=='number'||!Number.isFinite(previous))throw new TypeError('Previous metric value must be finite or null.');
  const delta=value-previous;
  if(delta===0)return {direction:'flat',impact:'neutral',amount:0,label:'변화 없음',icon:'Minus'};
  if(mode==='relative'&&previous<=0)return {direction:'unavailable',impact:'neutral',amount:null,label:'증감률 계산 불가',icon:'Minus'};
  const amount=mode==='relative'?delta/previous*100:delta;
  if(!Number.isFinite(amount))return {direction:'unavailable',impact:'neutral',amount:null,label:'변화량 계산 불가',icon:'Minus'};
  const direction=delta>0?'up':'down';
  const impact=better==='neutral'?'neutral':(direction==='up')===(better==='higher')?'positive':'negative';
  const unit=mode==='relative'?'%':mode==='points'?'%p':'';
  const threshold=10**-digits,absolute=Math.abs(amount);
  const formatted=new Intl.NumberFormat('ko-KR',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(absolute<threshold?threshold:absolute);
  return {direction,impact,amount,label:`${formatted}${unit}${absolute<threshold?' 미만':''} ${direction==='up'?'증가':'감소'}`,icon:direction==='up'?'TrendingUp':'TrendingDown'};
}

/** Card content only: the host owns its card/link/button, layout and data. */
export function metricContent(options,renderIcon) {
  const {label,value,previous,icon:metricIcon,digits=0,unit='',valueText,comparison='',mode='relative',better='neutral',changeDigits=1}=options||{};
  if(typeof label!=='string'||!label.trim()||typeof value!=='number'||!Number.isFinite(value))throw new TypeError('Metric content requires a label and finite value.');
  if(typeof renderIcon!=='function'||!Number.isInteger(digits)||digits<0||digits>4)throw new TypeError('Metric content requires a Lucide renderer and supported precision.');
  const formatted=valueText??new Intl.NumberFormat('ko-KR',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value)+unit;
  const trend=Object.hasOwn(options,'previous')?metricTrend(value,previous,{mode,better,digits:changeDigits}):null;
  return `<span class="dds-metric-heading">${metricIcon?`<span class="dds-metric-icon" aria-hidden="true">${renderIcon(metricIcon)}</span>`:''}<span class="dds-metric-label">${escapeText(label)}</span></span><strong class="dds-metric-value">${escapeText(formatted)}</strong>${trend?`<span class="dds-metric-change" data-direction="${trend.direction}" data-impact="${trend.impact}"><span aria-hidden="true">${renderIcon(trend.icon)}</span><span>${escapeText(trend.label)}</span></span>${comparison?`<span class="dds-metric-comparison">${escapeText(comparison)}</span>`:''}`:''}`;
}
