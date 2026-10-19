import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/effects/SmoothScroll";
import CustomCursor from "@/components/effects/CustomCursor";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", weight: ["500", "600", "700"], subsets: ["latin"] });

const description =
  "Rohan Prasad is a full stack developer from Sikkim building React, React Native and Node.js products end to end, plus animated websites with GSAP and Three.js.";

export const metadata: Metadata = {
  title: "Rohan Prasad · Full Stack Developer",
  description,
  // DEPLOY STEP: add metadataBase with the live URL so og:image becomes absolute.
  openGraph: {
    title: "Rohan Prasad · Full Stack Developer",
    description,
    images: ["/projects/car-culture.png"],
  },
};

export const viewport: Viewport = { themeColor: "#0a0a0f" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-teal focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <div className="site-glow" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <SmoothScroll />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
