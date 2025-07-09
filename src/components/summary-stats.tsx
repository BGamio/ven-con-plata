"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AmortizationResult } from "@/lib/types";
import { Coins, Landmark, Percent } from "lucide-react";

interface SummaryStatsProps {
  summary: AmortizationResult["summary"];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export function SummaryStats({ summary }: SummaryStatsProps) {
  const stats = [
    {
      title: "Total Principal Paid",
      value: formatCurrency(summary.totalPrincipal),
      icon: <Landmark className="h-6 w-6" />,
    },
    {
      title: "Total Interest Paid",
      value: formatCurrency(summary.totalInterest),
      icon: <Percent className="h-6 w-6" />,
    },
    {
      title: "Total Payments",
      value: formatCurrency(summary.totalPayment),
      icon: <Coins className="h-6 w-6" />,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Summary</h2>
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
