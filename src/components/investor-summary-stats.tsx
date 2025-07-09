"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvestorMetrics } from "@/lib/types";
import { Coins, Percent, Activity } from "lucide-react";

interface InvestorSummaryStatsProps {
  summary: InvestorMetrics;
  currency: "USD" | "PEN" | "EUR";
}

export function InvestorSummaryStats({ summary, currency }: InvestorSummaryStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(
      currency === "PEN" ? "es-PE" : currency === "EUR" ? "de-DE" : "en-US",
      {
        style: "currency",
        currency: currency,
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
      title: "VAN (Inversionista)",
      value: formatCurrency(summary.npv),
      icon: <Coins className="h-6 w-6" />,
    },
    {
      title: "TIR (Anual)",
      value: formatPercent(summary.irr),
      icon: <Percent className="h-6 w-6" />,
    },
    {
      title: "TREA (Tasa de Rendimiento Efectivo Anual)",
      value: formatPercent(summary.trea),
      icon: <Activity className="h-6 w-6" />,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Resultados para el Inversionista</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
