# DDS V2 Astryx design spec

DDS V2 keeps DDS markup, behavior and color tokens, and takes everything else from
Astryx neutral (`@astryxdesign/core` and `@astryxdesign/theme-neutral` 0.7.11, MIT,
Copyright (c) Meta Platforms, Inc.). Values below were measured from Astryx components
rendered in Chromium at 1280px.

## Rules

1. Colors come only from DDS tokens: `--primary`, `--primary-hover`, `--primary-active`,
   `--primary-foreground`, `--background`, `--surface`, `--muted`, `--border`,
   `--control-border`, `--text-strong`, `--text-primary`, `--text-secondary`,
   `--text-tertiary`, `--text-placeholder`, `--text-disabled`, `--text-inverse`,
   `--surface-inverse`, `--accent`, `--accent-foreground`, `--brand-ink`, `--ring`,
   status `--success`/`--success-bg`, `--warning`/`--warning-bg`,
   `--destructive`/`--destructive-bg`, `--info`/`--info-bg`, and the derived
   `--astryx-fill*`, `--astryx-overlay-hover`, `--astryx-badge-fill` (mixes of DDS ink).
   Never write a hex or rgb color. Shadows use `--astryx-shadow-*`.
2. Shape, size, type, spacing, elevation and motion come from the `--astryx-*` and
   DDS type tokens in `tokens.css`. Avoid raw px when a token exists.
3. Restyle with overlay files loaded last. Do not edit DDS source CSS or markup.
4. The design settings panel must keep working: brand color, page background,
   fonts and light/dark change through DDS tokens.

## Foundations

| Item | Astryx value | Token |
| --- | --- | --- |
| Font | Figtree, Korean in Pretendard | `--font-sans` |
| Display 1/2/3 | 42/52, 35/44, 29/40, weight 400 | `--type-display-1`, `--type-display-2`, `--type-title-1` |
| Heading 1 | 24/32 600 | `--type-heading-1`, `--type-title-2` |
| Heading 2 | 20/28 600 | `--type-heading-2` |
| Heading 3 | 17/24 700 | `--type-headline-1` |
| Heading 4 | 14/20 700 | body size, weight 700 |
| Body | 14/20 400 | `--type-body-1-*` |
| Large | 17/24 600 | headline size, weight 600 |
| Label | 14/20 500 | `--type-label-1-*` |
| Supporting | 12/20 400 | `--type-body-2-*`, `--type-caption-1-*` |
| Code | 14/20 mono | `--font-mono` |
| Spacing | 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48 | `--astryx-space-*` |
| Radius | inner 6, menu item 8, element 10, container 12, page 28, full | `--astryx-radius-*` |
| Control height | 28 / 32 / 36 | `--astryx-size-*`, `--control-height-*` |
| Elevation | low (hover cards), med (menus, popovers, toasts), high (dialogs) | `--astryx-shadow-*` |
| Scrim | black 50% (dark 80%) | `--astryx-scrim` |
| Hairline | 1px | `--border` |
| Control border | 1px | `--control-border` |
| Focus | 2px solid ring, offset 3px | `--astryx-focus`, `--ring` |
| Motion | 125ms / 300ms, cubic-bezier(.24,1,.4,1) | `--duration-*`, `--ease-*` |

Astryx has no letter-spacing, no uppercase labels, and almost no borders on controls
other than inputs. Cards and panels separate by a 1px hairline, not by shadow.

## Components

| Component | Astryx | DDS color mapping |
| --- | --- | --- |
| Button | height 32 (28/36), padding 6x12, radius 10, 14/20 500, no border, gap 8, icon 16 | primary: `--primary` / `--primary-foreground`; secondary: `--astryx-fill` / `--text-primary`; ghost: transparent; destructive: `--destructive` / white; hover mixes 5–10% ink; disabled opacity .5 |
| Icon button | 32x32, radius 10 | same as Button |
| Button group | joined, outer radius 10, 1px `--border` between items | |
| Toggle button | pressed fill 10% ink | `--astryx-fill-hover` |
| Chip / token | height 24, padding 0x8, radius 6, 12/20 500 | `--astryx-fill`; selected `--primary` / `--primary-foreground` |
| Badge | height 20, padding 0x8, radius full, 12/20 500 | neutral `--astryx-badge-fill` / `--text-primary`; status solid `--success`, `--info`, `--warning`, `--destructive` with `--background` text |
| Input, select, textarea | height 32, padding 4x8, radius 10, 1px border, 14/20 | border `--control-border`, fill `--background`; focus border `--primary` + inset 2px `--control-border` |
| Field label | 14/20 500 | `--text-secondary`; description 12/20 `--text-secondary` |
| Checkbox | 24, radius 6 | border `--control-border`; checked `--primary` |
| Radio | 24 round, dot 10 | same |
| Switch | track 40x24 radius full, thumb 20 | off `--control-border`, on `--primary`, thumb `--background` |
| Slider | track 4, thumb 20 | track `--control-border`, range and thumb `--primary` |
| Progress | height 8, radius full | track `--control-border`, fill `--primary` |
| Segmented control | track padding 4 radius 10; item height 24 radius 6, 14/20 500 | track `--astryx-fill`; selected `--background`, 600 `--text-primary`; idle `--text-secondary` |
| Tabs | item height 32, padding 0x12, radius 10, 14/20 400; selected 600 with 2px indicator | idle `--text-secondary`, selected `--text-primary`, indicator `--primary` |
| Side navigation | item height 32, padding 0x8, radius 10, 14/20 400; section title 12/20 600 | selected `--astryx-fill`, 500 `--text-primary`; section `--text-secondary` |
| Top navigation | item height 32, padding 6x12, radius 10, 14/20 500; title 17/24 600 | idle `--text-secondary`; selected `--astryx-fill`, 600 `--text-primary` |
| Breadcrumb | 14/20, gap 4, separator "/" | `--text-secondary`; current 600 `--text-primary` |
| Pagination | 32x32, radius 10, 14/20 500 | current `--astryx-fill` |
| Stepper | 4px bars radius full; number 16 circle 10/15 600; label 14/20 600 | bars `--border`, done/active `--primary`; number `--muted` |
| Table | no outer frame; th 14/21 600 padding 8x12; td 14/21 padding 8x12; 1px rows | th `--text-secondary`; rules `--border`; header no fill |
| Card | radius 12, padding 12, 1px hairline, no shadow | `--background`, `--border`; interactive hover `--astryx-shadow-low` |
| List item | padding 8, radius 10; label 14/20, description 12/20 | description `--text-secondary`; hover `--astryx-overlay-hover`; selected `--astryx-fill` |
| Accordion | no frame; trigger 17/24 600, 12px vertical; 1px dividers | `--border` |
| Dialog | radius 12, padding 16, `--astryx-shadow-high`; title 20/28 600; subtitle 12; close 32 | `--background`; scrim `--astryx-scrim` |
| Menu, popover, dropdown | radius 12, padding 4, gap 2, `--astryx-shadow-med`; item radius 8, padding 6x8, 14/20 | `--background`; item hover `--astryx-overlay-hover` |
| Tooltip | padding 4x8, radius 12, 14/20 | `--surface-inverse` / `--text-inverse` |
| Toast | radius 12, padding 16, `--astryx-shadow-med`, 14/20 | `--surface-inverse` / `--text-inverse` |
| Alert / banner | radius 12, padding 12x16; title 14/20 600; text 12/20; icon 16 | tone `*-bg` fill, tone ink |
| Empty state | title 17/24 600; text 14/20 | text `--text-secondary` |
| Skeleton | radius 12 | `--muted` |
| Avatar | 36, radius full, 14/20 500 | `--astryx-fill` / `--text-primary` |
| Divider | 1px; label 12/20, padding 0x12 | `--border`; label `--text-secondary` |
| Kbd | height 20, padding 0x4, radius 6, 12/20 500, 2px bottom border | `--astryx-fill`, border `--control-border` |
| Inline code | padding 0x4, radius 6, 14/21 mono | `--muted` |
| Code block | radius 10, 1px hairline; header padding 8x16 | `--background`, `--border` |
| File drop zone | radius 10, padding 24x16, 1px dashed | `--control-border` |
| Calendar day | 28x28 radius full, 14/21; today inset 1px ring | selected `--primary`; ring `--control-border` |
| Link | no underline, underline on hover | `--brand-ink` |

## Pages

- Top bar: Astryx TopNav. Title 17/24 600, items as above, 1px bottom hairline, no shadow.
- Sidebar: Astryx SideNav. 240px, items 32px, section titles 12/20 600.
- Content: headings by the scale above, body 14/20, sections separated by 24–48px.
- Panels: Card rules. Popovers and drawers: menu and dialog rules.
