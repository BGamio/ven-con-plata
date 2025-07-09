import { differenceInMonths, differenceInQuarters, differenceInYears } from "date-fns";
import type { AmortizationResult, BondFormValues } from "./types";

function getPeriods(
  startDate: Date,
  endDate: Date,
  frequency: BondFormValues["paymentFrequency"]
): { periodsPerYear: number; totalPeriods: number } {
  switch (frequency) {
    case "annually":
      return { periodsPerYear: 1, totalPeriods: differenceInYears(endDate, startDate) };
    case "semi-annually":
      return { periodsPerYear: 2, totalPeriods: differenceInYears(endDate, startDate) * 2 };
    case "quarterly":
      return { periodsPerYear: 4, totalPeriods: differenceInQuarters(endDate, startDate) };
    case "monthly":
      return { periodsPerYear: 12, totalPeriods: differenceInMonths(endDate, startDate) };
  }
}

export function calculateFrenchAmortization(
  data: BondFormValues
): AmortizationResult {
  const startDate = new Date();
  const { periodsPerYear, totalPeriods } = getPeriods(
    startDate,
    data.maturityDate,
    data.paymentFrequency
  );

  if (totalPeriods <= 0) {
    return { schedule: [], summary: { totalInterest: 0, totalPrincipal: 0, totalPayment: 0 } };
  }

  const periodicRate = (data.couponRate / 100) / periodsPerYear;
  let balance = data.faceValue;

  const schedule: AmortizationResult["schedule"] = [];
  let totalInterest = 0;
  let totalPrincipal = 0;

  const graceDuration = Math.min(data.gracePeriodDuration, totalPeriods);

  // Grace Period
  for (let i = 1; i <= graceDuration; i++) {
    const interest = balance * periodicRate;
    if (data.gracePeriodType === "partial") {
      schedule.push({
        period: i,
        payment: interest,
        interest: interest,
        principal: 0,
        balance: balance,
      });
      totalInterest += interest;
    } else if (data.gracePeriodType === "total") {
      balance += interest;
      schedule.push({
        period: i,
        payment: 0,
        interest: interest,
        principal: 0,
        balance: balance,
      });
      totalInterest += interest;
    }
  }

  // Post-Grace Period
  const remainingPeriods = totalPeriods - graceDuration;
  if (remainingPeriods > 0) {
    const installment =
      periodicRate > 0
        ? (balance * (periodicRate * Math.pow(1 + periodicRate, remainingPeriods))) /
          (Math.pow(1 + periodicRate, remainingPeriods) - 1)
        : balance / remainingPeriods;

    for (let i = 1; i <= remainingPeriods; i++) {
      const interest = balance * periodicRate;
      let principal = installment - interest;
      let currentPayment = installment;

      // Adjust last payment to clear balance
      if (i === remainingPeriods) {
        principal = balance;
        currentPayment = principal + interest;
      }

      balance -= principal;

      schedule.push({
        period: graceDuration + i,
        payment: currentPayment,
        interest: interest,
        principal: principal,
        balance: balance < 0.005 ? 0 : balance, // Prevent small negative balances
      });

      totalInterest += interest;
      totalPrincipal += principal;
    }
  }

  const totalPayment = totalInterest + totalPrincipal;

  return {
    schedule,
    summary: { totalInterest, totalPrincipal, totalPayment },
  };
}
