import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ArrowUpDown, SlidersHorizontal, Car } from 'lucide-react';
import { Vehicle, WebsiteSettings, PageView } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { formatKSh } from '../lib/utils';

interface InventoryPageProps {
  vehicles: Vehicle[];
  settings: WebsiteSettings;
  onNavigate: (page: PageView, vehicleId?: string) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  vehicles,
  settings,
  onNavigate
}) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [make, setMake] = useState('all');
  const [bodyType, setBodyType] = useState('all');
  const [fuel, setFuel] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [condition, setCondition] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [minYear, setMinYear] = useState<number>(2014);
  const [maxMileage, setMaxMileage] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc'>('newest');

  // Mobile filters drawer toggle
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract available unique values
  const uniqueMakes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.make))).sort(), [vehicles]);
  const uniqueBodyTypes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.bodyType))).sort(), [vehicles]);

  // Filter and sort logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matches =
            v.name.toLowerCase().includes(q) ||
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.description.toLowerCase().includes(q) ||
            v.features.some((f) => f.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Make
        if (make !== 'all' && v.make.toLowerCase() !== make.toLowerCase()) return false;

        // Body type
        if (bodyType !== 'all' && v.bodyType.toLowerCase() !== bodyType.toLowerCase()) return false;

        // Fuel
        if (fuel !== 'all' && v.fuel.toLowerCase() !== fuel.toLowerCase()) return false;

        // Transmission
        if (transmission !== 'all' && v.transmission.toLowerCase() !== transmission.toLowerCase()) return false;

        // Condition
        if (condition !== 'all' && v.condition.toLowerCase() !== condition.toLowerCase()) return false;

        // Availability status
        if (availability !== 'all' && v.status.toLowerCase() !== availability.toLowerCase()) return false;

        // Price range
        if (v.price < minPrice || (maxPrice > 0 && v.price > maxPrice)) return false;

        // Year
        if (v.year < minYear) return false;

        // Mileage
        if (v.mileage > maxMileage) return false;

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'year-desc':
            return b.year - a.year;
          case 'mileage-asc':
            return a.mileage - b.mileage;
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [
    vehicles,
    searchTerm,
    make,
    bodyType,
    fuel,
    transmission,
    condition,
    availability,
    minPrice,
    maxPrice,
    minYear,
    maxMileage,
    sortBy
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setMake('all');
    setBodyType('all');
    setFuel('all');
    setTransmission('all');
    setCondition('all');
    setAvailability('all');
    setMinPrice(0);
    setMaxPrice(10000000);
    setMinYear(2014);
    setMaxMileage(150000);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    make !== 'all' ||
    bodyType !== 'all' ||
    fuel !== 'all' ||
    transmission !== 'all' ||
    condition !== 'all' ||
    availability !== 'all' ||
    minPrice > 0 ||
    maxPrice < 10000000 ||
    minYear > 2014 ||
    maxMileage < 150000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Netwon Cars Kangundo Road
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cars For Sale in Nairobi
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Browse thoroughly inspected foreign-used imports and verified local trade-ins currently available in our Kangundo Road showroom yard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Vehicle' : 'Vehicles'} Matching
            </span>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* FILTERS SIDEBAR */}
        <div
          className={`lg:block bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-24 ${
            mobileFiltersOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Refine Inventory</span>
            </div>
            {hasActiveFilters && (
              <button
                id="btn-reset-filters"
                onClick={resetFilters}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Search Keywords
            </label>
            <div className="relative">
              <input
                id="filter-search-input"
                type="text"
                placeholder="Make, model, feature..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <Search className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5" />
              )}
            </div>
          </div>

          {/* Make Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Make</label>
            <select
              id="filter-make-select"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Makes</option>
              {uniqueMakes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Body Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Body Type</label>
            <select
              id="filter-bodytype-select"
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Body Types</option>
              {uniqueBodyTypes.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Condition</label>
            <select
              id="filter-condition-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Conditions</option>
              <option value="Foreign Used">Foreign Used (Import)</option>
              <option value="Local Used">Local Used (Kenyan)</option>
              <option value="Brand New">Brand New</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Availability</label>
            <select
              id="filter-availability-select"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Units</option>
              <option value="available">Available Now</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* Fuel & Transmission */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fuel</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gearbox</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Max Price</span>
              <span className="text-amber-400 font-mono">{formatKSh(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="1000000"
              max="10000000"
              step="200000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1M</span>
              <span>5M</span>
              <span>10M+</span>
            </div>
          </div>

          {/* Min Year Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Min Year</span>
              <span className="text-amber-400 font-mono">{minYear}</span>
            </div>
            <input
              type="range"
              min="2014"
              max="2022"
              step="1"
              value={minYear}
              onChange={(e) => setMinYear(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* VEHICLE RESULTS AREA (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-400">
              Showing <span className="font-bold text-white">{filteredVehicles.length}</span> of {vehicles.length} vehicles
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Sort By:</span>
              <select
                id="inventory-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="newest">Newest Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: New to Old</option>
                <option value="mileage-asc">Mileage: Low to High</option>
              </select>
            </div>
          </div>

          {/* Vehicles Grid */}
          {filteredVehicles.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
                <Car className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No Vehicles Match Your Search</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                We couldn’t find any car in our yard matching those exact criteria. Try broadening your filters or contact our vehicle sourcing team directly.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  whatsappNumber={settings.whatsappNumber || settings.phone}
                  onSelect={(id) => onNavigate('vehicle-details', id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
