import type { Content } from "./types";

export const en: Content = {
  lang: "en",
  languageMenuLabel: "Change language",
  meta: {
    title: "Bera Senol | Software Developer",
    description:
      "Bera Senol, software developer building for Apple platforms in Swift and SwiftUI.",
  },
  splash: {
    role: "Software Developer",
    scrollLabel: "Scroll to content",
    githubLabel: "GitHub profile",
    contactCta: "Contact",
  },
  hero: {
    eyebrow: "What I do",
    headline: "I build software for Apple platforms.",
    body: "macOS apps in Swift and SwiftUI, chess engines that have to be exactly right, and the occasional thing for the web.",
    primaryCta: "See my work",
    secondaryCta: "Get in touch",
  },
  kitchen: {
    eyebrow: "2023",
    title: "Entrepot del Tartufo",
    tagline: "Italian food with a touch of truffle",
    toques: "two toques",
    scoreLabel: "Gault&Millau: 13 out of 20, two toques",
    paragraphs: [
      "From 2023 to 2024 I was sous-chef here, in Hasselt. A two-person kitchen: my 72-year-old head chef and me, working entirely in Italian and German. No brigade to absorb a mistake, and no shared first language to fall back on. You learn to read what someone needs from how they move, and to say the necessary thing in six words.",
      "Before this I had interned at a Michelin-starred restaurant. Here there were two of us, so half of every service was mine.",
      "Service is a deadline that arrives whether or not you are ready for it. The only way through it is preparation you did hours earlier: every component portioned, labelled and within reach before the first ticket prints. Quality has to hold at the two hundredth plate as well as the first.",
      "The kitchen’s signature is truffle, and truffle forgives nothing. Too much heat and the aroma is gone before the plate reaches the table. It is expensive, it does not keep, and a week’s delivery has to be used well. Timing matters more than the recipe.",
      "I build software the same way. Set things up so the work is boring, keep the state of everything visible, and never send out a plate that is nearly right.",
    ],
    exteriorAlt:
      "The street frontage of Entrepot del Tartufo, with terrace tables laid for service",
    exteriorCaption: "The terrace, laid up before service.",
    trufflesAlt: "Two hands cupping a pile of fresh black truffles",
    trufflesCaption: "Black truffle, the week’s delivery.",
    memojiAlt: "Memoji of Bera Senol, hand to his chin, considering something",
  },
  dignify: {
    eyebrow: "2025",
    title: "Dignify",
    tagline: "Marketing automation for Bol.com and BNP Paribas Fortis",
    paragraphs: [
      "Marketing Automation Consultant in Genk, on campaign and data work for Bol.com and BNP Paribas Fortis. I joined as a Junior Developer and moved to Medior Consultant.",
      "The work was reusable SQL stored procedures for audience segmentation and reporting, and custom dashboards in JavaScript that gave stakeholders direct insight into campaign performance instead of a manual report.",
      "The campaigns themselves ran in Selligent and Adobe Campaign Classic. For BNP Paribas Fortis I worked on site in Brussels, in Adobe Campaign, where a campaign is a flow of targeting, filters and deliveries, and a wrong join reaches real customers.",
      "The certification track took me six weeks instead of eight, and I finished it with the highest score in two years.",
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Get in touch.",
    memojiAlt: "Memoji of Bera Senol making a heart with his hands",
    intro: "The fastest way to reach me is email. Code is on GitHub.",
  },
  dgt: {
    eyebrow: "Side project",
    title: "DGT Studio Pro",
    tagline: "A real chess board, talking to a Mac",
    paragraphs: [
      "A native macOS app that connects to a physical DGT electronic chess board over USB serial and reconstructs the game live, through a serial stack I wrote by hand.",
      "It holds the full game state and exports PGNs in SAN. If the board and the app ever disagree about the position, the desync recovery works out what happened instead of giving up.",
      "On top of that sits a SwiftData library with search, smart tags, four view modes and Stockfish analysis. I built it because the software that shipped with the board did not give me the experience I wanted.",
    ],
    href: "https://github.com/BeraSenol/DGTStudioPro",
    ctaLabel: "View on GitHub",
    boardLabel:
      "A chessboard playing Fool\u2019s Mate, the shortest checkmate there is: 1.f3 e5 2.g4 Qh4 mate",
    boardCaption: "The Fool\u2019s Mate, Checkmate in 4 halfmoves",
    screenAlt:
      "DGT Studio Pro on a MacBook, showing a game read off a DGT board with its PGN, opening and engine evaluation",
  },
  education: [
    {
      title: "Applied Computer Science",
      org: "PXL Hasselt",
      period: "2017 – 2022",
    },
    { title: "Physics", org: "UHasselt", period: "2016 – 2017" },
  ],
  projects: [
    {
      name: "DGTStudioPro",
      stack: ["macOS", "Swift", "SwiftUI", "SwiftData", "Stockfish"],
      href: "https://github.com/BeraSenol/DGTStudioPro",
      bullets: [
        "Native macOS app that connects to a physical DGT electronic chess board over USB serial and reconstructs the game live, through a hand-built serial stack.",
        "Maintains full game state with desync recovery, and exports PGNs using SAN.",
        "SwiftData game library with search, smart tags, four view modes and Stockfish analysis.",
        "Built because the original software did not deliver the experience I wanted.",
      ],
    },
  ],
  languages: {
    natural: [
      "Dutch*",
      "English",
      "Turkish",
      "French",
      "German",
      "Japanese",
      "Italian",
    ],
    programming: ["JavaScript", "Swift", "Java*", "SQL", "C#", "Python", "C++"],
  },
  contactLinks: [
    {
      icon: "email",
      label: "Email",
      value: "berasenol@icloud.com",
      href: "mailto:berasenol@icloud.com",
    },
    {
      icon: "github",
      label: "GitHub",
      value: "github.com/BeraSenol",
      href: "https://github.com/BeraSenol",
    },
    { icon: "location", label: "Based in", value: "Hasselt, Belgium" },
  ],
  memojiAlt: "Memoji of Bera Senol waving",
  nuggets: [
    { icon: "note", label: "Collects Drum & Bass like Pokémon cards" },
    { icon: "leaf", label: "Coriander tastes like soap" },
    { icon: "snap", label: "Cannot snap his fingers" },
    { icon: "star", label: "Interned at a michelin starred restaurant" },
    { icon: "cup", label: "Milk & Sugar" },
    { icon: "japanese", label: "Learning Japanese" },
  ],
  footer: "Bera Senol",
};
