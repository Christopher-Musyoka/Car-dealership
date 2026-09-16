import React from 'react';
import { CheckCircle2, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { ServiceItem, WebsiteSettings, PageView } from '../types';
import { buildTelUrl, buildWhatsAppUrl } from '../lib/utils';

interface ServicesPageProps {
  services: ServiceItem[];
  settings: WebsiteSettings;
  onNavigate: (page: PageView) => void;
  onEnquireService: (serviceName: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  settings,
  onNavigate,
  onEnquireService
}) => {
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber || settings.phone,
    'Hello Netwon Cars Kangundo Road, I would like to enquire about your automotive dealership services.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
          Comprehensive Automotive Services
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Dealership Services in Nairobi
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From showroom sales and direct import sourcing to instant car valuation, asset financing, and fast NTSA logbook transfer.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-8 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform font-bold text-lg">
                ★
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                {service.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Key Benefits & Highlights
                </span>
                {service.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onEnquireService(service.title)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-amber-400"
              >
                <span>Enquire About Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Contact Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Need Custom Assistance?
          </span>
          <h3 className="text-2xl font-bold text-white">Looking for a specific car model?</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Our import sourcing team procures vehicles directly from verified auctions in Japan and the UK delivered directly to Kangundo Road.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={buildTelUrl(settings.phone)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold hover:border-amber-400 transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>{settings.phone}</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};
