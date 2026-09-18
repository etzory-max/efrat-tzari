import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { RecogniseItem, RecogniseSection } from "@/content/types";

/**
 * A drawn mark for each moment, in the order the moments are written: the
 * clothes and shoes for the fight to get out of the door, two bubbles for a
 * day spent translating, an open hand for help that does not arrive, and the
 * blocks coming down for the small fault that takes the day with it.
 *
 * Held here and not in the CMS on purpose. Each one illustrates its own
 * sentence, so it is not a choice an editor should have to make - and the
 * schema caps the list at the four these were drawn for.
 */
const MARKS = [
  { src: "/images/day-morning.png", width: 320, height: 269 },
  { src: "/images/day-translate.png", width: 320, height: 248 },
  { src: "/images/day-help.png", width: 308, height: 320 },
  { src: "/images/day-collapse.png", width: 301, height: 320 },
];

function Moment({
  item,
  index,
  last,
}: {
  item: RecogniseItem;
  index: number;
  last: boolean;
}) {
  const mark = MARKS[index];

  return (
    <Reveal delay={index * 90} className="grid grid-cols-[auto_1fr] gap-x-5">
      {/* The dot lines up with the middle of the drawing, so the thread reads
          as hanging each one.

          The dot stays. Taking it out to make room for the drawing was the
          wrong fix: the dot-on-a-thread is the device this section shares with
          the testimonials further down, and without it the two stop rhyming.
          The crowding was never about position - the dot, the drawing and the
          label were all about the same size, so nothing among them read as
          more important. Size alone settles it. */}
      <div aria-hidden="true" className="flex flex-col items-center">
        <span className="mt-7 size-3 shrink-0 rounded-full bg-accent md:mt-8" />
        {!last && <span className="mt-2 w-px flex-1 bg-cream-200" />}
      </div>

      <div className={last ? "" : "pb-10"}>
        {mark && (
          <Image
            src={mark.src}
            alt=""
            width={mark.width}
            height={mark.height}
            sizes="120px"
            aria-hidden="true"
            className="mb-3 h-14 w-auto md:h-18"
          />
        )}
        {/* Hebrew gains nothing from wide tracking and loses word shape, so the
            phase labels sit tighter than an eyebrow. */}
        <p className="text-sm tracking-[0.12em] text-accent-ink">{item.time}</p>
        <h4 className="mt-2 text-2xl text-slate">{item.title}</h4>
        <p className="mt-2 text-lg text-muted">{item.body}</p>
      </div>
    </Reveal>
  );
}

/**
 * Recognition, before anything is offered.
 *
 * The four observations are moments in one day, so they are drawn as one — a
 * single column on a thread, each moment a node. The structure is the graphic:
 * it says something true about the content, which a row of decorated cards
 * would not. It also stays clear of the two devices that belong to the section
 * after this one, the terracotta cards and the line-art strip on its edge.
 *
 * The drawing waits for the closing line. A grown-up and a child hand in hand
 * next to "the morning already finishes you" would fight the sentence; next to
 * the turn towards a full life it is the sentence.
 */
export function Recognise({ data }: { data: RecogniseSection }) {
  const last = data.items.length - 1;

  return (
    <section id="recognise" aria-labelledby="recognise-title" className="bg-cream-100 section">
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="recognise-title" className="mt-3 text-3xl text-balance text-slate md:text-4xl">
            {data.title}
          </h2>
          {/* pre-line, so a break typed in the Studio is a break on the page:
              these two sentences land harder apart than as one block. */}
          <p className="mt-5 text-xl whitespace-pre-line text-muted">{data.lead}</p>
        </Reveal>

        <Reveal delay={80} className="mx-auto mt-14 max-w-2xl">
          {/* The heading of the four moments, not a second section label.
              It was styled as an eyebrow, which is the same mark the section
              opens with a few lines above - two opening labels, one of which
              opens nothing. It was also a plain <p>, so the four items below
              hung directly off the section heading with nothing introducing
              them.

              The distinction from the item headings is carried by position,
              by the rule beneath and by a size step on wide screens - not by
              shrinking the items, which sit at 24 over 18px copy and have no
              room to give. The rule goes underneath on purpose: an eyebrow's
              rule leads into something new, this one says that what follows
              belongs to it. */}
          <h3 className="text-center text-2xl text-slate md:text-[1.75rem]">
            {data.timelineLabel}
          </h3>
          {/* Thin, like the thread running down the side of the moments below -
              but in terracotta rather than cream, which is what makes it
              visible. The cream hairline it started as disappeared into the
              band; 6px of accent-ink read as a bar and took the eye off the
              heading it belongs to. Weight was never the problem, colour was. */}
          <span aria-hidden="true" className="mt-5 block h-0.5 rounded-full bg-accent-ink" />
        </Reveal>

        {/* Marker column and copy column, so the thread needs no absolute
            positioning and follows the writing direction on its own. */}
        <ol className="mx-auto mt-7 max-w-2xl">
          {data.items.map((item, index) => (
            <li key={item.title}>
              {/* The node and its copy reveal together — staggering them left
                  a row of dots standing over empty space. */}
              <Moment item={item} index={index} last={index === last} />
            </li>
          ))}
        </ol>

        {/* The turn. Ink rather than muted — it is the sentence the section
            was built to earn, and the only place colour enters as a figure. */}
        <Reveal delay={160} className="mx-auto mt-16 max-w-3xl text-center">
          {/* A drawn mother and child rather than the stick figures that stood
              here: the section has just spent four moments describing this
              person's day, and the closing image should look like her.
              Decorative, so it is hidden from screen readers - the sentence
              underneath is what carries the meaning. */}
          <Image
            src="/images/art-mother-walk.png"
            alt=""
            width={767}
            height={900}
            sizes="180px"
            aria-hidden="true"
            className="mx-auto h-32 w-auto md:h-40"
          />
          {/* Ink, and one of only two places on the page that gets it.
              The site reads in its blue - slate for headings, the blue-grey
              muted for body - and the near-black is held back for the sentence
              a section was built to earn. Scattered, as it was, it stopped
              anyone from noticing it anywhere. */}
          <p className="mt-6 text-xl leading-relaxed text-balance text-ink md:text-2xl">
            {data.closer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
