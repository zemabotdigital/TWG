import { maharaj } from "@/content/maharaj";
import { SacredRule, SectionHeading } from "../ui";
import { EditableParagraphs, EditableText } from "../editable-text";
import { VideoPanel } from "../video-panel";
import { Reveal } from "../reveal";

/**
 * The transformation narrative — an ordinary man from Thrissur becoming a
 * teacher. This is the section the landing page is built around.
 */
export function Journey({ compact = false }: { compact?: boolean }) {
  const stages = compact ? maharaj.journey.slice(0, 3) : maharaj.journey;

  return (
    <div className="container-page">
      <SectionHeading
        eyebrow="The man" title={
          <>
            From an ordinary life
            <span className="block text-content-muted italic">
              to a life lived inside one recognition
            </span>
          </>
        }
        lead={maharaj.tagline}
        align="center"
      />

      <SacredRule className="mx-auto mt-12 max-w-xs" />

      <ol className="mx-auto mt-16 max-w-4xl">
        {stages.map((stage, index) => (
          <Reveal
            as="li"
            delay={index * 90}
            key={stage.stage}
            className="relative grid gap-6 pb-14 last:pb-0 md:grid-cols-[7rem_1fr] md:gap-10"
          >
            {index < stages.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-14 bottom-0 left-[1.4rem] w-px bg-gradient-to-b from-line-strong to-transparent"
              />
            ) : null}

            <div className="flex items-center gap-4 md:block">
              <span className="relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-clay-400/40 bg-surface-raised font-display text-base font-semibold text-accent">
                {stage.stage}
              </span>
              <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-content-subtle uppercase md:mt-3">
                {stage.label}
              </p>
            </div>

            <div>
              <h3 className="text-2xl leading-snug text-content md:text-[1.75rem]">
                <EditableText text={stage.heading} />
              </h3>
              <div className="prose-mission mt-4">
                <EditableParagraphs text={stage.body} />
              </div>

              {/* A stage may carry a pull-quote in Maharaja's own voice. */}
              {stage.quote ? (
                <figure className="mt-8 border-l-[3px] border-accent pl-6 sm:pl-8">
                  <blockquote className="space-y-4">
                    {stage.quote.split(/\n{2,}/).map((line, i) => (
                      <p
                        key={i}
                        className="font-display text-xl leading-snug text-content italic sm:text-2xl"
                      >
                        “{line.trim()}”
                      </p>
                    ))}
                  </blockquote>
                  <figcaption className="mt-5 text-[0.6875rem] font-bold tracking-[0.16em] text-content-subtle uppercase">
                    — {maharaj.name}
                  </figcaption>
                </figure>
              ) : null}
            </div>
          </Reveal>
        ))}
      </ol>


      <dl className="reveal-wrap mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden border border-line bg-line lg:grid-cols-4">
        {maharaj.milestones.map((m) => (
          <div key={m.label} className="bg-surface-raised px-6 py-8 text-center">
            <dt className="font-display text-3xl text-accent">
              <EditableText text={m.value} />
            </dt>
            <dd className="mt-2 text-xs leading-relaxed text-content-subtle">{m.label}</dd>
          </div>
        ))}
      </dl>

      {!compact ? (
        <div className="mx-auto mt-16 max-w-4xl">
          <VideoPanel
            src="/video/flow.mp4" poster="/images/flow-poster.jpg" label={`${maharaj.name} — in the mountains`}
            className="w-full"
          />
        </div>
      ) : null}
    </div>
  );
}
