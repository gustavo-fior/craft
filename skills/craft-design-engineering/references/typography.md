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
