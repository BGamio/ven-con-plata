export interface BondFormValues {
  faceValue: number;
  couponRate: number;
  maturityDate: Date;
  paymentFrequency: "annually" | "semi-annually" | "quarterly" | "monthly";
  gracePeriodType: "none" | "partial" | "total";
  gracePeriodDuration: number;
}

export interface AmortizationPeriod {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface AmortizationResult {
  schedule: AmortizationPeriod[];
  summary: {
    totalInterest: number;
    totalPrincipal: number;
    totalPayment: number;
  };
}
