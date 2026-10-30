// Comparison-only adapter. The authored DDS tokens and the original pages stay unchanged.
const state = new WeakMap();
const moduleURL = new URL(import.meta.url);
const previewSheetURL = new URL('./direction-preview.css', moduleURL);
previewSheetURL.search = moduleURL.search;
const sheetURL = previewSheetURL.href;
const hex = value => {
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) throw new Error('비교 색상은 6자리 HEX 값이어야 합니다.');
  return value.toLowerCase();
};
const rgb = value => [1,3,5].map(index => parseInt(value.slice(index,index+2),16));
const mix = (first, second, ratio) => '#'+rgb(first).map((value,index) => Math.round(value*(1-ratio)+rgb(second)[index]*ratio).toString(16).padStart(2,'0')).join('');
const luminance = value => rgb(value).map(channel => channel/255).map(channel => channel<=.04045 ? channel/12.92 : ((channel+.055)/1.055)**2.4).reduce((sum,value,index) => sum+value*[.2126,.7152,.0722][index],0);
const contrast = (first,second) => (Math.max(luminance(first),luminance(second))+.05)/(Math.min(luminance(first),luminance(second))+.05);
const ink = (seed,background,dark) => {
  for(let step=0;step<=20;step++){
    const candidate=mix(seed,dark?'#ffffff':'#17212f',step/20);
    if(contrast(candidate,background)>=4.5)return candidate;
  }
  return dark?'#f7f8fa':'#17212f';
};

function palette(profile,dark){
  const background=dark?'#17191c':'#ffffff';
  const primary=hex(profile.colors?.primary||'#ffad31');
  const secondary=hex(profile.colors?.secondary||primary);
  const accent=hex(profile.colors?.accent||secondary);
  const positive=hex(profile.colors?.positive||'#18734b');
  const sameOrange=primary==='#ffad31';
  const primarySoft=sameOrange?(dark?'#3c251d':'#fff9ef'):mix(background,primary,dark?.18:.07);
  const roles={};
  for(const [name,value] of Object.entries({primary,secondary,accent,positive})){
    roles[`--direction-${name}`]=value;
    roles[`--direction-${name}-ink`]=ink(value,background,dark);
    roles[`--direction-${name}-soft`]=mix(background,value,dark?.19:.075);
    roles[`--direction-${name}-border`]=mix(background,value,dark?.42:.24);
  }
  Object.assign(roles,{
    '--primary':primary,
    '--primary-hover':sameOrange?(dark?'#ffbe5c':'#ff941a'):mix(primary,dark?'#ffffff':'#000000',dark?.10:.08),
    '--primary-active':sameOrange?(dark?'#ffca7a':'#e8750a'):mix(primary,dark?'#ffffff':'#000000',dark?.18:.15),
    '--primary-foreground':'#ffffff',
    '--primary-border':'transparent',
    '--brand-ink':ink(primary,background,dark),
    '--accent':primarySoft,
    '--accent-foreground':ink(primary,background,dark),
    '--accent-border':sameOrange?(dark?'#554022':'#fff0d6'):mix(background,primary,dark?.40:.22),
    '--ring':primary,
    '--text-link':ink(primary,background,dark),
    '--direction-glow':mix(background,primary,dark?.16:.13)
  });
  const ai=profile.multicolor?accent:primary;
  Object.assign(roles,{
    '--ai-input-border':mix(background,ai,dark?.30:.20),
    '--ai-input-background':[
      `radial-gradient(ellipse 100% 160% at 5% 15%, ${mix(background,ai,dark?.15:.055)} 0%, transparent 85%)`,
      `radial-gradient(ellipse 110% 160% at 100% 20%, ${mix(background,secondary,dark?.12:.035)} 0%, transparent 90%)`,
      `radial-gradient(ellipse 110% 150% at 55% 100%, ${mix(background,positive,dark?.09:.025)} 0%, transparent 90%)`,
      `linear-gradient(110deg,${mix(background,ai,dark?.08:.025)},${mix(background,secondary,dark?.07:.02)})`
    ].join(',')
  });
  if(profile.multicolor){
    Object.assign(roles,{
      '--success':ink(positive,background,dark),
      '--success-bg':mix(background,positive,dark?.20:.075),
      '--text-success':ink(positive,background,dark),
      '--info':ink(secondary,background,dark),
      '--info-bg':mix(background,secondary,dark?.20:.075),
      '--text-info':ink(secondary,background,dark)
    });
  }
  return roles;
}

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
    const timeout=setTimeout(()=>finish(new Error('비교용 스타일을 불러오지 못했습니다.')),8000);
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

/** Apply one lab direction to a same-origin preview document, never to the DDS shell. */
export async function applyDirection(doc,profile,theme='light'){
  if(!doc?.documentElement||!doc.head)throw new Error('비교 화면이 아직 준비되지 않았습니다.');
  if(!profile?.id)throw new Error('비교할 방향을 선택해 주세요.');
  const font=profile.font||'pretendard';
  const families={suite:'DDS SUITE',plex:'DDS Plex KR',serif:'DDS Noto Serif KR'};
  if(!['pretendard',...Object.keys(families)].includes(font))throw new Error('지원하지 않는 비교 서체입니다.');
  remember(doc);
  const root=doc.documentElement;
  const dark=theme==='dark';
  const colorsEnabled=!profile.preserveColors&&!['current','baseline'].includes(profile.id);
  const declarations=colorsEnabled?palette(profile,dark):{};
  if(font!=='pretendard')declarations['--font-sans']=`'${families[font]}','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif`;
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
  if(font!=='pretendard'&&doc.fonts){
    const family=families[font];
    await Promise.all([400,500,600,700].map(weight=>doc.fonts.load(`${weight} 16px "${family}"`,'지원자 경험을 새로운 기회로 0123456789')));
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
