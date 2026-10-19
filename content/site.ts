// All the words on the site live here. Edit this file to change content;
// the components only handle layout and motion.

export const profile = {
  name: "Rohan Prasad",
  role: "Full Stack Developer",
  tagline: "I build products end to end, and websites that move.",
  location: "Sikkim, India",
  email: "rohanroday@gmail.com",
  github: "https://github.com/rohanroday",
  linkedin: "https://www.linkedin.com/in/rohanprasad28/",
  status: "Open to full-stack roles",
  about: [
    "I'm a full stack developer from Sikkim who likes owning the whole thing: the React or React Native front end, the Node.js API behind it, and the MongoDB data model underneath.",
    "I care about the parts users never see, like payments that can't double-charge, orders that can't oversell, and tests that catch it when they do. I also like the parts they do see, so I build scroll-driven, animated websites with GSAP and Three.js.",
  ],
};

export const stats = [
  { value: 4, suffix: "", label: "full-stack apps built" },
  { value: 150, suffix: "+", label: "automated tests in Chito" },
  { value: 8.6, suffix: "", label: "CGPA, B.Tech CSE (AI & ML)", decimals: 1 },
];

export const experience = [
  {
    role: "Software Engineer Intern",
    org: "National Informatics Centre (NIC-Sikkim)",
    period: "Jan 2026 – Jul 2026",
    place: "East Sikkim, India",
    points: [
      "Built a role-based workflow management system in React.js for processing and tracking government applications.",
      "Implemented RBAC for four user tiers (Super Admin, Department Admin, Officer, Employee) with secure permission management.",
      "Designed dynamic workflow routing with hierarchical approvals across departments.",
      "Added real-time application tracking, audit logging and admin dashboards.",
    ],
  },
  {
    role: "B.Tech, Computer Science & Engineering (AI & ML)",
    org: "Sikkim Manipal Institute of Technology",
    period: "2022 – 2026",
    place: "Majitar, Sikkim",
    points: ["Graduated with a CGPA of 8.6 / 10."],
  },
];

export type Project = {
  name: string;
  kind: string;
  summary: string;
  points: string[];
  stack: string[];
  image: string; // in /public/projects
  frame: "browser" | "phone";
  badges?: string[]; // floating labels around a phone mockup
  live?: string;
  repo?: string;
};

export const featured: Project[] = [
  {
    name: "Chito",
    kind: "Grocery delivery app",
    summary:
      "A quick-commerce app for my hometown: customer app on Android, iOS and web, an admin dashboard, and a REST API.",
    points: [
      "Server-enforced 3 km delivery zone and live order tracking over Socket.io",
      "Razorpay with verified payments and auto-refunds",
      "MongoDB transactions and idempotent APIs prevent overselling and double orders",
      "JWT auth with session revocation, backed by 150+ automated tests",
    ],
    stack: ["React Native", "Node.js", "MongoDB", "Next.js", "Razorpay", "Socket.io"],
    image: "/projects/chito-login.png",
    frame: "phone",
    badges: ["🛵  Live order tracking", "✅  Payment verified", "📍  3 km delivery zone"],
    live: "https://chito-mobile.vercel.app/login",
    repo: "https://github.com/rohanroday/Chito",
  },
  {
    name: "Sikkim Trip",
    kind: "Travel booking platform",
    summary:
      "Book Sikkim trips online: fixed-price tour packages for North Sikkim, Nathula and Pelling, plus homestays with live availability.",
    points: [
      "Permits handled through registered operators",
      "Razorpay payments and WhatsApp messaging",
      "Admin panel for packages, homestays and content",
      "Local test mode that runs without live keys",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "MongoDB", "Razorpay"],
    image: "/projects/sikkim-trip.png",
    frame: "browser",
    live: "https://sikkim-trip-beta.vercel.app/",
    repo: "https://github.com/rohanroday/Sikkim-Trip",
  },
  {
    name: "HUSH",
    kind: "E-commerce clothing store",
    summary:
      "A MERN e-commerce store for a clothing brand, from catalog to checkout.",
    points: [
      "Catalog with category filters, search and product pages",
      "Authentication, cart and checkout on a REST API",
      "Admin panel for products, orders and inventory",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB"],
    image: "/projects/hush.png",
    frame: "browser",
    live: "https://hush-tlrw.onrender.com/",
    repo: "https://github.com/rohanroday/HUSH",
  },
];

export type Concept = { name: string; blurb: string; stack: string; image: string; live: string; repo: string };

export const concepts: Concept[] = [
  {
    name: "Car Culture Sikkim",
    blurb: "A cinematic drive up a mountain pass, scrubbed by your scroll.",
    stack: "React · Vite · GSAP · Three.js",
    image: "/projects/car-culture.png",
    live: "https://car-culture-sikkim.vercel.app",
    repo: "https://github.com/rohanroday/Car-Culture-Sikkim",
  },
  {
    name: "Agapi Sikkim",
    blurb: "Vegan skincare with a scroll-scrubbed hero and floating Three.js petals.",
    stack: "React · Vite · GSAP · Three.js",
    image: "/projects/agapi.png",
    live: "https://agapi-navy.vercel.app",
    repo: "https://github.com/rohanroday/Agapi",
  },
  {
    name: "Headquarter",
    blurb: "A Gangtok media house: light and dark themes, WhatsApp brief form.",
    stack: "Next.js · Tailwind · GSAP",
    image: "/projects/headquarter.png",
    live: "https://headquarter-mu.vercel.app",
    repo: "https://github.com/rohanroday/Headquarter",
  },
  {
    name: "Summit Fitness",
    blurb: "A brand site for a gym in Singtam.",
    stack: "JavaScript",
    image: "/projects/summit.png",
    live: "https://summit-fitness-weld.vercel.app",
    repo: "https://github.com/rohanroday/Summit-fitness",
  },
];

export const skills = [
  { group: "Frontend", items: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS", "Vite", "GSAP", "Lenis", "Three.js"] },
  { group: "Backend", items: ["Node.js", "Express", "REST APIs", "Socket.io", "JWT", "RBAC", "Razorpay", "WhatsApp API"] },
  { group: "Data", items: ["MongoDB", "MySQL", "Transactions", "Schema design"] },
  { group: "Tools", items: ["Git", "GitHub", "Postman", "Vercel", "Render", "Automated testing", "Python", "C"] },
];

export const achievements = {
  highlight: {
    title: "META Grant, ₹50,000",
    year: "2022",
    text: "Awarded for Denzong Water, an XR-based start-up initiative for sustainable tourism and digital innovation in Sikkim.",
  },
  certifications: [
    "Full-Stack Web Development Bootcamp, Angela Yu (Udemy)",
    "Machine Learning with Python (Maria EduCare)",
    "PwC Cyber Security Launchpad Program",
    "Ethical Hacking Fundamentals (LearnKartS, Coursera)",
  ],
};
