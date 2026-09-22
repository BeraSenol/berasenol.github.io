import { Contact } from "./components/Contact";
import { DgtStudio } from "./components/DgtStudio";
import { Dignify } from "./components/Dignify";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Kitchen } from "./components/Kitchen";
import { Languages } from "./components/Languages";
import { LiquidGlassFilters } from "./components/LiquidGlassFilters";
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
      <LiquidGlassFilters />
      <Header content={content} />
      <main>
        <Splash content={content} />
        <Kitchen content={content} />
        <Dignify content={content} />
        <DgtStudio content={content} />

        <Section
          id="languages"
          eyebrow={content.languages.eyebrow}
          title={content.languages.title}
          uppercase
        >
          <Languages
            naturalLabel={content.languages.naturalLabel}
            programmingLabel={content.languages.programmingLabel}
            nativeNote={content.languages.nativeNote}
            natural={content.languages.natural}
            programming={content.languages.programming}
          />
        </Section>

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

      <Footer content={content} />
    </>
  );
}

export default App;
