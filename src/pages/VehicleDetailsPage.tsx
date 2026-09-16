import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  Fuel,
  Gauge,
  Cog,
  Share2,
  Car,
  Clock,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { Vehicle, WebsiteSettings, PageView } from '../types';
import { formatKSh, formatNumber, buildTelUrl, buildWhatsAppUrl } from '../lib/utils';
import { LoanCalculator } from '../components/LoanCalculator';
import { VehicleCard } from '../components/VehicleCard';

interface VehicleDetailsPageProps {
  vehicle: Vehicle;
  similarVehicles: Vehicle[];
  settings: WebsiteSettings;
  onNavigate: (page: PageView, vehicleId?: string) => void;
  onOpenBookingModal: (vehicle: Vehicle) => void;
  onOpenEnquiryModal: (vehicle: Vehicle) => void;
}

export const VehicleDetailsPage: React.FC<VehicleDetailsPageProps> = ({
  vehicle,
  similarVehicles,
  settings,
  onNavigate,
  onOpenBookingModal,
  onOpenEnquiryModal
}) => {
  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeImage = images[activeImageIndex] || images[0];

  const enquiryMessage = `Hello Netwon Cars, I am interested in the ${vehicle.name} priced at ${formatKSh(vehicle.price)}. Is it still available for viewing at Kangundo Road?`;
  const whatsappUrl = buildWhatsAppUrl(settings.whatsappNumber || settings.phone, enquiryMessage);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isSold = vehicle.status === 'sold';
  const isReserved = vehicle.status === 'reserved';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('inventory')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Inventory</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{copied ? 'Link Copied!' : 'Share Vehicle'}</span>
        </button>
      </div>

      {/* Main Vehicle Header & Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Photos & Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Photo */}
          <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
            <img
              src={activeImage}
              alt={vehicle.name}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isSold ? 'grayscale opacity-80' : ''
              }`}
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {isSold ? (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-rose-600 text-white shadow-lg">
                  SOLD
                </span>
              ) : isReserved ? (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-600 text-white shadow-lg">
                  RESERVED
                </span>
              ) : (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AVAILABLE
                </span>
              )}

              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700">
                {vehicle.condition}
              </span>
            </div>

            {vehicle.isFeatured && (
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-slate-950 shadow-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FEATURED</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20 scale-105'
                      : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Inspection Trust Note */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <p>
              This vehicle has been physically inspected by our mechanic team. Original logbook verified, duty fully cleared, and ready for immediate NTSA TIMS transfer upon purchase.
            </p>
          </div>
        </div>

        {/* Pricing, Actions & Primary Details (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <span className="text-amber-400">{vehicle.year}</span>
              <span>•</span>
              <span>{vehicle.make}</span>
              <span>•</span>
              <span>{vehicle.bodyType}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {vehicle.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Location: {vehicle.location}</span>
            </p>
          </div>

          {/* Price Box */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 block font-medium">Selling Price (Duty Paid)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                {formatKSh(vehicle.price)}
              </span>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Negotiable on Viewing
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <a
              id="btn-vehicle-whatsapp-enquiry"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Enquiry</span>
            </a>

            <div className="grid grid-cols-2 gap-3">
              <a
                id="btn-vehicle-call-dealership"
                href={buildTelUrl(settings.phone)}
                className="w-full py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call Dealership</span>
              </a>

              <button
                id="btn-vehicle-book-viewing"
                onClick={() => onOpenBookingModal(vehicle)}
                className="w-full py-3 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Viewing</span>
              </button>
            </div>

            <button
              id="btn-vehicle-request-info"
              onClick={() => onOpenEnquiryModal(vehicle)}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              Request More Information or Video Tour
            </button>
          </div>

          {/* Fast Specs Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 flex items-center gap-2.5">
              <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Mileage</span>
                <span className="font-bold text-slate-200">{formatNumber(vehicle.mileage)} km</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 flex items-center gap-2.5">
              <Fuel className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Fuel Type</span>
                <span className="font-bold text-slate-200">{vehicle.fuel}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 flex items-center gap-2.5">
              <Cog className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Transmission</span>
                <span className="font-bold text-slate-200">{vehicle.transmission}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 flex items-center gap-2.5">
              <Car className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Engine Capacity</span>
                <span className="font-bold text-slate-200">{vehicle.engineCapacity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Full Specifications (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Description */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-3">Vehicle Overview</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>

          {/* Features checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Installed Features & Equipment</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {vehicle.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Technical Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Make</span>
                <span className="font-semibold text-white">{vehicle.make}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Model</span>
                <span className="font-semibold text-white">{vehicle.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Manufacturing Year</span>
                <span className="font-semibold text-white">{vehicle.year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Body Type</span>
                <span className="font-semibold text-white">{vehicle.bodyType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Condition</span>
                <span className="font-semibold text-amber-400">{vehicle.condition}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Drive Type</span>
                <span className="font-semibold text-white">{vehicle.driveType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Exterior Color</span>
                <span className="font-semibold text-white">{vehicle.exteriorColor}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Interior Color</span>
                <span className="font-semibold text-white">{vehicle.interiorColor}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Duty Status</span>
                <span className="font-semibold text-emerald-400">{vehicle.dutyStatus}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Current Yard Location</span>
                <span className="font-semibold text-white">{vehicle.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Financing Calculator + Dealership Location Card (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Financing Calculator preloaded with this car's price */}
          <LoanCalculator
            initialPrice={vehicle.price}
            settings={settings}
            onEnquire={(monthly, deposit, months) => {
              onOpenEnquiryModal({
                ...vehicle,
                description: `Financing Application: Estimated payment ${monthly}/month with deposit ${deposit} over ${months} months for ${vehicle.name}.`
              });
            }}
          />

          {/* Dealership Yard Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wide">
              Inspect at Kangundo Road Yard
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">{settings.address}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">{settings.landmark}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.openingHours.weekdays}</span>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold text-center transition-colors"
              >
                Get Directions to Kangundo Road
              </a>
              <button
                onClick={() => onOpenBookingModal(vehicle)}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center transition-colors"
              >
                Schedule Test Drive Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar / Related Vehicles */}
      {similarVehicles.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Similar Vehicles You Might Like</h3>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarVehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                whatsappNumber={settings.whatsappNumber || settings.phone}
                onSelect={(id) => {
                  onNavigate('vehicle-details', id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
