// Local display preferences. These values never change the authored DDS tokens.
const STORAGE_KEY='dds-design-settings-v1';

export const DEFAULT_SETTINGS=Object.freeze({
  primary:'#FFAD31',
  colorMode:'brand',
  secondary:'#4568C8',
  accent:'#8363BB',
  positive:'#278577',
  headingFont:'pretendard',
  bodyFont:'pretendard'
});

export const FONT_OPTIONS=Object.freeze([
  Object.freeze({value:'pretendard',label:'Pretendard',family:"'Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'wanted',label:'원티드 산스 · Wanted Sans',family:"'DDS Wanted Sans','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'paperlogy',label:'페이퍼로지 · Paperlogy',family:"'DDS Paperlogy','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'plex',label:'IBM Plex Sans KR',family:"'DDS Plex KR','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'suite',label:'SUITE',family:"'DDS SUITE','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'serif',label:'Noto Serif KR',family:"'DDS Noto Serif KR','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,serif"})
]);

export const PRIMARY_PRESETS=Object.freeze([
  Object.freeze({value:'#FFAD31',label:'오렌지'}),
  Object.freeze({value:'#2864DC',label:'블루'}),
  Object.freeze({value:'#4296D8',label:'스카이'}),
  Object.freeze({value:'#515ED6',label:'인디고'}),
  Object.freeze({value:'#9B49BD',label:'퍼플'}),
  Object.freeze({value:'#CF3F77',label:'로즈'}),
  Object.freeze({value:'#CD4648',label:'레드'}),
  Object.freeze({value:'#E76C24',label:'코럴 오렌지'}),
  Object.freeze({value:'#D79919',label:'앰버'}),
  Object.freeze({value:'#769B21',label:'라임'}),
  Object.freeze({value:'#30964C',label:'그린'}),
  Object.freeze({value:'#16967F',label:'에메랄드'}),
  Object.freeze({value:'#2195A8',label:'틸'}),
  Object.freeze({value:'#172238',label:'네이비'})
]);

// Independent functional combinations; selecting one keeps the brand color.
export const FUNCTIONAL_PRESETS=Object.freeze([
  Object.freeze({id:'blue-violet-teal',label:'블루 · 바이올렛 · 틸',secondary:'#4568C8',accent:'#8363BB',positive:'#278577'}),
  Object.freeze({id:'indigo-rose-green',label:'인디고 · 로즈 · 그린',secondary:'#6265B7',accent:'#B05C82',positive:'#398566'}),
  Object.freeze({id:'teal-violet-olive',label:'틸 · 퍼플 · 올리브',secondary:'#347D92',accent:'#9564A7',positive:'#718440'}),
  Object.freeze({id:'blue-coral-emerald',label:'블루 · 코럴 · 에메랄드',secondary:'#397BAC',accent:'#C47754',positive:'#2B8B7C'}),
  Object.freeze({id:'slate-indigo-sage',label:'슬레이트 · 인디고 · 세이지',secondary:'#55758F',accent:'#716FB0',positive:'#5A8970'})
]);

const fields=Object.keys(DEFAULT_SETTINGS);
const colorFields=new Set(['primary','secondary','accent','positive']);
const fontValues=new Set(FONT_OPTIONS.map(option=>option.value));
const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);

function normalizeField(key,value,fallback){
  if(colorFields.has(key)){
    if(typeof value!=='string')return fallback;
    const color=value.trim();
    return /^#?[0-9a-f]{6}$/i.test(color)?'#'+color.replace(/^#/,'').toUpperCase():fallback;
  }
  if(key==='colorMode')return value==='brand'||value==='functional'?value:fallback;
  return fontValues.has(value)?value:fallback;
}

function normalizeWithFallback(input,fallback){
  const result={};
  for(const key of fields){
    let value;
    // Read only the supported own fields; inherited and pollution keys are ignored.
    try{if(isRecord(input)&&Object.prototype.hasOwnProperty.call(input,key))value=input[key];}catch{}
    result[key]=normalizeField(key,value,fallback[key]);
  }
  return Object.freeze(result);
}

/** Missing or invalid fields use the default; the result contains only DDS settings. */
export function normalizeSettings(input){
  return normalizeWithFallback(input,DEFAULT_SETTINGS);
}

function parseSettings(serialized){
  if(typeof serialized!=='string')return DEFAULT_SETTINGS;
  try{return normalizeSettings(JSON.parse(serialized));}catch{return DEFAULT_SETTINGS;}
}

/**
 * Creates an isolated store for the supplied window, or an in-memory store without one.
 * subscribe(callback) does not call immediately; callers apply getSettings() first.
 * Changes notify once with a frozen settings object. Invalid patch fields keep their
 * current values. Disposed stores retain their last value and stop all writes/events.
 */
export function createSettingsStore(targetWindow){
  const listeners=new Set();
  let disposed=false;
  const storage=()=>{try{return targetWindow?.localStorage;}catch{return undefined;}};
  let settings;
  try{settings=parseSettings(storage()?.getItem(STORAGE_KEY));}catch{settings=DEFAULT_SETTINGS;}

  function replace(next){
    if(fields.every(key=>settings[key]===next[key]))return false;
    settings=next;
    for(const callback of [...listeners]){
      if(!listeners.has(callback))continue;
      // One subscriber must not prevent other views from receiving a change.
      try{callback(settings);}catch{}
    }
    return true;
  }

  function onStorage(event){
    if(disposed||(event.key!==STORAGE_KEY&&event.key!==null))return;
    const local=storage();
    if(event.storageArea&&event.storageArea!==local)return;
    replace(parseSettings(event.key===null?null:event.newValue));
  }
  targetWindow?.addEventListener?.('storage',onStorage);

  return {
    getSettings(){return settings;},
    updateSettings(patch){
      if(disposed)return settings;
      const next=normalizeWithFallback(patch,settings);
      if(fields.every(key=>settings[key]===next[key]))return settings;
      // Storage can be unavailable or full; the current window still keeps its value.
      try{storage()?.setItem(STORAGE_KEY,JSON.stringify(next));}catch{}
      replace(next);
      return settings;
    },
    resetSettings(){
      if(disposed)return settings;
      try{storage()?.removeItem(STORAGE_KEY);}catch{}
      replace(DEFAULT_SETTINGS);
      return settings;
    },
    subscribe(callback){
      if(typeof callback!=='function')throw new TypeError('A settings subscriber must be a function.');
      if(!disposed)listeners.add(callback);
      return ()=>listeners.delete(callback);
    },
    dispose(){
      if(disposed)return;
      disposed=true;
      listeners.clear();
      targetWindow?.removeEventListener?.('storage',onStorage);
    }
  };
}
