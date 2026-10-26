// Apply the saved theme before styles paint; share the DDS preference on this origin.
(() => {
  const key = 'deep-theme';
  const root = document.documentElement;
  let theme = 'light';
  try { theme = localStorage.getItem(key) === 'dark' ? 'dark' : 'light'; } catch {}
  root.dataset.theme = theme;
  const update = () => {
    root.dataset.theme = theme;
    const button = document.querySelector('#appearance-toggle');
    if (!button) return;
    const label = theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
    button.setAttribute('aria-label', label);
    button.removeAttribute('title');
    const glyph = window.lucide.icons[theme === 'dark' ? 'Sun' : 'Moon'];
    button.replaceChildren(window.lucide.createElement(glyph, {
      class: 'icon', width: 20, height: 20, 'stroke-width': 1.8, 'aria-hidden': 'true', focusable: 'false'
    }));
  };
  document.addEventListener('DOMContentLoaded', () => {
    update();
    const button = document.querySelector('#appearance-toggle');
    if (!button) return;
    button.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, theme); } catch {}
      update();
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      theme = event.newValue === 'dark' ? 'dark' : 'light';
      update();
    }
  });
})();
