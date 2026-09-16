import React from 'react';
import { CreditCard, CheckCircle2, Building, FileCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { WebsiteSettings, PageView, Vehicle } from '../types';
import { LoanCalculator } from '../components/LoanCalculator';

interface FinancingPageProps {
  settings: WebsiteSettings;
  vehicles: Vehicle[];
  onNavigate: (page: PageView) => void;
  onOpenEnquiryModal: (defaultSubject?: string, defaultMessage?: string) => void;
}

export const FinancingPage: React.FC<FinancingPageProps> = ({
  settings,
  vehicles,
  onNavigate,
  onOpenEnquiryModal
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Flexible Asset Financing In Nairobi</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Car Loan & Asset Financing Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Drive home your dream car from Netwon Cars Kangundo Road with up to 80% financing from Kenya’s leading commercial banks and SACCOs.
        </p>
      </div>

      {/* Interactive Loan Calculator */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Repayment Estimator
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Calculate Your Estimated Monthly Repayments
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Adjust the sliders below to simulate your deposit, tenure, and monthly installment.
          </p>
        </div>

        <LoanCalculator
          initialPrice={2800000}
          settings={settings}
          onEnquire={(monthly, deposit, months) => {
            onOpenEnquiryModal(
              'Financing Assistance Application',
              `I would like assistance applying for vehicle financing: Est. Monthly Payment: ${monthly}, Deposit: ${deposit}, Loan Tenure: ${months} months.`
            );
          }}
        />
      </section>

      {/* Partner Banks Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Accredited Institutions
          </span>
          <h3 className="text-2xl font-bold text-white">Kenyan Banking & SACCO Partners</h3>
          <p className="text-xs text-slate-400 mt-1">
            We work directly with asset financing officers to expedite your proforma invoices and inspection reports.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {settings.financingInfo?.partnerBanks.map((bank, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[90px] shadow-sm hover:border-amber-500/30 transition-colors"
            >
              <Building className="w-5 h-5 text-amber-400 mb-2" />
              <span className="text-xs font-bold text-slate-200">{bank}</span>
              <span className="text-[10px] text-emerald-400 mt-0.5">Asset Finance</span>
            </div>
          ))}
        </div>
      </div>

      {/* Financing Requirements: Salaried vs Business */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Salaried Individuals */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">For Employed Individuals</h3>
              <p className="text-xs text-slate-400">Standard bank requirement documents</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Original & Copy of National ID / Passport</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>KRA PIN Certificate</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Latest 3 months certified payslips</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Latest 6 months certified bank statements</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Letter of introduction / employment from employer</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Proforma Invoice issued by Netwon Cars Kangundo Road</span>
            </div>
          </div>
        </div>

        {/* Self-Employed / Businesses */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">For Business Owners & Companies</h3>
              <p className="text-xs text-slate-400">Commercial asset financing requirements</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Certificate of Registration / Incorporation & CR12</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Company & Directors’ KRA PIN Certificates</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Latest 12 months certified business bank statements</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Audited financial records (for large fleet purchases)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Directors’ National ID copies</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Vehicle Proforma Invoice & Valuation from Netwon Cars</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Ready to get pre-approved?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Contact our finance desk. We will generate your official Proforma Invoice today and connect you directly with bank relationship managers.
        </p>
        <button
          onClick={() =>
            onOpenEnquiryModal(
              'Financing Pre-Approval Application',
              'Hello Netwon Cars finance team, I would like guidance on pre-approval for a vehicle.'
            )
          }
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all"
        >
          <span>Request Financing Pre-Approval</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
