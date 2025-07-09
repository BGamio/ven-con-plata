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

    if (isNaN(periodicIRR) || !isFinite(periodicIRR)) {
        return [];
    }
    
    const bondPriceAtIRR = formValues.marketValue;

    const macaulayDuration = investorFutureCashFlows.reduce((acc, cf, index) => {
        const t = index + 1;
        const pv_cf = cf / Math.pow(1 + periodicIRR, t);
        return acc + t * pv_cf;
    }, 0) / bondPriceAtIRR;
    
    const modifiedDuration = macaulayDuration / (1 + periodicIRR);
    const slope = -bondPriceAtIRR * modifiedDuration;

    const data = [];
    const step = 0.0025; // 0.25%
    for (let i = -10; i <= 10; i++) {
      const yieldRate = periodicIRR + i * step;
      const price = calculateBondPrice(yieldRate, investorFutureCashFlows);
      const tangentPrice = bondPriceAtIRR + slope * (yieldRate - periodicIRR);
      
      data.push({
        yield: yieldRate * 100,
        'Precio': price,
        'Duracion': tangentPrice,
      });
    }
    return data;
  }, [bond]);

  if (chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Relación Precio-Rendimiento</CardTitle>
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
        <CardTitle>Relación Precio-Rendimiento y Duración</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 30,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
                dataKey="yield" 
                type="number"
                domain={['dataMin', 'dataMax']}
                name="Rendimiento" 
                label={{ value: 'Tasa de Interés / Rendimiento (%)', position: 'insideBottom', offset: -15 }}
                tickFormatter={(value) => `${value.toFixed(2)}`}
            />
            <YAxis 
                name="Precio" 
                label={{ value: `Precio del Bono (${bond.formValues.currency})`, angle: -90, position: 'insideLeft', offset: -25}}
                tickFormatter={(value) => new Intl.NumberFormat('en-US', {notation: 'compact'}).format(value)}
            />
            <Tooltip
                formatter={(value, name) => [`${bond.formValues.currency} ${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, name]}
                labelFormatter={(label) => `Rendimiento: ${label.toFixed(4)}%`}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line
              type="monotone"
              dataKey="Precio"
              name="Precio (Convexidad)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
             <Line
              type="linear"
              dataKey="Duracion"
              name="Duración (Lineal)"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
