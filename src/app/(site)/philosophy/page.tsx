import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ButtonLink, Card, SacredRule, Section, SectionHeading } from "@/components/ui";
import { ShivaMayamBand } from "@/components/sections/philosophy";
import { philosophy } from "@/content/guru";
import { toParagraphs } from "@/lib/format";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shiva Mayam — the philosophy",
  description:
    "One consciousness pervades everything. The principle behind this mission, the contribution of Sree Narayana Guru, and why it is the only durable basis for peace.",
};

export default function PhilosophyPage() {
  return (
    <>
      <PageHeader
        eyebrow="The ground" title={philosophy.coreIdea.subtitle}
        lead="Shiva Mayam, and what follows from taking it seriously."
      />

      <Section className="pt-6 pb-10">
        <div className="container-prose prose-mission text-lg">
          {toParagraphs(philosophy.coreIdea.body).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      <Section tone="inverse" className="relative overflow-hidden py-16 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src="/images/shiva-pashupatinath.jpg" alt="" fill
            sizes="100vw" className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/75 to-ink-950/90" />
        </div>
        <div className="relative">
          <ShivaMayamBand />
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <SectionHeading
            eyebrow="Four consequences" title="What it asks of a person" align="center"
          />
          <SacredRule className="mx-auto mt-10 max-w-xs" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {philosophy.pillars.map((pillar, i) => (
              <Card key={pillar.title} className="p-7 md:p-8">
                <span className="font-display text-sm text-content-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 text-xl leading-snug text-content">{pillar.title}</h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-content-muted">
                  {pillar.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="sunken">
        <div className="container-page">
          <SectionHeading
            eyebrow={`${philosophy.guru.name} · ${philosophy.guru.lifespan}`}
            title="The man who proved it works" align="center"
          />
          <div className="container-prose prose-mission mt-10">
            {toParagraphs(philosophy.guru.intro).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <ol className="mx-auto mt-16 max-w-3xl">
            {philosophy.timeline.map((item, index) => (
              <li
                key={item.year}
                className="relative grid gap-5 pb-12 last:pb-0 sm:grid-cols-[6rem_1fr] sm:gap-8"
              >
                {index < philosophy.timeline.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute top-12 bottom-0 left-[1.1rem] w-px bg-gradient-to-b from-line-strong to-transparent"
                  />
                ) : null}
                <div className="flex items-center gap-4 sm:block">
                  <span className="relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-clay-400/40 bg-surface-raised">
                    <span className="size-1.5 rotate-45 bg-clay-400" aria-hidden />
                  </span>
                  <span className="font-display text-xl text-accent sm:mt-3 sm:block">
                    {item.year}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl text-content">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-content-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <div className="container-prose text-center">
          <SacredRule className="mx-auto max-w-[8rem]" />
          <h2 className="mt-10 text-3xl leading-tight text-content">
            Why the work takes the form of travel
          </h2>
          <div className="prose-mission mt-5 text-left">
            {toParagraphs(philosophy.whyWeTravel).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ButtonLink href="/yatra" size="lg" className="mt-9">
            See the journeys
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
