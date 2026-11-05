export const STORAGE_KEY='interview-studio-session-v1';
export const CHECK_LABELS=['상황과 배경을 설명했어요','내가 한 행동을 구체적으로 말했어요','결과나 배운 점으로 마무리했어요'];
export const LIMIT=2000;
export function questionsFor(role,experience){return [
 {label:'나의 소개',title:`${role} 직무와 연결되는 경험을 중심으로 자신을 소개해 주세요.`,hint:'어떤 일을 해왔는지, 그 경험이 이 직무에 어떻게 이어지는지 말해 보세요.'},
 {label:'문제 해결',title:experience==='experienced'?'업무에서 어려운 문제를 해결한 경험을 들려주세요.':'프로젝트나 활동에서 어려운 문제를 해결한 경험을 들려주세요.',hint:'문제 상황, 본인이 선택한 행동, 그 결과의 순서로 정리해 보세요.'},
 {label:'협업과 성장',title:'의견이 다른 사람과 협업했던 경험과 그때 배운 점을 말해 주세요.',hint:'서로 어떤 차이가 있었는지, 대화를 어떻게 풀었는지 떠올려 보세요.'}
];}
export function createSession(role,experience,now=Date.now()){
 return {schema:1,role:String(role).trim().slice(0,50),experience:experience==='experienced'?'experienced':'entry',createdAt:now,completedAt:null,index:0,status:'ready',answers:[0,1,2].map(()=>({text:'',checks:[false,false,false],elapsed:0,skipped:false,submitted:false,hadRecording:false,recordingSeconds:0}))};
}
export function restoreSession(input){
 if(!input||input.schema!==1||typeof input.role!=='string'||!input.role.trim()||!Array.isArray(input.answers)||input.answers.length!==3)return null;
 const out=createSession(input.role,input.experience,Number(input.createdAt)||Date.now());
 out.index=Math.max(0,Math.min(2,Number(input.index)||0));
 out.status=['ready','active','paused','complete'].includes(input.status)?input.status:'ready';
 if(out.status==='active')out.status='paused';
 out.completedAt=Number(input.completedAt)||null;
 out.answers=input.answers.map(a=>({text:String(a?.text||'').slice(0,LIMIT),checks:[0,1,2].map(i=>Boolean(a?.checks?.[i])),elapsed:Math.max(0,Number(a?.elapsed)||0),skipped:Boolean(a?.skipped),submitted:Boolean(a?.submitted),hadRecording:Boolean(a?.hadRecording),recordingSeconds:Math.max(0,Number(a?.recordingSeconds)||0)}));
 if(out.status==='complete'&&!out.answers.every(a=>a.submitted))return null;
 return out;
}
export const charCount=text=>[...String(text).trim()].length;
export function canSubmit(answer){return charCount(answer.text)>=20||answer.hadRecording;}
export function metrics(session){
 const answered=session.answers.filter(a=>a.submitted&&!a.skipped&&(charCount(a.text)>0||a.hadRecording));
 return {answered:answered.length,skipped:session.answers.filter(a=>a.skipped).length,characters:session.answers.reduce((n,a)=>n+charCount(a.text),0),seconds:session.answers.reduce((n,a)=>n+Math.floor(a.elapsed/1000),0),checked:session.answers.reduce((n,a)=>n+a.checks.filter(Boolean).length,0),recorded:session.answers.filter(a=>a.hadRecording).length};
}
export function formatTime(seconds){const n=Math.max(0,Math.floor(seconds));return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
