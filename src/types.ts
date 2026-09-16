export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: 'Automatic' | 'Manual';
  engineCapacity: string;
  bodyType: 'SUV' | 'Sedan' | 'Hatchback' | 'Station Wagon' | 'Pickup' | 'Van' | 'Commercial' | 'Luxury' | 'Family Cars';
  condition: 'Foreign Used' | 'Local Used' | 'Brand New';
  driveType: '4WD' | 'AWD' | '2WD / FWD' | 'RWD';
  color: string;
  location: string;
  registration: string;
  status: 'available' | 'reserved' | 'sold';
  isFeatured: boolean;
  isNewArrival: boolean;
  images: string[];
  primaryImageIndex: number;
  description: string;
  features: string[];
  safetyFeatures: string[];
  interiorFeatures: string[];
  exteriorFeatures: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  date: string;
  photo?: string;
  vehiclePurchased?: string;
  isApproved: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  vehicleId?: string;
  vehicleName?: string;
  status: 'new' | 'read' | 'contacted';
  createdAt: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleId?: string;
  vehicleName: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'rescheduled' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface TradeInRequest {
  id: string;
  name: string;
  customerName?: string;
  phone: string;
  customerPhone?: string;
  email?: string;
  customerEmail?: string;
  make: string;
  vehicleMake?: string;
  model: string;
  vehicleModel?: string;
  year: number;
  mileage: number;
  registration?: string;
  registrationNumber?: string;
  condition: string;
  expectedPrice?: number;
  description?: string;
  notes?: string;
  photos?: string[];
  status: 'new' | 'reviewed' | 'contacted' | 'closed';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: 'Dealership & Yard' | 'Vehicles' | 'Customer Deliveries' | 'Events & Showroom';
  imageUrl: string;
  createdAt: string;
}

export interface WebsiteSettings {
  businessName: string;
  tagline: string;
  category: string;
  address: string;
  landmark: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  googleRating: number;
  googleReviewCount: number;
  googleMapsUrl: string;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutSummary: string;
  aboutStory: string;
  mission: string;
  vision: string;
  values: { title: string; desc: string }[];
  whyChooseUs: { title: string; desc: string; icon: string }[];
  financingInfo: {
    intro: string;
    maxLoanDurationMonths: number;
    minimumDepositPercent: number;
    standardInterestRatePercent: number;
    partnerBanks: string[];
    disclaimer: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
    twitter: string;
    youtube: string;
  };
  footerText: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
}

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  reservedVehicles: number;
  newEnquiries: number;
  totalEnquiries: number;
  pendingAppointments: number;
  totalAppointments: number;
  newTradeIns: number;
  totalTradeIns: number;
  recentEnquiries: Enquiry[];
  recentAppointments: Appointment[];
  recentTradeIns: TradeInRequest[];
}

export type PageView =
  | 'home'
  | 'inventory'
  | 'vehicle-details'
  | 'about'
  | 'services'
  | 'financing'
  | 'trade-in'
  | 'booking'
  | 'gallery'
  | 'contact'
  | 'admin';
