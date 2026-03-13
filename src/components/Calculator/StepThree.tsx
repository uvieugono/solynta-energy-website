"use client";

import Link from "next/link";
import { formatNaira } from "@/data/packages";

export interface CalculatorResult {
  recommended_package: string;
  system_size: string;
  slug: string;
  total_daily_kwh: number;
  system_capacity_kwh: number;
  headroom_percent: number;
  connection_fee: number;
  subscription_28day: number;
  explanation: string;
  alternative?: {
    package: string;
    system_size: string;
    explanation: string;
  } | null;
  exceeds_capacity?: boolean;
}

interface Props {
  result: CalculatorResult | null;
  loading: boolean;
  error: string | null;
  onReset: () => void;
}

export default function StepThree({ result, loading, error, onReset }: Props) {
  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg
          className="animate-spin h-12 w-12 text-solynta-yellow"
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
        <p className="text-solynta-slate font-semibold text-lg">Analyzing your energy needs...</p>
        <p className="text-solynta-grey text-sm">This may take a few seconds</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5">
        <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-5 text-center max-w-md">
          <p className="text-red-600 font-semibold mb-1">Something went wrong</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
        <button
          onClick={onReset}
          className="bg-solynta-yellow text-solynta-slate font-semibold px-6 py-3 rounded-lg hover:brightness-95 transition-all text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ── No result yet ── */
  if (!result) return null;

  const headroomCapped = Math.min(Math.max(result.headroom_percent, 0), 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        {/* Green checkmark */}
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-3">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <p className="text-solynta-grey text-sm uppercase tracking-widest font-semibold">
          Recommended for You
        </p>
        <h2 className="text-3xl font-bold text-solynta-slate">{result.recommended_package}</h2>
        <span className="inline-block bg-solynta-yellow/20 text-solynta-slate border border-solynta-yellow px-3 py-1 rounded-full text-sm font-semibold">
          {result.system_size}
        </span>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-off-white border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-solynta-grey uppercase tracking-wide mb-1">Connection Fee</p>
          <p className="text-xl font-bold text-solynta-slate">{formatNaira(result.connection_fee)}</p>
        </div>
        <div className="bg-off-white border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-solynta-grey uppercase tracking-wide mb-1">28-Day Subscription</p>
          <p className="text-xl font-bold text-solynta-slate">{formatNaira(result.subscription_28day)}</p>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="bg-solynta-blue/5 border border-solynta-blue/20 rounded-lg p-5">
        <p className="text-sm font-semibold text-solynta-blue mb-2">AI Analysis</p>
        <p className="text-solynta-slate text-sm leading-relaxed">{result.explanation}</p>
      </div>

      {/* Exceeds Capacity Warning */}
      {result.exceeds_capacity && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
          <p className="text-amber-700 text-sm font-semibold">
            Warning: Your energy needs exceed our standard system capacity.
          </p>
          <p className="text-amber-600 text-sm mt-1">
            Please contact us directly for a custom solution tailored to your requirements.
          </p>
        </div>
      )}

      {/* System Specs */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-solynta-slate uppercase tracking-wide">System Specs</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-solynta-grey">Your Daily Consumption</span>
            <span className="font-semibold text-solynta-slate">{result.total_daily_kwh.toFixed(2)} kWh</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-solynta-grey">System Capacity</span>
            <span className="font-semibold text-solynta-slate">{result.system_capacity_kwh.toFixed(2)} kWh</span>
          </div>
          {/* Headroom bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-solynta-grey">Headroom</span>
              <span className="font-semibold text-green-600">{result.headroom_percent.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-solynta-yellow rounded-full transition-all duration-700"
                style={{ width: `${headroomCapped}%` }}
              />
            </div>
            <p className="text-xs text-solynta-grey mt-1">
              Remaining capacity after your daily usage
            </p>
          </div>
        </div>
      </div>

      {/* Alternative Package */}
      {result.alternative && (
        <div className="border border-border rounded-lg p-4 space-y-1">
          <p className="text-xs font-semibold text-solynta-grey uppercase tracking-wide">Alternative Option</p>
          <p className="text-solynta-slate font-semibold">
            {result.alternative.package}{" "}
            <span className="text-sm font-normal text-solynta-grey">— {result.alternative.system_size}</span>
          </p>
          <p className="text-sm text-solynta-grey">{result.alternative.explanation}</p>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href={`/products/${result.slug}`}
          className="flex-1 text-center bg-solynta-yellow text-solynta-slate font-semibold px-5 py-3 rounded-lg hover:brightness-95 transition-all text-sm"
        >
          Get Started with {result.recommended_package}
        </Link>
        <Link
          href="/products"
          className="flex-1 text-center border border-solynta-blue text-solynta-blue font-semibold px-5 py-3 rounded-lg hover:bg-solynta-blue/5 transition-all text-sm"
        >
          View All Packages
        </Link>
        <button
          onClick={onReset}
          className="flex-1 border border-border text-solynta-grey font-semibold px-5 py-3 rounded-lg hover:bg-off-white transition-all text-sm"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
