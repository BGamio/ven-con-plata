"use client";

import { SavedBond } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

interface SavedBondsListProps {
  bonds: SavedBond[];
  onSelectBond: (bondId: string) => void;
  selectedBondId: string | null;
}

export function SavedBondsList({
  bonds,
  onSelectBond,
  selectedBondId,
}: SavedBondsListProps) {
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat(
      currency === "PEN" ? "es-PE" : currency === "EUR" ? "de-DE" : "en-US",
      {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    ).format(value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bonos Calculados</CardTitle>
        <CardDescription>
          Seleccione un bono para ver sus detalles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[24rem] w-full">
          <div className="flex flex-col gap-2 pr-4">
            {bonds.map((bond) => (
              <Button
                key={bond.id}
                variant={
                  bond.id === selectedBondId ? "secondary" : "ghost"
                }
                className="h-auto w-full justify-between p-3 text-left"
                onClick={() => onSelectBond(bond.id)}
              >
                <div className="flex-grow">
                  <p className="font-semibold text-sm">
                    {bond.formValues.companyName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {`VAN: ${formatCurrency(
                      bond.result.summary.npv,
                      bond.formValues.currency
                    )}`}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0 ml-2">
                   {new Date(parseInt(bond.id.split("_")[1])).toLocaleDateString()}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
