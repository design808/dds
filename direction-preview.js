// Runtime display preferences. Authored DDS tokens and release files stay unchanged.
const state = new WeakMap();
const moduleURL = new URL(import.meta.url);
const previewSheetURL = new URL('./direction-preview.css', moduleURL);
previewSheetURL.search = moduleURL.search;
const sheetURL = previewSheetURL.href;
const hex = value => {
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) throw new Error('색상은 6자리 HEX 값이어야 합니다.');
  return value.toLowerCase();
};
const rgb = value => [1,3,5].map(index => parseInt(value.slice(index,index+2),16));
const mix = (first, second, ratio) => '#'+rgb(first).map((value,index) => Math.round(value*(1-ratio)+rgb(second)[index]*ratio).toString(16).padStart(2,'0')).join('');
const luminance = value => rgb(value).map(channel => channel/255).map(channel => channel<=.04045 ? channel/12.92 : ((channel+.055)/1.055)**2.4).reduce((sum,value,index) => sum+value*[.2126,.7152,.0722][index],0);
const contrast = (first,second) => (Math.max(luminance(first),luminance(second))+.05)/(Math.min(luminance(first),luminance(second))+.05);
const ink = (seed,background,dark) => {
  const surfaces=Array.isArray(background)?background:[background];
  for(let step=0;step<=20;step++){
    const candidate=mix(seed,dark?'#ffffff':'#17212f',step/20);
    if(surfaces.every(surface=>contrast(candidate,surface)>=4.5))return candidate;
  }
  return dark?'#f7f8fa':'#17212f';
};
const filledStates = (seed,dark) => {
  if(!dark)return {hover:mix(seed,'#000000',.08),active:mix(seed,'#000000',.15)};
  // Keep white labels readable while preserving the dark-theme brightening order.
  // A seed below 4.5 is retained for review rather than silently recolored.
  if(contrast(seed,'#ffffff')<4.5)return {hover:seed,active:seed};
  for(let step=40;step>=0;step--){
    const activeRatio=.18*step/40;
    const active=mix(seed,'#ffffff',activeRatio);
    if(contrast(active,'#ffffff')>=4.5)return {hover:mix(seed,'#ffffff',activeRatio*.10/.18),active};
  }
  return {hover:seed,active:seed};
};

export function palette(profile,dark){
  const background=dark?'#17191c':'#ffffff';
  const muted=dark?'#292d33':'#f1f2f4';
  const primary=hex(profile.colors?.primary||'#ffad31');
  const secondary=hex(profile.colors?.secondary||primary);
  const accent=hex(profile.colors?.accent||secondary);
  const positive=hex(profile.colors?.positive||'#18734b');
  const sameOrange=primary==='#ffad31';
  const primarySoft=sameOrange?(dark?'#3c251d':'#fff9ef'):mix(background,primary,dark?.18:.07);
  const primaryStates=sameOrange
    ? {hover:dark?'#ffbe5c':'#ff941a',active:dark?'#ffca7a':'#e8750a'}
    : filledStates(primary,dark);
  const roles={};
  if(!sameOrange){
    for(const [step,ratio] of [[50,.96],[100,.90],[200,.75],[300,.55],[400,.30]])roles[`--brand-${step}`]=mix(primary,'#ffffff',ratio);
    roles['--brand-500']=primary;
    for(const [step,ratio] of [[600,.10],[700,.23],[800,.38],[900,.53],[950,.67]])roles[`--brand-${step}`]=mix(primary,'#000000',ratio);
  }
  for(const [name,value] of Object.entries({primary,secondary,accent,positive})){
    const soft=mix(background,value,dark?.19:.075);
    const aiTint=mix(background,value,dark?.20:.12);
    const states=name==='primary'?primaryStates:filledStates(value,dark);
    roles[`--direction-${name}`]=value;
    roles[`--direction-${name}-ink`]=ink(value,[background,muted,soft,aiTint],dark);
    roles[`--direction-${name}-soft`]=soft;
    roles[`--direction-${name}-border`]=mix(background,value,dark?.42:.24);
    roles[`--direction-${name}-hover`]=states.hover;
    roles[`--direction-${name}-active`]=states.active;
  }
  Object.assign(roles,{
    '--primary':primary,
    '--primary-hover':primaryStates.hover,
    '--primary-active':primaryStates.active,
    '--primary-foreground':'#ffffff',
    '--primary-border':'transparent',
    '--brand-ink':roles['--direction-primary-ink'],
    '--accent':primarySoft,
    '--accent-foreground':ink(primary,[background,muted,primarySoft],dark),
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
    const successBg=mix(background,positive,dark?.20:.075);
    const infoBg=mix(background,secondary,dark?.20:.075);
    const successInk=ink(positive,[background,successBg],dark);
    const infoInk=ink(secondary,[background,infoBg],dark);
    Object.assign(roles,{
      '--success':successInk,
      '--success-bg':successBg,
      '--text-success':successInk,
      '--info':infoInk,
      '--info-bg':infoBg,
      '--text-info':infoInk
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
  const families={suite:'DDS SUITE',plex:'DDS Plex KR',serif:'DDS Noto Serif KR',wanted:'DDS Wanted Sans',paperlogy:'DDS Paperlogy'};
  if(![font,headingFont].every(value=>['pretendard',...Object.keys(families)].includes(value)))throw new Error('지원하지 않는 서체입니다.');
  remember(doc);
  const root=doc.documentElement;
  const dark=theme==='dark';
  const colorsEnabled=!profile.preserveColors&&!['current','baseline'].includes(profile.id);
  const declarations=colorsEnabled?palette(profile,dark):{};
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
    await Promise.all([...new Set([font,headingFont])].filter(value=>value!=='pretendard').flatMap(value=>[400,500,600,700].map(weight=>doc.fonts.load(`${weight} 16px "${families[value]}"`,'지원자 경험을 새로운 기회로 0123456789'))));
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
