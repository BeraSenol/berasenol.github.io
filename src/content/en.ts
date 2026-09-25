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
  kitchen: {
    eyebrow: "2023 – 2024",
    title: "Entrepot del Tartufo",
    tagline: "Italian food with a touch of truffle",
    toques: "two toques",
    scoreLabel: "Gault&Millau: 13 out of 20, two toques",
    paragraphs: [
      "From 2023 to 2024 I was sous-chef here, in Hasselt. Call it my version of military service. A two-person kitchen serving 40 to 50 guests every evening, up to 200 plates: my 72-year-old head chef and me, working entirely in Italian and German, with no shared first language to fall back on. Share a forty-degree kitchen with someone every day and your mindsets start to fuse, like nuclei in a fusion reactor.",
      "The turning point came the day I cut off the tip of my finger. I kept working through that service, was back in the kitchen the next day, and the day after that. From then on I had my chef’s respect, and our working relationship was a different one.",
      "This is where I picked up the working attitude of a 72-year-old chef: work with integrity, stay calm under pressure, and make the last plate the same as the first.",
      "That attitude came in surprisingly handy once I moved into IT. It turns out hospitality and consultancy have a lot in common.",
    ],
    exteriorAlt:
      "The street frontage of Entrepot del Tartufo, with terrace tables laid for service",
    exteriorCaption: "The terrace, laid up before service.",
    trufflesAlt: "Two hands cupping a pile of fresh black truffles",
    trufflesCaption: "Black truffle, the week’s delivery.",
    memojiAlt: "Memoji of Bera Senol, hand to his chin, considering something",
  },
  dignify: {
    eyebrow: "2025 – 2026",
    title: "Dignify",
    tagline: "Marketing automation for Bol.com and BNP Paribas Fortis",
    paragraphs: [
      "I started at Dignify in Genk with a Selligent training course. The track was planned for eight weeks; I finished it in six, with the highest score in two years.",
      "As a junior developer I then moved on to small and medium-sized projects for Bol.com, with my own direct contact with managers and stakeholders.",
      "The work was reusable SQL stored procedures for audience segmentation and reporting, and custom dashboards in JavaScript that gave stakeholders direct insight into campaign performance instead of a manual report.",
      "This is where I learned a structured way of working: reuse code, build on a custom framework to automate different systems, and pick up some light system design along the way.",
      "Later I worked on site at BNP Paribas Fortis in Brussels as a Medior Consultant, in Adobe Campaign Classic. There I learned how real-world solutions hold up on a gigantic database, sharded into many pieces: by department, by geographic region, by level of confidentiality.",
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
    replayLabel: "Replay the game",
    screenAlt:
      "DGT Studio Pro on a MacBook, showing a game read off a DGT board with its PGN, opening and engine evaluation",
    featuresTitle: "Your personal arbiter",
    features: [
      {
        title: "Live from the board",
        body: "Every move made on the DGT board shows up in the app as it is played, over USB.",
      },
      {
        title: "Desync recovery",
        body: "When the board and the app disagree about the position, the app works out what happened instead of stopping.",
      },
      {
        title: "PGN in SAN",
        body: "Every game exports as a standard PGN file, with the moves in Standard Algebraic Notation.",
      },
      {
        title: "A library of your own",
        body: "Games live in a SwiftData library with search, smart tags and four view modes.",
      },
      {
        title: "Stockfish analysis",
        body: "An evaluation graph across the whole game, next to the opening by ECO code and variation.",
      },
    ],
  },
  ambitions: {
    eyebrow: "What's next",
    title: "Bucket list items",
    intro:
      "Two things I have started on in my own time and want to take a lot further.",
    items: [
      {
        kind: "music",
        tool: "Logic Pro",
        goal: "Drum and bass",
        body: "I collect drum and bass, and now I want to make it. I have been finding my way around Logic Pro, and the aim is a finished track that holds its own next to the ones I collect.",
        tags: ["174 BPM", "Breaks", "Bass design", "Mixdown"],
      },
      {
        kind: "game",
        tool: "Unreal Engine",
        goal: "Video game",
        body: "I have started experimenting in Unreal Engine. A game pulls together a lot of what I enjoy: code, systems, sound, and something you can actually play. I want to build one small game from start to finish and ship it, ideally with a soundtrack I made myself.",
        tags: ["Unreal Engine 5", "C++", "Blueprints"],
      },
    ],
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
    eyebrow: "Seven of each",
    title: "Languages",
    naturalLabel: "Natural",
    programmingLabel: "Programming",
    nativeNote: "mother tongue",
    // Levels read off the CV's bars: each fill's length over its track's.
    natural: [
      { name: "Dutch", level: 100, native: true },
      { name: "English", level: 91 },
      { name: "Turkish", level: 64 },
      { name: "French", level: 52 },
      { name: "German", level: 52 },
      { name: "Japanese", level: 39 },
      { name: "Italian", level: 25 },
    ],
    programming: [
      { name: "JavaScript", level: 100 },
      { name: "Swift", level: 91 },
      { name: "Java", level: 64, native: true },
      { name: "SQL", level: 64 },
      { name: "C#", level: 39 },
      { name: "Python", level: 26 },
      { name: "C++", level: 26 },
    ],
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
    { icon: "cake", label: "Has a dessert stomach" },
    { icon: "star", label: "Interned at a michelin starred restaurant" },
    { icon: "cup", label: "Labor Nectar" },
    { icon: "yen", label: "Has not visited Japan (yet)" },
  ],
  footer: {
    owner: "Bera Senol",
    credits: [
      "Made with ",
      { tool: "react" },
      ", ",
      { tool: "typescript" },
      ", ",
      { tool: "vite" },
      " and ",
      { tool: "tailwind" },
      ". Deployed to ",
      { tool: "pages" },
      " by ",
      { tool: "actions" },
      ".",
    ],
    sourceLabel: "View source",
  },
};
