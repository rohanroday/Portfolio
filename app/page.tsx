import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import FeaturedWork from "@/components/sections/FeaturedWork";
import CreativeLab from "@/components/sections/CreativeLab";
import Skills from "@/components/sections/Skills";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import PageAnimations from "@/components/effects/PageAnimations";

// One-page portfolio. Each section lives in components/sections; all copy is in content/site.ts.
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <FeaturedWork />
        <CreativeLab />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <PageAnimations />
    </>
  );
}
