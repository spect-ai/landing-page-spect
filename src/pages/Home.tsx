import HeroSection from "../modules/1-Hero-Section";
import About from "../modules/2-About-Spect";
import SpectVerse from "../modules/3-Spect-Verse";
import Features from "../modules/4-Features";
import Footer from "../modules/Footer";

export default function Home() {
  return (
    <div className="flex flex-col bg-black text-white w-full font-default">
      <HeroSection />
      <About />
      <SpectVerse />
      <Features />
      <Footer />
    </div>
  );
}
