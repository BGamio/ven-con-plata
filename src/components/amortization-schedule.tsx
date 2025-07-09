"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AmortizationPeriod } from "@/lib/types";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";

interface AmortizationScheduleProps {
  schedule: AmortizationPeriod[];
  currency: "USD" | "PEN" | "EUR";
}

export function AmortizationSchedule({
  schedule,
  currency,
}: AmortizationScheduleProps) {
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(
      currency === "PEN" ? "es-PE" : currency === "EUR" ? "de-DE" : "en-US",
      {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(value);
  };

  const handleExport = () => {
    const headers = [
      "Periodo",
      "Saldo Inicial",
      "Interés",
      "Amortización",
      "Cuota",
      "Saldo Final",
      "Flujo Emisor",
    ];
    const csvContent = [
      headers.join(","),
      ...schedule.map((row) =>
        [
          row.period,
          row.initialBalance.toFixed(2),
          row.interest.toFixed(2),
          row.principal.toFixed(2),
          row.payment.toFixed(2),
          row.finalBalance.toFixed(2),
          row.issuerCashFlow.toFixed(2),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "flujo_de_caja_bono.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportación Exitosa",
      description: "El flujo de caja de su bono ha sido descargado.",
    });
  };

  if (schedule.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Flujo de Caja y Amortización</CardTitle>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar a CSV
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[32rem] w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary">
              <TableRow>
                <TableHead className="text-center">Periodo</TableHead>
                <TableHead className="text-right">Saldo Inicial</TableHead>
                <TableHead className="text-right">Interés</TableHead>
                <TableHead className="text-right">Amortización</TableHead>
                <TableHead className="text-right">Cuota</TableHead>
                <TableHead className="text-right">Saldo Final</TableHead>
                <TableHead className="text-right">Flujo Emisor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((row) => (
                <TableRow key={row.period}>
                  <TableCell className="font-medium text-center">
                    {row.period}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.initialBalance)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.interest)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.principal)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.payment)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.finalBalance)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(row.issuerCashFlow)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
