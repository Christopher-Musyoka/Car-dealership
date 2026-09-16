import React, { useState } from 'react';
import { Calendar, Clock, Car, Phone, Mail, User, CheckCircle, AlertCircle, Loader2, MapPin, ShieldCheck } from 'lucide-react';
import { Vehicle, WebsiteSettings } from '../types';
import { submitAppointment } from '../lib/api';

interface BookingPageProps {
  vehicles: Vehicle[];
  settings: WebsiteSettings;
}

export const BookingPage: React.FC<BookingPageProps> = ({ vehicles, settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedVehicleName = vehicles.find((v) => v.id === vehicleId)?.name || 'General Showroom Yard Inspection';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !preferredDate) {
      setError('Please provide your name, phone number, and preferred date.');
      return;
    }

    setLoading(true);
    try {
      await submitAppointment({
        name,
        phone,
        email,
        vehicleId: vehicleId || undefined,
        vehicleName: selectedVehicleName,
        preferredDate,
        preferredTime,
        message
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to book viewing');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setPreferredDate('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Accompanied Test Drives & Physical Inspection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Book a Viewing Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Schedule your personal inspection at Netwon Cars Kangundo Road. Take any vehicle for a road test and bring your trusted mechanic along.
        </p>
      </div>

      {/* Grid: Benefits + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Col: Why Book with Netwon Cars (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-white">Why Book in Advance?</h3>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Dedicated Senior Sales Host</strong>
                <span className="text-slate-400 text-xs">
                  We assign an experienced staff member to answer all questions regarding registration, condition, and maintenance history.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Vehicle Prep & Key Handover</strong>
                <span className="text-slate-400 text-xs">
                  Your selected vehicle is staged, batteries checked, and fueled for an instant test drive.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Showroom Yard Address</strong>
                <span className="text-slate-400 text-xs">
                  PVHX+6MQ, Kangundo Road, Nairobi, Kenya. Ample secure parking for your private vehicle.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-200 block mb-1">Dealership Working Hours:</span>
            <p>{settings.openingHours.weekdays}</p>
            <p>{settings.openingHours.saturday}</p>
            <p className="text-amber-400 mt-1">{settings.openingHours.sunday}</p>
          </div>
        </div>

        {/* Right Col: Booking Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Appointment Scheduled!</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-amber-400">{name}</strong>. We look forward to hosting you on <strong className="text-white">{preferredDate}</strong> at <strong className="text-white">{preferredTime}</strong> for <strong className="text-white">{selectedVehicleName}</strong>.
              </p>
              <p className="text-xs text-slate-400">
                Our sales representative will call your number <strong className="text-white">{phone}</strong> shortly to confirm gate entry and directions.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors mt-4"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Select Date & Vehicle</h3>
                <p className="text-xs text-slate-400 mt-0.5">Please provide your preferred viewing details.</p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vehicle of Interest</span>
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="">General Yard Visit (Explore Full Inventory)</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.condition})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victor Mutinda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0722 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email (Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="victor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferred Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferred Time Slot *</span>
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option>09:00 AM - Morning</option>
                    <option>10:30 AM - Morning</option>
                    <option>12:00 PM - Midday</option>
                    <option>02:00 PM - Afternoon</option>
                    <option>04:00 PM - Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Special Notes (e.g. Coming with a mechanic or trade-in car?)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us any specific requirements or checks you wish to perform..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                id="btn-submit-booking-page"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking Your Viewing...</span>
                  </>
                ) : (
                  <span>Confirm Viewing Appointment</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
