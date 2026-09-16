import React, { useState } from 'react';
import { Repeat, CheckCircle, AlertCircle, Loader2, DollarSign, Car, Phone, User, FileText, ArrowRight } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { submitTradeIn } from '../lib/api';

interface TradeInPageProps {
  settings: WebsiteSettings;
}

export const TradeInPage: React.FC<TradeInPageProps> = ({ settings }) => {
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [year, setYear] = useState<number>(2015);
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('Good Condition');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [intendedAction, setIntendedAction] = useState<'trade-in' | 'sell-direct'>('trade-in');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!vehicleMake.trim() || !vehicleModel.trim() || !customerName.trim() || !customerPhone.trim()) {
      setError('Please fill in your car details and contact information.');
      return;
    }

    setLoading(true);
    try {
      await submitTradeIn({
        customerName,
        customerPhone,
        customerEmail,
        vehicleMake,
        vehicleModel,
        year,
        mileage: Number(mileage) || 0,
        condition,
        expectedPrice: expectedPrice ? Number(expectedPrice) : undefined,
        registrationNumber,
        notes: `Action: ${intendedAction.toUpperCase()}. Notes: ${notes}`
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit trade-in details');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setVehicleMake('');
    setVehicleModel('');
    setMileage('');
    setExpectedPrice('');
    setRegistrationNumber('');
    setNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Repeat className="w-3.5 h-3.5" />
          <span>Quick Car Valuation & Cash Offer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Sell or Trade-In Your Car in Nairobi
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upgrade your car seamlessly or sell it directly for fast, secure payment at Netwon Cars Kangundo Road.
        </p>
      </div>

      {/* 3 Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-4">
            1
          </div>
          <h3 className="text-base font-bold text-white mb-2">Submit Vehicle Details</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fill the form below with your current vehicle's make, model, registration, and expected asking price.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-4">
            2
          </div>
          <h3 className="text-base font-bold text-white mb-2">Free Inspection at Yard</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bring your car to our yard along Kangundo Road for a quick 20-minute physical and mechanical check.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-4">
            3
          </div>
          <h3 className="text-base font-bold text-white mb-2">Instant Cash or Upgrade</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Accept our competitive offer for direct cash payout or use the vehicle valuation towards any car in our stock.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 max-w-3xl mx-auto shadow-2xl">
        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Trade-In Submitted!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-amber-400">{customerName}</strong>. Our valuation manager will review your <strong className="text-white">{vehicleMake} {vehicleModel}</strong> details and call you on <strong className="text-white">{customerPhone}</strong> within 2 hours.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors mt-4"
            >
              Submit Another Vehicle
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                Step 1: Your Preference
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Tell Us About Your Car</h3>
            </div>

            {error && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Intended Action */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIntendedAction('trade-in')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2.5 ${
                  intendedAction === 'trade-in'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Repeat className="w-4 h-4 shrink-0" />
                <span>Trade-In for Another Car</span>
              </button>

              <button
                type="button"
                onClick={() => setIntendedAction('sell-direct')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2.5 ${
                  intendedAction === 'sell-direct'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <DollarSign className="w-4 h-4 shrink-0" />
                <span>Sell Outright for Cash</span>
              </button>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>Vehicle Information</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota, Mazda, Subaru"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fielder, Axela, Forester"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Year of Manufacture</label>
                  <input
                    type="number"
                    min="2000"
                    max="2025"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Mileage (km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 85000"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reg Number (e.g. KDF)</label>
                  <input
                    type="text"
                    placeholder="e.g. KDC 123A"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Overall Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option>Excellent (Flawless paint & engine)</option>
                    <option>Good Condition (Clean, minor wear)</option>
                    <option>Fair (Requires minor body/service)</option>
                    <option>Mechanically Sound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Asking Price (KSh)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500000"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Your Contact Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kelvin Kimani"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Call/M-Pesa) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0722 000000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="kelvin@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Notes / Recent Service History</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Recently serviced at 80k km, brand new tyres, valid insurance..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <button
              id="btn-submit-tradein-form"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Valuation Request...</span>
                </>
              ) : (
                <>
                  <span>Request Valuation & Cash Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
