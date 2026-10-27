import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { maharaj } from "@/content/maharaj";
import { philosophy } from "@/content/guru";
import { ButtonLink } from "../ui";

/**
 * Hero with the animated logo running as a full-bleed motion background.
 *
 * The video is muted, looping and plays inline — the only configuration a
 * browser will autoplay without a user gesture. A poster frame covers the
 * moment before it starts, and a scrim keeps the headline legible over it.
 */
export function Hero({
  featuredLabel,
  featuredSlug,
}: {
  featuredLabel?: string;
  featuredSlug?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-plum-900">
      {/* ── Motion background ─────────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <video
          className="motion-pan size-full object-cover motion-reduce:hidden"
          src="/video/twg-logo.mp4"
          poster="/images/twg-logo-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          // metadata, not auto: autoplay still works, but a 2.5MB file is
          // no longer pulled in full before anything else on mobile.
          preload="metadata"
        />
        {/* Still fallback when motion is reduced or video cannot play */}
        <Image
          src="/images/twg-logo-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover motion-reduce:block"
        />

        {/* Scrim — dark enough for AA contrast on the headline */}
        <div className="absolute inset-0 bg-plum-900/72 md:bg-plum-900/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-900 via-plum-900/35 to-plum-900/80" />
      </div>

      <div className="container-page relative grid items-center gap-10 py-20 sm:py-24 md:py-28 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-32">
        <div className="rise text-center lg:text-left">
          {featuredLabel && featuredSlug ? (
            <a
              href={`/yatra/${featuredSlug}`}
              className="group mb-7 inline-flex max-w-full items-center gap-2.5 border border-white/25 bg-white/10 py-2 pr-3 pl-4 text-xs backdrop-blur-sm transition-colors hover:border-clay-400"
            >
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-clay-400 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-clay-400" />
              </span>
              <span className="truncate font-medium text-white/90">{featuredLabel}</span>
              <ArrowRight
                className="size-3.5 shrink-0 text-clay-400 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          ) : null}

          <h1 className="text-[2.15rem] leading-[1.05] font-normal text-white sm:text-5xl lg:text-[4rem]">
            Everything is one
            <span className="mt-1.5 block text-clay-400 italic">consciousness.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg lg:mx-0">
            {maharaj.missionStatement}
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
            <ButtonLink href="/maharaj" size="lg" className="w-full sm:w-auto">
              Meet {maharaj.shortName}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="/philosophy"
              size="lg"
              variant="inverse"
              className="w-full sm:w-auto"
            >
              The philosophy
            </ButtonLink>
          </div>

          <dl className="mx-auto mt-12 grid max-w-lg grid-cols-1 gap-5 border-t border-white/15 pt-7 sm:grid-cols-3 lg:mx-0">
            <Stat term="Shiva Mayam" detail="One consciousness, pervading everything" />
            <Stat term="World peace" detail="Built on that ground, not negotiated onto it" />
            <Stat term="India · Nepal · Malaysia" detail="Where the mission walks" />
          </dl>
        </div>

        <div
          className="rise relative mx-auto w-full max-w-sm lg:max-w-none lg:pl-6"
          style={{ animationDelay: "140ms" }}
        >
          <div className="relative aspect-4/5 overflow-hidden border-[3px] border-white/20 shadow-lift">
            <Image
              src="/images/maharaj-portrait.png"
              alt={`Portrait of ${maharaj.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 24rem, 90vw"
              className="object-cover object-top"
            />
          </div>

          <div className="mt-4 border-[3px] border-white/20 bg-plum-900/80 p-5 backdrop-blur-sm sm:absolute sm:-bottom-8 sm:-left-4 sm:mt-0 sm:max-w-[17rem] lg:-left-2">
            <p className="font-display text-[1.375rem] leading-tight text-balance text-clay-400 sm:text-2xl">
              Dr Sujin Jai Guru Maharaj
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {philosophy.coreIdea.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt className="font-display text-lg leading-tight text-white sm:text-xl">{term}</dt>
      <dd className="mt-1 text-xs leading-relaxed text-white/60">{detail}</dd>
    </div>
  );
}
