import {icon} from './icons.js?v=c3b380b0c099d9c1';

const themeButton=document.getElementById('theme-toggle');
function updateThemeButton(){
  const dark=document.documentElement.dataset.theme==='dark';
  themeButton.setAttribute('aria-label',dark?'라이트 모드로 전환':'다크 모드로 전환');
  themeButton.innerHTML=icon(dark?'sun':'moon');
}
updateThemeButton();
themeButton.addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('deep-theme',theme);}catch{}
  updateThemeButton();
});

const canvas=document.getElementById('guide-demo-canvas');
const contextTabs=[...document.querySelectorAll('[data-guide-context]')];
const editorTabs=[...document.querySelectorAll('[data-editor-tab]')];
const browserTabs=[...document.querySelectorAll('[data-browser-tab]')];
const code=document.getElementById('example-code');
const snippets={
  coverletter:`<div class="guide-editor-layout">\n  <form class="document-card">\n    <!-- 탭 + 입력창 + 체크박스 -->\n    <button class="btn primary">입력 내용 확인</button>\n  </form>\n  <aside class="document-card">미리보기</aside>\n</div>`,
  interview:`<div class="guide-browser-toolbar">\n  <!-- 검색창 + 목록 필터 탭 -->\n</div>\n<div class="guide-interview-grid">\n  <article class="document-card">면접 1</article>\n  <article class="document-card">면접 2</article>\n  <article class="document-card">면접 3</article>\n</div>\n<section class="document-card">선택한 면접 상세</section>`
};
const compositions={
  coverletter:'입력 폼과 미리보기를 두 개의 카드로 나누어 나란히 배치했습니다. 모바일에서는 위아래로 배치됩니다.',
  interview:'검색창과 필터 아래에 카드를 반복 배치했습니다. 카드를 누르면 아래 상세 영역에 해당 면접의 질문이 표시됩니다.'
};
let highlightedBlock='';
function highlightBlocks(){
  for(const block of canvas.querySelectorAll('[data-block]'))block.classList.toggle('guide-block-highlight',block.dataset.block===highlightedBlock);
}
for(const button of document.querySelectorAll('[data-guide-highlight]')){
  button.addEventListener('click',()=>{
    highlightedBlock=highlightedBlock===button.dataset.guideHighlight?'':button.dataset.guideHighlight;
    for(const choice of document.querySelectorAll('[data-guide-highlight]')){
      const selected=choice.dataset.guideHighlight===highlightedBlock;
      choice.setAttribute('aria-pressed',String(selected));
      choice.classList.toggle('selected',selected);
    }
    highlightBlocks();
  });
}
function bindTabs(tabs,select){
  for(const tab of tabs){
    tab.addEventListener('click',()=>select(tab));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const at=tabs.indexOf(tab);
      const next=event.key==='Home'?tabs[0]:event.key==='End'?tabs.at(-1):tabs[(at+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];
      select(next);
      next.focus();
    });
  }
}
function selectTab(tabs,tab){
  for(const choice of tabs){const selected=choice===tab;choice.setAttribute('aria-selected',String(selected));choice.tabIndex=selected?0:-1;}
}
function showComposition(tab){
  selectTab(contextTabs,tab);
  for(const choice of contextTabs)document.getElementById(choice.getAttribute('aria-controls')).hidden=choice!==tab;
  code.textContent=snippets[tab.dataset.guideContext];
  document.getElementById('guide-composition-description').textContent=compositions[tab.dataset.guideContext];
}
bindTabs(contextTabs,showComposition);
showComposition(contextTabs[0]);
const form=document.getElementById('guide-editor-form');
const editorStatus=document.getElementById('guide-editor-status');
const editorState=document.getElementById('guide-editor-state');
const titleInput=document.getElementById('guide-document-title');
const jobInput=document.getElementById('guide-document-job');
const experienceInput=document.getElementById('guide-document-experience');
const contributionInput=document.getElementById('guide-document-contribution');
const includeExperience=document.getElementById('guide-include-experience');
function showEditorTab(tab){
  selectTab(editorTabs,tab);
  for(const choice of editorTabs)document.getElementById(choice.getAttribute('aria-controls')).hidden=choice!==tab;
}
bindTabs(editorTabs,showEditorTab);
function updatePreview(){
  document.getElementById('guide-preview-title').textContent=titleInput.value.trim()||'자기소개서 제목';
  document.getElementById('guide-preview-job').textContent=jobInput.value.trim()||'지원 직무를 입력해 주세요.';
  document.getElementById('guide-preview-experience-text').textContent=experienceInput.value.trim()||'경험 요약을 입력해 주세요.';
  document.getElementById('guide-preview-contribution').textContent=contributionInput.value.trim();
  document.getElementById('guide-preview-experience').hidden=!includeExperience.checked;
}
function markEditorDirty(){
  editorState.textContent='작성 중';
  editorState.classList.remove('success');
  editorState.classList.add('soft');
  editorStatus.textContent='입력한 내용을 미리보기에서 확인해 보세요.';
  updatePreview();
}
form.noValidate=true;
form.addEventListener('input',markEditorDirty);
form.addEventListener('change',markEditorDirty);
form.addEventListener('submit',event=>{
  event.preventDefault();
  const invalid=form.querySelector(':invalid');
  if(invalid){
    const pane=invalid.closest('[role="tabpanel"]');
    if(pane?.hidden)showEditorTab(editorTabs.find(tab=>tab.getAttribute('aria-controls')===pane.id));
    form.reportValidity();
    return;
  }
  editorState.textContent='확인 완료';
  editorState.classList.remove('soft');
  editorState.classList.add('success');
  editorStatus.textContent='입력한 내용을 확인했습니다.';
});
form.addEventListener('reset',()=>queueMicrotask(()=>{showEditorTab(editorTabs[0]);markEditorDirty();}));
updatePreview();

const interviews=[
  {id:'planning',title:'서비스 기획 면접',category:'기획',summary:'고객 문제·우선순위·협업',description:'고객 문제를 정의하고 우선순위를 정한 경험을 준비합니다.',questions:['어떤 고객 문제를 해결했나요?','우선순위를 어떻게 정했나요?','팀과 의견을 조율한 경험은 무엇인가요?']},
  {id:'frontend',title:'프론트엔드 개발 면접',category:'개발',summary:'구현 선택·성능·문제 해결',description:'기술을 선택한 이유와 문제를 해결한 과정을 준비합니다.',questions:['구현 방식을 선택한 이유는 무엇인가요?','성능을 개선한 경험이 있나요?','예상하지 못한 오류를 어떻게 해결했나요?']},
  {id:'design',title:'프로덕트 디자인 면접',category:'디자인',summary:'리서치·가설·사용성 검증',description:'사용자의 문제를 찾고 설계를 검증한 경험을 준비합니다.',questions:['사용자의 문제를 어떻게 발견했나요?','어떤 가설을 세우고 설계했나요?','설계 결과를 어떻게 검증했나요?']}
];
const searchInput=document.getElementById('guide-interview-search');
const grid=document.getElementById('guide-interview-grid');
const selected=new Set();
let browserScope='all',detailId=interviews[0].id;
function showInterviewDetail(id){
  const interview=interviews.find(item=>item.id===id);
  detailId=id;
  document.getElementById('guide-interview-detail-badge').textContent=interview.category;
  document.getElementById('guide-interview-detail-title').textContent=interview.title;
  document.getElementById('guide-interview-detail-description').textContent=interview.description;
  const questions=document.getElementById('guide-interview-questions');
  questions.replaceChildren(...interview.questions.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  const prepare=document.getElementById('guide-prepare-interview');
  prepare.textContent=selected.has(id)?'선택 해제':'이 면접 선택';
  prepare.setAttribute('aria-pressed',String(selected.has(id)));
  document.getElementById('guide-interview-status').textContent='관심 있는 면접을 선택해 목록에 모아 두세요.';
}
function renderInterviews(restoreId){
  const query=searchInput.value.trim().toLowerCase();
  const matches=interviews.filter(item=>(browserScope==='all'||selected.has(item.id))&&`${item.title} ${item.category} ${item.summary}`.toLowerCase().includes(query));
  document.getElementById('guide-selected-count').textContent=`${selected.size}개 선택`;
  document.getElementById('guide-result-count').textContent=`${browserScope==='selected'?'선택한 면접':'면접'} ${matches.length}개`;
  grid.innerHTML=matches.length?matches.map(item=>`<article class="document-card guide-demo-card guide-interview-card${selected.has(item.id)?' is-picked':''}" data-block="Card">
    <div class="guide-card-heading"><span class="badge soft" data-block="Badge">${item.category}</span><label class="guide-card-check" data-block="Checkbox"><input type="checkbox" data-select-interview="${item.id}" ${selected.has(item.id)?'checked':''}><span class="sr-only">${item.title} 선택</span></label></div>
    <h4>${item.title}</h4><p>${item.summary}</p><small>문항 3개 · 약 15분</small>
    <button class="btn guide-detail-button" type="button" data-open-interview="${item.id}" data-block="Button" aria-controls="guide-interview-detail" aria-label="${item.title} 상세 보기">상세보기</button>
  </article>`).join(''):'<div class="guide-empty-results"><h4>표시할 면접이 없습니다</h4><p>검색어를 바꾸거나 전체 면접에서 준비할 항목을 선택해 주세요.</p></div>';
  const detail=document.querySelector('.guide-interview-detail');
  detail.hidden=!matches.length;
  if(matches.length)showInterviewDetail(matches.some(item=>item.id===detailId)?detailId:matches[0].id);
  highlightBlocks();
  if(restoreId){
    const checkbox=grid.querySelector(`[data-select-interview="${restoreId}"]`)||grid.querySelector('[data-select-interview]');
    if(checkbox)checkbox.focus({preventScroll:true});
    else browserTabs.find(tab=>tab.getAttribute('aria-selected')==='true').focus({preventScroll:true});
  }
}
bindTabs(browserTabs,tab=>{
  selectTab(browserTabs,tab);
  browserScope=tab.dataset.browserTab;
  document.getElementById('guide-interview-results').setAttribute('aria-labelledby',tab.id);
  renderInterviews();
});
searchInput.addEventListener('input',()=>renderInterviews());
grid.addEventListener('click',event=>{
  const button=event.target.closest('[data-open-interview]');
  if(button)showInterviewDetail(button.dataset.openInterview);
});
grid.addEventListener('change',event=>{
  const checkbox=event.target.closest('[data-select-interview]');
  if(!checkbox)return;
  if(checkbox.checked)selected.add(checkbox.dataset.selectInterview);else selected.delete(checkbox.dataset.selectInterview);
  renderInterviews(checkbox.dataset.selectInterview);
});
document.getElementById('guide-prepare-interview').addEventListener('click',()=>{
  const interview=interviews.find(item=>item.id===detailId),wasSelected=selected.has(detailId);
  if(wasSelected)selected.delete(detailId);else selected.add(detailId);
  renderInterviews();
  if(document.getElementById('guide-interview-detail').hidden)browserTabs.find(tab=>tab.getAttribute('aria-selected')==='true').focus({preventScroll:true});
  document.getElementById('guide-interview-status').textContent=`${interview.title}${wasSelected?' 선택을 해제했습니다.':'을 준비할 면접으로 선택했습니다.'}`;
});
renderInterviews();
