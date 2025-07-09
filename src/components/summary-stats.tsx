"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AmortizationResult } from "@/lib/types";
import { Coins, Landmark, Percent } from "lucide-react";

interface SummaryStatsProps {
  summary: AmortizationResult["summary"];
}

export function SummaryStats({ summary }: SummaryStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(
      summary.currency === "PEN"
        ? "es-PE"
        : summary.currency === "EUR"
        ? "de-DE"
        : "en-US",
      {
        style: "currency",
        currency: summary.currency,
      }
    ).format(value);
  };

  const formatPercent = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return value;
    return `${(num * 100).toFixed(4)}%`;
  };

  const stats = [
    {
      title: "VAN (Valor Actual Neto)",
      value: formatCurrency(summary.npv),
      icon: <Coins className="h-6 w-6" />,
    },
    {
      title: "TIR (Tasa Interna de Retorno)",
      value: formatPercent(summary.irr),
      icon: <Percent className="h-6 w-6" />,
    },
    {
      title: "TCEA (Tasa de Costo Efectivo Anual)",
      value: formatPercent(summary.tcea),
      icon: <Landmark className="h-6 w-6" />,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Resultados Financieros</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="text-muted-foreground">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
