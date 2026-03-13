export interface Appliance {
  name: string;
  defaultWattage: number;
  category: string;
}

export const appliances: Appliance[] = [
  // Lighting
  { name: "LED Light (9W)", defaultWattage: 9, category: "Lighting" },
  { name: "LED Light (12W)", defaultWattage: 12, category: "Lighting" },
  { name: "LED Light (18W)", defaultWattage: 18, category: "Lighting" },
  { name: "Energy Saving Bulb", defaultWattage: 20, category: "Lighting" },
  { name: "Fluorescent Tube", defaultWattage: 36, category: "Lighting" },

  // Fans
  { name: "Ceiling Fan", defaultWattage: 75, category: "Cooling" },
  { name: "Standing Fan", defaultWattage: 55, category: "Cooling" },
  { name: "Table Fan", defaultWattage: 40, category: "Cooling" },

  // Entertainment
  { name: "TV (32 inch LED)", defaultWattage: 50, category: "Entertainment" },
  { name: "TV (43 inch LED)", defaultWattage: 80, category: "Entertainment" },
  { name: "TV (55 inch LED)", defaultWattage: 120, category: "Entertainment" },
  { name: "TV (65 inch LED)", defaultWattage: 150, category: "Entertainment" },
  { name: "DSTV/GoTV Decoder", defaultWattage: 30, category: "Entertainment" },
  { name: "Sound System / Speaker", defaultWattage: 50, category: "Entertainment" },

  // Kitchen
  { name: "Small Fridge (100L)", defaultWattage: 80, category: "Kitchen" },
  { name: "Medium Fridge (200L)", defaultWattage: 120, category: "Kitchen" },
  { name: "Large Fridge (300L+)", defaultWattage: 180, category: "Kitchen" },
  { name: "Chest Freezer", defaultWattage: 200, category: "Kitchen" },
  { name: "Microwave", defaultWattage: 1000, category: "Kitchen" },
  { name: "Electric Kettle", defaultWattage: 1500, category: "Kitchen" },
  { name: "Blender", defaultWattage: 350, category: "Kitchen" },
  { name: "Rice Cooker", defaultWattage: 500, category: "Kitchen" },

  // Computing
  { name: "Laptop", defaultWattage: 65, category: "Computing" },
  { name: "Desktop Computer", defaultWattage: 200, category: "Computing" },
  { name: "Phone Charger", defaultWattage: 10, category: "Computing" },
  { name: "WiFi Router", defaultWattage: 12, category: "Computing" },
  { name: "Printer", defaultWattage: 50, category: "Computing" },

  // Heavy Appliances
  { name: "Air Conditioner (1HP)", defaultWattage: 900, category: "Heavy" },
  { name: "Air Conditioner (1.5HP)", defaultWattage: 1200, category: "Heavy" },
  { name: "Air Conditioner (2HP)", defaultWattage: 1500, category: "Heavy" },
  { name: "Washing Machine", defaultWattage: 500, category: "Heavy" },
  { name: "Water Pump", defaultWattage: 750, category: "Heavy" },
  { name: "Iron", defaultWattage: 1000, category: "Heavy" },
  { name: "Water Heater", defaultWattage: 1500, category: "Heavy" },

  // Other
  { name: "Security Camera", defaultWattage: 15, category: "Other" },
  { name: "CCTV DVR", defaultWattage: 30, category: "Other" },
  { name: "Electric Gate Motor", defaultWattage: 300, category: "Other" },
];

export function getApplianceByName(name: string): Appliance | undefined {
  return appliances.find((a) => a.name === name);
}

export function getApplianceCategories(): string[] {
  return [...new Set(appliances.map((a) => a.category))];
}
