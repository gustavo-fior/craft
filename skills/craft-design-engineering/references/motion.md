# Motion

## Button Press

> Scale down on press so it feels real.

- Section: Motion
- URL: https://craft.gustavofior.com/button-press
- Published: 2026-10-14
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/button-press.mdx

A real button moves when you push it. A button on screen can borrow that with
one rule: **scale it down a little while it is pressed**. It is the cheapest
feedback the web has, and it makes the button feel like it heard you.

> **Interactive demo: Button Press.** Open https://craft.gustavofior.com/button-press to try it.

The one on the right is not doing much. It shrinks to 97% for as long as your
finger is down, then eases back to full size.

The goal with press feedback is to make it invisible. Nobody should think
"oh, the button scales". If they do, the animation is too much.

### Finding the amount

Two numbers matter: how far the button shrinks and how quickly it gets there.

> **Interactive demo: Press Amount.** Open https://craft.gustavofior.com/button-press to try it.

I like `0.98` or `0.97` for the scale. Below `0.95` it starts to look like an
effect, and people notice the animation instead of the click. For the
duration, I usually go somewhere between `100ms` and `150ms`. Longer than that
and the button lags behind your finger, which feels worse than no feedback at
all.

### Not just buttons

This works on other clickable things too: cards, tiles, chips.
Just be careful not to overdo it.

> **Interactive demo: Press Everywhere.** Open https://craft.gustavofior.com/button-press to try it.

Larger surfaces should shrink less. A full-width card at `0.97` moves several
pixels at the edges, which is a lot more than a button does at the same scale.

### Usage

**Tailwind**

```html
<button
  class="transition-transform duration-100 ease-out active:scale-[0.97] disabled:active:scale-100 motion-reduce:transition-none [-webkit-tap-highlight-color:transparent]"
>
  Save changes
</button>
```

**CSS**

```css
.button {
  transition: transform 100ms ease-out;
  -webkit-tap-highlight-color: transparent;
}

.button:active:not(:disabled) {
  transform: scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
```

Transition `transform` only, not `all`, so the press timing does not leak into
hover colors. A disabled button should not press, and on iOS it is worth
clearing the grey tap highlight so it does not flash over the scale.

iOS Safari also only applies `:active` while something on the page listens for
touches. Frameworks like React already do, but on a plain page add an empty
listener, or the press never shows:

```js
button.addEventListener("touchstart", () => {}, { passive: true });
```

### Resources

- [7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): Emil Kowalski's short list of rules for interface motion, including the press scale.
- [Great animations](https://emilkowal.ski/ui/great-animations): What separates motion that feels right from motion that just moves.
- [Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design): Rauno Freiberg on feedback that should apply the moment you touch something.
- [The :active pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:active): When the browser considers an element pressed, on mouse and on keyboard.
- [Animations guide](https://web.dev/articles/animations-guide): Why transform and opacity are the properties you can animate cheaply.


## Interruptibility

> Let people change their mind mid-motion.

- Section: Motion
- URL: https://craft.gustavofior.com/interruptibility
- Published: 2026-10-14
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/interruptibility.mdx

Open a sheet, then close it before it finishes arriving. What should happen?

The obvious answer is that it should turn around. It is somewhere in the
middle, so it should head back from there. That is **interruptibility**: an
animation that can _change its mind_. It sounds too simple to be worth a name,
which is exactly why it is so jarring when an interface gets it wrong.

> **Interactive demo: Interrupt Sheet.** Open https://craft.gustavofior.com/interruptibility to try it.

Tap the button twice, quickly. The left sheet will jump to fully open and then
slides down, as if closing had to start from the beginning. The right one
turns around wherever it happens to be.

Both look identical if you wait. The difference only shows when you do not
wait, and trust me, most people do not wait.

### A recording and a destination

The left sheet runs on CSS keyframes, one clip for opening and one for
closing. A keyframe animation is a _"recording"_. It has a first frame and a
last frame, and when you play it, it plays from the first frame no matter
where the element currently is. Closing mid-flight means jumping to the
start of the closing clip, which is fully open, and sliding down from there.

The right sheet runs on a CSS transition. A transition is not a recording,
it is a _"destination"_. You tell the browser where the element should be, and
it animates from wherever the element is right now. If the destination
changes halfway, it simply aims at the new one and keeps going.

That is most of the idea. **Describe where things should end up, not the
trip to get there.** Transitions, Motion's `animate`, and springs all work
this way. Keyframes do not.

### Never lock the door

Another way to get it wrong is to _"lock the door"_. The animation is fine, but the interface stops listening while it
runs. An `isAnimating` flag drops clicks, or `pointer-events: none` stays on
until the motion is done.

> **Interactive demo: Interrupt Lock.** Open https://craft.gustavofior.com/interruptibility to try it.

If you click too fast, you'll notice some of your taps vanish.
The interface decided its animation mattered more than your input and made
you wait. It is only a few hundred milliseconds, but it is long enough to
feel ignored, so people tap again, which drops another tap, which makes it
worse.

The right menu stays listening the whole time. If you tap at any point, the menu will hear you.
You shouldn't be obligated to wait for the full animation to finish.

### Keep the momentum

A transition fixes the jump, but look closely and there is still a small
lie in it. Reverse a transition halfway and the element stops, then starts
again from a standstill in the other direction. It remembers where it is,
but it forgets how fast it was going.

A spring remembers both. It is simulated physics: at every frame it knows
its position and its speed, and when the target changes it bends that speed
toward the new target instead of throwing it away. The turn becomes one
movement instead of two.

> **Interactive demo: Interrupt Momentum.** Open https://craft.gustavofior.com/interruptibility to try it.

So should everything be a spring? No. [Sonner](https://sonner.emilkowal.ski/) and [Vaul](https://vaul.emilkowal.ski/), two of the
best-feeling components on the web, both run on plain CSS transitions and
never feel broken. A good ease-out transition is enough for most sheets,
menus and sidebars. Reach for a spring when the motion comes from a gesture,
like a flicked card that should keep your finger's speed, or when something
gets flipped back and forth fast enough that the restart shows.

### When others join in

Interrupting is not only about reversing. Sometimes the animation is still
running and something new arrives: a second toast while the first is still
settling, a row inserted while the list is still sliding open. Everything
already in motion needs a new destination.

> **Interactive demo: Interrupt Stack.** Open https://craft.gustavofior.com/interruptibility to try it.

Press the button a few times, fast. Each toast slides up to make room while
the previous one is still landing, and none of them flinch. This is a Motion
`layout` animation. Whenever a sibling appears or leaves, Motion measures the
new positions and retargets anything still in flight.

### Usage

Use a transition for anything a person can toggle. Keep keyframes for
one-shots nothing can interrupt, like a spinner. And never gate input on an animation: no
`isAnimating` guards, no `pointer-events: none` while things move.

**Transition**

```css
.sheet {
  transform: translateY(100%);
  transition: transform 300ms cubic-bezier(0.33, 1, 0.68, 1);
}

.sheet[data-open] {
transform: translateY(0);
}
```

**Keyframes**

```css
/_ Restarts from the first frame every time it is applied. _/
@keyframes slide-up {
from { transform: translateY(100%); }
to { transform: translateY(0); }
}

.sheet[data-open] {
animation: slide-up 300ms cubic-bezier(0.33, 1, 0.68, 1) both;
}
```

**Spring**

```tsx
import { motion } from "motion/react";

<motion.div
  animate={{ y: open ? 0 : "100%" }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>
```

### Resources

- [Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design): Rauno Freiberg on why an interface should never lock the user out while something moves.
- [Building a Toast Component](https://emilkowal.ski/ui/building-a-toast-component): Emil Kowalski on Sonner, and why he chose CSS transitions over keyframes so toasts keep moving while others arrive.
- [Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/): Apple on why springs suit interruptible motion, because they carry velocity into a new target.
- [Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions): The MDN reference, including how a transition behaves when its target changes mid-flight.
- [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style): How to transition an element in from display none without reaching for keyframes.
- [Layout animations in Motion](https://motion.dev/docs/react-layout-animations): How Motion retargets layout animations that are already running when the layout changes again.


## Hover Restraint

> Frequent interactions should be instant.

- Section: Motion
- URL: https://craft.gustavofior.com/hover-restraint
- Published: 2026-07-15
- Source: https://github.com/gustavo-fior/craft/blob/main/content/motion/hover-restraint.mdx

Hover fires more than any other interaction. When you sweep the cursor across a nav
you can cross ten items in a second. If each one fades in, the
interface is always a few frames behind the pointer, and it reads as slow
even when nothing is.

**The more often something happens, the less
animation it can afford.**

> **Interactive demo: Hover Restraint.** Open https://craft.gustavofior.com/hover-restraint to try it.

The right one switches its highlight on with no transition at all. Instant
is the correct default for hover.

### Tooltips

Tooltips are one hover case where a delay helps. Without one they pop
up while you are just passing through on the way to something else.

So the first tooltip should wait, around 400ms to 700ms, and then its neighbors
should appear at once. You have already shown you want the labels, and
making you wait again for each one is frustrating.

> **Interactive demo: Hover Tooltip.** Open https://craft.gustavofior.com/hover-restraint to try it.

### Keyboard actions

The same thinking applies away from the pointer.

> **Interactive demo: Keyboard Action.** Open https://craft.gustavofior.com/hover-restraint to try it.

Someone toggling a sidebar with a shortcut is your fastest user. They are
not looking for the panel to arrive from somewhere. They already know what
the shortcut does, and a 250ms slide is like a speeding ticket.

The line to draw is by frequency and intent, not by input device. A modal
that opens once a session can animate. A panel you flip forty times a day
should not.

Notable examples of interactions that would be worse if animated:

- [Raycast launcher](https://www.raycast.com/): Opens and closes with no transition, every time.
- [macOS Alt+Tab](https://rauno.me/craft/interaction-design): Rauno Freiberg on why the app switcher appears instantly.

### Resources

- [You don't need animations](https://emilkowal.ski/ui/you-dont-need-animations): Emil Kowalski on when animation helps and when it gets in the way, with hover as the main case.
- [7 practical animation tips](https://emilkowal.ski/ui/7-practical-animation-tips): Short, concrete rules for interface motion, including how tooltips should behave.
- [Base UI Tooltip](https://base-ui.com/react/components/tooltip): The tooltip used on this site, with the delay and instant-open behavior built in.
- [The :hover pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover): What counts as hover across mouse, pen and touch, and why it is unreliable on touch.
