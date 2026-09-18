/**
 * The two third-party marks used in the Dignify section.
 *
 * A Vite SVG import resolves to a URL, and inside an <img> the file is an opaque
 * document: its fill cannot be reached from the page, so it cannot pick up a
 * theme colour or a hover state. Inlined, each path is an ordinary element.
 *
 * Both are inline elements rather than <img> tags. An <img> renders the file as
 * an opaque document: nothing on the page can reach inside it, so the fill can
 * never respond to a theme, a hover state or a print stylesheet. Inline, every
 * path is an ordinary DOM node.
 *
 * Both fills are hard-coded brand colours today; currentColor would work on
 * either one now that they are inline.
 */

/**
 * The Selligent loop with the name set as live text, proportioned off the real
 * lockup instead of guessed.
 *
 * Measured from the 496x107 reference: the wordmark ascender is 80px and the
 * MARKETING CLOUD cap height is 20px, so the second line is a quarter the height
 * of the first, not the two-thirds a naive pairing gives. Its stems lean 10.0
 * degrees (fitted across four of them, agreeing to within 0.3 degrees), its
 * stem-to-x-height ratio is 0.21, which is semibold, and its letter advances sit
 * a hair under natural width: the small line is NOT letterspaced in the original,
 * it only looks that way because the face is geometric and open. The 0.08em here
 * is the one deviation, and the one number that depends on the font: SF Pro's
 * caps are narrower against this wordmark than the lockup's face is against its
 * own, so without it the small line spans 0.50 of the logo where the reference
 * spans 0.56. Re-measure that ratio if the type ever changes. The loop stands 0.95 of the
 * ascender and its foot sits on the wordmark baseline. The small line is right
 * aligned to the loop's right edge, which is why it starts under the middle of
 * the word.
 *
 * Every measurement is expressed in em against the root font-size, so one number
 * on the root scales the whole thing and the ratios hold at any size.
 *
 * The slant is a skewX, not font-style: italic. SF Pro's italic is a true italic
 * with different letterforms; the lockup is a plain oblique. A skew also holds
 * its angle whatever font actually renders, where an italic's slant is whatever
 * that font ships.
 */
export function SelligentLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-grid text-[1.75rem] leading-none sm:text-[2rem] ${className}`}>
      <div className="flex items-baseline gap-[0.09em]">
        <span
          className="font-semibold tracking-[-0.02em] text-ink"
          style={{ transform: 'skewX(-10deg)' }}
        >
          Selligent
        </span>
        <svg viewBox="0 0 320 181.9" className="h-[0.69em] w-auto shrink-0" aria-hidden="true">
          <path fill="#00b8fa" fillRule="evenodd" d="M68 181.8C52.9 180.2 42 176.2 30.5 168.1C22.7 162.6 14.8 153.9 10 145.5C7.3 140.8 5.5 136.9 4.1 132.7C3.9 132.1 3.6 131.2 3.4 130.6C2.4 128 1.7 124.6 0.5 117.7C0.1 115.5 -0.1 104.3 0.2 101.6C0.9 94.6 2.6 87.6 4.9 81.9C5.2 81.1 5.6 80 5.8 79.5C6.8 77 9.4 72 11.2 69.3C17.3 59.6 25 52 35.3 45.5C38.6 43.4 46.2 39.8 49.1 38.9C49.6 38.8 50.2 38.6 50.6 38.5C53.5 37.2 62.3 35.4 67.1 35.1C70 34.8 123.8 34.8 124.2 35.1C124.7 35.4 124.4 35.9 119.7 42.7C118.7 44.1 117.4 46 116.8 46.8C116.3 47.6 115.5 48.7 115.2 49.1C114.9 49.6 114.1 50.7 113.6 51.5C113 52.3 112.3 53.4 111.8 53.8L111.1 54.7L89.4 54.8C69.2 54.9 65.4 55 64.7 55.4C64.7 55.5 63.8 55.6 62.8 55.8C59.1 56.4 54.2 58.1 50.1 60.1C33.6 68 22 84.5 20.1 102.7C19.8 104.9 19.8 111.8 20.1 114C20.4 117.5 21.5 122.5 22.5 125.2C23.6 128.3 23.9 129.1 24.5 130.4C25.2 132 25.3 132.1 26.5 134.3C31.2 142.7 39.1 150.7 47 155C51.7 157.6 54.8 158.9 59.8 160.3C66.3 162.1 75.9 162.5 84.9 161.3C87.3 161 89.8 160.6 90.3 160.5C90.8 160.3 91.9 160 92.7 159.8C102.7 157.3 111.2 151.5 118.3 142.4C120 140.2 124.8 133.8 127.1 130.5C127.8 129.6 128.4 128.7 129 127.9C129.2 127.6 129.6 127 129.8 126.7C130.1 126.3 132.2 123.3 134.7 119.9C137.1 116.5 139.5 113.1 140 112.4C140.5 111.6 141.2 110.7 141.4 110.4C141.7 110 142.1 109.5 142.3 109.1C142.6 108.8 143.1 108 143.5 107.5C143.9 106.9 144.4 106.2 144.7 105.8C144.9 105.5 145.3 104.9 145.6 104.6C145.8 104.2 146.2 103.7 146.5 103.3C146.7 103 149.1 99.6 151.8 95.8C154.5 91.9 156.8 88.6 157 88.4C157.2 88.2 159.3 85.1 161.9 81.6C164.4 78.1 166.6 74.9 166.8 74.7C167.1 74.4 167.9 73.1 168.8 71.9C169.7 70.7 170.6 69.4 170.9 69C171.1 68.7 172 67.5 172.7 66.5C173.5 65.5 174.7 63.8 175.4 62.8C178 59.4 182.6 53.2 184.1 51.5C184.6 50.9 185.4 49.8 185.9 49.1C191.1 42.7 200.4 35.8 207.9 32.8C212.5 31 214 30.5 217.2 29.7C222.8 28.3 224.9 28 231.8 28C238.7 28 240.8 28.3 246.4 29.7C261.8 33.5 274.6 42.9 283.5 57C285 59.3 287.7 64.9 288.2 66.6C288.3 66.8 288.4 67.1 288.5 67.2C288.9 67.8 290.8 74.5 291.1 76.5C291.2 77.3 291.5 78.4 291.6 79.1C292.2 81.7 292.4 89.3 292.1 94.1C291.8 97.5 290.4 104.6 289.5 106.7C289.4 107.1 289.1 107.9 288.9 108.5C288 111.2 287.6 112.1 285.9 115.5C284.1 119.2 283.6 120 280.9 123.9C275.3 132 264.7 140.5 255.9 144.1C251.6 145.9 249.3 146.6 246 147.4C242.5 148.2 239.4 148.7 236.4 148.9C232.9 149.2 178.6 149.2 177.9 148.9C177.2 148.7 177.3 148.4 179.3 145.5C180.1 144.4 180.4 143.9 182.4 141C183 140.3 183.7 139.3 184 138.8C184.3 138.3 185 137.3 185.6 136.5C186.2 135.6 186.9 134.6 187.2 134.1C187.5 133.7 188.2 132.7 188.8 131.9C189.3 131.1 190 130.2 190.3 129.9L190.9 129.2L211.2 129.2C230.3 129.2 236.4 129.1 238.4 128.7C241.5 128.1 242.8 127.7 244.1 127.3C254.4 123.9 262.6 117 267.6 107.7C274.6 94.7 273.9 78.2 265.7 66.1C254.8 49.9 234.7 43.6 216.7 50.7C215.2 51.3 211.7 53 210.9 53.6C210.6 53.8 210 54.2 209.5 54.5C208 55.5 205.8 57.2 204.2 58.7C201.5 61.2 198.1 65.5 189.4 77.4C188.7 78.4 187.6 79.8 187.1 80.6C186.6 81.3 185.3 83 184.3 84.5C183.3 85.9 182 87.6 181.5 88.3C181 89 180.4 89.9 180.2 90.2C178.8 92.2 176.9 94.9 170.3 104.1C166.3 109.7 162.8 114.6 162.6 114.9C162.4 115.2 161.9 115.9 161.5 116.5C161.1 117.1 160.6 117.8 160.3 118.1C160.1 118.5 159.7 119 159.4 119.4C158.8 120.2 158.1 121.2 157.6 122C157.4 122.3 154.6 126.3 151.4 130.7C148.2 135.2 145.3 139.2 145.1 139.6C142.2 143.7 135.9 152.2 133 155.9C130.5 159 125 164.6 122 167C119.6 168.9 119.6 168.8 117.6 170.2C116.8 170.7 116 171.3 115.7 171.4C114.3 172.4 107.1 176.1 106.6 176.1C106.6 176.1 106.2 176.3 105.9 176.4C103.5 177.5 97.4 179.3 93.6 180.1C92.6 180.3 91.4 180.5 91 180.6C90.5 180.7 88.8 180.9 87.1 181.1C85.5 181.3 83.5 181.5 82.8 181.6C81.1 181.8 69.9 182 68 181.8ZM158.3 176.6C158.1 176.3 158.5 175.5 160.3 172.8C160.9 172 161.8 170.7 162.4 169.9C162.9 169.2 163.6 168.2 163.9 167.7C164.2 167.2 164.9 166.2 165.5 165.4C166 164.7 166.9 163.4 167.4 162.6C168 161.9 168.9 160.5 169.5 159.7C170 158.9 170.7 158 170.9 157.7L171.4 157.1L205 157C223.4 156.9 238.6 156.9 238.7 156.8C238.8 156.7 240.2 156.5 241.8 156.3C247.3 155.5 254.2 153.5 258.8 151.5C259.7 151.1 264.7 148.6 265.3 148.2C268.5 146.4 272.4 143.7 274.9 141.7C281.4 136.2 286.7 130.1 290.5 123.7C290.8 123.2 291.2 122.5 291.3 122.2C293.4 118.7 296.2 112.1 297.5 107.7C300.2 97.9 300.9 87.4 299.4 77.8C298.5 72.5 296.9 66.9 295.1 62.5C294.7 61.7 294.3 60.7 294.1 60.2C293.2 58 290.3 52.8 288.5 50.2C284.3 44 278.6 38 272.8 33.7C271 32.3 267.5 30 265.1 28.6C264.6 28.3 260.5 26.3 258.8 25.5C256.7 24.5 252.9 23.2 249.3 22.2C240.7 19.9 231.3 19.4 222.6 20.6C209.1 22.5 197.5 27.8 187.3 36.5C183.6 39.7 180.4 43.2 176.5 48.4C172.5 53.6 170.4 56.3 169 58.3C168.3 59.2 167.2 60.7 166.5 61.7C165.8 62.7 165 63.7 164.8 64C164.4 64.6 164 65.2 162.1 67.8C161.2 69 160.3 70.2 160.1 70.5C159.9 70.8 158.3 73.1 156.5 75.5C152.3 81.4 152.6 81 152 81.8C151.8 82.1 148.7 86.5 145.2 91.4C141.7 96.4 138.6 100.7 138.4 101.1C138.2 101.4 137.7 102 137.5 102.3C136.8 103.2 136.2 104.2 135.7 104.9C135.1 105.7 121.7 124.5 121.3 125.1C119.6 127.4 118.9 128.5 118 129.7C110.1 140.7 106.1 144.9 100.3 148.3C96.6 150.4 91 152.4 87.5 152.9C87.1 153 85.7 153.2 84.3 153.5C82.1 153.8 81.2 153.9 74.8 153.9C67.2 153.9 65.6 153.7 61 152.4C45.7 147.9 34.1 136.5 29.6 121.4C29.1 119.9 28.9 118.9 28.2 115.5C27.8 113.6 27.7 106.6 27.9 103.7C28.5 97 31.3 89.2 34.9 83.7C42.4 72.3 53.6 65.1 67.1 63C69 62.7 104.1 62.5 104.7 62.8C105.2 63.1 105.1 63.7 104.2 64.9C103.3 66.2 102 68.2 100.4 70.4C99.9 71.3 99.2 72.3 98.8 72.8C98.5 73.2 97.8 74.2 97.3 75C96.7 75.8 95.9 77 95.3 77.8C94.8 78.6 93.9 79.8 93.5 80.5C92 82.7 93.2 82.5 81 82.6C74.2 82.6 69.9 82.8 69 82.9C58.5 84.6 49.5 93.6 47.9 104.2C46 117.4 53.7 129.5 66.3 133.2C69.3 134 71 134.2 76.3 134C86 133.8 91 131.8 95.4 126.5C96.6 125.1 98.3 122.9 101.1 119.1C101.7 118.2 102.6 117.1 103 116.5C103.4 115.9 104 115 104.4 114.5C104.8 113.9 105.5 113 106 112.3C106.4 111.7 107.2 110.7 107.6 110.1C108 109.5 110.5 105.9 113.2 102.1C115.9 98.3 118.3 94.9 118.6 94.6C118.8 94.2 119.2 93.7 119.5 93.3C119.7 93 120.1 92.4 120.4 92.1C121.2 90.9 124.6 86.1 125 85.5C125.2 85.3 125.6 84.8 125.8 84.5C126 84.2 128.1 81.2 130.5 77.8C132.8 74.5 134.9 71.6 135.1 71.3C135.3 70.9 141.8 61.9 143.5 59.5C144 58.8 144.6 57.9 144.9 57.6C145.1 57.2 146 56 146.9 54.9C149 52 150.5 49.9 150.9 49.3C152.1 47.7 158.1 39.7 160.1 37C168.2 26.5 174.5 20.4 183.5 14.5C187.7 11.7 193.9 8.4 197.5 7C197.8 6.9 198.3 6.7 198.7 6.5C203.5 4.3 213.7 1.6 219.5 0.9C220.4 0.8 222.3 0.6 223.6 0.4C226.9 -0 236.8 -0 240.1 0.4C241.4 0.6 243.2 0.8 244.2 0.9C249 1.5 256.8 3.4 262.5 5.6C266.3 7 272.6 9.9 274.8 11.3C274.9 11.4 275.5 11.7 275.9 11.9C278 13.1 278 13.1 281.2 15.2C295.1 24.5 306.8 38.8 313.2 54.3C316.1 61.4 318.3 69.3 319.2 75.7C319.3 77 319.5 78.4 319.6 78.9C319.9 80.2 320.1 93.6 319.8 96C319.1 103.1 317.4 111.2 315.6 116.3C315.3 117 315.1 117.7 315 118C315 118.2 314.8 118.8 314.6 119.3C314.4 119.8 313.9 121 313.4 122.1C313 123.1 312.6 124.1 312.5 124.3C312.4 124.5 311.9 125.7 311.3 126.9C304 142.2 292.5 154.8 277.2 164.3C273.8 166.5 267.1 169.7 262.8 171.3C259.1 172.7 252.6 174.6 249.8 175.1C248.9 175.2 247.7 175.5 246.9 175.6C246.2 175.8 244.7 176 243.7 176.1C242.6 176.2 241.2 176.4 240.7 176.5C238.9 176.9 158.6 177 158.3 176.6Z" />
        </svg>
      </div>
      <span
        className="mt-[-0.37em] justify-self-end text-[0.26em] font-bold uppercase tracking-[0.02em] text-ink-dim"
        style={{ transform: 'skewX(-10deg)' }}
      >
        Marketing Cloud
      </span>
    </div>
  )
}

/** Adobe's issued mark, for Adobe Campaign Classic. */
/**
 * The mark with its product name beside it, the way Adobe sets its own product
 * lockups: corporate mark, then the product on two lines.
 *
 * The svg is aria-hidden and the name is real text, so a screen reader reads
 * "Adobe Campaign" once rather than hearing the mark labelled as well.
 */
export function AdobeLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <AdobeMark className="h-[2.0625rem] w-auto shrink-0 sm:h-[2.3125rem]" />
      <span className="text-sm font-semibold leading-[1.15] text-ink">
        Adobe
        <br />
        Campaign
      </span>
    </div>
  )
}

function AdobeMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" className={className} aria-hidden="true">
      <path
        fill="#fa0f00"
        d="M90 5v80L56.734 5H90ZM33.293 5 0 85V5h33.293Zm11.72 29.355L66.21 85H52.317l-6.34-16.367h-15.51l14.546-34.278Z"
      />
    </svg>
  )
}
