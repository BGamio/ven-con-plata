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
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function AmortizationSchedule({ schedule }: AmortizationScheduleProps) {
  const { toast } = useToast();

  const handleExport = () => {
    const headers = ["Period", "Payment", "Interest", "Principal", "Balance"];
    const csvContent = [
      headers.join(","),
      ...schedule.map((row) =>
        [
          row.period,
          row.payment.toFixed(2),
          row.interest.toFixed(2),
          row.principal.toFixed(2),
          row.balance.toFixed(2),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "amortization_schedule.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Your amortization schedule has been downloaded.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Amortization Schedule</CardTitle>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary">
              <TableRow>
                <TableHead className="w-[100px] text-center">Period</TableHead>
                <TableHead className="text-right">Payment</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Remaining Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((row) => (
                <TableRow key={row.period}>
                  <TableCell className="font-medium text-center">
                    {row.period}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.payment)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.interest)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.principal)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.balance)}
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
