---
name: craft-design-engineering
description: Design engineering concepts from Craft (craft.gustavofior.com) covering typography, color, layout, motion, sound, and data details that make interfaces feel right. Use when building or reviewing UI components, hover and press states, borders, shadows, border radius, icons, numbers, charts, animations, or when the user asks for polish, craft, taste, or to make something "feel better".
metadata:
  author: gustavo-fior
  source: https://craft.gustavofior.com
---

# Craft

A collection of design engineering concepts by Gustavo Fior. Each concept is a
short explainer with a rule you can apply directly, plus the CSS, Tailwind, or
React to do it. The live site pairs every concept with an interactive demo.

## How to use this skill

1. Find the concepts that match the work in the index below. A button needs
   the hover, press, and hit-area concepts; a table or timer needs tabular
   numbers; anything with an image needs image outlines.
2. Read the matching file in `references/` before writing code. Each concept
   there contains the full reasoning, the rule, and the code snippets. Do not
   apply a concept from the one-line summary alone.
3. Apply the rule, and prefer the site's exact values (durations, easings,
   radii, opacities) over inventing your own.
4. When reviewing existing UI, report each change as a row in a table with
   the columns Before, After, and Concept, linking the concept URL so the
   user can read and try the demo.
5. Only cite a concept that is in the index. If the question is outside the
   index, say so and fall back to general judgement.

## Principles

- Details that nobody notices still compound. Correct defaults on radius,
  spacing, easing, and contrast are what make an interface feel finished.
- Consistency beats novelty. Reuse the same two or three easings, the same
  radius ratios, and the same shadow recipe across the product.
- Motion has to earn its place. Frequent, intentional interactions should be
  instant; rare or spatial ones can animate.
- Respect physical intuition. Nothing appears from nothing, nested corners
  share a center, and light comes from above.

## Concept index

<!-- concepts:start -->
### Typography

- **Tabular Numbers**: Steady digits for values that change. ([reference](references/typography.md#tabular-numbers), [demo](https://craft.gustavofior.com/tabular-numbers))
- **Optical Alignment**: Center for the eye, not the math. ([reference](references/typography.md#optical-alignment), [demo](https://craft.gustavofior.com/optical-alignment))
- **Font Smoothing**: Light text on dark renders heavier. ([reference](references/typography.md#font-smoothing), [demo](https://craft.gustavofior.com/font-smoothing))

### Color

- **Noise**: Grain hides banding and adds texture. ([reference](references/color.md#noise), [demo](https://craft.gustavofior.com/noise))
- **Image Outlines**: A faint inner edge that frames images. ([reference](references/color.md#image-outlines), [demo](https://craft.gustavofior.com/image-outlines))

### Layout

- **Nested Border Radius**: Inner radius is outer minus padding. ([reference](references/layout.md#nested-border-radius), [demo](https://craft.gustavofior.com/nested-border-radius))
- **HTML Background**: Paint the canvas behind your page. ([reference](references/layout.md#html-background), [demo](https://craft.gustavofior.com/html-background))
- **Scroll Fades**: Fade the edge that has more to scroll. ([reference](references/layout.md#scroll-fades), [demo](https://craft.gustavofior.com/scroll-fades))

### Motion

- **Button Press**: Scale down on press so it feels real. ([reference](references/motion.md#button-press), [demo](https://craft.gustavofior.com/button-press))
- **Interruptibility**: Let people change their mind mid-motion. ([reference](references/motion.md#interruptibility), [demo](https://craft.gustavofior.com/interruptibility))
- **Hover Restraint**: Frequent interactions should be instant. ([reference](references/motion.md#hover-restraint), [demo](https://craft.gustavofior.com/hover-restraint))
<!-- concepts:end -->

## Keeping this skill current

This file and `references/` are generated from the site's content with
`bun run build:skill` in the Craft repository. Edit the articles, not the
references.
