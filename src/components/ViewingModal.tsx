import React, { useState } from 'react';
import { X, Calendar, Clock, Car, Phone, Mail, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Vehicle } from '../types';
import { submitAppointment } from '../lib/api';

interface ViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle | null;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  selectedVehicle
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleId, setVehicleId] = useState(selectedVehicle?.id || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentVehicleName =
    vehicles.find(v => v.id === vehicleId)?.name ||
    selectedVehicle?.name ||
    'General Yard Viewing';

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
        vehicleName: currentVehicleName,
        preferredDate,
        preferredTime,
        message
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to book viewing appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setError(null);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="btn-close-viewing-modal"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Viewing Booked!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-amber-400">{name}</strong>. We have received your viewing appointment for{' '}
              <strong className="text-white">{currentVehicleName}</strong> on <strong className="text-white">{preferredDate}</strong> at <strong className="text-white">{preferredTime}</strong>.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 text-left space-y-1">
              <p className="font-semibold text-slate-300">📍 Location:</p>
              <p>PVHX+6MQ, Kangundo Road, Nairobi, Kenya</p>
              <p className="text-amber-400 mt-1">Our sales manager will call you shortly on {phone} to confirm directions.</p>
            </div>
            <button
              id="btn-viewing-success-done"
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="pr-8">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                Netwon Cars Kangundo Road
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Book a Vehicle Viewing
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Schedule an accompanied physical inspection and test drive at our Kangundo Road yard.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Vehicle Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>Vehicle to View</span>
              </label>
              <select
                id="viewing-vehicle-select"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">General Yard Visit (Browse All Available Cars)</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.condition})
                  </option>
                ))}
              </select>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  id="viewing-name-input"
                  type="text"
                  required
                  placeholder="e.g. Brian Ouma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number (M-Pesa/Call) *</span>
                </label>
                <input
                  id="viewing-phone-input"
                  type="tel"
                  required
                  placeholder="e.g. 0712 345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address (Optional)</span>
              </label>
              <input
                id="viewing-email-input"
                type="email"
                placeholder="brian@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Preferred Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Date *</span>
                </label>
                <input
                  id="viewing-date-input"
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
                  <span>Preferred Time *</span>
                </label>
                <select
                  id="viewing-time-select"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option>09:00 AM - Morning</option>
                  <option>10:30 AM - Morning</option>
                  <option>12:00 PM - Midday</option>
                  <option>02:00 PM - Afternoon</option>
                  <option>04:00 PM - Late Afternoon</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Special Request / Coming with Mechanic?
              </label>
              <textarea
                id="viewing-message-input"
                rows={2}
                placeholder="e.g. Coming with my mechanic for diagnostic test drive..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              id="btn-submit-viewing-appointment"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Appointment...</span>
                </>
              ) : (
                <span>Confirm Viewing Appointment</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
