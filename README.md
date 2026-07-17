# Craft

A small collection of design engineering concepts, live at
[craft.gustavofior.com](https://craft.gustavofior.com).

## Stack

- [Next.js](https://nextjs.org) (App Router, fully static) + Tailwind CSS v4
- [Content Collections](https://content-collections.dev) for typed MDX
- [Base UI](https://base-ui.com)-based components, [motion](https://motion.dev), [next-themes](https://github.com/pacocoursey/next-themes)
- [@web-kits/audio](https://audio.raphaelsalaja.com) for synthesized interface sounds
- Fonts: [Inter](https://rsms.me/inter/), [Redaction 35](https://www.redaction.us), JetBrains Mono

## Development

```bash
bun install
bun dev
```

Add a concept by dropping an `.mdx` file into `content/<section>/` with
`title`, `description`, `section`, `order`, and `publishedAt` frontmatter.
Interactive demos live in `src/components/demos` and are registered in
`src/components/app/mdx.tsx`.

## License

MIT. Fonts keep their own licenses (Inter and Redaction are SIL OFL).
