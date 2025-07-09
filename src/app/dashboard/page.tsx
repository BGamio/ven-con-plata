"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SavedBond } from "@/lib/types";
import { AppHeader } from "@/components/app-header";
import { BondCalculator } from "@/components/bond-calculator";
import { SavedBondsList } from "@/components/saved-bonds-list";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [savedBonds, setSavedBonds] = useState<SavedBond[]>([]);
  const [selectedBond, setSelectedBond] = useState<SavedBond | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedBonds = localStorage.getItem("savedBonds");
    if (storedBonds) {
      try {
        const bonds: SavedBond[] = JSON.parse(storedBonds);
        setSavedBonds(bonds);
        if (bonds.length > 0) {
          // If no bond is selected, or selected one is not in the list, select the first one.
          const currentSelectedExists = bonds.some(b => b.id === selectedBond?.id);
          if (!currentSelectedExists) {
             setSelectedBond(bonds[0]);
          }
        } else {
            setSelectedBond(null);
        }
      } catch (error) {
        console.error("Failed to parse bonds from localStorage", error);
        localStorage.removeItem("savedBonds");
      }
    }
  }, []);

  const handleSelectBond = (bondId: string) => {
    const bond = savedBonds.find((b) => b.id === bondId);
    if (bond) {
      setSelectedBond(bond);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("savedBonds");
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
            <Button asChild>
                <Link href="/dashboard/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Generar Bono
                </Link>
            </Button>
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
                <Button size="lg" asChild>
                    <Link href="/dashboard/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Generar Bono
                    </Link>
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
