import Header from "../components/Header";
import Hero from "../components/Hero";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Writing from "../components/Writing";
import About from "../components/About";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Experience />
        <Projects />
        <Writing />
        <About />
        <Contact />
      </main>
    </>
  );
}
