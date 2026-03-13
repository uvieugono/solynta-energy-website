export interface Package {
  slug: string;
  name: string;
  size: string;
  sizeKw: number;
  connectionFee: number;
  subscription7day: number;
  subscription28day: number;
  popular?: boolean;
  appliances: { name: string; quantity: number }[];
  batteryCapacityKwh: number;
  pvOutputKwh: number;
  storageKwh: number;
  faq: { question: string; answer: string }[];
}

export const packages: Package[] = [
  {
    slug: "padi-pack",
    name: "Padi Pack",
    size: "1KW",
    sizeKw: 1,
    connectionFee: 129000,
    subscription7day: 8482,
    subscription28day: 31249,
    appliances: [
      { name: "Lights", quantity: 6 },
      { name: "Fans", quantity: 2 },
      { name: "TV", quantity: 1 },
      { name: "Small Fridge", quantity: 1 },
    ],
    batteryCapacityKwh: 2.56,
    pvOutputKwh: 2.32,
    storageKwh: 2.5,
    faq: [
      {
        question: "What's included in the connection fee?",
        answer: "The connection fee covers the Smart Inverter, solar panels, lithium-ion batteries, installation, and all cabling. There are no hidden costs."
      },
      {
        question: "How does the subscription work?",
        answer: "After installation, you top up your power credits via SMS — choose either a 7-day or 28-day plan. Your system activates automatically when credits are loaded."
      },
      {
        question: "What happens if I need maintenance?",
        answer: "Maintenance is free for the lifetime of your subscription. Call us at +234(0)705 300 8625 and our engineering team will attend to any issues."
      },
      {
        question: "Can I upgrade to a bigger system later?",
        answer: "Yes! You can upgrade to a higher capacity system at any time. The connection fee difference will be calculated and a new subscription rate applied."
      },
    ],
  },
  {
    slug: "pepper-pack",
    name: "Pepper Pack",
    size: "1.5KW",
    sizeKw: 1.5,
    connectionFee: 145125,
    subscription7day: 9538,
    subscription28day: 35156,
    appliances: [
      { name: "Lights", quantity: 8 },
      { name: "Fans", quantity: 3 },
      { name: "TV", quantity: 1 },
      { name: "Large Fridge", quantity: 1 },
    ],
    batteryCapacityKwh: 2.56,
    pvOutputKwh: 4.64,
    storageKwh: 2.5,
    faq: [
      {
        question: "What's included in the connection fee?",
        answer: "The connection fee covers the Smart Inverter, solar panels, lithium-ion batteries, installation, and all cabling. There are no hidden costs."
      },
      {
        question: "How does the subscription work?",
        answer: "After installation, you top up your power credits via SMS — choose either a 7-day or 28-day plan. Your system activates automatically when credits are loaded."
      },
      {
        question: "What happens if I need maintenance?",
        answer: "Maintenance is free for the lifetime of your subscription. Call us at +234(0)705 300 8625 and our engineering team will attend to any issues."
      },
      {
        question: "Can I upgrade to a bigger system later?",
        answer: "Yes! You can upgrade to a higher capacity system at any time. The connection fee difference will be calculated and a new subscription rate applied."
      },
    ],
  },
  {
    slug: "oga-boss-pack",
    name: "Oga Boss Pack",
    size: "2KW",
    sizeKw: 2,
    connectionFee: 161250,
    subscription7day: 10594,
    subscription28day: 39063,
    popular: true,
    appliances: [
      { name: "Lights", quantity: 10 },
      { name: "Fans", quantity: 3 },
      { name: "TVs", quantity: 2 },
      { name: "Microwave", quantity: 1 },
    ],
    batteryCapacityKwh: 5.12,
    pvOutputKwh: 6.96,
    storageKwh: 5,
    faq: [
      {
        question: "What's included in the connection fee?",
        answer: "The connection fee covers the Smart Inverter, solar panels, lithium-ion batteries, installation, and all cabling. There are no hidden costs."
      },
      {
        question: "How does the subscription work?",
        answer: "After installation, you top up your power credits via SMS — choose either a 7-day or 28-day plan. Your system activates automatically when credits are loaded."
      },
      {
        question: "What happens if I need maintenance?",
        answer: "Maintenance is free for the lifetime of your subscription. Call us at +234(0)705 300 8625 and our engineering team will attend to any issues."
      },
      {
        question: "Can I upgrade to a bigger system later?",
        answer: "Yes! You can upgrade to a higher capacity system at any time. The connection fee difference will be calculated and a new subscription rate applied."
      },
    ],
  },
  {
    slug: "3kw-pack",
    name: "3KW Pack",
    size: "3KW",
    sizeKw: 3,
    connectionFee: 177375,
    subscription7day: 11650,
    subscription28day: 42970,
    appliances: [
      { name: "Lights", quantity: 12 },
      { name: "Fans", quantity: 3 },
      { name: "TVs", quantity: 3 },
    ],
    batteryCapacityKwh: 7.68,
    pvOutputKwh: 9.28,
    storageKwh: 7.5,
    faq: [
      {
        question: "What's included in the connection fee?",
        answer: "The connection fee covers the Smart Inverter, solar panels, lithium-ion batteries, installation, and all cabling. There are no hidden costs."
      },
      {
        question: "How does the subscription work?",
        answer: "After installation, you top up your power credits via SMS — choose either a 7-day or 28-day plan. Your system activates automatically when credits are loaded."
      },
      {
        question: "What happens if I need maintenance?",
        answer: "Maintenance is free for the lifetime of your subscription. Call us at +234(0)705 300 8625 and our engineering team will attend to any issues."
      },
      {
        question: "Can I upgrade to a bigger system later?",
        answer: "Yes! You can upgrade to a higher capacity system at any time. The connection fee difference will be calculated and a new subscription rate applied."
      },
    ],
  },
  {
    slug: "4kw-pack",
    name: "4KW Pack",
    size: "4KW",
    sizeKw: 4,
    connectionFee: 193500,
    subscription7day: 12706,
    subscription28day: 46877,
    appliances: [
      { name: "Lights", quantity: 14 },
      { name: "Fans", quantity: 4 },
      { name: "TVs", quantity: 4 },
      { name: "Microwave", quantity: 1 },
    ],
    batteryCapacityKwh: 10.24,
    pvOutputKwh: 13.92,
    storageKwh: 10,
    faq: [
      {
        question: "What's included in the connection fee?",
        answer: "The connection fee covers the Smart Inverter, solar panels, lithium-ion batteries, installation, and all cabling. There are no hidden costs."
      },
      {
        question: "How does the subscription work?",
        answer: "After installation, you top up your power credits via SMS — choose either a 7-day or 28-day plan. Your system activates automatically when credits are loaded."
      },
      {
        question: "What happens if I need maintenance?",
        answer: "Maintenance is free for the lifetime of your subscription. Call us at +234(0)705 300 8625 and our engineering team will attend to any issues."
      },
      {
        question: "Can I upgrade to a bigger system later?",
        answer: "Yes! You can upgrade to a higher capacity system at any time. The connection fee difference will be calculated and a new subscription rate applied."
      },
    ],
  },
  {
    slug: "5kw-pack",
    name: "5KW Pack",
    size: "5KW",
    sizeKw: 5,
    connectionFee: 215500,
    subscription7day: 14118,
    subscription28day: 52177,
    appliances: [
      { name: "Lights", quantity: 16 },
      { name: "Fans", quantity: 5 },
      { name: "TVs", quantity: 5 },
      { name: "Microwave", quantity: 1 },
    ],
    batteryCapacityKwh: 12.8,
    pvOutputKwh: 17.4,
    storageKwh: 12.5,
    faq: [
      {
        question: "What's included in the connection fee?",
        answer: "The connection fee covers the Smart Inverter, solar panels, lithium-ion batteries, installation, and all cabling. There are no hidden costs."
      },
      {
        question: "How does the subscription work?",
        answer: "After installation, you top up your power credits via SMS — choose either a 7-day or 28-day plan. Your system activates automatically when credits are loaded."
      },
      {
        question: "What happens if I need maintenance?",
        answer: "Maintenance is free for the lifetime of your subscription. Call us at +234(0)705 300 8625 and our engineering team will attend to any issues."
      },
      {
        question: "Can I upgrade to a bigger system later?",
        answer: "Yes! You can upgrade to a higher capacity system at any time. The connection fee difference will be calculated and a new subscription rate applied."
      },
    ],
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
