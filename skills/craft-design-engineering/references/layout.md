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


## Scroll Fades

> Fade the edge that has more to scroll.

- Section: Layout
- URL: https://craft.gustavofior.com/scroll-fades
- Published: 2026-10-14
- Source: https://github.com/gustavo-fior/craft/blob/main/content/layout/scroll-fades.mdx

A scroll container with a hard edge looks like a list that ends. A **scroll fade** dissolves the rows at the edge into the background, so the reader understands there is more to see without a scrollbar telling them.

> **Interactive demo: Scroll Fades.** Open https://craft.gustavofior.com/scroll-fades to try it.

The fade comes from `mask-image` with a linear gradient. A mask is not a layer on top. It sets how visible each part of the element is: where the gradient is opaque the content shows, where it is transparent the content disappears. Because it is a mask and not an overlay, it works over any background, including images and gradients, and it never blocks clicks.

### Only fade the side that can scroll

The obvious version is a static mask on both ends. It has one flaw: it fades the first row when you are at the top, and the last row when you are at the bottom. At the bottom this is actively misleading. The final item looks half hidden, as if something is still below it.

> **Interactive demo: Scroll Fades Edge.** Open https://craft.gustavofior.com/scroll-fades to try it.

The right list only fades the edge that still has content behind it. The trick is that the two fade sizes are custom properties, and a **scroll-driven animation** moves them. The top fade grows from `0` to its full size over the first `3rem` of scrolling, the bottom fade shrinks back to `0` over the last `3rem`.

### Horizontal rows

The same idea applies sideways. A row of chips or tabs that overflows should fade at the edge that can still scroll, which also hints at the gesture.

> **Interactive demo: Scroll Fades Horizontal.** Open https://craft.gustavofior.com/scroll-fades to try it.

I like to hide the scrollbar on rows like this. I know that we lose the indication of how much is left to scroll, but a horizontal bar under a row of chips is just too much visual noise.

### Usage

**Tailwind**

```html
<!-- scroll-fade-y and scroll-fade-x come from the CSS tab -->

<!-- Vertical -->
<div class="h-44 overflow-y-auto scroll-fade-y">
  ...
</div>

<!-- Horizontal, and hide the scrollbar -->
<div class="flex overflow-x-auto scroll-fade-x scrollbar-none">
  ...
</div>
```

**CSS**

```css
/* The fade sizes. Registered so they can animate. */
@property --fade-start {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}

@property --fade-end {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}

@keyframes fade-start {
  from {
    --fade-start: 0px;
  }
  to {
    --fade-start: 2.5rem;
  }
}

@keyframes fade-end {
  from {
    --fade-end: 2.5rem;
  }
  to {
    --fade-end: 0px;
  }
}

.scroll-fade-y,
.scroll-fade-x {
  mask-image: linear-gradient(
    var(--fade-direction),
    transparent,
    black var(--fade-start),
    black calc(100% - var(--fade-end)),
    transparent
  );
}

.scroll-fade-y {
  --fade-direction: to bottom;
}

.scroll-fade-x {
  --fade-direction: to right;
}

/* Let the scroll position drive both fades. */
@supports (animation-timeline: scroll()) {
  .scroll-fade-y,
  .scroll-fade-x {
    animation:
      fade-start 1ms linear both,
      fade-end 1ms linear both;
    animation-range:
      0 3rem,
      calc(100% - 3rem) 100%;
  }

  /* After the shorthand, which resets the timeline. */
  .scroll-fade-y {
    animation-timeline: scroll(self y);
  }

  .scroll-fade-x {
    animation-timeline: scroll(self x);
  }
}

/* No scroll timelines: fade both ends all the time. */
@supports not (animation-timeline: scroll()) {
  .scroll-fade-y,
  .scroll-fade-x {
    --fade-start: 2.5rem;
    --fade-end: 2.5rem;
  }
}
```

One thing to know: the mask applies to the whole scroll container, scrollbar included, so a visible scrollbar fades out at both ends too. Either hide it, as above, or move the mask to an inner wrapper and let the outer element scroll.

### Resources

- [Scroll Fade in shadcn/ui](https://ui.shadcn.com/docs/utils/scroll-fade): A CSS-only utility that fades the edges of a scroll container and reveals them as you reach the end. The approach this article follows.
- [mask-image on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image): The property that does the fading, with the gradient and image forms it accepts.
- [Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations): How animation-timeline and animation-range tie an animation to a scroll position instead of time.
- [@property on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@property): Registering a custom property so the browser can animate it, which the edge aware fade relies on.
- [Building the Next.js website](https://rauno.me/craft/nextjs): Rauno Freiberg on the small layout details of a real site, including masking the edges of decorative elements.
