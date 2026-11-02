// Local display preferences. These values never change the authored DDS tokens.
const STORAGE_KEY='dds-design-settings-v1';

export const DEFAULT_SETTINGS=Object.freeze({
  primary:'#FFAD31',
  colorMode:'brand',
  secondary:'#356AE6',
  accent:'#7B61C8',
  positive:'#1E846B',
  headingFont:'pretendard',
  bodyFont:'pretendard'
});

export const FONT_OPTIONS=Object.freeze([
  Object.freeze({value:'pretendard',label:'Pretendard'}),
  Object.freeze({value:'plex',label:'IBM Plex Sans KR'}),
  Object.freeze({value:'suite',label:'SUITE'}),
  Object.freeze({value:'serif',label:'Noto Serif KR'})
]);

export const PRIMARY_PRESETS=Object.freeze([
  Object.freeze({value:'#FFAD31',label:'오렌지'}),
  Object.freeze({value:'#3659D9',label:'코발트'}),
  Object.freeze({value:'#0F766E',label:'그린'})
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
