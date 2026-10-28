import type { Metadata } from "next";
import { CalendarCheck, HeartHandshake, Lock, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, Section } from "@/components/ui";
import { WhatsAppHandoff } from "@/components/forms/whatsapp-handoff";

export const metadata: Metadata = {
  title: "Request a one-to-one with Maharaj",
  description:
    "Sit with Sujin Jai Guru Maharaj alone — in person at Thrissur, or by video call. No fee is charged. Send a request and the mission will confirm a time.",
};

const assurances = [
  {
    Icon: HeartHandshake,
    title: "Never sold",
    body: "Time with Maharaj carries no fee of any kind. Offerings are voluntary and kept entirely separate from the appointment.",
  },
  {
    Icon: Lock,
    title: "Held in confidence",
    body: "Nothing said in a sitting is recorded, shared or repeated. This holds without exception.",
  },
  {
    Icon: CalendarCheck,
    title: "Usually within a week",
    body: "Give two times that suit you and the mission will confirm one by phone or email, normally within a week.",
  },
  {
    Icon: MessageCircle,
    title: "Any question is allowed",
    body: "Grief, doubt, family trouble, a question about practice, or nothing you can name yet. People come with all of it.",
  },
];

export default function AppointmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="One to one" title="Sit with Maharaja" lead="Some questions cannot be asked in a hall of two hundred people. Maharaja keeps time aside each week to meet people individually — in person at Thrissur, or by video call for those further away."
      />

      <Section className="pt-6">
        <div className="container-page grid gap-12 lg:grid-cols-[20rem_1fr] lg:items-start lg:gap-16">
          <aside className="space-y-4 lg:sticky lg:top-24">
            {assurances.map(({ Icon, title, body }) => (
              <Card key={title} className="flex gap-4 p-5">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-medium text-content">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-content-muted">{body}</p>
                </div>
              </Card>
            ))}
          </aside>

          <Card className="p-7 md:p-9">
            <WhatsAppHandoff
              route="maharaj_appointment"
              title="Request a time with Maharaja"
              body="Send your request on WhatsApp — your name, where you are, whether you would like to meet in person at Thrissur or by video call, and the times that suit you. The mission will confirm a time with you directly."
              note="No fee is charged for sitting with Maharaja. Whatever you write is held in confidence."
              sourcePage="/appointment"
            />
          </Card>
        </div>
      </Section>
    </>
  );
}
