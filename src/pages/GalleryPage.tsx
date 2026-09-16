import React, { useState } from 'react';
import { Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'showroom', label: 'Yard & Showroom' },
    { id: 'stock', label: 'Vehicle Stock' },
    { id: 'delivery', label: 'Deliveries & Handover' },
    { id: 'team', label: 'Dealership & Team' }
  ];

  const filteredGallery = selectedCategory === 'all'
    ? gallery
    : gallery.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Showroom & Deliveries</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Dealership Photo Gallery
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Take a look inside Netwon Cars Kangundo Road: our showroom yard, newly landed stock, vehicle inspections, and happy customer handovers.
        </p>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div className="aspect-[16/10] overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            <div className="p-4 bg-slate-900 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-6 right-6 z-10 p-2 rounded-lg bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] bg-black rounded-xl overflow-hidden">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mt-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {activeItem.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeItem.title}</h3>
              {activeItem.description && (
                <p className="text-xs text-slate-300 mt-1">{activeItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
