// Runtime display preferences. Authored DDS tokens and release files stay unchanged.
const state = new WeakMap();
const moduleURL = new URL(import.meta.url);
const previewSheetURL = new URL('./direction-preview.css', moduleURL);
previewSheetURL.search = moduleURL.search;
const sheetURL = previewSheetURL.href;
import {palette} from './ui/profile-palette.js?v=2a22c87422b484f5';
export {palette} from './ui/profile-palette.js?v=2a22c87422b484f5';

function remember(doc){
  if(state.has(doc))return state.get(doc);
  const root=doc.documentElement;
  const previous={theme:root.getAttribute('data-theme'),attributes:{}};
  for(const name of ['data-direction-id','data-direction-colors','data-direction-multicolor','data-direction-feature-colors'])previous.attributes[name]=root.getAttribute(name);
  previous.classPresent=root.classList.contains('dds-direction-preview');
  state.set(doc,previous);
  return previous;
}

function loadSheet(doc){
  let sheet=doc.getElementById('dds-direction-sheet');
  if(sheet?.sheet)return Promise.resolve();
  if(sheet?._ddsDirectionLoading)return sheet._ddsDirectionLoading;
  if(!sheet){
    sheet=doc.createElement('link');
    sheet.id='dds-direction-sheet';
    sheet.rel='stylesheet';
    sheet.href=sheetURL;
  }
  const promise=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>finish(new Error('디자인 설정 스타일을 불러오지 못했습니다.')),8000);
    const finish=error=>{
      clearTimeout(timeout);
      sheet.removeEventListener('load',loaded);
      sheet.removeEventListener('error',failed);
      if(error)reject(error);else resolve();
    };
    const loaded=()=>finish();
    const failed=()=>finish(new Error('비교용 스타일을 불러오지 못했습니다.'));
    sheet.addEventListener('load',loaded,{once:true});
    sheet.addEventListener('error',failed,{once:true});
    if(!sheet.isConnected)doc.head.append(sheet);
  });
  sheet._ddsDirectionLoading=promise;
  return promise;
}

/** Apply browser preferences without changing source tokens or page structure. */
export async function applyDirection(doc,profile,theme='light'){
  if(!doc?.documentElement||!doc.head)throw new Error('화면이 아직 준비되지 않았습니다.');
  if(!profile?.id)throw new Error('디자인 설정을 확인해 주세요.');
  const font=profile.font||'pretendard';
  const headingFont=profile.headingFont||font;
  const families={suite:'DDS SUITE',plex:'DDS Plex KR',serif:'DDS Noto Serif KR',wanted:'DDS Wanted Sans',paperlogy:'DDS Paperlogy',maruburi:'DDS MaruBuri',hahmlet:'DDS Hahmlet'};
  if(![font,headingFont].every(value=>['pretendard',...Object.keys(families)].includes(value)))throw new Error('지원하지 않는 서체입니다.');
  remember(doc);
  const root=doc.documentElement;
  const dark=theme==='dark';
  const colorsEnabled=!profile.preserveColors&&!['current','baseline'].includes(profile.id);
  const valuesByRole=palette(profile,dark);
  const declarations=colorsEnabled?valuesByRole:Object.fromEntries(
    ['--page-background','--workspace-background','--text-tertiary'].map(name=>[name,valuesByRole[name]])
  );
  if(font!=='pretendard')declarations['--font-sans']=`'${families[font]}','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif`;
  declarations['--font-heading']=headingFont==='pretendard'?"'Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif":`'${families[headingFont]}','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif`;
  let values=doc.getElementById('dds-direction-values');
  if(!values){values=doc.createElement('style');values.id='dds-direction-values';doc.head.append(values);}
  values.textContent='html.dds-direction-preview{'+Object.entries(declarations).map(([name,value])=>name+':'+value).join(';')+'}';
  root.classList.add('dds-direction-preview');
  root.dataset.theme=dark?'dark':'light';
  root.dataset.directionId=profile.id;
  root.dataset.directionColors=String(colorsEnabled);
  root.dataset.directionMulticolor=String(colorsEnabled&&Boolean(profile.multicolor));
  root.dataset.directionFeatureColors=String(colorsEnabled&&Boolean(profile.featureColors));
  await loadSheet(doc);
  if(doc.fonts){
    const loaded=await Promise.all([...new Set([font,headingFont])].filter(value=>value!=='pretendard').flatMap(value=>[400,500,600,700].map(weight=>doc.fonts.load(`${weight} 16px "${families[value]}"`,'지원자 경험을 새로운 기회로 0123456789'))));
    if(loaded.some(faces=>!faces.length||faces.some(face=>face.status!=='loaded')))throw new Error('선택한 서체를 불러오지 못했습니다.');
  }
  return ()=>removeDirection(doc);
}

export function removeDirection(doc){
  const previous=state.get(doc);
  doc.getElementById('dds-direction-values')?.remove();
  doc.getElementById('dds-direction-sheet')?.remove();
  if(!previous)return;
  const root=doc.documentElement;
  if(!previous.classPresent)root.classList.remove('dds-direction-preview');
  if(previous.theme===null)root.removeAttribute('data-theme');else root.setAttribute('data-theme',previous.theme);
  for(const [name,value] of Object.entries(previous.attributes)){
    if(value===null)root.removeAttribute(name);else root.setAttribute(name,value);
  }
  state.delete(doc);
}
