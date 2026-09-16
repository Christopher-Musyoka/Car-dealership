import React from 'react';
import { Fuel, Gauge, Cog, MapPin, MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../types';
import { formatKSh, formatNumber, buildWhatsAppUrl } from '../lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  whatsappNumber: string;
  onSelect: (vehicleId: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  whatsappNumber,
  onSelect
}) => {
  const primaryImg =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images[vehicle.primaryImageIndex || 0] || vehicle.images[0]
      : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  const enquiryMessage = `Hello Netwon Cars, I am interested in the ${vehicle.name}. Is it still available?`;
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, enquiryMessage);

  const isSold = vehicle.status === 'sold';
  const isReserved = vehicle.status === 'reserved';

  return (
    <div
      id={`vehicle-card-${vehicle.id}`}
      className="group relative bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col"
    >
      {/* Photo Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onSelect(vehicle.id)}>
        <img
          src={primaryImg}
          alt={vehicle.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSold ? 'grayscale opacity-75' : ''
          }`}
          loading="lazy"
        />

        {/* Status / Feature Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {isSold ? (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-600 text-white shadow-md">
              SOLD
            </span>
          ) : isReserved ? (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-600 text-white shadow-md">
              RESERVED
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-sm shadow-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              AVAILABLE
            </span>
          )}

          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-950/80 text-slate-200 backdrop-blur-sm border border-slate-700/80">
            {vehicle.condition}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
          {vehicle.isFeatured && (
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              FEATURED
            </span>
          )}
          {vehicle.isNewArrival && (
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-600 text-white shadow-md">
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* Multi-Photo Indicator */}
        {vehicle.images && vehicle.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm text-[11px] text-slate-300 border border-slate-700">
            {vehicle.images.length} Photos
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Year & Body Type */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span className="text-amber-400 font-semibold">{vehicle.year} Model</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{vehicle.bodyType}</span>
          </div>

          {/* Vehicle Name */}
          <h3
            onClick={() => onSelect(vehicle.id)}
            className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
            title={vehicle.name}
          >
            {vehicle.name}
          </h3>

          {/* Price */}
          <div className="mt-2.5 mb-3.5 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Cash Price</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                {formatKSh(vehicle.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Duty Paid</span>
              <span className="text-xs text-emerald-400 font-semibold">Verified</span>
            </div>
          </div>

          {/* Specifications Pills */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 text-xs text-slate-300 mb-4">
            <div className="flex items-center gap-1.5" title="Mileage">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{formatNumber(vehicle.mileage)} km</span>
            </div>
            <div className="flex items-center gap-1.5" title="Fuel Type">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Transmission">
              <Cog className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
          </div>

          {/* Location & Engine info */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
            <div className="flex items-center gap-1 truncate max-w-[65%]">
              <MapPin className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
              <span className="truncate">{vehicle.location}</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">{vehicle.engineCapacity}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            id={`btn-view-details-${vehicle.id}`}
            onClick={() => onSelect(vehicle.id)}
            className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <a
            id={`btn-whatsapp-${vehicle.id}`}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
