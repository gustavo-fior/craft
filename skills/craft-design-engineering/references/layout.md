# Layout

## Nested Border Radius

> Inner radius is outer minus padding.

- Section: Layout
- URL: https://craft.gustavofior.com/nested-border-radius
- Published: 2026-07-14
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/nested-border-radius.mdx

Rounded corners look best when one curve follows the other. If a box sits
inside another box, using the same radius on both usually makes the gap wider
near the corner.

This is one of those little things that makes an interface feel off.

> **Interactive demo: Nested Radius.** Open https://craft.gustavofior.com/nested-border-radius to try it.

The fix is a simple relationship:

> **outer radius = inner radius + inset**

The inset is the distance between the two edges. It is often the parent’s
padding. If the parent has a border, include its width too.

In the demo, the inner radius is `16px` and the inset is `12px`. That makes the
outer radius `28px`.

### Start from the outer radius

Design systems usually start with a radius on the outer component. In that
case, reverse the formula:

> **inner radius = outer radius − inset**

> **Interactive demo: Radius Calculator.** Open https://craft.gustavofior.com/nested-border-radius to try it.

The inner radius cannot go below zero. If the inset is larger than the outer
radius, use a square inner corner. In CSS, `max()` can handle that limit for
you.

### Real components

The difference is easier to see in a card or a menu than in an empty diagram.

> **Interactive demo: Nested Radius Examples.** Open https://craft.gustavofior.com/nested-border-radius to try it.

The card has a `16px` outer radius and an `8px` inset, so its media uses `8px`.
The menu has a `12px` outer radius and a `4px` inset, so its highlighted item
uses `8px`.

### When to adjust it

The formula is a strong starting point, not a rule for every shape. Tune the
result by eye when the inset changes around the component, the inner element
does not reach the corner, or the surfaces use different corner shapes.

The fancy name for this is **concentric corners**: nested corners whose curves
share the same center.

### Resources

- [The math behind nesting rounded corners](https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/): Cloud Four’s explanation of the radius formula with practical CSS examples.
- [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-radius): MDN’s reference for the CSS border-radius property.
- [CSS corner shaping](https://www.w3.org/TR/css-backgrounds-3/#corners): The specification for outer, padding, and content edge radii.


## HTML Background

> Paint the canvas behind your page.

- Section: Layout
- URL: https://craft.gustavofior.com/html-background
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/html-background.mdx

Pull past the top of a dark page in Safari and a white strip can appear behind
it. The app is dark, but the document canvas is still white.

The canvas is the surface the browser paints behind the page.

> **Interactive demo: Html Background.** Open https://craft.gustavofior.com/html-background to try it.

### The document canvas

A wrapper only paints its own box. When it moves during overscroll, the canvas
shows through. Set the background on the root element to paint that surface
too.

Browsers normally use the `body` background when `html` is transparent.
Setting it on `html` directly makes the intended canvas color clear and does
not rely on that behavior.

### Other edges

- **Theme color:** The `theme-color` meta tag can tint supported browser UI to
  match the page. Keep it in sync when the theme changes.
- **Overscroll:** `overscroll-behavior: none` can remove the bounce and stop
  scroll chaining. Use it carefully. The bounce is a familiar part of the
  platform.
- **Both themes:** The root background must follow the active theme, or the
  white flash can return in one mode.

### Usage

**Tailwind**

```html
<html class="bg-background">
```

**CSS**

```css
html {
  background-color: var(--background);
}
```

Use the same background token for the root and the app. If the theme changes,
that token should change with it.

### Resources

- [HTML vs Body in CSS](https://css-tricks.com/html-vs-body-in-css/): A practical look at how the root and body elements behave.
- [Canvas backgrounds](https://www.w3.org/TR/css-backgrounds-3/#special-backgrounds): How browsers paint the document canvas from the root or body.
- [overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior): Control what happens when scrolling reaches a boundary.
- [theme-color](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color): Match supported browser chrome to the page background.
