import { ArrowRight } from "lucide-react";
import { philosophy } from "@/content/guru";
import { ButtonLink, SectionHeading } from "../ui";
import { toParagraphs } from "@/lib/format";

export function PhilosophyPreview() {
  return (
    <div className="container-page">
      <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="The ground" title="What the mission actually holds" lead={philosophy.guru.intro.split("\n\n")[0]}
          />
          <ButtonLink href="/philosophy" variant="outline" className="mt-8">
            Read the philosophy in full
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>

        <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {philosophy.pillars.map((pillar, i) => (
            <li key={pillar.title} className="bg-surface-raised p-7">
              <span className="font-display text-sm text-content-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg leading-snug text-content">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-content-muted">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Full-bleed statement of the core idea.
 * Replaces the old quotation band — this states the principle in plain
 * English rather than reciting anyone's words.
 */
export function ShivaMayamBand() {
  return (
    <div className="container-page text-center">
      <p className="text-[0.6875rem] font-semibold tracking-[0.2em] text-clay-400 uppercase">
        The core idea
      </p>
      <h2 className="mx-auto mt-7 font-display text-5xl leading-[1.1] text-paper-100 sm:text-6xl md:text-7xl">
        {philosophy.coreIdea.title}
      </h2>
      <p className="mx-auto mt-6 max-w-2xl font-display text-xl text-paper-300 italic sm:text-2xl">
        {philosophy.coreIdea.subtitle}
      </p>

      <div className="mx-auto mt-10 max-w-2xl space-y-5 text-left text-[1.0625rem] leading-relaxed text-paper-300/80">
        {toParagraphs(philosophy.coreIdea.body).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
