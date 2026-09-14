// Single source of truth for the 8 rentable games, shared between the
// homepage's featured games and the full game listing/booking page.
// Mirrors the `Game` data model in context/project-overview.md.

export const games = [
  {
    slug: "monopoly",
    name: "Monopoly",
    shortDescription: "The classic trading game the whole family knows.",
    description:
      "A classic for longer game nights where everyone buys, trades, negotiates, and tries not to go bankrupt.",
    howToPlay:
      "Roll the dice, buy properties as you land on them, build houses and hotels, and try to bankrupt everyone else before you run out of cash.",
    imageSrc: "/img/games/monopoly.jpg",
    imageAlt: "Monopoly board game box",
    icon: null,
    players: "2–6 players",
    playTime: "60–180 min",
    age: "8+",
    pricePerDay: 150,
    deposit: 500,
    lateFeePerDay: 150,
  },
  {
    slug: "exploding-kittens",
    name: "Exploding Kittens",
    shortDescription: "A fast, hilarious game of strategy, luck, and cats.",
    description:
      "A quick, chaotic card game with simple rules, sneaky moves, and plenty of chances to ruin your friends’ plans.",
    howToPlay:
      "Draw cards each turn and use action cards to skip, peek, or sabotage your opponents — just don’t draw an Exploding Kitten without a Defuse card in hand.",
    imageSrc: "/img/games/exploding-kittens.jpg",
    imageAlt: "Exploding Kittens card game box",
    icon: null,
    players: "2–5 players",
    playTime: "About 15 min",
    age: "7+",
    pricePerDay: 150,
    deposit: 500,
    lateFeePerDay: 150,
  },
  {
    slug: "monopoly-deal",
    name: "Monopoly Deal",
    shortDescription: "A quick Monopoly card game for one sitting.",
    description:
      "All the trading and deal-making of Monopoly packed into a much faster card game.",
    howToPlay:
      "Play property, money, and action cards from your hand to be the first to collect three full property sets.",
    imageSrc: "/img/games/monopoly-deal.jpg",
    imageAlt: "Monopoly Deal card game box",
    icon: null,
    players: "2–5 players",
    playTime: "About 15 min",
    age: "8+",
    pricePerDay: 100,
    deposit: 100,
    lateFeePerDay: 100,
  },
  {
    slug: "game-of-life",
    name: "Game of Life",
    shortDescription:
      "Make your way through careers, family choices, expenses, and unexpected turns in this easygoing family classic.",
    description:
      "Make your way through careers, family choices, expenses, and unexpected turns in this easygoing family classic.",
    howToPlay:
      "Spin the wheel to move along the path of life, picking careers, salaries, and family along the way, then see who retires with the most money.",
    imageSrc: null,
    imageAlt: null,
    icon: "bi-signpost-split-fill",
    placeholderBg: "bg-primary-subtle",
    players: "2–4 players",
    playTime: "About 45–60 min",
    age: "8+",
    pricePerDay: 150,
    deposit: 500,
    lateFeePerDay: 150,
  },
  {
    slug: "herd-mentality",
    name: "Herd Mentality",
    shortDescription: "Guess what everyone else will guess to win.",
    description:
      "Try to think like everyone else. The closer your answers are to the group, the better your chances of winning.",
    howToPlay:
      "Everyone secretly answers the same question, then reveals at once — match the most common answer to earn the pink cow token.",
    imageSrc: "/img/games/herd-mentality.jpg",
    imageAlt: "Herd Mentality board game box",
    icon: null,
    players: "4+ players",
    playTime: "About 20 min",
    age: "10+",
    pricePerDay: 150,
    deposit: 500,
    lateFeePerDay: 150,
  },
  {
    slug: "piles",
    name: "Piles",
    shortDescription:
      "A fast card-matching race where everyone plays at the same time. Easy to learn and great when you want something quick.",
    description:
      "A fast card-matching race where everyone plays at the same time. Easy to learn and great when you want something quick.",
    howToPlay:
      "Flip cards onto shared piles at the same time as everyone else and be the first to empty your hand.",
    imageSrc: null,
    imageAlt: null,
    icon: "bi-stack",
    placeholderBg: "bg-accent-subtle",
    players: "2–8 players",
    playTime: "10–15 min",
    age: "8+",
    pricePerDay: 150,
    deposit: 500,
    lateFeePerDay: 150,
  },
  {
    slug: "rc-plane",
    name: "RC Plane",
    shortDescription:
      "Something different from the tabletop—take turns flying an RC plane and see who can handle it best.",
    description:
      "Something different from the tabletop—take turns flying an RC plane and see who can handle it best.",
    howToPlay:
      "Take turns at the controls and see who can keep it steady, land it smoothly, and rack up the most flight time.",
    imageSrc: null,
    imageAlt: null,
    icon: "bi-airplane",
    placeholderBg: "bg-primary-subtle",
    players: "1+ / take turns",
    playTime: "Flexible",
    age: "Check exact model",
    pricePerDay: 150,
    deposit: 200,
    lateFeePerDay: 150,
  },
  {
    slug: "jackstones",
    name: "Jackstones",
    shortDescription:
      "A simple hand-and-eye coordination classic that’s quick to set up and easy to bring anywhere.",
    description:
      "A simple hand-and-eye coordination classic that’s quick to set up and easy to bring anywhere.",
    howToPlay:
      "Toss the ball, scoop up jacks before it bounces back, and work your way up from onesies to as many as you can grab.",
    imageSrc: null,
    imageAlt: null,
    icon: "bi-stars",
    placeholderBg: "bg-accent-subtle",
    players: "1+ players",
    playTime: "10–20 min",
    age: "6+",
    pricePerDay: 50,
    deposit: 50,
    lateFeePerDay: 50,
  },
];

// Hardcoded sample booked ranges to demo the "unavailable" state on the
// games page — no backend/database yet.
export const bookedRanges = {
  monopoly: [{ start: "2026-09-20", end: "2026-09-22" }],
  piles: [{ start: "2026-10-05", end: "2026-10-07" }],
};
