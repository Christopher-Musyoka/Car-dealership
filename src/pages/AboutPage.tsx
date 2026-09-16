import React from 'react';
import { ShieldCheck, Award, MapPin, Star, Users, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { WebsiteSettings, PageView } from '../types';
import { buildTelUrl, buildWhatsAppUrl } from '../lib/utils';

interface AboutPageProps {
  settings: WebsiteSettings;
  onNavigate: (page: PageView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber || settings.phone,
    'Hello Netwon Cars Kangundo Road, I would like to learn more about your dealership.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Hero Banner */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-14 overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Nairobi Automotive Integrity</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            About Netwon Cars Kangundo Road
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {settings.aboutStory ||
              'Located along Kangundo Road in Nairobi, Netwon Cars is established with a mission to deliver trustworthy, certified vehicles with absolute transparency, verified paperwork, and honest pricing.'}
          </p>
        </div>
      </div>

      {/* Core Values & Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            To provide Kenyan motorists and growing businesses with vetted, reliable, and authentic vehicles without hidden mechanical faults or odometer tampering.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Customer-First Service</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every vehicle at Netwon Cars comes with full disclosure. We encourage clients to bring their independent mechanics for computer diagnosis and complete road test evaluations.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Kangundo Road Showroom</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Conveniently situated along the expanding Kangundo Road corridor in Nairobi, offering accessible parking, security, and a wide selection of ready inventory.
          </p>
        </div>
      </div>

      {/* Trust Factors & Inspection Guarantee */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
              Dealership Standard of Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why Car Buyers in Kenya Choose Netwon Cars
            </h2>
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Strict Vehicle Vetting:</strong> We reject accident-damaged, flood-damaged, or mechanically exhausted units.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Clear NTSA TIMS Records:</strong> Zero pending loans, encumbrances, or ownership disputes. We oversee the logbook transfer directly into your name.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Seamless Bank Financing:</strong> Partnerships with tier-1 Kenyan banks and SACCO asset financing schemes.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Reputable Rating:</strong> Currently rated{' '}
                  <strong className="text-amber-400">{settings.googleRating.toFixed(1)} ★</strong> on Google Reviews by verified clients.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-2xl">
                N
              </div>
              <div>
                <h4 className="text-white font-extrabold text-lg">Netwon Cars Kangundo Road</h4>
                <p className="text-xs text-amber-400">PVHX+6MQ, Nairobi, Kenya</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Have questions about a vehicle in stock or need advice on car importing? Contact our directors and sales team directly.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href={buildTelUrl(settings.phone)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Us: {settings.phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
