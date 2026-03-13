"use client";

import { useState } from "react";
import StepOne, { ApplianceEntry } from "@/components/Calculator/StepOne";
import StepTwo from "@/components/Calculator/StepTwo";
import StepThree, { CalculatorResult } from "@/components/Calculator/StepThree";

const STEPS = [
  { number: 1, label: "Add Appliances" },
  { number: 2, label: "Review" },
  { number: 3, label: "Recommendation" },
];

export default function CalculatorPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [appliances, setAppliances] = useState<ApplianceEntry[]>([]);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setStep(3);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://solyntaflow.uc.r.appspot.com";
      const res = await fetch(`${API_BASE}/api/customer-service/solar-calculator/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appliances }),
      });
      if (!res.ok) throw new Error("Calculator service unavailable");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAppliances([]);
    setResult(null);
    setLoading(false);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Page Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-solynta-slate mb-2">
            Solar Calculator
          </h1>
          <p className="text-solynta-grey text-base">
            Find the perfect solar system for your home
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, index) => (
            <div key={s.number} className="flex items-center">
              {/* Circle */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                    step === s.number
                      ? "bg-solynta-yellow border-solynta-yellow text-solynta-slate"
                      : step > s.number
                      ? "bg-solynta-yellow/30 border-solynta-yellow text-solynta-slate"
                      : "bg-white border-border text-solynta-grey"
                  }`}
                >
                  {step > s.number ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    s.number
                  )}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    step === s.number ? "text-solynta-slate" : "text-solynta-grey"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-all ${
                    step > s.number ? "bg-solynta-yellow" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white border border-border rounded-xl shadow-sm p-6 sm:p-8">
          {step === 1 && (
            <StepOne
              onNext={(a) => {
                setAppliances(a);
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <StepTwo
              appliances={appliances}
              onBack={() => setStep(1)}
              onCalculate={handleCalculate}
              loading={loading}
            />
          )}
          {step === 3 && (
            <StepThree
              result={result}
              loading={loading}
              error={error}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </main>
  );
}
