"use client";

import { useState } from "react";
import { appliances, getApplianceCategories, getApplianceByName } from "@/data/appliances";

export interface ApplianceEntry {
  type: string;
  quantity: number;
  wattage: number;
  hours: number;
}

interface Props {
  onNext: (appliances: ApplianceEntry[]) => void;
}

export default function StepOne({ onNext }: Props) {
  const [entries, setEntries] = useState<ApplianceEntry[]>([]);
  const [selectedAppliance, setSelectedAppliance] = useState<string>(appliances[0].name);

  const categories = getApplianceCategories();

  const handleAdd = () => {
    const appliance = getApplianceByName(selectedAppliance);
    if (!appliance) return;
    setEntries((prev) => [
      ...prev,
      {
        type: appliance.name,
        quantity: 1,
        wattage: appliance.defaultWattage,
        hours: 8,
      },
    ]);
  };

  const handleUpdate = (index: number, field: keyof ApplianceEntry, value: number | string) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: typeof value === "string" ? value : Number(value) } : entry
      )
    );
  };

  const handleRemove = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const totalKwh = entries.reduce(
    (sum, e) => sum + (e.quantity * e.wattage * e.hours) / 1000,
    0
  );

  return (
    <div className="space-y-6">
      {/* Appliance Selector */}
      <div>
        <label className="block text-sm font-semibold text-solynta-slate mb-2">
          Select an Appliance
        </label>
        <div className="flex gap-3">
          <select
            value={selectedAppliance}
            onChange={(e) => setSelectedAppliance(e.target.value)}
            className="flex-1 border border-border rounded-lg px-3 py-2 text-solynta-slate text-sm focus:outline-none focus:border-solynta-yellow bg-white"
          >
            {categories.map((category) => (
              <optgroup key={category} label={category}>
                {appliances
                  .filter((a) => a.category === category)
                  .map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} ({a.defaultWattage}W)
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="bg-solynta-yellow text-solynta-slate font-semibold px-5 py-2 rounded-lg hover:brightness-95 transition-all text-sm whitespace-nowrap"
          >
            + Add Appliance
          </button>
        </div>
      </div>

      {/* Entries Table */}
      {entries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-off-white border-b border-border">
                <th className="text-left py-2 px-3 font-semibold text-solynta-slate">Appliance</th>
                <th className="text-center py-2 px-3 font-semibold text-solynta-slate">Qty</th>
                <th className="text-center py-2 px-3 font-semibold text-solynta-slate">Wattage (W)</th>
                <th className="text-center py-2 px-3 font-semibold text-solynta-slate">Hours/Day</th>
                <th className="text-center py-2 px-3 font-semibold text-solynta-slate">kWh/day</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => {
                const kWh = (entry.quantity * entry.wattage * entry.hours) / 1000;
                return (
                  <tr key={index} className="border-b border-border hover:bg-off-white/50">
                    <td className="py-2 px-3 text-solynta-slate font-medium">{entry.type}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={1}
                        value={entry.quantity}
                        onChange={(e) => handleUpdate(index, "quantity", e.target.value)}
                        className="w-16 text-center border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-solynta-yellow"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={1}
                        value={entry.wattage}
                        onChange={(e) => handleUpdate(index, "wattage", e.target.value)}
                        className="w-20 text-center border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-solynta-yellow"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={entry.hours}
                        onChange={(e) => handleUpdate(index, "hours", e.target.value)}
                        className="w-16 text-center border border-border rounded px-2 py-1 text-sm focus:outline-none focus:border-solynta-yellow"
                      />
                    </td>
                    <td className="py-2 px-3 text-center text-solynta-slate font-medium">
                      {kWh.toFixed(3)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg leading-none transition-colors"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-10 text-solynta-grey text-sm border border-dashed border-border rounded-lg">
          No appliances added yet. Select an appliance above and click &quot;Add Appliance&quot;.
        </div>
      )}

      {/* Running Total */}
      <div className="bg-solynta-yellow/10 border border-solynta-yellow rounded-lg px-5 py-4 flex items-center justify-between">
        <span className="text-solynta-slate font-semibold text-sm">Estimated Daily Consumption</span>
        <span className="text-2xl font-bold text-solynta-slate">
          {totalKwh.toFixed(2)}{" "}
          <span className="text-base font-semibold text-solynta-grey">kWh/day</span>
        </span>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onNext(entries)}
          disabled={entries.length === 0}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
            entries.length > 0
              ? "bg-solynta-yellow text-solynta-slate hover:brightness-95"
              : "bg-border text-solynta-grey cursor-not-allowed"
          }`}
        >
          Next: Review &rarr;
        </button>
      </div>
    </div>
  );
}
