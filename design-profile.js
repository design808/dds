// Saved project choices. Importing this module never reads browser storage or DOM.
import {DEFAULT_SETTINGS,normalizeSettings} from './design-preferences.js?v=b011fb4a3d820cd2';
import {UI_VERSION} from './ui/version.js?v=b011fb4a3d820cd2';

export const PROFILE_SCHEMA_VERSION=1;
export const PROFILE_STORAGE_KEY='dds-design-profile-v1';
const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const hasOwn=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);
const colorFields=new Set(['primary','secondary','accent','positive']);

// Called only after module initialization; the preferences store uses these helpers.
function checkedSettings(input){
  if(!isRecord(input))return null;
  try{
    const normalized=normalizeSettings(input);
    for(const key of Object.keys(DEFAULT_SETTINGS)){
      if(!hasOwn(input,key))return null;
      const value=input[key];
      if(colorFields.has(key)){
        if(typeof value!=='string'||!/^#?[0-9a-f]{6}$/i.test(value.trim()))return null;
      }else if(value!==normalized[key])return null;
    }
    return normalized;
  }catch{return null;}
}

export function settingsEqual(first,second){
  if(!first||!second)return false;
  return Object.keys(DEFAULT_SETTINGS).every(key=>first[key]===second[key]);
}

/** Invalid or partial records are rejected, never silently accepted as saved defaults. */
export function normalizeDesignProfile(input){
  try{
    if(!isRecord(input)||!hasOwn(input,'schemaVersion')||input.schemaVersion!==PROFILE_SCHEMA_VERSION)return null;
    if(!hasOwn(input,'ddsVersion')||typeof input.ddsVersion!=='string'||!/^\d+\.\d+\.\d+(?:[-+][0-9a-z.-]+)?$/i.test(input.ddsVersion))return null;
    if(!hasOwn(input,'savedAt')||typeof input.savedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(input.savedAt))return null;
    const date=new Date(input.savedAt);
    if(Number.isNaN(date.getTime()))return null;
    if(!hasOwn(input,'settings'))return null;
    const settings=checkedSettings(input.settings);
    if(!settings)return null;
    return Object.freeze({schemaVersion:PROFILE_SCHEMA_VERSION,ddsVersion:input.ddsVersion,savedAt:date.toISOString(),settings});
  }catch{return null;}
}

export function createDesignProfile(settings,{savedAt=new Date().toISOString(),ddsVersion=UI_VERSION}={}){
  const profile=normalizeDesignProfile({schemaVersion:PROFILE_SCHEMA_VERSION,ddsVersion,savedAt,settings});
  if(!profile)throw new TypeError('저장할 DDS 디자인 설정을 확인해 주세요.');
  return profile;
}

export function parseDesignProfile(serialized){
  if(typeof serialized!=='string')return null;
  try{return normalizeDesignProfile(JSON.parse(serialized));}catch{return null;}
}
