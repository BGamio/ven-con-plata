import { Landmark } from "lucide-react";

export function AppHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Landmark className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">
        Calculadora de Bonos
      </h1>
    </div>
  );
}
