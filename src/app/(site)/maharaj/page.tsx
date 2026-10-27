import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Journey } from "@/components/sections/journey";
import { PageHeader } from "@/components/page-header";
import { ButtonLink, Section } from "@/components/ui";
import { VideoPanel } from "@/components/video-panel";
import { maharaj } from "@/content/maharaj";

export const metadata: Metadata = {
  title: "Sujin Jai Guru Maharaj",
  description:
    "The life of Sujin Jai Guru Maharaj — an ordinary householder from Thrissur who gave up everything to carry Sree Narayana Guru's philosophy to the world.",
};

export default function MaharajPage() {
  return (
    <>
      <PageHeader eyebrow="The man" title={maharaj.name} lead={maharaj.tagline} />

      <Section className="pt-10 pb-4">
        <div className="container-page">
          <VideoPanel
            src="/video/sujin-intro.mp4" poster="/images/sujin-intro-poster.jpg" label={`${maharaj.name} — introduction`}
            portrait
            className="mx-auto w-full max-w-md"
          />
          <p className="mx-auto mt-4 max-w-md text-center text-sm text-content-subtle">
            In his own words.
          </p>
        </div>
      </Section>

      <Section className="pt-6">
        <Journey />
      </Section>

      <Section tone="inverse" className="py-20">
        <div className="container-page text-center">
          <p className="mx-auto max-w-3xl font-display text-2xl leading-snug text-paper-100 italic md:text-[2rem]">
            “{maharaj.missionStatement}”
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/appointment" size="lg">
              Request a one-to-one
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="/yatra" size="lg" variant="outline" className="border-ink-300/30 text-paper-100 hover:border-clay-400"
            >
              Travel with Maharaj
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
