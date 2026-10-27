import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { PhilosophyPreview, ShivaMayamBand } from "@/components/sections/philosophy";
import { EventCard, YatraCard } from "@/components/cards";
import { ButtonLink, Card, EmptyState, Section, SectionHeading } from "@/components/ui";
import { VideoPanel } from "@/components/video-panel";
import { BookButton } from "@/components/book-button";
import { Reveal } from "@/components/reveal";
import { getSettings, storeIsConfigured } from "@/lib/settings";
import { getUpcomingEvents, getUpcomingYatras } from "@/lib/queries";
import { philosophy } from "@/content/guru";
import { maharaj } from "@/content/maharaj";

export default async function HomePage() {
  const [yatras, events, settings] = await Promise.all([
    getUpcomingYatras(3),
    getUpcomingEvents(3),
    getSettings(),
  ]);

  // The featured journey leads the page; the rest sit underneath it.
  const featured = yatras.find((y) => y.yatra.featured) ?? yatras[0];
  const others = yatras.filter((y) => y.yatra.id !== featured?.yatra.id);
  const showStore = storeIsConfigured(settings);

  return (
    <>
      <Hero
        featuredLabel={featured ? featured.yatra.title : undefined}
        featuredSlug={featured?.yatra.slug}
      />

      <Section tone="inverse" className="py-20 md:py-24">
        <Reveal>
          <ShivaMayamBand />
        </Reveal>
      </Section>

      {/* THE PERSON — the centre of this page */}
      <Section id="maharaj">
        <Journey compact />
        <div className="container-page mt-12 text-center">
          <ButtonLink href="/maharaj" variant="outline" size="lg">
            Read the full story
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </Section>

      <Section tone="sunken">
        <Reveal>
          <PhilosophyPreview />
        </Reveal>
      </Section>

      {/* Journeys */}
      <Section id="journeys">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="The work, moving" title="Journeys and world peace programmes" lead="A philosophy of oneness argued in a hall persuades nobody. Carried across a border, among strangers, it becomes evidence."
            />
            <ButtonLink href="/yatra" variant="outline">
              All journeys
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>

          <div className="mt-12 space-y-6">
            {!featured ? (
              <EmptyState
                title="The next programme is being finalised" description="New journeys are announced here as soon as they are confirmed. Write to the mission and we will tell you the moment the next one is set." action={
                  <ButtonLink href="/contact" variant="outline" size="sm">
                    Ask about the next programme
                  </ButtonLink>
                }
              />
            ) : (
              <>
                <YatraCard yatra={featured.yatra} seatsLeft={featured.seatsLeft} featured />
                {others.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {others.map(({ yatra, seatsLeft }) => (
                      <YatraCard key={yatra.id} yatra={yatra} seatsLeft={seatsLeft} />
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </Section>

      {/* Events */}
      <Section tone="sunken" id="events">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="The calendar" title="Gatherings and assemblies" lead="Everyone is welcome, whatever their faith, nation or background."
            />
            <ButtonLink href="/events" variant="outline">
              Full calendar
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {events.length === 0 ? (
              <div className="lg:col-span-2">
                <EmptyState
                  title="Nothing on the calendar just yet" description="Gatherings appear here as soon as they are scheduled."
                />
              </div>
            ) : (
              events.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </div>
        </div>
      </Section>

      {/* One-to-one */}
      <Section>
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <VideoPanel
              src="/video/sujin-intro.mp4" poster="/images/sujin-intro-poster.jpg" label={`${maharaj.name} — introduction`}
              portrait
              className="mx-auto w-full max-w-sm"
            />
            <div>
              <SectionHeading
                eyebrow="One to one" title="Sit with Maharaja, alone" lead="Some questions cannot be asked in a hall of two hundred people. Maharaja keeps time aside each week for individual meetings — in person, or by video call for those further away."
              />
              <ul className="mt-8 space-y-4">
                {[
                  {
                    Icon: HeartHandshake,
                    title: "No fee, ever",
                    body: "Time with Maharaja is never sold. Offerings are voluntary and entirely separate.",
                  },
                  {
                    Icon: Sparkles,
                    title: "Held in confidence",
                    body: "What is said in a sitting stays there. Nothing is recorded or repeated.",
                  },
                  {
                    Icon: CalendarDays,
                    title: "Usually within a week",
                    body: "Send a request with two times that suit you. The mission confirms by phone or email.",
                  },
                ].map(({ Icon, title, body }) => (
                  <li key={title} className="flex gap-4">
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-content">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-content-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <BookButton route="maharaj_appointment" size="lg" sourcePage="/" className="mt-9" />
            </div>
          </div>
        </div>
      </Section>

      {/* Store — appears only once a link is configured in the dashboard */}
      {showStore ? (
        <Section tone="sunken" className="py-16 md:py-20">
          <div className="container-page">
            <Card className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="flex items-start gap-5">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <ShoppingBag className="size-5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-2xl text-content">{settings.storeLabel || "The Store"}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-content-muted">
                    {settings.storeNote}
                  </p>
                </div>
              </div>
              <a
                href={settings.storeUrl}
                target="_blank" rel="noopener noreferrer" className="inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-8 text-[0.9375rem] font-medium text-on-accent transition-colors hover:bg-accent-hover"
              >
                {settings.storeLabel || "Visit the Store"}
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </Card>
          </div>
        </Section>
      ) : null}

      {/* Closing */}
      <Section tone="inverse">
        <div className="container-page text-center">
          <h2 className="mx-auto max-w-3xl text-3xl leading-[1.2] text-paper-100 md:text-[2.75rem]">
            {philosophy.coreIdea.title}
            <span className="block text-paper-300 italic">
              {philosophy.coreIdea.subtitle}
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-paper-300/80">
            {maharaj.missionStatement}
          </p>
          <div className="mx-auto mt-10 flex max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
            {showStore ? (
              <a
                href={settings.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-[3px] border-accent bg-accent px-10 py-4 text-base font-bold text-on-accent transition-colors hover:bg-accent-hover hover:border-accent-hover"
              >
                <ShoppingBag className="size-4" aria-hidden />
                Store
              </a>
            ) : (
              <ButtonLink href="/contact" size="lg">
                <ShoppingBag className="size-4" aria-hidden />
                Store
              </ButtonLink>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-[3px] border-white/30 px-10 py-4 text-base font-bold text-paper-100 transition-colors hover:border-clay-400 hover:text-clay-400"
            >
              Talk to the mission
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
