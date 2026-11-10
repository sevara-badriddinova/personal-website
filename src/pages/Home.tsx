import { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Writing from "../components/Writing";
import About from "../components/About";
import Contact from "../components/Contact";
import VariantSwitcher from "../terminal/VariantSwitcher";
import { terminalVariant, type TerminalVariant } from "../data/content";

// Set VITE_TERMINAL_SWITCHER=1 when building a preview to compare terminal versions.
const SHOW_SWITCHER = import.meta.env.VITE_TERMINAL_SWITCHER === "1";

export default function Home() {
  const [variant, setVariant] = useState<TerminalVariant>(terminalVariant);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header variant={variant} />
      <main id="main">
        <Hero variant={variant} />
        <Experience />
        <Projects />
        <Writing />
        <About />
        <Contact />
      </main>
      {SHOW_SWITCHER && <VariantSwitcher value={variant} onChange={setVariant} />}
    </>
  );
}
