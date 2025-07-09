"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SavedBond } from "@/lib/types";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { LogOut, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { add } from "date-fns";

export default function DashboardInvestorPage() {
  const [savedBonds, setSavedBonds] = useState<SavedBond[]>([]);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (!session || (session && JSON.parse(session).role !== "inversor")) {
      router.push("/");
      return;
    }

    const storedBonds = localStorage.getItem("savedBonds");
    if (storedBonds) {
      setSavedBonds(JSON.parse(storedBonds));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("session");
    router.push("/");
  };
  
  const frequencyMap = {
    annually: "Anual",
    "semi-annually": "Semestral",
    quadrimester: "Cuatrimestral",
    quarterly: "Trimestral",
    bimonthly: "Bimestral",
    monthly: "Mensual",
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'PEN' ? 'es-PE' : 'en-US', { style: 'currency', currency }).format(value);
  }

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
          <h2 className="text-3xl font-bold">Bonos Disponibles (Inversionista)</h2>
        </div>

        {savedBonds.length === 0 ? (
          <Card className="text-center py-20">
            <CardHeader>
              <CardTitle className="text-2xl">No hay bonos para invertir</CardTitle>
              <CardDescription>
                Actualmente no hay bonos registrados por emisores. Vuelva a intentarlo más tarde.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nombre del Bono</TableHead>
                    <TableHead className="text-right">Valor Nominal</TableHead>
                    <TableHead className="text-right">Tasa Cupón</TableHead>
                    <TableHead className="text-right">Tasa COK</TableHead>
                    <TableHead>Fecha Emisión</TableHead>
                    <TableHead>Fecha Vencimiento</TableHead>
                    <TableHead>Frecuencia Pago</TableHead>
                    <TableHead className="text-center">Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {savedBonds.map((bond) => {
                        const startDate = new Date(bond.formValues.startDate);
                        const maturityDate = add(startDate, { years: bond.formValues.termInYears });
                        return (
                            <TableRow key={bond.id}>
                                <TableCell className="font-medium">{bond.formValues.companyName}</TableCell>
                                <TableCell className="text-right">{formatCurrency(bond.formValues.faceValue, bond.formValues.currency)}</TableCell>
                                <TableCell className="text-right">{bond.formValues.couponRate.toFixed(2)}%</TableCell>
                                <TableCell className="text-right">{bond.formValues.costOfCapital.toFixed(2)}%</TableCell>
                                <TableCell>{startDate.toLocaleDateString()}</TableCell>
                                <TableCell>{maturityDate.toLocaleDateString()}</TableCell>
                                <TableCell>{frequencyMap[bond.formValues.paymentFrequency]}</TableCell>
                                <TableCell className="text-center">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/dashboard-investor/${bond.id}`}>
                                            <Eye className="mr-2 h-4 w-4" /> Ver Detalle
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                </Table>
            </CardContent>
          </Card>
        )}
      </main>
      <footer className="py-4">
        <p className="text-center text-sm text-muted-foreground">
            Análisis de bonos para inversionistas informados.
        </p>
      </footer>
    </div>
  );
}
