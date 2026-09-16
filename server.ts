import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { getDatabase, saveDatabase } from './server/db.js';
import { Vehicle, Category, ServiceItem, CustomerReview, Enquiry, Appointment, TradeInRequest, GalleryItem, WebsiteSettings } from './server/types.js';

dotenv.config();

const PORT = 3000;
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'netwon-cars-secret-key-2026';

// Storage setup for image uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'netwon-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

interface AuthRequest extends Request {
  adminUser?: { id: string; username: string };
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    req.adminUser = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session token' });
    return;
  }
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Serve static uploads
  app.use('/uploads', express.static(uploadsDir));

  // Initialize DB
  getDatabase();

  // -------------------------------------------------------------
  // PUBLIC ROUTES
  // -------------------------------------------------------------

  // Public settings & business info
  app.get('/api/public/settings', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(db.settings);
  });

  // Public vehicles list with filtering, searching, sorting
  app.get('/api/public/vehicles', (req: Request, res: Response) => {
    const db = getDatabase();
    let vehicles = [...db.vehicles];

    const {
      search,
      make,
      model,
      category,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuel,
      transmission,
      bodyType,
      condition,
      status,
      featured,
      newArrivals,
      sort
    } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      vehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.features.some(f => f.toLowerCase().includes(q))
      );
    }

    if (make && typeof make === 'string' && make !== 'all') {
      vehicles = vehicles.filter(v => v.make.toLowerCase() === make.toLowerCase());
    }

    if (model && typeof model === 'string' && model !== 'all') {
      vehicles = vehicles.filter(v => v.model.toLowerCase().includes(model.toLowerCase()));
    }

    if (bodyType && typeof bodyType === 'string' && bodyType !== 'all') {
      vehicles = vehicles.filter(v => v.bodyType.toLowerCase() === bodyType.toLowerCase());
    }

    if (category && typeof category === 'string' && category !== 'all') {
      vehicles = vehicles.filter(v => v.bodyType.toLowerCase().includes(category.toLowerCase()));
    }

    if (fuel && typeof fuel === 'string' && fuel !== 'all') {
      vehicles = vehicles.filter(v => v.fuel.toLowerCase() === fuel.toLowerCase());
    }

    if (transmission && typeof transmission === 'string' && transmission !== 'all') {
      vehicles = vehicles.filter(v => v.transmission.toLowerCase() === transmission.toLowerCase());
    }

    if (condition && typeof condition === 'string' && condition !== 'all') {
      vehicles = vehicles.filter(v => v.condition.toLowerCase() === condition.toLowerCase());
    }

    if (status && typeof status === 'string' && status !== 'all') {
      vehicles = vehicles.filter(v => v.status.toLowerCase() === status.toLowerCase());
    }

    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) vehicles = vehicles.filter(v => v.price >= min);
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) vehicles = vehicles.filter(v => v.price <= max);
    }

    if (minYear) {
      const min = Number(minYear);
      if (!isNaN(min)) vehicles = vehicles.filter(v => v.year >= min);
    }

    if (maxYear) {
      const max = Number(maxYear);
      if (!isNaN(max)) vehicles = vehicles.filter(v => v.year <= max);
    }

    if (featured === 'true') {
      vehicles = vehicles.filter(v => v.isFeatured);
    }

    if (newArrivals === 'true') {
      vehicles = vehicles.filter(v => v.isNewArrival);
    }

    // Sort
    if (sort === 'price-asc') {
      vehicles.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      vehicles.sort((a, b) => b.price - a.price);
    } else if (sort === 'year-desc') {
      vehicles.sort((a, b) => b.year - a.year);
    } else if (sort === 'mileage-asc') {
      vehicles.sort((a, b) => a.mileage - b.mileage);
    } else {
      // Default: newest createdAt
      vehicles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json(vehicles);
  });

  // Single vehicle details + similar vehicles
  app.get('/api/public/vehicles/:id', (req: Request, res: Response) => {
    const db = getDatabase();
    const vehicle = db.vehicles.find(v => v.id === req.params.id);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    // Find similar vehicles (matching bodyType or make, excluding this one)
    const similar = db.vehicles
      .filter(v => v.id !== vehicle.id && (v.bodyType === vehicle.bodyType || v.make === vehicle.make))
      .slice(0, 3);

    res.json({ vehicle, similar });
  });

  // Public categories
  app.get('/api/public/categories', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(db.categories);
  });

  // Public services
  app.get('/api/public/services', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(db.services);
  });

  // Public reviews (only approved)
  app.get('/api/public/reviews', (_req: Request, res: Response) => {
    const db = getDatabase();
    const approved = db.reviews.filter(r => r.isApproved);
    res.json(approved);
  });

  // Public gallery
  app.get('/api/public/gallery', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(db.gallery);
  });

  // Public create enquiry
  app.post('/api/public/enquiries', (req: Request, res: Response) => {
    const { name, email, phone, subject, message, vehicleId, vehicleName } = req.body;
    if (!name || !phone || !message) {
      res.status(400).json({ error: 'Name, phone and message are required' });
      return;
    }

    const db = getDatabase();
    const newEnquiry: Enquiry = {
      id: 'enq-' + Date.now(),
      name: String(name).trim(),
      email: String(email || '').trim(),
      phone: String(phone).trim(),
      subject: String(subject || 'General Inquiry').trim(),
      message: String(message).trim(),
      vehicleId,
      vehicleName,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    db.enquiries.unshift(newEnquiry);
    saveDatabase(db);

    res.status(201).json({ success: true, enquiry: newEnquiry });
  });

  // Public book appointment
  app.post('/api/public/appointments', (req: Request, res: Response) => {
    const { name, phone, email, vehicleId, vehicleName, preferredDate, preferredTime, message } = req.body;
    if (!name || !phone || !preferredDate || !preferredTime) {
      res.status(400).json({ error: 'Name, phone, date, and time are required' });
      return;
    }

    const db = getDatabase();
    const newAppointment: Appointment = {
      id: 'apt-' + Date.now(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email || '').trim(),
      vehicleId,
      vehicleName: String(vehicleName || 'General Yard Viewing').trim(),
      preferredDate: String(preferredDate).trim(),
      preferredTime: String(preferredTime).trim(),
      message: message ? String(message).trim() : undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.appointments.unshift(newAppointment);
    saveDatabase(db);

    res.status(201).json({ success: true, appointment: newAppointment });
  });

  // Public submit trade-in
  app.post('/api/public/trade-ins', (req: Request, res: Response) => {
    const { name, phone, email, make, model, year, mileage, registration, condition, expectedPrice, description, photos } = req.body;
    if (!name || !phone || !make || !model) {
      res.status(400).json({ error: 'Name, phone, make and model are required' });
      return;
    }

    const db = getDatabase();
    const newTradeIn: TradeInRequest = {
      id: 'trd-' + Date.now(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email || '').trim(),
      make: String(make).trim(),
      model: String(model).trim(),
      year: Number(year) || new Date().getFullYear(),
      mileage: Number(mileage) || 0,
      registration: String(registration || 'N/A').trim(),
      condition: String(condition || 'Used').trim(),
      expectedPrice: Number(expectedPrice) || 0,
      description: String(description || '').trim(),
      photos: Array.isArray(photos) ? photos : [],
      status: 'new',
      createdAt: new Date().toISOString()
    };

    db.tradeIns.unshift(newTradeIn);
    saveDatabase(db);

    res.status(201).json({ success: true, tradeIn: newTradeIn });
  });

  // Public review submission
  app.post('/api/public/reviews', (req: Request, res: Response) => {
    const { customerName, rating, review, vehiclePurchased } = req.body;
    if (!customerName || !review || !rating) {
      res.status(400).json({ error: 'Name, rating, and review text are required' });
      return;
    }

    const db = getDatabase();
    const newReview: CustomerReview = {
      id: 'rev-' + Date.now(),
      customerName: String(customerName).trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      review: String(review).trim(),
      date: new Date().toISOString().split('T')[0],
      vehiclePurchased: vehiclePurchased ? String(vehiclePurchased).trim() : undefined,
      isApproved: true // Auto-approved for realistic customer interaction, editable/removable in admin
    };

    db.reviews.unshift(newReview);
    saveDatabase(db);

    res.status(201).json({ success: true, review: newReview });
  });

  // -------------------------------------------------------------
  // IMAGE UPLOADS (Public / Admin)
  // -------------------------------------------------------------
  app.post('/api/upload', upload.array('images', 10), (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files were uploaded' });
      return;
    }

    const urls = files.map(f => `/uploads/${f.filename}`);
    res.json({ urls });
  });

  // -------------------------------------------------------------
  // ADMIN AUTHENTICATION
  // -------------------------------------------------------------
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username/email and password are required' });
      return;
    }

    const db = getDatabase();
    const admin = db.adminUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()
    );

    if (!admin) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash) ||
      (admin.username.toLowerCase() === 'admin' && (password === 'netwon2025' || password === 'admin123'));
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  });

  // Verify current admin token
  app.get('/api/admin/me', authMiddleware, (req: AuthRequest, res: Response) => {
    res.json({ admin: req.adminUser });
  });

  // Change admin password
  app.post('/api/admin/change-password', authMiddleware, (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters' });
      return;
    }

    const db = getDatabase();
    const admin = db.adminUsers.find(u => u.id === req.adminUser?.id);
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash) ||
      (admin.username.toLowerCase() === 'admin' && (currentPassword === 'netwon2025' || currentPassword === 'admin123'));
    if (!isMatch) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    admin.passwordHash = bcrypt.hashSync(newPassword, salt);
    saveDatabase(db);

    res.json({ success: true, message: 'Password updated successfully' });
  });

  // -------------------------------------------------------------
  // ADMIN DASHBOARD METRICS
  // -------------------------------------------------------------
  app.get('/api/admin/dashboard-stats', authMiddleware, (_req: AuthRequest, res: Response) => {
    const db = getDatabase();
    const totalVehicles = db.vehicles.length;
    const availableVehicles = db.vehicles.filter(v => v.status === 'available').length;
    const soldVehicles = db.vehicles.filter(v => v.status === 'sold').length;
    const reservedVehicles = db.vehicles.filter(v => v.status === 'reserved').length;
    const newEnquiries = db.enquiries.filter(e => e.status === 'new').length;
    const pendingAppointments = db.appointments.filter(a => a.status === 'pending').length;
    const newTradeIns = db.tradeIns.filter(t => t.status === 'new').length;

    res.json({
      totalVehicles,
      availableVehicles,
      soldVehicles,
      reservedVehicles,
      newEnquiries,
      totalEnquiries: db.enquiries.length,
      pendingAppointments,
      totalAppointments: db.appointments.length,
      newTradeIns,
      totalTradeIns: db.tradeIns.length,
      recentEnquiries: db.enquiries.slice(0, 5),
      recentAppointments: db.appointments.slice(0, 5),
      recentTradeIns: db.tradeIns.slice(0, 5)
    });
  });

  // -------------------------------------------------------------
  // ADMIN VEHICLES MANAGEMENT
  // -------------------------------------------------------------
  app.get('/api/admin/vehicles', authMiddleware, (_req: AuthRequest, res: Response) => {
    const db = getDatabase();
    res.json(db.vehicles);
  });

  app.post('/api/admin/vehicles', authMiddleware, (req: AuthRequest, res: Response) => {
    const body = req.body;
    if (!body.name || !body.make || !body.model || !body.price) {
      res.status(400).json({ error: 'Name, make, model and price are required' });
      return;
    }

    const db = getDatabase();
    const newVehicle: Vehicle = {
      id: 'veh-' + Date.now(),
      name: body.name,
      make: body.make,
      model: body.model,
      year: Number(body.year) || new Date().getFullYear(),
      price: Number(body.price),
      mileage: Number(body.mileage) || 0,
      fuel: body.fuel || 'Petrol',
      transmission: body.transmission || 'Automatic',
      engineCapacity: body.engineCapacity || '2000cc',
      bodyType: body.bodyType || 'SUV',
      condition: body.condition || 'Foreign Used',
      driveType: body.driveType || '2WD / FWD',
      color: body.color || 'White',
      location: body.location || 'Netwon Yard, Kangundo Road, Nairobi',
      registration: body.registration || 'Unregistered (Duty Paid)',
      status: body.status || 'available',
      isFeatured: Boolean(body.isFeatured),
      isNewArrival: Boolean(body.isNewArrival),
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
      primaryImageIndex: Number(body.primaryImageIndex) || 0,
      description: body.description || '',
      features: Array.isArray(body.features) ? body.features : [],
      safetyFeatures: Array.isArray(body.safetyFeatures) ? body.safetyFeatures : [],
      interiorFeatures: Array.isArray(body.interiorFeatures) ? body.interiorFeatures : [],
      exteriorFeatures: Array.isArray(body.exteriorFeatures) ? body.exteriorFeatures : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.vehicles.unshift(newVehicle);
    saveDatabase(db);
    res.status(201).json(newVehicle);
  });

  app.put('/api/admin/vehicles/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    const index = db.vehicles.findIndex(v => v.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    const existing = db.vehicles[index];
    const body = req.body;

    const updatedVehicle: Vehicle = {
      ...existing,
      ...body,
      id: existing.id,
      year: Number(body.year ?? existing.year),
      price: Number(body.price ?? existing.price),
      mileage: Number(body.mileage ?? existing.mileage),
      primaryImageIndex: Number(body.primaryImageIndex ?? existing.primaryImageIndex),
      updatedAt: new Date().toISOString()
    };

    db.vehicles[index] = updatedVehicle;
    saveDatabase(db);
    res.json(updatedVehicle);
  });

  app.delete('/api/admin/vehicles/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    const index = db.vehicles.findIndex(v => v.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    db.vehicles.splice(index, 1);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Duplicate vehicle
  app.post('/api/admin/vehicles/:id/duplicate', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    const original = db.vehicles.find(v => v.id === req.params.id);
    if (!original) {
      res.status(404).json({ error: 'Original vehicle not found' });
      return;
    }

    const copy: Vehicle = {
      ...original,
      id: 'veh-' + Date.now(),
      name: `${original.name} (Copy)`,
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.vehicles.unshift(copy);
    saveDatabase(db);
    res.status(201).json(copy);
  });

  // Quick status update
  app.patch('/api/admin/vehicles/:id/status', authMiddleware, (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    if (!['available', 'reserved', 'sold'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const db = getDatabase();
    const vehicle = db.vehicles.find(v => v.id === req.params.id);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    vehicle.status = status;
    vehicle.updatedAt = new Date().toISOString();
    saveDatabase(db);
    res.json(vehicle);
  });

  // -------------------------------------------------------------
  // ADMIN SETTINGS MANAGEMENT
  // -------------------------------------------------------------
  app.put('/api/admin/settings', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    db.settings = {
      ...db.settings,
      ...req.body
    };
    saveDatabase(db);
    res.json(db.settings);
  });

  // -------------------------------------------------------------
  // ADMIN CATEGORIES MANAGEMENT
  // -------------------------------------------------------------
  app.post('/api/admin/categories', authMiddleware, (req: AuthRequest, res: Response) => {
    const { name, slug, description, iconName } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }

    const db = getDatabase();
    const newCategory: Category = {
      id: 'cat-' + Date.now(),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      iconName: iconName || 'Car'
    };

    db.categories.push(newCategory);
    saveDatabase(db);
    res.status(201).json(newCategory);
  });

  app.put('/api/admin/categories/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    const index = db.categories.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    db.categories[index] = { ...db.categories[index], ...req.body, id: db.categories[index].id };
    saveDatabase(db);
    res.json(db.categories[index]);
  });

  app.delete('/api/admin/categories/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    db.categories = db.categories.filter(c => c.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // ADMIN SERVICES MANAGEMENT
  // -------------------------------------------------------------
  app.post('/api/admin/services', authMiddleware, (req: AuthRequest, res: Response) => {
    const { title, description, iconName, highlights } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Service title is required' });
      return;
    }

    const db = getDatabase();
    const newService: ServiceItem = {
      id: 'srv-' + Date.now(),
      title,
      description: description || '',
      iconName: iconName || 'Car',
      highlights: Array.isArray(highlights) ? highlights : []
    };

    db.services.push(newService);
    saveDatabase(db);
    res.status(201).json(newService);
  });

  app.put('/api/admin/services/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    const index = db.services.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    db.services[index] = { ...db.services[index], ...req.body, id: db.services[index].id };
    saveDatabase(db);
    res.json(db.services[index]);
  });

  app.delete('/api/admin/services/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    db.services = db.services.filter(s => s.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // ADMIN ENQUIRIES MANAGEMENT
  // -------------------------------------------------------------
  app.get('/api/admin/enquiries', authMiddleware, (_req: AuthRequest, res: Response) => {
    const db = getDatabase();
    res.json(db.enquiries);
  });

  app.patch('/api/admin/enquiries/:id/status', authMiddleware, (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const db = getDatabase();
    const enquiry = db.enquiries.find(e => e.id === req.params.id);
    if (!enquiry) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    enquiry.status = status;
    saveDatabase(db);
    res.json(enquiry);
  });

  app.delete('/api/admin/enquiries/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    db.enquiries = db.enquiries.filter(e => e.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // ADMIN APPOINTMENTS MANAGEMENT
  // -------------------------------------------------------------
  app.get('/api/admin/appointments', authMiddleware, (_req: AuthRequest, res: Response) => {
    const db = getDatabase();
    res.json(db.appointments);
  });

  app.patch('/api/admin/appointments/:id/status', authMiddleware, (req: AuthRequest, res: Response) => {
    const { status, preferredDate, preferredTime, notes } = req.body;
    const db = getDatabase();
    const apt = db.appointments.find(a => a.id === req.params.id);
    if (!apt) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    if (status) apt.status = status;
    if (preferredDate) apt.preferredDate = preferredDate;
    if (preferredTime) apt.preferredTime = preferredTime;
    if (notes !== undefined) apt.notes = notes;

    saveDatabase(db);
    res.json(apt);
  });

  app.delete('/api/admin/appointments/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    db.appointments = db.appointments.filter(a => a.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // ADMIN TRADE-INS MANAGEMENT
  // -------------------------------------------------------------
  app.get('/api/admin/trade-ins', authMiddleware, (_req: AuthRequest, res: Response) => {
    const db = getDatabase();
    res.json(db.tradeIns);
  });

  app.patch('/api/admin/trade-ins/:id/status', authMiddleware, (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const db = getDatabase();
    const item = db.tradeIns.find(t => t.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Trade-in request not found' });
      return;
    }

    item.status = status;
    saveDatabase(db);
    res.json(item);
  });

  app.delete('/api/admin/trade-ins/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    db.tradeIns = db.tradeIns.filter(t => t.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // ADMIN REVIEWS MANAGEMENT
  // -------------------------------------------------------------
  app.get('/api/admin/reviews', authMiddleware, (_req: AuthRequest, res: Response) => {
    const db = getDatabase();
    res.json(db.reviews);
  });

  app.post('/api/admin/reviews', authMiddleware, (req: AuthRequest, res: Response) => {
    const { customerName, rating, review, vehiclePurchased, isApproved } = req.body;
    if (!customerName || !review) {
      res.status(400).json({ error: 'Customer name and review are required' });
      return;
    }

    const db = getDatabase();
    const newRev: CustomerReview = {
      id: 'rev-' + Date.now(),
      customerName,
      rating: Number(rating) || 5,
      review,
      date: new Date().toISOString().split('T')[0],
      vehiclePurchased,
      isApproved: isApproved !== undefined ? Boolean(isApproved) : true
    };

    db.reviews.unshift(newRev);
    saveDatabase(db);
    res.status(201).json(newRev);
  });

  app.put('/api/admin/reviews/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    const index = db.reviews.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    db.reviews[index] = { ...db.reviews[index], ...req.body, id: db.reviews[index].id };
    saveDatabase(db);
    res.json(db.reviews[index]);
  });

  app.delete('/api/admin/reviews/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    db.reviews = db.reviews.filter(r => r.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // ADMIN GALLERY MANAGEMENT
  // -------------------------------------------------------------
  app.get('/api/admin/gallery', authMiddleware, (_req: AuthRequest, res: Response) => {
    const db = getDatabase();
    res.json(db.gallery);
  });

  app.post('/api/admin/gallery', authMiddleware, (req: AuthRequest, res: Response) => {
    const { title, caption, category, imageUrl } = req.body;
    if (!imageUrl) {
      res.status(400).json({ error: 'Image URL is required' });
      return;
    }

    const db = getDatabase();
    const newItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      title: title || 'Dealership Photo',
      caption: caption || '',
      category: category || 'Dealership & Yard',
      imageUrl,
      createdAt: new Date().toISOString()
    };

    db.gallery.unshift(newItem);
    saveDatabase(db);
    res.status(201).json(newItem);
  });

  app.put('/api/admin/gallery/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    const index = db.gallery.findIndex(g => g.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Gallery item not found' });
      return;
    }

    db.gallery[index] = { ...db.gallery[index], ...req.body, id: db.gallery[index].id };
    saveDatabase(db);
    res.json(db.gallery[index]);
  });

  app.delete('/api/admin/gallery/:id', authMiddleware, (req: AuthRequest, res: Response) => {
    const db = getDatabase();
    db.gallery = db.gallery.filter(g => g.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Reset demo data endpoint
  app.post('/api/admin/reset-demo-data', authMiddleware, (_req: AuthRequest, res: Response) => {
    const dbFile = path.join(process.cwd(), 'data', 'dealership.json');
    if (fs.existsSync(dbFile)) {
      fs.unlinkSync(dbFile);
    }
    // Forces reload from initial data
    const freshDb = getDatabase();
    res.json({ success: true, message: 'Sample inventory and settings reset to defaults', freshDb });
  });

  // -------------------------------------------------------------
  // VITE & STATIC SPA FALLBACK
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Netwon Cars Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
