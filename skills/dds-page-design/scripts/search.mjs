// DDS-authored, offline reference search. Upstream data attribution is in ../LICENSE.
// This module reads only its packaged JSON; it never generates UI/styles or writes files.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const domains=Object.freeze({
  layout:{file:'layouts.json',fields:['id','name','keywords','sectionOrder','primaryCTA'],weights:{id:3,name:4,keywords:3,sectionOrder:1,primaryCTA:1}},
  ux:{file:'ux.json',fields:['id','category','name','platform','outcome','recommendation','avoid'],weights:{id:3,category:1,name:4,outcome:2,recommendation:1,avoid:.5}},
});
const notice='검토할 참고 자료입니다. 사용자 요구사항·현재 서비스 기능·등록된 DDS 규칙을 우선합니다. 검색 관련도는 화면 품질 점수가 아닙니다.';
const stopWords=new Set('a an the and or to of for in on with from by is are be as at it this that use user users should can not'.split(' '));
const englishAliases=Object.freeze({forms:'form',fields:'field',errors:'error',invalid:'validation',validate:'validation',validating:'validation',labels:'label',listings:'listing',plans:'plan',features:'feature',results:'result',states:'state',loading:'load',loads:'load',navigation:'nav',navigate:'nav',sticky:'fixed',overlap:'obscure',obscured:'obscure',overlapping:'obscure',submit:'submission',submitting:'submission',duplicate:'double',autofill:'autocomplete'});
const koreanAliases=Object.freeze({
  '검색 결과 없음':'empty search results','결과 없음':'empty results','빈 상태':'empty state','뒤로 가기':'back button',
  '자동 완성':'autofill','자동완성':'autofill','비밀번호':'password','레이아웃':'layout','지원서':'application',
  '가격표':'pricing','요금제':'pricing plan','랜딩':'landing','히어로':'hero','기능':'features','가격':'pricing',
  '비교':'comparison','목록':'listing','공고':'listing','채용':'recruitment','상품':'product','검색':'search',
  '필터':'filter','입력':'input','오류':'error','검증':'validation','안내':'feedback','알림':'notification',
  '메시지':'message','메뉴':'navigation','탐색':'navigation','저장':'save','제출':'submit','중복':'duplicate',
  '로딩':'loading','복구':'recovery','초점':'focus','키보드':'keyboard','고정':'sticky','겹침':'overlap',
  '콘텐츠':'content','넘침':'overflow','줄바꿈':'wrap','단계':'step','진행':'progress','상태':'state','폼':'form',
});
const koreanEntries=Object.entries(koreanAliases).sort((first,second)=>second[0].length-first[0].length);

function normalized(value){return String(value).normalize('NFKC').toLowerCase().replace(/\s+/gu,' ').trim();}
function tokens(value){
  return (normalized(value).match(/[a-z0-9]+/g)||[])
    .filter(term=>term.length>=2&&!stopWords.has(term))
    .map(term=>englishAliases[term]||term);
}
function error(code,message,extra={}){return {status:'error',code,message,count:0,results:[],...extra};}

function loadRows(domain){
  const configuration=domains[domain];
  const input=JSON.parse(fs.readFileSync(new URL('../data/'+configuration.file,import.meta.url),'utf8'));
  if(!Array.isArray(input))throw new TypeError('The reference data must be a list.');
  return input.map(row=>{
    if(!row||typeof row!=='object'||!configuration.fields.every(field=>field==='keywords'
      ?Array.isArray(row[field])&&row[field].every(term=>typeof term==='string')
      :typeof row[field]==='string'))throw new TypeError('The reference data is incomplete.');
    // Output is an explicit projection: future upstream visual fields cannot leak.
    return Object.fromEntries(configuration.fields.map(field=>[field,row[field]]));
  });
}

function rank(rows,queryTerms,weights){
  const documents=rows.map(row=>{
    const counts=new Map();let length=0;
    for(const [field,weight] of Object.entries(weights)){
      const values=Array.isArray(row[field])?row[field].join(' '):row[field];
      for(const term of tokens(values)){counts.set(term,(counts.get(term)||0)+weight);length+=weight;}
    }
    return {row,counts,length};
  });
  const average=documents.reduce((sum,document)=>sum+document.length,0)/Math.max(1,documents.length)||1;
  const frequencies=new Map(queryTerms.map(term=>[term,documents.filter(document=>document.counts.has(term)).length]));
  return documents.map(document=>{
    let relevance=0,matched=0;
    for(const term of queryTerms){
      const count=document.counts.get(term)||0;if(!count)continue;
      matched++;
      const frequency=frequencies.get(term),idf=Math.log(1+(documents.length-frequency+.5)/(frequency+.5));
      relevance+=idf*(count*2.5)/(count+1.5*(.25+.75*document.length/average));
    }
    return {row:document.row,relevance:relevance*(matched/queryTerms.length),matched};
  }).filter(item=>item.matched>0).sort((first,second)=>second.relevance-first.relevance||first.row.id.localeCompare(second.row.id));
}

/** Read-only reference retrieval. A zero match never turns into a generic layout. */
export function searchReferences(query,{domain}={}){
  if(typeof domain!=='string'||!Object.hasOwn(domains,domain))return error('INVALID_DOMAIN','--domain에는 layout 또는 ux를 지정해 주세요.');
  if(typeof query!=='string'||!query.trim())return error('EMPTY_QUERY','찾을 레이아웃이나 UX 문제를 입력해 주세요.',{domain});
  if(query.length>500)return error('QUERY_TOO_LONG','검색어를 핵심 요구사항으로 줄여 주세요.',{domain});
  let translated=normalized(query);const translations=[];
  for(const [from,to] of koreanEntries)if(translated.includes(from)){
    translated=translated.replaceAll(from,' '+to+' ');translations.push({from,to});
  }
  translated=normalized(translated);
  const base={domain,query:query.trim(),normalizedQuery:translated,translations,notice};
  if(/[\p{Script=Hangul}]/u.test(translated))return {...base,status:'needs-english-query',code:'UNSUPPORTED_QUERY_TERMS',message:'이 검색어는 영어로 입력해 주세요. 예: marketplace search listings, form error placement.',count:0,results:[]};
  const terms=[...new Set(tokens(translated))];
  if(!terms.length)return {...base,status:'no-match',reason:'NO_SEARCHABLE_TERMS',count:0,results:[]};
  let rows;
  try{rows=loadRows(domain);}catch{return error('DATA_UNAVAILABLE','포함된 참고 자료를 읽을 수 없습니다.',base);}
  const exact=rows.find(row=>normalized(row.id)===translated);
  const ranked=exact?[{row:exact,relevance:1,matched:terms.length}]:rank(rows,terms,domains[domain].weights).slice(0,3);
  return {...base,status:ranked.length?'ok':'no-match',...(ranked.length?{}:{reason:'NO_MATCH'}),count:ranked.length,
    results:ranked.map(({row,relevance})=>({...row,relevance:Number(relevance.toFixed(4))}))};
}

function textOutput(result){
  if(result.status==='error')return `오류 [${result.code}]: ${result.message}`;
  if(result.status==='needs-english-query')return result.message;
  if(result.status==='no-match')return `일치하는 참고 자료가 없습니다. 검색어를 좁혀 다시 확인해 주세요.\n${result.notice}`;
  const lines=[`참고 자료 ${result.count}개 · ${result.domain}`,result.notice];
  for(const row of result.results){
    lines.push('',`${row.id} · ${row.name}`);
    if(result.domain==='layout')lines.push(`섹션 순서: ${row.sectionOrder}`,`주 행동 위치: ${row.primaryCTA}`);
    else lines.push(`확인할 문제: ${row.outcome}`,`권고: ${row.recommendation}`,`피할 점: ${row.avoid}`);
  }
  return lines.join('\n');
}

export function runCLI(args,output=process.stdout){
  let domain,json=args.includes('--json'),help=false,problem=null;const query=[];
  for(let index=0;index<args.length;index++){
    const argument=args[index];
    if(argument==='--json')continue;
    if(argument==='--help'||argument==='-h'){help=true;continue;}
    if(argument==='--domain'){
      if(!args[index+1]||args[index+1].startsWith('--')){problem=error('MISSING_DOMAIN','--domain 뒤에 layout 또는 ux를 지정해 주세요.');break;}
      domain=args[++index];continue;
    }
    if(argument.startsWith('--domain=')){domain=argument.slice('--domain='.length);continue;}
    if(argument.startsWith('-')){problem=error('UNKNOWN_OPTION','지원하지 않는 옵션입니다: '+argument);break;}
    query.push(argument);
  }
  if(help&&!problem){
    const usage='node scripts/search.mjs "<query>" --domain layout|ux [--json]';
    output.write((json?JSON.stringify({status:'help',usage,count:0,results:[]}):usage)+'\n');return 0;
  }
  const result=problem||searchReferences(query.join(' '),{domain});
  output.write((json?JSON.stringify(result,null,2):textOutput(result))+'\n');
  return result.status==='error'?2:0;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))process.exitCode=runCLI(process.argv.slice(2));
