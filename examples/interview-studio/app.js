import {createComponent as component,mountDDS,icon,statusBadge} from '../../ui/index.js?v=1d5b404f43a62e77';
import {STORAGE_KEY,CHECK_LABELS,LIMIT,questionsFor,createSession,restoreSession,charCount,canSubmit,metrics,formatTime} from './app-model.js?v=1d5b404f43a62e77';

import {prepareNavigation} from './app-lifecycle.js?v=1d5b404f43a62e77';

const app=document.querySelector('#app');
let session=null,storageAvailable=true;
try{session=restoreSession(JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'null'));}catch{storageAvailable=false;}
let route=location.hash.slice(2)||'home',cleanup=()=>{},clockStart=null,stream=null,recorder=null,recordStarted=0,recordPending=false,recordingStopPromise=null,devicePending=false,deviceError='',liveError='',clips=new Map(),lastFocus=null;
const make=(tag,className='',text='')=>{const node=document.createElement(tag);if(className)node.className=className;if(text!=='')node.textContent=text;return node;};
const text=(value,role='body-1-normal',extra='')=>make('p',`dds-type-${role} page-text ${extra}`,value);
const title=(value,role='title-1',tag='h1')=>make(tag,`dds-type-${role} page-text`,value);
const stack=(...children)=>{const node=make('div','page-stack');node.append(...children.filter(Boolean));return node;};
const row=(...children)=>{const node=make('div','page-row');node.append(...children.filter(Boolean));return node;};
const card=content=>component('card',{slots:{content},variants:{status:false,metadata:false,date:false,tools:false}});
function button(label,action,{variant='solid',color='primary',size='md',before='',after='',disabled=false,attrs={},iconOnly=false}={}){return component('button',{props:{label,variant,color,size,before,after,disabled,iconOnly,attributes:{'data-app-action':action,...attrs}}});}
const secondary=(label,action,options={})=>button(label,action,{variant:'outlined',color:'assistive',...options});
function badge(label,state='draft'){const host=make('span');host.innerHTML=statusBadge(state,label,icon);return host.firstElementChild;}
function notice(message,tone='neutral',heading=''){return component('alert',{variants:{tone,title:!!heading,icon:true},text:{...(heading?{title:heading}:{}),description:message},attributes:{control:{role:tone==='error'?'alert':'status'}}});}
const actionLink=(label,destination)=>{const node=make('a','dds-nav-link dds-nav-control',label);node.href='#/'+destination;node.dataset.appNav=destination;if(route===destination)node.setAttribute('aria-current','page');return node;};
function heading(kicker,main,description){const h=title(typeof main==='string'?main:'');if(main?.nodeType)h.append(main);return stack(text(kicker,'label-1','page-kicker'),h,description?text(description,'body-1-reading','page-subtle'):null);}
function stepper(index){const list=document.createDocumentFragment();['연습 설정','진행 안내','인터뷰','결과 확인'].forEach((name,i)=>{const item=make('li',i<index?'done':i===index?'current':'');if(i===index)item.setAttribute('aria-current','step');const marker=make('span');if(i<index)marker.innerHTML=icon('Check');else marker.textContent=i+1;item.append(marker,make('b','',name));list.append(item);});return component('stepper',{slots:{steps:list}});}
function save(){if(!session||!storageAvailable)return;try{const stored=structuredClone(session);if(clockStart!==null)stored.answers[stored.index].elapsed+=Date.now()-clockStart;sessionStorage.setItem(STORAGE_KEY,JSON.stringify(stored));}catch{storageAvailable=false;}}
function checkpoint(){if(session&&clockStart!==null){session.answers[session.index].elapsed+=Date.now()-clockStart;clockStart=Date.now();}save();}
function startClock(){if(session?.status==='active'&&clockStart===null)clockStart=Date.now();}
function pauseClock(){checkpoint();clockStart=null;}
function answerSeconds(){return Math.floor(((session?.answers[session.index].elapsed||0)+(clockStart===null?0:Date.now()-clockStart))/1000);}
function go(next,{focus=true}={}){route=next;if(location.hash!=='#/'+next)history.pushState({},'','#/'+next);render({focus});}
function header(){const brand=make('span','page-inline-icon');const mark=make('span','page-brand-mark');mark.innerHTML=icon('Video');brand.append(mark,document.createTextNode('인터뷰 스튜디오'));const links=document.createDocumentFragment();links.append(actionLink('인터뷰 연습','home'),actionLink('진행 안내','guide'),actionLink('내 결과표','report'));const nav=component('top-navigation',{slots:{brandContent:brand,links,tools:document.createDocumentFragment()},attributes:{brandLink:{href:'#/home','aria-label':'인터뷰 스튜디오 홈','data-app-nav':'home'}}});nav.querySelector('.dds-topnav-tools').hidden=true;const shell=make('div','page-header-shell');shell.append(nav);return shell;}
function render({focus=true}={}){
 const active=document.activeElement,activeId=active?.id,activeAction=active?.dataset?.appAction;
 cleanup();
 const main=make('main','page-main');main.id='main';main.tabIndex=-1;
 const content=route==='home'?home():route==='guide'?guide():route==='interview'?interview():route==='complete'?complete():route==='report'?report():empty('화면을 찾을 수 없어요','메인 화면에서 연습을 시작해 주세요.');main.append(content);
 if(!storageAvailable)main.append(notice('브라우저 임시 저장을 사용할 수 없어요. 이 페이지를 닫으면 답변 기록이 사라집니다.','warning'));
 const footer=make('footer','page-footer');const theme=make('div','page-footer-theme');theme.append(button(document.documentElement.dataset.theme==='dark'?'라이트 모드로 전환':'다크 모드로 전환','theme',{variant:'outlined',color:'assistive',before:document.documentElement.dataset.theme==='dark'?'Sun':'Moon',iconOnly:true}));footer.append(text('인터뷰 스튜디오','label-1'),text('한 번의 연습을, 다음 답변의 출발점으로.','label-2'),theme);
 app.replaceChildren(header(),main,footer);cleanup=mountDDS(app,{controls:true,charts:false});
 for(const video of app.querySelectorAll('[data-live-video]')){video.srcObject=stream;if(stream)video.play().catch(()=>{});}
 document.title=({home:'나의 속도로 준비하는 면접',guide:'인터뷰 진행 안내',interview:'인터뷰 진행 중',complete:'인터뷰 완료',report:'내 인터뷰 결과표'}[route]||'인터뷰 스튜디오')+' · 인터뷰 스튜디오';
 if(focus){main.focus({preventScroll:true});window.scrollTo(0,0);}
 else if(activeId){document.getElementById(activeId)?.focus({preventScroll:true});}
 else if(activeAction){app.querySelector(`[data-app-action="${activeAction}"]`)?.focus({preventScroll:true});}
}
function home(){
 const root=make('div');
 const hero=make('section','page-hero');
 const copy=make('div','page-hero-copy');copy.append(text('나를 위한 화상 면접 연습','label-1','page-kicker'));
 const h=title('말할 준비를,\n나의 속도로.','display-2');h.classList.add('page-hero-title');h.style.whiteSpace='pre-line';copy.append(h,text('카메라 앞에서 답하고, 나의 답변을 돌아보세요. 세 가지 질문으로 시작하는 혼자만의 인터뷰입니다.','body-1-reading','page-copy'));
 const facts=make('ul','page-facts');[['3문항','핵심 경험 질문'],['시간 제한 없음','충분히 생각하며'],['나만의 기록','직접 돌아보는 답변']].forEach(([a,b])=>{const li=make('li','page-fact');li.append(text(a,'headline-1'),text(b,'label-2','page-subtle'));facts.append(li);});copy.append(facts);
 const form=make('form','page-stack');form.id='setup-form';form.noValidate=true;
 form.append(title('어떤 면접을 준비하나요?','heading-1','h2'),text('지원 직무를 입력하면 첫 질문에 반영돼요.','body-2-normal','page-subtle'));
 form.append(component('input',{idPrefix:'role',text:{label:'지원 직무'},attributes:{control:{name:'role',placeholder:'예: 프로덕트 디자이너',maxlength:50,required:true,value:session?.role||'',autocomplete:'off'}},optional:{hint:false}}));
 form.append(component('radio',{text:{legend:'준비하는 경력'},name:'experience',items:[{label:'신입 · 첫 취업',value:'entry',selected:session?.experience!=='experienced'},{label:'경력 · 이직',value:'experienced',selected:session?.experience==='experienced'}]}));
 const error=text('','body-2-normal','page-answer-error');error.id='setup-error';error.hidden=true;error.setAttribute('role','alert');form.append(error);
 form.append(button('인터뷰 준비하기','setup',{size:'lg',after:'ArrowRight',attrs:{type:'submit'}}),text('회원가입 없이 이 탭에서 바로 시작해요.','label-2','page-subtle'));
 hero.append(copy,card(form));root.append(hero);
 if(session&&session.status!=='ready'){
 const resume=make('div','page-between');resume.append(stack(title(session.status==='complete'?'완료한 인터뷰가 있어요':'진행하던 인터뷰가 있어요','heading-2','h2'),text(`${session.role} · ${session.status==='complete'?'결과표에서 답변을 다시 확인할 수 있어요.':`${session.index+1}번 질문부터 이어서 연습할 수 있어요.`}`,'body-2-normal','page-subtle')),button(session.status==='complete'?'결과표 보기':'이어서 연습하기',session.status==='complete'?'report':'resume',{after:'ArrowRight'}));root.append(card(resume));}
 const intro=make('section','page-section page-stack');intro.append(title('한 번의 연습으로 남기는 세 가지','title-2','h2'));
 const grid=make('div','page-grid-3');[['01','말로 풀어보는 경험','나의 소개, 문제 해결, 협업 경험을 차례로 이야기해 보세요.'],['02','다시 보는 나의 답변','카메라를 켜면 문항별로 녹화할 수 있어요. 장치 없이 글로 답해도 괜찮아요.'],['03','다음 연습의 기준','답변 시간, 분량, 직접 확인한 항목을 결과표로 정리해 드려요.']].forEach(([n,t,d])=>grid.append(stack(text(n,'label-1','page-number'),title(t,'heading-2','h3'),text(d,'body-2-reading','page-subtle'))));intro.append(grid);root.append(intro);return root;
}
function guide(){
 const root=stack(stepper(1));const lead=make('div','page-lead');lead.append(heading('시작 전 안내','준비부터 돌아보기까지, 한 흐름으로.','질문은 세 개입니다. 답변 시간은 자유롭게 쓰고, 필요할 때 잠시 쉬어 가세요.'));root.append(lead);
 const layout=make('div','page-layout'),steps=make('div','page-stack');
 [['01','장치를 확인해요','카메라·마이크는 직접 켜야 작동해요. 권한을 허용하지 않아도 글로 답변을 기록할 수 있어요.'],['02','질문에 답해요','한 문항씩 답변을 말하고 녹화하거나, 핵심 내용을 글로 남겨 주세요. 답변 후에는 직접 점검할 수 있어요.'],['03','나의 기록을 돌아봐요','완료 후 문항별 답변 시간과 분량, 녹화, 자기 점검 항목을 결과표에서 확인해요.']].forEach(([n,t,d])=>{const line=make('div','page-step-content');line.append(text(n,'heading-2','page-number'),stack(title(t,'heading-2','h2'),text(d,'body-1-reading','page-subtle')));steps.append(line);});
 const device=make('section','page-stack');device.append(title('카메라와 마이크 확인','heading-2','h2'),mediaArea(),deviceControls(),text('녹화는 문항에서 직접 시작해요. 영상은 이 페이지에서만 보관하며 서버로 보내지 않아요. 새로고침하면 영상은 사라집니다.','body-2-reading','page-subtle'));steps.append(card(device));
 const summary=make('div','page-stack');summary.append(title('이번 인터뷰','heading-2','h2'));
 if(session){summary.append(text(session.role,'headline-1'),text(`${session.experience==='experienced'?'경력 · 이직':'신입 · 첫 취업'} / 3문항`,'body-2-normal','page-subtle'),button(session.status==='complete'?'새 인터뷰 시작':'인터뷰 시작하기',session.status==='complete'?'restart':'begin',{after:'ArrowRight'}),secondary('설정 바꾸기','home'));}
 else{summary.append(text('먼저 지원 직무를 정해 주세요.','body-2-normal','page-subtle'),button('연습 설정하기','home',{after:'ArrowRight'}));}
 summary.append(text('결과표는 내 기록을 정리한 자료예요. AI 평가나 채용 점수를 제공하지 않습니다.','label-2','page-subtle'));layout.append(steps,card(summary));root.append(layout);return root;
}
function mediaArea(){
 const area=make('div','page-media-area');
 if(stream){const video=document.createElement('video');video.className='page-camera-video';video.autoplay=true;video.muted=true;video.playsInline=true;video.setAttribute('aria-label','나의 카메라 미리보기');video.dataset.liveVideo='';area.append(component('video',{slots:{media:video}}));const label=text(recorder?.state==='recording'?'녹화 중 · 나의 화면':'나의 화면 · 녹화 전','label-2','page-media-label');label.dataset.recordingLabel='';area.append(label);}
 else{const placeholder=make('div','page-media-empty');const visual=make('span');visual.innerHTML=icon('VideoOff');placeholder.append(visual,title('아직 카메라가 꺼져 있어요','heading-2','h3'),text('주변을 정돈하고 편안하게 준비해 주세요.','body-2-normal'));area.append(placeholder);}
 return area;
}
function deviceControls(){const group=make('div','page-stack-tight');group.append(row(secondary(devicePending?'장치를 확인하는 중…':stream?'카메라·마이크 끄기':'카메라·마이크 켜기',stream?'device-off':'device-on',{before:stream?'VideoOff':'Video',disabled:devicePending}),stream?text('미리보기 켜짐','label-2','page-subtle'):null));if(deviceError)group.append(notice(deviceError,'warning'));return group;}
function interview(){
 if(!session)return empty('아직 준비한 인터뷰가 없어요','지원 직무를 정하면 세 가지 질문으로 연습할 수 있어요.');
 if(session.status==='ready')return stack(stepper(2),heading('준비한 인터뷰',session.role+' 인터뷰를 시작할까요?','시작 버튼을 누르면 첫 질문의 시간을 측정해요. 카메라·마이크는 직접 켜야 작동합니다.'),button('인터뷰 시작하기','begin',{after:'ArrowRight'}));
 if(session.status==='complete')return empty('이 인터뷰는 완료했어요','결과표를 확인하거나 새 인터뷰를 시작해 주세요.','결과표 보기','report');
 const current=session.answers[session.index],question=questionsFor(session.role,session.experience)[session.index];
 const root=stack(stepper(2));
 const top=make('div','page-between page-lead');top.append(stack(text(`${session.role} · ${session.experience==='experienced'?'경력 · 이직':'신입 · 첫 취업'}`,'label-1','page-kicker'),title('나의 경험을 들려주세요.','title-2')));top.append(row(secondary(session.status==='paused'?'이어서 진행':'잠시 멈추기',session.status==='paused'?'resume':'pause',{before:session.status==='paused'?'Play':'Pause'}),secondary('종료하기','exit',{before:'LogOut'})));root.append(top);
 const prog=component('progress',{text:{label:'인터뷰 진행',value:`${session.index+1} / 3문항`},attributes:{control:{value:session.index,max:3,'aria-label':`3문항 중 ${session.index}문항 완료`}},optional:{hint:false}});root.append(prog);
 if(session.status==='paused')root.append(notice('시간 측정을 멈췄어요. 준비되면 이어서 진행해 주세요.','neutral','잠시 쉬어 가는 중'));
 const questionHead=make('div','page-question');questionHead.append(text(`QUESTION 0${session.index+1} · ${question.label}`,'label-1','page-kicker'),title(question.title,'heading-1','h2'),text(question.hint,'body-1-reading','page-subtle'));root.append(questionHead);
 const room=make('div','page-room'),media=make('div','page-stack');media.append(mediaArea(),deviceControls());
 if(stream){media.append(row(button(recordPending?'녹화를 정리하는 중…':recorder?.state==='recording'?'녹화 마치기':'답변 녹화 시작',recorder?.state==='recording'?'record-stop':'record-start',{before:recorder?.state==='recording'?'Square':'Circle',disabled:recordPending||session.status==='paused'}),text('녹화는 이 페이지에서만 재생돼요.','label-2','page-subtle')));}
 if(clips.has(session.index)){const clip=clips.get(session.index);media.append(badge('이 문항의 녹화가 있어요','complete'),secondary('녹화 확인하기','preview',{before:'Play'}));}
 else if(current.hadRecording)media.append(notice('이 문항의 녹화 기록은 있지만 새로고침으로 영상이 사라졌어요. 필요하면 다시 녹화해 주세요.','warning'));
 const timer=make('div','page-between');timer.append(text('이 질문에 사용한 시간','label-2','page-subtle'));const clock=text(formatTime(answerSeconds()),'heading-2','page-timer');clock.dataset.timer='';timer.append(clock);media.append(timer);room.append(media);
 const form=make('form','page-stack');form.id='answer-form';form.noValidate=true;
 const textarea=component('textarea',{idPrefix:'answer',text:{label:'답변 기록',body:current.text,limit:'공백 포함 · 최대 2,000자'},attributes:{control:{name:'answer',placeholder:'말한 답변의 핵심이나 연습할 내용을 적어 주세요.',rows:7,maxlength:LIMIT,disabled:session.status==='paused'}},optional:{counter:true,limit:true}});form.append(textarea,text('녹화 없이 진행한다면 답변을 20자 이상 작성해 주세요.','label-2','page-subtle'));
 const checks=component('checkbox',{items:CHECK_LABELS.map((label,i)=>({label,value:String(i),selected:current.checks[i],disabled:session.status==='paused'})),name:'reflection'});form.append(title('내가 직접 확인하기','headline-1','h3'),checks);
 const error=text(liveError,'body-2-normal','page-answer-error');error.id='answer-error';error.hidden=!liveError;error.setAttribute('role','alert');form.append(error);
 const actions=make('div','page-answer-actions');actions.append(secondary('건너뛰기','skip',{disabled:session.status==='paused'||recordPending}),button(session.index===2?'인터뷰 완료하기':'다음 질문으로','next',{after:'ArrowRight',disabled:session.status==='paused'||recordPending,attrs:{type:'submit'}}));form.append(actions);if(session.index>0)form.append(secondary('이전 질문으로','previous',{before:'ArrowLeft',disabled:recordPending}));room.append(card(form));root.append(room);return root;
}
function complete(){
 if(!session||session.status!=='complete')return empty('아직 완료한 인터뷰가 없어요','연습을 마치면 이곳에서 결과를 확인할 수 있어요.');
 const m=metrics(session),root=stack(stepper(3)),content=make('section','page-complete');const symbol=make('div','page-complete-symbol');symbol.innerHTML=icon('Check');content.append(symbol,text('인터뷰 완료','label-1','page-kicker'),title(m.answered?'연습한 만큼, 다음이 달라져요.':'오늘의 연습을 마쳤어요.'),text(`${session.role} 인터뷰에서 ${m.answered}개의 답변을 남겼어요.${m.skipped?` ${m.skipped}개 질문은 건너뛰었어요.`:''} 나의 기록을 확인하고 다음 연습을 준비해 보세요.`,'body-1-reading','page-subtle'),row(button('내 결과표 보기','report',{size:'lg',after:'ArrowRight'}),secondary('다시 연습하기','restart')));root.append(content);return root;
}
function report(){
 if(!session||session.status!=='complete')return empty('아직 확인할 결과표가 없어요','세 가지 질문의 연습을 마치면 나의 답변 기록이 여기에 모여요.');
 const m=metrics(session),root=stack(stepper(3));const reportName=document.createDocumentFragment();reportName.append(make('span','page-title-job',session.role),document.createTextNode(' '),make('span','page-title-phrase','연습 기록'));const lead=make('div','page-between page-lead');lead.append(heading('나의 인터뷰 결과표',reportName,'점수보다 중요한 것은 내 답변을 직접 돌아보는 일입니다.'));lead.append(badge('연습 완료','complete'));root.append(lead);
 const stats=make('div','page-result-summary');[[`${m.answered} / 3`,'기록한 답변'],[formatTime(m.seconds),'총 답변 시간'],[`${m.checked} / 9`,'직접 확인한 항목']].forEach(([v,k])=>{const item=make('div','page-result-stat');item.append(text(v,'title-1'),text(k,'body-2-normal','page-subtle'));stats.append(item);});root.append(stats,title('문항별 기록','heading-1','h2'));
 const head=make('tr');['질문','답변 시간','기록 분량','녹화','자기 점검'].forEach(name=>{const th=make('th','',name);th.scope='col';head.append(th);});const rows=document.createDocumentFragment(),questions=questionsFor(session.role,session.experience);
 session.answers.forEach((answer,i)=>{const tr=make('tr');const label=make('td');label.append(text(`${i+1}. ${questions[i].label}`,'label-1'),text(answer.skipped?'건너뜀':'답변 기록','label-2','page-subtle'));tr.append(label,make('td','',formatTime(answer.elapsed/1000)),make('td','',`${charCount(answer.text)}자`),make('td','',answer.hadRecording?`${formatTime(answer.recordingSeconds)} 녹화`:'없음'),make('td','',`${answer.checks.filter(Boolean).length} / 3`));rows.append(tr);});root.append(component('table',{text:{caption:'인터뷰 문항별 실제 답변 기록'},slots:{head,rows},attributes:{region:{'aria-label':'문항별 결과표. 좁은 화면에서는 가로로 스크롤할 수 있습니다.'}}}));
 root.append(text('답변 시간은 초 단위로 표시하며, 총 시간은 문항별 표시 시간의 합계예요. 일시정지한 시간은 제외합니다. 글자 수는 앞뒤 공백을 제외한 기록 분량이며, 자기 점검은 직접 체크한 항목이에요.','body-2-reading','page-subtle'));
 const action=make('div','page-row page-report-actions');action.append(button('다시 연습하기','restart',{after:'RotateCcw'}),secondary('결과표 내려받기','download',{before:'Download'}),secondary('메인으로','home'));root.append(action);
 const records=make('section','page-record-list');records.append(title('답변 다시 보기','title-2','h2'));
 session.answers.forEach((answer,i)=>{const block=make('article','page-record');block.append(title(`${i+1}. ${questions[i].title}`,'heading-2','h3'));if(answer.text)block.append(text(answer.text,'body-1-reading','page-answer-text'));else block.append(text(answer.skipped?'이 질문은 건너뛰었어요.':'텍스트로 남긴 답변이 없어요.','body-2-normal','page-subtle'));const checked=answer.checks.map((v,j)=>v?CHECK_LABELS[j]:null).filter(Boolean);block.append(text(checked.length?`직접 확인한 항목: ${checked.join(' · ')}`:'직접 확인한 항목이 없어요.','body-2-reading','page-subtle'));if(clips.has(i)){const video=document.createElement('video');video.controls=true;video.playsInline=true;video.src=clips.get(i).url;video.className='page-playback';video.setAttribute('aria-label',`${i+1}번 답변 녹화 영상`);block.append(component('video',{slots:{media:video}}));}else if(answer.hadRecording)block.append(text('새로고침으로 녹화 영상은 사라졌어요. 녹화 시간 기록은 남아 있어요.','label-2','page-subtle'));records.append(block);});root.append(records);
 root.append(notice('답변 기록은 이 탭의 브라우저 임시 공간에 보관해요. 탭을 닫으면 사라질 수 있으니 필요하면 결과표를 내려받아 주세요.','neutral'));return root;
}
function empty(main,body,label='연습 시작하기',action='home'){const root=make('div','page-empty-host');root.append(component('empty',{text:{title:main,description:body,action:label},attributes:{actionControl:{href:'#/'+action,'data-app-nav':action}}}));return root;}
async function enableDevice(){
 if(devicePending)return;devicePending=true;deviceError='';render({focus:false});
 try{if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');const candidate=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720}},audio:true});if(!['guide','interview'].includes(route)){candidate.getTracks().forEach(track=>track.stop());return;}stream=candidate;stream.getTracks().forEach(track=>track.addEventListener('ended',()=>{if(stream&&stream.getTracks().some(t=>t.readyState==='ended')){stopRecording().then(()=>{stopDevice();deviceError='장치 연결이 끝났어요. 다시 켜거나 글로 연습을 이어가 주세요.';render({focus:false});});}}));}
 catch(error){deviceError=error.name==='NotAllowedError'?'카메라·마이크 권한이 허용되지 않았어요. 브라우저의 사이트 권한에서 허용하거나 글로 연습을 이어갈 수 있어요.':error.name==='NotFoundError'?'사용할 수 있는 카메라 또는 마이크가 없어요. 장치를 연결하거나 글로 연습을 이어가 주세요.':error.name==='NotReadableError'?'다른 앱이 장치를 사용 중일 수 있어요. 사용 중인 앱을 닫고 다시 켜 주세요.':'이 환경에서는 카메라·마이크를 사용할 수 없어요. 글로 연습을 이어갈 수 있습니다.';}
 finally{devicePending=false;render({focus:false});}
}
function stopDevice(){if(stream){stream.getTracks().forEach(track=>track.stop());stream=null;}}
function startRecording(){
 if(!stream||!session||session.status!=='active'||recordPending||recorder?.state==='recording')return;
 if(!globalThis.MediaRecorder){deviceError='이 브라우저는 녹화를 지원하지 않아요. 미리보기를 보며 말하고, 답변은 글로 남겨 주세요.';render({focus:false});return;}
 try{const chunks=[],index=session.index,recordedSession=session;const mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t));recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);const activeRecorder=recorder;recordStarted=Date.now();recorder.addEventListener('dataavailable',event=>{if(event.data.size)chunks.push(event.data);});recorder.addEventListener('stop',()=>{if(chunks.length&&session===recordedSession){const old=clips.get(index);if(old)URL.revokeObjectURL(old.url);const blob=new Blob(chunks,{type:activeRecorder.mimeType||chunks[0].type});clips.set(index,{blob,url:URL.createObjectURL(blob)});session.answers[index].hadRecording=true;session.answers[index].recordingSeconds=Math.max(1,Math.round((Date.now()-recordStarted)/1000));save();}});recorder.start(1000);liveError='';render({focus:false});}
 catch{deviceError='녹화를 시작하지 못했어요. 장치를 다시 켜거나 글로 답변을 남겨 주세요.';render({focus:false});}
}
function stopRecording(){if(recordingStopPromise)return recordingStopPromise;if(!recorder||recorder.state!=='recording')return Promise.resolve();recordPending=true;const current=recorder;recordingStopPromise=new Promise(resolve=>{current.addEventListener('stop',()=>{if(recorder===current)recorder=null;recordPending=false;resolve();},{once:true});current.stop();}).finally(()=>{recordingStopPromise=null;});return recordingStopPromise;}
function releaseClips(){for(const clip of clips.values())URL.revokeObjectURL(clip.url);clips.clear();}
function openConfirm(main,body,confirmLabel,onConfirm,{negative=false,closeLabel='확인 창 닫기'}={}){
 lastFocus=document.activeElement;const content=stack(text(body,'body-1-reading'),row(secondary('계속하기','dialog-cancel'),button(confirmLabel,'dialog-confirm',{color:negative?'negative':'primary'})));
 const wrapper=component('dialog',{text:{title:main},slots:{content},attributes:{close:{'aria-label':closeLabel}},variants:{size:'sm',actions:false},optional:{trigger:false,body:false,confirm:false}});app.append(wrapper);const dialog=wrapper.querySelector('dialog');dialog.addEventListener('close',()=>{wrapper.remove();if(lastFocus?.isConnected)lastFocus.focus();},{once:true});wrapper.querySelector('[data-app-action="dialog-cancel"]').addEventListener('click',()=>dialog.close());wrapper.querySelector('[data-app-action="dialog-confirm"]').addEventListener('click',async()=>{dialog.close();await onConfirm();});dialog.showModal();
}
function preview(){const clip=clips.get(session?.index);if(!clip)return;lastFocus=document.activeElement;const video=document.createElement('video');video.src=clip.url;video.controls=true;video.playsInline=true;video.className='page-playback';const wrapper=component('dialog',{text:{title:'방금 녹화한 답변'},slots:{content:component('video',{slots:{media:video}})},attributes:{close:{'aria-label':'녹화 영상 닫기'}},variants:{size:'lg',actions:false},optional:{trigger:false,body:false,confirm:false}});app.append(wrapper);const dialog=wrapper.querySelector('dialog');dialog.addEventListener('close',()=>{video.pause();wrapper.remove();if(lastFocus?.isConnected)lastFocus.focus();},{once:true});dialog.showModal();}
async function submitAnswer(skipped=false){
 if(!session||session.status!=='active'||recordPending)return;await stopRecording();const answer=session.answers[session.index];
 if(!skipped&&!canSubmit(answer)){liveError='답변을 20자 이상 작성하거나 카메라로 답변을 녹화해 주세요.';render({focus:false});const field=app.querySelector('#answer');field?.setAttribute('aria-invalid','true');field?.setAttribute('aria-describedby','answer-error');field?.focus();return;}
 checkpoint();clockStart=null;answer.skipped=skipped;answer.submitted=true;liveError='';
 if(session.index<2){session.index++;session.status='active';startClock();save();render();}
 else{session.status='complete';session.completedAt=Date.now();save();stopDevice();go('complete');}
}
function begin(){if(!session)return go('home');if(session.status==='complete')return restart();session.status='active';startClock();save();go('interview');}
async function pause(){await stopRecording();pauseClock();session.status='paused';save();render({focus:false});}
function resume(){if(!session)return go('home');if(session.status==='complete')return go('report');session.status='active';startClock();save();go('interview');}
function restart(){openConfirm('새로운 연습을 시작할까요?','현재 답변 기록과 녹화 영상은 지워져요. 필요하면 결과표를 먼저 내려받아 주세요.','새 연습 시작',async()=>{await stopRecording();pauseClock();stopDevice();releaseClips();session=createSession(session?.role||'지원 직무',session?.experience||'entry');deviceError='';save();go('guide');},{negative:true,closeLabel:'새 연습 취소'});}
function download(){if(!session||session.status!=='complete')return;const m=metrics(session),qs=questionsFor(session.role,session.experience);const lines=['인터뷰 스튜디오 · 나의 연습 결과표',`지원 직무: ${session.role}`,`기록한 답변: ${m.answered}/3`, `총 답변 시간: ${formatTime(m.seconds)}`,`직접 확인한 항목: ${m.checked}/9`,'','시간·분량·자기 점검 기록입니다. AI 평가 또는 채용 점수가 아닙니다.',''];session.answers.forEach((a,i)=>lines.push(`${i+1}. ${qs[i].title}`,`상태: ${a.skipped?'건너뜀':'답변 기록'} / 시간: ${formatTime(a.elapsed/1000)} / 분량: ${charCount(a.text)}자 / 녹화: ${a.hadRecording?formatTime(a.recordingSeconds):'없음'}`,`답변: ${a.text||'(텍스트 기록 없음)'}`,`직접 확인한 항목: ${a.checks.map((v,j)=>v?CHECK_LABELS[j]:null).filter(Boolean).join(', ')||'없음'}`,''));const blob=new Blob(['\uFEFF'+lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=make('a');link.href=url;link.download='인터뷰-스튜디오-결과표.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function navigate(next){await prepareNavigation(route,next,session?.status,{pause,stopRecording,stopDevice});go(next);}
app.addEventListener('click',async event=>{
 const nav=event.target.closest('[data-app-nav]');if(recordPending){if(nav)event.preventDefault();return;}if(nav){event.preventDefault();await navigate(nav.dataset.appNav);return;}
 const control=event.target.closest('[data-app-action]');if(!control||control.disabled)return;const action=control.dataset.appAction;
 if(['setup','next','dialog-cancel','dialog-confirm'].includes(action))return;
 if(action==='home'||action==='report')return navigate(action);
 if(action==='theme'){document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';try{sessionStorage.setItem('interview-studio-theme',document.documentElement.dataset.theme);}catch{}render({focus:false});}
 if(action==='begin')begin();
 if(action==='resume')resume();
 if(action==='pause')await pause();
 if(action==='device-on')await enableDevice();
 if(action==='device-off'){await stopRecording();stopDevice();render({focus:false});}
 if(action==='record-start')startRecording();
 if(action==='record-stop'){await stopRecording();render({focus:false});}
 if(action==='preview')preview();
 if(action==='skip')openConfirm('이 질문을 건너뛸까요?','답변 기록은 남지만 결과표에는 건너뛴 질문으로 표시돼요.','건너뛰기',()=>submitAnswer(true),{closeLabel:'질문 건너뛰기 취소'});
 if(action==='exit')openConfirm('연습을 잠시 마칠까요?','답변은 이 탭에 임시 보관됩니다. 메인에서 이어서 진행할 수 있어요.','메인으로 나가기',async()=>{await pause();stopDevice();go('home');},{closeLabel:'연습 종료 취소'});
 if(action==='restart')restart();
 if(action==='previous'&&session.index>0){await stopRecording();checkpoint();clockStart=null;session.index--;liveError='';startClock();save();render();}
 if(action==='download')download();
});
app.addEventListener('submit',event=>{event.preventDefault();if(recordPending)return;if(event.target.id==='setup-form'){const form=new FormData(event.target),role=String(form.get('role')||'').trim(),experience=String(form.get('experience')||'entry');if(!role){const error=app.querySelector('#setup-error');error.textContent='준비하는 지원 직무를 입력해 주세요.';error.hidden=false;const field=app.querySelector('#role');field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby','setup-error');field.focus();return;}const create=()=>{pauseClock();stopDevice();releaseClips();session=createSession(role,experience);liveError='';deviceError='';save();go('guide');};if(session&&session.status!=='ready')openConfirm('새 인터뷰를 준비할까요?','기존 답변과 녹화는 지워져요. 결과가 필요하면 먼저 내려받아 주세요.','새 인터뷰 준비',create,{negative:true,closeLabel:'새 인터뷰 준비 취소'});else create();}if(event.target.id==='answer-form')submitAnswer();});
app.addEventListener('input',event=>{if(event.target.name==='answer'&&session){session.answers[session.index].text=event.target.value;save();if(liveError){liveError='';const error=app.querySelector('#answer-error');if(error)error.hidden=true;event.target.removeAttribute('aria-invalid');}}if(event.target.name==='role'){event.target.removeAttribute('aria-invalid');const error=app.querySelector('#setup-error');if(error)error.hidden=true;}});
app.addEventListener('change',event=>{if(event.target.name==='reflection'&&session){session.answers[session.index].checks[Number(event.target.value)]=event.target.checked;save();}});
window.addEventListener('popstate',async()=>{const next=location.hash.slice(2)||'home';await prepareNavigation(route,next,session?.status,{pause,stopRecording,stopDevice});route=next;render();});
window.addEventListener('beforeunload',()=>{save();});
setInterval(()=>{const clock=app.querySelector('[data-timer]');if(clock)clock.textContent=formatTime(answerSeconds());if(session?.status==='active')save();},1000);
try{const theme=sessionStorage.getItem('interview-studio-theme');if(['light','dark'].includes(theme))document.documentElement.dataset.theme=theme;}catch{}
if(!['home','guide','interview','complete','report'].includes(route))route='home';
render({focus:false});
