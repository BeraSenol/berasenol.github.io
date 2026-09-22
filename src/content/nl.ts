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
  kitchen: {
    eyebrow: "2023 – 2024",
    title: "Entrepot del Tartufo",
    // The restaurant's own tagline, their branding, left in English on purpose.
    tagline: "Italian food with a touch of truffle",
    toques: "twee koksmutsen",
    scoreLabel: "Gault&Millau: 13 op 20, twee koksmutsen",
    paragraphs: [
      "Van 2023 tot 2024 was ik hier sous-chef, in Hasselt. Ik noem het graag mijn legerdienst. Een keuken met twee man, elke avond 40 tot 50 gasten, tot 200 borden: mijn chef van 72 en ik, we werkten volledig in het Italiaans en het Duits, zonder gedeelde moedertaal om op terug te vallen. Sta elke dag met iemand in een keuken van veertig graden en jullie denkwijzen beginnen te versmelten, zoals kernen in een fusiereactor.",
      "Het keerpunt kwam op de dag dat ik een topje van mijn vinger afsneed. Ik werkte die service gewoon door, stond de dag erna terug in de keuken, en de dag daarna ook. Vanaf dan had ik het respect van mijn chef, en was onze samenwerking een andere.",
      "Hier leerde ik de werkhouding van een chef van 72: integer werken, kalm blijven onder druk, en het laatste bord even goed maken als het eerste.",
      "Die houding kwam verrassend goed van pas toen ik de IT in ging. Het blijkt dat horeca en consultancy veel met elkaar gemeen hebben.",
    ],
    exteriorAlt:
      "De straatgevel van Entrepot del Tartufo, met gedekte tafels op het terras",
    exteriorCaption: "Het terras, gedekt voor de service.",
    trufflesAlt: "Twee handen met een hoop verse zwarte truffels",
    trufflesCaption: "Zwarte truffel, de levering van die week.",
    memojiAlt: "Memoji van Bera Senol, hand aan zijn kin, in gedachten",
  },
  dignify: {
    eyebrow: "2025 – 2026",
    title: "Dignify",
    tagline: "Marketing automation voor Bol.com en BNP Paribas Fortis",
    paragraphs: [
      "Ik begon bij Dignify in Genk met een Selligent-opleiding. Het traject was gepland op acht weken; ik rondde het af in zes, met de hoogste score in twee jaar.",
      "Als junior developer werkte ik daarna aan kleine en middelgrote projecten voor Bol.com, met eigen, rechtstreeks contact met managers en stakeholders.",
      "Het werk bestond uit herbruikbare SQL stored procedures voor doelgroepsegmentatie en rapportering, en eigen dashboards in JavaScript die stakeholders rechtstreeks zicht gaven op campagneprestaties in plaats van een handmatig rapport.",
      "Hier leerde ik gestructureerd werken: code hergebruiken, verder bouwen op een eigen framework om verschillende systemen te automatiseren, en gaandeweg wat lichte systeemarchitectuur.",
      "Daarna werkte ik ter plaatse bij BNP Paribas Fortis in Brussel als Medior Consultant, in Adobe Campaign Classic. Daar leerde ik hoe oplossingen in de praktijk werken op een gigantische database, gesharded in vele stukken: per afdeling, per regio, per vertrouwelijkheidsniveau.",
    ],
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
    boardCaption: "Het narrenmat, schaakmat in 4 halve zetten",
    replayLabel: "Speel de partij opnieuw af",
    screenAlt:
      "DGT Studio Pro op een MacBook, met een partij die van een DGT-bord is gelezen, de PGN, de opening en de engine-evaluatie",
    featuresTitle: "Je persoonlijke arbiter",
    features: [
      {
        title: "Live vanaf het bord",
        body: "Elke zet op het DGT-bord verschijnt in de app terwijl hij gespeeld wordt, via USB.",
      },
      {
        title: "Herstel bij desync",
        body: "Zijn het bord en de app het oneens over de stelling, dan zoekt de app uit wat er gebeurd is in plaats van te stoppen.",
      },
      {
        title: "PGN in SAN",
        body: "Elke partij exporteert als een standaard PGN-bestand, met de zetten in standaard algebraïsche notatie.",
      },
      {
        title: "Een eigen bibliotheek",
        body: "Partijen staan in een SwiftData-bibliotheek met zoeken, slimme tags en vier weergaven.",
      },
      {
        title: "Analyse met Stockfish",
        body: "Een evaluatiegrafiek over de hele partij, naast de opening met ECO-code en variant.",
      },
    ],
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
    eyebrow: "Zeven van elk",
    title: "Talen",
    naturalLabel: "Natuurlijke talen",
    programmingLabel: "Programmeertalen",
    nativeNote: "moedertaal",
    // Levels read off the CV's bars: each fill's length over its track's.
    natural: [
      { name: "Nederlands", level: 100, native: true },
      { name: "Engels", level: 91 },
      { name: "Turks", level: 64 },
      { name: "Frans", level: 52 },
      { name: "Duits", level: 52 },
      { name: "Japans", level: 39 },
      { name: "Italiaans", level: 25 },
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
    { icon: "cake", label: "Heeft een dessertmaag" },
    { icon: "star", label: "Stagiair in een sterrenzaak" },
    { icon: "cup", label: "Arbeidsnectar" },
    { icon: "yen", label: "Is (nog) niet in Japan geweest" },
  ],
  footer: {
    owner: "Bera Senol",
    credits: [
      "Gemaakt met ",
      { tool: "react" },
      ", ",
      { tool: "typescript" },
      ", ",
      { tool: "vite" },
      " en ",
      { tool: "tailwind" },
      ". Door ",
      { tool: "actions" },
      " gepubliceerd op ",
      { tool: "pages" },
      ".",
    ],
    sourceLabel: "Bekijk de broncode",
  },
};
