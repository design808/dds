import {renderItemList} from './ui/extended.js?v=397886dd51872b8b';
import {renderButton} from './ui/button.js?v=397886dd51872b8b';
import {icon} from './ui/icons.js?v=397886dd51872b8b';
import {statusBadge} from './visibility.js?v=397886dd51872b8b';

const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeId=value=>String(value||'job-list').replace(/[^a-zA-Z0-9_-]/g,'-');
const jobs=[
 {id:'product-designer',title:'프로덕트 디자이너',company:'온결테크',location:'서울 성동구',experience:'경력 3년 이상',employment:'정규직',deadline:'D-12',description:'사용자의 문제를 발견하고 제품의 주요 화면과 사용 흐름을 설계합니다. 기획자, 개발자와 함께 설계한 경험을 개선해 나갑니다.'},
 {id:'frontend-engineer',title:'프론트엔드 개발자',company:'브릭온랩',location:'서울 강남구',experience:'경력 2~6년',employment:'정규직',deadline:'D-7',description:'웹 서비스의 화면과 인터랙션을 구현합니다. 공통 컴포넌트와 성능을 개선하고 다양한 기기에서 안정적으로 동작하는 경험을 만듭니다.'},
 {id:'brand-marketer',title:'브랜드 마케터',company:'나란컴퍼니',location:'경기 성남시',experience:'신입·경력',employment:'정규직',deadline:'D-19',description:'서비스를 사용하는 사람과 시장을 이해하고 브랜드 메시지를 전달합니다. 캠페인을 기획하고 채널별 콘텐츠와 운영 결과를 살펴봅니다.'},
 {id:'data-analyst',title:'데이터 분석가',company:'온결테크',location:'서울 성동구',experience:'경력 3~7년',employment:'정규직',deadline:'채용 시 마감',description:'서비스 데이터를 분석해 제품의 의사결정을 돕습니다. 지표의 정의와 분석 과정을 정리하고 발견한 내용을 팀에 전달합니다.'},
 {id:'service-planner',title:'서비스 기획자',company:'모은스튜디오',location:'서울 마포구',experience:'경력 2년 이상',employment:'정규직',deadline:'D-3',urgent:true,description:'고객과 운영 현장의 요구를 바탕으로 서비스 정책과 기능을 설계합니다. 문제의 우선순위를 정하고 배포 이후의 사용 흐름까지 확인합니다.'},
 {id:'customer-experience',title:'고객 경험 매니저',company:'브릭온랩',location:'부산 해운대구',experience:'신입·경력',employment:'정규직',deadline:'상시 채용',description:'고객의 문의를 해결하고 반복되는 불편을 찾아 서비스 개선으로 연결합니다. 고객 안내와 내부 운영 과정을 함께 정리합니다.'}
];
export const listBlocks=[{id:'job-list',title:'채용 공고 목록',category:'workspace',components:['item','badge','icon-button']}];

function bookmark(job,saved=false){
 const label=job.title+' 공고 '+(saved?'저장 취소':'저장');
 return renderButton({label,before:saved?'BookmarkCheck':'Bookmark',iconOnly:true,variant:'outlined',color:saved?'primary':'assistive',size:'md',attributes:{'aria-pressed':String(saved),'data-tooltip':label,'data-dbl-bookmark':job.id}});
}

/** Rows only: the document component page and block gallery share this example. */
export function renderJobListExample(prefix='jobs'){
 const uid=safeId(prefix);
 const items=jobs.map(job=>({title:job.title,href:'#/blocks?block=job-list&job='+job.id,metadata:[job.company,job.location,job.experience,job.employment].join(' · '),chevron:false,slots:{leading:'',trailingInfo:job.urgent?statusBadge('error',job.deadline,icon):`<span class="dds-meta-secondary">${escapeHTML(job.deadline)}</span>`,actions:bookmark(job)}}));
 return `<div class="dds-ui" data-dds-component="item" data-dbl-example id="${uid}-jobs">${renderItemList(items,{appearance:'divided',label:'채용 공고 목록'})}</div>`;
}

export function renderListBlock(id,prefix='jobs'){
 if(id!=='job-list')return '';
 const uid=safeId(prefix);
 return `<section class="dbl-job-block" data-dbl-block="job-list" data-dbl-prefix="${uid}"><div data-dbl-list>${renderJobListExample(uid)}</div><section class="dbl-job-detail" data-dbl-detail hidden></section></section>`;
}

function renderJobDetail(job,uid,saved){
 return `<div class="dds-ui" data-dds-component="button">${renderButton({label:'공고 목록',before:'ArrowLeft',variant:'outlined',color:'assistive',size:'sm',attributes:{'data-dbl-back':''}})}</div><header class="db-header"><div class="db-stack"><h3 class="db-title" id="${uid}-detail-title" tabindex="-1">${escapeHTML(job.title)}</h3><p class="db-muted">${escapeHTML(job.company)}</p></div><div class="dds-ui" data-dds-component="icon-button">${bookmark(job,saved)}</div></header><dl class="dbl-job-facts">${[['근무 지역',job.location],['지원 경력',job.experience],['고용 형태',job.employment],['접수 기간',job.deadline]].map(([label,value])=>`<div><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl><p class="db-muted">${escapeHTML(job.description)}</p>`;
}

const bindings=new WeakMap();
export function bindListBlocks(root){
 if(!root?.querySelectorAll)return ()=>{};
 bindings.get(root)?.();
 const doc=root.ownerDocument,view=doc.defaultView,controller=new view.AbortController(),saved=new Set(),returnLinks=new WeakMap();
 const options={signal:controller.signal};
 function detail(block,job,link){
  const panel=block.querySelector('[data-dbl-detail]');if(!panel)return;
  if(link)returnLinks.set(block,link);
  panel.innerHTML=renderJobDetail(job,block.dataset.dblPrefix,saved.has(job.id));
  block.querySelector('[data-dbl-list]').hidden=true;panel.hidden=false;
  panel.setAttribute('aria-labelledby',block.dataset.dblPrefix+'-detail-title');
  panel.querySelector('h3').focus({preventScroll:true});
 }
 root.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-dbl-bookmark]');
  if(button&&root.contains(button)){
   event.preventDefault();event.stopPropagation();
   const job=jobs.find(item=>item.id===button.dataset.dblBookmark);if(!job)return;
   const selected=!saved.has(job.id);selected?saved.add(job.id):saved.delete(job.id);
   for(const control of root.querySelectorAll('[data-dbl-bookmark]'))if(control.dataset.dblBookmark===job.id){
    const label=job.title+' 공고 '+(selected?'저장 취소':'저장');
    control.setAttribute('aria-pressed',String(selected));control.setAttribute('aria-label',label);control.setAttribute('data-tooltip',label);control.dataset.color=selected?'primary':'assistive';
    control.querySelector('.dds-button-label').innerHTML=icon(selected?'BookmarkCheck':'Bookmark');
   }
   return;
  }
  const back=event.target.closest?.('[data-dbl-back]');
  if(back&&root.contains(back)){
   const block=back.closest('[data-dbl-block]');if(!block)return;
   block.querySelector('[data-dbl-detail]').hidden=true;block.querySelector('[data-dbl-list]').hidden=false;
   const link=returnLinks.get(block)||block.querySelector('.dds-list-link');link?.focus({preventScroll:true});return;
  }
  const link=event.target.closest?.('[data-dbl-example] .dds-list-link'),block=link?.closest('[data-dbl-block]');
  if(!block||!root.contains(block)||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button>0)return;
  const query=link.getAttribute('href').split('?')[1],job=jobs.find(item=>item.id===new URLSearchParams(query).get('job'));if(!job)return;
  event.preventDefault();event.stopPropagation();detail(block,job,link);
 },options);
 const initial=new URLSearchParams(view.location.hash.split('?')[1]||'').get('job');
 if(initial){const job=jobs.find(item=>item.id===initial);if(job)for(const block of root.querySelectorAll('[data-dbl-block="job-list"]'))detail(block,job);}
 const cleanup=()=>{controller.abort();if(bindings.get(root)===cleanup)bindings.delete(root);};bindings.set(root,cleanup);return cleanup;
}
