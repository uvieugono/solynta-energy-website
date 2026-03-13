"use client";

import { ApplianceEntry } from "./StepOne";

interface Props {
  appliances: ApplianceEntry[];
  onBack: () => void;
  onCalculate: () => void;
  loading: boolean;
}

export default function StepTwo({ appliances, onBack, onCalculate, loading }: Props) {
  const totalKwh = appliances.reduce(
    (sum, e) => sum + (e.quantity * e.wattage * e.hours) / 1000,
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-off-white border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-solynta-slate">Appliance</th>
              <th className="text-center py-3 px-4 font-semibold text-solynta-slate">Qty</th>
              <th className="text-center py-3 px-4 font-semibold text-solynta-slate">Wattage (W)</th>
              <th className="text-center py-3 px-4 font-semibold text-solynta-slate">Hours/Day</th>
              <th className="text-right py-3 px-4 font-semibold text-solynta-slate">Daily kWh</th>
            </tr>
          </thead>
          <tbody>
            {appliances.map((entry, index) => {
              const kWh = (entry.quantity * entry.wattage * entry.hours) / 1000;
              return (
                <tr key={index} className="border-b border-border hover:bg-off-white/50">
                  <td className="py-3 px-4 text-solynta-slate">{entry.type}</td>
                  <td className="py-3 px-4 text-center text-solynta-grey">{entry.quantity}</td>
                  <td className="py-3 px-4 text-center text-solynta-grey">{entry.wattage}W</td>
                  <td className="py-3 px-4 text-center text-solynta-grey">{entry.hours}h</td>
                  <td className="py-3 px-4 text-right text-solynta-slate">{kWh.toFixed(3)}</td>
                </tr>
              );
            })}
            {/* Total Row */}
            <tr className="bg-off-white border-t-2 border-solynta-yellow">
              <td colSpan={4} className="py-3 px-4 font-bold text-solynta-slate">
                Total Daily Consumption
              </td>
              <td className="py-3 px-4 text-right font-bold text-solynta-yellow text-lg">
                {totalKwh.toFixed(2)} kWh
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Note */}
      <p className="text-xs text-solynta-grey italic text-center">
        Based on 20 hours solar + 4 hours grid daily
      </p>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-semibold text-sm border border-solynta-grey text-solynta-grey hover:bg-off-white transition-all"
        >
          &larr; Back
        </button>
        <button
          onClick={onCalculate}
          disabled={loading}
          className="flex items-center gap-2 bg-solynta-yellow text-solynta-slate font-semibold px-6 py-3 rounded-lg hover:brightness-95 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && (
            <svg
              className="animate-spin h-4 w-4 text-solynta-slate"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          )}
          Calculate My System
        </button>
      </div>
    </div>
  );
}
