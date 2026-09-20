import type { Content } from "./types";

export const nl: Content = {
  lang: "nl",
  languageMenuLabel: "Taal wijzigen",
  meta: {
    title: "Bera Senol | Software Developer",
    description:
      "Bera Senol, softwareontwikkelaar voor Apple-platformen in Swift en SwiftUI.",
  },
  splash: {
    role: "Softwareontwikkelaar",
    scrollLabel: "Scroll naar de inhoud",
    githubLabel: "GitHub-profiel",
    contactCta: "Contact",
  },
  hero: {
    eyebrow: "Wat ik doe",
    headline: "Ik bouw software voor Apple-platformen.",
    body: "macOS-apps in Swift en SwiftUI, schaakengines die exact moeten kloppen, en af en toe iets voor het web.",
    primaryCta: "Bekijk mijn werk",
    secondaryCta: "Neem contact op",
  },
  kitchen: {
    eyebrow: "2023",
    title: "Entrepot del Tartufo",
    // The restaurant's own tagline, their branding, left in English on purpose.
    tagline: "Italian food with a touch of truffle",
    toques: "twee koksmutsen",
    scoreLabel: "Gault&Millau: 13 op 20, twee koksmutsen",
    paragraphs: [
      "Van 2023 tot 2024 was ik hier sous-chef, in Hasselt. Een keuken met twee man: mijn chef van 72 en ik, we werkten volledig in het Italiaans en het Duits. Geen brigade om een fout op te vangen, en geen gedeelde moedertaal om op terug te vallen. Je leert aan iemands bewegingen zien wat hij nodig heeft, en het nodige in zes woorden te zeggen.",
      "Service is een deadline die komt of je er nu klaar voor bent of niet. Je raakt er enkel door met voorbereiding van uren eerder: elk onderdeel geportioneerd, geëtiketteerd en binnen handbereik voor de eerste bon binnenloopt. De kwaliteit moet bij het tweehonderdste bord even goed zijn als bij het eerste.",
      "Ik bouw software op dezelfde manier. Zet alles zo op dat het werk saai wordt, houd de toestand van alles zichtbaar, en stuur nooit een bord door dat bijna juist is.",
    ],
    exteriorAlt:
      "De straatgevel van Entrepot del Tartufo, met gedekte tafels op het terras",
    exteriorCaption: "Het terras, gedekt voor de service.",
    trufflesAlt: "Twee handen met een hoop verse zwarte truffels",
    trufflesCaption: "Zwarte truffel, de levering van die week.",
    memojiAlt: "Memoji van Bera Senol, hand aan zijn kin, in gedachten",
  },
  dignify: {
    eyebrow: "2025",
    title: "Dignify",
    tagline: "Marketing automation voor Bol.com en BNP Paribas Fortis",
    paragraphs: [
      "Marketing Automation Consultant in Genk, met campagne- en datawerk voor Bol.com en BNP Paribas Fortis. Ik begon als Junior Developer en groeide door naar Medior Consultant.",
      "Het werk bestond uit herbruikbare SQL stored procedures voor doelgroepsegmentatie en rapportering, en eigen dashboards in JavaScript die stakeholders rechtstreeks zicht gaven op campagneprestaties in plaats van een handmatig rapport.",
    ],
    panelCaption: "Conceptuele vorm van een campagne.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Neem contact op.",
    memojiAlt: "Memoji van Bera Senol die een hartje maakt met zijn handen",
    intro: "Mail is de snelste manier om me te bereiken. Code staat op GitHub.",
  },
  dgt: {
    eyebrow: "Eigen project",
    title: "DGT Studio Pro",
    tagline: "Een echt schaakbord, in gesprek met een Mac",
    paragraphs: [
      "Een native macOS-app die via USB-serieel verbinding maakt met een fysiek DGT-schaakbord en de partij live reconstrueert, met een seriële stack die ik zelf geschreven heb.",
      "Hij houdt de volledige partijstaat bij en exporteert PGN’s in SAN. Als bord en app het oneens zijn over de stelling, zoekt het desync-herstel uit wat er gebeurd is in plaats van af te haken.",
      "Daarbovenop zit een SwiftData-bibliotheek met zoekfunctie, smart tags, vier weergavemodi en Stockfish-analyse. Ik heb hem gebouwd omdat de software die bij het bord zat niet de ervaring gaf die ik wilde.",
    ],
    href: "https://github.com/BeraSenol/DGTStudioPro",
    ctaLabel: "Bekijk op GitHub",
    boardLabel:
      "Een schaakbord dat het narrenmat speelt, het kortste schaakmat dat bestaat: 1.f3 e5 2.g4 Dh4 mat",
    boardCaption: "Narrenmat. Vier halve zetten en het is voorbij.",
    screenAlt:
      "DGT Studio Pro op een MacBook, met een partij die van een DGT-bord is gelezen, de PGN, de opening en de engine-evaluatie",
  },
  education: [
    {
      title: "Toegepaste Informatica",
      org: "PXL Hasselt",
      period: "2017 – 2022",
    },
    { title: "Fysica", org: "UHasselt", period: "2016 – 2017" },
  ],
  projects: [
    {
      name: "DGTStudioPro",
      stack: ["macOS", "Swift", "SwiftUI", "SwiftData", "Stockfish"],
      href: "https://github.com/BeraSenol/DGTStudioPro",
      bullets: [
        "Native macOS-app die via USB-serieel verbinding maakt met een fysiek DGT-schaakbord en de partij live reconstrueert, met een zelfgeschreven seriële stack.",
        "Houdt de volledige partijstaat bij met desync-herstel, en exporteert PGN’s via SAN.",
        "SwiftData-bibliotheek met zoekfunctie, smart tags, vier weergavemodi en Stockfish-analyse.",
        "Gebouwd omdat de originele software niet de ervaring bood die ik wilde.",
      ],
    },
  ],
  languages: {
    natural: [
      "Nederlands*",
      "Engels",
      "Turks",
      "Frans",
      "Duits",
      "Japans",
      "Italiaans",
    ],
    programming: ["JavaScript", "Swift", "Java*", "SQL", "C#", "Python", "C++"],
  },
  contactLinks: [
    {
      icon: "email",
      label: "E-mail",
      value: "berasenol@icloud.com",
      href: "mailto:berasenol@icloud.com",
    },
    {
      icon: "github",
      label: "GitHub",
      value: "github.com/BeraSenol",
      href: "https://github.com/BeraSenol",
    },
    { icon: "location", label: "Gevestigd in", value: "Hasselt, België" },
  ],
  memojiAlt: "Memoji van Bera Senol die zwaait",
  nuggets: [
    {
      icon: "note",
      label: "Verzamelt Drum & Bass alsof het Pokémonkaarten zijn",
    },
    { icon: "leaf", label: "Koriander proeft naar zeep" },
    { icon: "snap", label: "Kan niet met zijn vingers knippen" },
    { icon: "star", label: "Stagiair in een sterrenzaak" },
    { icon: "cup", label: "Milk & Sugar" },
    { icon: "japanese", label: "Leert Japans" },
  ],
  footer: "Bera Senol",
};
