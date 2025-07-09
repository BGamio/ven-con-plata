import { Landmark } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Landmark className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Calculadora de Bonos
          </h1>
        </div>
      </div>
    </header>
  );
}
