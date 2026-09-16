import React, { useState, useEffect } from 'react';
import {
  Car,
  Settings,
  Mail,
  Calendar,
  Repeat,
  Star,
  Image as ImageIcon,
  Key,
  LogOut,
  Plus,
  Search,
  Trash2,
  Edit2,
  Copy,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  AlertCircle,
  Save,
  RotateCcw,
  ExternalLink,
  Shield,
  Layers,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import {
  AdminUser,
  Vehicle,
  WebsiteSettings,
  Enquiry,
  Appointment,
  TradeInRequest,
  CustomerReview,
  GalleryItem,
  Category,
  ServiceItem,
  DashboardStats
} from '../types';
import {
  adminGetDashboardStats,
  adminGetVehicles,
  adminCreateVehicle,
  adminUpdateVehicle,
  adminDeleteVehicle,
  adminDuplicateVehicle,
  adminUpdateVehicleStatus,
  adminUpdateSettings,
  adminGetEnquiries,
  adminUpdateEnquiryStatus,
  adminDeleteEnquiry,
  adminGetAppointments,
  adminUpdateAppointment,
  adminDeleteAppointment,
  adminGetTradeIns,
  adminUpdateTradeInStatus,
  adminDeleteTradeIn,
  adminGetReviews,
  adminDeleteReview,
  adminCreateReview,
  adminGetGallery,
  adminCreateGallery,
  adminDeleteGallery,
  adminChangePassword,
  adminResetDemoData,
  removeAdminToken,
  adminCreateCategory,
  adminDeleteCategory,
  adminCreateService,
  adminDeleteService
} from '../lib/api';
import { AdminVehicleModal } from '../components/admin/AdminVehicleModal';
import { formatKSh, formatNumber, formatDate, buildTelUrl, buildWhatsAppUrl } from '../lib/utils';

interface AdminDashboardProps {
  adminUser: AdminUser;
  settings: WebsiteSettings;
  onSettingsUpdated: (updated: WebsiteSettings) => void;
  onLogout: () => void;
  onReturnToWebsite: () => void;
}

type AdminTab =
  | 'overview'
  | 'vehicles'
  | 'settings'
  | 'enquiries'
  | 'appointments'
  | 'tradeins'
  | 'categories'
  | 'services'
  | 'reviews'
  | 'gallery'
  | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  settings,
  onSettingsUpdated,
  onLogout,
  onReturnToWebsite
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Entities
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeInRequest[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Modals & UI States
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved' | 'sold'>('all');

  // Notification / Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Editable settings form state
  const [formData, setFormData] = useState<WebsiteSettings>(settings);

  // Security passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // New Category / Service / Gallery items
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('showroom');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    try {
      const [s, v, enq, appt, trades, revs, gals] = await Promise.all([
        adminGetDashboardStats().catch(() => null),
        adminGetVehicles().catch(() => []),
        adminGetEnquiries().catch(() => []),
        adminGetAppointments().catch(() => []),
        adminGetTradeIns().catch(() => []),
        adminGetReviews().catch(() => []),
        adminGetGallery().catch(() => [])
      ]);

      if (s) setStats(s);
      setVehicles(v);
      setEnquiries(enq);
      setAppointments(appt);
      setTradeIns(trades);
      setReviews(revs);
      setGallery(gals);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Handle Vehicle Save (Create or Edit)
  const handleSaveVehicle = async (vehicleData: Partial<Vehicle>) => {
    if (editingVehicle) {
      const updated = await adminUpdateVehicle(editingVehicle.id, vehicleData);
      setVehicles(vehicles.map((v) => (v.id === updated.id ? updated : v)));
      showToast(`Vehicle "${updated.name}" updated successfully!`);
    } else {
      const created = await adminCreateVehicle(vehicleData);
      setVehicles([created, ...vehicles]);
      showToast(`New vehicle "${created.name}" listed in stock!`);
    }
    loadAllData();
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from stock?`)) return;
    try {
      await adminDeleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
      showToast(`Vehicle "${name}" removed`);
    } catch {
      showToast('Failed to delete vehicle', 'error');
    }
  };

  const handleDuplicateVehicle = async (id: string) => {
    try {
      const duplicated = await adminDuplicateVehicle(id);
      setVehicles([duplicated, ...vehicles]);
      showToast(`Duplicated: ${duplicated.name}`);
    } catch {
      showToast('Failed to duplicate vehicle', 'error');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'available' | 'reserved' | 'sold') => {
    try {
      const updated = await adminUpdateVehicleStatus(id, status);
      setVehicles(vehicles.map((v) => (v.id === id ? updated : v)));
      showToast(`Status set to ${status.toUpperCase()}`);
    } catch {
      showToast('Failed to update vehicle status', 'error');
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await adminUpdateSettings(formData);
      onSettingsUpdated(updated);
      showToast('Dealership website settings saved and live!');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save settings', 'error');
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    try {
      await adminChangePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Admin password updated successfully!');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Password update failed', 'error');
    }
  };

  // Handle Reset Demo Data
  const handleResetDemo = async () => {
    if (!window.confirm('Reset all vehicles and dealership details to demo defaults?')) return;
    try {
      await adminResetDemoData();
      showToast('Demo data restored successfully!');
      window.location.reload();
    } catch {
      showToast('Failed to reset demo data', 'error');
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border animate-in slide-in-from-top-4 duration-200 ${
            toastType === 'success'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-950 text-rose-300 border-rose-500/30'
          }`}
        >
          {toastType === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-lg">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">Netwon Cars</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                ADMIN CMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Kangundo Road, Nairobi • Logged in as {adminUser.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToWebsite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors border border-rose-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Dashboard Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav (Desktop & Mobile) */}
        <div className="w-full md:w-64 bg-slate-900/80 border-r border-slate-800 p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
            Navigation
          </span>

          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Layers, badge: null },
            { id: 'vehicles', label: 'Vehicles / Inventory', icon: Car, badge: vehicles.length },
            { id: 'enquiries', label: 'Customer Enquiries', icon: Mail, badge: enquiries.filter((e) => e.status === 'new').length },
            { id: 'appointments', label: 'Viewing Bookings', icon: Calendar, badge: appointments.filter((a) => a.status === 'pending').length },
            { id: 'tradeins', label: 'Trade-In Submissions', icon: Repeat, badge: tradeIns.filter((t) => t.status === 'new').length },
            { id: 'settings', label: 'Website Settings', icon: Settings, badge: null },
            { id: 'reviews', label: 'Customer Reviews', icon: Star, badge: reviews.length },
            { id: 'gallery', label: 'Showroom Gallery', icon: ImageIcon, badge: gallery.length },
            { id: 'security', label: 'Admin Security', icon: Key, badge: null }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-800">
            <button
              onClick={handleResetDemo}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Defaults</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dealership Overview</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time metrics for Netwon Cars Kangundo Road</p>
                </div>
                <button
                  onClick={() => {
                    setEditingVehicle(null);
                    setVehicleModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Car</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-400 block">Total Cars in Stock</span>
                  <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                    {stats?.totalVehicles ?? vehicles.length}
                  </span>
                  <div className="flex gap-2 text-[10px] text-slate-500 mt-2">
                    <span className="text-emerald-400 font-semibold">{stats?.availableVehicles ?? 0} Avail</span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">{stats?.reservedVehicles ?? 0} Res</span>
                    <span>•</span>
                    <span className="text-rose-400 font-semibold">{stats?.soldVehicles ?? 0} Sold</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-400 block">Customer Inquiries</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">
                    {stats?.totalEnquiries ?? enquiries.length}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-2 block">
                    {stats?.newEnquiries ?? 0} Unread / Action Required
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-400 block">Viewing Appointments</span>
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1 block">
                    {stats?.totalAppointments ?? appointments.length}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-2 block">
                    {stats?.pendingAppointments ?? 0} Pending Confirmation
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-400 block">Trade-In Submissions</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
                    {stats?.totalTradeIns ?? tradeIns.length}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-2 block">
                    {stats?.newTradeIns ?? 0} New for Valuation
                  </span>
                </div>
              </div>

              {/* Recent Enquiries & Bookings preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">Recent Customer Inquiries</h3>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs text-amber-400 hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {enquiries.slice(0, 4).map((e) => (
                      <div key={e.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                        <div className="flex justify-between font-semibold text-white">
                          <span>{e.name}</span>
                          <span className="text-[10px] text-slate-500">{formatDate(e.createdAt)}</span>
                        </div>
                        <p className="text-amber-400 text-[11px] mt-0.5">{e.vehicleName || e.subject}</p>
                        <p className="text-slate-400 text-xs line-clamp-1 mt-1">"{e.message}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">Upcoming Viewing Appointments</h3>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className="text-xs text-amber-400 hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {appointments.slice(0, 4).map((a) => (
                      <div key={a.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                        <div className="flex justify-between font-semibold text-white">
                          <span>{a.name}</span>
                          <span className="text-[10px] text-emerald-400">{a.preferredDate} • {a.preferredTime}</span>
                        </div>
                        <p className="text-amber-400 text-[11px] mt-0.5">{a.vehicleName}</p>
                        <p className="text-slate-400 text-xs mt-1">Tel: {a.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VEHICLES MANAGEMENT */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Vehicle Inventory ({vehicles.length})</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Manage cars, specifications, pricing, and photos</p>
                </div>
                <button
                  id="btn-admin-add-vehicle"
                  onClick={() => {
                    setEditingVehicle(null);
                    setVehicleModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Car</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="relative min-w-[240px]">
                  <input
                    type="text"
                    placeholder="Search by title, make, model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Status:</span>
                  {(['all', 'available', 'reserved', 'sold'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        statusFilter === st
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-950 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table of Vehicles */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-4">Car Details</th>
                        <th className="p-4">Year & Body</th>
                        <th className="p-4">Price (KSh)</th>
                        <th className="p-4">Condition</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredVehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={v.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
                                alt=""
                                className="w-12 h-9 rounded-lg object-cover bg-slate-950 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-white block">{v.name}</span>
                                <span className="text-[11px] text-slate-400">{formatNumber(v.mileage)} km • {v.fuel} • {v.transmission}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-slate-300">
                            <span className="font-semibold text-amber-400">{v.year}</span>
                            <span className="text-slate-400 block text-[11px]">{v.bodyType}</span>
                          </td>

                          <td className="p-4 font-bold text-amber-400 text-sm">
                            {formatKSh(v.price)}
                          </td>

                          <td className="p-4 text-slate-300 font-medium">
                            {v.condition}
                          </td>

                          <td className="p-4">
                            <div className="flex gap-1">
                              {(['available', 'reserved', 'sold'] as const).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleUpdateStatus(v.id, s)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-all ${
                                    v.status === s
                                      ? s === 'available'
                                        ? 'bg-emerald-500 text-slate-950'
                                        : s === 'reserved'
                                        ? 'bg-amber-500 text-slate-950'
                                        : 'bg-rose-500 text-white'
                                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDuplicateVehicle(v.id)}
                                title="Duplicate Vehicle"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingVehicle(v);
                                  setVehicleModalOpen(true);
                                }}
                                title="Edit Vehicle"
                                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteVehicle(v.id, v.name)}
                                title="Delete Vehicle"
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Dealership Website Settings</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure business info, phone, address, Google reviews, and homepage text dynamically.
                  </p>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>

              {/* General Business Info */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">1. Business Profile Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Business Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Hotline</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location Landmark</label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Google Reviews & Maps */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">2. Google Maps & Reputation</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Google Rating (e.g. 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={formData.googleRating}
                      onChange={(e) => setFormData({ ...formData, googleRating: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Review Count Shown</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.googleReviewCount}
                      onChange={(e) => setFormData({ ...formData, googleReviewCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Google Maps URL</label>
                    <input
                      type="url"
                      value={formData.googleMapsUrl}
                      onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">3. Business Working Hours</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Weekdays (Mon - Fri)</label>
                    <input
                      type="text"
                      value={formData.openingHours.weekdays}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openingHours: { ...formData.openingHours, weekdays: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Saturday</label>
                    <input
                      type="text"
                      value={formData.openingHours.saturday}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openingHours: { ...formData.openingHours, saturday: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Sunday & Holidays</label>
                    <input
                      type="text"
                      value={formData.openingHours.sunday}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openingHours: { ...formData.openingHours, sunday: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Homepage Content */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">4. Homepage & Hero Banner</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Automotive Background Image URL</label>
                  <input
                    type="url"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* About & Footer */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">5. About & Footer</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">About Story (Full)</label>
                  <textarea
                    rows={3}
                    value={formData.aboutStory}
                    onChange={(e) => setFormData({ ...formData, aboutStory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Footer Copyright Text</label>
                  <input
                    type="text"
                    value={formData.footerText}
                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20"
                >
                  Save All Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Customer Enquiries ({enquiries.length})</h1>
                <p className="text-xs text-slate-400 mt-0.5">Direct messages submitted from the public website</p>
              </div>

              <div className="space-y-3">
                {enquiries.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center bg-slate-900 rounded-2xl">No enquiries yet.</p>
                ) : (
                  enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div>
                          <span className="font-bold text-white text-sm">{enq.name}</span>
                          <span className="text-slate-400 text-xs ml-2">({enq.phone})</span>
                          {enq.email && <span className="text-slate-500 text-xs ml-2">• {enq.email}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">{formatDate(enq.createdAt)}</span>
                          <select
                            value={enq.status}
                            onChange={async (e) => {
                              const updated = await adminUpdateEnquiryStatus(enq.id, e.target.value as any);
                              setEnquiries(enquiries.map((x) => (x.id === enq.id ? updated : x)));
                            }}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-amber-400"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="contacted">Contacted</option>
                          </select>
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this enquiry?')) {
                                await adminDeleteEnquiry(enq.id);
                                setEnquiries(enquiries.filter((x) => x.id !== enq.id));
                              }
                            }}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {enq.vehicleName && (
                        <span className="inline-block px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
                          Car: {enq.vehicleName}
                        </span>
                      )}

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        {enq.message}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={buildTelUrl(enq.phone)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>Call {enq.phone}</span>
                        </a>

                        <a
                          href={buildWhatsAppUrl(enq.phone, `Hello ${enq.name}, thank you for contacting Netwon Cars Kangundo Road regarding your enquiry.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Reply</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Viewing Appointments ({appointments.length})</h1>
                <p className="text-xs text-slate-400 mt-0.5">Physical showroom viewing and test drive bookings</p>
              </div>

              <div className="space-y-3">
                {appointments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center bg-slate-900 rounded-2xl">No viewing bookings yet.</p>
                ) : (
                  appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div>
                          <span className="font-bold text-white text-sm">{appt.name}</span>
                          <span className="text-slate-400 text-xs ml-2">({appt.phone})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={appt.status}
                            onChange={async (e) => {
                              const updated = await adminUpdateAppointment(appt.id, { status: e.target.value as any });
                              setAppointments(appointments.map((x) => (x.id === appt.id ? updated : x)));
                            }}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-amber-400"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this viewing appointment?')) {
                                await adminDeleteAppointment(appt.id);
                                setAppointments(appointments.filter((x) => x.id !== appt.id));
                              }
                            }}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 text-[10px] block">Vehicle to View:</span>
                          <span className="font-bold text-amber-400">{appt.vehicleName}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-500 text-[10px] block">Scheduled Date & Time:</span>
                          <span className="font-bold text-emerald-400">{appt.preferredDate} at {appt.preferredTime}</span>
                        </div>
                      </div>

                      {appt.message && (
                        <p className="text-xs text-slate-400 italic">Notes: "{appt.message}"</p>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={buildTelUrl(appt.phone)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>Call Client</span>
                        </a>

                        <a
                          href={buildWhatsAppUrl(appt.phone, `Hello ${appt.name}, Netwon Cars Kangundo Road has reserved your viewing appointment for ${appt.vehicleName} on ${appt.preferredDate} at ${appt.preferredTime}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Confirm on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: TRADE-INS */}
          {activeTab === 'tradeins' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Trade-In & Sell Requests ({tradeIns.length})</h1>
                <p className="text-xs text-slate-400 mt-0.5">Vehicles offered by customers for trade-in or direct cash buy</p>
              </div>

              <div className="space-y-3">
                {tradeIns.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center bg-slate-900 rounded-2xl">No trade-ins submitted yet.</p>
                ) : (
                  tradeIns.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div>
                          <span className="font-bold text-white text-base">
                            {item.year} {item.vehicleMake} {item.vehicleModel}
                          </span>
                          <span className="text-amber-400 text-xs ml-2 font-mono">
                            {item.registrationNumber || 'No Reg'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={async (e) => {
                              const updated = await adminUpdateTradeInStatus(item.id, e.target.value as any);
                              setTradeIns(tradeIns.map((x) => (x.id === item.id ? updated : x)));
                            }}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-amber-400"
                          >
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this trade-in submission?')) {
                                await adminDeleteTradeIn(item.id);
                                setTradeIns(tradeIns.filter((x) => x.id !== item.id));
                              }
                            }}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                          <span className="text-slate-500 text-[10px] block">Mileage:</span>
                          <span className="font-bold text-slate-200">{formatNumber(item.mileage)} km</span>
                        </div>
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                          <span className="text-slate-500 text-[10px] block">Condition:</span>
                          <span className="font-bold text-slate-200">{item.condition}</span>
                        </div>
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                          <span className="text-slate-500 text-[10px] block">Asking Price:</span>
                          <span className="font-bold text-amber-400">
                            {item.expectedPrice ? formatKSh(item.expectedPrice) : 'Negotiable'}
                          </span>
                        </div>
                        <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                          <span className="text-slate-500 text-[10px] block">Client:</span>
                          <span className="font-bold text-slate-200">{item.customerName}</span>
                        </div>
                      </div>

                      {item.notes && <p className="text-xs text-slate-400 italic">Notes: "{item.notes}"</p>}

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={buildTelUrl(item.customerPhone)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>Call {item.customerPhone}</span>
                        </a>

                        <a
                          href={buildWhatsAppUrl(item.customerPhone, `Hello ${item.customerName}, Netwon Cars Kangundo Road has received your trade-in request for the ${item.vehicleMake} ${item.vehicleModel}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Discuss on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Customer Reviews ({reviews.length})</h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage published testimonials on your website</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-white text-sm">{rev.customerName}</span>
                        {rev.vehiclePurchased && (
                          <span className="text-[11px] text-amber-400 block">{rev.vehiclePurchased}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this review?')) {
                              await adminDeleteReview(rev.id);
                              setReviews(reviews.filter((x) => x.id !== rev.id));
                            }
                          }}
                          className="p-1 ml-2 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic">"{rev.review}"</p>
                    <span className="text-[10px] text-slate-500 block">{formatDate(rev.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Showroom & Delivery Gallery ({gallery.length})</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Photos of vehicles, Kangundo Road yard, and handovers</p>
                </div>
              </div>

              {/* Add image form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Add Photo to Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="url"
                    placeholder="Image URL (Unsplash or direct image link)"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Photo Title (e.g. Prado TX Delivery)"
                    value={newGalleryTitle}
                    onChange={(e) => setNewGalleryTitle(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newGalleryCategory}
                      onChange={(e) => setNewGalleryCategory(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-500"
                    >
                      <option value="showroom">Showroom</option>
                      <option value="stock">Vehicle Stock</option>
                      <option value="delivery">Delivery Handover</option>
                      <option value="team">Team</option>
                    </select>
                    <button
                      onClick={async () => {
                        if (!newGalleryUrl.trim() || !newGalleryTitle.trim()) {
                          showToast('Please provide an image URL and title', 'error');
                          return;
                        }
                        const item = await adminCreateGallery({
                          imageUrl: newGalleryUrl,
                          title: newGalleryTitle,
                          category: newGalleryCategory
                        });
                        setGallery([item, ...gallery]);
                        setNewGalleryUrl('');
                        setNewGalleryTitle('');
                        showToast('Photo added to gallery!');
                      }}
                      className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Photos grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="relative group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="aspect-video bg-slate-950">
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate">{g.title}</span>
                      <button
                        onClick={async () => {
                          if (window.confirm('Remove photo from gallery?')) {
                            await adminDeleteGallery(g.id);
                            setGallery(gallery.filter((x) => x.id !== g.id));
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: SECURITY */}
          {activeTab === 'security' && (
            <div className="max-w-md space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Admin Security</h1>
                <p className="text-xs text-slate-400 mt-0.5">Change your administrator password</p>
              </div>

              <form onSubmit={handleChangePassword} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all mt-2"
                >
                  Update Admin Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Add / Edit Modal */}
      {vehicleModalOpen && (
        <AdminVehicleModal
          isOpen={vehicleModalOpen}
          vehicle={editingVehicle}
          onClose={() => {
            setVehicleModalOpen(false);
            setEditingVehicle(null);
          }}
          onSave={handleSaveVehicle}
        />
      )}
    </div>
  );
};
