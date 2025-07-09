import { AppHeader } from "@/components/app-header";
import { BondCalculator } from "@/components/bond-calculator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <BondCalculator />
      </main>
      <footer className="py-4">
        <p className="text-center text-sm text-muted-foreground">
          Creado para la claridad financiera.
        </p>
      </footer>
    </div>
  );
}
