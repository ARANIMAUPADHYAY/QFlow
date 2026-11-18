import type { ServiceCentre } from "../../types/centre";

export const serviceCentres: ServiceCentre[] = [
  {
    id: "cedar-bay-clinic",
    name: "Cedar Bay Clinic",
    category: "healthcare",
    area: "Palm Row",
    address: "18 Palm Row, Cedar Bay",
    summary:
      "A neighbourhood clinic for same-day appointments, repeat prescriptions, and nurse visits.",
    openHours: "Mon–Sat, 8:00–18:00",
    services: [
      {
        id: "gp",
        name: "General consultation",
        description: "Same-day visit with a general physician.",
        hours: "8:00–17:30",
        averageServiceMinutes: 12,
        queueLength: 9,
        status: "open",
      },
      {
        id: "nurse",
        name: "Nurse station",
        description: "Dressings, vaccines, and routine checks.",
        hours: "8:00–16:00",
        averageServiceMinutes: 8,
        queueLength: 4,
        status: "busy",
      },
      {
        id: "pharmacy-desk",
        name: "Prescription desk",
        description: "Collect a repeat prescription already on file.",
        hours: "9:00–18:00",
        averageServiceMinutes: 5,
        queueLength: 2,
        status: "open",
      },
    ],
  },
  {
    id: "northwharf-bank",
    name: "Northwharf Bank, Harbour Branch",
    category: "banking",
    area: "Harbour",
    address: "4 Wharf Lane, Harbour",
    summary:
      "Teller services, account updates, and scheduled loan conversations.",
    openHours: "Mon–Fri, 9:30–16:30",
    services: [
      {
        id: "teller",
        name: "Teller counter",
        description: "Deposits, withdrawals, and everyday account help.",
        hours: "9:30–16:30",
        averageServiceMinutes: 7,
        queueLength: 11,
        status: "busy",
      },
      {
        id: "loans",
        name: "Lending desk",
        description: "A scheduled conversation about a personal loan.",
        hours: "10:00–16:00",
        averageServiceMinutes: 25,
        queueLength: 3,
        status: "open",
      },
    ],
  },
  {
    id: "civic-records",
    name: "Civic Records Office",
    category: "government",
    area: "Town Hall",
    address: "1 Council Square, Town Hall",
    summary: "Certificates, address updates, and document collection.",
    openHours: "Mon–Fri, 9:00–17:00",
    services: [
      {
        id: "certificates",
        name: "Certificates",
        description: "Birth, residence, and income certificates.",
        hours: "9:00–16:30",
        averageServiceMinutes: 15,
        queueLength: 16,
        status: "busy",
      },
      {
        id: "collection",
        name: "Document collection",
        description: "Pick up a document that is already ready.",
        hours: "9:00–17:00",
        averageServiceMinutes: 4,
        queueLength: 5,
        status: "open",
      },
    ],
  },
  {
    id: "linden-studio",
    name: "Linden Studio",
    category: "salon",
    area: "Orchard Street",
    address: "27 Orchard Street",
    summary: "Cuts, colour, and beard trims booked as a walk-in queue.",
    openHours: "Tue–Sun, 10:00–20:00",
    services: [
      {
        id: "cut",
        name: "Cut",
        description: "A wash and cut with the next available stylist.",
        hours: "10:00–19:30",
        averageServiceMinutes: 35,
        queueLength: 3,
        status: "open",
      },
      {
        id: "colour",
        name: "Colour",
        description: "Root touch-up or a full colour.",
        hours: "10:00–18:00",
        averageServiceMinutes: 75,
        queueLength: 2,
        status: "open",
      },
    ],
  },
  {
    id: "maple-hall",
    name: "Maple Hall Admissions",
    category: "education",
    area: "College Green",
    address: "Maple Hall, College Green",
    summary: "Course enquiries, fee slips, and document verification.",
    openHours: "Mon–Fri, 9:00–15:30",
    services: [
      {
        id: "enquiry",
        name: "Admissions enquiry",
        description: "Talk through a course and the papers you need.",
        hours: "9:00–15:00",
        averageServiceMinutes: 10,
        queueLength: 6,
        status: "open",
      },
      {
        id: "fees",
        name: "Fee counter",
        description: "Pay or collect a fee receipt.",
        hours: "9:00–15:30",
        averageServiceMinutes: 6,
        queueLength: 0,
        status: "closed",
      },
    ],
  },
  {
    id: "willow-support",
    name: "Willow Support Centre",
    category: "customer-service",
    area: "Market Yard",
    address: "12 Market Yard",
    summary: "Account help, replacements, and billing questions.",
    openHours: "Mon–Sat, 10:00–19:00",
    services: [
      {
        id: "accounts",
        name: "Account help",
        description: "Billing, plan changes, and account access.",
        hours: "10:00–19:00",
        averageServiceMinutes: 9,
        queueLength: 7,
        status: "open",
      },
      {
        id: "returns",
        name: "Replacements",
        description: "Hand in an item and start a replacement.",
        hours: "10:00–18:00",
        averageServiceMinutes: 8,
        queueLength: 1,
        status: "open",
      },
    ],
  },
];

export function getCentre(id: string) {
  return serviceCentres.find((centre) => centre.id === id);
}

export function centreWait(centre: ServiceCentre) {
  const open = centre.services.filter((service) => service.status !== "closed");
  const queueLength = open.reduce((sum, service) => sum + service.queueLength, 0);
  const estimatedWaitMinutes =
    open.length === 0
      ? 0
      : Math.round(
          open.reduce(
            (sum, service) => sum + service.queueLength * service.averageServiceMinutes,
            0,
          ) / open.length,
        );
  return { queueLength, estimatedWaitMinutes };
}
