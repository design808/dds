// Field groups follow resume/static/js/resume_0/web_addForm_*.js.
const text=(key,label,extra={})=>({key,label,...extra});
const select=(key,label,options,extra={})=>text(key,label,{type:'select',options,...extra});
const month=(key,label)=>text(key,label,{type:'month'});
const date=(key,label)=>text(key,label,{type:'date'});
const area=(key,label)=>text(key,label,{type:'textarea',wide:true});
const period=[month('start','시작일'),month('end','종료일')];
export const personalFields=[text('name','이름',{required:true}),date('birth','생년월일'),text('engName','이름(영문)'),select('sex','성별',['남성','여성']),text('chnName','이름(한문)'),text('phone','전화번호',{type:'tel'}),text('email','이메일',{type:'email'}),text('address','주소',{wide:true}),text('detailAddress','상세주소',{wide:true})];
export const preferenceFields=[select('veteran','보훈대상',['비대상','대상(5%)','대상(10%)']),text('veteranNo','보훈번호',{condition:'veteran'}),select('disability','장애여부',['비대상','대상']),text('disabilityDegree','장애등급',{condition:'disability'}),select('multiCulture','다문화가정',['비대상','대상']),select('northKorean','북한이탈주민',['비대상','대상']),select('basicLiving','기초생활수급자 및 차상위계층',['비대상','대상'],{wide:true})];
export const militaryFields=[select('military','군필여부',['미필','군필','면제','비대상']),select('militaryType','군별',['육군','해군','공군','해병','전의경','카투사','공익','병특','기타'],{condition:'military'}),select('militaryRank','계급',['이등병','일병','상병','병장','하사','중사','상사','원사','준위','소위','중위','대위','기타'],{condition:'military'}),select('militaryReason','전역사유',['만기전역','의병전역','의가사전역','기타'],{condition:'military'}),text('militaryStart','입대일',{type:'date',condition:'military'}),text('militaryEnd','전역일',{type:'date',condition:'military'}),text('exemption','면제사유',{wide:true,condition:'exemption'})];
export const sections=[
 {id:'education',label:'학력사항',required:true,fields:[select('schoolType','학력',['고등학교','대학교(2·3년제)','대학교(4년제)','대학원(석사)','대학원(박사)'],{required:true}),text('schoolName','학교명',{required:true}),select('affiliation','계열',['인문계열','사회계열','교육계열','공학계열','자연계열','의약계열','상경계열','법학계열','예체능계열','문과계열','이과계열','전문(실업)계열','특성화/마이스터고','특수목적고']),text('major','전공'),text('grade','학점'),select('maxGrade','기준학점',['4.0','4.3','4.5','5.0','7.0','100']),select('otherMajorStatus','전공 추가',['없음','부전공','복수전공','이중전공']),text('otherMajor','추가 전공'),select('admission','입학 구분',['입학','편입']),month('start','입학일'),select('graduation','졸업 구분',['졸업','졸업예정','재학중','수료','중퇴','자퇴']),month('end','졸업일')]},
 {id:'training',label:'교육사항',fields:[text('name','교육명'),text('organization','교육기관'),...period,area('description','교육내용')]},
 {id:'experience',label:'경험사항',fields:[text('organization','소속조직'),text('role','주요역할'),...period,area('description','주요활동업무')]},
 {id:'career',label:'경력사항',fields:[text('company','회사명'),text('department','부서'),text('position','직위'),text('role','담당업무'),...period,area('description','주요업무 및 성과')]},
 {id:'language',label:'어학',fields:[select('kind','구분',['어학시험','어학능력']),text('language','언어명'),text('test','어학시험명'),text('score','점수/급'),text('issuer','발급기관'),date('date','취득일'),select('speaking','회화능력',['상','중','하']),select('writing','작문능력',['상','중','하'])]},
 {id:'certificate',label:'자격증',fields:[text('name','자격증명'),text('number','자격증 등록번호'),text('issuer','발급기관'),date('date','취득일')]},
 {id:'award',label:'수상경력',fields:[text('name','수상명/내용'),text('organization','수상기관'),date('date','수상일')]},
 {id:'overseas',label:'해외경험/경력',fields:[text('name','활동명'),text('country','국가/지역'),text('organization','운영기관'),...period,area('description','활동내용')]},
 {id:'volunteer',label:'봉사활동',fields:[text('name','봉사명'),text('organization','운영기관'),...period,area('description','봉사내용')]},
 {id:'portfolio',label:'포트폴리오 및 기타문서',fields:[select('kind','분류',['포트폴리오','기타문서']),text('link','링크',{type:'url',wide:true}),text('file','파일첨부',{type:'file',wide:true})]},
 {id:'remark',label:'특기사항',single:true,fields:[area('description','특기사항')]},
 {id:'description',label:'경력기술서',single:true,fields:[area('description','경력기술서')]}
];
export const hopeFields=[select('job','직종',['경영·사무·금융','영업·고객상담','무역·유통','마케팅·광고·홍보','서비스','IT·전기·전자·통신','생산·제조·정비','연구개발·설계','토목·건설','디자인','의료','미디어·예술·스포츠','교육','전문·특수직','공공·사회봉사','기획·전략']),select('industry','업종',['서비스업','금융업','유통업','IT·전기·전자','제조업','건설업','교육업','의료·제약업','미디어·광고·홍보','문화·예술·디자인업','공공기관·협회']),select('companyType','기업형태',['대기업','중견기업','중소기업','공기업','외국계','금융권','스타트업']),text('company','기업명'),text('supportArea','지원 직무'),select('experience','경력',['신입','경력'])];
export const blankEntry=()=>({uid:crypto.randomUUID()});
export function initialResume(document){
 const entries={education:[{uid:'school-1'}]};
 if(document){entries.education[0]={uid:'school-1',schoolType:'대학교(4년제)',schoolName:'엔잡대학교',affiliation:'예체능계열',major:'시각디자인',grade:'3.8',maxGrade:'4.5',admission:'입학',start:'2018-03',graduation:'졸업',end:'2022-02'};entries.career=[{uid:'career-1',company:'디자인 스튜디오',department:'프로덕트팀',position:'디자이너',role:'프로덕트 디자인',start:'2022-03',end:'2026-08',description:'사용자 리서치와 화면 설계를 담당했습니다. 팀과 함께 프로토타입을 만들고 사용성 테스트를 진행했습니다.'}];}
 return {title:document?.title||'',personal:{name:document?'김딥':'',engName:document?'Deep Kim':'',email:document?'deep@example.com':'',veteran:'비대상',disability:'비대상',multiCulture:'비대상',northKorean:'비대상',basicLiving:'비대상',military:'비대상'},hope:{job:document?.job||'',industry:document?.industry||'',companyType:document?.companyType||'',company:document?.company||'',supportArea:document?'프로덕트 디자이너':'',experience:document?'경력':''},photo:'',entries,order:sections.filter(s=>entries[s.id]).map(s=>s.id)};
}
