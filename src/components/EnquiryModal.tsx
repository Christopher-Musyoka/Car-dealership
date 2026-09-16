import React, { useState } from 'react';
import { X, Send, Phone, Mail, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Vehicle } from '../types';
import { submitEnquiry } from '../lib/api';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
  defaultSubject?: string;
  defaultMessage?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  defaultSubject = 'Vehicle Information Request',
  defaultMessage = ''
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(
    defaultMessage || (vehicle ? `Hi, I am interested in the ${vehicle.name}. Please share more details regarding availability, financing options, and discount.` : '')
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please provide your name, phone number, and message.');
      return;
    }

    setLoading(true);
    try {
      await submitEnquiry({
        name,
        phone,
        email,
        subject,
        message,
        vehicleId: vehicle?.id,
        vehicleName: vehicle?.name
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit enquiry');
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          id="btn-close-enquiry-modal"
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
            <h3 className="text-2xl font-bold text-white tracking-tight">Enquiry Sent!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-amber-400">{name}</strong>. Our dealership sales team has received your enquiry and will contact you via <strong className="text-white">{phone}</strong> shortly.
            </p>
            <button
              id="btn-enquiry-success-done"
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
                {vehicle ? vehicle.name : 'Netwon Cars Dealership'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Request More Information
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Inquire about price flexibility, vehicle inspection details, logbook status, or bank financing.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  id="enquiry-name-input"
                  type="text"
                  required
                  placeholder="e.g. Dennis Mwangi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number *</span>
                </label>
                <input
                  id="enquiry-phone-input"
                  type="tel"
                  required
                  placeholder="e.g. 0721 123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address (Optional)</span>
              </label>
              <input
                id="enquiry-email-input"
                type="email"
                placeholder="dennis@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subject
              </label>
              <input
                id="enquiry-subject-input"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Question or Requirement *
              </label>
              <textarea
                id="enquiry-message-input"
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              id="btn-submit-enquiry"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Enquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Enquiry to Netwon Cars</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
