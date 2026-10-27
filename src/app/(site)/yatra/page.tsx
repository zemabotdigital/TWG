import type { Metadata } from "next";
import { Globe } from "lucide-react";
import { YatraCard } from "@/components/cards";
import { ButtonLink, EmptyState, Section, SectionHeading } from "@/components/ui";
import { PageHeader } from "@/components/page-header";
import { getPastYatras, getUpcomingYatras } from "@/lib/queries";
import { formatDateRange } from "@/lib/format";
import { philosophy } from "@/content/guru";

export const metadata: Metadata = {
  title: "Journeys and world peace programmes",
  description:
    "International delegations and ongoing journeys led by Dr Sujin JaiGuru Maharaja. Announced dates and how to request a place.",
};

export default async function YatraIndexPage() {
  const [upcoming, past] = await Promise.all([getUpcomingYatras(), getPastYatras(6)]);

  return (
    <>
      <PageHeader
        eyebrow="The work, moving" title="Journeys and world peace programmes" lead="Delegations and journeys undertaken together as equals. Itineraries and contributions are shared directly with anyone who enquires, not published here."
      />

      <Section className="pt-4">
        <div className="container-page">
          <div className="mx-auto mb-14 max-w-3xl border border-line bg-surface-raised p-7 md:p-9">
            <Globe className="size-6 text-accent" aria-hidden />
            <div className="prose-mission mt-4">
              {philosophy.whyWeTravel.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <h2 className="text-2xl text-content md:text-3xl">Announced programmes</h2>

          <div className="mt-8 space-y-6">
            {upcoming.length === 0 ? (
              <EmptyState
                title="No programmes announced right now" description="Dates are usually announced four to six weeks ahead. Write to the mission and we will tell you as soon as the next one is confirmed." action={
                  <ButtonLink href="/contact" variant="outline" size="sm">
                    Ask about the next date
                  </ButtonLink>
                }
              />
            ) : (
              <>
                <YatraCard yatra={upcoming[0].yatra} seatsLeft={upcoming[0].seatsLeft} featured />
                {upcoming.length > 1 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {upcoming.slice(1).map(({ yatra, seatsLeft }) => (
                      <YatraCard key={yatra.id} yatra={yatra} seatsLeft={seatsLeft} />
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </Section>

      {past.length > 0 ? (
        <Section tone="sunken">
          <div className="container-page">
            <SectionHeading
              eyebrow="Behind us" title="Already travelled" lead="Every programme listed here carried a group across a border and brought them home again."
            />
            <ul className="mt-10 divide-y divide-line overflow-hidden border border-line bg-surface-raised">
              {past.map((yatra) => (
                <li
                  key={yatra.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 py-5"
                >
                  <span className="font-display text-lg text-content">{yatra.title}</span>
                  <span className="text-sm text-content-subtle">
                    {formatDateRange(yatra.departureDate, yatra.returnDate)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}
    </>
  );
}
