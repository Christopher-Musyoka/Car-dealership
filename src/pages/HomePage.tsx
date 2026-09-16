import React, { useState } from 'react';
import {
  Car,
  Search,
  MessageCircle,
  Phone,
  ShieldCheck,
  FileCheck,
  CreditCard,
  Repeat,
  Star,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  Zap,
  Truck,
  Hammer,
  Users,
  Briefcase,
  Crown,
  Heart,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { WebsiteSettings, Vehicle, Category, ServiceItem, CustomerReview, PageView } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { buildTelUrl, buildWhatsAppUrl, formatDate } from '../lib/utils';

interface HomePageProps {
  settings: WebsiteSettings;
  vehicles: Vehicle[];
  categories: Category[];
  services: ServiceItem[];
  reviews: CustomerReview[];
  onNavigate: (page: PageView, vehicleId?: string) => void;
  onOpenReviewModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  vehicles,
  categories,
  services,
  reviews,
  onNavigate,
  onOpenReviewModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('all');
  const [selectedBodyType, setSelectedBodyType] = useState('all');

  const featuredVehicles = vehicles.filter((v) => v.isFeatured && v.status !== 'sold').slice(0, 4);
  const newArrivals = vehicles.filter((v) => v.isNewArrival && v.status !== 'sold').slice(0, 4);

  // Available unique makes
  const uniqueMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('inventory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappHeroUrl = buildWhatsAppUrl(
    settings.whatsappNumber || settings.phone,
    'Hello Netwon Cars Kangundo Road, I would like to inquire about available vehicles in your yard.'
  );

  const getCategoryIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'compass': return <Compass className="w-5 h-5" />;
      case 'car': return <Car className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'truck': return <Truck className="w-5 h-5" />;
      case 'hammer': return <Hammer className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'briefcase': return <Briefcase className="w-5 h-5" />;
      case 'crown': return <Crown className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-slate-800">
        {/* Background Image with Deep Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80'}
            alt="Netwon Cars Kangundo Road Showroom"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 w-full">
          <div className="max-w-3xl space-y-6">
            {/* Location & Trust Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>Kangundo Road, Nairobi, Kenya</span>
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              <div className="flex items-center text-amber-400">
                <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                <span>{settings.googleRating.toFixed(1)} Rating</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              {settings.heroTitle || 'Find Your Next Car With Confidence'}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              {settings.heroSubtitle ||
                'Nairobi’s trusted car dealer along Kangundo Road. Verified foreign-used imports, certified local trade-ins, transparent pricing, and fast financing assistance.'}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="btn-hero-browse-cars"
                onClick={() => {
                  onNavigate('inventory');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <span>Browse Cars</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-contact-us"
                onClick={() => {
                  onNavigate('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base border border-slate-700 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Contact Us</span>
              </button>

              <a
                id="btn-hero-whatsapp"
                href={whatsappHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-emerald-950/50 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Quick Search Card overlay */}
          <div className="mt-10 sm:mt-12 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md max-w-4xl">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Search Model / Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Prado, CX-5, Premio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Make
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Makes</option>
                  {uniqueMakes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Body Type
                </label>
                <select
                  value={selectedBodyType}
                  onChange={(e) => setSelectedBodyType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Body Types</option>
                  <option value="SUV">SUVs</option>
                  <option value="Sedan">Sedans</option>
                  <option value="Station Wagon">Station Wagons</option>
                  <option value="Pickup">Pickups</option>
                  <option value="Van">Vans</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  id="btn-hero-submit-search"
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Search className="w-4 h-4" />
                  <span>Search {vehicles.length} Cars</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. TRUST BANNER / STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black text-white">150+ Point</span>
            </div>
            <p className="text-xs text-slate-400">Comprehensive Mechanical Check</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400">
              <FileCheck className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black text-white">100% Verified</span>
            </div>
            <p className="text-xs text-slate-400">NTSA TIMS Logbook Transfer</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400">
              <CreditCard className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black text-white">Up to 80%</span>
            </div>
            <p className="text-xs text-slate-400">Bank Asset Financing Guidance</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400">
              <Repeat className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black text-white">Trade-Ins</span>
            </div>
            <p className="text-xs text-slate-400">Fair Instant Market Valuation</p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR VEHICLE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Browse by Vehicle Type
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Popular Vehicle Categories
            </h2>
          </div>
          <button
            onClick={() => {
              onNavigate('inventory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Stock</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onNavigate('inventory');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all text-left group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FEATURED VEHICLES */}
      {featuredVehicles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                Hand-Picked Units
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Featured Vehicles for Sale
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Premium conditioned vehicles ready for inspection at Kangundo Road.
              </p>
            </div>

            <button
              onClick={() => {
                onNavigate('inventory');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-amber-400 hover:border-slate-700 transition-colors"
            >
              <span>See All ({vehicles.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                whatsappNumber={settings.whatsappNumber || settings.phone}
                onSelect={(id) => onNavigate('vehicle-details', id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. LATEST ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                Fresh Port Clearance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Latest Arrivals in Yard
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Just landed and detailed. Duty fully paid, ready for test drive.
              </p>
            </div>

            <button
              onClick={() => {
                onNavigate('inventory');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Browse Full Inventory</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                whatsappNumber={settings.whatsappNumber || settings.phone}
                onSelect={(id) => onNavigate('vehicle-details', id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE NETWON CARS */}
      <section className="bg-slate-900/50 border-y border-slate-800/80 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Why Choose Netwon Cars
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Dealership Built on Transparency & Value
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Buying a car in Nairobi shouldn’t be a gamble. Here is why drivers and businesses along Kangundo Road trust us.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.whyChooseUs?.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative group hover:border-amber-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SERVICES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Complete Automotive Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Our Dealership Services
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              From direct import sourcing to instant vehicle trade-ins and NTSA logbook transfers.
            </p>
          </div>

          <button
            onClick={() => {
              onNavigate('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Explore All Services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service) => (
            <div
              key={service.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition-colors"
            >
              <div>
                <h3 className="text-base font-bold text-white mb-2">{service.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{service.description}</p>
              </div>
              <ul className="space-y-1.5 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
                {service.highlights.slice(0, 2).map((h, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    <span className="text-slate-300">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS / TESTIMONIALS */}
      <section className="bg-slate-900/40 border-y border-slate-800/80 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Google Reviews Verified ({settings.googleRating.toFixed(1)} ★)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What Our Clients Say
              </h2>
            </div>

            <button
              id="btn-home-leave-review"
              onClick={onOpenReviewModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all self-start sm:self-auto"
            >
              <Star className="w-3.5 h-3.5" />
              <span>Leave a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed mb-4">
                    "{rev.review}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{rev.customerName}</span>
                    {rev.vehiclePurchased && (
                      <span className="text-[11px] text-amber-400">{rev.vehiclePurchased}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{formatDate(rev.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. LOCATION & DEALERSHIP VISIT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                Find Our Yard Along Kangundo Road
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Visit Netwon Cars Kangundo Road Today
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Located at <strong className="text-white">{settings.address}</strong>. Stop by to view vehicles in person, bring your trusted mechanic for computer diagnostics, or take your preferred car for a road test.
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{settings.openingHours.weekdays} | {settings.openingHours.saturday}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <a href={buildTelUrl(settings.phone)} className="hover:text-amber-400 font-semibold text-white">
                    Direct Dealership Hotline: {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  id="btn-home-open-maps"
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>
                <button
                  id="btn-home-book-viewing-cta"
                  onClick={() => {
                    onNavigate('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2"
                >
                  <span>Book a Viewing Appointment</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-6 border border-slate-800 text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-white text-sm">Dealership Quick Connect</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  OPEN NOW
                </span>
              </div>

              <div className="space-y-3 text-slate-300">
                <div>
                  <span className="text-slate-500 text-[11px] block">Location Landmark</span>
                  <span className="font-medium text-white">{settings.landmark}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Coordinates</span>
                  <span className="font-mono text-amber-400">PVHX+6MQ, Kangundo Road</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">WhatsApp Fast Response</span>
                  <a
                    href={buildWhatsAppUrl(settings.whatsappNumber || settings.phone, 'Hello Netwon Cars, please share your exact yard pin location.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    Click to receive WhatsApp Location Pin
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
