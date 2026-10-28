/**
 * The published catalogue — journeys and events.
 *
 * This site is frontend-only: there is no database at build or request time.
 * These records were exported verbatim from the project's own seeded data, so
 * the pages render exactly the content they rendered before.
 *
 * To change a journey or an event, edit it here and redeploy.
 *
 * Shapes mirror the former database models so every page and component that
 * reads them is unchanged.
 */

export type YatraStatus =
  | "DRAFT" | "ANNOUNCED" | "FILLING" | "FULL" | "CLOSED" | "COMPLETED";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

export type BookingStatus =
  | "PENDING" | "CONFIRMED" | "WAITLISTED" | "CANCELLED" | "COMPLETED";

export type Yatra = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  destination: string;
  departureDate: Date;
  returnDate: Date;
  departureCity: string;
  durationNights: number;
  seatsTotal: number;
  priceFrom: number | null;
  priceNote: string;
  /** JSON array of strings. */
  inclusions: string;
  /** JSON array of strings. */
  exclusions: string;
  /** JSON array of { day, title, detail }. */
  itinerary: string;
  coverImage: string | null;
  status: YatraStatus;
  featured: boolean;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  startsAt: Date;
  endsAt: Date | null;
  venueName: string;
  venueAddress: string;
  city: string;
  isOnline: boolean;
  onlineUrl: string | null;
  coverImage: string | null;
  capacity: number | null;
  contributionNote: string;
  status: EventStatus;
  featured: boolean;
};

export const yatras: Yatra[] = [
  {
    id: "cmvp8u7ws00018olmj6k5j4ip",
    slug: "sri-lanka-spiritual-heritage-tour",
    title: "Sri Lanka Spiritual & Heritage Tour",
    summary: "Five days through Sri Lanka's Buddhist and Hindu heritage, Ramayana traditions and sacred cities — with meditation, reflection and the message of equality and world peace.",
    description: "A cultural, historical and spiritual journey through Sri Lanka's sacred sites and living traditions, undertaken in the spirit of reflection, cultural exchange and the universal message of humanity and social harmony.\n\nThe route runs from the Nagapattinam ferry connection to Anuradhapura, Mihintale and Yapahuwa, on through Polonnaruwa, Sigiriya and Dambulla, to Kandy and Colombo before the return crossing. Travel is by two-way ferry via Nagapattinam, with pre-arranged road or rail between Thrissur and the port.\n\nAlongside the heritage, the group studies the Buddhist and Hindu traditions of the island, documents the cultural traditions associated with the Ramayana — distinguishing local belief and oral tradition from historical evidence — and reflects on Sree Narayana Guru's message of equality, humanity and universal brotherhood. Proposed energy points and disputed historical connections are treated as research questions, not settled facts.\n\nAccommodation is three-sharing. Meals are satvik vegetarian. Places are limited and arranged individually.\n\nThis is a planning itinerary rather than a confirmed ticket: ferry dates, ports, sailing times and admission fees are subject to final written confirmation, and the operator may adjust sightseeing to fit the confirmed timetable.",
    destination: "Anuradhapura · Sigiriya · Kandy · Colombo, Sri Lanka",
    departureDate: new Date("2026-10-30T00:30:00.000Z"),
    returnDate: new Date("2026-11-03T14:30:00.000Z"),
    departureCity: "Thrissur",
    durationNights: 4,
    seatsTotal: 20,
    priceFrom: null,
    priceNote: "",
    inclusions: "[\"Three-sharing accommodation for the confirmed number of nights\",\"Satvik vegetarian meals as listed in the final quotation\",\"Sri Lankan local transport, driver and agreed transfers\",\"Entry tickets to the listed attractions, once confirmed in writing\",\"Scheduled group meditation, spiritual discussions and cultural orientation\",\"Tour coordination for the agreed itinerary and confirmed ferry connections\",\"Thrissur–Nagapattinam–Thrissur transport by pre-arranged road or train\"]",
    exclusions: "[\"Sri Lankan visa / ETA fees and any required travel authorisations\",\"Travel insurance, personal expenses, tips and optional guides\",\"Baggage charges or ferry surcharges, if applicable\",\"Any attraction fee not expressly included in the final quotation\",\"Additional hotel nights, meals outside the agreed plan, and costs caused by delays\",\"Private meetings, special ceremonies or VIP access not listed in the written quotation\"]",
    itinerary: "[{\"day\":1,\"title\":\"Friday 30 Oct — Ferry arrival & Anuradhapura\",\"detail\":\"Arrive at the confirmed Sri Lankan ferry port and complete immigration. Meet the local coordinator and transfer towards Anuradhapura. Selected heritage sites if arrival time and opening hours permit. Check in, satvik dinner, group orientation and a short guided meditation.\"},{\"day\":2,\"title\":\"Saturday 31 Oct — Anuradhapura, Mihintale & Yapahuwa\",\"detail\":\"The ancient city, its stupas, the sacred Bodhi Tree area and the archaeological heritage, subject to access and local regulations. Mihintale, traditionally associated with the arrival of Buddhism in Sri Lanka. Yapahuwa Rock Fortress and its carved staircase if time and travel conditions permit. Satvik meals, reflection and overnight in the Cultural Triangle.\"},{\"day\":3,\"title\":\"Sunday 1 Nov — Polonnaruwa, Sigiriya & Dambulla\",\"detail\":\"Polonnaruwa Ancient City including the royal ruins and Gal Vihara. Sigiriya Rock Fortress — its historic urban planning, water gardens and rock summit. Dambulla Cave Temple for its Buddhist statues and murals. Overnight near Dambulla. This is a demanding day; the operator may move or omit one site to keep the schedule safe and realistic.\"},{\"day\":4,\"title\":\"Monday 2 Nov — Kandy & Colombo\",\"detail\":\"Sri Dalada Maligawa, the Temple of the Sacred Tooth Relic, observing dress code and temple etiquette. Onward to Colombo only if traffic, travel time and the confirmed ferry schedule allow. If feasible, Gangaramaya Temple and Sambodhi Pagoda. Overnight near the departure port where compatible with the ferry timetable.\"},{\"day\":5,\"title\":\"Tuesday 3 Nov — Return ferry & journey home\",\"detail\":\"Transfer to the ferry terminal and complete departure formalities. Return ferry to Nagapattinam, then on to Thrissur by pre-arranged road transport or train. Arrival may fall on 4 November depending on ferry timings and onward connections.\"}]",
    coverImage: "/images/sri-lanka-yatra.jpg",
    status: "FILLING",
    featured: true,
  },
  {
    id: "cmvp8u7xr00038olm0qij6qk4",
    slug: "guruvinae-ariyan-guruvinoppam",
    title: "Guruvinae Ariyan Guruvinoppam",
    summary: "A journey of wisdom, healing and inner transformation. An overnight residential programme at Athirappilly, led by Prof. M.V. Natesan on SNG philosophy.",
    description: "Presented by the Sreenaryanaguru Guru Family & Community Charitable Trust — wisdom, service, world peace.\n\nTwo days beside the Athirappilly falls, given over to the Guru's philosophy and to the practices that make it something you feel rather than something you agree with. The programme is led by Prof. M.V. Natesan on Sree Narayana Guru philosophy.\n\nThe days hold Guru Pooja, a healing process, sound therapy, meditation and wellness sessions, satvik food, bhajans, and open discussions where anything may be asked. A simple discipline runs through the whole of it — that is the part that does the work.\n\nResidential and overnight, beginning Saturday at 9:00 AM and closing Sunday at noon. Seats are strictly limited.",
    destination: "Plantation Valley Resort, Athirappilly, Kerala",
    departureDate: new Date("2026-11-07T03:30:00.000Z"),
    returnDate: new Date("2026-11-08T06:30:00.000Z"),
    departureCity: "Athirappilly",
    durationNights: 1,
    seatsTotal: 40,
    priceFrom: null,
    priceNote: "",
    inclusions: "[\"Overnight residential stay at Plantation Valley Resort\",\"Satvik vegetarian meals throughout\",\"Guru Pooja and bhajans\",\"Healing process and sound therapy sessions\",\"Guided meditation and wellness sessions\",\"Open discussions with Prof. M.V. Natesan\"]",
    exclusions: "[\"Travel to and from Athirappilly\",\"Personal expenses\"]",
    itinerary: "[{\"day\":1,\"title\":\"Saturday 7 November — from 9:00 AM\",\"detail\":\"Arrival and registration, Guru Pooja to open the programme, the healing process, sound therapy, and the first session on Sree Narayana Guru philosophy with Prof. M.V. Natesan. Satvik meals throughout. Bhajans in the evening, followed by open discussion.\"},{\"day\":2,\"title\":\"Sunday 8 November — until 12:00 noon\",\"detail\":\"Early meditation and wellness session, the closing discourse, and an open floor for questions before the programme ends at noon.\"}]",
    coverImage: "/images/guruvinae-ariyan.jpg",
    status: "FILLING",
    featured: false,
  },
  {
    id: "cmvp8u7xi00028olmg0m30kfx",
    slug: "nepal-2026-11",
    title: "Nepal Yatra — November 2026",
    summary: "The ongoing monthly journey to Kathmandu with Maharaja. Travelled together as equals, which is the teaching rather than a gesture.",
    description: "Each month a small group travels from Kerala to Kathmandu with Maharaja — not as tourists, but as a group undertaking a shared discipline.\n\nEveryone travels the same way, eats the same food, and sits in the same morning assembly. The equality is not a courtesy extended during the journey; it is the thing being demonstrated.\n\nFirst-time travellers are welcome and are looked after closely. The itinerary and the contribution are shared directly with anyone who enquires.",
    destination: "Pashupatinath, Kathmandu, Nepal",
    departureDate: new Date("2026-11-12T00:30:00.000Z"),
    returnDate: new Date("2026-11-16T00:30:00.000Z"),
    departureCity: "Kochi",
    durationNights: 4,
    seatsTotal: 30,
    priceFrom: null,
    priceNote: "",
    inclusions: "[\"Return airfare, Kochi ⇄ Kathmandu\",\"Accommodation on twin-sharing basis\",\"Daily vegetarian breakfast and dinner\",\"All airport and temple transfers by private coach\",\"Guided darshan with Maharaja\",\"Morning assembly on each day of the journey\"]",
    exclusions: "[\"Personal expenses\",\"Anything not listed under inclusions\"]",
    itinerary: "[{\"day\":1,\"title\":\"Kochi to Kathmandu\",\"detail\":\"Arrival, transfer to the guest house, and an opening assembly with Maharaja.\"},{\"day\":2,\"title\":\"Pashupatinath\",\"detail\":\"Early morning darshan with Maharaja, followed by time on the Bagmati ghats.\"},{\"day\":3,\"title\":\"Boudhanath and Swayambhunath\",\"detail\":\"Kora at the great stupa at first light, then Swayambhunath. Afternoon discourse.\"},{\"day\":4,\"title\":\"Open day\",\"detail\":\"Kept free for individual sittings with Maharaja.\"},{\"day\":5,\"title\":\"Return\",\"detail\":\"Closing prayer, transfer to the airport, return to Kochi.\"}]",
    coverImage: "/images/nepal-yatra.jpg",
    status: "ANNOUNCED",
    featured: false,
  },
];

export const events: Event[] = [
  {
    id: "cmvp8u7y000048olm4sponswh",
    slug: "monthly-assembly",
    title: "Monthly Assembly with Maharaja",
    summary: "The open monthly gathering. Everyone is welcome.",
    description: "This is a placeholder event so you can see how a gathering appears on the site.\n\nCreate a real one from the dashboard under Events and it will show here automatically — on the home page and in the calendar. Delete this one whenever you like.",
    category: "Assembly",
    startsAt: new Date("2026-11-15T12:30:00.000Z"),
    endsAt: null,
    venueName: "Mission Hall",
    venueAddress: "",
    city: "Thrissur",
    isOnline: false,
    onlineUrl: null,
    coverImage: null,
    capacity: null,
    contributionNote: "Open to all. No fee.",
    status: "PUBLISHED",
    featured: true,
  },
];
