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
    eyebrow: "Vandaag",
    headline: "Nu bouw ik software voor Apple-platformen.",
    body: "macOS-apps in Swift en SwiftUI, schaaksoftware die exact moet kloppen, en af en toe iets voor het web.",
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
      "Daarvoor had ik stage gelopen in een restaurant met een Michelinster. Hier stonden we met twee, dus de helft van elke service was van mij.",
      "Service is een deadline die komt of je er nu klaar voor bent of niet. Je raakt er enkel door met voorbereiding van uren eerder: elk onderdeel geportioneerd, geëtiketteerd en binnen handbereik voor de eerste bon binnenloopt. De kwaliteit moet bij het tweehonderdste bord even goed zijn als bij het eerste.",
      "Het handelsmerk van de keuken is truffel, en truffel vergeeft niets. Te veel hitte en het aroma is weg voor het bord op tafel staat. Het is duur, het blijft niet goed, en de levering van een week moet je goed benutten. Timing telt meer dan het recept.",
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
      "De campagnes zelf liepen in Selligent en Adobe Campaign Classic. Voor BNP Paribas Fortis werkte ik ter plaatse in Brussel, in Adobe Campaign, waar een campagne een flow is van targeting, filters en verzendingen, en een verkeerde join echte klanten bereikt.",
      "Het certificeringstraject deed ik in zes weken in plaats van acht, en ik sloot het af met de hoogste score in twee jaar.",
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
    screenAlt:
      "DGT Studio Pro op een MacBook, met een partij die van een DGT-bord is gelezen, de PGN, de opening en de engine-evaluatie",
    featuresTitle: "Van bord naar Mac",
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
        body: "Partijen staan in een SwiftData-bibliotheek met zoeken, slimme tags zoals Timed, Draws en Not Analyzed, en vier weergaven.",
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
    { icon: "cake", label: "Zoetekauw" },
    { icon: "star", label: "Stagiair in een sterrenzaak" },
    { icon: "cup", label: "Arbeidsnectar" },
    { icon: "yen", label: "Is (nog) niet in Japan geweest" },
  ],
  footer: "Bera Senol",
};
