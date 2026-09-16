import React, { useState } from 'react';
import { X, Plus, Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Vehicle } from '../../types';
import { uploadImages } from '../../lib/api';

interface AdminVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: Partial<Vehicle>) => Promise<void>;
  vehicle?: Vehicle | null;
}

export const AdminVehicleModal: React.FC<AdminVehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicle
}) => {
  const isEditing = !!vehicle;

  const [name, setName] = useState(vehicle?.name || '');
  const [make, setMake] = useState(vehicle?.make || 'Toyota');
  const [model, setModel] = useState(vehicle?.model || '');
  const [year, setYear] = useState<number>(vehicle?.year || 2017);
  const [price, setPrice] = useState<number>(vehicle?.price || 2500000);
  const [mileage, setMileage] = useState<number>(vehicle?.mileage || 65000);
  const [fuel, setFuel] = useState(vehicle?.fuel || 'Petrol');
  const [transmission, setTransmission] = useState(vehicle?.transmission || 'Automatic');
  const [engineCapacity, setEngineCapacity] = useState(vehicle?.engineCapacity || '2000cc');
  const [driveType, setDriveType] = useState(vehicle?.driveType || '2WD');
  const [exteriorColor, setExteriorColor] = useState(vehicle?.exteriorColor || 'Pearl White');
  const [interiorColor, setInteriorColor] = useState(vehicle?.interiorColor || 'Black');
  const [bodyType, setBodyType] = useState(vehicle?.bodyType || 'SUV');
  const [condition, setCondition] = useState(vehicle?.condition || 'Foreign Used');
  const [dutyStatus, setDutyStatus] = useState(vehicle?.dutyStatus || 'Fully Paid');
  const [location, setLocation] = useState(vehicle?.location || 'Kangundo Road Yard');
  const [status, setStatus] = useState<'available' | 'reserved' | 'sold'>(vehicle?.status || 'available');
  const [description, setDescription] = useState(vehicle?.description || '');
  const [features, setFeatures] = useState<string[]>(
    vehicle?.features || ['Push Start Button', 'Alloy Wheels', 'Reverse Camera', 'Fog Lights']
  );
  const [images, setImages] = useState<string[]>(
    vehicle?.images || ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80']
  );
  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState<boolean>(vehicle?.isFeatured || false);
  const [isNewArrival, setIsNewArrival] = useState<boolean>(vehicle?.isNewArrival || false);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const files = Array.from(e.target.files) as File[];
      const urls = await uploadImages(files);
      setImages([...images, ...urls]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !make.trim() || !model.trim()) {
      setError('Please provide vehicle title, make, and model.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        name,
        make,
        model,
        year,
        price,
        mileage,
        fuel,
        transmission,
        engineCapacity,
        driveType,
        exteriorColor,
        interiorColor,
        bodyType,
        condition,
        dutyStatus,
        location,
        status,
        description,
        features,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
        isFeatured,
        isNewArrival
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pr-8 mb-6">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Inventory Management
          </span>
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? `Edit Vehicle: ${vehicle.name}` : 'Add New Car to Stock'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Title & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2018 Mazda CX-5 2.2D XD L-Package"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-bold"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Make, Model, Year, Price */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Make *</label>
              <input
                type="text"
                required
                placeholder="e.g. Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. Harrier"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
              <input
                type="number"
                min="1990"
                max="2026"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Price (KSh) *</label>
              <input
                type="number"
                required
                step="10000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Mileage, Fuel, Transmission, Engine Capacity */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mileage (km)</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fuel Type</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option>Automatic</option>
                <option>Manual</option>
                <option>CVT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Engine</label>
              <input
                type="text"
                placeholder="e.g. 2000cc"
                value={engineCapacity}
                onChange={(e) => setEngineCapacity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Body Type, Condition, Drive Type, Location */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Body Type</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option>SUV</option>
                <option>Sedan</option>
                <option>Station Wagon</option>
                <option>Pickup</option>
                <option>Van</option>
                <option>Commercial</option>
                <option>Hatchback</option>
                <option>Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option>Foreign Used</option>
                <option>Local Used</option>
                <option>Brand New</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Drive Type</label>
              <input
                type="text"
                placeholder="2WD / 4WD / AWD"
                value={driveType}
                onChange={(e) => setDriveType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Yard Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Colors & Duty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Exterior Color</label>
              <input
                type="text"
                value={exteriorColor}
                onChange={(e) => setExteriorColor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Interior Color</label>
              <input
                type="text"
                value={interiorColor}
                onChange={(e) => setInteriorColor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duty Status</label>
              <input
                type="text"
                value={dutyStatus}
                onChange={(e) => setDutyStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
              />
              <span>Mark as Featured Car on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
              />
              <span>Mark as New Arrival</span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Vehicle Description & Condition Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, import origin, service records, and special features..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Features List */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Features & Equipment
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a feature (e.g. Sunroof, Leather Seats, 360 Camera)"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-200 flex items-center gap-1.5"
                >
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Photos Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Vehicle Photos (Multiple Supported)
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              <input
                type="url"
                placeholder="Paste image URL (Unsplash or direct image link)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 min-w-[200px] px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Add URL
              </button>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 max-h-36 overflow-y-auto">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden group border border-slate-800">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 p-1 rounded bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 px-1 rounded bg-amber-500 text-slate-950 text-[9px] font-bold">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              id="btn-save-vehicle-admin"
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Vehicle'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
