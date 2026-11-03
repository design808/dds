// Recolor the authored orange pixels only. Original image files remain unchanged.
const DEFAULT_PRIMARY = '#FFAD31';
const LOGO_ANCHORS = new Map([
  ['deepresume-logo.png', '#FFAD31'],
  ['deepresume-mark.png', '#FFAD31'],
  ['deepinterview-logo.png', '#FFA031']
]);

const hexRGB = value => value.slice(1).match(/../g).map(part => parseInt(part, 16));

function rgbHSL(red, green, blue) {
  const [r, g, b] = [red, green, blue].map(value => value / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  const lightness = (max + min) / 2;
  if (!delta) return [0, 0, lightness];
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  hue = ((hue * 60) + 360) % 360;
  return [hue, saturation, lightness];
}

function hslRGB(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
  const match = lightness - chroma / 2;
  const channels = hue < 60 ? [chroma, x, 0] : hue < 120 ? [x, chroma, 0] : hue < 180 ? [0, chroma, x] : hue < 240 ? [0, x, chroma] : hue < 300 ? [x, 0, chroma] : [chroma, 0, x];
  return channels.map(value => Math.round((value + match) * 255));
}

/** Pure pixel transform used by the runtime; alpha and neutral pixels are preserved. */
export function recolorBrandPixels(source, anchor, primary) {
  const result = new Uint8ClampedArray(source);
  const [targetHue, targetSaturation, targetLightness] = rgbHSL(...hexRGB(primary));
  const [, anchorSaturation, anchorLightness] = rgbHSL(...hexRGB(anchor));
  for (let index = 0; index < result.length; index += 4) {
    if (!source[index + 3]) continue;
    const [hue, saturation, lightness] = rgbHSL(source[index], source[index + 1], source[index + 2]);
    // The authored brand is orange. White details, neutral edges and shadows stay intact.
    if (hue < 12 || hue > 60 || saturation < .25) continue;
    const mappedLightness = lightness <= anchorLightness
      ? targetLightness * lightness / anchorLightness
      : targetLightness + (1 - targetLightness) * (lightness - anchorLightness) / (1 - anchorLightness);
    const color = hslRGB(targetHue, Math.min(1, targetSaturation * saturation / anchorSaturation), mappedLightness);
    result.set(color, index);
  }
  return result;
}

export function createBrandLogoSync(doc) {
  const win = doc.defaultView;
  const entries = new Map();
  const sources = new Map();
  const rendered = new Map();
  let primary = DEFAULT_PRIMARY;
  let revision = 0;
  let disposed = false;
  let scanPending = false;

  function sourceFor(url) {
    if (sources.has(url)) return sources.get(url);
    const loading = new Promise((resolve, reject) => {
      const image = new win.Image();
      image.onload = () => {
        try {
          const canvas = doc.createElement('canvas');
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext('2d', {willReadFrequently: true});
          if (!context) throw new Error('Logo canvas is unavailable.');
          context.drawImage(image, 0, 0);
          resolve({width: canvas.width, height: canvas.height, pixels: context.getImageData(0, 0, canvas.width, canvas.height).data});
        } catch (error) { reject(error); }
      };
      image.onerror = () => reject(new Error('Logo image could not be loaded.'));
      image.src = url;
    });
    sources.set(url, loading);
    return loading;
  }

  async function render(entry, color) {
    const key = entry.url + '|' + color;
    if (rendered.has(key)) return rendered.get(key);
    const loading = sourceFor(entry.url).then(({width, height, pixels}) => {
      const canvas = doc.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Logo canvas is unavailable.');
      const image = context.createImageData(width, height);
      image.data.set(recolorBrandPixels(pixels, entry.anchor, color));
      context.putImageData(image, 0, 0);
      return canvas.toDataURL('image/png');
    });
    rendered.set(key, loading);
    // Keep HEX editing from retaining an unbounded number of raster variants.
    if (rendered.size > 24) rendered.delete(rendered.keys().next().value);
    return loading;
  }

  function applyEntry(image, entry) {
    const ticket = revision, color = primary;
    if (color === DEFAULT_PRIMARY) {
      entry.rendered = entry.original;
      if (image.getAttribute('src') !== entry.original) image.setAttribute('src', entry.original);
      delete image.dataset.ddsLogoColor;
      return;
    }
    render(entry, color).then(url => {
      if (disposed || ticket !== revision || !image.isConnected || entries.get(image) !== entry) return;
      entry.rendered = url;
      if (image.getAttribute('src') !== url) image.setAttribute('src', url);
      image.dataset.ddsLogoColor = color;
    }).catch(() => {
      // An unavailable canvas/image leaves the existing, usable logo in place.
      if (disposed || ticket !== revision || entries.get(image) !== entry) return;
      entry.rendered = entry.original;
      image.setAttribute('src', entry.original);
      delete image.dataset.ddsLogoColor;
    });
  }

  function scan() {
    scanPending = false;
    if (disposed) return;
    for (const [image] of entries) if (!image.isConnected) entries.delete(image);
    for (const image of doc.querySelectorAll('img[src]')) {
      const original = image.getAttribute('src');
      const known = entries.get(image);
      if (known && (original === known.original || original === known.rendered)) continue;
      entries.delete(image);
      let url;
      try { url = new URL(original, doc.baseURI); } catch { continue; }
      const anchor = LOGO_ANCHORS.get(url.pathname.split('/').pop());
      if (!anchor || url.origin !== win.location.origin) continue;
      const entry = {original, url: url.href, anchor, rendered: original};
      entries.set(image, entry);
      applyEntry(image, entry);
    }
  }

  const observer = new win.MutationObserver(() => {
    if (!scanPending && !disposed) { scanPending = true; queueMicrotask(scan); }
  });
  observer.observe(doc.body, {subtree: true, childList: true, attributes: true, attributeFilter: ['src']});
  scan();
  return {
    update(value) {
      const next = typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : DEFAULT_PRIMARY;
      if (disposed || next === primary) return;
      primary = next;
      revision++;
      scan();
      for (const [image, entry] of entries) applyEntry(image, entry);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      revision++;
      observer.disconnect();
      for (const [image, entry] of entries) {
        image.setAttribute('src', entry.original);
        delete image.dataset.ddsLogoColor;
      }
      entries.clear();
      sources.clear();
      rendered.clear();
    }
  };
}
