# Typography

## Tabular Numbers

> Steady digits for values that change.

- Section: Typography
- URL: https://craft.gustavofior.com/tabular-numbers
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/typography/tabular-numbers.mdx

Digits can have two kinds of widths.

**Proportional figures** use the natural width of each shape: `1` is narrow,
while `8` is wide. **Tabular figures** give every digit the same width.

> **Interactive demo: Tabular Nums.** Open https://craft.gustavofior.com/tabular-numbers to try it.

Use proportional figures when numbers sit inside a sentence. They read more
naturally. Use tabular figures when changing values need to stay steady or
align vertically.

### Changing values

A timer made with proportional figures changes width as it runs. Everything
beside it moves too. Watch the blue edge:

> **Interactive demo: Tabular Timer.** Open https://craft.gustavofior.com/tabular-numbers to try it.

Tabular figures turn every character into a stable slot. Use them for clocks, counters, scores, prices, and live
metrics.

The usual instinct here is to switch to a monospace font, but you don't need to. A mono font changes the whole voice of
the interface. Often, you just need to use tabular figures.

### Tables

In a numeric column, equal-width digits create a vertical grid. Repeated
places line up, so differences are easier to scan. It feels much better to see data this way.

> **Interactive demo: Tabular Table.** Open https://craft.gustavofior.com/tabular-numbers to try it.

Right-align numeric columns as well. Right alignment keeps numbers with different lengths anchored to the same
edge.

### Usage

**Tailwind**

```html
<span class="tabular-nums">12:45</span>
```

**CSS**

```css
.numeric-column {
  font-variant-numeric: tabular-nums;
}
```

The font must include tabular figures for this to work. If `tabular-nums`
makes no visible difference, drop the font file into
[Wakamai Fondue](https://wakamaifondue.com) and check whether it lists `tnum`
among its features.

### Resources

- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better): A practical collection of small interface improvements.
- [font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric): Syntax, examples, and browser support on MDN.
- [CSS Fonts Module Level 4 — Numerical formatting](https://www.w3.org/TR/css-fonts-4/#font-variant-numeric-prop): The specification behind proportional and tabular figures.
- [OpenType tabular figures](https://learn.microsoft.com/en-us/typography/opentype/otspec190/features_pt#tag-tnum): How the tnum font feature maps digits to uniform widths.
- [Wakamai Fondue](https://wakamaifondue.com): Drop in a font file to see every OpenType feature it supports.


## Optical Alignment

> Center for the eye, not the math.

- Section: Typography
- URL: https://craft.gustavofior.com/optical-alignment
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/typography/optical-alignment.mdx

Aligning icons exactly by their edges doesn't always look right. A tiny shift is often needed because different shapes feel heavier or lighter to the eye.

**Optical alignment** means nudging things until they look right, then keeping
the nudge.

> **Interactive demo: Optical Alignment.** Open https://craft.gustavofior.com/optical-alignment to try it.

The play icon moves left, because a triangle pointing right has most of its area on the
left. The star and the download icon move up a bit. The amounts are tiny and
specific to each icon, so this is a per icon decision, not a global rule.

#### How to align the icon

A good test is to blur the icon. Add a heavy `filter: blur()` to it in
the inspector, or squint at it, and the shape collapses into a soft blob of
ink.

The blob sits where the icon's visual weight is, not where its bounding
box is, so if it lands off the center of the button the nudge you need is
the distance back. Sharp edges hide this, because your eye reads the outline
and trusts it. Blur removes the outline and leaves only the weight.

### Buttons with icons

The same thing happens with padding. An icon has air inside its box, and
that air adds to the padding next to it. Equal padding on both sides ends up
looking heavier on the icon side.

> **Interactive demo: Optical Button.** Open https://craft.gustavofior.com/optical-alignment to try it.

Shave a few pixels off the padding on the side that holds the icon.

### Shape weight

Different shapes have varying visual weight. For example, when a circle or triangle is drawn inside the same box as a square, it appears smaller to the eye.

> **Interactive demo: Optical Weight.** Open https://craft.gustavofior.com/optical-alignment to try it.

### Optical sizes

Type has the same problem across sizes. Strokes that are sturdy at 14px look
clumsy at 40px. Some typefaces ship an **optical size** axis that redraws the
letters for the size they are set at.

> **Interactive demo: Optical Sizing.** Open https://craft.gustavofior.com/optical-alignment to try it.

Browsers turn this on automatically through `font-optical-sizing: auto`, so
you usually get the right design for free. The demo forces the text design
onto a display size so you can see what you would be missing.

### Hanging punctuation

A quote that starts with a quotation mark looks indented, because the mark is
mostly whitespace. Hanging it into the margin lines the first letter up with
the text below.

> **Interactive demo: Hanging Punctuation.** Open https://craft.gustavofior.com/optical-alignment to try it.

Safari supports `hanging-punctuation: first`. Elsewhere a small negative
`text-indent` gets the same result for a known opening character.

### Usage

**Tailwind**

```html
<button class="grid size-12 place-items-center rounded-full">
    <PlayIcon class="size-5 translate-x-px" weight="fill" />
</button>

<blockquote class="indent-[-0.42em]">
    “Good design is as little design as possible.”
</blockquote>
```

**CSS**

```css
.play-icon {
  transform: translateX(1px);
}

blockquote {
  hanging-punctuation: first;
}

@supports not (hanging-punctuation: first) {
  blockquote {
    text-indent: -0.42em;
  }
}
```

### Resources

- [Apple Human Interface Guidelines on icons](https://developer.apple.com/design/human-interface-guidelines/icons): Apple's rules for optical balance inside an icon's bounding shape.
- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better): A short list of fixes, several of which are optical adjustments like these.
- [hanging-punctuation](https://www.w3.org/TR/css-inline-3/#hanging-punctuation-property): The CSS spec for letting quotes hang outside the text box.
- [Inter features](https://rsms.me/inter/#features): What the optical size axis of Inter actually changes.


## Font Smoothing

> Light text on dark renders heavier.

- Section: Typography
- URL: https://craft.gustavofior.com/font-smoothing
- Published: 2026-10-14
- Source: https://github.com/gustavo-fior/craft/blob/main/content/typography/font-smoothing.mdx

Put white text on a dark surface and look closely. On a Mac, it comes out a
little bolder and a little fuzzier than the same text on white.

> **Interactive demo: Font Smoothing Compare.** Open https://craft.gustavofior.com/font-smoothing to try it.

MacOS smooths text in browsers by **thickening the edges of every glyph**, a
leftover from the days of subpixel rendering on low resolution screens. On
dark backgrounds that extra thickness reads as bloom.

Every demo on this page only changes on a Mac. Windows renders with ClearType
and ignores the property, Linux never had it, and iOS Safari does not do
subpixel antialiasing at all. If you are reading this anywhere but macOS,
nothing below will look any different.

> **Interactive demo: Font Smoothing.** Open https://craft.gustavofior.com/font-smoothing to try it.

The property is `-webkit-font-smoothing: antialiased`. It tells the browser to
skip the thickening and use plain **grayscale antialiasing**, which renders the
glyph at its true weight.

### Where it shows

The difference is easy to see on dark backgrounds and a bit harder to see on light
ones.

> **Interactive demo: Font Smoothing Contrast.** Open https://craft.gustavofior.com/font-smoothing to try it.

That is why this mostly comes up when a product ships a dark mode. Everything
looks fine in light mode, then the dark theme arrives and every heading feels
half a weight heavier than the design file.

### Thin weights

The thickening the default rendering adds is the same for every weight, but it
is not felt the same way. A bold heading barely needs it, while a light weight often
relies on it: sometimes 300 only looks readable on a dark background because the
renderer has been quietly fattening it.

> **Interactive demo: Font Smoothing Weights.** Open https://craft.gustavofior.com/font-smoothing to try it.

From 400 up, the antialiased side just looks cleaner. At 300 the text comes
out lighter than you meant, and at 200 the strokes start to fall apart. Thin
text gets even thinner on a non-Retina screen, where a stroke can be less than
a pixel wide. So if you set body text at 300 or below on dark surfaces, give
it a look on a 1x display before turning this on everywhere. If you stick to
400 and up, like most products do, you are fine.

### The other two values

The property takes four values, and the two nobody reaches for are worth
knowing.

> **Interactive demo: Font Smoothing Values.** Open https://craft.gustavofior.com/font-smoothing to try it.

`none` turns antialiasing off entirely. Edges go hard and stepped, the way
type looked before any of this existed. There is no real use for it in a
product, but it is the fastest way to see how much work antialiasing is doing.

`subpixel-antialiased` is the one you might actually want one day. It forces
the default back on, which matters because the recommendation below is a
global rule on `body`. Once that is in place you have no way to exempt a
region without this value.

### Usage

**Tailwind**

```html
<body class="antialiased">
  <!-- ...and one region that wants the default back -->
  <div class="subpixel-antialiased">...</div>
</body>
```

**CSS**

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/_ Opt a region back into the browser default. _/
.light-panel {
-webkit-font-smoothing: subpixel-antialiased;
-moz-osx-font-smoothing: auto;
}
```

Both properties are non-standard and only do anything on macOS. Windows,
Linux, iOS and Android ignore them, which is fine, because the bloom is a
macOS problem. Since Firefox 128, Firefox on macOS treats the WebKit property
as its own, so the `-moz-osx-font-smoothing` line is only there for older
versions.

### Resources

- [font-smooth](https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth): MDN on the non-standard smoothing properties and their browser support.
- [Details that make interfaces feel better](https://jakub.kr/writing/details-that-make-interfaces-feel-better): A practical collection of small interface improvements, including this one.
- [What is -webkit-font-smoothing?](https://dbushell.com/2024/11/05/webkit-font-smoothing/): David Bushell on what the property changes, where it has no effect, and why the Firefox prefix is no longer needed.
- [Laissez-faire font smoothing and anti-aliasing](https://www.zachleat.com/web/font-smooth/): Zach Leatherman on what the property does and the case against using it blindly.
- [Font smoothing in Tailwind](https://tailwindcss.com/docs/font-smoothing): The antialiased and subpixel-antialiased utilities.
