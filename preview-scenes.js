import {calendarDays} from './ui/extended.js?v=189cfecb45f30e1e';
import {chartData} from './ui/charts.js?v=189cfecb45f30e1e';
import {secondaryThumbnail} from './preview-states.js?v=189cfecb45f30e1e';

// Documentation thumbnails use a logical scene, never the gallery card as a device.
// These are presentation widths; no service component or breakpoint is changed.
const widths=Object.freeze({
  button:320,'icon-button':240,checkbox:320,radio:280,switch:320,
  chip:440,tabs:400,breadcrumb:440,pagination:400,stepper:520,sidebar:280,
  avatar:440,card:360,table:640,alert:440,empty:360,
  'action-area':440,'button-group':360,'toggle-group':280,'filter-button':400,
  calendar:320,'segmented-control':400,'framed-style':440,'time-picker':360,
  'top-navigation':960,'bottom-navigation':400,category:440,command:400,
  snackbar:480,'aspect-ratio':400,'play-badge':400,'list-card':440,attachment:480,
  carousel:400,resizable:480,'scroll-area':360,'message-scroller':440,
});

export function thumbnailSceneWidth(id){
  return widths[id]||(id==='chart'||id?.includes('chart')||id==='contributions'?640:360);
}

/** The complete scene fits both axes. There is no lower scale that can clip it. */
export function fitThumbnailScene(availableWidth,availableHeight,sceneWidth,sceneHeight){
  const dimensions=[availableWidth,availableHeight,sceneWidth,sceneHeight];
  if(!dimensions.every(value=>Number.isFinite(value)&&value>0))return null;
  const scale=Math.min(1,availableWidth/sceneWidth,availableHeight/sceneHeight);
  return {scale,width:sceneWidth*scale,height:sceneHeight*scale};
}
const expanded=markup=>markup.replace('aria-expanded="false"','aria-expanded="true"');
const openDetails=markup=>markup.replace(/<details(?![^>]*\bopen\b)/,'<details open');
const openPanel=markup=>markup.replace(/<div\b[^>]*class="dds-(?:command|popover|menu)"[^>]*>/,tag=>tag.replace(/\s(?:popover="(?:auto|manual)"|hidden)(?=[\s>])/g,''));

function choicePanel(options,selected,icon){
  return `<div class="dds-gallery-popup control-popup select-popup" role="listbox">${options.map((label,index)=>`<button type="button" class="custom-option" role="option" aria-selected="${index===selected}"><span>${label}</span>${index===selected?icon('Check'):''}</button>`).join('')}</div>`;
}

function calendarPanel(icon){
  const days=calendarDays(2026,8,'2026-09-16')
    .replace(/ data-calendar-date="[^"]+" aria-label="([^"]+)" aria-pressed="(true|false)"/g,' class="calendar-day" aria-label="$1" aria-selected="$2"')
    .match(/<span><\/span>|<button\b[^>]*>\d+<\/button>/g);
  const weeks=[];
  for(let i=0;i<days.length;i+=7)weeks.push(`<div class="calendar-row">${days.slice(i,i+7).join('')}</div>`);
  return `<div class="dds-gallery-popup control-popup calendar-popup"><div class="calendar-head"><button type="button" class="control-icon calendar-nav">${icon('ChevronLeft')}</button><b>2026년 9월</b><button type="button" class="control-icon calendar-nav">${icon('ChevronRight')}</button></div><div class="calendar-week">${['일','월','화','수','목','금','토'].map(day=>`<span>${day}</span>`).join('')}</div><div class="calendar-grid">${weeks.join('')}</div></div>`;
}

function overlayWindow(markup,id){
  const dialog=markup.match(/<dialog\b[\s\S]*?<\/dialog>/)?.[0];
  if(!dialog)return markup;
  const panel=dialog.replace('<dialog','<dialog open').replaceAll(' autofocus','').replace(/<p>(?:이곳은 디자인 시스템 안의 예제입니다\.[^<]*|이 동작은 확인 UI 예제이며[^<]*|현재 작업을 유지하며[^<]*)<\/p>/g,'');
  return id==='sheet'||id==='drawer'? `<div class="dds-gallery-window">${panel}</div>`:panel;
}

/** A static state from the component's own specimen, only for inert catalog cards. */
export function representativeThumbnail(id,markup,uid,icon){
  let scene;
  switch(id){
    case 'select':{
      const choices=['디자인','IT·전기·전자·통신','마케팅·광고·홍보'];
      const field=`<button type="button" class="custom-trigger" aria-expanded="true"><span>${choices[0]}</span>${icon('ChevronDown')}</button>`;
      scene=markup.replace(/<select\b[\s\S]*?<\/select>/,field+choicePanel(choices,0,icon));
      break;
    }
    case 'combobox':{
      const field=`<div class="custom-control custom-combo"><input id="${uid}" data-custom="true" value="디자이너" role="combobox" aria-expanded="true"><button type="button" class="control-icon">${icon('ChevronDown')}</button></div>`;
      scene=markup.replace(/<input\b[\s\S]*?<\/datalist><p class="helper">[^<]*<\/p>/,field+choicePanel(['프로덕트 디자이너','브랜드 디자이너','UX 디자이너'],-1,icon));
      break;
    }
    case 'date-picker':{
      const field=`<div class="custom-control custom-date"><input id="${uid}" data-custom="true" value="2026-09-16"><button type="button" class="control-icon" aria-expanded="true">${icon('CalendarDays')}</button></div>`;
      scene=markup.replace(/<input\b[^>]*>/,field+calendarPanel(icon));
      break;
    }
    case 'search':
      scene=markup.replace('type="search"','type="search" value="자기소개서" data-custom="true"')
        .replace('문서 제목을 입력해 검색 예제를 확인하세요.','자기소개서 3건');
      break;
    case 'dropdown':case 'navigation-menu':case 'collapsible':
      scene=openDetails(markup);
      break;
    case 'dialog':case 'alert-dialog':case 'sheet':case 'drawer':
      scene=overlayWindow(markup,id);
      break;
    case 'toast':
      scene=markup.replace(/<button\b[\s\S]*?<\/button>/,'')
        .replace(/class="dds-toast"([^>]*?) hidden>/,'class="dds-toast show"$1>')
        .replace('aria-hidden="true" hidden','aria-hidden="true"')
        .replace('data-dds-dismissible','data-dds-dismissible data-dds-tone="success"');
      break;
    case 'tooltip':
      scene=markup+`<div class="dds-icon-tooltip" role="tooltip">공백과 줄바꿈을 포함해 계산합니다.</div>`;
      break;
    case 'menubar':case 'context-menu':case 'command':case 'popover':case 'hover-card':
      scene=expanded(openPanel(markup));
      if(id==='command')scene=scene.replace('aria-selected="false"','aria-selected="true"');
      break;
    case 'pagination-dots':
      scene=markup.replace('<nav',`<div class="dds-ratio dds-gallery-slide"><div class="dds-ratio-placeholder">${icon('Layers')}<b>경험 정리 가이드</b></div></div><nav`)
        .replace(/<p class="helper" data-dot-result>[^<]*<\/p>/,'');
      break;
    case 'chart-tooltip-dot':{
      const data=chartData('chart-tooltip','multi'),index=2;
      const rows=data.series.map(({name,values},series)=>`<span class="dds-chart-tooltip-row"><i class="dds-chart-key dds-chart-tooltip-marker" style="--series:var(--chart-series-${series+1})"></i><span class="dds-chart-tooltip-label">${name}</span><strong class="dds-chart-tooltip-value">${values[index]}${data.unit}</strong></span>`).join('');
      const tooltip=`<div class="dds-chart-tooltip"><strong class="dds-chart-tooltip-title">${data.labels[index]}</strong>${rows}</div>`;
      scene=markup.replace(/<\/div>$/,`${tooltip}</div>`);
      break;
    }
    default:
      scene=secondaryThumbnail(id,markup,icon);
  }
  const staticScene=scene?.replace(/\sdata-(?:ext-menu|ext-popover|ext-hover|dds-command-search)(?:="[^"]*")?(?=[\s>])/g,'');
  return staticScene?`<div class="dds-gallery-state" data-gallery-state="${id}">${staticScene}</div>`:markup;
}
