import {PROFILE_STORAGE_KEY,createDesignProfile,parseDesignProfile,settingsEqual} from './design-profile.js?v=8eb0841135cc71ad';

// Local display preferences. These values never change the authored DDS tokens.
const STORAGE_KEY='dds-design-settings-v1';

export const DEFAULT_SETTINGS=Object.freeze({
  primary:'#FFAD31',
  colorMode:'brand',
  secondary:'#345BFF',
  accent:'#8B3DFF',
  positive:'#00B881',
  headingFont:'pretendard',
  bodyFont:'pretendard'
});

export const FONT_OPTIONS=Object.freeze([
  Object.freeze({value:'pretendard',label:'프리텐다드 · Pretendard',family:"'Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'wanted',label:'원티드 산스 · Wanted Sans',family:"'DDS Wanted Sans','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'paperlogy',label:'페이퍼로지 · Paperlogy',family:"'DDS Paperlogy','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'plex',label:'아이비엠 플렉스 산스 · IBM Plex Sans KR',family:"'DDS Plex KR','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'suite',label:'스위트 · SUITE',family:"'DDS SUITE','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,sans-serif"}),
  Object.freeze({value:'serif',label:'노토 세리프 KR · Noto Serif KR',family:"'DDS Noto Serif KR','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,serif"}),
  Object.freeze({value:'maruburi',label:'마루 부리 · MaruBuri',family:"'DDS MaruBuri','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,serif"}),
  Object.freeze({value:'hahmlet',label:'함렡 · Hahmlet',family:"'DDS Hahmlet','Pretendard','Apple SD Gothic Neo','Malgun Gothic',system-ui,serif"})
]);

export const PRIMARY_PRESETS=Object.freeze([
  Object.freeze({value:'#FFAD31',label:'오렌지'}),
  Object.freeze({value:'#007AFF',label:'블루'}),
  Object.freeze({value:'#4296D8',label:'스카이'}),
  Object.freeze({value:'#515ED6',label:'인디고'}),
  Object.freeze({value:'#9B49BD',label:'퍼플'}),
  Object.freeze({value:'#CF3F77',label:'로즈'}),
  Object.freeze({value:'#CD4648',label:'레드'}),
  Object.freeze({value:'#E76C24',label:'코럴 오렌지'}),
  Object.freeze({value:'#D79919',label:'앰버'}),
  Object.freeze({value:'#769B21',label:'라임'}),
  Object.freeze({value:'#009A53',label:'그린'}),
  Object.freeze({value:'#16967F',label:'에메랄드'}),
  Object.freeze({value:'#2195A8',label:'틸'}),
  Object.freeze({value:'#172238',label:'네이비'})
]);

// Independent functional combinations; selecting one keeps the brand color.
export const FUNCTIONAL_PRESETS=Object.freeze([
  Object.freeze({id:'bold',label:'볼드',secondary:'#345BFF',accent:'#8B3DFF',positive:'#00B881'}),
  Object.freeze({id:'pastel',label:'파스텔',secondary:'#A6B8FF',accent:'#D5B5FF',positive:'#9BE4CA'}),
  Object.freeze({id:'vivid',label:'비비드',secondary:'#00B8E4',accent:'#FF4FA3',positive:'#85D63A'}),
  Object.freeze({id:'fresh',label:'프레시',secondary:'#36A9F3',accent:'#FF846B',positive:'#25C9A4'}),
  Object.freeze({id:'soft-pop',label:'소프트 팝',secondary:'#9B7CFF',accent:'#F78EB8',positive:'#70D7B4'})
]);

const functionalFields=Object.freeze(['secondary','accent','positive']);
// Only the complete former presets migrate; any custom color keeps its value.
const legacyFunctionalPresets=Object.freeze([
  ['bold','#4568C8','#8363BB','#278577'],
  ['pastel','#6265B7','#B05C82','#398566'],
  ['vivid','#347D92','#9564A7','#718440'],
  ['fresh','#397BAC','#C47754','#2B8B7C'],
  ['soft-pop','#55758F','#716FB0','#5A8970']
].map(Object.freeze));

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
  try{
    const input=JSON.parse(serialized);
    const settings=normalizeSettings(input);
    if(!isRecord(input)||!functionalFields.every(key=>Object.prototype.hasOwnProperty.call(input,key)))return settings;
    const legacy=legacyFunctionalPresets.find(preset=>functionalFields.every((key,index)=>normalizeField(key,input[key],undefined)===preset[index+1]));
    const replacement=legacy&&FUNCTIONAL_PRESETS.find(preset=>preset.id===legacy[0]);
    if(!replacement)return settings;
    return normalizeSettings({...settings,...Object.fromEntries(functionalFields.map(key=>[key,replacement[key]]))});
  }catch{return DEFAULT_SETTINGS;}
}

/**
 * Creates an isolated store for the supplied window, or an in-memory store without one.
 * subscribe(callback) does not call immediately; callers apply getSettings() first.
 * Changes notify once with a frozen settings object. Invalid patch fields keep their
 * current values. Disposed stores retain their last value and stop all writes/events.
 */
export function createSettingsStore(targetWindow){
  const listeners=new Set();
  const profileListeners=new Set();
  let disposed=false;
  const storage=()=>{try{return targetWindow?.localStorage;}catch{return undefined;}};
  let settings;
  try{settings=parseSettings(storage()?.getItem(STORAGE_KEY));}catch{settings=DEFAULT_SETTINGS;}
  let savedProfile;
  try{savedProfile=parseDesignProfile(storage()?.getItem(PROFILE_STORAGE_KEY));}catch{savedProfile=null;}

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
    if(disposed||(event.key!==STORAGE_KEY&&event.key!==PROFILE_STORAGE_KEY&&event.key!==null))return;
    const local=storage();
    if(event.storageArea&&event.storageArea!==local)return;
    // Inactive tabs can receive an older event after a newer local write.
    // Read the latest shared value, including writes that followed a clear.
    const latest=(key)=>{
      try{if(local)return local.getItem(key);}catch{}
      return event.key===null?null:event.newValue;
    };
    if(event.key===STORAGE_KEY||event.key===null)replace(parseSettings(latest(STORAGE_KEY)));
    if(event.key===PROFILE_STORAGE_KEY||event.key===null)replaceProfile(parseDesignProfile(latest(PROFILE_STORAGE_KEY)));
  }

  function replaceProfile(next){
    if(JSON.stringify(savedProfile)===JSON.stringify(next))return false;
    savedProfile=next;
    for(const callback of [...profileListeners]){
      if(!profileListeners.has(callback))continue;
      try{callback(savedProfile);}catch{}
    }
    return true;
  }
  targetWindow?.addEventListener?.('storage',onStorage);

  return {
    getSettings(){return settings;},
    getSavedProfile(){return savedProfile;},
    hasUnsavedChanges(){return !savedProfile||!settingsEqual(settings,savedProfile.settings);},
    saveProfile(){
      if(disposed)return {ok:false,profile:savedProfile,error:'disposed'};
      const next=createDesignProfile(settings);
      try{
        const local=storage();
        if(!local)throw new Error('Storage is unavailable.');
        local.setItem(PROFILE_STORAGE_KEY,JSON.stringify(next));
        // Some restricted storage implementations silently ignore writes.
        if(local.getItem(PROFILE_STORAGE_KEY)!==JSON.stringify(next))throw new Error('Storage did not retain the profile.');
      }catch{return {ok:false,profile:savedProfile,error:'storage'};}
      replaceProfile(next);
      return {ok:true,profile:savedProfile};
    },
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
    subscribeProfile(callback){
      if(typeof callback!=='function')throw new TypeError('A profile subscriber must be a function.');
      if(!disposed)profileListeners.add(callback);
      return ()=>profileListeners.delete(callback);
    },
    dispose(){
      if(disposed)return;
      disposed=true;
      listeners.clear();
      profileListeners.clear();
      targetWindow?.removeEventListener?.('storage',onStorage);
    }
  };
}
