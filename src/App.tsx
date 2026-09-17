import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Section } from './components/Section'
import { Splash } from './components/Splash'

function App() {
  return (
    <>
      <Header />
      <main>
        <Splash />
        <Hero />

        <Section id="about" eyebrow="About" title="Placeholder heading — rewrite me.">
          <p>
            This is where the real copy goes. Two or three short paragraphs: what you build, what
            you are good at, and what kind of work you want next.
          </p>
          <p>
            Keep it specific. A recruiter skimming this should be able to say what you do within
            five seconds of landing here.
          </p>
        </Section>

        <Section id="work" eyebrow="Work" title="Selected projects">
          <p>Empty for now — this becomes a typed array of projects in milestone 3.</p>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Get in touch">
          <p>Email, GitHub, LinkedIn. Your call which ones are public.</p>
        </Section>
      </main>

      <footer className="border-t border-hairline px-6 py-10">
        <p className="mx-auto max-w-3xl text-xs text-ink-dim">
          &copy; {new Date().getFullYear()} Bera Senol
        </p>
      </footer>
    </>
  )
}

export default App
