import {chartComponents, chartPresentation} from '../chart-catalog.js?v=a0e474a8a17e958f';
import {bindChartLayout} from '../chart-layout.js?v=a0e474a8a17e958f';

// SVG examples use local data. Service adapters keep their existing chart engine,
// data requests, permissions and export behavior.
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const num = value => Number.isFinite(value) ? String(Number(value.toPrecision(10))) : '기록 없음';
const color = index => `var(--chart-series-${index + 1},var(--chart-series-${index % 3 + 1}))`;
const scoreLabels = ['직무 이해', '논리적 전달', '구체성', '문제 해결'];
const dates = ['1회', '2회', '3회', '4회', '5회', '6회'];

export function chartData(id, variant) {
  if (id === 'pie-chart' || id === 'donut-chart') return {title:'작성한 문서 구성', unit:'개', labels:['자기소개서','이력서','면접 기록'], series:[{name:'문서 수', values:[8,5,3]}], note:'총 16개 · 같은 기간의 문서 구성'};
  if (id === 'radar-chart') return {title:'평가 항목별 점수', unit:'점', labels:[...scoreLabels,'협업','자기 이해'], series:[{name:'이번 평가',values:[78,86,64,82,75,88]}, ...(variant === 'single' ? [] : [{name:'이전 평가',values:[68,74,60,70,72,76]}])], note:'각 항목 0–100점 · 높을수록 높은 평가'};
  if (id === 'radial-chart') return {title:'이번 주 학습 목표', unit:'회', labels:variant === 'single' ? ['면접 연습'] : ['면접 연습','경험 정리','자기소개서 검토'], series:[{name:'완료 횟수',values:variant === 'single' ? [8] : [8,6,3]}], goals:variant === 'single' ? [10] : [10,8,5], note:'현재 횟수 / 주간 목표 · 항목별 달성률'};
  if (id === 'scatter-chart') return {title:'연습 시간과 평가 점수', unit:'점', xUnit:'분', xLabel:'연습 시간', labels:dates, series:[{name:'면접 연습',values:[62,68,74,79,84,82]}], x:[25,32,44,38,52,60], note:'가로: 연습 시간(분) · 세로: 평가(0–100점) · 인과관계를 뜻하지 않습니다.'};
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

const numeric = value => typeof value === 'number' && Number.isFinite(value) ? value : null;
function prepareData(source = {}) {
  const series = Array.isArray(source.series) ? source.series : [];
  const count = Math.max(source.labels?.length || 0, source.x?.length || 0, source.goals?.length || 0, ...series.map(item => item.values?.length || 0));
  return {...source, title:String(source.title || '데이터 차트'), unit:String(source.unit || ''), note:String(source.note || ''),
    labels:Array.from({length:count}, (_, index) => String(source.labels?.[index] ?? `항목 ${index + 1}`)),
    series:(series.length ? series : [{name:'값', values:[]}]).map((item, index) => ({...item, name:String(item.name || `계열 ${index + 1}`), values:Array.from({length:count}, (_, i) => numeric(item.values?.[i]))})),
    ...(Array.isArray(source.x) ? {x:Array.from({length:count}, (_, i) => numeric(source.x[i]))} : {}),
    ...(Array.isArray(source.goals) ? {goals:Array.from({length:count}, (_, i) => numeric(source.goals[i]))} : {})};
}
const positiveTotal = values => values.reduce((sum, value) => sum + (value > 0 ? value : 0), 0);
const percentText = value => value > 0 && value < .1 ? '<0.1%' : `${num(Math.round(value * 10) / 10)}%`;
const rawUnit = (data, variant) => data.rawUnit ?? (variant === 'percent' && data.unit === '%' ? '회' : data.unit);
function niceDomain(values, score = false) {
  const finite = values.filter(Number.isFinite);
  let min = 0, max = score ? 100 : 0;
  for(const value of finite){min=Math.min(min,value);max=Math.max(max,value);}
  if (min === max) max = min + 1;
  const raw = (max - min) / 4, magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1,2,2.5,5,10].find(value => value * magnitude >= raw) * magnitude;
  return [Math.floor(min / step) * step, Math.ceil(max / step) * step];
}
const axisNumber = value => Math.abs(value) >= 1e6 || (value !== 0 && Math.abs(value) < .001) ? value.toExponential(1) : num(Number(value.toPrecision(6)));
function geometry(count, {mini = false, step = 0, height} = {}) {
  const width = Math.max(mini ? 320 : 600, 100 + Math.max(1, count - 1) * step);
  const fullHeight = height || (mini ? 190 : 300), left = 68, right = width - 24, top = 36, bottom = fullHeight - 44;
  return {width, height:fullHeight, left, right, top, bottom, span:right-left};
}
const svgText = (x,y,text,extra='') => `<text x="${x}" y="${y}" ${extra}>${esc(text)}</text>`;
const line = (x1,y1,x2,y2,cls='dds-chart-grid') => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
function datum(markup, label, value, unit, series = 0, index = 0, name = '') {
  const content = `${label}${name ? ' · '+name : ''} · ${value == null ? '기록 없음' : `${value}${unit}`}`;
  return `<g class="dds-chart-datum" tabindex="0" role="img" aria-label="${esc(content)}" data-chart-point="${esc(content)}" data-chart-label="${esc(label)}" data-chart-name="${esc(name)}" data-chart-index="${index}" data-chart-value="${value == null ? '' : esc(value)}" data-chart-unit="${esc(unit)}" data-chart-missing="${value == null}" data-chart-series="${series}">${markup}</g>`;
}
function svgWrap(content, title, width=600, height=300, shape='cartesian') {
  return `<svg class="dds-chart-svg dds-chart-svg--${shape}" data-chart-allow-tall="${height>360}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="--chart-width:${width}px;--chart-height:${height}px" role="group" aria-label="${esc(title)}">${content}</svg>`;
}
function axes(data, yMin, yMax, xLabels = data.labels, categoryBand = false, g = geometry(xLabels.length)) {
  let result = svgText(g.left-10,16,data.unit,'text-anchor="end"');
  for (let i=0;i<=4;i++) {
    const value=yMin+(yMax-yMin)*i/4, y=g.bottom-(g.bottom-g.top)*i/4;
    result+=line(g.left,y,g.right,y,Math.abs(value)<.001?'dds-chart-baseline':'dds-chart-grid')+svgText(g.left-10,y+5,axisNumber(value),'text-anchor="end"');
  }
  result+='<g data-chart-axis="x">';
  const labels=xLabels.map(text=>wrapText(text,20));
  xLabels.forEach((text,i)=>{const x=categoryBand ? g.left+(i+.5)*g.span/Math.max(1,xLabels.length) : xLabels.length===1 ? (g.left+g.right)/2 : g.left+i*g.span/(xLabels.length-1);const anchor=xLabels.length===1?'middle':i===0?'start':i===xLabels.length-1?'end':'middle';result+=`<text x="${x}" y="${g.bottom+28}" text-anchor="${anchor}" data-chart-tick="${i}">${labels[i].map((label,line)=>`<tspan x="${x}" dy="${line?16:0}">${esc(label)}</tspan>`).join('')}</text>`;});
  g.height+=(Math.max(1,...labels.map(lines=>lines.length))-1)*16;
  result+='</g>';
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
  if(end==='left')return `M ${x+r} ${y} H ${x+width} V ${y+height} H ${x+r} Q ${x} ${y+height} ${x} ${y+height-r} V ${y+r} Q ${x} ${y} ${x+r} ${y} Z`;
  return `M ${x} ${y} H ${x+width} V ${y+height} H ${x} Z`;
}
function areaFill(points, lows, x, y, mode) {
  const paths=[]; let run=[];
  const close=()=>{if(!run.length)return; const upper=run.map(i=>points[i]); const lower=run.map(i=>[x(i),y(lows[i])]).reverse(); paths.push(segmentedPath(upper,mode)+lower.map(([px,py])=>` L ${px} ${py}`).join('')+' Z');run=[];};
  points.forEach((point,index)=>{if(point)run.push(index);else close();});close();return paths.join(' ');
}
function cartesian(id, variant, data, hidden) {
  const visible=data.series.map((series,index)=>({...series,index})).filter(series=>!hidden.has(series.index));
  const isArea=id==='area-chart',isLine=id==='line-chart',stacked=['stacked','percent'].includes(variant),n=data.labels.length;
  const allValues=data.series.flatMap(series=>series.values).filter(Number.isFinite);
  let domainValues=allValues;
  if(stacked)domainValues=data.labels.flatMap((_,i)=>[data.series.reduce((sum,s)=>sum+Math.max(0,s.values[i]??0),0),data.series.reduce((sum,s)=>sum+Math.min(0,s.values[i]??0),0)]);
  const [min,max]=variant==='percent'?[0,100]:niceDomain(domainValues,data.unit==='점');
  const perSeries=Math.max(1,data.series.length),step=isLine||isArea?0:Math.max(44,perSeries*12+16);
  const g=geometry(n,{mini:data.mini,step});
  const y=value=>g.bottom-(value-min)/(max-min)*(g.bottom-g.top);
  const x=i=>isLine||isArea ? n===1?(g.left+g.right)/2:g.left+i*g.span/Math.max(1,n-1) : g.left+(i+.5)*g.span/Math.max(1,n);
  const unit=rawUnit(data,variant);
  if(variant==='horizontal') {
    const labelWidth=Math.min(280,Math.max(100,...data.labels.map(label=>estimatedWidth(label)+16))),wrapped=data.labels.map(label=>wrapText(label,Math.max(8,Math.floor(labelWidth/12))));
    const rows=wrapped.map(lines=>Math.max(40,lines.length*16+16,perSeries*14+12)),centers=[];let cursor=24;rows.forEach(height=>{centers.push(cursor+height/2);cursor+=height;});
    const width=Math.max(data.mini?320:600,labelWidth+360),height=Math.max(180,cursor+44),left=labelWidth+16,right=width-30,span=right-left;
    const px=value=>left+(value-min)/(max-min)*span,zero=px(0);
    let plot=svgText(right,16,unit,'text-anchor="end"')+'<g data-chart-axis="x">';
    for(let i=0;i<=4;i++){const v=min+(max-min)*i/4,gx=px(v);plot+=line(gx,24,gx,height-40,Math.abs(v)<.00001?'dds-chart-baseline':'dds-chart-grid')+svgText(gx,height-12,axisNumber(v),`text-anchor="${i===0?'start':i===4?'end':'middle'}" data-chart-tick="${i}"`);}plot+='</g>';
    data.labels.forEach((label,i)=>{
      const cy=centers[i],lines=wrapped[i];
      plot+=textLines(left-12,cy+4,lines,'text-anchor="end"');
      visible.forEach(series=>{const v=series.values[i];if(v==null)return;
        const end=px(v),w=Math.abs(end-zero),barHeight=perSeries===1?20:10,groupHeight=perSeries*(barHeight+4)-4,barY=cy-groupHeight/2+series.index*(barHeight+4);
        plot+=datum(`<path class="dds-chart-bar dds-chart-bar--horizontal" d="${roundedBar(Math.min(zero,end),barY,w,barHeight,v<0?'left':'right')}" fill="${color(series.index)}"/>`,label,v,unit,series.index,i,series.name);
      });
    });return svgWrap(plot,data.title,width,height,'horizontal');
  }
  let plot=axes({...data,unit:variant==='percent'?'%':unit},min,max,data.labels,!isLine&&!isArea,g),valueLabels='';
  if(isLine||isArea) {
    const totals=data.labels.map((_,i)=>visible.reduce((sum,s)=>sum+Math.max(0,s.values[i]??0),0));
    let positives=data.labels.map(()=>0),negatives=data.labels.map(()=>0);
    visible.forEach(series=>{
      const values=series.values.map((v,i)=>v==null?null:variant==='percent'?(totals[i]?v/totals[i]*100:0):v);
      const lows=values.map((v,i)=>stacked?(v<0?negatives[i]:positives[i]):0);
      const points=values.map((v,i)=>v==null?null:[x(i),y(v+lows[i])]);
      const mode=variant==='step'?'step':variant==='smooth'||isArea&&variant==='basic'?'smooth':'linear';
      if(isArea){
        const gradient=`${data.uid}-fill-${series.index}`;
        if(variant==='gradient')plot+=`<defs><linearGradient id="${gradient}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color(series.index)}" style="stop-opacity:var(--chart-gradient-start,.24)"/><stop offset="1" stop-color="${color(series.index)}" style="stop-opacity:var(--chart-gradient-end,.02)"/></linearGradient></defs>`;
        plot+=`<path class="dds-chart-area${stacked?' dds-chart-area--stacked':''}" d="${areaFill(points,lows,x,y,mode)}" fill="${variant==='gradient'?`url(#${gradient})`:color(series.index)}" style="fill-opacity:${variant==='gradient'?'1':stacked?'var(--chart-area-stacked-opacity,.14)':'var(--chart-area-opacity,.1)'}"/>`;
      }
      plot+=`<path class="dds-chart-series-line" data-series="${series.index}" d="${segmentedPath(points,mode)}" fill="none" stroke="${color(series.index)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
      points.forEach((point,i)=>{if(!point)return;plot+=datum(`<circle class="dds-chart-point-hit" cx="${point[0]}" cy="${point[1]}" r="12"/><circle class="dds-chart-point${variant==='dots'||n===1?' is-always-visible':''}" cx="${point[0]}" cy="${point[1]}" r="4" fill="${color(series.index)}" stroke="var(--background)" stroke-width="2"/>`,data.labels[i],series.values[i],unit+(variant==='percent'?` (${percentText(values[i])})`:''),series.index,i,series.name);});
      if(stacked)values.forEach((v,i)=>{if(v!=null){if(v<0)negatives[i]+=v;else positives[i]+=v;}});
    });
  } else {
    const band=g.span/Math.max(1,n),barWidth=stacked?Math.min(48,band*.6):Math.min(48,Math.max(8,(band-16)/perSeries-4)),groupWidth=stacked?barWidth:perSeries*(barWidth+4)-4;
    data.labels.forEach((label,i)=>{
      let positive=0,negative=0;
      const topPositive=visible.filter(s=>(s.values[i]??0)>0).at(-1)?.index,topNegative=visible.filter(s=>(s.values[i]??0)<0).at(-1)?.index;
      visible.forEach(series=>{
        const v=series.values[i];if(v==null)return;
        const start=stacked?(v<0?negative:positive):0,end=start+v;
        const j=series.index,bx=x(i)-groupWidth/2+(stacked?0:j*(barWidth+4)),by=y(end),bottom=y(start);
        const outer=!stacked||(v<0?series.index===topNegative:series.index===topPositive),edge=outer?(v<0?'bottom':'top'):'none';
        plot+=datum(`<path class="dds-chart-bar${stacked?' dds-chart-bar--stacked':''}" d="${roundedBar(bx,Math.min(by,bottom),barWidth,Math.abs(bottom-by),edge)}" fill="${color(series.index)}"/>`,label,v,unit,series.index,i,series.name);
        if(variant==='labels'||variant==='negative')valueLabels+=svgText(bx+barWidth/2,v<0?by+20:by-10,(v>0&&variant==='negative'?'+':'')+num(v),`text-anchor="middle" class="dds-chart-value" data-chart-tick="${i*perSeries+j}"`);
        if(v<0)negative=end;else positive=end;
      });
    });
  }
  if(valueLabels)plot+=`<g data-chart-axis="values" aria-hidden="true">${valueLabels}</g>`;
  return svgWrap(plot,data.title,g.width,g.height);
}
function wrapText(value,limit=18){
  const chars=Array.from(String(value)),lines=[];for(let i=0;i<chars.length;i+=limit)lines.push(chars.slice(i,i+limit).join(''));return lines.length?lines:[''];
}
function estimatedWidth(value){return Array.from(String(value)).reduce((sum,char)=>sum+(char.codePointAt(0)>255?12:7),0);}
function textLines(x,y,lines,extra='') {return `<text x="${x}" y="${y-(lines.length-1)*7}" ${extra}>${lines.map((text,index)=>`<tspan x="${x}" dy="${index?16:0}">${esc(text)}</tspan>`).join('')}</text>`;}

function circlePoint(cx,cy,r,angle) {const radians=(angle-90)*Math.PI/180;return [cx+r*Math.cos(radians),cy+r*Math.sin(radians)];}
function arcPath(cx,cy,r,start,end) {const a=circlePoint(cx,cy,r,start),b=circlePoint(cx,cy,r,end);return `M ${a[0]} ${a[1]} A ${r} ${r} 0 ${end-start>180?1:0} 1 ${b[0]} ${b[1]}`;}
function circular(id,variant,data,hidden) {
  const visible=data.labels.map((label,index)=>({label,index,value:data.series[0].values[index]})).filter(item=>!hidden.has(item.index)&&item.value>0);
  const total=positiveTotal(visible.map(item=>item.value)),cx=180,cy=150;
  if(!total)return svgWrap(svgText(cx,cy,'표시할 값이 없습니다.','text-anchor="middle"'),data.title,360,300,'circular');
  let plot='',angle=0;const labels=[];
  for(const item of visible){
    const portion=item.value/total,sweep=portion*359.9999,end=angle+sweep,gap=Math.min(1,sweep/4);
    const mark=id==='pie-chart'?`<path class="dds-chart-slice" d="M ${cx} ${cy} L ${circlePoint(cx,cy,108,angle).join(' ')} ${arcPath(cx,cy,108,angle,end).replace(/^M [^A]+/,'')} Z" fill="${color(item.index)}" stroke="var(--background)" stroke-width="${sweep<3?.5:2}"/>`:`<path class="dds-chart-donut-segment" d="${arcPath(cx,cy,96,angle+gap,end-gap)}" fill="none" stroke="${color(item.index)}" stroke-width="24"/>`;
    plot+=datum(mark,item.label,item.value,`${data.unit} (${percentText(portion*100)})`,item.index,item.index,data.series[0].name);
    if(variant==='labels')labels.push({...item,portion,angle:angle+sweep/2});angle=end;
  }
  // Small slices remain in the graphic, tooltip, legend and table. Only the
  // external value labels are limited to the largest readable set.
  const named=labels.sort((a,b)=>b.value-a.value).slice(0,10);
  for(const side of [-1,1]){
    const items=named.filter(item=>Math.sin(item.angle*Math.PI/180)*side>=0).map(item=>({...item,y:circlePoint(cx,cy,130,item.angle)[1]})).sort((a,b)=>a.y-b.y);
    for(let i=0;i<items.length;i++)items[i].y=Math.max(i?items[i-1].y+24:24,items[i].y);
    const overflow=items.length?Math.max(0,items.at(-1).y-276):0;items.forEach(item=>item.y-=overflow);
    items.forEach(item=>{const point=circlePoint(cx,cy,112,item.angle),x=side>0?318:42;plot+=`<path class="dds-chart-grid" fill="none" d="M ${point[0]} ${point[1]} L ${side>0?306:54} ${item.y} L ${x} ${item.y}"/>`+svgText(x,item.y-4,percentText(item.portion*100),`text-anchor="${side>0?'end':'start'}" class="dds-chart-value"`);});
  }
  if(id==='donut-chart'&&variant==='total')plot+=svgText(cx,148,String(total).length>8?total.toExponential(2):num(total),`text-anchor="middle" class="dds-chart-total" aria-label="${esc(total+data.unit)}"`)+textLines(cx,177,wrapText(`합계 · ${data.unit}`,10),'text-anchor="middle" class="dds-chart-center-caption"');
  return svgWrap(plot,data.title,360,300,'circular');
}
function radar(variant,data,hidden) {
  const n=data.labels.length,wrapped=data.labels.map(label=>wrapText(label,16)),maxLines=Math.max(1,...wrapped.map(lines=>lines.length));
  const radius=Math.max(108,n*3.5),height=Math.max(320,radius*2+100,Math.ceil(n/2)*(maxLines*16+8)+48),sideSpace=Math.max(160,...wrapped.flat().map(text=>estimatedWidth(text)+24)),width=radius*2+sideSpace*2+48,cx=width/2,cy=height/2;
  const max=niceDomain(data.series.flatMap(series=>series.values).filter(value=>value>=0),data.unit==='점')[1];
  let plot='';
  for(let step=1;step<=4;step++)plot+=`<polygon class="dds-chart-grid" fill="none" points="${data.labels.map((_,i)=>circlePoint(cx,cy,radius*step/4,i*360/Math.max(1,n)).join(',')).join(' ')}"/>`;
  const labelItems=[];
  data.labels.forEach((label,i)=>{const angle=i*360/Math.max(1,n),point=circlePoint(cx,cy,radius,angle),target=circlePoint(cx,cy,radius+20,angle);plot+=line(cx,cy,...point);labelItems.push({index:i,point,target,right:target[0]>=cx});});
  for(const right of [false,true]){
    const items=labelItems.filter(item=>item.right===right).sort((a,b)=>a.target[1]-b.target[1]),gap=maxLines*16+8;
    items.forEach((item,i)=>{const py=Math.max(24+i*gap,Math.min(height-24-(items.length-1-i)*gap,item.target[1])),px=right?cx+radius+24:cx-radius-24;plot+=line(...item.point,px,py)+textLines(px+(right?6:-6),py,wrapped[item.index],`text-anchor="${right?'start':'end'}"`);});
  }
  plot+=svgText(cx+8,cy-radius-12,`0–${axisNumber(max)}`,'class="dds-chart-axis-tick"');
  data.series.forEach((series,j)=>{
    if(hidden.has(j))return;
    const points=series.values.map((v,i)=>v==null||v<0?null:circlePoint(cx,cy,radius*v/max,i*360/Math.max(1,n)));
    const complete=points.every(Boolean),d=segmentedPath(complete?[...points,points[0]]:points);
    plot+=`<path class="dds-chart-radar-area" data-series="${j}" d="${d}" fill="${complete?color(j):'none'}" style="fill-opacity:var(--chart-radar-opacity,.06)" stroke="${color(j)}" stroke-width="2" ${j?'stroke-dasharray="4 4"':''}/>`;
    points.forEach((point,i)=>{if(point)plot+=datum(`<circle class="dds-chart-point-hit" cx="${point[0]}" cy="${point[1]}" r="12"/><circle class="dds-chart-point" cx="${point[0]}" cy="${point[1]}" r="3.5" fill="${color(j)}" stroke="var(--background)" stroke-width="2"/>`,data.labels[i],series.values[i],data.unit,j,i,series.name);});
  });
  return svgWrap(plot,data.title,width,height,'radar');
}
function radial(variant,data,hidden) {
  const items=data.labels.map((label,index)=>({label,index,value:data.series[0].values[index],goal:data.goals?.[index]}));
  function ring(item,cx,cy,r){
    const valid=item.value!=null&&item.value>=0&&item.goal>0,ratio=valid?item.value/item.goal:0;
    let mark=`<circle class="dds-chart-radial-track" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--surface)" stroke-width="14"/>`;
    if(valid&&ratio>0)mark+=`<path class="dds-chart-radial-arc" d="${arcPath(cx,cy,r,0,Math.min(1,ratio)*359.9999)}" fill="none" stroke="${color(item.index)}" stroke-width="14" stroke-linecap="round"/>`;
    return datum(mark,item.label,item.value,`${data.unit} / 목표 ${item.goal??'없음'}${data.unit}${valid?` (${percentText(ratio*100)})`:''}`,item.index,item.index,data.series[0].name);
  }
  if(items.length>6)return `<div class="dds-chart-radial-multiples">${items.filter(item=>!hidden.has(item.index)).map(item=>`<div class="dds-chart-radial-item"><p>${esc(item.label)}</p>${svgWrap(ring(item,110,100,70)+svgText(110,106,item.value!=null&&item.value>=0&&item.goal>0?percentText(item.value/item.goal*100):'—','text-anchor="middle" class="dds-chart-total"'),item.label,220,200,'radial-item')}</div>`).join('')}</div>`;
  let plot='';items.forEach(item=>{if(!hidden.has(item.index))plot+=ring(item,170,150,112-item.index*18);});
  if(items.length===1&&!hidden.has(0)){const item=items[0],valid=item.value!=null&&item.value>=0&&item.goal>0;plot+=svgText(170,152,valid?percentText(item.value/item.goal*100):'—','text-anchor="middle" class="dds-chart-total"')+svgText(170,180,'목표 달성','text-anchor="middle" class="dds-chart-center-caption"');}
  return svgWrap(plot,data.title,340,300,'circular');
}
function scatter(data,hidden) {
  const xs=data.x||data.labels.map((_,i)=>i),[xMin,xMax]=niceDomain(xs),[yMin,yMax]=niceDomain(data.series.flatMap(series=>series.values),data.unit==='점'),g=geometry(0,{mini:data.mini});
  const xLabels=Array.from({length:5},(_,i)=>axisNumber(xMin+(xMax-xMin)*i/4)+(data.xUnit||''));
  let plot=axes(data,yMin,yMax,xLabels,false,g);
  data.series.forEach((series,j)=>{if(hidden.has(j))return;xs.forEach((value,i)=>{const yValue=series.values[i];if(value==null||yValue==null)return;const px=g.left+(value-xMin)/(xMax-xMin)*g.span,py=g.bottom-(yValue-yMin)/(yMax-yMin)*(g.bottom-g.top);plot+=datum(`<circle class="dds-chart-point-hit" cx="${px}" cy="${py}" r="12"/><circle class="dds-chart-point is-always-visible dds-chart-scatter-point" cx="${px}" cy="${py}" r="5" fill="${color(j)}" stroke="var(--background)" stroke-width="2"/>`,data.labels[i],yValue,data.unit,j,i,`${value}${data.xUnit||''}`);});});
  return svgWrap(plot,data.title,g.width,g.height);
}
function heatmap(data,seriesIndex=0) {
  const ms=86400000,dates=data.labels.map(label=>/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(label)?Date.parse(label.slice(0,10)+'T00:00:00Z'):NaN),calendar=dates.every(Number.isFinite)&&dates.length>0;
  const first=calendar?Math.min(...dates):0,start=calendar?first-((new Date(first).getUTCDay()+6)%7)*ms:0;
  const positions=data.labels.map((_,i)=>calendar?Math.round((dates[i]-start)/ms):i),weeks=Math.max(1,...positions.map(value=>Math.floor(value/7)+1)),left=46,step=Math.max(24,((data.mini?320:600)-76)/weeks),cell=Math.min(40,step-6),width=Math.max(data.mini?320:600,left+weeks*step+24),height=320;
  const finite=data.series[0].values.filter(Number.isFinite),low=Math.min(0,...finite),high=Math.max(0,...finite),range=high-low||1;
  let plot='';['월','화','수','목','금','토','일'].forEach((day,i)=>{plot+=svgText(24,58+i*28,day,'text-anchor="middle"');});
  plot+='<g data-chart-axis="x">';for(let week=0;week<weeks;week++){const index=positions.findIndex(pos=>Math.floor(pos/7)===week);if(index<0)continue;const label=calendar?new Date(start+week*7*ms).toISOString().slice(5,10).replace('-','/'):data.labels[index];plot+=svgText(left+week*step,22,label,`text-anchor="${week===0?'start':week===weeks-1?'end':'middle'}" data-chart-tick="${week}"`);}plot+='</g>';
  data.series[0].values.forEach((value,i)=>{const pos=positions[i],x=left+Math.floor(pos/7)*step,y=40+(pos%7)*28,opacity=value==null?0:value===0&&low===0?1:.18+(value-low)/range*.72,style=value==null?'fill="none" stroke="var(--text-tertiary)" stroke-dasharray="3 2"':`fill="${value===0&&low===0?'var(--surface)':color(seriesIndex)}" fill-opacity="${opacity}"`;plot+=datum(`<rect class="dds-chart-heat-cell" x="${x}" y="${y}" width="${cell}" height="22" rx="4" ${style}/>${value==null?line(x+cell/2-4,y+11,x+cell/2+4,y+11,'dds-chart-missing'):''}`,data.labels[i],value,data.unit,seriesIndex,i,data.series[0].name);});
  plot+=svgText(left,274,`${axisNumber(low)}${data.unit}`);
  for(let i=0;i<=5;i++)plot+=`<rect x="${left+58+i*24}" y="259" width="18" height="18" rx="3" fill="${i===0&&low===0?'var(--surface)':color(seriesIndex)}" fill-opacity="${i===0&&low===0?1:.18+i/5*.72}"/>`;
  plot+=svgText(left+210,274,`${axisNumber(high)}${data.unit}`)+svgText(left,306,'점선: 기록 없음','text-anchor="start"');return svgWrap(plot,data.title,width,height,'heatmap');
}

function legendItems(id,data) {
  if(['pie-chart','donut-chart','radial-chart'].includes(id))return data.labels.map((name,index)=>({name,index,value:data.series[0].values[index],goal:data.goals?.[index]}));
  return data.series.map((series,index)=>({name:series.name,index}));
}
function legend(id,data,hidden) {
  const items=legendItems(id,data),values=['pie-chart','donut-chart','radial-chart'].includes(id);
  return `<div class="dds-chart-legend${values?' dds-chart-legend--values':''}${items.length>12?' dds-chart-legend--dense':''}" role="group" aria-label="표시할 데이터">${items.map(item=>`<button type="button" data-chart-legend="${item.index}" aria-pressed="${!hidden.has(item.index)}"><span class="dds-chart-key" style="--series:${color(item.index)}" data-series="${item.index}" aria-hidden="true"></span><span class="dds-chart-legend-label">${esc(item.name)}</span>${values?`<strong class="dds-chart-legend-value">${item.value==null?'기록 없음':esc(item.value)+esc(data.unit)}${item.goal!=null?` / ${esc(item.goal)}${esc(data.unit)}${item.goal>0&&item.value!=null?` · ${percentText(item.value/item.goal*100)}`:''}`:''}</strong>`:''}</button>`).join('')}</div>`;
}
function tableHTML(id,data,variant='') {
  const unit=rawUnit(data,variant),headings=['항목',...(data.x?[(data.xLabel||'가로축')+(data.xUnit?`(${data.xUnit})`:'')]:[]),...data.series.map(series=>series.name+(unit?`(${unit})`:'')),...(data.goals?[`목표${unit?`(${unit})`:''}`,'달성률']:[]),...(['pie-chart','donut-chart'].includes(id)?['비율']:[])];
  const total=positiveTotal(data.series[0].values),cell=value=>value==null?'기록 없음':esc(value);
  return `<div class="table-wrap"><table><caption class="sr-only">${esc(data.title)} 원본 데이터</caption><thead><tr>${headings.map(heading=>`<th scope="col">${esc(heading)}</th>`).join('')}</tr></thead><tbody>${data.labels.map((label,i)=>`<tr><th scope="row">${esc(label)}</th>${data.x?`<td>${cell(data.x[i])}</td>`:''}${data.series.map(series=>`<td>${cell(series.values[i])}</td>`).join('')}${data.goals?`<td>${cell(data.goals[i])}</td><td>${data.goals[i]>0&&data.series[0].values[i]!=null&&data.series[0].values[i]>=0?percentText(data.series[0].values[i]/data.goals[i]*100):'계산 불가'}</td>`:''}${['pie-chart','donut-chart'].includes(id)?`<td>${total>0&&data.series[0].values[i]!=null&&data.series[0].values[i]>=0?percentText(data.series[0].values[i]/total*100):'계산 불가'}</td>`:''}</tr>`).join('')}</tbody></table></div>${['pie-chart','donut-chart'].includes(id)?'<p class="dds-chart-note">비율은 양수 항목의 합계를 기준으로 계산하며 반올림으로 합계가 100%와 다를 수 있습니다.</p>':''}`;
}
function chartMarkup(id,variant,uid,hidden=new Set(),mini=false,source) {
  const data={...prepareData(source??chartData(id,variant)),uid,mini},warnings=[];
  const circularChart=['pie-chart','donut-chart'].includes(id),negative=data.series.some(series=>series.values.some(value=>value<0));
  if(circularChart&&hidden.size){const total=positiveTotal(data.series[0].values.filter((_,i)=>!hidden.has(i))),whole=positiveTotal(data.series[0].values);warnings.push(`표시 항목 ${total}${data.unit}를 100%로 계산 · 원본 표는 전체 ${whole}${data.unit} 기준`);}
  if(circularChart&&negative)warnings.push('음수는 원형 비율에서 제외합니다. 원본 값은 표에서 확인하고 증감 비교에는 막대 차트를 사용하세요.');
  if(circularChart&&variant==='labels'&&data.labels.length>10)warnings.push('작은 조각의 수치와 항목명은 범례·툴팁·원본 표에서 확인할 수 있습니다.');
  if(id==='area-chart'&&variant==='percent')warnings.push('표시한 항목의 주별 합계를 100%로 계산 · 원본 표에는 실제 값 표시');
  if(id==='radar-chart'&&negative)warnings.push('레이더 차트는 0 이상의 값을 표시합니다. 음수 비교에는 막대 차트를 사용하세요.');
  if(id==='radar-chart'&&data.labels.length>12)warnings.push('축이 많은 경우 항목별 비교는 가로 막대나 원본 표가 더 명확합니다.');
  if(id==='radial-chart'&&data.labels.length>6)warnings.push('목표가 많아 각 항목의 원호를 나누어 표시합니다.');
  if((circularChart||id==='radial-chart')&&data.series.length>1)warnings.push('이 차트는 첫 번째 계열을 표시합니다. 다른 계열의 원본 값은 표에서 확인할 수 있습니다.');
  if(id==='radial-chart'&&data.labels.some((_,i)=>!(data.goals?.[i]>0)||data.series[0].values[i]<0))warnings.push('목표는 0보다 크고 현재 값은 0 이상이어야 달성률을 계산할 수 있습니다.');
  if(id==='radial-chart'&&data.labels.some((_,i)=>data.series[0].values[i]>data.goals?.[i]))warnings.push('100%를 초과한 달성률은 수치로 표시하며 원호는 한 바퀴까지 채웁니다.');
  const empty=legendItems(id,data).every(item=>hidden.has(item.index)),noData=!data.labels.length||!data.series.some(series=>series.values.some(value=>value!=null));
  let plot;
  if(noData)plot='<div class="dds-chart-no-series"><p>표시할 데이터가 없습니다.</p></div>';
  else if(empty)plot='<div class="dds-chart-no-series"><p>표시할 데이터를 선택해 주세요.</p></div>';
  else if(variant==='percent'&&negative)plot='<div class="dds-chart-no-series"><p>100% 누적에는 0 이상의 값을 사용해 주세요. 원본 값은 표에서 확인할 수 있습니다.</p></div>';
  else plot=circularChart?circular(id,variant,data,hidden):id==='radar-chart'?radar(variant,data,hidden):id==='radial-chart'?radial(variant,data,hidden):id==='scatter-chart'?scatter(data,hidden):id==='heatmap-chart'?data.series.length===1?heatmap(data):`<div class="dds-chart-heatmap-series">${data.series.map((series,index)=>hidden.has(index)?'':`<section><h4>${esc(series.name)}</h4>${heatmap({...data,series:[series]},index)}</section>`).join('')}</div>`:cartesian(id,variant,data,hidden);
  const note=[data.note,...warnings].filter(text=>String(text??'').trim()).join(' · ');
  return `${!mini?`<div class="dds-chart-heading"><h3>${esc(data.title)}</h3>${data._supplied?'':'<span>예제 데이터</span>'}</div>`:''}<div class="dds-chart-plot" ${!mini&&note?`aria-describedby="${uid}-note"`:''}>${plot}</div>${!mini?`${legend(id,data,hidden)}${note?`<p class="dds-chart-note" id="${uid}-note">${esc(note)}</p>`:''}`:''}`;
}

/** Optional suppliedData uses the same shape as chartData(); every view shares it. */
export function chartDemo(id,uid,mini=false,suppliedData) {
  const presentation=chartPresentation(id);
  if(id!=='chart'&&!presentation)return null;
  const key=String(uid||'dds-chart').replace(/[^a-zA-Z0-9_-]/g,'-');
  if(id==='chart'){
    if(mini)return `<div class="dds-chart-example dds-chart-example--mini">${chartMarkup('bar-chart','horizontal',key,new Set(),true,suppliedData)}</div>`;
    return `<div class="dds-chart-overview"><div class="dds-chart-type-grid">${chartComponents.map(component=>`<a href="#/components/${component.id}"><strong>${esc(component.name)}</strong><span>${esc(component.ko)}</span></a>`).join('')}</div>${chartDemo('bar-chart',key+'-example',false,suppliedData)}<div class="dds-chart-guidance"><h3>차트 선택</h3><p>크기는 막대, 변화는 선·영역, 구성 비율은 파이·도넛, 평가 항목은 레이더, 목표 달성은 방사형으로 표시합니다. 두 수치의 관계는 산점도, 날짜별 활동은 히트맵을 사용합니다.</p><p>숫자 0, 데이터 없음, 불러오는 중, 요청 실패는 서로 다른 상태로 표시합니다.</p></div></div>`;
  }
  const {family,variant}=presentation,source={...prepareData(suppliedData??chartData(family,variant)),_supplied:suppliedData!==undefined};
  if(mini){const dense=(family==='heatmap-chart'?source.labels.length>84:source.labels.length>12||source.series.length>4)||source.labels.some(label=>estimatedWidth(label)>180);return `<div class="dds-chart-example dds-chart-example--mini" data-chart-dense="${dense}">${chartMarkup(family,variant,key,new Set(),true,source)}</div>`;}
  const json=JSON.stringify(source).replace(/</g,()=>String.fromCharCode(92)+'u003c').replace(/&/g,()=>String.fromCharCode(92)+'u0026');
  return `<div class="dds-chart-example" data-chart-component="${presentation.component.id}" data-chart-example="${family}" data-chart-variant="${variant}" data-chart-uid="${key}"><script type="application/json" data-chart-source>${json}</script><div data-chart-content>${chartMarkup(family,variant,key,new Set(),false,source)}</div><div class="dds-chart-tooltip" id="${key}-tooltip" role="tooltip" hidden></div><details class="dds-chart-data"><summary>원본 데이터 보기</summary><div data-chart-table>${tableHTML(family,source,variant)}</div></details>${family==='chart-tooltip'?'<p class="dds-chart-note">마우스·키보드 포커스·터치로 같은 항목의 계열별 수치를 확인할 수 있습니다.</p>':''}</div>`;
}

const chartBindings = new WeakMap();
const chartRootBindings = new WeakMap();
export function bindCharts(root=document) {
  if(!root?.querySelectorAll)return ()=>{};
  chartRootBindings.get(root)?.();
  const cleanups=[],stopLayout=bindChartLayout(root);
  const examples=[...root.querySelectorAll('[data-chart-example]')];
  if(root.matches?.('[data-chart-example]'))examples.unshift(root);
  examples.forEach(example=>{
    if(chartBindings.has(example))return;
    example.dataset.chartBound='true';
    const controller=new AbortController(),options={signal:controller.signal},doc=example.ownerDocument;
    const id=example.dataset.chartExample,uid=example.dataset.chartUid,hidden=new Set();
    const variant=example.dataset.chartVariant;
    let supplied;
    try{supplied=JSON.parse(example.querySelector('[data-chart-source]')?.textContent||'null');}catch{supplied=null;}
    const data=prepareData(supplied??chartData(id,variant));
    let tooltipTimer=0;
    const tooltip=example.querySelector('.dds-chart-tooltip');
    function closeTip(){clearTimeout(tooltipTimer);tooltip.hidden=true;}
    function update(){
      closeTip();
      example.querySelector('[data-chart-content]').innerHTML=chartMarkup(id,variant,uid,hidden,false,data);
      example.querySelector('[data-chart-table]').innerHTML=tableHTML(id,data,variant);
    }
    function showTip(point){
      if(!point)return;
      clearTimeout(tooltipTimer);
      function row(name,value,unit,series,missing=false){
        const wrapper=doc.createElement('span');
        wrapper.className='dds-chart-tooltip-row';
        const marker=doc.createElement('span');
        marker.className='dds-chart-key dds-chart-tooltip-marker';
        marker.style.setProperty('--series',color(series));
        marker.setAttribute('aria-hidden','true');
        const label=doc.createElement('span');
        label.className='dds-chart-tooltip-label';
        label.textContent=name;
        const number=doc.createElement('strong');
        number.className='dds-chart-tooltip-value';
        number.textContent=missing?'기록 없음':`${value}${unit}`;
        wrapper.append(marker,label,number);
        return wrapper;
      }
      const heading=doc.createElement('strong');
      heading.className='dds-chart-tooltip-title';
      heading.textContent=point.dataset.chartLabel;
      if(id==='chart-tooltip'){
        const index=Number(point.dataset.chartIndex);
        tooltip.replaceChildren(heading,...data.series.flatMap((series,i)=>hidden.has(i)?[]:[row(series.name,series.values[index]==null?'':String(series.values[index]),rawUnit(data,variant),i,series.values[index]==null)]));
      }else{
        const series=Number(point.dataset.chartSeries);
        const name=id==='scatter-chart'?data.series[series]?.name:point.dataset.chartName||data.series[series]?.name||data.series[0].name;
        if(id==='scatter-chart')heading.textContent+=` · ${data.xLabel||'가로축'} ${point.dataset.chartName}`;
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
    },options);
    example.addEventListener('pointerover',event=>showTip(event.target.closest('[data-chart-point]')),options);
    example.addEventListener('pointerout',event=>{if(event.target.closest('[data-chart-point]')&&!event.relatedTarget?.closest?.('[data-chart-point]'))tooltipTimer=setTimeout(closeTip,180);},options);
    tooltip.addEventListener('pointerenter',()=>clearTimeout(tooltipTimer),options);
    tooltip.addEventListener('pointerleave',closeTip,options);
    example.addEventListener('focusin',event=>showTip(event.target.closest('[data-chart-point]')),options);
    example.addEventListener('focusout',closeTip,options);
    example.addEventListener('keydown',event=>{if(event.key==='Escape'&&!tooltip.hidden){event.preventDefault();event.stopPropagation();closeTip();}},options);
    const cleanup=()=>{controller.abort();closeTip();if(chartBindings.get(example)===cleanup){chartBindings.delete(example);delete example.dataset.chartBound;}};
    chartBindings.set(example,cleanup);cleanups.push(cleanup);
  });
  let disposed=false;
  const cleanup=()=>{if(disposed)return;disposed=true;cleanups.forEach(stop=>stop());stopLayout();if(chartRootBindings.get(root)===cleanup)chartRootBindings.delete(root);};
  chartRootBindings.set(root,cleanup);
  return cleanup;
}
