"use client";

import { SavedBond } from "@/lib/types";
import { SummaryStats } from "./summary-stats";
import { AmortizationSchedule } from "./amortization-schedule";
import { Card, CardContent, CardTitle } from "./ui/card";
import { BarChart } from "lucide-react";

interface BondCalculatorProps {
  bond: SavedBond | null;
}

export function BondCalculator({ bond }: BondCalculatorProps) {
  return (
    <div className="lg:col-span-2 flex flex-col gap-8">
      {bond ? (
        <>
          <SummaryStats summary={bond.result.summary} />
          <AmortizationSchedule
            schedule={bond.result.schedule}
            currency={bond.result.summary.currency}
          />
        </>
      ) : (
        <Card className="flex-grow flex items-center justify-center min-h-[500px]">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl font-semibold mb-2">
              Su Flujo de Caja le Espera
            </CardTitle>
            <p className="text-muted-foreground">
              Ingrese los detalles de su bono para generar el flujo de caja y
              el resumen financiero. O seleccione un bono guardado.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
