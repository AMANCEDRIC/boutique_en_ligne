---
name: Premium Editorial Aesthetic
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1b'
  on-tertiary-container: '#838483'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e2e3e1'
  tertiary-fixed-dim: '#c6c7c5'
  on-tertiary-fixed: '#1a1c1b'
  on-tertiary-fixed-variant: '#454746'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  h1-editorial:
    fontFamily: notoSerif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2-editorial:
    fontFamily: notoSerif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3-ui:
    fontFamily: inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  body-main:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-sm:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  cta:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 60px
---

## Brand & Style

The design system is rooted in **Modern Minimalism**, blending the architectural precision of Apple with the high-fashion editorial pacing of Zara and the kinetic energy of Nike. The brand persona is authoritative yet understated, prioritizing the product (imagery) over the interface. 

The UI evokes a sense of "quiet luxury"—calm, expansive, and intentional. Every element exists to provide clarity and a premium tactile feel. Large whitespace is used not just for breathing room, but as a structural element to elevate the content. Transitions are deliberate and eased, mimicking the smooth motion of a physical luxury retail experience. The mobile-first approach ensures that the "thumb-driven" ergonomics feel effortless, while the desktop experience expands into a cinematic, editorial layout.

## Colors

The palette is restricted to a high-contrast monochromatic base with sophisticated tonal accents. 

- **Pure White (#FFFFFF):** Serves as the primary canvas, creating an expansive, gallery-like atmosphere.
- **Deep Black (#000000):** Used for primary typography, iconography, and high-impact CTA buttons to create grounded focal points.
- **Greige (#F5F5F3):** Utilized for section backgrounds and secondary containers to soften the transition between pure white and imagery.
- **Light Gray (#E5E5E5):** Reserved for subtle dividers, borders, and disabled states.
- **Gold (#D4AF37):** Used exclusively as a "prestige accent" for microscopic details like active pagination dots, premium badge outlines, or hover-state highlights. It should never be used for large surfaces.

## Typography

This design system employs a dual-typeface strategy to balance editorial flair with functional utility.

- **Headlines:** Use **Noto Serif** for a sophisticated, magazine-style feel. It should be set with tight line height and slightly negative letter spacing to create a dense, authoritative "block" of text.
- **UI & Body:** Use **Inter** for all functional elements. Its neutrality ensures readability at small scales and high legibility for technical product details.
- **Labeling:** Small labels and navigational metadata should use Inter in Uppercase with wide letter spacing (10%) to provide a distinct visual hierarchy without adding weight.

## Layout & Spacing

The layout philosophy follows a **Fluid Editorial Grid** that prioritizes negative space as much as the content itself. 

- **Grid:** A 12-column grid for desktop and a 4-column grid for mobile. Elements should often "break" the grid or span wide widths to mimic fashion lookbooks.
- **Margins:** Large outer margins (60px+) on desktop focus the user's attention inward, creating a "frame" effect for the interface.
- **Rhythm:** Spacing follows a 4px base unit. Use generous vertical padding (`xl` or `64px+`) between sections to prevent the UI from feeling "crowded" or utilitarian.
- **Containers:** Max-width containers are used for text-heavy content, while product galleries are allowed to stretch to the viewport edges.

## Elevation & Depth

To maintain a minimalist aesthetic, the design system avoids heavy shadows and skeuomorphism. Instead, depth is communicated through **Tonal Layering** and **Low-Contrast Outlines**.

- **Layers:** Most surfaces are flat. Elevation is created by placing white cards on Greige (#F5F5F3) backgrounds.
- **Shadows:** When necessary (e.g., floating navigation or product hover), use "Ambient Shadows"—ultra-diffused, 10% opacity black with a 20px-40px blur and no offset. It should look like a soft glow rather than a shadow.
- **Borders:** Use hairline borders (0.5px or 1px) in Light Gray (#E5E5E5). This provides structure without the "boxiness" of standard web frameworks.
- **Glassmorphism:** Use subtle backdrop blurs (10px-15px) on sticky navigation bars to maintain the feeling of light and airiness.

## Shapes

The design system utilizes **Sharp** edges (0px radius) to evoke the precision of high-end tailoring and architecture. 

Sharp corners provide a more formal, high-fashion aesthetic compared to rounded UI. This applies to buttons, input fields, image containers, and cards. For specific interactive elements that require a softer touch (like notification badges or chips), a maximum radius of 2px may be applied, but the general rule is "square and structured."

## Components

Components are based on DaisyUI logic but heavily customized for the luxury sector.

- **Buttons:** 
  - *Primary:* Solid Black, white text, sharp corners, no border. Hover state: subtle opacity shift (90%).
  - *Secondary:* Transparent background, 1px Black border.
  - *Tertiary:* Underlined text only, mimicking editorial links.
- **Inputs:** Underline-style inputs (border only on the bottom) or 1px Light Gray borders on all sides. Use Inter with `label-caps` for field headers.
- **Cards:** No borders or shadows by default. The image occupies 100% of the card width, with typography left-aligned underneath. On hover, the image should subtly scale (e.g., `scale-105`) with a 0.4s ease-in-out transition.
- **Chips/Badges:** Minimalist rectangles with Greige backgrounds and Black text. No rounded corners.
- **Navigation:** Mobile-first bottom navigation or a minimalist "hamburger" that opens a full-screen white-out menu with large Serif headlines.
- **Product Tiles:** Focus on large, high-resolution imagery. Price and title should be small and secondary to the visual.