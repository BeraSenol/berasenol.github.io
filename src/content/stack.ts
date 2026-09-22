/**
 * What the site is made with, for the credits in the footer.
 *
 * Same reasoning as locales.ts: a product's name and its link are the same on
 * every page, so they live here once, and a content file only decides where in
 * its own sentence each one goes. The Record over the union is the safety net:
 * adding a tool to StackTool without giving it a name and a link here is a
 * compile error, not a link to nowhere.
 */
export type StackTool =
  | "react"
  | "typescript"
  | "vite"
  | "tailwind"
  | "actions"
  | "pages";

export const STACK: Record<StackTool, { name: string; href: string }> = {
  react: { name: "React", href: "https://react.dev" },
  typescript: { name: "TypeScript", href: "https://www.typescriptlang.org" },
  vite: { name: "Vite", href: "https://vite.dev" },
  tailwind: { name: "Tailwind CSS", href: "https://tailwindcss.com" },
  actions: { name: "GitHub Actions", href: "https://github.com/features/actions" },
  pages: { name: "GitHub Pages", href: "https://pages.github.com" },
};

/** This site's own repository, for "View source". */
export const SOURCE_HREF = "https://github.com/BeraSenol/berasenol.github.io";
