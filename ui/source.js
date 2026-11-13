import {renderCore,coreParts,coreIds} from './core.js?v=37572f4be3f4fe6a';
import {renderExtended,extendedParts} from './extended.js?v=37572f4be3f4fe6a';
import {chartDemo} from './charts.js?v=37572f4be3f4fe6a';
import {chartComponents,chartPresentation} from '../chart-catalog.js?v=37572f4be3f4fe6a';

export const componentIds=Object.freeze([...coreIds,...Object.keys(extendedParts),'chart',...chartComponents.map(c=>c.id)]);
export const isChart=id=>id==='chart'||!!chartPresentation(id);
export function renderComponentSource(id,uid='dds-instance',mini=false,data){
 if(coreIds.includes(id))return renderCore(id,uid,mini);
 if(Object.hasOwn(extendedParts,id))return renderExtended(id,uid,mini);
 if(isChart(id))return chartDemo(id==='chart'?'bar-chart':id,uid,mini,data);
 throw new TypeError('Unknown DDS component: '+id);
}
export const hookMappings={
 'data-demo-tab':'data-dds-tab','data-chip':'data-dds-toggle','data-page':'data-dds-page',
 'data-counter':'data-dds-counter','data-file':'data-dds-file','data-demo-search':'data-dds-search',
 'data-ext-toggle':'data-dds-toggle','data-ext-password':'data-dds-password',
 'data-ext-menu':'data-dds-menu','data-ext-command-search':'data-dds-command-search',
 'data-ext-popover':'data-dds-popover','data-ext-hover':'data-dds-hover',
 'data-ext-dialog':'data-dds-dialog','data-ext-close':'data-dds-close','data-ext-confirm':'data-dds-confirm',
 'data-popover-close':'data-dds-popover-close','data-ext-slider':'data-dds-slider',
 'data-ext-otp':'data-dds-otp','data-calendar-date':'data-dds-calendar-date',
 'data-month-shift':'data-dds-month-shift','data-ext-calendar':'data-dds-calendar',
 'data-page-shift':'data-dds-page-shift','data-ext-dot':'data-dds-dot',
 'data-ext-topnav-toggle':'data-dds-topnav-toggle','data-ext-topnav-panel':'data-dds-topnav-panel',
 'data-ext-topnav':'data-dds-topnav','data-thread-bottom':'data-dds-thread-bottom',
 'data-ext-status':'data-dds-status',
 'data-ext-context':'data-dds-context','data-ext-time':'data-dds-time',
 'data-ext-filter-result':'data-dds-filter-result','data-ext-thread':'data-dds-thread',
 'data-ext-pager':'data-dds-pager','data-ext-questionnaire':'data-dds-questionnaire',
 'data-ext-form':'data-dds-form','data-ext-validate':'data-dds-validate',
 'data-question-next':'data-dds-question-next','data-question-back':'data-dds-question-back',
 'data-ext-category':'data-dds-category',
 'data-snack-undo':'data-dds-snack-undo','data-snack-close':'data-dds-snack-close','data-snack-show':'data-dds-snack-show'
};
export const classMappings={'dds-demo':'dds-component'};
export const layoutContract=Object.freeze({
 hostOwns:['available-width','grid-placement','outer-spacing','allocated-scroll-height'],
 componentOwns:['control-size','typography','internal-padding','border','radius','state','intrinsic-parts'],
 sizingSource:'component-layout.css',
 compiledInto:'ui/dds.css',
 specimenStylesIncluded:false,
 scrollVariables:{height:'--dds-scroll-height',maxHeight:'--dds-scroll-max-height'}
});
const documentOnlyClasses=new Set(['dds-demo--centered']);
const hooks=hookMappings;
const actions=new Set(['data-toast','data-dialog','data-copy','data-ext-notice','data-ext-command','data-ext-retry','data-ext-filter','data-ext-filter-reset','data-attachment-remove','data-attachment-restore','data-thread-add','data-question-next','data-question-back','data-carousel-shift','data-ext-category','data-snack-undo','data-snack-close','data-snack-show']);
export function serviceMarkup(markup){
 return markup.replace(/<[^>]+>/g,tag=>tag.replace(/\s([a-zA-Z_:][a-zA-Z0-9_:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g,(whole,name,double,single,bare)=>{
  const value=double??single??bare;
  if(name==='class'){
   const classes=value.split(/\s+/).filter(token=>token&&!documentOnlyClasses.has(token)).map(token=>classMappings[token]||token);
   return classes.length?` class="${classes.join(' ')}"`:'';
  }
  if(hooks[name])return ' '+hooks[name]+(value===undefined?'':`="${value}"`);
  if(actions.has(name))return ` data-dds-action="${name.slice(5)}"`+(value?` data-dds-action-value="${value}"`:'');
  if(/^data-button-(?:doc|loading)/.test(name))return '';
  if(name==='href'&&/^(?:#\/(?:patterns|components)|\/prototypes\/)/.test(value||''))return ' href="#"';
  return whole;
 }));
}
export function componentParts(id){
 const parts=coreParts[id]||extendedParts[id]||(isChart(id)?{
  title:{selector:'.dds-chart-heading h3',kind:'text'},
  note:{selector:'.dds-chart-note',kind:'text'},
  control:{selector:'.dds-chart-example',kind:'attributes',attributes:['aria-label']}
 }:null);
 if(!parts)throw new TypeError('Unknown DDS component: '+id);
 return Object.fromEntries(Object.entries(parts).map(([name,part])=>[name,{...part,selector:Object.entries(hooks).reduce((s,[from,to])=>s.replaceAll(from,to),part.selector).replace(/\.dds-demo(?![a-zA-Z0-9_-])/g,'.dds-component')} ]));
}
