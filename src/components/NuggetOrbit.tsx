import { useSpinRamp } from '../hooks/useSpinRamp'
import type { Nugget, NuggetIcon } from '../content/types'

/**
 * Six asides on a slow circle around the memoji.
 *
 * The ring rotates; each label counter-rotates by the same amount over the same
 * duration, so the text stays upright while its position travels. Both are pure
 * transform animations; nothing here touches layout, so it cannot cause reflow.
 */

/*
 * Each mark brings its own viewBox, because these are drawn at different
 * proportions and squeezing them into a shared 24x24 grid would either distort
 * them or leave them rattling around in it.
 *
 * Every viewBox here is the mark's own ink bounding box, measured with getBBox
 * in the browser rather than taken from whatever the exporter wrote. That is
 * what makes the set look even: the svg is sized by height below, so if a
 * viewBox carries slack above or below the drawing, that slack eats into the
 * height and the mark renders smaller than its neighbours. Tight boxes mean the
 * ink itself is the thing that is 28px tall, identically for all six.
 */
type Mark = { viewBox: string; body: React.ReactNode; className?: string }

const ICONS: Record<NuggetIcon, Mark> = {
  note: {
    viewBox: '2.119 2.129 21.738 28.603',
    body: (
      <>
        <path d="M18.6363 3.53516L7.34027 3.53516C7.40282 2.64931 7.97728 2.12891 8.91602 2.12891L17.0605 2.12891C17.9993 2.12891 18.5737 2.64931 18.6363 3.53516Z" />
        <path d="M21.1564 6.942C20.8094 6.88925 20.4418 6.86523 20.0586 6.86523L5.91797 6.86523C5.53117 6.86523 5.16046 6.88947 4.81065 6.94255C4.9444 5.91296 5.65963 5.33203 6.80664 5.33203L19.1699 5.33203C20.3167 5.33203 21.0241 5.91275 21.1564 6.942Z" />
        <path d="M5.91797 30.7324L20.0586 30.7324C22.5781 30.7324 23.8574 29.4531 23.8574 26.9629L23.8574 12.7441C23.8574 10.2637 22.5781 8.98438 20.0586 8.98438L5.91797 8.98438C3.38867 8.98438 2.11914 10.2539 2.11914 12.7441L2.11914 26.9629C2.11914 29.4629 3.38867 30.7324 5.91797 30.7324ZM5.94727 29.0039C4.58984 29.0039 3.84766 28.2715 3.84766 26.875L3.84766 12.8418C3.84766 11.4355 4.58984 10.7129 5.94727 10.7129L20.0293 10.7129C21.3574 10.7129 22.1289 11.4355 22.1289 12.8418L22.1289 26.875C22.1289 28.2715 21.3574 29.0039 20.0293 29.0039Z" />
        <path d="M16.9922 17.3047C17.627 17.1582 17.8223 17.002 17.8223 16.2402L17.8223 13.6816C17.8223 13.1738 17.6465 12.9492 16.9336 13.1348L13.1152 14.0723C12.4609 14.2285 12.334 14.3652 12.334 15.1465L12.334 21.2988C12.334 21.8848 12.2754 21.9922 11.6016 22.1875L10.3613 22.5098C9.15039 22.8223 8.1543 23.5352 8.1543 24.8145C8.1543 25.9473 9.00391 26.7578 10.3223 26.7578C12.2168 26.7578 13.4668 25.4102 13.4668 23.5059L13.4668 18.7305C13.4668 18.2422 13.5742 18.1152 13.8672 18.0566Z" />
      </>
    ),
  },
  leaf: {
    viewBox: '0 0.508 26.435 23.135',
    body: (
      <path d="M0 5.55664C0 14.8828 5.57617 20.9961 14.1699 20.9961C20.1465 20.9961 24.3555 17.1387 24.3555 11.6992C24.3555 6.47461 20.1074 2.69531 14.209 2.69531C12.1777 2.69531 10.0977 3.28125 7.7832 3.28125C5.76172 3.28125 4.0625 2.65625 2.67578 1.06445C1.99219 0.283203 0.693359 0.224609 0.380859 1.5332C0.078125 2.73438 0 4.87305 0 5.55664ZM1.63086 5.55664C1.63086 4.58008 1.66016 3.61328 1.78711 2.88086C1.81641 2.68555 1.93359 2.66602 2.07031 2.80273C3.54492 4.20898 5.78125 4.91211 7.7832 4.91211C9.12109 4.91211 10.3613 4.73633 11.4648 4.58984C12.4609 4.44336 13.3594 4.32617 14.209 4.32617C19.1992 4.32617 22.7246 7.39258 22.7246 11.6992C22.7246 16.2207 19.2285 19.3652 14.1699 19.3652C6.49414 19.3652 1.63086 13.9844 1.63086 5.55664ZM7.30469 8.47656C8.06641 10.7812 10.2832 11.7969 13.5742 12.6074C17.627 13.584 19.5703 14.4824 21.3477 16.7871C22.6465 18.418 22.998 20.3223 23.7891 22.8418C23.9746 23.4277 24.375 23.6426 24.8145 23.6426C25.7227 23.6426 26.4355 22.8027 26.4355 21.7578C26.4355 19.9902 24.4336 16.9922 23.125 15.3223C21.3477 13.125 18.4961 11.8652 14.1211 11.1133C11.4844 10.6152 9.45312 9.98047 8.02734 8.125C7.68555 7.66602 7.14844 7.97852 7.30469 8.47656Z" />
    ),
  },
  cake: {
    // A two-tier cake, drawn as one path. The candle and flame were cut from
    // the original birthday mark, so the ink box now starts at the top tier.
    viewBox: '0 9.756 28.604 18.398',
    body: (
      <>
        <path d="M6.23047 16.5527L7.96875 16.5527L7.96875 13.3594C7.96875 12.1582 8.66211 11.4844 9.82422 11.4844L18.7891 11.4844C19.9512 11.4844 20.6445 12.1582 20.6445 13.3594L20.6445 16.5527L22.3828 16.5527L22.3828 13.2715C22.3828 10.9766 21.1523 9.75586 18.8281 9.75586L9.78516 9.75586C7.4707 9.75586 6.23047 10.9766 6.23047 13.2715ZM1.98242 27.3926L3.71094 27.3926L3.71094 19.6777C3.71094 18.4766 4.4043 17.8027 5.56641 17.8027L23.0469 17.8027C24.209 17.8027 24.9023 18.4766 24.9023 19.6777L24.9023 27.3926L26.6309 27.3926L26.6309 19.5898C26.6309 17.2852 25.4102 16.0742 23.0762 16.0742L5.53711 16.0742C3.21289 16.0742 1.98242 17.2852 1.98242 19.5898ZM14.2871 22.1289C15.4004 22.1289 16.25 23.5352 18.0664 23.5352C19.8438 23.5352 20.6445 22.1289 21.6992 22.1289C22.7539 22.1289 23.5645 23.5352 25.4688 23.5352L25.752 23.5352L25.752 21.8555L25.4688 21.8555C24.2188 21.8555 23.4082 20.4492 21.6992 20.4492C19.9805 20.4492 19.3262 21.8555 18.0664 21.8555C16.6211 21.8555 16.0254 20.4492 14.2871 20.4492C12.5488 20.4492 11.9434 21.8555 10.498 21.8555C9.23828 21.8555 8.59375 20.4492 6.875 20.4492C5.15625 20.4492 4.35547 21.8555 3.10547 21.8555L2.76367 21.8555L2.76367 23.5352L3.10547 23.5352C5.00977 23.5352 5.82031 22.1289 6.875 22.1289C7.91992 22.1289 8.7207 23.5352 10.498 23.5352C12.3242 23.5352 13.1738 22.1289 14.2871 22.1289ZM0.869141 28.1543L27.7441 28.1543C28.2129 28.1543 28.6035 27.7637 28.6035 27.2852C28.6035 26.8164 28.2129 26.4258 27.7441 26.4258L0.869141 26.4258C0.390625 26.4258 0 26.8164 0 27.2852C0 27.7637 0.390625 28.1543 0.869141 28.1543Z" />
        {/*
         * The same icing swirl again on the top tier: one transform, no second
         * path to keep in sync. 0.55 across and 0.5 down, so it is both smaller
         * than the one below it and thinner than a uniform scale would leave it,
         * then translated to the centre of the top tier.
         */}
        <path d="M14.2871 22.1289C15.4004 22.1289 16.25 23.5352 18.0664 23.5352C19.8438 23.5352 20.6445 22.1289 21.6992 22.1289C22.7539 22.1289 23.5645 23.5352 25.4688 23.5352L25.752 23.5352L25.752 21.8555L25.4688 21.8555C24.2188 21.8555 23.4082 20.4492 21.6992 20.4492C19.9805 20.4492 19.3262 21.8555 18.0664 21.8555C16.6211 21.8555 16.0254 20.4492 14.2871 20.4492C12.5488 20.4492 11.9434 21.8555 10.498 21.8555C9.23828 21.8555 8.59375 20.4492 6.875 20.4492C5.15625 20.4492 4.35547 21.8555 3.10547 21.8555L2.76367 21.8555L2.76367 23.5352L3.10547 23.5352C5.00977 23.5352 5.82031 22.1289 6.875 22.1289C7.91992 22.1289 8.7207 23.5352 10.498 23.5352C12.3242 23.5352 13.1738 22.1289 14.2871 22.1289Z" transform="translate(6.468 2.504) scale(0.55 0.5)" />
      </>
    ),
  },
  star: {
    viewBox: '0 -150 916 1000',
    body: (
      <path d="M624 69v-49q0 -74 -47 -122t-119 -48q-78 0 -122 49t-44 131v15q0 4 1 7l1 17q-74 -53 -133 -53q-46 0 -88 31q-40 29 -59 76q-14 33 -14 66q0 101 116 154l15 7q-131 60 -131 162q0 69 48 121t114 52q60 0 119 -43l13 -10q-2 20 -2 48q0 75 47 122.5t119 47.5q79 0 122.5 -49.5t43.5 -129.5v-39q74 53 132 53q65 0 112.5 -52.5t47.5 -120.5q0 -102 -116 -155l-15 -7q131 -60 131 -161q0 -65 -47 -119t-113.5 -54t-117.5 42zM540 238q116 -169 215 -169q41 0 74.5 37t33.5 83q0 124 -268 147v29q133 11 200.5 48t67.5 99q0 45 -32.5 82.5t-75.5 37.5q-101 0 -215 -170l-26 15q57 116 57 196q0 124 -113 124q-54 0 -84 -33q-29 -35 -29 -88q0 -80 57 -199l-26 -15q-114 170 -215 170q-41 0 -74.5 -35.5t-33.5 -84.5q0 -124 267 -147v-29q-267 -22 -267 -147q0 -44 32 -82t76 -38q99 0 215 169l26 -14q-57 -117 -57 -200q0 -53 29 -88q30 -33 84 -33q113 0 113 123q0 81 -57 198z" />
    ),
  },
  cup: {
    viewBox: '0 0.02 32.061 23.877',
    body: (
      <path d="M24.4629 13.5742C28.1445 14.4629 30.3906 15.8984 30.3906 17.4219C30.3906 19.9609 24.1309 22.2168 16.0254 22.2168C7.92969 22.2168 1.66992 19.9609 1.66992 17.4219C1.66992 15.9082 3.85742 14.4922 7.50977 13.584L6.67969 12.0508C2.49023 13.1738 0 15.0977 0 17.4219C0 21.25 6.68945 23.8965 16.0254 23.8965C25.3809 23.8965 32.0605 21.25 32.0605 17.4219C32.0605 15.0488 29.4531 13.0859 25.1465 11.9727ZM25.5371 5.03906L25.5371 7.60742C25.5371 13.0957 22.1191 16.8359 16.5527 16.8359L15.498 16.8359C9.91211 16.8359 6.51367 13.1055 6.51367 7.60742L6.51367 5.03906L4.78516 5.03906L4.78516 7.60742C4.78516 14.043 8.97461 18.5645 15.498 18.5645L16.5527 18.5645C23.0664 18.5645 27.2754 14.0332 27.2754 7.60742L27.2754 5.03906ZM16.0254 10.0586C22.7051 10.0586 27.2754 7.99805 27.2754 5.03906C27.2754 2.08008 22.7148 0.0195312 16.0254 0.0195312C9.3457 0.0195312 4.78516 2.08008 4.78516 5.03906C4.78516 7.99805 9.35547 10.0586 16.0254 10.0586ZM16.0254 8.33008C10.5273 8.33008 6.51367 6.89453 6.51367 5.03906C6.51367 3.18359 10.5273 1.74805 16.0254 1.74805C21.5234 1.74805 25.5371 3.18359 25.5371 5.03906C25.5371 6.89453 21.5234 8.33008 16.0254 8.33008ZM25.9375 12.8516L26.9727 12.8516C29.7168 12.8516 31.3867 11.377 31.3867 8.96484C31.3867 6.57227 29.707 5.09766 26.9727 5.09766L26.2891 5.09766L26.2891 6.81641L26.9727 6.81641C28.6426 6.81641 29.668 7.63672 29.668 8.96484C29.668 10.293 28.6426 11.1328 26.9727 11.1328L25.9375 11.1328Z" />
    ),
  },
  yen: {
    // The yen sign. The exporter's canvas was already the ink box.
    viewBox: '0 0 17.305 23.174',
    body: (
      <path d="M8.65234 23.1738C9.27734 23.1738 9.6875 22.7637 9.6875 22.1094L9.6875 13.3203L17.0703 1.65039C17.2168 1.42578 17.3047 1.19141 17.3047 0.947266C17.3047 0.371094 16.8164 0 16.25 0C15.8691 0 15.5273 0.224609 15.332 0.556641L8.71094 11.377L8.60352 11.377L1.99219 0.576172C1.78711 0.224609 1.43555 0 1.05469 0C0.488281 0 0 0.361328 0 0.947266C0 1.21094 0.078125 1.42578 0.224609 1.65039L7.61719 13.3203L7.61719 22.1094C7.61719 22.7637 8.01758 23.1738 8.65234 23.1738ZM1.875 12.8125C1.875 13.2031 2.19727 13.5254 2.58789 13.5254L14.8926 13.5254C15.2832 13.5254 15.6055 13.2031 15.6055 12.8125C15.6055 12.4219 15.2832 12.0996 14.8926 12.0996L2.58789 12.0996C2.19727 12.0996 1.875 12.4219 1.875 12.8125ZM1.875 17.041C1.875 17.4316 2.19727 17.7539 2.58789 17.7539L14.8926 17.7539C15.2832 17.7539 15.6055 17.4316 15.6055 17.041C15.6055 16.6504 15.2832 16.3281 14.8926 16.3281L2.58789 16.3281C2.19727 16.3281 1.875 16.6504 1.875 17.041Z" />
    ),
  },
}

function NuggetIconMark({ name }: { name: NuggetIcon }) {
  const icon = ICONS[name]

  return (
    <svg
      viewBox={icon.viewBox}
      className={`h-5 w-auto sm:h-6 lg:h-8 ${icon.className ?? ''}`}
      fill="currentColor"
      aria-hidden="true"
    >
      {icon.body}
    </svg>
  )
}

export function NuggetOrbit({ nuggets }: { nuggets: readonly Nugget[] }) {
  const step = 360 / nuggets.length
  const { ref: ringRef, slow, resume } = useSpinRamp<HTMLDivElement>()

  return (
    // Capped at max-w-6xl (72rem). That sets the horizontal semi-axis on desktop:
    // 2A plus a 176px label must fit inside it, so A <= 30.5rem, and feeding that
    // back into the clearance inequality gives k >= 0.567, hence 0.58 at xl.
    //
    // The geometry itself (--r, the horizontal radius, and --k, the squash) lives
    // in index.css under .orbit-field rather than in classes here: below lg it
    // depends on the viewport's HEIGHT as well as its width, and the height
    // steps have to be ordered against the width steps. Plain media queries in
    // one place make that order explicit; utility variants would leave it to
    // Tailwind's sort. On a phone --k is above 1, which stretches the circle
    // into an ellipse taller than it is wide.
    //
    // Rendered before the memoji so it paints behind it, and the labels emerge
    // from under the figure rather than in front of it. On a phone the same
    // order is what lets a label pass behind the name at the sides of the
    // ellipse: there is not room for it to pass beside.
    //
    // The container ignores the pointer so it cannot swallow a click meant for the
    // contact pill; each label re-enables it for itself, which is what makes the
    // hover work. No aria-hidden: the labels are real content and now interactive.
    <div className="orbit-field pointer-events-none absolute inset-0 mx-auto grid max-w-6xl place-items-center">
      <div className="orbit-squash">
        {/*
          The ring's box only fixes the centre it turns about: the labels are
          absolutely positioned from its middle. Below lg it is zero-sized. At
          40rem it was wider than a phone, the grid track grew to fit it, and
          the whole orbit sat 125px right of centre at 390.
        */}
        <div ref={ringRef} className="orbit-ring relative size-0 lg:size-[40rem]">
          {nuggets.map((nugget, i) => (
            <div
              key={nugget.label}
              className="orbit-slot pointer-events-auto absolute left-1/2 top-1/2"
              onPointerEnter={slow}
              onPointerLeave={resume}
              style={
                {
                  '--a': `${step * i}deg`,
                  // staggered so they leave one at a time, not as a burst
                  animationDelay: `${0.25 + i * 0.13}s`,
                } as React.CSSProperties
              }
            >
              <div className="orbit-upright">
                <div className="orbit-unsquash flex w-24 flex-col items-center gap-2 text-center text-secondary sm:w-32 lg:w-40 lg:gap-2.5 xl:w-44">
                  <NuggetIconMark name={nugget.icon} />
                  <p className="text-[11px] leading-snug sm:text-xs xl:text-sm">{nugget.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
