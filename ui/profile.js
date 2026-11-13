/** Project-owned theme overrides. Never modifies the versioned DDS source. */
import {normalizeSettings,DEFAULT_SETTINGS,FONT_OPTIONS} from '../design-preferences.js?v=37572f4be3f4fe6a';
import {normalizeDesignProfile} from '../design-profile.js?v=37572f4be3f4fe6a';
import {palette,canvasTextTokens} from './profile-palette.js?v=37572f4be3f4fe6a';

const defaultFontAssetBase='../assets/fonts/';
const directories={pretendard:'pretendard',wanted:'wanted-sans',paperlogy:'paperlogy',plex:'ibm-plex-kr',suite:'suite',serif:'noto-serif-kr',maruburi:'maruburi',hahmlet:'hahmlet'};
const variableFiles={pretendard:'PretendardVariable.woff2',wanted:'WantedSansVariable.woff2',suite:'SUITE-Variable.woff2'};
const headings='h1,h2,h3,h4,h5,h6,.dds-type-display-1,.dds-type-display-2,.dds-type-title-1,.dds-type-title-2,.dds-type-heading-1,.dds-type-heading-2,.dds-type-headline-1';

function validateFontAssetBase(assetBase){
 if(typeof assetBase!=='string'||/[\s"'(){};\\]/.test(assetBase)||!assetBase.endsWith('/')||/^(?:javascript|data):/i.test(assetBase))throw new TypeError('Invalid DDS font asset base.');
}

function fontAssets(settings,assetBase){
 const stylesheets=[],preloads=[];
 for(const key of new Set([settings.headingFont,settings.bodyFont])){
  const directory=assetBase+directories[key]+'/';
  if(key!=='pretendard')stylesheets.push(directory+'fontfaces.css');
  if(variableFiles[key])preloads.push(directory+variableFiles[key]);
 }
 return {stylesheets,preloads};
}

/** Head assets for the chosen profile. assetBase is relative to the HTML page. */
export function profileFontAssets(input=null,{assetBase=defaultFontAssetBase}={}){
 const profile=input===null?null:normalizeDesignProfile(input);
 if(input!==null&&!profile)throw new TypeError('A complete saved DDS design profile is required.');
 validateFontAssetBase(assetBase);
 return fontAssets(profile?.settings||DEFAULT_SETTINGS,assetBase);
}

export function profileTokens(input,dark=false){
 const settings=normalizeSettings(input?.settings||input);
 const colored=settings.primary!==DEFAULT_SETTINGS.primary||settings.colorMode==='functional';
 const tokens=colored?palette({colors:settings,multicolor:settings.colorMode==='functional'},dark):{};
 Object.assign(tokens,canvasTextTokens(settings,dark));
 tokens['--font-sans']=FONT_OPTIONS.find(font=>font.value===settings.bodyFont).family;
 tokens['--font-heading']=FONT_OPTIONS.find(font=>font.value===settings.headingFont).family;
 return tokens;
}

/** Save the returned stylesheet as ui/project-profile.css and load it last.
 * scoped=true matches ui/tokens-scoped.css and does not recolor the host app.
 * assetBase is relative to the saved stylesheet, not the JavaScript module.
 * includeFontImports=false lets the host link profileFontAssets().stylesheets in HTML.
 */
export function createProfileCSS(input,{scoped=false,assetBase=defaultFontAssetBase,includeFontImports=true}={}){
 const profile=normalizeDesignProfile(input);
 if(!profile)throw new TypeError('A complete saved DDS design profile is required.');
 validateFontAssetBase(assetBase);
 const settings=profile.settings;
 const imports=includeFontImports?fontAssets(settings,assetBase).stylesheets.map(url=>`@import url('${url}');`):[];
 const outer='.dds-ui:not(.dds-ui .dds-ui)',light=scoped?outer:':root';
 const dark=scoped?`:is([data-theme="dark"]) ${outer},${outer}[data-theme="dark"]`:':root[data-theme="dark"]';
 const declarations=dark=>Object.entries(profileTokens(settings,dark)).map(([name,value])=>`  ${name}: ${value};`).join('\n');
 const headingScope=scoped?'.dds-ui':':root';
 const canvasSelector=scoped?`${headingScope} [data-dds-page]`:':root body';
 const lines=[`/* DDS ${profile.ddsVersion}: saved ${profile.savedAt}. Load after DDS tokens and ui/dds.css. */`,...imports,`${light}{\n${declarations(false)}\n}`,`${dark}{\n${declarations(true)}\n}`,`${canvasSelector}{background:var(--page-background)}`,`${headingScope} :is(${headings}){font-family:var(--font-heading);--font-sans:var(--font-heading)}`];
 if(settings.colorMode==='functional'){
  // An explicit role is assigned by the page author; no automatic nth-child decoration.
  for(const role of ['secondary','accent','positive'])lines.push(`${headingScope} [data-dds-color-role="${role}"]{color:var(--direction-${role}-ink);background:var(--direction-${role}-soft);border-color:var(--direction-${role}-border)}`);
 }
 return lines.join('\n\n')+'\n';
}
