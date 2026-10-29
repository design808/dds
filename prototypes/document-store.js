import {load,save,sampleInfo} from './prototype-shared.js?v=f6c1f153a6058e30';
export const documentSeed=[
 {id:'cover-1',kind:'cover',title:'사용자의 문제를 발견하는 프로덕트 디자이너',date:'2026.09.21',job:'디자인',industry:'IT·전기·전자',companyType:'스타트업',company:'딥레쥬메',state:'임시저장',representative:false},
 {id:'cover-2',kind:'cover',title:'데이터로 고객 경험을 개선하는 기획자',date:'2026.09.18',job:'기획·전략',industry:'IT·전기·전자',companyType:'중견기업',company:'지원 기업',state:'저장완료',representative:true},
 {id:'cover-3',kind:'cover',title:'함께 만드는 더 나은 서비스',date:'2026.09.15',job:'디자인',industry:'미디어·광고·홍보',companyType:'중소기업',company:'지원 기업',state:'컨설턴트 컨설팅 완료',representative:false},
 {id:'resume-1',kind:'resume',title:'프로덕트 디자이너 김딥 이력서',date:'2026.09.20',job:'디자인',industry:'IT·전기·전자',companyType:'스타트업',company:'딥레쥬메',state:'저장완료',representative:true},
 {id:'resume-2',kind:'resume',title:'사용자 경험을 설계하는 디자이너',date:'2026.09.16',job:'디자인',industry:'서비스업',companyType:'중견기업',company:'지원 기업',state:'저장완료',representative:false},
 {id:'resume-3',kind:'resume',title:'기획과 디자인을 연결하는 이력서',date:'2026.09.12',job:'기획·전략',industry:'IT·전기·전자',companyType:'스타트업',company:'지원 기업',state:'임시저장',representative:false}
];

export const getDocuments=()=>load('mypage-documents',documentSeed);
export const getDocument=id=>getDocuments().find(d=>d.id===id);
export const documentInfo=d=>({...sampleInfo,title:d.title,job:d.job,ind:d.industry,cor:d.companyType,com:d.company});
export function updateDocument(id,changes){const documents=getDocuments(),index=documents.findIndex(d=>d.id===id);if(index<0)documents.unshift({id,...changes});else Object.assign(documents[index],changes);save('mypage-documents',documents);}
