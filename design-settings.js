import {createSettingsStore} from './design-preferences.js?v=397886dd51872b8b';
import {applyDirection} from './direction-preview.js?v=397886dd51872b8b';
import {mountDesignSettings} from './design-settings-panel.js?v=397886dd51872b8b';
import {createBrandLogoSync} from './brand-logo.js?v=397886dd51872b8b';
import './custom-controls.js?v=397886dd51872b8b';
import './icon-tooltips.js?v=397886dd51872b8b';

const store=createSettingsStore(window);
const root=document.documentElement;
const brandLogos=createBrandLogoSync(document);
const moduleURL=new URL(import.meta.url);
let revision=0;
let appliedTheme;

function stylesheet(url){
  if([...document.querySelectorAll('link[rel=stylesheet]')].some(link=>new URL(link.href).pathname===url.pathname))return;
  url.search=moduleURL.search;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href=url.href;
  document.head.append(link);
}
stylesheet(new URL('./custom-controls.css',import.meta.url));
stylesheet(new URL('./design-settings-panel.css',import.meta.url));
stylesheet(new URL('./button-system.css',import.meta.url));

export const getDesignSettings=()=>store.getSettings();
export const getSavedDesignProfile=()=>store.getSavedProfile();
export const hasUnsavedDesignChanges=()=>store.hasUnsavedChanges();

store.subscribeProfile(savedProfile=>{
  window.dispatchEvent(new CustomEvent('dds-design-profile-change',{detail:{profile:savedProfile}}));
});

function profile(settings){
  const functional=settings.colorMode==='functional';
  const colored=settings.primary!=='#FFAD31'||functional;
  return {
    id:colored?'settings':'current',
    preserveColors:!colored,
    font:settings.bodyFont,
    headingFont:settings.headingFont,
    multicolor:functional,
    featureColors:functional,
    colors:{primary:settings.primary,secondary:settings.secondary,accent:settings.accent,positive:settings.positive,
      pageBackground:settings.pageBackground,pageBackgroundDark:settings.pageBackgroundDark}
  };
}

function currentTheme(){
  if(root.dataset.theme)return root.dataset.theme==='dark'?'dark':'light';
  try{return localStorage.getItem('deep-theme')==='dark'?'dark':'light';}catch{return 'light';}
}

async function apply(){
  const ticket=++revision;
  const settings=getDesignSettings();
  appliedTheme=currentTheme();
  root.dataset.ddsSettingsReady='false';
  root.dataset.ddsHeadingFont=settings.headingFont;
  root.dataset.ddsBodyFont=settings.bodyFont;
  brandLogos.update(settings.primary);
  try{
    const loading=applyDirection(document,profile(settings),appliedTheme);
    window.dispatchEvent(new CustomEvent('dds-design-settings-change',{detail:{settings,theme:appliedTheme}}));
    await loading;
    if(ticket===revision)root.dataset.ddsSettingsReady='true';
  }catch(error){
    if(ticket===revision)root.dataset.ddsSettingsReady='error';
    console.error('DDS 디자인 설정을 적용하지 못했습니다.',error);
  }
}

store.subscribe(apply);
new MutationObserver(()=>{if(currentTheme()!==appliedTheme)apply();}).observe(root,{attributes:true,attributeFilter:['data-theme']});

window.addEventListener('storage',event=>{
  if(event.key!=='deep-theme'&&event.key!==null)return;
  let theme='light';
  try{theme=localStorage.getItem('deep-theme')==='dark'?'dark':'light';}catch{}
  root.dataset.theme=theme;
  const button=document.getElementById('theme-toggle');
  const lucide=window.lucide;
  if(button&&lucide?.icons){
    button.setAttribute('aria-label',theme==='dark'?'라이트 모드로 전환':'다크 모드로 전환');
    button.replaceChildren(lucide.createElement(lucide.icons[theme==='dark'?'Sun':'Moon'],{class:'icon',width:24,height:24,'stroke-width':2,'aria-hidden':'true'}));
  }
});

if(window.self===window.top)mountDesignSettings({
  getSettings:store.getSettings,
  updateSettings:store.updateSettings,
  resetSettings:store.resetSettings,
  subscribe:store.subscribe,
  getSavedProfile:store.getSavedProfile,
  saveProfile:store.saveProfile,
  hasUnsavedChanges:store.hasUnsavedChanges,
  subscribeProfile:store.subscribeProfile
});
apply();
