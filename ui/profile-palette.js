/** Shared color derivation for the settings preview and installed projects. */
const hex = value => {
  if (typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)) throw new Error('색상은 6자리 HEX 값이어야 합니다.');
  return value.toLowerCase();
};
const rgb = value => [1,3,5].map(index => parseInt(value.slice(index,index+2),16));
const mix = (first, second, ratio) => '#'+rgb(first).map((value,index) => Math.round(value*(1-ratio)+rgb(second)[index]*ratio).toString(16).padStart(2,'0')).join('');
const luminance = value => rgb(value).map(channel => channel/255).map(channel => channel<=.04045 ? channel/12.92 : ((channel+.055)/1.055)**2.4).reduce((sum,value,index) => sum+value*[.2126,.7152,.0722][index],0);
const contrast = (first,second) => (Math.max(luminance(first),luminance(second))+.05)/(Math.min(luminance(first),luminance(second))+.05);
const ink = (seed,background,dark,lightTarget='#17212f') => {
  const surfaces=Array.isArray(background)?background:[background];
  for(let step=0;step<=20;step++){
    const candidate=mix(seed,dark?'#ffffff':lightTarget,step/20);
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
const functionalForeground = fill => {
  if(contrast(fill,'#ffffff')>=4.5)return '#ffffff';
  if(contrast(fill,'#17212f')>=4.5)return '#17212f';
  return '#000000';
};
const functionalStates = (seed,dark) => {
  const foreground=functionalForeground(seed),activeRatio=dark?.18:.15,hoverRatio=dark?.10:.08;
  // Keep the label stable across states; switch the shading direction only if
  // the preferred direction cannot produce two distinct, readable colors.
  for(const target of (dark?['#ffffff','#000000']:['#000000','#ffffff'])){
    for(let step=100;step>0;step--){
      const active=mix(seed,target,activeRatio*step/100);
      const hover=mix(seed,target,hoverRatio*step/100);
      if(hover!==seed&&active!==hover&&contrast(hover,foreground)>=4.5&&contrast(active,foreground)>=4.5)return {hover,active};
    }
  }
  return {hover:seed,active:seed};
};
const functionalSoft = (seed,background,dark) => {
  // Bright colors retain their hue instead of being diluted to near white.
  const ratio=dark?.19:.075+Math.min(1,Math.max(0,(luminance(seed)-.25)/.45))*.225;
  return mix(background,seed,ratio);
};
const functionalStroke = (seed,surfaces,dark) => {
  for(let step=0;step<=100;step++){
    const candidate=mix(seed,dark?'#ffffff':'#17212f',step/100);
    if(surfaces.every(surface=>contrast(candidate,surface)>=3))return candidate;
  }
  return dark?'#ffffff':'#000000';
};

/** Page-canvas roles shared by the initial document paint and installed themes.
 * Self-contained so the document builder can embed this exact function.
 */
export function canvasTextTokens(settings={},dark=false){
  const value=dark?'#17191c':settings?.pageBackground||'#ffffff';
  if(typeof value!=='string'||!/^#[0-9a-f]{6}$/i.test(value))throw new TypeError('화면 배경은 6자리 HEX 값이어야 합니다.');
  const background=value.toLowerCase();
  const luminance=color=>[1,3,5].map(index=>parseInt(color.slice(index,index+2),16)/255)
    .map(channel=>channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4)
    .reduce((sum,channel,index)=>sum+channel*[.2126,.7152,.0722][index],0);
  const contrast=color=>(Math.max(luminance(color),luminance(background))+.05)/(Math.min(luminance(color),luminance(background))+.05);
  const seed=dark?[148,157,170]:[107,114,124];
  let tertiary=dark?'#949daa':'#6b727c';
  for(let delta=0;delta<=255;delta++){
    const candidate='#'+seed.map(channel=>Math.max(0,Math.min(255,channel+(dark?delta:-delta))).toString(16).padStart(2,'0')).join('');
    if(contrast(candidate)>=4.5){tertiary=candidate;break;}
    if(delta===255)tertiary=dark?'#000000':'#ffffff';
  }
  return {'--page-background':background,'--workspace-background':'var(--page-background)','--text-tertiary':tertiary};
}

export function palette(profile,dark){
  // The page canvas is independent from cards, controls and popovers.
  const surface=dark?'#17191c':'#ffffff';
  const canvas=canvasTextTokens(profile.colors,dark);
  const background=canvas['--page-background'];
  const muted=dark?'#292d33':'#f1f2f4';
  const primary=hex(profile.colors?.primary||'#ffad31');
  const secondary=hex(profile.colors?.secondary||primary);
  const accent=hex(profile.colors?.accent||secondary);
  const positive=hex(profile.colors?.positive||'#18734b');
  const sameOrange=primary==='#ffad31';
  const primarySoft=sameOrange?(dark?'#381d13':'#fff9ef'):mix(surface,primary,dark?.18:.07);
  const primaryInk=backgrounds=>sameOrange
    ? ink(dark?'#ffbe5c':'#c44000',backgrounds,dark,'#000000')
    : ink(primary,backgrounds,dark);
  const primaryStates=sameOrange
    ? {hover:dark?'#ffbe5c':'#ff941a',active:dark?'#ffca7a':'#e8750a'}
    : filledStates(primary,dark);
  const roles={...canvas};
  if(!sameOrange){
    for(const [step,ratio] of [[50,.96],[100,.90],[200,.75],[300,.55],[400,.30]])roles[`--brand-${step}`]=mix(primary,'#ffffff',ratio);
    roles['--brand-500']=primary;
    for(const [step,ratio] of [[600,.10],[700,.23],[800,.38],[900,.53],[950,.67]])roles[`--brand-${step}`]=mix(primary,'#000000',ratio);
    roles['--chart-primary-stroke']='var(--brand-700)';
  }
  for(const [name,value] of Object.entries({primary,secondary,accent,positive})){
    const soft=name==='primary'?mix(surface,value,dark?.19:.075):functionalSoft(value,surface,dark);
    const aiTint=mix(surface,value,dark?.20:.12);
    const states=name==='primary'?primaryStates:functionalStates(value,dark);
    roles[`--direction-${name}`]=value;
    const inkSurfaces=[background,surface,muted,soft,aiTint];
    roles[`--direction-${name}-ink`]=name==='primary'?primaryInk(inkSurfaces):ink(value,inkSurfaces,dark);
    roles[`--direction-${name}-soft`]=soft;
    roles[`--direction-${name}-border`]=mix(surface,value,dark?.42:.24);
    roles[`--direction-${name}-hover`]=states.hover;
    roles[`--direction-${name}-active`]=states.active;
    if(name!=='primary'){
      roles[`--direction-${name}-foreground`]=functionalForeground(value);
      roles[`--direction-${name}-hover-foreground`]=functionalForeground(states.hover);
      roles[`--direction-${name}-active-foreground`]=functionalForeground(states.active);
      roles[`--direction-${name}-stroke`]=functionalStroke(value,[background,surface,muted,soft,aiTint],dark);
    }
  }
  Object.assign(roles,{
    '--primary':primary,
    '--primary-hover':primaryStates.hover,
    '--primary-active':primaryStates.active,
    '--primary-foreground':'#ffffff',
    '--primary-border':'transparent',
    '--brand-ink':roles['--direction-primary-ink'],
    '--active-state-ink':sameOrange?'#e8750a':'initial',
    '--accent':primarySoft,
    '--accent-foreground':primaryInk([background,surface,muted,primarySoft]),
    '--accent-border':sameOrange?(dark?'#554022':'#fff0d6'):mix(surface,primary,dark?.40:.22),
    '--ring':primary,
    '--text-link':primaryInk([background,surface]),
    '--direction-glow':mix(background,primary,dark?.16:.13)
  });
  const ai=profile.multicolor?accent:primary;
  Object.assign(roles,{
    '--ai-input-border':mix(surface,ai,dark?.30:.20),
    '--ai-input-background':[
      `radial-gradient(ellipse 100% 160% at 5% 15%, ${mix(surface,ai,dark?.15:.055)} 0%, transparent 85%)`,
      `radial-gradient(ellipse 110% 160% at 100% 20%, ${mix(surface,secondary,dark?.12:.035)} 0%, transparent 90%)`,
      `radial-gradient(ellipse 110% 150% at 55% 100%, ${mix(surface,positive,dark?.09:.025)} 0%, transparent 90%)`,
      `linear-gradient(110deg,${mix(surface,ai,dark?.08:.025)},${mix(surface,secondary,dark?.07:.02)})`
    ].join(',')
  });
  if(profile.multicolor){
    const successBg=roles['--direction-positive-soft'];
    const infoBg=roles['--direction-secondary-soft'];
    const successInk=ink(positive,[background,surface,successBg],dark);
    const infoInk=ink(secondary,[background,surface,infoBg],dark);
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

