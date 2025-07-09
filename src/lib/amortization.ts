import type { AmortizationResult, BondFormValues, AmortizationPeriod, SavedBond, InvestorMetrics } from "./types";

function calculateNPV(rate: number, values: number[]): number {
  if (rate <= -1) {
    rate = -0.99999999; // Avoid division by zero or negative powers
  }
  return values.reduce((acc, val, i) => acc + val / Math.pow(1 + rate, i), 0);
}

function calculateIRR(
  values: number[],
  guess = 0.1,
  maxIter = 100,
  tolerance = 1e-7
): number {
  let rate = guess;

  for (let i = 0; i < maxIter; i++) {
    const npv = calculateNPV(rate, values);
    if (Math.abs(npv) < tolerance) {
      return rate;
    }

    const derivative = values.reduce(
      (acc, val, j) => (j > 0 ? acc - (j * val) / Math.pow(1 + rate, j + 1) : acc),
      0
    );
    if (Math.abs(derivative) < 1e-7) {
      break; 
    }
    rate = rate - npv / derivative;
  }
  return NaN; // Failed to converge
}

const periodsPerYearMap = {
    monthly: 12,
    bimonthly: 6,
    quarterly: 4,
    quadrimester: 3,
    "semi-annually": 2,
    annually: 1,
};

export function calculateAmortization(
  data: BondFormValues
): AmortizationResult {
  const {
    faceValue,
    marketValue,
    couponRate,
    costOfCapital,
    issuerInitialCosts,
    redemptionPremium,
    paymentFrequency,
    termInYears,
    totalGracePeriods,
    partialGracePeriods,
    currency,
  } = data;

  const periodsPerYear = periodsPerYearMap[paymentFrequency];
  const totalPeriods = termInYears * periodsPerYear;

  if (totalPeriods <= 0) {
    return {
      schedule: [],
      summary: {
        npv: 0,
        irr: "N/A",
        tcea: "N/A",
        convexity: "N/A",
        totalInterest: 0,
        totalPrincipal: 0,
        totalPayment: 0,
        currency,
      },
    };
  }

  const periodicCouponRate = (couponRate / 100) / periodsPerYear;
  const periodicCOK = (costOfCapital / 100) / periodsPerYear;

  const issuerInitialCashFlow = marketValue * (1 - issuerInitialCosts / 100);
  const issuerCashFlows: number[] = [issuerInitialCashFlow];
  const schedule: AmortizationPeriod[] = [];

  let balance = faceValue;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalPayment = 0;

  const graceDuration = Math.min(totalGracePeriods + partialGracePeriods, totalPeriods);

  // Grace Periods
  for (let i = 1; i <= graceDuration; i++) {
    const initialBalance = balance;
    const interest = initialBalance * periodicCouponRate;
    let payment = 0;
    let principal = 0;
    let issuerCf = 0;

    if (i <= totalGracePeriods) { // Total grace period
      balance += interest;
    } else { // Partial grace period
      payment = interest;
      issuerCf = -payment;
    }
    
    schedule.push({
      period: i,
      initialBalance,
      interest,
      principal,
      payment,
      finalBalance: balance,
      issuerCashFlow: issuerCf,
    });
    issuerCashFlows.push(issuerCf);
    totalInterest += interest;
    totalPayment += payment;
  }

  // Regular Periods
  const remainingPeriods = totalPeriods - graceDuration;
  if (remainingPeriods > 0) {
    const installment =
      periodicCouponRate > 0
        ? (balance * (periodicCouponRate * Math.pow(1 + periodicCouponRate, remainingPeriods))) /
          (Math.pow(1 + periodicCouponRate, remainingPeriods) - 1)
        : balance / remainingPeriods;

    for (let i = 1; i <= remainingPeriods; i++) {
      const initialBalance = balance;
      const interest = initialBalance * periodicCouponRate;
      let principal;
      let payment;

      if (i === remainingPeriods) {
        // For the last period, the principal is the entire remaining balance.
        principal = initialBalance;
        // The payment is what's needed to cover the last principal and interest.
        payment = principal + interest;
      } else {
        payment = installment;
        principal = payment - interest;
      }
      
      balance -= principal;

      let issuerCf = -payment;
      
      schedule.push({
        period: graceDuration + i,
        initialBalance,
        interest,
        principal,
        payment,
        finalBalance: balance < 0.005 ? 0 : balance,
        issuerCashFlow: issuerCf,
      });
      issuerCashFlows.push(issuerCf);

      totalInterest += interest;
      totalPrincipal += principal;
      totalPayment += payment;
    }
  }

  // Redemption Premium at maturity
  if (totalPeriods > 0 && issuerCashFlows.length > 1) {
      const premiumAmount = faceValue * (redemptionPremium / 100);
      issuerCashFlows[issuerCashFlows.length -1] -= premiumAmount;
      schedule[schedule.length - 1].issuerCashFlow -= premiumAmount;
  }

  const periodicIRR = calculateIRR(issuerCashFlows);
  const npv = calculateNPV(periodicCOK, issuerCashFlows);
  
  const irr = isNaN(periodicIRR) ? "N/A" : (periodicIRR * periodsPerYear).toString();
  const tcea = isNaN(periodicIRR) ? "N/A" : (Math.pow(1 + periodicIRR, periodsPerYear) - 1).toString();

  let convexity: number | "N/A" = "N/A";
  if (!isNaN(periodicIRR)) {
    const convexitySum = issuerCashFlows
      .slice(1) // Exclude initial investment at t=0
      .reduce((acc, cf, index) => {
        const t = index + 1;
        const discountedCf = (-cf) / Math.pow(1 + periodicIRR, t);
        return acc + discountedCf * (t * t + t);
      }, 0);
    
    if (issuerInitialCashFlow > 0 && Math.pow(1 + periodicIRR, 2) > 0) {
        const convexityResult = convexitySum / (issuerInitialCashFlow * Math.pow(1 + periodicIRR, 2));
        const annualizedConvexity = convexityResult / Math.pow(periodsPerYear, 2);
        convexity = annualizedConvexity;
    }
  }

  return {
    schedule,
    summary: { npv, irr, tcea, convexity, totalInterest, totalPrincipal, totalPayment, currency },
  };
}


export function calculateInvestorMetrics(bond: SavedBond): InvestorMetrics {
  const { formValues, result } = bond;
  const { marketValue, costOfCapital, paymentFrequency } = formValues;

  const investorCashFlows = [
    -marketValue,
    ...result.schedule.map(p => -p.issuerCashFlow)
  ];

  const periodsPerYear = periodsPerYearMap[paymentFrequency];
  const periodicCOK = (costOfCapital / 100) / periodsPerYear;

  const periodicIRR = calculateIRR(investorCashFlows);
  const npv = calculateNPV(periodicCOK, investorCashFlows);

  const irr = isNaN(periodicIRR) ? "N/A" : (periodicIRR * periodsPerYear).toString();
  const trea = isNaN(periodicIRR) ? "N/A" : (Math.pow(1 + periodicIRR, periodsPerYear) - 1).toString();

  return { npv, irr, trea };
}
