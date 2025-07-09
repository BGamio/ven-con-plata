"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BondFormValues, SavedBond } from "@/lib/types";
import { calculateAmortization } from "@/lib/amortization";
import { AppHeader } from "@/components/app-header";
import { BondForm } from "@/components/bond-form";
import { BondCalculator } from "@/components/bond-calculator";
import { SavedBondsList } from "@/components/saved-bonds-list";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [savedBonds, setSavedBonds] = useState<SavedBond[]>([]);
  const [selectedBond, setSelectedBond] = useState<SavedBond | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

  const handleCalculate = (data: BondFormValues) => {
    const calculationResult = calculateAmortization(data);
    const newBond: SavedBond = {
      id: `bond_${new Date().getTime()}`,
      formValues: data,
      result: calculationResult,
    };

    setSavedBonds((prevBonds) => [newBond, ...prevBonds]);
    setSelectedBond(newBond);
    setIsFormOpen(false); // Close the dialog after calculation
  };

  const handleSelectBond = (bondId: string) => {
    const bond = savedBonds.find((b) => b.id === bondId);
    if (bond) {
      setSelectedBond(bond);
    }
  };

  const handleLogout = () => {
    // In a real app, clear session/token
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
            <AppHeader />
            <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
            </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Mis Bonos (Emisor)</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Generar Bono
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generar Nuevo Bono</DialogTitle>
                <DialogDescription>
                  Complete los siguientes campos para calcular y guardar un nuevo bono.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[80vh] overflow-y-auto p-1 pr-3">
                <BondForm onCalculate={handleCalculate} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {savedBonds.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <CardHeader>
              <CardTitle className="text-2xl">No hay bonos registrados</CardTitle>
              <CardDescription>
                Haga clic en "Generar Bono" para empezar a calcular.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Button size="lg" onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Generar Bono
                </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <SavedBondsList
                bonds={savedBonds}
                onSelectBond={handleSelectBond}
                selectedBondId={selectedBond?.id || null}
              />
            </div>
            <BondCalculator bond={selectedBond} />
          </div>
        )}
      </main>
      <footer className="py-4">
        <p className="text-center text-sm text-muted-foreground">
          Creado para la claridad financiera.
        </p>
      </footer>
    </div>
  );
}
