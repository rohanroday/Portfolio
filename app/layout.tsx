import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/content";
import "./globals.css";

// Google now ships Big Shoulders Display as part of the single "Big Shoulders" family (opsz axis)
const bigShoulders = Big_Shoulders({ variable: "--font-big-shoulders", weight: "variable", axes: ["opsz"], subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", weight: ["400", "600"], subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: "The Hill Station Picture House",
    images: [{ url: "/og.png", width: 1440, height: 900, alt: "Rohan Prasad: two cinema tickets in front of Himalayan ridges at night" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og.png"] },
};

export const viewport: Viewport = { themeColor: "#17163a" };

// Runs before first paint: on the box office, hide the hero pieces the intro will reveal,
// unless the visitor prefers reduced motion or has already seen the intro this session.
const introScript = `try{if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("hs-intro")){document.documentElement.classList.add("intro")}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${instrumentSerif.variable} ${jetbrains.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      {/* Browser extensions (e.g. ColorZilla) add attributes to <body> before React loads */}
      <body className="min-h-screen" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-marigold focus:px-4 focus:py-2 focus:text-night"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
