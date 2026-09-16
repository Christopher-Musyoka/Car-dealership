import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Star, Menu, X, Shield, Clock } from 'lucide-react';
import { WebsiteSettings, PageView } from '../types';
import { buildTelUrl, buildWhatsAppUrl } from '../lib/utils';

interface HeaderProps {
  settings: WebsiteSettings;
  currentPage: PageView;
  onNavigate: (page: PageView, vehicleId?: string) => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentPage,
  onNavigate,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: PageView }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Cars for Sale', page: 'inventory' },
    { label: 'About Us', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Car Financing', page: 'financing' },
    { label: 'Sell / Trade-in', page: 'trade-in' },
    { label: 'Book Viewing', page: 'booking' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Contact', page: 'contact' }
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappLink = buildWhatsAppUrl(
    settings.whatsappNumber || settings.phone,
    'Hello Netwon Cars Kangundo Road, I would like to make an enquiry.'
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Announcement & Trust Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800/80 text-xs text-slate-300 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <a
              id="top-bar-phone"
              href={buildTelUrl(settings.phone)}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>{settings.phone}</span>
            </a>

            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{settings.address}</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{settings.openingHours.weekdays}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 ml-auto">
            {/* Google Rating Badge */}
            <a
              id="google-reviews-badge"
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-400 hover:bg-amber-500/20 transition-colors"
              title="Verified Google Business Rating"
            >
              <span className="font-bold">{settings.googleRating.toFixed(1)}</span>
              <div className="flex items-center text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">({settings.googleReviewCount} Google Review)</span>
            </a>

            <a
              id="top-bar-whatsapp"
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-500/20 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp Enquiry</span>
            </a>

            {/* Admin link - ONLY visible when currently authenticated */}
            {isAdminLoggedIn && (
              <button
                id="btn-admin-portal-link"
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all font-semibold"
                title="Admin CMS Portal"
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span className="text-[11px]">Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Dealership Logo & Branding */}
        <button
          id="btn-header-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40 group-hover:scale-105 transition-transform">
            <span className="text-slate-950 font-black text-xl tracking-tighter">N</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                NETWON
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 tracking-wider uppercase">
                Cars
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Kangundo Road, Nairobi
            </p>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
          {navItems.map(item => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                id={`nav-link-${item.page}`}
                onClick={() => handleNavClick(item.page)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 shadow-sm border border-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-nav-browse-cars"
            onClick={() => handleNavClick('inventory')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Browse Inventory
          </button>

          {isAdminLoggedIn && (
            <button
              id="btn-nav-admin-direct"
              onClick={() => handleNavClick('admin')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all"
              title="Return to Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map(item => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  id={`mobile-nav-${item.page}`}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                      : 'text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <button
              id="mobile-btn-browse-inventory"
              onClick={() => handleNavClick('inventory')}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold text-center transition-colors"
            >
              Browse Cars for Sale
            </button>
            {isAdminLoggedIn && (
              <button
                id="mobile-btn-admin-portal"
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Open Admin Dashboard</span>
              </button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <a
                id="mobile-btn-call"
                href={buildTelUrl(settings.phone)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Us</span>
              </a>
              <a
                id="mobile-btn-whatsapp"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs font-semibold hover:bg-emerald-900/40"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
