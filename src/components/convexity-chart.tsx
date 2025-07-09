"use client";

import { SavedBond } from "@/lib/types";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ConvexityChartProps {
  bond: SavedBond;
}

const calculateBondPrice = (yieldRate: number, cashFlows: number[]): number => {
  if (yieldRate <= -1) return 0;
  return cashFlows.reduce(
    (price, cf, index) => price + cf / Math.pow(1 + yieldRate, index + 1),
    0
  );
};

export function ConvexityChart({ bond }: ConvexityChartProps) {
  const chartData = useMemo(() => {
    const { formValues, result } = bond;
    const investorFutureCashFlows = result.schedule.map(p => -p.issuerCashFlow);

    const periodicIRR = parseFloat(result.summary.irr) / 100 / (result.schedule.length / formValues.termInYears);

    if (isNaN(periodicIRR)) {
        return [];
    }

    const data = [];
    const step = 0.0025; // 0.25%
    for (let i = -10; i <= 10; i++) {
      const yieldRate = periodicIRR + i * step;
      const price = calculateBondPrice(yieldRate, investorFutureCashFlows);
      data.push({
        yield: (yieldRate * 100).toFixed(2),
        Precio: price.toFixed(2),
      });
    }
    return data;
  }, [bond]);

  if (chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Gráfico Precio-Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">No se pudo calcular la convexidad (TIR no disponible).</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico Precio-Rendimiento (Convexidad)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 30,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
                dataKey="yield" 
                name="Rendimiento" 
                label={{ value: 'Rendimiento Periódico (%)', position: 'insideBottom', offset: -5 }}
                tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
                name="Precio" 
                label={{ value: `Precio (${bond.formValues.currency})`, angle: -90, position: 'insideLeft', offset: -20}}
                tickFormatter={(value) => new Intl.NumberFormat('en-US').format(parseFloat(value))}
            />
            <Tooltip
                formatter={(value, name) => [`${bond.formValues.currency} ${value}`, name]}
                labelFormatter={(label) => `Rendimiento: ${label}%`}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line
              type="monotone"
              dataKey="Precio"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
