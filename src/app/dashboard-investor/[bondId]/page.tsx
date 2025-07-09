"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { SavedBond, InvestorMetrics } from "@/lib/types";
import { calculateInvestorMetrics } from "@/lib/amortization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AmortizationSchedule } from "@/components/amortization-schedule";
import { InvestorSummaryStats } from "@/components/investor-summary-stats";
import { ConvexityChart } from "@/components/convexity-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvestorBondDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bondId = params.bondId as string;

  const [bond, setBond] = useState<SavedBond | null>(null);
  const [metrics, setMetrics] = useState<InvestorMetrics | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (!session || (session && JSON.parse(session).role !== "inversor")) {
      router.push("/");
      return;
    }

    if (bondId) {
      const storedBonds = localStorage.getItem("savedBonds");
      if (storedBonds) {
        const bonds: SavedBond[] = JSON.parse(storedBonds);
        const foundBond = bonds.find((b) => b.id === bondId);
        if (foundBond) {
          setBond(foundBond);
          const investorMetrics = calculateInvestorMetrics(foundBond);
          setMetrics(investorMetrics);
        } else {
            router.push('/dashboard-investor'); // Bond not found
        }
      }
    }
  }, [bondId, router]);


  if (!bond || !metrics) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-32 w-full mb-8" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex items-center mb-6">
          <Button asChild variant="outline" size="icon" className="mr-4">
            <Link href="/dashboard-investor">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver a la lista</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            Análisis del Bono: {bond.formValues.companyName}
          </h1>
        </div>
        
        <div className="flex flex-col gap-8">
            <InvestorSummaryStats summary={metrics} currency={bond.formValues.currency} />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <AmortizationSchedule
                        schedule={bond.result.schedule}
                        currency={bond.formValues.currency}
                        viewAs="investor"
                    />
                </div>
                 <div className="lg:col-span-2">
                    <ConvexityChart bond={bond} />
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
