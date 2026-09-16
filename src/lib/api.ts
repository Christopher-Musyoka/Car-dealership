import {
  Vehicle,
  Category,
  ServiceItem,
  CustomerReview,
  Enquiry,
  Appointment,
  TradeInRequest,
  GalleryItem,
  WebsiteSettings,
  DashboardStats,
  AdminUser
} from '../types';

const TOKEN_KEY = 'netwon_admin_jwt';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

// PUBLIC API
export async function getSettings(): Promise<WebsiteSettings> {
  const res = await fetch('/api/public/settings');
  if (!res.ok) throw new Error('Failed to load settings');
  return res.json();
}

export async function getVehicles(params?: Record<string, string>): Promise<Vehicle[]> {
  const url = new URL('/api/public/vehicles', window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.append(k, v);
      }
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to load vehicles');
  return res.json();
}

export async function getVehicle(id: string): Promise<{ vehicle: Vehicle; similar: Vehicle[] }> {
  const res = await fetch(`/api/public/vehicles/${id}`);
  if (!res.ok) throw new Error('Failed to load vehicle details');
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch('/api/public/categories');
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function getServices(): Promise<ServiceItem[]> {
  const res = await fetch('/api/public/services');
  if (!res.ok) throw new Error('Failed to load services');
  return res.json();
}

export async function getReviews(): Promise<CustomerReview[]> {
  const res = await fetch('/api/public/reviews');
  if (!res.ok) throw new Error('Failed to load reviews');
  return res.json();
}

export async function getGallery(): Promise<GalleryItem[]> {
  const res = await fetch('/api/public/gallery');
  if (!res.ok) throw new Error('Failed to load gallery');
  return res.json();
}

export async function submitEnquiry(data: Partial<Enquiry>): Promise<Enquiry> {
  const res = await fetch('/api/public/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit enquiry');
  return json.enquiry;
}

export async function submitAppointment(data: Partial<Appointment>): Promise<Appointment> {
  const res = await fetch('/api/public/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to book appointment');
  return json.appointment;
}

export async function submitTradeIn(data: Partial<TradeInRequest>): Promise<TradeInRequest> {
  const res = await fetch('/api/public/trade-ins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit trade-in');
  return json.tradeIn;
}

export async function submitReview(data: Partial<CustomerReview>): Promise<CustomerReview> {
  const res = await fetch('/api/public/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit review');
  return json.review;
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach(f => formData.append('images', f));

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Image upload failed');
  return json.urls;
}

// ADMIN API
export async function adminLogin(username: string, password: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  setAdminToken(json.token);
  return json;
}

export async function adminGetMe(): Promise<AdminUser> {
  const res = await fetch('/api/admin/me', { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Not authenticated');
  return json.admin;
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const token = getAdminToken();
  if (!token) return null;
  try {
    return await adminGetMe();
  } catch {
    removeAdminToken();
    return null;
  }
}

export async function adminChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Password update failed');
}

export async function adminGetDashboardStats(): Promise<DashboardStats> {
  const res = await fetch('/api/admin/dashboard-stats', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load dashboard stats');
  return res.json();
}

export async function adminGetVehicles(): Promise<Vehicle[]> {
  const res = await fetch('/api/admin/vehicles', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load vehicles');
  return res.json();
}

export async function adminCreateVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
  const res = await fetch('/api/admin/vehicles', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create vehicle');
  return json;
}

export async function adminUpdateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
  const res = await fetch(`/api/admin/vehicles/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update vehicle');
  return json;
}

export async function adminDeleteVehicle(id: string): Promise<void> {
  const res = await fetch(`/api/admin/vehicles/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete vehicle');
}

export async function adminDuplicateVehicle(id: string): Promise<Vehicle> {
  const res = await fetch(`/api/admin/vehicles/${id}/duplicate`, {
    method: 'POST',
    headers: authHeaders()
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to duplicate vehicle');
  return json;
}

export async function adminUpdateVehicleStatus(id: string, status: 'available' | 'reserved' | 'sold'): Promise<Vehicle> {
  const res = await fetch(`/api/admin/vehicles/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update vehicle status');
  return json;
}

export async function adminUpdateSettings(data: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update settings');
  return json;
}

export async function adminCreateCategory(data: Partial<Category>): Promise<Category> {
  const res = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create category');
  return json;
}

export async function adminUpdateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update category');
  return json;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete category');
}

export async function adminCreateService(data: Partial<ServiceItem>): Promise<ServiceItem> {
  const res = await fetch('/api/admin/services', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create service');
  return json;
}

export async function adminUpdateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
  const res = await fetch(`/api/admin/services/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update service');
  return json;
}

export async function adminDeleteService(id: string): Promise<void> {
  const res = await fetch(`/api/admin/services/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete service');
}

export async function adminGetEnquiries(): Promise<Enquiry[]> {
  const res = await fetch('/api/admin/enquiries', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load enquiries');
  return res.json();
}

export async function adminUpdateEnquiryStatus(id: string, status: 'new' | 'read' | 'contacted'): Promise<Enquiry> {
  const res = await fetch(`/api/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update enquiry');
  return json;
}

export async function adminDeleteEnquiry(id: string): Promise<void> {
  const res = await fetch(`/api/admin/enquiries/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete enquiry');
}

export async function adminGetAppointments(): Promise<Appointment[]> {
  const res = await fetch('/api/admin/appointments', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load appointments');
  return res.json();
}

export async function adminUpdateAppointment(id: string, payload: Partial<Appointment>): Promise<Appointment> {
  const res = await fetch(`/api/admin/appointments/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update appointment');
  return json;
}

export async function adminDeleteAppointment(id: string): Promise<void> {
  const res = await fetch(`/api/admin/appointments/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete appointment');
}

export async function adminGetTradeIns(): Promise<TradeInRequest[]> {
  const res = await fetch('/api/admin/trade-ins', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load trade-ins');
  return res.json();
}

export async function adminUpdateTradeInStatus(id: string, status: 'new' | 'reviewed' | 'contacted' | 'closed'): Promise<TradeInRequest> {
  const res = await fetch(`/api/admin/trade-ins/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update trade-in');
  return json;
}

export async function adminDeleteTradeIn(id: string): Promise<void> {
  const res = await fetch(`/api/admin/trade-ins/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete trade-in');
}

export async function adminGetReviews(): Promise<CustomerReview[]> {
  const res = await fetch('/api/admin/reviews', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load reviews');
  return res.json();
}

export async function adminCreateReview(data: Partial<CustomerReview>): Promise<CustomerReview> {
  const res = await fetch('/api/admin/reviews', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create review');
  return json;
}

export async function adminUpdateReview(id: string, data: Partial<CustomerReview>): Promise<CustomerReview> {
  const res = await fetch(`/api/admin/reviews/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update review');
  return json;
}

export async function adminDeleteReview(id: string): Promise<void> {
  const res = await fetch(`/api/admin/reviews/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete review');
}

export async function adminGetGallery(): Promise<GalleryItem[]> {
  const res = await fetch('/api/admin/gallery', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load gallery');
  return res.json();
}

export async function adminCreateGallery(data: Partial<GalleryItem>): Promise<GalleryItem> {
  const res = await fetch('/api/admin/gallery', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to add gallery item');
  return json;
}

export async function adminUpdateGallery(id: string, data: Partial<GalleryItem>): Promise<GalleryItem> {
  const res = await fetch(`/api/admin/gallery/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update gallery item');
  return json;
}

export async function adminDeleteGallery(id: string): Promise<void> {
  const res = await fetch(`/api/admin/gallery/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete gallery item');
}

export async function adminResetDemoData(): Promise<void> {
  const res = await fetch('/api/admin/reset-demo-data', {
    method: 'POST',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to reset demo data');
}
