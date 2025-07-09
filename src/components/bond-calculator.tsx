"use client";

import { useState } from "react";
import { AmortizationResult, BondFormValues } from "@/lib/types";
import { calculateFrenchAmortization } from "@/lib/amortization";
import { BondForm } from "./bond-form";
import { SummaryStats } from "./summary-stats";
import { AmortizationSchedule } from "./amortization-schedule";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart } from "lucide-react";

export function BondCalculator() {
  const [result, setResult] = useState<AmortizationResult | null>(null);

  const handleCalculate = (data: BondFormValues) => {
    const calculationResult = calculateFrenchAmortization(data);
    setResult(calculationResult);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <BondForm onCalculate={handleCalculate} />
      </div>
      <div className="lg:col-span-2 flex flex-col gap-8">
        {result ? (
          <>
            <SummaryStats summary={result.summary} />
            <AmortizationSchedule schedule={result.schedule} />
          </>
        ) : (
          <Card className="flex-grow flex items-center justify-center">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">
                Your Cash Flow Awaits
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your bond's details to generate the amortization schedule
                and financial summary.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
