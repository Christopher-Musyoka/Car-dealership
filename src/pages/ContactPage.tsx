import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Star, Send, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { buildTelUrl, buildWhatsAppUrl } from '../lib/utils';
import { submitEnquiry } from '../lib/api';

interface ContactPageProps {
  settings: WebsiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Dealership Enquiry');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        message
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
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
  };

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber || settings.phone,
    'Hello Netwon Cars Kangundo Road, I would like to enquire about visiting your yard.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Kangundo Road, Nairobi</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact Netwon Cars
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We are ready to assist you with vehicle viewings, pricing discussions, financing pre-approval, and trade-in valuations.
        </p>
      </div>

      {/* Grid: Dealership Information + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Cards & Location (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-white">Dealership Contacts</h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              {/* Phone */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block font-medium">Telephone Hotline</span>
                  <a
                    id="contact-page-phone-link"
                    href={buildTelUrl(settings.phone)}
                    className="font-bold text-white hover:text-amber-400 text-base transition-colors"
                  >
                    {settings.phone}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Direct line to yard sales manager</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block font-medium">WhatsApp Support</span>
                  <a
                    id="contact-page-whatsapp-link"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-400 hover:text-emerald-300 text-base transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{settings.phone}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instant vehicle videos & location pins</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block font-medium">Official Email</span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="font-bold text-white hover:text-amber-400 text-sm transition-colors"
                  >
                    {settings.email}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Official proforma invoices & quotes</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block font-medium">Physical Dealership Yard</span>
                  <p className="font-bold text-white">{settings.address}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{settings.landmark}</p>
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline text-xs inline-flex items-center gap-1 mt-1 font-semibold"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[11px] block font-medium">Business Working Hours</span>
                  <p className="text-slate-200 text-xs">{settings.openingHours.weekdays}</p>
                  <p className="text-slate-300 text-xs">{settings.openingHours.saturday}</p>
                  <p className="text-amber-400 text-xs">{settings.openingHours.sunday}</p>
                </div>
              </div>

              {/* Google Business Rating */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Google Maps Business Rating</span>
                  <span className="text-[11px] text-slate-400">Verified Kenyan Dealership</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white text-sm">{settings.googleRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Message Sent Successfully!</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for contacting <strong className="text-white">Netwon Cars Kangundo Road</strong>. A member of our staff will call or reply to you on <strong className="text-amber-400">{phone}</strong> shortly.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                  Leave a Message
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Send an Online Enquiry
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Have a question regarding inventory, import delivery dates, or price negotiation? Write to us below.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grace Wambui"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0721 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="grace@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option>General Dealership Enquiry</option>
                  <option>Vehicle Price & Discount Negotiation</option>
                  <option>Car Asset Financing Inquiry</option>
                  <option>Vehicle Trade-In / Direct Sale</option>
                  <option>Japan / UK Import Sourcing</option>
                  <option>Logbook & Ownership Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe what you are looking for..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                id="btn-submit-contact-page"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Your Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Netwon Cars</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
