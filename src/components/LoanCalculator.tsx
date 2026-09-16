import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { formatKSh, calculateMonthlyPayment } from '../lib/utils';
import { WebsiteSettings } from '../types';

interface LoanCalculatorProps {
  initialPrice?: number;
  settings: WebsiteSettings;
  onEnquire?: (estimatedPayment: string, deposit: string, duration: number) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  initialPrice = 3000000,
  settings,
  onEnquire
}) => {
  const [price, setPrice] = useState<number>(initialPrice);
  const [depositPercent, setDepositPercent] = useState<number>(
    settings.financingInfo?.minimumDepositPercent || 20
  );
  const [durationMonths, setDurationMonths] = useState<number>(36);
  const [interestRate, setInterestRate] = useState<number>(
    settings.financingInfo?.standardInterestRatePercent || 13
  );

  useEffect(() => {
    if (initialPrice && initialPrice > 0) {
      setPrice(initialPrice);
    }
  }, [initialPrice]);

  const { depositAmount, loanAmount, monthlyPayment, totalInterest } = calculateMonthlyPayment(
    price,
    depositPercent,
    durationMonths,
    interestRate
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Vehicle Financing & Monthly Payment Calculator
          </h3>
          <p className="text-xs text-slate-400">
            Estimate your monthly repayment through Kenyan commercial banks and asset financiers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Vehicle Price */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Vehicle Price (KSh)</span>
              <span className="text-amber-400 font-mono text-sm">{formatKSh(price)}</span>
            </div>
            <input
              id="calc-price-input"
              type="range"
              min="800000"
              max="15000000"
              step="50000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>KSh 800,000</span>
              <span>KSh 15,000,000</span>
            </div>
          </div>

          {/* Deposit Percent */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Initial Deposit ({depositPercent}%)</span>
              <span className="text-emerald-400 font-mono text-sm">{formatKSh(depositAmount)}</span>
            </div>
            <input
              id="calc-deposit-input"
              type="range"
              min="10"
              max="60"
              step="5"
              value={depositPercent}
              onChange={(e) => setDepositPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>10% (Min)</span>
              <span>30%</span>
              <span>60%</span>
            </div>
          </div>

          {/* Loan Duration in Months */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Loan Duration</span>
              <span className="text-amber-400 font-bold text-sm">
                {durationMonths} Months ({Math.round(durationMonths / 12)} {durationMonths / 12 === 1 ? 'Year' : 'Years'})
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[12, 24, 36, 48].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDurationMonths(m)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    durationMonths === m
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {m} Mos
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Estimated Annual Bank Interest Rate</span>
              <span className="text-slate-200 font-mono text-sm">{interestRate}% p.a.</span>
            </div>
            <input
              id="calc-rate-input"
              type="range"
              min="10"
              max="18"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>10%</span>
              <span>Standard (13%)</span>
              <span>18%</span>
            </div>
          </div>
        </div>

        {/* Results Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950/90 border border-amber-500/30 rounded-xl p-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Estimated Repayment
          </span>

          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight block">
              {formatKSh(monthlyPayment)}
            </span>
            <span className="text-xs text-slate-400">per month for {durationMonths} months</span>
          </div>

          <div className="space-y-2.5 py-4 my-4 border-y border-slate-800 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Vehicle Price:</span>
              <span className="font-semibold text-white">{formatKSh(price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Upfront Deposit ({depositPercent}%):</span>
              <span className="font-semibold text-emerald-400">{formatKSh(depositAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bank Loan Amount:</span>
              <span className="font-semibold text-white">{formatKSh(loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Est. Total Interest:</span>
              <span className="font-semibold text-slate-400">{formatKSh(totalInterest)}</span>
            </div>
          </div>

          {onEnquire && (
            <button
              id="btn-calc-enquire"
              type="button"
              onClick={() => onEnquire(formatKSh(monthlyPayment), formatKSh(depositAmount), durationMonths)}
              className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mb-3"
            >
              <span>Apply for Financing Guidance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Partner banks badges */}
          <div className="text-[11px] text-slate-500">
            <div className="flex items-center gap-1 text-slate-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Financing support with leading Kenyan banks:</span>
            </div>
            <p className="leading-snug text-slate-400">
              Co-op, KCB, NCBA, Stanbic, Equity & Family Bank.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 pt-3 border-t border-slate-900 flex items-start gap-1.5 text-[10px] text-slate-500 leading-tight">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <p>{settings.financingInfo?.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
