import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronUp,
  Loader2
} from 'lucide-react';
import {
  PageView,
  WebsiteSettings,
  Vehicle,
  Category,
  ServiceItem,
  CustomerReview,
  GalleryItem,
  AdminUser
} from './types';
import {
  getSettings,
  getVehicles,
  getCategories,
  getServices,
  getReviews,
  getGallery,
  getAdminSession,
  removeAdminToken
} from './lib/api';
import { buildTelUrl, buildWhatsAppUrl } from './lib/utils';

// Public Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ViewingModal } from './components/ViewingModal';
import { EnquiryModal } from './components/EnquiryModal';
import { ReviewModal } from './components/ReviewModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { VehicleDetailsPage } from './pages/VehicleDetailsPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { FinancingPage } from './pages/FinancingPage';
import { TradeInPage } from './pages/TradeInPage';
import { BookingPage } from './pages/BookingPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Global Loaded Data
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Modals state
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [selectedVehicleForViewing, setSelectedVehicleForViewing] = useState<Vehicle | null>(null);

  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryDefaultSubject, setEnquiryDefaultSubject] = useState<string | undefined>();
  const [enquiryDefaultMessage, setEnquiryDefaultMessage] = useState<string | undefined>();
  const [enquiryVehicle, setEnquiryVehicle] = useState<Vehicle | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // UI state
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial public data
  const loadPublicData = async () => {
    try {
      const [s, v, c, srv, r, g, session] = await Promise.all([
        getSettings().catch(() => null),
        getVehicles().catch(() => []),
        getCategories().catch(() => []),
        getServices().catch(() => []),
        getReviews().catch(() => []),
        getGallery().catch(() => []),
        getAdminSession().catch(() => null)
      ]);

      if (s) setSettings(s);
      setVehicles(v);
      setCategories(c);
      setServices(srv);
      setReviews(r);
      setGallery(g);
      if (session) setAdminUser(session);
    } catch (err) {
      console.error('Error loading initial dealership data:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  // Hash and Path Routing support
  useEffect(() => {
    const handleRouting = () => {
      // Check pathname
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/')) {
        setCurrentPage('admin');
        return;
      }

      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash) return;

      if (hash.startsWith('vehicle/')) {
        const id = hash.replace('vehicle/', '');
        setSelectedVehicleId(id);
        setCurrentPage('vehicle-details');
      } else if (['admin', 'admin-login', 'login', 'staff', 'portal', 'management', 'owner', 'control'].includes(hash)) {
        setCurrentPage('admin');
      } else if (
        [
          'home',
          'inventory',
          'about',
          'services',
          'financing',
          'trade-in',
          'booking',
          'gallery',
          'contact'
        ].includes(hash)
      ) {
        setCurrentPage(hash as PageView);
      }
    };

    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    window.addEventListener('popstate', handleRouting);

    // Discreet shortcut for owner: Ctrl+Shift+A or Alt+A opens the portal
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        setCurrentPage('admin');
        window.location.hash = 'admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleRouting);
      window.removeEventListener('popstate', handleRouting);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Scroll listener for Back to Top
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Page title dynamic update
  useEffect(() => {
    if (!settings) return;
    const baseTitle = `${settings.businessName} | Kangundo Road, Nairobi`;
    switch (currentPage) {
      case 'home':
        document.title = `${settings.businessName} - Quality Cars for Sale along Kangundo Road, Nairobi`;
        break;
      case 'inventory':
        document.title = `Cars for Sale in Nairobi | ${settings.businessName}`;
        break;
      case 'vehicle-details':
        const activeCar = vehicles.find((v) => v.id === selectedVehicleId);
        document.title = activeCar
          ? `${activeCar.name} for Sale | ${settings.businessName}`
          : `Car Details | ${settings.businessName}`;
        break;
      case 'financing':
        document.title = `Car Asset Financing & Bank Loans | ${settings.businessName}`;
        break;
      case 'trade-in':
        document.title = `Sell or Trade-In Your Car in Nairobi | ${settings.businessName}`;
        break;
      case 'booking':
        document.title = `Book a Viewing & Test Drive | ${settings.businessName}`;
        break;
      case 'services':
        document.title = `Dealership Services | ${settings.businessName}`;
        break;
      case 'gallery':
        document.title = `Showroom Yard & Handover Gallery | ${settings.businessName}`;
        break;
      case 'about':
        document.title = `About Us | ${settings.businessName}`;
        break;
      case 'contact':
        document.title = `Contact & Location (PVHX+6MQ) | ${settings.businessName}`;
        break;
      case 'admin':
        document.title = `Admin Management Portal | ${settings.businessName}`;
        break;
      default:
        document.title = baseTitle;
    }
  }, [currentPage, selectedVehicleId, settings, vehicles]);

  // Navigation Handler
  const handleNavigate = (page: PageView, vehicleId?: string) => {
    if (page === 'vehicle-details' && vehicleId) {
      setSelectedVehicleId(vehicleId);
      window.location.hash = `vehicle/${vehicleId}`;
    } else {
      window.location.hash = page;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenViewing = (vehicle?: Vehicle) => {
    setSelectedVehicleForViewing(vehicle || null);
    setViewingModalOpen(true);
  };

  const handleOpenEnquiry = (defaultSubject?: string, defaultMessage?: string, vehicle?: Vehicle) => {
    setEnquiryDefaultSubject(defaultSubject);
    setEnquiryDefaultMessage(defaultMessage);
    setEnquiryVehicle(vehicle || null);
    setEnquiryModalOpen(true);
  };

  const handleLogout = () => {
    removeAdminToken();
    setAdminUser(null);
    handleNavigate('home');
  };

  if (initialLoading || !settings) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Netwon Cars Kangundo Road</h2>
        <p className="text-xs text-slate-400 mt-1">Loading dealership showroom...</p>
      </div>
    );
  }

  // Selected vehicle for details view
  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const floatingWhatsAppUrl = buildWhatsAppUrl(
    settings.whatsappNumber || settings.phone,
    'Hello Netwon Cars Kangundo Road, I found your website and would like to enquire about your vehicles.'
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* If current page is admin and user is NOT logged in, show Admin Login */}
      {currentPage === 'admin' ? (
        adminUser ? (
          <AdminDashboard
            adminUser={adminUser}
            settings={settings}
            onSettingsUpdated={(updated) => setSettings(updated)}
            onLogout={handleLogout}
            onReturnToWebsite={() => handleNavigate('home')}
          />
        ) : (
          <div className="flex-1">
            <Header
              currentPage={currentPage}
              settings={settings}
              onNavigate={handleNavigate}
              onOpenBookViewing={() => handleOpenViewing()}
            />
            <AdminLogin
              onLoginSuccess={(user) => setAdminUser(user)}
              onBackToWebsite={() => handleNavigate('home')}
            />
            <Footer
              settings={settings}
              onNavigate={handleNavigate}
              onOpenReviewModal={() => setReviewModalOpen(true)}
            />
          </div>
        )
      ) : (
        <>
          {/* Main Website Header */}
          <Header
            currentPage={currentPage}
            settings={settings}
            onNavigate={handleNavigate}
            onOpenBookViewing={() => handleOpenViewing()}
          />

          {/* Page Routing */}
          <main className="flex-1 pb-20 sm:pb-12">
            {currentPage === 'home' && (
              <HomePage
                settings={settings}
                vehicles={vehicles}
                categories={categories}
                services={services}
                reviews={reviews}
                onNavigate={handleNavigate}
                onOpenViewingModal={handleOpenViewing}
                onOpenEnquiryModal={handleOpenEnquiry}
              />
            )}

            {currentPage === 'inventory' && (
              <InventoryPage
                vehicles={vehicles}
                categories={categories}
                onNavigate={handleNavigate}
                onOpenViewingModal={handleOpenViewing}
                onOpenEnquiryModal={handleOpenEnquiry}
              />
            )}

            {currentPage === 'vehicle-details' && (
              <VehicleDetailsPage
                vehicle={currentVehicle}
                similarVehicles={vehicles.filter(
                  (v) =>
                    v.id !== currentVehicle.id &&
                    (v.bodyType === currentVehicle.bodyType || v.make === currentVehicle.make)
                )}
                settings={settings}
                onNavigate={handleNavigate}
                onOpenViewingModal={handleOpenViewing}
                onOpenEnquiryModal={handleOpenEnquiry}
              />
            )}

            {currentPage === 'financing' && (
              <FinancingPage
                settings={settings}
                vehicles={vehicles}
                onNavigate={handleNavigate}
                onOpenEnquiryModal={handleOpenEnquiry}
              />
            )}

            {currentPage === 'trade-in' && <TradeInPage settings={settings} />}

            {currentPage === 'booking' && <BookingPage vehicles={vehicles} settings={settings} />}

            {currentPage === 'gallery' && <GalleryPage gallery={gallery} />}

            {currentPage === 'services' && (
              <ServicesPage
                services={services}
                settings={settings}
                onOpenEnquiryModal={handleOpenEnquiry}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage settings={settings} onNavigate={handleNavigate} />
            )}

            {currentPage === 'contact' && <ContactPage settings={settings} />}
          </main>

          {/* Main Website Footer */}
          <Footer
            settings={settings}
            onNavigate={handleNavigate}
            onOpenReviewModal={() => setReviewModalOpen(true)}
          />

          {/* Floating WhatsApp CTA Button */}
          <aside
            aria-label="Contact Assistance"
            className="fixed bottom-20 sm:bottom-8 right-5 sm:right-8 z-40 flex flex-col items-end gap-3"
          >
            {showBackToTop && (
              <button
                id="btn-back-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center shadow-xl hover:bg-slate-800 transition-all"
                aria-label="Scroll to top"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            )}

            <a
              id="floating-whatsapp-btn"
              href={floatingWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp with Netwon Cars Kangundo Road"
              className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xl shadow-emerald-950/80 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-600 animate-pulse" />
              </div>
              <span className="hidden sm:inline">WhatsApp Netwon Cars</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </aside>

          {/* Authenticated Owner Quick Switcher (ONLY rendered when currently logged in) */}
          {adminUser && currentPage !== 'admin' && (
            <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40">
              <button
                id="btn-return-admin-dashboard"
                onClick={() => handleNavigate('admin')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-amber-500/40 text-amber-400 text-xs font-semibold shadow-xl backdrop-blur-md transition-all hover:scale-105"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          )}

          {/* Mobile Bottom Quick-Action Bar */}
          <nav
            aria-label="Mobile Quick Actions"
            className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-between gap-2"
          >
            <a
              id="mobile-bar-call"
              href={buildTelUrl(settings.phone)}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:bg-slate-600"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Yard</span>
            </a>

            <a
              id="mobile-bar-whatsapp"
              href={floatingWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:bg-emerald-700"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>

            <button
              id="mobile-bar-booking"
              onClick={() => handleOpenViewing()}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:bg-amber-600"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Viewing</span>
            </button>
          </nav>
        </>
      )}

      {/* Global Modals */}
      <ViewingModal
        isOpen={viewingModalOpen}
        onClose={() => setViewingModalOpen(false)}
        vehicle={selectedVehicleForViewing}
      />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultSubject={enquiryDefaultSubject}
        defaultMessage={enquiryDefaultMessage}
        vehicle={enquiryVehicle}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewSubmitted={(newRev) => setReviews([newRev, ...reviews])}
      />
    </div>
  );
}
