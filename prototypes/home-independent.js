// The landing page only introduces the service and links to the writing flow.
document.querySelectorAll('[data-icon]').forEach(node => {
 const glyph = window.lucide.icons[node.dataset.icon];
 if (glyph) node.replaceWith(window.lucide.createElement(glyph, {class:'icon', 'stroke-width':1.7, 'aria-hidden':'true', focusable:'false'}));
});
