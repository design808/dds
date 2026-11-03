import {chartComponents, chartPresentation} from './chart-catalog.js?v=1efb6220a88f30ed';

// SVG examples use local data. Service adapters keep their existing chart engine,
// data requests, permissions and export behavior.
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const num = value => Number.isInteger(value) ? String(value) : value.toFixed(1);
const color = index => `var(--chart-series-${index + 1})`;
const scoreLabels = ['직무 이해', '논리적 전달', '구체성', '문제 해결'];
const dates = ['1회', '2회', '3회', '4회', '5회', '6회'];

export function chartData(id, variant) {
  if (id === 'pie-chart' || id === 'donut-chart') return {title:'작성한 문서 구성', unit:'개', labels:['자기소개서','이력서','면접 기록'], series:[{name:'문서 수', values:[8,5,3]}], note:'총 16개 · 같은 기간의 문서 구성'};
  if (id === 'radar-chart') return {title:'평가 항목별 점수', unit:'점', labels:[...scoreLabels,'협업','자기 이해'], series:[{name:'이번 평가',values:[78,86,64,82,75,88]}, ...(variant === 'single' ? [] : [{name:'이전 평가',values:[68,74,60,70,72,76]}])], note:'각 항목 0–100점 · 높을수록 높은 평가'};
  if (id === 'radial-chart') return {title:'이번 주 학습 목표', unit:'회', labels:variant === 'single' ? ['면접 연습'] : ['면접 연습','경험 정리','자기소개서 검토'], series:[{name:'완료 횟수',values:variant === 'single' ? [8] : [8,6,3]}], goals:variant === 'single' ? [10] : [10,8,5], note:'현재 횟수 / 주간 목표 · 항목별 달성률'};
  if (id === 'scatter-chart') return {title:'연습 시간과 평가 점수', unit:'점', labels:dates, series:[{name:'면접 연습',values:[62,68,74,79,84,82]}], x:[25,32,44,38,52,60], note:'가로: 연습 시간(분) · 세로: 평가(0–100점) · 인과관계를 뜻하지 않습니다.'};
  if (id === 'heatmap-chart') {
    const values = Array.from({length:56}, (_, i) => i === 25 ? null : (i * 7 + Math.floor(i / 7) * 3) % 6);
    const labels = values.map((_, i) => new Date(Date.UTC(2026,8,7+i)).toISOString().slice(0,10));
    return {title:'면접 연습 기록',unit:'회',labels,series:[{name:'연습 횟수',values}],note:'2026.09.07–11.01 · 0회와 기록 없음은 구분합니다.'};
  }
  if (id === 'area-chart' || (id === 'bar-chart' && variant === 'stacked')) return {title:'주별 학습 활동',unit:variant === 'percent' ? '%' : '회',labels:['1주','2주','3주','4주','5주','6주'],series:[{name:'자기소개서 검토',values:[6,10,8,14,12,18]}, ...(['stacked','percent'].includes(variant) ? [{name:'면접 연습',values:[3,4,6,5,8,10]}] : [])],note:variant === 'percent' ? '각 주의 활동 합계를 100%로 계산 · 원본 표에는 횟수 표시' : '주 단위 활동 횟수 · 0회부터 동일한 척도'};
  if (id === 'chart-tooltip') return {title:'주별 학습 활동 비교',unit:'회',labels:['1주','2주','3주','4주','5주','6주'],series:[{name:'자기소개서 검토',values:[6,10,8,14,12,18]},{name:'면접 연습',values:[3,4,6,5,8,10]}],note:'같은 주의 두 계열을 함께 확인 · 0회부터 동일한 척도'};
  if (id === 'line-chart') return {title:'면접 평가 추이',unit:'점',labels:dates,series:[{name:'종합 평가',values:[62,68,null,76,82,86]}, ...(['multiple'].includes(variant) ? [{name:'직무 이해',values:[58,64,69,70,75,80]}] : [])],note:'0–100점 · 3회 종합 평가 미수집 · 없는 구간은 연결하지 않습니다.'};
  if (variant === 'negative') return {title:'이전 평가 대비 변화',unit:'점',labels:scoreLabels,series:[{name:'점수 차이',values:[-4,8,-2,12]}],note:'이전 점수 대비 증감 · 0점을 기준으로 양수와 음수 표시'};
  return {title:'평가 항목별 점수',unit:'점',labels:scoreLabels,series:[{name:'이번 평가',values:[78,86,64,82]}, ...(variant === 'grouped' ? [{name:'이전 평가',values:[68,74,60,70]}] : [])],note:'각 항목 0–100점 · 예제 데이터'};
}

const svgText = (x,y,text,extra='') => `<text x="${x}" y="${y}" ${extra}>${esc(text)}</text>`;
const line = (x1,y1,x2,y2,cls='dds-chart-grid') => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
function datum(markup, label, value, unit, series = 0) {
  const content = value == null ? `${label} · 기록 없음` : `${label} · ${num(value)}${unit}`;
  const [item, ...name] = label.split(' · ');
  return `<g class="dds-chart-datum" tabindex="0" role="img" aria-label="${esc(content)}" data-chart-point="${esc(content)}" data-chart-label="${esc(item)}" data-chart-name="${esc(name.join(' · '))}" data-chart-value="${value == null ? '' : esc(num(value))}" data-chart-unit="${esc(unit)}" data-chart-missing="${value == null}" data-chart-series="${series}">${markup}</g>`;
}
function svgWrap(content, title, width=600, height=300, shape='cartesian') {
  return `<svg class="dds-chart-svg dds-chart-svg--${shape}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="group" aria-label="${esc(title)}">${content}</svg>`;
}
function axes(data, yMin, yMax, xLabels = data.labels, categoryBand = false) {
  let result = svgText(52,16,data.unit,'text-anchor="end"');
  for (let i=0;i<=4;i++) {
    const value=yMin+(yMax-yMin)*i/4, y=250-220*i/4;
    result+=line(56,y,576,y,Math.abs(value)<.001?'dds-chart-baseline':'dds-chart-grid')+svgText(46,y+5,num(value),'text-anchor="end"');
  }
  xLabels.forEach((text,i)=>{result+=svgText((categoryBand?94:78)+i*(categoryBand?444:476)/Math.max(1,xLabels.length-1),278,text,'text-anchor="middle"');});
  return result;
}
function segmentedPath(points, mode='linear') {
  let d='',previous=null;
  for (const p of points) {
    if (!p) {previous=null;continue;}
    const [x,y]=p;
    if (!previous) d+=` M ${x} ${y}`;
    else if (mode==='step') d+=` H ${x} V ${y}`;
    else if (mode==='smooth') {const mid=(previous[0]+x)/2;d+=` C ${mid} ${previous[1]},${mid} ${y},${x} ${y}`;}
    else d+=` L ${x} ${y}`;
    previous=p;
  }
  return d;
}
function roundedBar(x,y,width,height,end='top',radius=4) {
  const r=Math.max(0,Math.min(radius,width/2,height/2));
  if(end==='top')return `M ${x} ${y+height} V ${y+r} Q ${x} ${y} ${x+r} ${y} H ${x+width-r} Q ${x+width} ${y} ${x+width} ${y+r} V ${y+height} Z`;
  if(end==='bottom')return `M ${x} ${y} H ${x+width} V ${y+height-r} Q ${x+width} ${y+height} ${x+width-r} ${y+height} H ${x+r} Q ${x} ${y+height} ${x} ${y+height-r} Z`;
  if(end==='right')return `M ${x} ${y} H ${x+width-r} Q ${x+width} ${y} ${x+width} ${y+r} V ${y+height-r} Q ${x+width} ${y+height} ${x+width-r} ${y+height} H ${x} Z`;
  return `M ${x} ${y} H ${x+width} V ${y+height} H ${x} Z`;
}
function cartesian(id, variant, data, hidden) {
  const visible=data.series.map((s,index)=>({...s,index})).filter(s=>!hidden.has(s.index));
  const isArea=id==='area-chart', isLine=id==='line-chart', stacked=['stacked','percent'].includes(variant);
  const min=variant==='negative'?-20:0, max=variant==='negative'||id==='chart-tooltip'?20:(isArea||stacked ? variant==='percent'?100:40 :100);
  const y=value=>250-(value-min)/(max-min)*220;
  const x=i=>(isLine||isArea?78:94)+i*(isLine||isArea?476:444)/Math.max(1,data.labels.length-1);
  let plot=axes(data,min,max,data.labels,!isLine&&!isArea);
  if (variant==='horizontal') {
    plot=svgText(576,16,'점','text-anchor="end"');
    for(let n=0;n<=100;n+=25){const gx=140+n*4.1;plot+=line(gx,25,gx,245,n===0?'dds-chart-baseline':'dds-chart-grid')+svgText(gx,277,n,'text-anchor="middle"');}
    if (!hidden.has(0)) data.labels.forEach((label,i)=>{const value=data.series[0].values[i],cy=50+i*55;plot+=svgText(128,cy+5,label,'text-anchor="end"')+datum(`<path class="dds-chart-bar dds-chart-bar--horizontal" d="${roundedBar(140,cy-10,value*4.1,20,'right')}" fill="${color(0)}"/>${svgText(150+value*4.1,cy+5,value,'class="dds-chart-value"')}`,label,value,'점');});
    return svgWrap(plot,data.title);
  }
  if (isLine || isArea) {
    const totals=data.labels.map((_,i)=>visible.reduce((sum,s)=>sum+(s.values[i]??0),0));
    let cumulative=data.labels.map(()=>0);
    visible.forEach(s=>{
      const lows=[...cumulative];
      const values=s.values.map((v,i)=>v==null?null:variant==='percent' ? totals[i]?v/totals[i]*100:0:v);
      const points=values.map((v,i)=>v==null?null:[x(i),y(v+(stacked?lows[i]:0))]);
      const d=segmentedPath(points,variant==='step'?'step':variant==='smooth'||isArea&&variant==='basic'?'smooth':'linear');
      if (isArea) {
        const lower=data.labels.map((_,i)=>[x(i),y(stacked?lows[i]:0)]).reverse();
        const fillPath=d+lower.map(([px,py])=>` L ${px} ${py}`).join('')+' Z';
        if(variant==='gradient')plot+=`<defs><linearGradient id="${data.uid}-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color(s.index)}" style="stop-opacity:var(--chart-gradient-start,.24)"/><stop offset="1" stop-color="${color(s.index)}" style="stop-opacity:var(--chart-gradient-end,.02)"/></linearGradient></defs>`;
        plot+=`<path class="dds-chart-area${stacked?' dds-chart-area--stacked':''}${variant==='gradient'?' dds-chart-area--gradient':''}" d="${fillPath}" fill="${variant==='gradient'?`url(#${data.uid}-fill)`:color(s.index)}" style="fill-opacity:${variant==='gradient'?'1':stacked?'var(--chart-area-stacked-opacity,.14)':'var(--chart-area-opacity,.1)'}"/>`;
      }
      plot+=`<path class="dds-chart-series-line" data-series="${s.index}" d="${d}" fill="none" stroke="${color(s.index)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
      points.forEach((point,i)=>{
        if(!point)return;
        plot+=datum(`<circle class="dds-chart-point-hit" cx="${point[0]}" cy="${point[1]}" r="13"/><circle class="dds-chart-point${variant==='dots'?' is-always-visible':''}" cx="${point[0]}" cy="${point[1]}" r="4" fill="${color(s.index)}" stroke="var(--background)" stroke-width="2"/>`,`${data.labels[i]} · ${s.name}`,s.values[i],data.unit==='%'?`회 (${num(values[i])}%)`:data.unit,s.index);
      });
      if(stacked)cumulative=cumulative.map((v,i)=>v+(values[i]??0));
    });
  } else {
    const groupWidth=Math.min(48,400/data.labels.length), seriesCount=Math.max(visible.length,1);
    data.labels.forEach((label,i)=>{
      let sum=0;
      const lastNonzero=visible.filter(s=>s.values[i]!==0).at(-1)?.index;
      visible.forEach((s,j)=>{
        const v=s.values[i],gap=seriesCount>1?4:0,width=stacked?groupWidth:groupWidth/seriesCount-gap;
        const bx=x(i)-groupWidth/2+(stacked?0:j*groupWidth/seriesCount+gap/2);
        const by=y(v+(stacked?sum:0)),bottom=y(stacked?sum:0);
        const end=stacked&&s.index!==lastNonzero?'none':v<0?'bottom':'top';
        plot+=datum(`<path class="dds-chart-bar${stacked?' dds-chart-bar--stacked':''}" d="${roundedBar(bx,Math.min(by,bottom),width,Math.abs(bottom-by),end)}" fill="${color(s.index)}"/>${variant==='labels'||variant==='negative'?svgText(bx+width/2,v<0?by+20:by-10,(v>0&&variant==='negative'?'+':'')+v,'text-anchor="middle" class="dds-chart-value"'):''}`,`${label} · ${s.name}`,v,data.unit,s.index);
        sum+=v;
      });
    });
  }
  return svgWrap(plot,data.title);
}

function circlePoint(cx,cy,r,angle) {const radians=(angle-90)*Math.PI/180;return [cx+r*Math.cos(radians),cy+r*Math.sin(radians)];}
function arcPath(cx,cy,r,start,end) {const a=circlePoint(cx,cy,r,start),b=circlePoint(cx,cy,r,end);return `M ${a[0]} ${a[1]} A ${r} ${r} 0 ${end-start>180?1:0} 1 ${b[0]} ${b[1]}`;}
function circular(id,variant,data,hidden) {
  const visible=data.labels.map((label,index)=>({label,index,value:data.series[0].values[index]})).filter(s=>!hidden.has(s.index));
  const total=visible.reduce((sum,s)=>sum+s.value,0);
  let plot='',angle=0;
  for(const s of visible){
    const portion=s.value/total, end=angle+portion*359.9999;
    let mark=id==='pie-chart'?`<path class="dds-chart-slice" d="M 180 150 L ${circlePoint(180,150,108,angle).join(' ')} ${arcPath(180,150,108,angle,end).replace(/^M [^A]+/,'')} Z" fill="${color(s.index)}" stroke="var(--background)" stroke-width="2"/>`:`<path class="dds-chart-donut-segment" d="${arcPath(180,150,96,angle+1,end-1)}" fill="none" stroke="${color(s.index)}" stroke-width="24"/>`;
    if(variant==='labels') {const p=circlePoint(180,150,134,angle+(end-angle)/2);mark+=svgText(p[0],p[1]+5,Math.round(portion*100)+'%','text-anchor="middle" class="dds-chart-value"');}
    plot+=datum(mark,s.label,s.value,`개 (${num(portion*100)}%)`,s.index);
    angle=end;
  }
  if(id==='donut-chart'&&variant==='total')plot+=svgText(180,148,total,'text-anchor="middle" class="dds-chart-total"')+svgText(180,173,'문서 합계 · 개','text-anchor="middle" class="dds-chart-center-caption"');
  return svgWrap(plot,data.title,360,300,'circular');
}
function radar(variant,data,hidden) {
  const cx=300,cy=155,r=108,n=data.labels.length;
  let plot='';
  for(let step=1;step<=4;step++)plot+=`<polygon class="dds-chart-grid" fill="none" points="${data.labels.map((_,i)=>circlePoint(cx,cy,r*step/4,i*360/n).join(',')).join(' ')}"/>`;
  data.labels.forEach((label,i)=>{const p=circlePoint(cx,cy,r,i*360/n),t=circlePoint(cx,cy,r+28,i*360/n);plot+=line(cx,cy,...p)+svgText(t[0],t[1]+5,label,`text-anchor="${i===0||i===3?'middle':i<3?'start':'end'}"`);});
  [50,100].forEach(value=>{plot+=svgText(cx+8,cy-r*value/100+4,value,'class="dds-chart-axis-tick"');});
  data.series.forEach((s,j)=>{
    if(hidden.has(j))return;
    const points=s.values.map((v,i)=>circlePoint(cx,cy,r*v/100,i*360/n));
    plot+=`<polygon class="dds-chart-radar-area" data-series="${j}" points="${points.map(p=>p.join(',')).join(' ')}" fill="${color(j)}" style="fill-opacity:var(--chart-radar-opacity,.06)" stroke="${color(j)}" stroke-width="2" ${j?'stroke-dasharray="4 4"':''}/>`;
    points.forEach((p,i)=>{plot+=datum(`<circle class="dds-chart-point-hit" cx="${p[0]}" cy="${p[1]}" r="12"/><circle class="dds-chart-point" cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${color(j)}" stroke="var(--background)" stroke-width="2"/>`,`${data.labels[i]} · ${s.name}`,s.values[i],'점',j);});
  });
  return svgWrap(plot,data.title,600,320,'radar');
}
function radial(variant,data,hidden) {
  let plot='';
  data.labels.forEach((label,i)=>{
    const r=112-i*28,value=data.series[0].values[i],goal=data.goals[i];
    if(hidden.has(i))return;
    plot+=`<circle class="dds-chart-radial-track" cx="170" cy="150" r="${r}" fill="none" stroke="var(--surface)" stroke-width="14"/>`;
    plot+=datum(`<path class="dds-chart-radial-arc" d="${arcPath(170,150,r,0,value/goal*359.9999)}" fill="none" stroke="${color(i)}" stroke-width="14" stroke-linecap="round"/>`,label,value,`회 / 목표 ${goal}회 (${Math.round(value/goal*100)}%)`,i);
  });
  if(data.labels.length===1&&!hidden.has(0))plot+=svgText(170,152,Math.round(data.series[0].values[0]/data.goals[0]*100)+'%','text-anchor="middle" class="dds-chart-total"')+svgText(170,180,'목표 달성','text-anchor="middle" class="dds-chart-center-caption"');
  return svgWrap(plot,data.title,340,300,'circular');
}
function scatter(data,hidden) {
  let plot=axes({...data,labels:['0분','15분','30분','45분','60분']},0,100);
  if(!hidden.has(0))data.x.forEach((v,i)=>{const x=78+v/60*476,y=250-data.series[0].values[i]/100*220;plot+=datum(`<circle class="dds-chart-point-hit" cx="${x}" cy="${y}" r="15"/><circle class="dds-chart-point is-always-visible dds-chart-scatter-point" cx="${x}" cy="${y}" r="5" fill="${color(0)}" fill-opacity=".85" stroke="var(--background)" stroke-width="2"/>`,`${data.labels[i]} · ${v}분`,data.series[0].values[i],'점');});
  return svgWrap(plot,data.title);
}
function heatmap(data) {
  let plot='';
  ['월','화','수','목','금','토','일'].forEach((d,i)=>{plot+=svgText(28,61+i*28,d,'text-anchor="middle"');});
  for(let week=0;week<8;week++)plot+=svgText(69+week*63,24,data.labels[week*7].slice(5).replace('-','/'),'text-anchor="middle"');
  data.series[0].values.forEach((value,i)=>{
    const x=49+Math.floor(i/7)*63,y=42+(i%7)*28;
    const style=value==null?'fill="none" stroke="var(--text-tertiary)" stroke-dasharray="3 2"':`fill="${value===0?'var(--surface)':color(0)}" fill-opacity="${value===0?1:.16+value*.16}"`;
    plot+=datum(`<rect x="${x}" y="${y}" width="40" height="22" rx="4" ${style}/>${value==null?line(x+16,y+11,x+24,y+11,'dds-chart-missing'):''}`,data.labels[i],value,'회');
  });
  plot+=svgText(50,274,'0회');
  for(let i=0;i<=5;i++)plot+=`<rect x="${90+i*25}" y="259" width="19" height="19" rx="3" fill="${i===0?'var(--surface)':color(0)}" fill-opacity="${i===0?1:.16+i*.16}"/>`;
  plot+=svgText(249,274,'5회')+svgText(570,274,'점선: 기록 없음','text-anchor="end"');
  return svgWrap(plot,data.title,600,300,'heatmap');
}
function legendItems(id,data) {
  if(['pie-chart','donut-chart','radial-chart'].includes(id))return data.labels.map((name,index)=>({name,index,value:data.series[0].values[index],goal:data.goals?.[index]}));
  return data.series.map((s,index)=>({name:s.name,index}));
}
function legend(id,data,hidden) {
  return `<div class="dds-chart-legend${['pie-chart','donut-chart','radial-chart'].includes(id)?' dds-chart-legend--values':''}" role="group" aria-label="표시할 데이터">${legendItems(id,data).map(s=>`<button type="button" data-chart-legend="${s.index}" aria-pressed="${!hidden.has(s.index)}"><span class="dds-chart-key" style="--series:${color(s.index)}" data-series="${s.index}" aria-hidden="true"></span><span class="dds-chart-legend-label">${esc(s.name)}</span>${s.value!=null?`<strong class="dds-chart-legend-value">${s.value}${data.unit}${s.goal?` / ${s.goal}${data.unit} · ${Math.round(s.value/s.goal*100)}%`:''}</strong>`:''}</button>`).join('')}</div>`;
}
function tableHTML(id,data) {
  const headings=['항목',...(data.x?['연습 시간(분)']:[]),...data.series.map(s=>s.name+`(${data.unit==='%'?'회':data.unit})`),...(data.goals?['목표(회)','달성률']:[]),...(['pie-chart','donut-chart'].includes(id)?['비율']:[])];
  const total=data.series[0].values.reduce((s,v)=>s+(v??0),0);
  return `<div class="table-wrap"><table><caption class="sr-only">${esc(data.title)} 원본 데이터</caption><thead><tr>${headings.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${data.labels.map((label,i)=>`<tr><th scope="row">${esc(label)}</th>${data.x?`<td>${data.x[i]}</td>`:''}${data.series.map(s=>`<td>${s.values[i]==null?'기록 없음':s.values[i]}</td>`).join('')}${data.goals?`<td>${data.goals[i]}</td><td>${Math.round(data.series[0].values[i]/data.goals[i]*100)}%</td>`:''}${['pie-chart','donut-chart'].includes(id)?`<td>${num(data.series[0].values[i]/total*100)}%</td>`:''}</tr>`).join('')}</tbody></table></div>${['pie-chart','donut-chart'].includes(id)?'<p class="dds-chart-note">비율은 반올림하여 표시하므로 합계가 100%와 다를 수 있습니다.</p>':''}`;
}
function chartMarkup(id,variant,uid,hidden=new Set(),mini=false) {
  const data={...chartData(id,variant),uid};
  if(['pie-chart','donut-chart'].includes(id)&&hidden.size){const total=data.series[0].values.reduce((sum,v,i)=>sum+(hidden.has(i)?0:v),0);data.note=`표시한 항목 ${total}개를 100%로 계산 · 원본 표는 전체 16개 기준`;}
  if(id==='area-chart'&&variant==='percent')data.note='표시한 항목의 주별 합계를 100%로 계산 · 원본 표에는 횟수 표시';
  const empty=legendItems(id,data).every(s=>hidden.has(s.index));
  const plot=id==='pie-chart'||id==='donut-chart'?circular(id,variant,data,hidden):id==='radar-chart'?radar(variant,data,hidden):id==='radial-chart'?radial(variant,data,hidden):id==='scatter-chart'?scatter(data,hidden):id==='heatmap-chart'?heatmap(data):cartesian(id,variant,data,hidden);
  return `${!mini?`<div class="dds-chart-heading"><h3>${esc(data.title)}</h3><span>예제 데이터</span></div>`:''}<div class="dds-chart-plot" ${mini?'':`aria-describedby="${uid}-note"`}>${empty?'<div class="dds-chart-no-series"><p>표시할 데이터를 선택해 주세요.</p></div>':plot}</div>${!mini?`${legend(id,data,hidden)}<p class="dds-chart-note" id="${uid}-note">${esc(data.note)}</p>`:''}`;
}

export function chartDemo(id,uid,mini=false) {
  const presentation=chartPresentation(id);
  if(id!=='chart'&&!presentation)return null;
  if(id==='chart'){
    if(mini)return `<div class="dds-chart-example dds-chart-example--mini">${chartMarkup('bar-chart','horizontal',uid,new Set(),true)}</div>`;
    return `<div class="dds-chart-overview"><div class="dds-chart-type-grid">${chartComponents.map(c=>`<a href="#/components/${c.id}"><strong>${esc(c.name)}</strong><span>${esc(c.ko)}</span></a>`).join('')}</div>${chartDemo('bar-chart',uid+'-example')}<div class="dds-chart-guidance"><h3>차트 선택</h3><p>크기는 막대, 변화는 선·영역, 구성 비율은 파이·도넛, 평가 항목은 레이더, 목표 달성은 방사형으로 표시합니다. 두 수치의 관계는 산점도, 날짜별 활동은 히트맵을 사용합니다.</p><p>숫자 0, 데이터 없음, 불러오는 중, 요청 실패는 서로 다른 상태입니다. 제목·기간·단위와 수치 표를 함께 제공합니다.</p></div></div>`;
  }
  const {family,variant}=presentation;
  if(mini)return `<div class="dds-chart-example dds-chart-example--mini">${chartMarkup(family,variant,uid,new Set(),true)}</div>`;
  return `<div class="dds-chart-example" data-chart-component="${presentation.component.id}" data-chart-example="${family}" data-chart-variant="${variant}" data-chart-uid="${uid}"><div data-chart-content>${chartMarkup(family,variant,uid)}</div><div class="dds-chart-tooltip" id="${uid}-tooltip" role="tooltip" hidden></div><details class="dds-chart-data"><summary>원본 데이터 보기</summary><div data-chart-table>${tableHTML(family,chartData(family,variant))}</div></details>${family==='chart-tooltip'?'<p class="dds-chart-note">막대에 마우스를 올리거나 Tab으로 이동해 보세요. 터치로 눌러도 같은 항목의 계열별 수치를 확인할 수 있습니다.</p>':''}</div>`;
}

export function bindCharts(root=document) {
  root.querySelectorAll('[data-chart-example]').forEach(example=>{
    if(example.dataset.chartBound)return;
    example.dataset.chartBound='true';
    const id=example.dataset.chartExample,uid=example.dataset.chartUid,hidden=new Set();
    const variant=example.dataset.chartVariant;
    let tooltipTimer=0;
    const tooltip=example.querySelector('.dds-chart-tooltip');
    function closeTip(){clearTimeout(tooltipTimer);tooltip.hidden=true;}
    function update(){
      closeTip();
      example.querySelector('[data-chart-content]').innerHTML=chartMarkup(id,variant,uid,hidden);
      example.querySelector('[data-chart-table]').innerHTML=tableHTML(id,chartData(id,variant));
    }
    function showTip(point){
      if(!point)return;
      clearTimeout(tooltipTimer);
      function row(name,value,unit,series,missing=false){
        const wrapper=document.createElement('span');
        wrapper.className='dds-chart-tooltip-row';
        const marker=document.createElement('span');
        marker.className='dds-chart-key dds-chart-tooltip-marker';
        marker.style.setProperty('--series',color(series));
        marker.setAttribute('aria-hidden','true');
        const label=document.createElement('span');
        label.className='dds-chart-tooltip-label';
        label.textContent=name;
        const number=document.createElement('strong');
        number.className='dds-chart-tooltip-value';
        number.textContent=missing?'기록 없음':`${value}${unit}`;
        wrapper.append(marker,label,number);
        return wrapper;
      }
      const data=chartData(id,variant);
      const heading=document.createElement('strong');
      heading.className='dds-chart-tooltip-title';
      heading.textContent=point.dataset.chartLabel;
      if(id==='chart-tooltip'){
        const index=data.labels.indexOf(point.dataset.chartLabel);
        tooltip.replaceChildren(heading,...data.series.flatMap((series,i)=>hidden.has(i)?[]:[row(series.name,series.values[index]==null?'':num(series.values[index]),data.unit,i,series.values[index]==null)]));
      }else{
        const series=Number(point.dataset.chartSeries);
        const name=id==='scatter-chart'?'평가 점수':point.dataset.chartName||data.series[series]?.name||data.series[0].name;
        if(id==='scatter-chart')heading.textContent+=` · 연습 ${point.dataset.chartName}`;
        tooltip.replaceChildren(heading,row(name,point.dataset.chartValue,point.dataset.chartUnit,series,point.dataset.chartMissing==='true'));
      }
      tooltip.hidden=false;
      const rect=point.getBoundingClientRect(),parent=example.getBoundingClientRect();
      const x=Math.max(8,Math.min(parent.width-tooltip.offsetWidth-8,rect.left-parent.left+rect.width/2-tooltip.offsetWidth/2));
      const top=rect.top-parent.top-tooltip.offsetHeight-10;
      tooltip.style.left=x+'px';
      tooltip.style.top=(top<0?rect.bottom-parent.top+10:top)+'px';
    }
    example.addEventListener('click',event=>{
      const key=event.target.closest('[data-chart-legend]');
      if(key){const index=Number(key.dataset.chartLegend);hidden.has(index)?hidden.delete(index):hidden.add(index);update();example.querySelector(`[data-chart-legend="${index}"]`).focus({preventScroll:true});return;}
      showTip(event.target.closest('[data-chart-point]'));
    });
    example.addEventListener('pointerover',event=>showTip(event.target.closest('[data-chart-point]')));
    example.addEventListener('pointerout',event=>{if(event.target.closest('[data-chart-point]')&&!event.relatedTarget?.closest?.('[data-chart-point]'))tooltipTimer=setTimeout(closeTip,180);});
    tooltip.addEventListener('pointerenter',()=>clearTimeout(tooltipTimer));
    tooltip.addEventListener('pointerleave',closeTip);
    example.addEventListener('focusin',event=>showTip(event.target.closest('[data-chart-point]')));
    example.addEventListener('focusout',closeTip);
    example.addEventListener('keydown',event=>{if(event.key==='Escape'&&!tooltip.hidden){event.preventDefault();event.stopPropagation();closeTip();}});
  });
}
