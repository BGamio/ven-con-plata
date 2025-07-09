export interface BondFormValues {
  companyName: string;
  costOfCapital: number;
  marketValue: number;
  faceValue: number;
  startDate: Date;
  termInYears: number;
  couponRate: number;
  issuerInitialCosts: number;
  redemptionPremium: number;
  paymentFrequency:
    | "annually"
    | "semi-annually"
    | "quadrimester"
    | "quarterly"
    | "bimonthly"
    | "monthly";
  totalGracePeriods: number;
  partialGracePeriods: number;
  currency: "USD" | "PEN" | "EUR";
}

export interface AmortizationPeriod {
  period: number;
  initialBalance: number;
  interest: number;
  principal: number;
  payment: number; // cuota
  finalBalance: number;
  issuerCashFlow: number;
}

export interface AmortizationResult {
  schedule: AmortizationPeriod[];
  summary: {
    npv: number;
    irr: string;
    tcea: string;
    convexity: number | "N/A";
    totalPayment: number;
    totalInterest: number;
    totalPrincipal: number;
    currency: "USD" | "PEN" | "EUR";
  };
}

export interface SavedBond {
  id: string;
  formValues: BondFormValues;
  result: AmortizationResult;
}
