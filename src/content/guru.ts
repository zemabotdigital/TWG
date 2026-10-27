/**
 * The philosophical ground the mission stands on.
 *
 * Two strands, deliberately held together:
 *   - Shiva Mayam — the recognition that one consciousness pervades everything
 *   - Sree Narayana Guru — the social conclusion that follows from it
 *
 * Note on style: this file contains no direct quotations and no Malayalam.
 * The teaching is described in plain English rather than recited.
 */

export const philosophy = {
  /** The idea the whole site rests on. Shown large on the landing page. */
  coreIdea: {
    title: "Shiva Mayam",
    subtitle: "Everything, everywhere, is pervaded by one consciousness",
    body: `Shiva Mayam is not a belief to be adopted. It is a description of what is already the case — that a single living consciousness pervades everything that exists, and that nothing stands outside it.

Held seriously, it dismantles the ground beneath every division a human being has ever invented. If one consciousness moves through all of it, then the lines drawn between castes, religions, languages and nations are not sacred boundaries. They are habits of perception. They can be unlearned.

This is not a retreat from the world. It is the only durable basis for peace in it.`,
  },

  /** How the core idea becomes something a person can act on. */
  pillars: [
    {
      title: "One consciousness, no exceptions",
      body: "The same awareness that looks out through your eyes looks out through everyone else's. Not similar awareness — the same. Once this is seen rather than merely agreed with, contempt for another person becomes structurally difficult.",
    },
    {
      title: "Divisions are perceptual, not real",
      body: "Caste, creed and nationality have enormous consequences, but no independent existence. They persist because they are rehearsed daily. What is sustained by habit can be dissolved by attention.",
    },
    {
      title: "Peace begins inside one person",
      body: "No treaty has ever produced peace in someone who has none. The work is inward first and outward second — but it does not stop inward. A realisation that changes nothing about how you treat people has not happened yet.",
    },
    {
      title: "Dignity is not separate from the spirit",
      body: "Sree Narayana Guru insisted that education, self-reliance and material dignity are part of spiritual life, not a distraction from it. A community kept poor and illiterate cannot be free, and a philosophy that overlooks that is a luxury.",
    },
  ],

  /** What Sree Narayana Guru contributed, described rather than quoted. */
  guru: {
    name: "Sree Narayana Guru",
    lifespan: "1856 – 1928",
    intro: `Sree Narayana Guru was born in 1856 into a Kerala governed by one of the most rigid caste orders in the world — a society where proximity between people of different birth was treated as contamination.

He did not fight it primarily with politics. He undercut it with metaphysics. If one consciousness is present in every being, then caste is not an injustice to be negotiated down; it is a mistake of perception, and it has no standing in reality at all.

From that single recognition came temples open to everyone, schools, industries, and one of the earliest interfaith gatherings held anywhere in the world. He changed Kerala permanently without holding office, raising an army, or asking anyone to worship him.`,
  },

  /** Historical anchors — events, not sayings. */
  timeline: [
    {
      year: "1888",
      title: "Aruvippuram",
      body: "Barred by caste from consecrating temples, the Guru took a stone from the Neyyar river and installed it himself. The act declared that access to the divine is not distributed by birth — one of the most elegant refusals in Indian religious history.",
    },
    {
      year: "1903",
      title: "Institutions, not sentiment",
      body: "He founded an organisation to carry the work into schools, temples and enterprises, turning a spiritual recognition into functioning institutions that outlived him.",
    },
    {
      year: "1924",
      title: "The All Religions Conference",
      body: "At Alwaye he convened one of the world's first interfaith parliaments, gathering people of different faiths to understand one another rather than to debate. Decades before the phrase 'interfaith dialogue' existed, he had built the room for it.",
    },
    {
      year: "1928",
      title: "Sivagiri",
      body: "He left his body at Varkala, having altered the moral architecture of a society by insisting, consistently and without violence, that the divisions it lived by were not real.",
    },
  ],

  /** Why a consciousness-first philosophy takes the form of travel and assembly. */
  whyWeTravel: `A philosophy of oneness argued in a hall persuades nobody. Practised across a border, among strangers, with people of other languages and other faiths, it becomes evidence.

That is why this mission moves. Journeys are undertaken together as equals — the same travel, the same table, the same discipline — because the equality is not a gesture made during the journey. It is the thing being demonstrated.`,
} as const;
