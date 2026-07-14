// Full-viewport film-grain overlay: an SVG feTurbulence filter applied to the
// element itself, blended over the page. Screen-blend speckles light in dark
// mode; multiply speckles dark in light mode.
export function Noise() {
  return (
    <figure
      aria-hidden="true"
      className="noise-overlay pointer-events-none fixed inset-0 z-50 opacity-[0.05] mix-blend-multiply filter-[url('#noise-bg-fx')_grayscale(100%)] dark:opacity-10 dark:mix-blend-screen"
    >
      <svg>
        <filter id="noise-bg-fx">
          <feTurbulence baseFrequency="0.8" />
        </filter>
      </svg>
    </figure>
  );
}
