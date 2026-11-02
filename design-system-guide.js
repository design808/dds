import {icon} from './icons.js?v=3d0074ac8047139a';

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

const examples={
  coverletter:{title:'자기소개서 지원정보',label:'자기소개서 제목',name:'documentTitle',value:'서비스 기획 인턴 지원',save:'지원정보 저장',id:'document-title'},
  interview:{title:'면접 지원정보',label:'면접명',name:'interviewTitle',value:'서비스 기획 직무 면접',save:'면접정보 저장',id:'interview-title'}
};
const tabs=[...document.querySelectorAll('[data-guide-context]')];
const panel=document.getElementById('example-panel');
const form=document.getElementById('guide-example-form');
const nameInput=document.getElementById('example-name');
const jobInput=document.getElementById('example-job');
const status=document.getElementById('example-status');
const entered=new Map();
let context='coverletter';

function selectExample(next){
  if(next===context)return;
  entered.set(context,{name:nameInput.value,job:jobInput.value});
  context=next;
  const example=examples[context];
  for(const tab of tabs){const selected=tab.dataset.guideContext===context;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;}
  const tab=tabs.find(tab=>tab.dataset.guideContext===context);
  panel.setAttribute('aria-labelledby',tab.id);
  document.getElementById('example-title').textContent=example.title;
  document.getElementById('example-name-label').textContent=example.label;
  nameInput.name=example.name;
  nameInput.value=entered.get(context)?.name??example.value;
  jobInput.value=entered.get(context)?.job??'서비스 기획자';
  document.getElementById('example-save').textContent=example.save;
  document.getElementById('example-code').textContent=`<div class="field">\n  <label for="${example.id}">${example.label}</label>\n  <input id="${example.id}" name="${example.name}">\n</div>\n\n<button class="btn primary" type="submit">\n  ${example.save}\n</button>`;
  status.textContent='입력한 내용은 이 예제 안에서만 확인합니다.';
}
for(const tab of tabs){
  tab.addEventListener('click',()=>selectExample(tab.dataset.guideContext));
  tab.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const at=tabs.indexOf(tab);
    const next=event.key==='Home'?tabs[0]:event.key==='End'?tabs.at(-1):tabs[(at+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];
    selectExample(next.dataset.guideContext);
    next.focus();
  });
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  status.textContent='입력한 예제 값을 확인했습니다. 서버에는 저장하지 않습니다.';
});
for(const button of document.querySelectorAll('[data-example-save]')){
  button.addEventListener('click',()=>{
    document.getElementById('save-example-status').textContent='세 버튼은 같은 색상·높이·상태 규칙을 사용합니다.';
  });
}
