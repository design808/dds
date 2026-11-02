// Palette sampled from the reference spectrum; the conversion below is an
// independent OKLab implementation. No reference application code is included.
// Slider positions describe this palette, not the HSL hue of an arbitrary HEX.
const spectrum = [
  '#E63125','#DC4600','#CD5900','#C16500','#B76D00','#AE7300',
  '#A57800','#9C7D00','#938200','#888600','#7A8B00','#689100',
  '#4A9700','#009C26','#009A53','#009969','#009778','#009684',
  '#00958E','#009397','#0092A0','#0090A9','#008EB4','#008CC0',
  '#0089CF','#0083E5','#2C77FF','#5E6CFF','#7E60F9','#9756ED',
  '#AC4CDC','#BE42C6','#CD39AD','#D83191','#E12B73','#E52B51',
  '#E63125'
];

export const HUE_GRADIENT = 'linear-gradient(90deg in oklab,' +
  spectrum.map((hex, index) => `${hex} ${Number((index / 36 * 100).toFixed(6))}%`).join(',') + ')';

function normalizeHex(value) {
  if (typeof value !== 'string' || !/^#?[0-9a-f]{6}$/i.test(value.trim())) {
    throw new TypeError('색상은 6자리 HEX 값이어야 합니다.');
  }
  return '#' + value.trim().replace(/^#/, '').toUpperCase();
}

function hexToLab(hex) {
  const [red, green, blue] = [1, 3, 5].map(index => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(.4122214708 * red + .5363325363 * green + .0514459929 * blue);
  const m = Math.cbrt(.2119034982 * red + .6806995451 * green + .1073969566 * blue);
  const s = Math.cbrt(.0883024619 * red + .2817188376 * green + .6299787005 * blue);
  return [
    .2104542553 * l + .7936177850 * m - .0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + .4505937099 * s,
    .0259040371 * l + .7827717662 * m - .8086757660 * s
  ];
}

function labToHex([lightness, a, b]) {
  const l = (lightness + .3963377774 * a + .2158037573 * b) ** 3;
  const m = (lightness - .1055613458 * a - .0638541728 * b) ** 3;
  const s = (lightness - .0894841775 * a - 1.2914855480 * b) ** 3;
  const channels = [
    4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
    -.0041960863 * l - .7034186147 * m + 1.7076147010 * s
  ];
  return '#' + channels.map(value => {
    const encoded = value <= .0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - .055;
    return Math.round(Math.max(0, Math.min(1, encoded)) * 255).toString(16).padStart(2, '0');
  }).join('').toUpperCase();
}

// The observed blue selection is an additional exact anchor between 250/260.
const stops = spectrum.map((hex, index) => ({hue: index * 10, hex}));
stops.push({hue: 257, hex: '#007AFF'});
stops.sort((first, second) => first.hue - second.hue);
for (const stop of stops) stop.lab = hexToLab(stop.hex);

/** A finite slider position is clamped to 0–360 and mapped to a standard tone. */
export function hueToHex(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError('색상 슬라이더 값은 유한한 숫자여야 합니다.');
  }
  const hue = Math.max(0, Math.min(360, value));
  const end = stops.findIndex(stop => stop.hue >= hue);
  const second = stops[end];
  if (second.hue === hue) return second.hex;
  const first = stops[end - 1];
  const ratio = (hue - first.hue) / (second.hue - first.hue);
  return labToHex(first.lab.map((channel, index) => channel + (second.lab[index] - channel) * ratio));
}

/**
 * Locate an arbitrary HEX on the closest OKLab spectrum segment. This is for
 * positioning the thumb only: callers retain the original HEX until the user
 * moves the slider. Colors outside this spectrum are deliberately not replaced.
 */
export function hexToHue(value) {
  const hex = normalizeHex(value);
  const exact = stops.find(stop => stop.hex === hex);
  if (exact) return exact.hue;
  const target = hexToLab(hex);
  let closestHue = 0, closestDistance = Infinity;
  for (let index = 1; index < stops.length; index++) {
    const first = stops[index - 1], second = stops[index];
    const direction = first.lab.map((channel, axis) => second.lab[axis] - channel);
    const lengthSquared = direction.reduce((sum, channel) => sum + channel * channel, 0);
    if (!lengthSquared) continue;
    const projection = target.reduce((sum, channel, axis) => sum + (channel - first.lab[axis]) * direction[axis], 0) / lengthSquared;
    const ratio = Math.max(0, Math.min(1, projection));
    const distance = target.reduce((sum, channel, axis) => sum + (channel - first.lab[axis] - ratio * direction[axis]) ** 2, 0);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestHue = first.hue + (second.hue - first.hue) * ratio;
    }
  }
  return closestHue;
}
