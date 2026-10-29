import {$,$$,esc,icon,common,summary,modal,toast,load,save,sampleInfo,blankInfo} from './prototype-shared.js?v=5f538cf9e48c4250';
import {getDocument,documentInfo,updateDocument} from './document-store.js?v=5f538cf9e48c4250';
common();
const documentId=new URLSearchParams(location.search).get('document'),linkedDocument=getDocument(documentId);
const infoKey=linkedDocument?'info:'+documentId:'info';
let info=load(infoKey,linkedDocument?documentInfo(linkedDocument):sampleInfo);
function persistInfo(){if(linkedDocument)updateDocument(documentId,{title:info.title,job:info.job,industry:info.ind,companyType:info.cor,company:info.com});return save(infoKey,info);}
const choices={occ_checkbox:'job',ind_checkbox:'ind',cor_checkbox:'cor',exp_checkbox:'exp'};
const fields={m_title:'title',supportArea:'supportArea',comp_input:'com'};
function paint(){for(const [id,key] of Object.entries(fields))$('#'+id).value=info[key];for(const [name,key] of Object.entries(choices))$$(`[name="${name}"]`).forEach(e=>e.checked=e.dataset.id===info[key]);tags();summary(info);}
function tags(){$('#hashtag_list').innerHTML=info.hashtag.map((t,i)=>`<span class="u-tags-v1">${esc(t)}<button type="button" data-remove-tag="${i}" aria-label="${esc(t)} 삭제">${icon('X')}</button></span>`).join('');}
function clearErrors(){$$('[data-error]').forEach(e=>delete e.dataset.error);$$('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));}
for(const [name,key] of Object.entries(choices))$$(`[name="${name}"]`).forEach(e=>e.addEventListener('change',()=>{$$(`[name="${name}"]`).forEach(other=>{if(other!==e)other.checked=false;});info[key]=e.checked?e.dataset.id:'';clearErrors();summary(info);persistInfo();}));
for(const [id,key] of Object.entries(fields))$('#'+id).addEventListener('input',e=>{info[key]=e.target.value;clearErrors();summary(info);persistInfo();});
function addTag(){const value=$('#hashtagKeyword').value.trim();if(!value)return; if(info.hashtag.includes(value)){toast('이미 추가한 키워드입니다.');return;}info.hashtag.push(value);$('#hashtagKeyword').value='';tags();summary(info);persistInfo();$('#hashtagKeyword').focus();}
$('#hashtag_btn').addEventListener('click',addTag);$('#hashtagKeyword').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();addTag();}});$('#hashtag_list').addEventListener('click',e=>{const b=e.target.closest('[data-remove-tag]');if(!b)return;info.hashtag.splice(+b.dataset.removeTag,1);tags();summary(info);persistInfo();$('#hashtagKeyword').focus();});
function validate(draft){clearErrors();const checks=[['title','#m_title','자기소개서 제목을 입력해 주세요.'],['job','[name="occ_checkbox"]','직종을 선택해 주세요.'],...draft?[]:[['ind','[name="ind_checkbox"]','업종을 선택해 주세요.'],['cor','[name="cor_checkbox"]','기업형태를 선택해 주세요.'],['supportArea','#supportArea','지원 직무를 입력해 주세요.'],['exp','[name="exp_checkbox"]','경력을 선택해 주세요.']]];const fail=checks.find(([key])=>!info[key].trim());if(!fail)return true;const [,selector,message]=fail,e=$(selector);e.setAttribute('aria-invalid','true');const group=e.closest('.form-group:not(.row)');if(group)group.dataset.error=message;e.scrollIntoView({block:'center',behavior:'smooth'});e.focus({preventScroll:true});toast(message);return false;}
for(const id of ['draft_btn','m_draft_btn'])$('#'+id).addEventListener('click',()=>{if(validate(true)&&persistInfo())toast('입력 내용을 임시저장했습니다.');});
for(const id of ['submit_btn','m_submit_btn'])$('#'+id).addEventListener('click',()=>{if(validate(false)&&persistInfo())location.href='./coverletter-write.html'+(linkedDocument?'?document='+encodeURIComponent(documentId):'');});
$('#title_suggest').addEventListener('click',()=>{
 const examples=['사용자의 문제를 발견하고, 더 나은 경험을 만드는 디자이너','데이터에서 답을 찾고 실행으로 증명하는 기획자','팀과 함께 성장하는 개발자, 문제 해결의 과정을 기록하다'];
 modal('제목 예시 보기','<p>예시를 선택하면 자기소개서 제목에 적용됩니다.</p><div class="title-examples">'+examples.map(title=>`<button type="button" class="example-title" data-title-example="${esc(title)}"><span>${esc(title)}</span>${icon('ArrowUpLeft')}</button>`).join('')+'</div>');
 $('#dialog-confirm').hidden=true;
});
$('#dialog-body').addEventListener('click',event=>{
 const example=event.target.closest('[data-title-example]');if(!example)return;
 info.title=example.dataset.titleExample;paint();clearErrors();persistInfo();
 $('#preview-dialog').addEventListener('close',()=>$('#m_title').focus(),{once:true});
 $('#preview-dialog').close();toast('선택한 예시를 제목에 적용했습니다.');
});
paint();
