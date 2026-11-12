import {createComponent, mountDDS, icon} from '../../ui/index.js?v=888f0c1451ec7763';

const $ = (selector, root=document) => root.querySelector(selector);
const storeKey = 'maju-dds-050-v1';
const freshState = () => ({interviews:[], notes:'', checks:[], question:0, theme:'light'});
let state=freshState(), storageReady=true, stream=null, previewPending=false;
let remaining=120, timerStartedAt=0, timerBase=120, timerId=null, noteTimer=null;
let audioContext=null, audioSource=null, micTimer=null;
const questions=[
  '지금의 나를 가장 잘 보여주는 경험을 소개해 주세요.',
  '어려운 문제를 해결했던 과정을 이야기해 주세요.',
  '다른 의견을 가진 동료와 어떻게 협업했나요?',
  '이 역할에서 가장 기여하고 싶은 일은 무엇인가요?',
  '면접관에게 꼭 물어보고 싶은 질문은 무엇인가요?'
];
const checklistLabels=['조용한 장소와 네트워크 확인하기','지원한 역할과 이력서 다시 읽기','면접관에게 물어볼 질문 정리하기'];
function el(tag, className='', text='') {
  const node=document.createElement(tag); if(className)node.className=className; if(text)node.textContent=text; return node;
}
function fragment(...children){ const node=document.createDocumentFragment();node.append(...children);return node; }
function ico(name){const template=document.createElement('template');template.innerHTML=icon(name);return template.content.firstElementChild;}
function text(tag,role,value,extra=''){return el(tag,`dds-type-${role}${extra?' '+extra:''}`,value);}
function button(label,handler,{before='',variant='solid',color='primary',size='md',iconOnly=false,disabled=false,type='button',id=''}={}){
  const component=createComponent('button',{props:{label,before,variant,color,size,iconOnly,disabled,attributes:{type,...(id?{id}:{})}}});
  const control=$('button',component);if(handler)control.addEventListener('click',handler);return component;
}
function buttonControl(component){return $('button',component);}
function badge(label,tone='neutral'){
  const node=createComponent('badge',{variants:{kind:'label',tone,appearance:'soft'}});
  // DDS kind=label requests an icon-free badge; SVG.hidden is not reflected natively.
  node.querySelectorAll('.badge .icon').forEach(icon=>icon.remove());
  $('.badge > span',node).textContent=label;return node;
}
function card(content,label){return createComponent('card',{slots:{content},attributes:{container:{'aria-label':label}}});}
function sectionHeading(title,description='',extra=null){
  const row=el('div','section-top');const copy=el('div');copy.append(text('h2','heading-2',title));
  if(description)copy.append(text('p','body-2-normal',description,'muted'));row.append(copy);if(extra)row.append(extra);return row;
}
function alertNode(title,description,tone='neutral'){
  return createComponent('alert',{text:{title,description},variants:{tone,closeButton:false,actions:false},optional:{description:!!description}});
}
function announce(message){$('#announcer').textContent='';requestAnimationFrame(()=>$('#announcer').textContent=message);}
function message(title,description='',tone='neutral'){$('#app-message').replaceChildren(alertNode(title,description,tone));}
function persist(){
  try{localStorage.setItem(storeKey,JSON.stringify(state));storageReady=true;return true;}
  catch{storageReady=false;message('이 브라우저에 저장할 수 없어요','현재 화면에서는 계속 사용할 수 있지만, 새로고침하면 변경 내용이 사라집니다. 노트는 파일로 내려받아 주세요.','warning');return false;}
}
try{
  const saved=localStorage.getItem(storeKey);
  if(saved){
    const data=JSON.parse(saved);
    state={
      interviews:Array.isArray(data.interviews)?data.interviews.filter(item=>item&&typeof item.id==='string'&&typeof item.title==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(item.date)&&/^\d{2}:\d{2}$/.test(item.time)).map(item=>({...item,title:item.title.slice(0,80),organization:String(item.organization||'').slice(0,80),url:safeURL(item.url),duration:['30','45','60'].includes(item.duration)?item.duration:'30'})):[],
      notes:typeof data.notes==='string'?data.notes.slice(0,2000):'',
      checks:Array.isArray(data.checks)?data.checks.filter(value=>Number.isInteger(value)&&value>=0&&value<3):[],
      question:Number.isInteger(data.question)&&data.question>=0&&data.question<questions.length?data.question:0,
      theme:data.theme==='dark'?'dark':'light'
    };
  }
}catch{storageReady=false;}
document.documentElement.dataset.theme=state.theme;
function safeURL(value){try{if(!value)return '';const url=new URL(String(value));return ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}}
function today(){const date=new Date();return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function tomorrow(){const date=new Date();date.setDate(date.getDate()+1);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function formatDate(value){return new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(new Date(value+'T12:00:00'));}
function scrollToSection(id){document.getElementById(id).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});}

const brand=el('div','brand-content');const brandIcon=el('span','brand-icon');brandIcon.append(ico('Video'));brand.append(brandIcon,el('span','','마주'));
const links=fragment(...[['준비 공간','#studio'],['인터뷰 일정','#schedule'],['연습 노트','#practice']].map(([label,href])=>{const a=el('a','dds-nav-link dds-nav-control',label);a.href=href;return a;}));
const themeButton=button('다크 모드로 보기',()=>{
  state.theme=state.theme==='light'?'dark':'light';document.documentElement.dataset.theme=state.theme;persist();updateThemeLabel();
},{before:state.theme==='dark'?'Sun':'Moon',variant:'outlined',color:'assistive',iconOnly:true});
function updateThemeLabel(){const control=buttonControl(themeButton);const label=state.theme==='dark'?'라이트 모드로 보기':'다크 모드로 보기';control.setAttribute('aria-label',label);control.dataset.tooltip=label;$('.dds-button-label',control).replaceChildren(ico(state.theme==='dark'?'Sun':'Moon'));}
updateThemeLabel();
const nav=createComponent('top-navigation',{slots:{brandContent:brand,links,tools:button('일정 추가',()=>openSchedule(),{before:'Plus',size:'sm'})},attributes:{brandLink:{href:'#main','aria-label':'마주 홈'}}});
$('#navigation').append(nav);
$('#footer-theme').append(themeButton);
$('#intro-symbol').append(ico('MessagesSquare'));
$('#intro-actions').append(button('준비실 열기',()=>scrollToSection('studio'),{before:'Video',size:'lg'}),button('인터뷰 일정 추가',()=>openSchedule(),{before:'Plus',variant:'outlined',color:'assistive',size:'lg'}));
$('#privacy-note').append(ico('LockKeyhole'),text('span','caption-1','일정과 노트는 이 브라우저에만 저장돼요. 카메라 영상과 음성은 녹화하거나 전송하지 않습니다.'));

// Camera and microphone are requested only by this explicit user action.
const studioContent=el('div','section-content');
const studioHeading=sectionHeading('나의 인터뷰 준비실','화면과 목소리를 먼저 확인하세요.',badge('나만의 미리보기'));
studioHeading.classList.add('studio-header');studioContent.append(studioHeading);
const cameraView=el('div','camera-view');
const video=el('video');video.autoplay=true;video.muted=true;video.playsInline=true;video.hidden=true;video.setAttribute('aria-label','내 카메라 미리보기');
const placeholder=el('div','camera-placeholder');placeholder.append(ico('VideoOff'),text('span','body-2-normal','지금은 카메라가 꺼져 있어요'),text('span','caption-1','준비되면 카메라와 마이크를 켜 주세요.'));
const cameraLabel=text('span','caption-1','나 · 미리보기','camera-label');
cameraView.append(video,placeholder,cameraLabel);
const media=createComponent('video',{slots:{media:cameraView}});studioContent.append(media);
const deviceStatus=text('p','caption-1','카메라와 마이크 사용 전','device-state muted');deviceStatus.prepend(ico('ShieldCheck'));
const previewButton=button('카메라·마이크 켜기',enablePreview,{before:'Video',variant:'outlined',color:'assistive'});
const micButton=button('마이크 끄기',toggleMic,{before:'Mic',variant:'outlined',color:'assistive',iconOnly:true,disabled:true});
const stopButton=button('카메라·마이크 끄기',stopPreview,{before:'VideoOff',variant:'outlined',color:'assistive',iconOnly:true,disabled:true});
const deviceActions=el('div','actions');deviceActions.append(previewButton,micButton,stopButton);
const studioControls=el('div','studio-controls');studioControls.append(deviceActions,deviceStatus);studioContent.append(studioControls);
const deviceMessage=el('div');deviceMessage.setAttribute('role','status');studioContent.append(deviceMessage);
const micMonitor=createComponent('progress',{idPrefix:'mic-input-level',text:{label:'마이크 입력 크기',value:'장비 사용 전',hint:'말할 때 막대가 움직이는지 확인하세요. 소리는 재생하거나 저장하지 않습니다.'},attributes:{control:{value:0,max:100,'aria-label':'마이크 입력 크기','aria-valuetext':'장비 사용 전'}}});
micMonitor.hidden=true;studioContent.append(micMonitor);
const micProgress=$('progress',micMonitor), micValue=$('.row-between > span',micMonitor);
studioContent.append(text('p','caption-1','다른 사람과 연결되지 않는 개인 준비실입니다. 답변 연습은 카메라 없이도 할 수 있어요.','muted'));
$('#studio').append(card(studioContent,'나의 인터뷰 준비실'));
function setDeviceStatus(value){deviceStatus.replaceChildren(ico('ShieldCheck'),document.createTextNode(value));}
function updatePreviewButton(label,busy=false,disabled=busy){const control=buttonControl(previewButton);control.disabled=disabled;control.setAttribute('aria-busy',String(busy));$('.dds-button-label > span',control).textContent=label;}
async function enablePreview(){
  if(previewPending||stream)return;
  if(!navigator.mediaDevices?.getUserMedia){deviceMessage.replaceChildren(alertNode('장비를 사용할 수 없는 환경이에요','HTTPS 또는 localhost에서 접속한 뒤 다시 시도해 주세요. 답변 연습과 노트는 바로 사용할 수 있습니다.','warning'));return;}
  previewPending=true;updatePreviewButton('권한 요청 중…',true);setDeviceStatus('브라우저에서 권한을 허용해 주세요');
  deviceMessage.replaceChildren(alertNode('카메라와 마이크 권한을 기다리고 있어요','브라우저 권한 창에서 허용 또는 차단을 선택해 주세요.','info'));
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720}},audio:true});
    video.srcObject=stream;video.hidden=false;placeholder.hidden=true;
    await video.play();buttonControl(micButton).disabled=false;buttonControl(stopButton).disabled=false;
    updatePreviewButton('카메라·마이크 사용 중',false,true);setDeviceStatus('내 화면과 마이크 사용 중');deviceMessage.replaceChildren();startMicMonitor();
    stream.getTracks().forEach(track=>track.addEventListener('ended',()=>{if(stream)stopPreview();},{once:true}));
    announce('카메라와 마이크가 켜졌습니다. 이 화면에서만 미리봅니다.');
  }catch(error){
    if(stream)stream.getTracks().forEach(track=>track.stop());stream=null;video.srcObject=null;video.hidden=true;placeholder.hidden=false;
    const denied=['NotAllowedError','PermissionDeniedError'].includes(error.name);
    deviceMessage.replaceChildren(alertNode(denied?'장비 권한이 허용되지 않았어요':'카메라나 마이크를 찾을 수 없어요',denied?'주소창의 사이트 설정에서 카메라·마이크를 허용한 뒤 다시 시도해 주세요.':'장비 연결과 다른 앱의 사용 여부를 확인한 뒤 다시 시도해 주세요. 카메라 없이 답변을 연습해도 좋아요.','warning'));
    setDeviceStatus('장비 연결되지 않음');updatePreviewButton('다시 시도하기');
  }finally{previewPending=false;}
}
function stopMicMonitor(){
  clearInterval(micTimer);micTimer=null;audioSource?.disconnect();audioSource=null;if(audioContext){audioContext.close().catch(()=>{});audioContext=null;}micMonitor.hidden=true;micProgress.value=0;
}
function startMicMonitor(){
  stopMicMonitor();micMonitor.hidden=false;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass){micValue.textContent='입력 크기 감지 미지원';micProgress.setAttribute('aria-valuetext','이 브라우저에서 입력 크기 감지를 지원하지 않습니다');return;}
  try{
    audioContext=new AudioContextClass();audioSource=audioContext.createMediaStreamSource(stream);const analyser=audioContext.createAnalyser();analyser.fftSize=1024;audioSource.connect(analyser);const samples=new Uint8Array(analyser.fftSize);audioContext.resume().catch(()=>{});
    micTimer=setInterval(()=>{
      if(!stream)return;const enabled=stream.getAudioTracks()[0]?.enabled;
      analyser.getByteTimeDomainData(samples);let energy=0;for(const sample of samples)energy+=((sample-128)/128)**2;
      const level=enabled?Math.min(100,Math.round(Math.sqrt(energy/samples.length)*350)):0;
      micProgress.value=level;const label=!enabled?'마이크 꺼짐':audioContext.state!=='running'?'입력 감지 대기':level>2?'소리 입력이 감지되고 있어요':'말씀해 보세요';micValue.textContent=label;micProgress.setAttribute('aria-valuetext',label);
    },120);
  }catch{micValue.textContent='입력 크기를 확인할 수 없어요';micProgress.setAttribute('aria-valuetext','입력 크기를 확인할 수 없습니다');}
}
function toggleMic(){if(!stream)return;const track=stream.getAudioTracks()[0];if(!track)return;track.enabled=!track.enabled;const control=buttonControl(micButton);const label=track.enabled?'마이크 끄기':'마이크 켜기';control.setAttribute('aria-label',label);control.dataset.tooltip=label;$('.dds-button-label',control).replaceChildren(ico(track.enabled?'Mic':'MicOff'));setDeviceStatus(track.enabled?'내 화면과 마이크 사용 중':'내 화면 사용 중 · 마이크 꺼짐');}
function stopPreview(){
  stopMicMonitor();
  if(stream){const current=stream;stream=null;current.getTracks().forEach(track=>track.stop());}
  video.srcObject=null;video.hidden=true;placeholder.hidden=false;buttonControl(micButton).disabled=true;buttonControl(stopButton).disabled=true;
  const mic=buttonControl(micButton);mic.setAttribute('aria-label','마이크 끄기');mic.dataset.tooltip='마이크 끄기';$('.dds-button-label',mic).replaceChildren(ico('Mic'));
  setDeviceStatus('카메라와 마이크 꺼짐');updatePreviewButton('카메라·마이크 켜기');deviceMessage.replaceChildren();announce('카메라와 마이크를 껐습니다.');
}

// Timed answer practice and real browser-local notes.
const practiceContent=el('div','section-content');practiceContent.append(sectionHeading('답변을 말로 풀어보세요','녹화 없이, 2분 동안 생각을 정리하는 연습.'));
const questionNumber=text('p','label-2','','question-label muted');
const questionTitle=text('h3','heading-2',questions[state.question]);
const questionCopy=el('div');questionCopy.append(questionNumber,questionTitle);
const timerOutput=text('p','title-1','02:00','timer-number');timerOutput.setAttribute('role','timer');timerOutput.setAttribute('aria-label','답변 연습 남은 시간');
const timerToggle=button('연습 시작',toggleTimer,{before:'Play',size:'sm',id:'timer-toggle'});
const timerReset=button('타이머 초기화',resetTimer,{before:'RotateCcw',variant:'outlined',color:'assistive',size:'sm',iconOnly:true});
const timerButtons=el('div','timer-buttons');timerButtons.append(timerToggle,timerReset);
const timerGroup=el('div','timer-group');timerGroup.append(timerOutput,timerButtons);
const questionLine=el('div','question-line');questionLine.append(questionCopy,timerGroup);practiceContent.append(questionLine);
const practiceStatus=text('p','caption-1','편하게 말해 보세요. 평가하거나 녹음하지 않습니다.','muted');practiceStatus.setAttribute('role','status');
const questionFooter=el('div','section-top');questionFooter.append(practiceStatus,button('다음 질문',nextQuestion,{after:'',before:'ArrowRight',variant:'outlined',color:'assistive',size:'sm'}));practiceContent.append(questionFooter);
const notes=createComponent('textarea',{idPrefix:'practice-notes',text:{label:'연습 노트',body:state.notes},attributes:{control:{name:'notes',placeholder:'잘 전달한 점, 다시 말해 보고 싶은 문장, 면접관에게 물어볼 질문을 적어 보세요.',rows:5,maxlength:2000}},optional:{limit:false,counter:true}});
const notesControl=$('textarea',notes);practiceContent.append(notes);
const noteStatus=text('span','caption-1',state.notes?'이 브라우저에 저장된 노트':'내 생각을 편하게 기록하세요.','muted');
const exportButton=button('노트 내려받기',exportNotes,{before:'Download',variant:'outlined',color:'assistive',size:'sm',disabled:!state.notes});
const practiceFooter=el('div','practice-footer');practiceFooter.append(noteStatus,exportButton);practiceContent.append(practiceFooter);
$('#practice').append(card(practiceContent,'답변 연습과 연습 노트'));
notesControl.addEventListener('input',()=>{
  state.notes=notesControl.value;noteStatus.textContent='저장 중…';buttonControl(exportButton).disabled=!state.notes.trim();clearTimeout(noteTimer);
  noteTimer=setTimeout(()=>{noteStatus.textContent=persist()?'이 브라우저에 자동 저장됨':'저장되지 않음 · 파일로 내려받아 주세요';},350);
});
function updateQuestion(){questionNumber.textContent=`연습 질문 ${state.question+1} / ${questions.length}`;questionTitle.textContent=questions[state.question];}
updateQuestion();
function renderTimer(){timerOutput.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;}
function setTimerLabel(label,iconName){const control=buttonControl(timerToggle);$('.dds-button-label',control).replaceChildren(ico(iconName),el('span','',label));}
function pauseTimer(){if(timerId){clearInterval(timerId);timerId=null;}setTimerLabel('이어서 연습','Play');}
function tick(){remaining=Math.max(0,timerBase-Math.floor((performance.now()-timerStartedAt)/1000));renderTimer();if(remaining===0){pauseTimer();setTimerLabel('다시 연습','Play');practiceStatus.textContent='2분이 지났어요. 다시 말해 보고 싶은 부분을 노트에 남겨 보세요.';announce('2분 연습이 끝났습니다.');}}
function toggleTimer(){if(timerId){tick();if(remaining===0)return;pauseTimer();practiceStatus.textContent='잠시 멈췄어요. 준비되면 이어서 연습하세요.';return;}if(remaining===0)remaining=120;timerBase=remaining;timerStartedAt=performance.now();timerId=setInterval(tick,200);renderTimer();setTimerLabel('잠시 멈춤','Pause');practiceStatus.textContent='말하고 있어요. 나만의 속도로 답해 보세요.';announce('2분 답변 연습을 시작합니다.');}
function resetTimer(){pauseTimer();remaining=120;renderTimer();setTimerLabel('연습 시작','Play');practiceStatus.textContent='편하게 말해 보세요. 평가하거나 녹음하지 않습니다.';}
function nextQuestion(){resetTimer();state.question=(state.question+1)%questions.length;updateQuestion();persist();announce(`${questionNumber.textContent}. ${questions[state.question]}`);}
function downloadFile(name,content,type='text/plain;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type}));const a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportNotes(){if(!state.notes.trim())return;downloadFile(`마주-연습노트-${today()}.txt`,`마주 연습 노트\n${new Date().toLocaleString('ko-KR')}\n\n${state.notes}`);announce('연습 노트 파일을 내려받습니다.');}

// Real local schedules. No example appointments are inserted.
const scheduleContent=el('div','section-content');const scheduleCount=badge('예정 0개');
scheduleContent.append(sectionHeading('다가오는 인터뷰','한 번 더 준비할 수 있도록.',scheduleCount));
const scheduleList=el('div','interview-list');scheduleContent.append(scheduleList,button('인터뷰 일정 추가',()=>openSchedule(),{before:'Plus',variant:'outlined',color:'assistive'}));
$('#schedule').append(card(scheduleContent,'인터뷰 일정'));
function renderSchedules(){
  const items=[...state.interviews].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  $('.badge > span',scheduleCount).textContent=`예정 ${items.filter(item=>new Date(item.date+'T'+item.time)>=new Date()).length}개`;
  if(!items.length){scheduleList.replaceChildren(createComponent('empty',{text:{title:'아직 예정된 인터뷰가 없어요',description:'일정을 추가하고, 나만의 준비를 시작해 보세요.'},variants:{actions:false},optional:{action:false}}));return;}
  scheduleList.replaceChildren(...items.map(item=>{
    const entry=el('article','interview-entry');const summary=el('div','interview-summary');
    const dateBlock=el('div','date-block');dateBlock.append(text('span','caption-1',`${Number(item.date.slice(5,7))}월`),text('strong','heading-1',String(Number(item.date.slice(8)))));
    const copy=el('div','event-text');copy.append(text('h3','headline-1',item.title),text('p','caption-1',`${formatDate(item.date)} · ${item.time} · ${item.duration}분`,'muted'));
    if(item.organization)copy.append(text('p','caption-1',item.organization,'muted'));
    if(new Date(item.date+'T'+item.time)<new Date())copy.append(badge('지난 일정'));
    summary.append(dateBlock,copy);entry.append(summary);
    const actions=el('div','entry-actions');actions.append(button('일정 수정',()=>openSchedule(item),{before:'Pencil',variant:'outlined',color:'assistive',size:'sm'}),button('캘린더에 담기',()=>exportCalendar(item),{before:'CalendarPlus',variant:'outlined',color:'assistive',size:'sm'}));
    if(item.url){const link=el('a','dds-nav-link dds-type-caption-1','외부 통화 링크 열기 ↗');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';actions.append(link);}
    entry.append(actions);return entry;
  }));
}
renderSchedules();
function foldICS(line){const encoder=new TextEncoder();let bytes=0,result='';for(const character of line){const length=encoder.encode(character).length;if(bytes+length>73){result+='\r\n ';bytes=1;}result+=character;bytes+=length;}return result;}
function escapeICS(value){return String(value).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function exportCalendar(item){
  const start=new Date(item.date+'T'+item.time);const end=new Date(start.getTime()+Number(item.duration)*60000);
  const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Maju//Interview Preparation//KO','BEGIN:VEVENT',`UID:${item.id}@maju.local`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${escapeICS(item.title)}`,`DESCRIPTION:${escapeICS([item.organization,item.url].filter(Boolean).join('\n'))}`,'END:VEVENT','END:VCALENDAR',''].map(foldICS).join('\r\n');
  downloadFile(`마주-인터뷰-${item.date}.ics`,content,'text/calendar;charset=utf-8');announce('캘린더 파일을 내려받습니다.');
}

// Browser-local readiness checklist.
const checklistContent=el('div','section-content');const checklistCount=text('span','caption-1','','muted');checklistContent.append(sectionHeading('대화 전, 마지막 체크','작은 준비가 편안한 시작을 만들어요.'));
const checkTop=el('div','check-progress');checkTop.append(text('p','label-2','나의 준비 상태'),checklistCount);checklistContent.append(checkTop);
const checks=createComponent('checkbox',{items:checklistLabels.map((label,index)=>({label,value:String(index),selected:state.checks.includes(index)}))});
const checkInputs=[...checks.querySelectorAll('input')];checkInputs.forEach((input,index)=>{input.name='readiness';input.value=String(index);input.checked=state.checks.includes(index);input.addEventListener('change',()=>{state.checks=checkInputs.flatMap((control,i)=>control.checked?[i]:[]);persist();updateCheckCount();});});
checks.querySelector('.stack')?.classList.add('check-items');checklistContent.append(checks);$('#checklist').append(card(checklistContent,'인터뷰 준비 체크리스트'));
function updateCheckCount(){checklistCount.textContent=`${state.checks.length} / ${checklistLabels.length} 완료`;}
updateCheckCount();

// DDS dialog shell with service-owned form content and native focus restoration.
let dialogReturnFocus=null, editingId=null;
const form=el('form','form-stack');form.id='schedule-form';
const formDescription=text('p','body-2-normal',`인터뷰 일정을 이 브라우저에 저장합니다. 초대 메시지는 발송되지 않습니다. 시간은 내 기기 시간대(${Intl.DateTimeFormat().resolvedOptions().timeZone}) 기준입니다.`,'muted dialog-description');
const titleInput=createComponent('input',{idPrefix:'meeting-title',text:{label:'인터뷰 제목'},attributes:{control:{name:'title',placeholder:'예: 프로덕트 디자이너 1차 인터뷰',maxlength:80,required:true}},optional:{hint:false}});
const organizationInput=createComponent('input',{idPrefix:'meeting-organization',text:{label:'회사 또는 팀 (선택)'},attributes:{control:{name:'organization',placeholder:'회사 또는 팀 이름',maxlength:80}},optional:{hint:false}});
const dateInput=createComponent('date-picker',{idPrefix:'meeting-date',text:{label:'인터뷰 날짜 (필수)'},attributes:{control:{name:'date',required:true,min:today(),value:tomorrow()}}});
const timeOptions=fragment(...Array.from({length:48},(_,i)=>{const value=`${String(Math.floor(i/2)).padStart(2,'0')}:${i%2?'30':'00'}`;const option=el('option','',value);option.value=value;return option;}));
const timeInput=createComponent('select',{idPrefix:'meeting-time',text:{label:'시작 시간 (필수)'},slots:{options:timeOptions},attributes:{control:{name:'time',value:'10:00',required:true}}});
const durationOptions=fragment(...['30','45','60'].map(value=>{const option=el('option','',value+'분');option.value=value;return option;}));
const durationInput=createComponent('select',{idPrefix:'meeting-duration',text:{label:'예상 소요 시간 (필수)'},slots:{options:durationOptions},attributes:{control:{name:'duration',value:'30',required:true}}});
const urlInput=createComponent('input',{idPrefix:'meeting-url',text:{label:'통화 링크 (선택)',hint:'사용 중인 화상 통화 서비스의 링크를 넣어 주세요.'},attributes:{control:{name:'url',type:'url',placeholder:'https://',maxlength:1000}}});
const formRow=el('div','form-row');formRow.append(dateInput,timeInput);
const formError=text('p','caption-1','','form-error');formError.id='schedule-form-error';formError.setAttribute('role','alert');
const submitButton=button('일정 저장',null,{before:'Check',type:'submit'});
const deleteButton=button('일정 삭제',()=>openDeleteConfirmation(),{before:'Trash2',variant:'outlined',color:'assistive'});
const cancelButton=button('취소',()=>scheduleDialog.close(),{variant:'outlined',color:'assistive'});
const formActions=el('div','dialog-actions');formActions.append(deleteButton,cancelButton,submitButton);
form.append(formDescription,titleInput,organizationInput,formRow,durationInput,urlInput,formError,formActions);
const dialogComponent=createComponent('dialog',{idPrefix:'schedule-dialog',text:{title:'인터뷰 일정 추가'},slots:{content:form},variants:{content:'form',size:'md',actions:false},optional:{trigger:false,body:false,confirm:false},attributes:{close:{'aria-label':'일정 창 닫기'}}});
$('#dialogs').append(dialogComponent);const scheduleDialog=$('dialog',dialogComponent);const dialogTitle=$('h2',scheduleDialog);
scheduleDialog.addEventListener('close',()=>{if(dialogReturnFocus?.isConnected)dialogReturnFocus.focus();else $('#schedule button').focus();});
function openSchedule(item=null){
  editingId=item?.id||null;dialogReturnFocus=document.activeElement;formError.textContent='';dialogTitle.textContent=item?'인터뷰 일정 수정':'인터뷰 일정 추가';
  const values=item||{title:'',organization:'',date:tomorrow(),time:'10:00',duration:'30',url:''};
  for(const [name,value] of Object.entries(values)){
    const input=form.elements.namedItem(name);if(!input)continue;
    // Replace the form's baseline together with its live value. Avoid a deferred
    // native reset racing the DDS select enhancement when reusing this dialog.
    if(input.tagName==='SELECT'){for(const option of input.options)option.defaultSelected=option.value===String(value);}
    else input.defaultValue=String(value);
    input.value=String(value);input.setCustomValidity('');input.removeAttribute('aria-invalid');
  }
  const dateControl=$('input',dateInput);dateControl.min=item?.date<today()?item.date:today();dateControl.dispatchEvent(new Event('input',{bubbles:true}));dateControl.dispatchEvent(new Event('change',{bubbles:true}));
  $('select',timeInput).dispatchEvent(new Event('change',{bubbles:true}));$('select',durationInput).dispatchEvent(new Event('change',{bubbles:true}));
  deleteButton.hidden=!item;scheduleDialog.showModal();requestAnimationFrame(()=>form.elements.namedItem('title').focus());
}
form.addEventListener('submit',event=>{
  event.preventDefault();formError.textContent='';if(!form.reportValidity())return;
  const values=Object.fromEntries(new FormData(form));const title=String(values.title||'').trim();
  if(!title){formError.textContent='인터뷰 제목을 입력해 주세요.';form.elements.namedItem('title').focus();return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(values.date)||!/^\d{2}:\d{2}$/.test(values.time)||Number.isNaN(new Date(values.date+'T'+values.time).getTime())){formError.textContent='날짜와 시작 시간을 확인해 주세요.';return;}
  const url=safeURL(values.url);if(values.url&&!url){formError.textContent='통화 링크는 https:// 또는 http://로 시작해야 합니다.';form.elements.namedItem('url').focus();return;}
  const interview={id:editingId||crypto.randomUUID(),title,organization:String(values.organization||'').trim(),date:values.date,time:values.time,duration:values.duration,url};
  const previous=state.interviews.findIndex(item=>item.id===editingId);if(previous<0)state.interviews.push(interview);else state.interviews[previous]=interview;
  const saved=persist();renderSchedules();scheduleDialog.close();if(saved)message('인터뷰 일정을 저장했어요','이 브라우저에서 다시 확인할 수 있습니다. 캘린더 파일도 내려받을 수 있어요.','success');announce(saved?'인터뷰 일정을 저장했습니다.':'일정이 현재 화면에만 추가되었습니다. 브라우저에 저장하지 못했습니다.');
});
const deleteContent=el('div','form-stack');const deleteDescription=text('p','body-1-normal','');deleteContent.append(deleteDescription);
const deleteCancelButton=button('돌아가기',()=>deleteDialog.close(),{variant:'outlined',color:'assistive'});
const deleteActions=el('div','dialog-actions');deleteActions.append(deleteCancelButton,button('일정 삭제',()=>{
  const removed=state.interviews.find(item=>item.id===editingId);state.interviews=state.interviews.filter(item=>item.id!==editingId);const saved=persist();renderSchedules();deleteDialog.close();scheduleDialog.close();if(saved)message('일정을 삭제했어요',removed?.title||'');announce(saved?'일정을 삭제했습니다.':'현재 화면에서만 일정을 삭제했습니다. 브라우저에 변경 내용을 저장하지 못했습니다.');
},{before:'Trash2',color:'negative'}));deleteContent.append(deleteActions);
const deleteComponent=createComponent('dialog',{idPrefix:'delete-dialog',text:{title:'이 일정을 삭제할까요?'},slots:{content:deleteContent},variants:{size:'sm',actions:false},optional:{trigger:false,body:false,confirm:false}});$('#dialogs').append(deleteComponent);const deleteDialog=$('dialog',deleteComponent);
deleteDialog.addEventListener('close',()=>{if(scheduleDialog.open)buttonControl(deleteButton).focus();});
function openDeleteConfirmation(){const item=state.interviews.find(item=>item.id===editingId);deleteDescription.textContent=`‘${item?.title||'선택한 인터뷰'}’ 일정을 이 브라우저에서 삭제합니다. 연결된 외부 서비스의 일정은 변경되지 않습니다.`;deleteDialog.showModal();buttonControl(deleteCancelButton).focus();}
let cleanup=mountDDS($('#app'),{charts:false});
window.addEventListener('pagehide',()=>{stopPreview();if(timerId){tick();pauseTimer();}clearTimeout(noteTimer);persist();cleanup();});
window.addEventListener('pageshow',event=>{if(event.persisted)cleanup=mountDDS($('#app'),{charts:false});});
if(!storageReady)message('저장 공간을 읽을 수 없어요','새 기록은 이 화면에서 사용할 수 있습니다. 노트는 파일로 내려받아 보관해 주세요.','warning');
