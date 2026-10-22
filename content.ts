// Every word on the site lives here. Edit freely; components only handle layout and motion.
// Anything in [BRACKETS] is a placeholder that still needs real content. It shows on the page
// with a dashed outline so it can't be missed.

/** A headline with one emphasised (italic, coloured) phrase, e.g. "I grew up in a *hostel*." */
export type Headline = { before: string; em: string; after?: string; tone: "blush" | "marigold" };

export const site = {
  name: "Rohan Prasad",
  url: "https://rohanprasad.vercel.app",
  title: "Rohan Prasad — Full-Stack Developer, Sikkim",
  description:
    "The Hill Station Picture House: the portfolio of Rohan Prasad, a full-stack developer from Sikkim building React, Next.js, React Native and Node.js products.",
  status: "Open to roles and freelance",
  email: "rohanroday@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/rohanprasad28/",
    github: "https://github.com/rohanroday",
    resume: "", // empty = shows as [RESUME LINK] placeholder; add a URL when ready
    archive: "https://github.com/rohanroday?tab=repositories",
  },
};

export const nav = [
  { label: "Work", href: "/builds" },
  { label: "About", href: "/stack" },
  { label: "Contact", href: "/stack#contact" },
];

export const sound = { off: "Sound off · tap for the hills", on: "Sound on · the hills are humming", short: "Sound" };

export const boxOffice = {
  presents: "THE HILL STATION PICTURE HOUSE · PRESENTS",
  name: "ROHAN PRASAD",
  tagline: "You've been dreaming in the hills.",
  meta: "FULL-STACK DEVELOPER · SIKKIM · SK 01",
  pick: "TWO SHOWS TONIGHT. PICK ONE TICKET.",
  scroll: "SCROLL TO STEP INSIDE",
};

export type TicketData = {
  href: string;
  tone: "blush" | "marigold";
  tilt: number;
  kicker: string;
  title: string;
  /** Subtitle, with the italic part separated out */
  line: { before: string; em: string; after?: string };
  meta: string[];
  number: string;
};

export const tickets: TicketData[] = [
  {
    href: "/stack",
    tone: "blush",
    tilt: -1.5,
    kicker: "TICKET 1 · THE STAGE",
    title: "THE STACK",
    line: { before: "A portfolio in five acts, ", em: "with an intermission" },
    meta: ["CURTAIN 7:00 PM", "GATE SK", "SEAT 01"],
    number: "Nº 000 001",
  },
  {
    href: "/builds",
    tone: "marigold",
    tilt: 1.5,
    kicker: "TICKET 2 · THE PICTURE HOUSE",
    title: "THE BUILDS",
    line: { before: "Now showing: ", em: "Chito", after: ", a quick-commerce picture made for my hometown" },
    meta: ["REEL 9:15 PM", "ROW 26", "SEAT II"],
    number: "Nº 002 026",
  },
];

export const stack = {
  ticketLabel: "TICKET 1 · THE STACK · SEAT 01",
  kicker: "INSIDE THE MIND OF",
  title: { before: "Rohan Prasad, ", em: "in five acts.", tone: "blush" } as Headline,
  intro: "A full-stack developer from Sikkim. The house lights dim as you scroll; each act fades in like a scene change.",
};

export type Act = {
  id: string;
  label: string;
  numeral: string;
  date: string;
  headline: Headline;
  body: string;
  pills?: string[];
  cards?: { label: string; value: string }[];
  cta?: { label: string; href: string };
};

export const actsBeforeIntermission: Act[] = [
  {
    id: "act-1",
    label: "ACT I",
    numeral: "01",
    date: "2011 to 2022",
    headline: { before: "I grew up in a ", em: "hostel.", tone: "blush" },
    body: "Boarding student at Tashi Namgyal Academy from Class 2 to 12. National-level table tennis, chess wins, the dance floor, and free tuition for my juniors in the evenings.",
    pills: ["Table tennis, national level", "Chess", "Dance", "Tutoring juniors"],
  },
  {
    id: "act-2",
    label: "ACT II",
    numeral: "02",
    date: "2022 to 2026",
    headline: { before: "I build the whole ", em: "stack.", tone: "blush" },
    body: "B.Tech in Computer Science and Engineering (AI and ML) at Sikkim Manipal Institute of Technology. The screen you tap, the API behind it, and the database underneath.",
    cards: [
      { label: "FRONT", value: "React · Next.js · React Native" },
      { label: "BACK", value: "Node.js · REST APIs" },
      { label: "DATA", value: "MongoDB · Razorpay" },
    ],
  },
  {
    id: "act-3",
    label: "ACT III",
    numeral: "03",
    date: "The hometown picture",
    headline: { before: "Then I built ", em: "Chito.", tone: "marigold" },
    body: "A grocery quick-commerce app for my hometown: customer app in React Native, admin in Next.js, Node.js and MongoDB underneath, Razorpay at checkout.",
    cta: { label: "See it in the picture house", href: "/builds" },
  },
];

export const intermission = {
  word: "INTERMISSION",
  line: "Fifteen minutes. Hill tea at the counter.",
};

export const actsAfterIntermission: Act[] = [
  {
    id: "act-4",
    label: "ACT IV",
    numeral: "04",
    date: "Jan to Jun 2026",
    headline: { before: "Code for the ", em: "state.", tone: "blush" },
    body: "Intern at the National Informatics Centre, Sikkim. Built a role-based workflow system in React.js for processing and tracking government applications, with approvals routed across departments.",
  },
  {
    id: "act-5",
    label: "ACT V",
    numeral: "05",
    date: "Now playing",
    headline: { before: "Shipping for ", em: "clients.", tone: "marigold" },
    body: "Interning on client projects, straight from their repos. Open to full-stack roles and freelance websites for companies and startups.",
  },
];

export const contact = {
  basedIn: { label: "BASED IN", place: "Sikkim.", plate: "SK 01", line: "Mountains out the window, prayer flags on the road. [ONE LINE ABOUT LIFE OFF THE KEYBOARD]" },
  curtain: { label: "CURTAIN CALL", title: "Get in touch." },
};

export const builds = {
  ticketLabel: "TICKET 2 · THE PICTURE HOUSE · ROW 26",
  kicker: "THE PROGRAMME",
  title: "NOW SHOWING",
  tagline: "Things I've designed, built and shipped, from the first commit to the checkout screen.",
  feature: {
    top: ["FEATURE PRESENTATION", "REEL 01"],
    sub: "a quick-commerce picture",
    title: "CHITO",
    screenshots: [
      { src: "/projects/chito-login.png", alt: "Chito app sign-in screen: a Sikkimese monastery illustration above a phone-number login" },
      null, // [APP SCREENSHOT 2]
      null, // [APP SCREENSHOT 3]
    ],
    logline: "Groceries for my hometown, ordered on the phone and paid for in one tap.",
    credits: [
      { term: "DIRECTED AND BUILT BY", detail: "Rohan Prasad" },
      { term: "FILMED ON LOCATION", detail: "Singtam, Sikkim" },
      { term: "CUSTOMER APP", detail: "React Native" },
      { term: "ADMIN AND WEB", detail: "Next.js" },
      { term: "BACKSTAGE", detail: "Node.js · MongoDB" },
      { term: "BOX OFFICE", detail: "Razorpay" },
    ],
    note: "[THE PROBLEM IN ONE LINE] · [ONE RESULT YOU CAN STAND BEHIND]",
    buttons: [
      { label: "Watch the case study", href: "" }, // empty = placeholder until the case study exists
      { label: "Source on GitHub", href: "https://github.com/rohanroday/Chito" },
    ],
  },
  comingSoon: {
    title: "COMING SOON",
    aside: "TRAILERS BEFORE THE NEXT SHOW",
    posters: [
      { kicker: "TRAILER 01 · NIC SIKKIM", title: "[NIC PROJECT NAME]", line: "Government tech, Jan to Jun 2026", tone: "blush" as const },
      { kicker: "TRAILER 02 · IN PRODUCTION", title: "THE 3D HOUSE WALKTHROUGH", line: "Room by room, then one slow orbit", tone: "dusk" as const },
      { kicker: "TRAILER 03 · CLIENT WORK", title: "[CLIENT PROJECT]", line: "Your website could be next", tone: "cream" as const },
    ],
  },
  footer: {
    archive: "Lost property: the archive",
    swap: "Swap tickets: The Stack, in five acts",
  },
};
