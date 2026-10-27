import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! }),
});

function monthsAhead(n: number, day: number, hour = 6) {
  const d = new Date();
  d.setMonth(d.getMonth() + n, day);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@travelwithguru.org";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe!2026";

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Mission Administrator",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });
  console.log(`✔ admin ready: ${admin.email}`);

  /* ───────────────────────────────────────────────────────────────────
     SRI LANKA — Global Brand Awards 2026.

     Every fact below comes from the Letter of Participation issued by
     Anyelp Groups. What that letter establishes:
       · Dr Sujin Jaiguru Maharaj is a confirmed AWARDEE
       · Award: Global Excellence in Spirituality & Humanitarian Service
       · Dates: 30 & 31 October 2026
       · Venue: Prime Minister Residence, Temple Trees, Colombo

     What the letter does NOT establish, and so is not claimed anywhere:
       · any involvement or attendance by the President or Prime Minister
       · any entitlement for accompanying delegates
     Temple Trees is the venue. It is not a government event.

     The itinerary is stored here but never rendered publicly, and no
     contribution figure is stored at all.
     ─────────────────────────────────────────────────────────────────── */

  const awardsStart = new Date("2026-10-30T06:00:00+05:30");

  const sriLankaItinerary = JSON.stringify([
    {
      day: 1,
      title: "Friday 30 Oct — Ferry arrival & Anuradhapura",
      detail:
        "Arrive at the confirmed Sri Lankan ferry port and complete immigration. Meet the local coordinator and transfer towards Anuradhapura. Selected heritage sites if arrival time and opening hours permit. Check in, satvik dinner, group orientation and a short guided meditation.",
    },
    {
      day: 2,
      title: "Saturday 31 Oct — Anuradhapura, Mihintale & Yapahuwa",
      detail:
        "The ancient city, its stupas, the sacred Bodhi Tree area and the archaeological heritage, subject to access and local regulations. Mihintale, traditionally associated with the arrival of Buddhism in Sri Lanka. Yapahuwa Rock Fortress and its carved staircase if time and travel conditions permit. Satvik meals, reflection and overnight in the Cultural Triangle.",
    },
    {
      day: 3,
      title: "Sunday 1 Nov — Polonnaruwa, Sigiriya & Dambulla",
      detail:
        "Polonnaruwa Ancient City including the royal ruins and Gal Vihara. Sigiriya Rock Fortress — its historic urban planning, water gardens and rock summit. Dambulla Cave Temple for its Buddhist statues and murals. Overnight near Dambulla. This is a demanding day; the operator may move or omit one site to keep the schedule safe and realistic.",
    },
    {
      day: 4,
      title: "Monday 2 Nov — Kandy & Colombo",
      detail:
        "Sri Dalada Maligawa, the Temple of the Sacred Tooth Relic, observing dress code and temple etiquette. Onward to Colombo only if traffic, travel time and the confirmed ferry schedule allow. If feasible, Gangaramaya Temple and Sambodhi Pagoda. Overnight near the departure port where compatible with the ferry timetable.",
    },
    {
      day: 5,
      title: "Tuesday 3 Nov — Return ferry & journey home",
      detail:
        "Transfer to the ferry terminal and complete departure formalities. Return ferry to Nagapattinam, then on to Thrissur by pre-arranged road transport or train. Arrival may fall on 4 November depending on ferry timings and onward connections.",
    },
  ]);

  const sriLankaInclusions = JSON.stringify([
    "Three-sharing accommodation for the confirmed number of nights",
    "Satvik vegetarian meals as listed in the final quotation",
    "Sri Lankan local transport, driver and agreed transfers",
    "Entry tickets to the listed attractions, once confirmed in writing",
    "Scheduled group meditation, spiritual discussions and cultural orientation",
    "Tour coordination for the agreed itinerary and confirmed ferry connections",
    "Thrissur–Nagapattinam–Thrissur transport by pre-arranged road or train",
  ]);

  const sriLankaExclusions = JSON.stringify([
    "Sri Lankan visa / ETA fees and any required travel authorisations",
    "Travel insurance, personal expenses, tips and optional guides",
    "Baggage charges or ferry surcharges, if applicable",
    "Any attraction fee not expressly included in the final quotation",
    "Additional hotel nights, meals outside the agreed plan, and costs caused by delays",
    "Private meetings, special ceremonies or VIP access not listed in the written quotation",
  ]);

  const sriLanka = await prisma.yatra.upsert({
    where: { slug: "sri-lanka-spiritual-heritage-tour" },
    update: { coverImage: "/images/sri-lanka-yatra.jpg" },
    create: {
      slug: "sri-lanka-spiritual-heritage-tour",
      title: "Sri Lanka Spiritual & Heritage Tour",
      summary:
        "Five days through Sri Lanka's Buddhist and Hindu heritage, Ramayana traditions and sacred cities — with meditation, reflection and the message of equality and world peace.",
      description: `A cultural, historical and spiritual journey through Sri Lanka's sacred sites and living traditions, undertaken in the spirit of reflection, cultural exchange and the universal message of humanity and social harmony.

The route runs from the Nagapattinam ferry connection to Anuradhapura, Mihintale and Yapahuwa, on through Polonnaruwa, Sigiriya and Dambulla, to Kandy and Colombo before the return crossing. Travel is by two-way ferry via Nagapattinam, with pre-arranged road or rail between Thrissur and the port.

Alongside the heritage, the group studies the Buddhist and Hindu traditions of the island, documents the cultural traditions associated with the Ramayana — distinguishing local belief and oral tradition from historical evidence — and reflects on Sree Narayana Guru's message of equality, humanity and universal brotherhood. Proposed energy points and disputed historical connections are treated as research questions, not settled facts.

Accommodation is three-sharing. Meals are satvik vegetarian. Places are limited and arranged individually.

This is a planning itinerary rather than a confirmed ticket: ferry dates, ports, sailing times and admission fees are subject to final written confirmation, and the operator may adjust sightseeing to fit the confirmed timetable.`,
      destination: "Anuradhapura · Sigiriya · Kandy · Colombo, Sri Lanka",
      departureDate: awardsStart,
      returnDate: new Date("2026-11-03T20:00:00+05:30"),
      departureCity: "Thrissur",
      durationNights: 4,
      seatsTotal: 20,
      priceFrom: null, // never published — shared in direct contact only
      priceNote: "",
      inclusions: sriLankaInclusions,
      exclusions: sriLankaExclusions,
      itinerary: sriLankaItinerary,
      status: "FILLING",
      featured: true,
      coverImage: "/images/sri-lanka-yatra.jpg",
    },
  });
  console.log(`✔ programme: ${sriLanka.title}`);

  /* ── Nepal — the ongoing monthly journey, kept alongside ──────────── */

  const nepalInclusions = JSON.stringify([
    "Return airfare, Kochi ⇄ Kathmandu",
    "Accommodation on twin-sharing basis",
    "Daily vegetarian breakfast and dinner",
    "All airport and temple transfers by private coach",
    "Guided darshan with Maharaja",
    "Morning assembly on each day of the journey",
  ]);

  const nepalItinerary = JSON.stringify([
    {
      day: 1,
      title: "Kochi to Kathmandu",
      detail: "Arrival, transfer to the guest house, and an opening assembly with Maharaja.",
    },
    {
      day: 2,
      title: "Pashupatinath",
      detail: "Early morning darshan with Maharaja, followed by time on the Bagmati ghats.",
    },
    {
      day: 3,
      title: "Boudhanath and Swayambhunath",
      detail: "Kora at the great stupa at first light, then Swayambhunath. Afternoon discourse.",
    },
    { day: 4, title: "Open day", detail: "Kept free for individual sittings with Maharaja." },
    { day: 5, title: "Return", detail: "Closing prayer, transfer to the airport, return to Kochi." },
  ]);

  for (const n of [1]) {
    const departureDate = monthsAhead(n, 12);
    const monthLabel = departureDate.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    const slug = `nepal-${departureDate.getFullYear()}-${String(
      departureDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    const y = await prisma.yatra.upsert({
      where: { slug },
      update: { coverImage: "/images/nepal-yatra.jpg" },
      create: {
        slug,
        title: `Nepal Yatra — ${monthLabel}`,
        summary:
          "The ongoing monthly journey to Kathmandu with Maharaja. Travelled together as equals, which is the teaching rather than a gesture.",
        description: `Each month a small group travels from Kerala to Kathmandu with Maharaja — not as tourists, but as a group undertaking a shared discipline.

Everyone travels the same way, eats the same food, and sits in the same morning assembly. The equality is not a courtesy extended during the journey; it is the thing being demonstrated.

First-time travellers are welcome and are looked after closely. The itinerary and the contribution are shared directly with anyone who enquires.`,
        destination: "Pashupatinath, Kathmandu, Nepal",
        departureDate,
        returnDate: addDays(departureDate, 4),
        departureCity: "Kochi",
        durationNights: 4,
        seatsTotal: 30,
        priceFrom: null,
        priceNote: "",
        inclusions: nepalInclusions,
        exclusions: JSON.stringify(["Personal expenses", "Anything not listed under inclusions"]),
        itinerary: nepalItinerary,
        status: "ANNOUNCED",
        featured: false,
        coverImage: "/images/nepal-yatra.jpg",
      },
    });
    console.log(`✔ journey: ${y.title}`);
  }

  /* ── Guruvinae Ariyan Guruvinoppam — the Athirappilly retreat ────── */

  const retreat = await prisma.yatra.upsert({
    where: { slug: "guruvinae-ariyan-guruvinoppam" },
    update: { coverImage: "/images/guruvinae-ariyan.jpg" },
    create: {
      slug: "guruvinae-ariyan-guruvinoppam",
      title: "Guruvinae Ariyan Guruvinoppam",
      summary:
        "A journey of wisdom, healing and inner transformation. An overnight residential programme at Athirappilly, led by Prof. M.V. Natesan on SNG philosophy.",
      description: `Presented by the Sreenaryanaguru Guru Family & Community Charitable Trust — wisdom, service, world peace.

Two days beside the Athirappilly falls, given over to the Guru's philosophy and to the practices that make it something you feel rather than something you agree with. The programme is led by Prof. M.V. Natesan on Sree Narayana Guru philosophy.

The days hold Guru Pooja, a healing process, sound therapy, meditation and wellness sessions, satvik food, bhajans, and open discussions where anything may be asked. A simple discipline runs through the whole of it — that is the part that does the work.

Residential and overnight, beginning Saturday at 9:00 AM and closing Sunday at noon. Seats are strictly limited.`,
      destination: "Plantation Valley Resort, Athirappilly, Kerala",
      departureDate: new Date("2026-11-07T09:00:00+05:30"),
      returnDate: new Date("2026-11-08T12:00:00+05:30"),
      departureCity: "Athirappilly",
      durationNights: 1,
      seatsTotal: 40,
      priceFrom: null,
      priceNote: "",
      inclusions: JSON.stringify([
        "Overnight residential stay at Plantation Valley Resort",
        "Satvik vegetarian meals throughout",
        "Guru Pooja and bhajans",
        "Healing process and sound therapy sessions",
        "Guided meditation and wellness sessions",
        "Open discussions with Prof. M.V. Natesan",
      ]),
      exclusions: JSON.stringify([
        "Travel to and from Athirappilly",
        "Personal expenses",
      ]),
      itinerary: JSON.stringify([
        {
          day: 1,
          title: "Saturday 7 November — from 9:00 AM",
          detail:
            "Arrival and registration, Guru Pooja to open the programme, the healing process, sound therapy, and the first session on Sree Narayana Guru philosophy with Prof. M.V. Natesan. Satvik meals throughout. Bhajans in the evening, followed by open discussion.",
        },
        {
          day: 2,
          title: "Sunday 8 November — until 12:00 noon",
          detail:
            "Early meditation and wellness session, the closing discourse, and an open floor for questions before the programme ends at noon.",
        },
      ]),
      status: "FILLING",
      featured: false,
      coverImage: "/images/guruvinae-ariyan.jpg",
    },
  });
  console.log(`✔ programme: ${retreat.title}`);

  /* ── One placeholder event ────────────────────────────────────────
     Kept deliberately thin. The point is the add-event function in the
     dashboard, not this record — replace or delete it freely.
     ─────────────────────────────────────────────────────────────── */

  const event = await prisma.event.upsert({
    where: { slug: "monthly-assembly" },
    update: {},
    create: {
      slug: "monthly-assembly",
      title: "Monthly Assembly with Maharaja",
      category: "Assembly",
      summary: "The open monthly gathering. Everyone is welcome.",
      description: `This is a placeholder event so you can see how a gathering appears on the site.

Create a real one from the dashboard under Events and it will show here automatically — on the home page and in the calendar. Delete this one whenever you like.`,
      startsAt: monthsAhead(1, 15, 18),
      venueName: "Mission Hall",
      venueAddress: "",
      city: "Thrissur",
      capacity: null,
      contributionNote: "Open to all. No fee.",
      status: "PUBLISHED",
      featured: true,
    },
  });
  console.log(`✔ event: ${event.title}`);

  /* ── Sample requests so the dashboard is not empty ────────────────── */

  if ((await prisma.yatraBooking.count()) === 0) {
    await prisma.yatraBooking.create({
      data: {
        reference: "TWG-Y-SAMPLE",
        yatraId: sriLanka.id,
        name: "Sample Delegate",
        email: "sample@example.com",
        phone: "+91 90000 00000",
        whatsapp: "+91 90000 00000",
        city: "Ernakulam",
        travellers: 1,
        passportReady: true,
        message:
          "Sample data so you can see how a request appears. Delete it from the dashboard whenever you like.",
        status: "PENDING",
      },
    });
    await prisma.appointment.create({
      data: {
        reference: "TWG-A-SAMPLE",
        name: "Sample Seeker",
        email: "seeker@example.com",
        phone: "+91 90000 00001",
        city: "Thrissur",
        mode: "IN_PERSON",
        topic: "Guidance on daily practice",
        message: "Sample appointment request — safe to delete.",
        preferredAt: monthsAhead(0, 28, 10),
        status: "PENDING",
      },
    });
    console.log("✔ sample request + appointment created");
  }

  console.log("\nSeed complete.");
  console.log(`Sign in at /admin/login  —  ${email}  /  ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
