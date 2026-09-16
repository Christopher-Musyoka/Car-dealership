import React from 'react';
import { Phone, MessageCircle, MapPin, Mail, Clock, Star, Shield, ArrowUpRight } from 'lucide-react';
import { WebsiteSettings, PageView } from '../types';
import { buildTelUrl, buildWhatsAppUrl } from '../lib/utils';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsappNumber || settings.phone,
    'Hello Netwon Cars Kangundo Road, I would like to make an enquiry.'
  );

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      {/* Upper Footer CTA Strip */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-950 border-b border-slate-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest block mb-1">
              Visit Our Dealership
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ready to drive your next verified car home?
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Stop by our yard along Kangundo Road, Nairobi. Open 6 days a week with accompanied test drives and instant valuation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              id="footer-cta-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <button
              id="footer-cta-browse"
              onClick={() => {
                onNavigate('inventory');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Browse All Cars</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand & Credibility */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-lg">
              N
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                NETWON CARS
              </span>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                Kangundo Road, Nairobi
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {settings.aboutSummary}
          </p>

          <div className="pt-2">
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-amber-500/40 hover:text-white transition-colors"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">{settings.googleRating.toFixed(1)} Rating</span>
              <span className="text-slate-500">({settings.googleReviewCount} Google Review)</span>
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wide mb-4 uppercase">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => { onNavigate('inventory'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors"
              >
                Cars For Sale (Stock List)
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors"
              >
                About Netwon Cars
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors"
              >
                Dealership Services
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('financing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors"
              >
                Car Loan & Financing
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('trade-in'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors"
              >
                Sell / Trade-in Your Car
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors"
              >
                Book a Viewing Appointment
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors"
              >
                Showroom & Delivery Gallery
              </button>
            </li>
            <li>
              <button
                onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-amber-400 transition-colors"
              >
                Location & Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Categories */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-wide mb-4 uppercase">
            Vehicle Categories
          </h4>
          <ul className="space-y-2 text-xs">
            {['SUVs', 'Sedans', 'Station Wagons', 'Pickups', 'Vans', 'Commercial Vehicles', 'Luxury Cars'].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => {
                    onNavigate('inventory');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-500/80" />
                  <span>{cat} in Nairobi</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Dealership Location & Contact */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wide mb-4 uppercase">
            Dealership Yard
          </h4>

          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">{settings.address}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">{settings.landmark}</p>
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline text-[11px] inline-flex items-center gap-1 mt-1 font-medium"
              >
                <span>Open Google Maps</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <Phone className="w-4 h-4 text-amber-500 shrink-0" />
            <a href={buildTelUrl(settings.phone)} className="hover:text-amber-400 font-semibold text-slate-200">
              {settings.phone}
            </a>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-semibold">
              WhatsApp: {settings.phone}
            </a>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <Mail className="w-4 h-4 text-amber-500 shrink-0" />
            <a href={`mailto:${settings.email}`} className="hover:text-amber-400 text-slate-300">
              {settings.email}
            </a>
          </div>

          <div className="pt-2 border-t border-slate-900 text-slate-400 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{settings.openingHours.weekdays}</span>
            </div>
            <p className="pl-4.5 text-slate-400">{settings.openingHours.saturday}</p>
            <p className="pl-4.5 text-slate-400">{settings.openingHours.sunday}</p>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright */}
      <div className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{settings.footerText}</p>
          <div className="flex items-center gap-2 text-slate-500">
            <span>Kangundo Road</span>
            <span>•</span>
            <span>Nairobi, Kenya</span>
            <button
              id="secret-owner-portal"
              onClick={() => {
                onNavigate('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-850 hover:text-slate-700 transition-colors p-0.5 cursor-default select-none"
              aria-label="Portal access"
            >
              •
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
