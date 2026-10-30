import {common,icons,icon,esc,toast,$} from './prototype-shared.js?v=345e8a902fcf721a';
common();
const dialog=$('#di-setup-dialog'),content=$('#di-setup-content'),next=$('#di-setup-next'),back=$('#di-setup-back');
let step='choice',origin;
const setup={mode:'cover',language:'ko',job:'선택안함',industry:'선택안함',corporation:'선택안함',company:'',department:'',career:'',topics:['지원동기','직무역량','협업경험'],documentTitle:'',interviewType:'standard',experience:''};
const radio=(name,values,value)=>`<div class="di-radio-row">${values.map(v=>`<label class="di-radio"><input type="radio" name="${name}" value="${esc(v)}" ${v===value?'checked':''}><span>${esc(v)}</span></label>`).join('')}</div>`;
const field=(label,id,placeholder,value='',required=false)=>`<label class="di-field" for="${id}"><span>${label}${required?' (필수)':''}</span><input id="${id}" name="${id}" value="${esc(value)}" placeholder="${placeholder}" autocomplete="off" ${required?'required':''}></label>`;
const jobs=['선택안함','경영·사무·금융','영업·고객상담','무역·유통','마케팅·광고·홍보','서비스','IT·전기·전자·통신','생산·제조·정비','연구개발·설계','토목·건설','디자인','의료','미디어·예술·스포츠','교육','전문·특수직','공공·사회봉사'];
const industries=['선택안함','서비스업','금융업','유통업','IT·전기·전자','제조업','건설업','교육업','의료·제약업','미디어·광고·홍보','문화·예술·디자인업','공공기관·협회'];
const corporations=['선택안함','대기업','중견기업','중소기업','공기업','외국계','금융권','스타트업'];
const selectedLabel=value=>value==='선택안함'?'선택 안 함':value;
const modes={cover:['FileText','DeepResume에 작성된 자소서 선택','작성한 자기소개서를 바탕으로 면접을 진행해요.'],basic:['SquarePen','자기소개서 없이 진행','지원직무와 관계있는 경험이나 자기소개를 직접 입력해요.'],company:['Building2','기업별 기출 면접문항 사용','지원 기업과 직무를 선택해 면접을 준비해요.']};
function render(){
 const index={choice:0,environment:1,job:2,content:3,type:4}[step];
 $('#di-setup-step').textContent=index?`면접 준비 ${index} / 4`:'';
 const title={choice:'확인해주세요.',environment:'면접환경 확인',job:'지원직무 선택',content:setup.mode==='cover'?'자기소개서 선택':setup.mode==='company'?'기업별 기출 면접문항':'경험·자기소개 입력',type:'면접 방식 선택'};
 $('#di-setup-title').textContent=title[step];
 back.hidden=step==='choice';next.hidden=step==='choice';dialog.querySelector('.di-dialog-actions').hidden=step==='choice';
 next.innerHTML=(step==='type'?'AI 면접 시작하기':'다음')+icon('ArrowRight');
 if(step==='choice')content.innerHTML=`<p class="di-dialog-description">DeepResume에 자소서를 등록한 후 면접을 진행하면 보다 질 높은 면접을 볼 수 있어요. 원하는 방법을 선택해 주세요.</p><div class="di-mode-list">${Object.entries(modes).map(([key,[glyph,label,help]])=>`<button type="button" class="di-mode-choice" data-mode="${key}" id="${key==='cover'?'interview_next_Btn':key==='basic'?'no_cover_btn':'company_btn'}"><span>${icon(glyph)}</span><span><strong>${label}</strong><small>${help}</small></span>${icon('ChevronRight')}</button>`).join('')}</div>`;
 if(step==='environment')content.innerHTML=`<p class="di-dialog-description">원활한 응시를 위해 카메라와 마이크를 확인할게요. 유의사항을 읽고 진행해 주세요.</p><div class="di-environment"><div class="di-camera-placeholder">${icon('ScanFace')}<p>얼굴을 화면 중앙에 맞춰주세요.</p></div><ul class="di-device-notes"><li>${icon('ScanFace')}<span>얼굴이 화면 가이드라인 안에 들어오도록 유의해 주세요.</span></li><li>${icon('Hand')}<span>손이나 물건으로 얼굴을 가리지 않도록 유의해 주세요.</span></li><li>${icon('AudioLines')}<span>말하는 소리가 잘 들리도록 주변 소음을 확인해 주세요.</span></li></ul></div>`;
 if(step==='job')content.innerHTML=`<div class="di-form"><div class="di-fields-row"><div class="di-field"><span id="di-job-label">직종</span><select id="di-job" name="checkSelectEg" aria-label="직종" aria-labelledby="di-job-label">${jobs.map(j=>`<option ${j===setup.job?'selected':''}>${j}</option>`).join('')}</select></div><div class="di-field"><span id="di-industry-label">업종</span><select id="di-industry" name="occ_checkbox" aria-label="업종" aria-labelledby="di-industry-label">${industries.map(j=>`<option ${j===setup.industry?'selected':''}>${j}</option>`).join('')}</select></div></div><div class="di-fields-row"><div class="di-field"><span id="di-corporation-label">기업형태</span><select id="di-corporation" name="cor_checkbox" aria-label="기업형태" aria-labelledby="di-corporation-label">${corporations.map(j=>`<option ${j===setup.corporation?'selected':''}>${j}</option>`).join('')}</select></div><fieldset class="di-field" style="margin:0;padding:0;border:0"><legend>경력 (필수)</legend>${radio('exp_checkbox',['신입','경력'],setup.career)}</fieldset></div><div class="di-fields-row">${field('기업명','companyName','기업명을 입력해 주세요.',setup.company,true)}${field('지원직무','supportArea','지원직무를 입력해 주세요.',setup.department,true)}</div></div>`;
 if(step==='content'){
  if(setup.mode==='cover')content.innerHTML=`<p class="di-dialog-description">면접에 사용할 자기소개서를 선택해 주세요.</p><div class="di-cover-sample"><label><input type="radio" name="dropdownCover" value="sample" checked><span><strong>사용자 경험을 개선하는 프로덕트 디자이너</strong><small>디자인 · 프로덕트 디자이너</small></span></label><details><summary>자기소개서 내용 보기</summary><p>사용자 인터뷰와 사용성 테스트를 통해 서비스의 불편함을 발견하고, 팀원들과 해결안을 구체화했습니다. 문제를 정의한 과정과 협업 경험을 면접에서 이야기하고자 합니다.</p></details></div>`;
  else if(setup.mode==='basic')content.innerHTML=`<div class="di-form"><label class="di-field" for="textarea_body"><span>지원직무와 관계있는 경험이나 자기소개를 입력해 주세요.</span><textarea id="textarea_body" placeholder="예: 프로젝트 경험, 인턴십, 동아리 활동, 자격증 등">${esc(setup.experience)}</textarea></label></div>`;
  else content.innerHTML=`<div class="di-form">${field('지원 기업','comp_input','기업명을 입력해 주세요.',setup.company)}<div class="di-field"><span id="di-topic-label">기출문항 분야</span>${radio('di-company-topic',['직무역량','지원동기','협업경험'],setup.topics[0])}</div></div>`;
 }
 if(step==='type')content.innerHTML=`<div class="di-form"><fieldset class="di-field" style="margin:0;padding:0;border:0"><legend>면접 방식</legend><div class="di-choice-cards"><label class="di-interview-type"><input type="radio" name="di-interview-type" value="standard" ${setup.interviewType==='standard'?'checked':''}><span>${icon('Video')}<strong>실전 면접</strong><small>질문을 확인하고 카메라를 보며 답변해요.</small></span></label><label class="di-interview-type"><input type="radio" name="di-interview-type" value="avatar" ${setup.interviewType==='avatar'?'checked':''}><span>${icon('UserRound')}<strong>아바타 면접</strong><small>AI 면접관과 마주 보며 답변해요.</small></span></label></div></fieldset></div><dl class="di-review-list"><dt>진행 방법</dt><dd>${modes[setup.mode][1]}</dd><dt>지원직무</dt><dd>${esc([setup.job==='선택안함'?'':setup.job,setup.department].filter(Boolean).join(' · '))||'선택 안 함'}</dd><dt>업종</dt><dd>${esc(selectedLabel(setup.industry))}</dd><dt>기업형태</dt><dd>${esc(selectedLabel(setup.corporation))}</dd><dt>지원 기업</dt><dd>${esc(setup.company)||'선택 안 함'}</dd></dl>`;
 content.insertAdjacentHTML('beforeend','<p class="di-form-error" id="di-setup-error" role="alert"></p>');
 icons(content);dialog.scrollTop=0;if(dialog.open)$('#di-setup-title').focus();
}
function collect(){
 if(step==='job'){setup.job=content.querySelector('select[name=checkSelectEg]').value;setup.industry=content.querySelector('select[name=occ_checkbox]').value;setup.corporation=content.querySelector('select[name=cor_checkbox]').value;setup.career=content.querySelector('[name=exp_checkbox]:checked')?.value||'';setup.company=$('#companyName').value.trim();setup.department=$('#supportArea').value.trim();}
 if(step==='content'){
  if(setup.mode==='basic')setup.experience=$('#textarea_body').value.trim();
  if(setup.mode==='cover')setup.documentTitle='사용자 경험을 개선하는 프로덕트 디자이너';
  if(setup.mode==='company'){setup.company=$('#comp_input').value.trim();setup.topics=[content.querySelector('[name=di-company-topic]:checked')?.value||'직무역량','지원동기','협업경험'];}
 }
 if(step==='type')setup.interviewType=content.querySelector('[name=di-interview-type]:checked').value;
}
$('#AI_interview').addEventListener('click',()=>{origin=document.activeElement;step='choice';render();dialog.showModal();$('#di-setup-title').focus();});
$('#di-setup-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>origin?.focus());
content.addEventListener('click',event=>{const choice=event.target.closest('[data-mode]');if(!choice)return;setup.mode=choice.dataset.mode;step='environment';render();});
back.addEventListener('click',()=>{collect();step={environment:'choice',job:'environment',content:'job',type:'content'}[step];render();});
next.addEventListener('click',()=>{
 collect();
 if(step==='job'){
  const missing=[
   [setup.career,'경력을 선택해 주세요.','[name=exp_checkbox]'],
   [setup.company,'기업명을 입력해 주세요.','#companyName'],
   [setup.department,'지원직무를 입력해 주세요.','#supportArea']
  ].find(([value])=>!value);
  if(missing){$('#di-setup-error').textContent=missing[1];const input=content.querySelector(missing[2]);input.setAttribute('aria-invalid','true');input.focus();return;}
 }
 if(step==='content'&&setup.mode==='basic'&&!setup.experience){$('#di-setup-error').textContent='경험이나 자기소개를 입력해 주세요.';$('#textarea_body').setAttribute('aria-invalid','true');$('#textarea_body').focus();return;}
 if(step==='content'&&setup.mode==='company'&&!setup.company){$('#di-setup-error').textContent='지원 기업을 입력해 주세요.';$('#comp_input').setAttribute('aria-invalid','true');$('#comp_input').focus();return;}
 if(step==='type'){
  try{sessionStorage.setItem('dds-interview-setup',JSON.stringify(setup));}catch{toast('설정을 저장하지 못했습니다. 기본 설정으로 면접 화면을 엽니다.');}
  location.href='./interview-session.html';return;
 }
 step={environment:'job',job:'content',content:'type'}[step];render();
});
