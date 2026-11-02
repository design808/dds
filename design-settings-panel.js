import {PRIMARY_PRESETS,FUNCTIONAL_PRESETS,FONT_OPTIONS} from './design-preferences.js?v=3d0074ac8047139a';
import {HUE_GRADIENT,hexToHue,hueToHex} from './color-slider.js?v=3d0074ac8047139a';
const PRESETS=PRIMARY_PRESETS.map(({value,label})=>({value,name:label}));
const FONTS=FONT_OPTIONS.map(({value,label})=>({value,name:label}));
const normalizeHex = value => {
  const candidate = value.trim().replace(/^#/, '');
  return /^[0-9a-f]{6}$/i.test(candidate) ? '#' + candidate.toUpperCase() : null;
};

function createIcon(name) {
  const lucide = window.lucide;
  if (!lucide?.icons?.[name] || typeof lucide.createElement !== 'function') return null;
  return lucide.createElement(lucide.icons[name], {
    class: 'icon', width: 24, height: 24, 'stroke-width': 2,
    'aria-hidden': 'true', focusable: 'false'
  });
}

function iconButton(label, iconName, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.setAttribute('data-tooltip', label);
  const icon = createIcon(iconName);
  if (icon) button.append(icon);
  else button.textContent = iconName === 'X' ? '닫기' : '설정';
  return button;
}

function swatch(key, preset) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dds-settings-preset';
  button.dataset.ddsColorKey = key;
  button.dataset.ddsPreset = preset.value;
  button.style.setProperty('--swatch-color', preset.value);
  // The selection mark remains visible on light amber as well as dark swatches.
  const rgb = [1,3,5].map(i => parseInt(preset.value.slice(i,i+2),16)/255).map(v => v<=.04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  const luminance = rgb.reduce((sum,v,i) => sum+v*[.2126,.7152,.0722][i],0);
  button.style.setProperty('--swatch-mark', luminance>.35 ? '#172238' : '#FFFFFF');
  button.setAttribute('aria-pressed', 'false');
  const name = (preset.name||preset.label) + ' ' + preset.value + ' 색상 사용';
  button.setAttribute('aria-label', name);
  button.setAttribute('data-tooltip-disabled', '');
  const check = createIcon('Check');
  if (check) button.append(check);
  return button;
}

function colorField(key, label, withPresets=false) {
  const field = document.createElement('div');
  field.className = 'dds-settings-field';
  const id = 'dds-settings-' + key;
  field.innerHTML = `<label for="${id}">${label}</label>
    <div class="dds-settings-color-control" data-control-size="sm">
      <span class="dds-settings-color-dot" data-color-preview="${key}" aria-hidden="true"></span>
      <input id="${id}" type="text" data-dds-color="${key}" maxlength="7" pattern="#?[0-9a-fA-F]{6}" spellcheck="false" autocomplete="off" autocapitalize="characters" aria-describedby="${id}-error">
    </div>
    <p class="dds-settings-error" id="${id}-error" aria-live="polite" hidden></p>`;
  if (withPresets) {
    const presets = document.createElement('div');
    presets.className = 'dds-settings-presets';
    presets.setAttribute('role','group');
    presets.setAttribute('aria-label',label.replace(' HEX','')+' 색상 프리셋');
    for (const preset of PRIMARY_PRESETS) presets.append(swatch(key,preset));
    field.querySelector('label').after(presets);
  }
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'dds-settings-hue';
  slider.min = '0';
  slider.max = '360';
  slider.step = '1';
  slider.dataset.ddsHue = key;
  slider.setAttribute('aria-label', (key==='primary'?'브랜드':label.replace(' HEX',''))+' 색상 조절');
  const well = document.createElement('div');
  well.className = 'dds-settings-hue-well';
  well.style.setProperty('--hue-spectrum',CSS.supports('background-image',HUE_GRADIENT)?HUE_GRADIENT:HUE_GRADIENT.replace(' in oklab',''));
  well.append(slider);
  if (withPresets) field.querySelector('.dds-settings-color-control').before(well);
  else field.prepend(well);
  return field;
}

function fontField(key, label) {
  const field = document.createElement('div');
  field.className = 'dds-settings-field';
  field.innerHTML = `<label for="dds-settings-${key}">${label}</label>
    <select id="dds-settings-${key}" data-dds-setting="${key}" data-control-size="sm" aria-label="${label}">
      ${FONTS.map(font => `<option value="${font.value}">${font.name}</option>`).join('')}
    </select>`;
  for (const option of field.querySelectorAll('option')) {
    const font = FONT_OPTIONS.find(font => font.value===option.value);
    if (font?.family) option.style.fontFamily = font.family;
  }
  return field;
}

/** Mount the shared design controls. Persistence and application belong to the caller. */
export function mountDesignSettings({getSettings, updateSettings, resetSettings, subscribe}) {
  if (document.getElementById('dds-design-settings')) throw new Error('디자인 설정 패널이 이미 열려 있습니다.');
  for (const callback of [getSettings, updateSettings, resetSettings, subscribe]) {
    if (typeof callback !== 'function') throw new TypeError('디자인 설정 연결 함수를 확인해 주세요.');
  }

  const host = document.createElement('div');
  host.id = 'dds-design-settings';
  const launcher = iconButton('디자인 설정 열기', 'SlidersHorizontal', 'dds-settings-launcher');
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'dds-settings-dialog');

  const dialog = document.createElement('dialog');
  dialog.id = 'dds-settings-dialog';
  dialog.className = 'dds-settings-dialog';
  dialog.setAttribute('aria-labelledby', 'dds-settings-title');
  const heading = document.createElement('div');
  heading.className = 'dds-settings-heading dialog-heading';
  heading.innerHTML = '<h2 id="dds-settings-title">디자인 설정</h2>';
  const closeButton = iconButton('디자인 설정 닫기', 'X', 'dds-settings-close');
  closeButton.setAttribute('data-close', '');
  heading.append(closeButton);

  const body = document.createElement('div');
  body.className = 'dds-settings-body';
  const brandSection = document.createElement('section');
  brandSection.className = 'dds-settings-section';
  brandSection.setAttribute('aria-labelledby', 'dds-settings-brand-title');
  brandSection.innerHTML = '<h3 id="dds-settings-brand-title">브랜드 색상</h3>';
  const presets = document.createElement('div');
  presets.className = 'dds-settings-presets';
  presets.setAttribute('role', 'group');
  presets.setAttribute('aria-label', '브랜드 색상 프리셋');
  for (const preset of PRESETS) {
    presets.append(swatch('primary',preset));
  }
  brandSection.append(presets, colorField('primary', 'Primary HEX'));

  const modeSection = document.createElement('fieldset');
  modeSection.className = 'dds-settings-section dds-settings-mode';
  modeSection.innerHTML = `<legend>색상 사용</legend>
    <div class="dds-segmented">
      <label class="dds-choice"><input type="radio" name="dds-settings-color-mode" data-dds-setting="colorMode" value="brand"><span>메인 색상만 사용</span></label>
      <label class="dds-choice"><input type="radio" name="dds-settings-color-mode" data-dds-setting="colorMode" value="functional"><span>기능별로 다른 색상 사용</span></label>
    </div>`;

  const functionalSection = document.createElement('section');
  functionalSection.className = 'dds-settings-section dds-settings-functional';
  functionalSection.id = 'dds-settings-functional';
  functionalSection.setAttribute('aria-label', '기능별 색상');
  const combinations = document.createElement('div');
  combinations.className = 'dds-settings-combinations';
  combinations.setAttribute('role','group');
  combinations.setAttribute('aria-label','기능별 색상 조합');
  for (const preset of FUNCTIONAL_PRESETS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dds-settings-combination';
    button.dataset.ddsCombination = preset.id;
    button.setAttribute('aria-label',preset.label+' 조합 사용');
    button.setAttribute('data-tooltip-disabled','');
    button.setAttribute('aria-pressed','false');
    for (const key of ['secondary','accent','positive']) {
      const color = document.createElement('span');
      color.style.background = preset[key];
      button.append(color);
    }
    combinations.append(button);
  }
  functionalSection.append(
    combinations,
    colorField('secondary', '탐색 HEX',true),
    colorField('accent', 'AI HEX',true),
    colorField('positive', '완료 HEX',true)
  );

  const fontsSection = document.createElement('section');
  fontsSection.className = 'dds-settings-section';
  fontsSection.setAttribute('aria-labelledby', 'dds-settings-fonts-title');
  fontsSection.innerHTML = '<h3 id="dds-settings-fonts-title">서체</h3>';
  fontsSection.append(fontField('headingFont', '제목 서체'), fontField('bodyFont', '본문 서체'));
  body.append(brandSection, modeSection, functionalSection, fontsSection);

  const footer = document.createElement('div');
  footer.className = 'dds-settings-footer';
  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.className = 'dds-settings-reset btn';
  resetButton.textContent = '기본 설정으로 초기화';
  footer.append(resetButton);
  dialog.append(heading, body, footer);
  host.append(launcher, dialog);
  document.body.append(host);

  const controller = new AbortController();
  const {signal} = controller;
  const inputs = new Map([...host.querySelectorAll('[data-dds-color]')].map(input => [input.dataset.ddsColor, input]));
  const selects = new Map([...host.querySelectorAll('select[data-dds-setting]')].map(select => [select.dataset.ddsSetting, select]));
  const hueSliders = new Map([...host.querySelectorAll('[data-dds-hue]')].map(slider => [slider.dataset.ddsHue,slider]));
  const hueSelections = new Map();
  let focusBeforeOpen;
  let bodyOverflow;
  let pointerStartedOutside = false;
  let disposed = false;
  let syncing = false;
  let placementFrame;

  function placeLauncher() {
    placementFrame = null;
    if (disposed) return;
    const extra = parseFloat(host.style.getPropertyValue('--dds-settings-avoidance')) || 0;
    const current = launcher.getBoundingClientRect();
    const base = {left:current.left,right:current.right,top:current.top+extra,bottom:current.bottom+extra};
    const controls = [...document.querySelectorAll('footer button,footer a[href],#submit_btn,.resume-completion button')]
      .filter(control => !host.contains(control) && control.getClientRects().length)
      .map(control => control.getBoundingClientRect())
      .filter(rect => rect.top < innerHeight && rect.bottom > 0 && rect.right > base.left && rect.left < base.right);
    let offset = 0;
    for (let pass=0;pass<controls.length;pass++) {
      let changed = false;
      for (const rect of controls) {
        if (base.top-offset < rect.bottom+12 && base.bottom-offset > rect.top-12) {
          const next = Math.max(offset,base.bottom-rect.top+12);
          if (next > offset) { offset = next; changed = true; }
        }
      }
      if (!changed) break;
    }
    offset = Math.min(offset,Math.max(0,innerHeight-160));
    if (offset !== extra) host.style.setProperty('--dds-settings-avoidance',offset+'px');
  }

  function schedulePlacement() {
    if (!placementFrame) placementFrame = requestAnimationFrame(placeLauncher);
  }
  window.addEventListener('scroll',schedulePlacement,{passive:true,signal});
  window.addEventListener('resize',schedulePlacement,{passive:true,signal});
  const layoutObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(schedulePlacement) : null;
  layoutObserver?.observe(document.body);

  function clearError(input) {
    input.removeAttribute('aria-invalid');
    input.setCustomValidity('');
    const error = host.querySelector('#dds-settings-' + input.dataset.ddsColor + '-error');
    error.hidden = true;
    error.textContent = '';
  }

  function sync() {
    if (disposed) return;
    const settings = getSettings();
    for (const [key,slider] of hueSliders) {
      const selection = hueSelections.get(key);
      const hue = selection?.hex===settings[key] ? selection.hue : Math.round(hexToHue(settings[key]));
      if (selection?.hex!==settings[key]) hueSelections.delete(key);
      slider.value = String(hue);
      slider.style.setProperty('--hue-color',settings[key]);
      slider.setAttribute('aria-valuetext',settings[key]);
    }
    for (const [key, input] of inputs) {
      if (document.activeElement !== input) {
        input.value = settings[key];
        clearError(input);
      }
      const preview = host.querySelector('[data-color-preview="' + key + '"]');
      preview.style.background = settings[key];
    }
    for (const button of host.querySelectorAll('[data-dds-preset]')) {
      button.setAttribute('aria-pressed', String(button.dataset.ddsPreset === settings[button.dataset.ddsColorKey].toUpperCase()));
    }
    for (const button of combinations.children) {
      const preset = FUNCTIONAL_PRESETS.find(preset=>preset.id===button.dataset.ddsCombination);
      button.setAttribute('aria-pressed',String(['secondary','accent','positive'].every(key=>settings[key]===preset[key])));
    }
    for (const radio of modeSection.querySelectorAll('input')) radio.checked = radio.value === settings.colorMode;
    functionalSection.hidden = settings.colorMode !== 'functional';
    for (const [key, select] of selects) {
      if (select.value !== settings[key]) {
        select.value = settings[key];
        // Keep DDS's enhanced select trigger and its native value in sync.
        syncing = true;
        try {select.dispatchEvent(new Event('change', {bubbles: true}));}
        finally {syncing = false;}
      }
    }
    schedulePlacement();
  }

  function unlockBody() {
    if (!bodyOverflow) return;
    if (bodyOverflow.value) document.body.style.setProperty('overflow', bodyOverflow.value, bodyOverflow.priority);
    else document.body.style.removeProperty('overflow');
    if (bodyOverflow.padding) document.body.style.setProperty('padding-right',bodyOverflow.padding,bodyOverflow.paddingPriority);
    else document.body.style.removeProperty('padding-right');
    bodyOverflow = null;
  }

  function open() {
    if (dialog.open) return;
    sync();
    focusBeforeOpen = document.activeElement;
    bodyOverflow = {value: document.body.style.getPropertyValue('overflow'), priority: document.body.style.getPropertyPriority('overflow'),padding:document.body.style.getPropertyValue('padding-right'),paddingPriority:document.body.style.getPropertyPriority('padding-right')};
    const scrollbar = innerWidth-document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.setProperty('padding-right',(parseFloat(getComputedStyle(document.body).paddingRight)+scrollbar)+'px');
    document.body.style.setProperty('overflow', 'hidden');
    try {
      dialog.showModal();
      launcher.setAttribute('aria-expanded', 'true');
      closeButton.focus({preventScroll: true});
    } catch (error) {
      unlockBody();
      throw error;
    }
  }

  function isOutside(event) {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }

  launcher.addEventListener('click', open, {signal});
  closeButton.addEventListener('click', () => dialog.close(), {signal});
  dialog.addEventListener('pointerdown', event => {
    pointerStartedOutside = event.target === dialog && isOutside(event);
  }, {signal});
  dialog.addEventListener('click', event => {
    if (pointerStartedOutside && event.target === dialog && isOutside(event)) dialog.close();
    pointerStartedOutside = false;
  }, {signal});
  dialog.addEventListener('close', () => {
    launcher.setAttribute('aria-expanded', 'false');
    unlockBody();
    schedulePlacement();
    const target = focusBeforeOpen?.isConnected ? focusBeforeOpen : launcher;
    target.focus({preventScroll: true});
  }, {signal});

  host.addEventListener('click', event => {
    const button = event.target.closest('[data-dds-preset]');
    if (button) updateSettings({[button.dataset.ddsColorKey]: button.dataset.ddsPreset});
    const combination = event.target.closest('[data-dds-combination]');
    if (combination) {
      const preset = FUNCTIONAL_PRESETS.find(preset=>preset.id===combination.dataset.ddsCombination);
      updateSettings({secondary:preset.secondary,accent:preset.accent,positive:preset.positive});
    }
  }, {signal});
  host.addEventListener('change', event => {
    if (syncing) return;
    const input = event.target.closest('[data-dds-setting]');
    if (input && (input.tagName !== 'INPUT' || input.checked)) updateSettings({[input.dataset.ddsSetting]: input.value});
  }, {signal});
  for (const [key,slider] of hueSliders) {
    const changeHue = () => {
      const hue = Number(slider.value);
      const hex = hueToHex(hue);
      hueSelections.set(key,{hue,hex});
      updateSettings({[key]:hex});
      // End and Home share a red endpoint; retain the thumb even if HEX is unchanged.
      sync();
    };
    slider.addEventListener('input',changeHue,{signal});
    slider.addEventListener('keydown',event => {
      if (event.key!=='PageUp'&&event.key!=='PageDown') return;
      event.preventDefault();
      slider.value = String(Math.max(0,Math.min(360,Number(slider.value)+(event.key==='PageUp'?10:-10))));
      changeHue();
    },{signal});
  }
  for (const [key, input] of inputs) {
    input.addEventListener('input', () => {
      const value = normalizeHex(input.value);
      if (value) {
        clearError(input);
        updateSettings({[key]: value});
      } else if (input.hasAttribute('aria-invalid')) {
        input.setCustomValidity('HEX 코드를 6자리로 입력해 주세요.');
      }
    }, {signal});
    input.addEventListener('blur', () => {
      const value = normalizeHex(input.value);
      if (value) {
        input.value = getSettings()[key];
        clearError(input);
      } else {
        input.setAttribute('aria-invalid', 'true');
        input.setCustomValidity('HEX 코드를 6자리로 입력해 주세요.');
        const error = host.querySelector('#dds-settings-' + key + '-error');
        error.textContent = 'HEX 코드를 6자리로 입력해 주세요.';
        error.hidden = false;
      }
    }, {signal});
  }
  resetButton.addEventListener('click', () => {resetSettings(); sync();}, {signal});

  sync();
  const unsubscribe = subscribe(sync);
  return () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    if (placementFrame) cancelAnimationFrame(placementFrame);
    layoutObserver?.disconnect();
    if (typeof unsubscribe === 'function') unsubscribe();
    if (dialog.open) dialog.close();
    unlockBody();
    host.remove();
    if (focusBeforeOpen?.isConnected && focusBeforeOpen !== launcher) focusBeforeOpen.focus({preventScroll: true});
  };
}
