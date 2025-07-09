"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BondForm } from "@/components/bond-form";
import { BondFormValues, SavedBond } from "@/lib/types";
import { calculateAmortization } from "@/lib/amortization";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewBondPage() {
  const router = useRouter();

  const handleCalculate = (data: BondFormValues) => {
    const calculationResult = calculateAmortization(data);
    const newBond: SavedBond = {
      id: `bond_${new Date().getTime()}`,
      formValues: data,
      result: calculationResult,
    };

    const storedBonds = localStorage.getItem("savedBonds");
    const bonds: SavedBond[] = storedBonds ? JSON.parse(storedBonds) : [];
    const updatedBonds = [newBond, ...bonds];
    localStorage.setItem("savedBonds", JSON.stringify(updatedBonds));

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-muted/20">
        <main className="container mx-auto p-4 md:p-8">
            <div className="flex items-center mb-6">
                <Button asChild variant="outline" size="icon" className="mr-4">
                    <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Volver al Dashboard</span>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Generar Nuevo Bono</h1>
            </div>
            <Card>
                <CardHeader>
                <CardTitle>Detalles del Bono</CardTitle>
                <CardDescription>
                    Complete los siguientes campos para calcular y guardar un nuevo bono.
                </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                 <BondForm onCalculate={handleCalculate} />
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
