# berasenol.github.io

The source of my personal site, [berasenol.github.io](https://berasenol.github.io), which stands in for my CV. It is one page in two languages: [English](https://berasenol.github.io/en/) and [Dutch](https://berasenol.github.io/nl/).

## Stack

- [Vite](https://vite.dev), [React](https://react.dev) 19 and [TypeScript](https://www.typescriptlang.org) in strict mode
- [Tailwind CSS](https://tailwindcss.com) v4, with the design tokens in `src/index.css`
- Built and deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml` on every push to `main`

No router, no state library and no component library. I am learning React with this project, so the plain version of each thing comes first.

## How it is put together

- `en/index.html` and `nl/index.html` are two entry points built from the same components. Each hands `App` its own dictionary from `src/content/`, so the URL decides the language and there is no locale state.
- `index.html` at the root sends a visitor to their browser's language.
- `src/content/types.ts` describes the copy. Both dictionaries are typed against it, so a string missing from one language is a compile error.
- The greys are Apple's Dark Mode system colours, named after SwiftUI's `.primary` to `.quaternary`.

## Running it

```sh
npm install
npm run dev      # local server with hot reload
npm run build    # type-check, then build to dist/
npm run lint     # oxlint
```
