/** Project-owned theme overrides. Never modifies the versioned DDS source. */
import {normalizeSettings,DEFAULT_SETTINGS,FONT_OPTIONS} from '../design-preferences.js?v=b011fb4a3d820cd2';
import {normalizeDesignProfile} from '../design-profile.js?v=b011fb4a3d820cd2';
import {palette} from './profile-palette.js?v=b011fb4a3d820cd2';

const directories={wanted:'wanted-sans',paperlogy:'paperlogy',plex:'ibm-plex-kr',suite:'suite',serif:'noto-serif-kr',maruburi:'maruburi',hahmlet:'hahmlet'};
const headings='h1,h2,h3,h4,h5,h6,.dds-type-display-1,.dds-type-display-2,.dds-type-title-1,.dds-type-title-2,.dds-type-heading-1,.dds-type-heading-2,.dds-type-headline-1';

export function profileTokens(input,dark=false){
 const settings=normalizeSettings(input?.settings||input);
 const colored=settings.primary!==DEFAULT_SETTINGS.primary||settings.colorMode==='functional';
 const tokens=colored?palette({colors:settings,multicolor:settings.colorMode==='functional'},dark):{};
 tokens['--font-sans']=FONT_OPTIONS.find(font=>font.value===settings.bodyFont).family;
 tokens['--font-heading']=FONT_OPTIONS.find(font=>font.value===settings.headingFont).family;
 return tokens;
}

/** Save the returned stylesheet as ui/project-profile.css and load it last.
 * scoped=true matches ui/tokens-scoped.css and does not recolor the host app.
 * assetBase is relative to the saved stylesheet, not the JavaScript module.
 */
export function createProfileCSS(input,{scoped=false,assetBase='../assets/fonts/'}={}){
 const profile=normalizeDesignProfile(input);
 if(!profile)throw new TypeError('A complete saved DDS design profile is required.');
 if(typeof assetBase!=='string'||/[\s"'(){};\\]/.test(assetBase)||!assetBase.endsWith('/')||/^(?:javascript|data):/i.test(assetBase))throw new TypeError('Invalid DDS font asset base.');
 const settings=profile.settings;
 const imports=[...new Set([settings.headingFont,settings.bodyFont])].filter(key=>key!=='pretendard').map(key=>`@import url('${assetBase}${directories[key]}/fontfaces.css');`);
 const outer='.dds-ui:not(.dds-ui .dds-ui)',light=scoped?outer:':root';
 const dark=scoped?`:is([data-theme="dark"]) ${outer},${outer}[data-theme="dark"]`:':root[data-theme="dark"]';
 const declarations=dark=>Object.entries(profileTokens(settings,dark)).map(([name,value])=>`  ${name}: ${value};`).join('\n');
 const headingScope=scoped?'.dds-ui':':root';
 const lines=[`/* DDS ${profile.ddsVersion}: saved ${profile.savedAt}. Load after DDS tokens and ui/dds.css. */`,...imports,`${light}{\n${declarations(false)}\n}`,`${dark}{\n${declarations(true)}\n}`,`${headingScope} :is(${headings}){font-family:var(--font-heading);--font-sans:var(--font-heading)}`];
 if(settings.colorMode==='functional'){
  // An explicit role is assigned by the page author; no automatic nth-child decoration.
  for(const role of ['secondary','accent','positive'])lines.push(`${headingScope} [data-dds-color-role="${role}"]{color:var(--direction-${role}-ink);background:var(--direction-${role}-soft);border-color:var(--direction-${role}-border)}`);
 }
 return lines.join('\n\n')+'\n';
}
