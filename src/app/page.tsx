"use client";

import { useState } from "react";
import { BondFormValues, SavedBond } from "@/lib/types";
import { calculateAmortization } from "@/lib/amortization";
import { AppHeader } from "@/components/app-header";
import { BondForm } from "@/components/bond-form";
import { BondCalculator } from "@/components/bond-calculator";
import { SavedBondsList } from "@/components/saved-bonds-list";

export default function Home() {
  const [savedBonds, setSavedBonds] = useState<SavedBond[]>([]);
  const [selectedBond, setSelectedBond] = useState<SavedBond | null>(null);

  const handleCalculate = (data: BondFormValues) => {
    const calculationResult = calculateAmortization(data);
    const newBond: SavedBond = {
      id: `bond_${new Date().getTime()}`,
      formValues: data,
      result: calculationResult,
    };

    setSavedBonds((prevBonds) => [newBond, ...prevBonds]);
    setSelectedBond(newBond);
  };

  const handleSelectBond = (bondId: string) => {
    const bond = savedBonds.find((b) => b.id === bondId);
    if (bond) {
      setSelectedBond(bond);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <BondForm onCalculate={handleCalculate} />
            {savedBonds.length > 0 && (
              <SavedBondsList
                bonds={savedBonds}
                onSelectBond={handleSelectBond}
                selectedBondId={selectedBond?.id || null}
              />
            )}
          </div>
          <BondCalculator bond={selectedBond} />
        </div>
      </main>
      <footer className="py-4">
        <p className="text-center text-sm text-muted-foreground">
          Creado para la claridad financiera.
        </p>
      </footer>
    </div>
  );
}
