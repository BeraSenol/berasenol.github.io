import { Contact } from "./components/Contact";
import { DgtStudio } from "./components/DgtStudio";
import { Dignify } from "./components/Dignify";
import { Container } from "./components/Container";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Kitchen } from "./components/Kitchen";
import { Section } from "./components/Section";
import { Splash } from "./components/Splash";
import type { Content } from "./content/types";

/**
 * One page, rendered twice at build time with a different `content` object.
 * There is no locale state anywhere: the URL decides which dictionary the entry
 * file hands in, so a reload or a pasted link always shows the same language.
 */
function App({ content }: { content: Content }) {
  return (
    <>
      <Header content={content} />
      <main>
        <Splash content={content} />
        <Kitchen content={content} />
        <Dignify content={content} />
        <Hero content={content} />

        <DgtStudio content={content} />

        <Section
          id="contact"
          eyebrow={content.contact.eyebrow}
          title={content.contact.title}
        >
          <Contact
            intro={content.contact.intro}
            links={content.contactLinks}
            memojiAlt={content.contact.memojiAlt}
          />
        </Section>
      </main>

      <footer className="border-t border-hairline py-10">
        <Container>
          <p className="text-xs text-ink-dim">
            &copy; {new Date().getFullYear()} {content.footer}
          </p>
        </Container>
      </footer>
    </>
  );
}

export default App;
