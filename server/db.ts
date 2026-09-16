import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { DatabaseSchema, Vehicle, Category, ServiceItem, CustomerReview, Enquiry, Appointment, TradeInRequest, GalleryItem, WebsiteSettings, AdminUser } from './types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'dealership.json');

const INITIAL_SETTINGS: WebsiteSettings = {
  businessName: 'Netwon Cars Kangundo Road',
  tagline: 'Find Your Next Car With Confidence',
  category: 'Car Dealer',
  address: 'PVHX+6MQ, Kangundo Road, Nairobi, Kenya',
  landmark: 'Kangundo Road, Near Komarock / Kayole Junction, Nairobi East',
  phone: '0721 135772',
  phoneDisplay: '0721 135772 / +254 721 135772',
  whatsappNumber: '254721135772',
  email: 'sales@netwoncars.co.ke',
  googleRating: 5.0,
  googleReviewCount: 1,
  googleMapsUrl: 'https://maps.google.com/?q=PVHX%2B6MQ,+Kangundo+Road,+Nairobi,+Kenya',
  openingHours: {
    weekdays: 'Monday - Friday: 8:00 AM - 6:00 PM',
    saturday: 'Saturday: 8:30 AM - 5:00 PM',
    sunday: 'Sunday: 10:00 AM - 4:00 PM (By Appointment)'
  },
  heroTitle: 'Find Your Next Car With Confidence',
  heroSubtitle: 'Nairobi’s trusted car dealer located along Kangundo Road. Clean, mechanically certified foreign-used imports and reliable local units with transparent pricing and flexible car financing assistance.',
  heroImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80',
  aboutSummary: 'Netwon Cars Kangundo Road is a premier automobile dealership situated along Kangundo Road in Nairobi, Kenya. We specialize in verified foreign-used vehicles, certified local units, transparent trade-ins, and flexible vehicle financing.',
  aboutStory: 'Founded with a dedication to bring integrity and transparency to Nairobi’s car market, Netwon Cars Kangundo Road serves drivers, business owners, and families across Nairobi and the greater Eastlands corridor. Every car in our yard undergoes a comprehensive 150-point technical check to guarantee authentic mileage, sound mechanical condition, and clean title deeds.',
  mission: 'To provide Kenyans with high-quality, verified motor vehicles backed by transparent pricing, genuine customer care, and seamless ownership transfer.',
  vision: 'To be the most reputable and preferred automotive dealership along Kangundo Road and across Nairobi, setting the benchmark for automotive reliability.',
  values: [
    { title: 'Integrity First', desc: 'No manipulated odometers or hidden defects. We disclose every single vehicle detail upfront.' },
    { title: 'Customer Confidence', desc: 'From pre-purchase inspection to swift logbook transfer, we safeguard your peace of mind.' },
    { title: 'Quality Assurance', desc: 'Every foreign used import and trade-in unit is meticulously inspected by expert mechanics.' },
    { title: 'Fair Market Pricing', desc: 'Competitive Kenyan Shillings pricing tailored to deliver true value without hidden fees.' }
  ],
  whyChooseUs: [
    { title: '150-Point Inspection', desc: 'Thoroughly tested engine, transmission, suspension, and electrics before listing.', icon: 'ShieldCheck' },
    { title: 'Fast Logbook Transfer', desc: 'Guaranteed seamless NTSA TIMS logbook transfer directly into your name.', icon: 'FileText' },
    { title: 'Bank Financing Guidance', desc: 'Partnership with top Kenyan commercial banks and micro-financiers with up to 80% financing.', icon: 'CreditCard' },
    { title: 'Trade-in Welcomed', desc: 'Fair, fast valuation for your current vehicle with instant trade-in settlement.', icon: 'Repeat' }
  ],
  financingInfo: {
    intro: 'Drive home your dream car today with flexible asset financing through leading Kenyan banks and registered microfinance partners.',
    maxLoanDurationMonths: 48,
    minimumDepositPercent: 20,
    standardInterestRatePercent: 13,
    partnerBanks: ['Co-operative Bank', 'KCB Bank', 'NCBA Bank', 'Stanbic Bank', 'Equity Bank', 'Family Bank'],
    disclaimer: 'Calculations provided here are estimates. Actual loan amounts, interest rates, and monthly repayments are subject to bank credit assessment and approval.'
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com'
  },
  footerText: '© 2026 Netwon Cars Kangundo Road. All rights reserved. Located at PVHX+6MQ, Kangundo Road, Nairobi, Kenya.'
};

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-suv', name: 'SUVs', slug: 'suvs', description: 'Versatile, high-clearance sport utility vehicles for Nairobi roads and upcountry safaris.', iconName: 'Compass' },
  { id: 'cat-sedan', name: 'Sedans', slug: 'sedans', description: 'Executive, stylish, and comfortable sedans for daily city commuting.', iconName: 'Car' },
  { id: 'cat-hatchback', name: 'Hatchbacks', slug: 'hatchbacks', description: 'Fuel-efficient, easy-to-park compact cars for urban mobility.', iconName: 'Zap' },
  { id: 'cat-station-wagon', name: 'Station Wagons', slug: 'station-wagons', description: 'Practical and spacious wagons ideal for family errands and road trips.', iconName: 'Truck' },
  { id: 'cat-pickup', name: 'Pickups', slug: 'pickups', description: 'Tough 4x4 and 4x2 workhorses engineered for rugged hauling and commercial power.', iconName: 'Hammer' },
  { id: 'cat-van', name: 'Vans', slug: 'vans', description: 'Passenger and utility multi-seaters designed for business logistics.', iconName: 'Users' },
  { id: 'cat-commercial', name: 'Commercial Vehicles', slug: 'commercial-vehicles', description: 'Reliable trucks and transport vehicles built to grow your business.', iconName: 'Briefcase' },
  { id: 'cat-luxury', name: 'Luxury Cars', slug: 'luxury-cars', description: 'Prestige European and Japanese luxury marques offering cutting-edge comfort.', iconName: 'Crown' },
  { id: 'cat-family', name: 'Family Cars', slug: 'family-cars', description: 'Reliable 7-seaters and spacious cruisers with advanced safety for your loved ones.', iconName: 'Heart' }
];

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Quality Car Sales',
    description: 'We stock rigorously vetted foreign used imports and verified Kenyan local units at fair, transparent market prices.',
    iconName: 'Car',
    highlights: ['150-Point Inspection', 'Genuine Mileage Guarantee', 'Clean Legal Documentation']
  },
  {
    id: 'srv-2',
    title: 'Direct Vehicle Sourcing',
    description: 'Looking for a specific model, year, or color? We source, inspect, bid, and import vehicles directly from Japan, UK, and Singapore.',
    iconName: 'Search',
    highlights: ['Auction Sheet Verification', 'Full Import Duty Clearance', 'Port Clearance to Nairobi Yard']
  },
  {
    id: 'srv-3',
    title: 'Vehicle Viewing & Test Drives',
    description: 'Visit our secure yard along Kangundo Road to inspect vehicles in person and experience them firsthand on test drives.',
    iconName: 'Eye',
    highlights: ['Accessible Kangundo Road Yard', 'Accompanied Test Drives', 'Bring Your Trusted Mechanic']
  },
  {
    id: 'srv-4',
    title: 'Pre-Purchase Vehicle Inspection',
    description: 'Complete diagnostic health checks covering engine compression, suspension, transmission fluid, and chassis condition.',
    iconName: 'CheckCircle',
    highlights: ['Computer Diagnostics', 'Odometer Verification', 'Chassis Alignment Check']
  },
  {
    id: 'srv-5',
    title: 'Trade-in & Vehicle Valuation',
    description: 'Upgrade your vehicle with ease. We offer fair market evaluations on your current car and deduct its value towards your next ride.',
    iconName: 'Repeat',
    highlights: ['Same-Day Valuation', 'Fast Top-up Financing', 'Hassle-Free Handover']
  },
  {
    id: 'srv-6',
    title: 'Asset & Bank Financing Guidance',
    description: 'We partner with top Kenyan commercial banks and microfinance institutions to help you secure up to 80% vehicle financing.',
    iconName: 'CreditCard',
    highlights: ['Up to 48 Months Repayment', 'Competitive Interest Rates', 'Assistance with Bank Paperwork']
  },
  {
    id: 'srv-7',
    title: 'Documentation & NTSA Transfer',
    description: 'We handle the entire logbook transfer process via the NTSA TIMS portal to ensure quick and lawful ownership handover.',
    iconName: 'FileText',
    highlights: ['Swift TIMS Logbook Transfer', 'Duty & Tax Verification', 'Clear Ownership Guarantee']
  },
  {
    id: 'srv-8',
    title: 'Dedicated Customer Support',
    description: 'Our relationship doesn’t end at the sale. Enjoy continuous advice on genuine spare parts, reputable garages, and servicing.',
    iconName: 'Headphones',
    highlights: ['After-Sale Guidance', 'Parts & Servicing Recommendations', 'Long-term Client Care']
  }
];

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    name: '2018 Toyota Land Cruiser Prado TX-L 2.8L Diesel',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2018,
    price: 6450000,
    mileage: 44200,
    fuel: 'Diesel',
    transmission: 'Automatic',
    engineCapacity: '2800cc',
    bodyType: 'SUV',
    condition: 'Foreign Used',
    driveType: '4WD',
    color: 'Pearl White Metallic',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'Unregistered (Duty Paid)',
    status: 'available',
    isFeatured: true,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'Immaculate 2018 Toyota Land Cruiser Prado TX-L 2.8L Turbo Diesel (1GD Engine). Finished in factory Pearl White with full beige leather upholstery. Features 7 electric-folding seats, 360-degree cameras, radar cruise control, sunroof, and genuine 44,200 km verified by auction sheet. Ready for showroom viewing along Kangundo Road.',
    features: ['Sunroof', 'Beige Leather Seats', '7 Seater', '360° Panoramic Cameras', 'Push Start / Stop', 'Keyless Smart Entry', '18-Inch Factory Alloys', 'Roof Rails', 'Side Steps', 'LED Headlights with DRL'],
    safetyFeatures: ['Toyota Safety Sense (TSS)', 'Pre-Collision Braking', 'Lane Departure Alert', '8 SRS Airbags', 'Downhill Assist Control (DAC)', 'ABS with EBD'],
    interiorFeatures: ['Dual Zone Climate Control', 'Electric Memory Driver Seat', 'Heated & Cooled Front Seats', 'Multi-Function Steering Wheel', 'Android Auto / Apple CarPlay'],
    exteriorFeatures: ['Original Modellista Front Bumper Lip', 'Chrome Grille Surround', 'Heated Wing Mirrors', 'Rear Camera with Guidelines'],
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-10T14:30:00.000Z'
  },
  {
    id: 'veh-2',
    name: '2017 Mazda CX-5 XD L-Package 2.2L Diesel AWD',
    make: 'Mazda',
    model: 'CX-5',
    year: 2017,
    price: 2850000,
    mileage: 58000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    engineCapacity: '2200cc',
    bodyType: 'SUV',
    condition: 'Foreign Used',
    driveType: 'AWD',
    color: 'Soul Red Crystal Metallic',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'Unregistered (Duty Paid)',
    status: 'available',
    isFeatured: true,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'Iconic Soul Red Mazda CX-5 XD L-Package. Top-tier luxury trim fitted with Bose 10-speaker premium audio system, heads-up display (HUD), plush black perforated leather seats, sunroof, and i-ACTIV AWD. Renowned for outstanding fuel economy and responsive SkyActiv-D twin turbo power.',
    features: ['Bose Premium Audio', 'Heads-Up Display', 'Full Black Leather', 'Heated Front Seats', 'Power Tailgate', 'Adaptive LED Headlamps', '19-Inch Diamond Cut Alloys', 'Radar Cruise Control'],
    safetyFeatures: ['i-ACTIVSENSE Safety Suite', 'Blind Spot Monitoring', 'Smart City Brake Support', 'Lane Keep Assist', 'Front & Rear Parking Sensors'],
    interiorFeatures: ['Memory Driver Seat', 'Dual-Zone Air Conditioning', 'Mazda Connect Screen', 'Leather-Wrapped Multifunction Steering'],
    exteriorFeatures: ['Soul Red Premium Paint', 'Dual Chrome Exhausts', 'Rear Privacy Glass', 'Roof Spoiler'],
    createdAt: '2026-03-02T11:00:00.000Z',
    updatedAt: '2026-03-12T09:15:00.000Z'
  },
  {
    id: 'veh-3',
    name: '2018 Toyota Harrier Elegance 2.0L Petrol',
    make: 'Toyota',
    model: 'Harrier',
    year: 2018,
    price: 3450000,
    mileage: 51200,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '2000cc',
    bodyType: 'SUV',
    condition: 'Foreign Used',
    driveType: '2WD / FWD',
    color: 'Obsidian Black',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'Unregistered (Duty Paid)',
    status: 'available',
    isFeatured: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'Sleek and luxurious 2018 Toyota Harrier Elegance package. High road presence with ultra-smooth 2.0L petrol engine, panoramic moonroof, premium suede and leather upholstery, electric tailgate, and sequential LED turn indicators. Mechanically pristine and inspected.',
    features: ['Panoramic Moonroof', 'Electric Tailgate', 'Sequential Turn Signals', 'Half Leather / Suede Seats', 'Keyless Go', 'Eco & Sport Drive Modes', '18-Inch Alloy Rims'],
    safetyFeatures: ['Toyota Safety Sense P', 'Autonomous Emergency Braking', 'Lane Departure Prevention', '7 Airbags', 'Rear Cross Traffic Alert'],
    interiorFeatures: ['Ambient Cabin Lighting', 'Touch-Sensitive Climate Controls', 'Leather Steering Wheel', 'High Resolution Infotainment'],
    exteriorFeatures: ['Sleek Hawk-Eye LED Headlamps', 'Modellista Accents', 'Tinted UV-Cut Privacy Windows'],
    createdAt: '2026-03-03T12:00:00.000Z',
    updatedAt: '2026-03-14T08:00:00.000Z'
  },
  {
    id: 'veh-4',
    name: '2017 Subaru Outback 2.5i Eyesight Limited AWD',
    make: 'Subaru',
    model: 'Outback',
    year: 2017,
    price: 2980000,
    mileage: 62000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '2500cc',
    bodyType: 'Station Wagon',
    condition: 'Foreign Used',
    driveType: 'AWD',
    color: 'Tungsten Metallic',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'Unregistered (Duty Paid)',
    status: 'available',
    isFeatured: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'The definitive Kenyan long-distance traveler: Subaru Outback 2.5i Limited featuring Symmetrical All-Wheel Drive and X-Mode. Outfitted with Subaru Eyesight version 3, premium black leather, Harman Kardon audio, high ground clearance, and generous trunk capacity.',
    features: ['Symmetrical AWD with X-Mode', 'Harman Kardon Sound', 'Subaru Eyesight v3', 'Sunroof', 'Black Leather Seats', 'Paddle Shifters', 'Power Rear Gate', '18-Inch Factory Wheels'],
    safetyFeatures: ['EyeSight Pre-Collision Assist', 'Lead Vehicle Start Alert', 'Traction Control System (VDC)', 'Reverse Camera with Sensor Alerts'],
    interiorFeatures: ['Electric Heated Seats', 'Dual Climate Control', 'Subaru Starlink Touchscreen', 'Split Folding Rear Seats'],
    exteriorFeatures: ['Heavy-Duty Roof Rails with Crossbars', 'Rugged Lower Cladding', 'Projector Headlamps with Washers'],
    createdAt: '2026-03-04T13:00:00.000Z',
    updatedAt: '2026-03-15T10:00:00.000Z'
  },
  {
    id: 'veh-5',
    name: '2018 Isuzu D-Max Double Cab 2.5L Hi-Rider 4x4',
    make: 'Isuzu',
    model: 'D-Max',
    year: 2018,
    price: 3600000,
    mileage: 79000,
    fuel: 'Diesel',
    transmission: 'Manual',
    engineCapacity: '2500cc',
    bodyType: 'Pickup',
    condition: 'Local Used',
    driveType: '4WD',
    color: 'Silver Metallic',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'KDF 4xxZ',
    status: 'available',
    isFeatured: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'Kenyan terrain champion. Isuzu D-Max 2.5L Turbo Diesel Double Cab with selectable 4WD dial. Robust suspension, heavy-duty rear bed liner, bullbar, side steps, and canopy ready. Regularly serviced at authorized dealer with fully verified service history.',
    features: ['Selectable 4WD (4H / 4L)', 'Heavy Duty Tow Bar', 'Bed Liner', 'Tubular Side Steps', 'Heavy Duty Suspension', 'Fabric Interior', 'Air Conditioning'],
    safetyFeatures: ['Dual Front Airbags', 'ABS with Electronic Brakeforce Distribution', 'Engine Immobilizer', 'Fog Lights'],
    interiorFeatures: ['Power Windows', 'FM/Bluetooth Stereo', 'Under-Seat Tool Storage', 'Durable Easy-Clean Flooring'],
    exteriorFeatures: ['Front Bullbar', 'Side Steps', 'Chrome Mirrors', 'Mudflaps All Round'],
    createdAt: '2026-03-05T09:00:00.000Z',
    updatedAt: '2026-03-15T11:00:00.000Z'
  },
  {
    id: 'veh-6',
    name: '2017 Toyota Premio 1.8X FL Package',
    make: 'Toyota',
    model: 'Premio',
    year: 2017,
    price: 2150000,
    mileage: 49000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1800cc',
    bodyType: 'Sedan',
    condition: 'Foreign Used',
    driveType: '2WD / FWD',
    color: 'Pearl White',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'Unregistered (Duty Paid)',
    status: 'available',
    isFeatured: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'The executive favorite. 2017 facelifted Toyota Premio 1.8X with Valvematic technology. Unmatched reliability, luxurious wood grain interior trim, push button engine start, automatic climate control, and supreme ride softness.',
    features: ['Keyless Smart Entry', 'Push Start Ignition', 'Wood Grain Finish', 'Alloy Wheels', 'Eco Driving Indicator', 'Fog Lamps'],
    safetyFeatures: ['Toyota Safety Sense', 'Lane Departure Alert', 'Pre-Crash Safety System', '6 Airbags', 'Reverse Camera'],
    interiorFeatures: ['Soft Fabric Cushioned Seats', 'Digital Auto AC', 'Audio Controls on Steering', 'Spacious Trunk'],
    exteriorFeatures: ['Chrome Door Handles', 'Automatic LED Headlights', 'Factory Tint'],
    createdAt: '2026-03-06T14:00:00.000Z',
    updatedAt: '2026-03-15T12:00:00.000Z'
  },
  {
    id: 'veh-7',
    name: '2019 Mercedes-Benz C200 AMG Line W205',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2019,
    price: 4850000,
    mileage: 38000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1500cc Mild-Hybrid',
    bodyType: 'Luxury',
    condition: 'Foreign Used',
    driveType: 'RWD',
    color: 'Iridium Silver Metallic',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'Unregistered (Duty Paid)',
    status: 'available',
    isFeatured: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'Sophistication redefined. 2019 Mercedes-Benz C200 with factory AMG Line styling kit, Diamond radiator grille, panoramic sliding glass roof, 64-color ambient cabin lighting, and digital widescreen virtual cockpit.',
    features: ['AMG Line Aerodynamic Styling', 'Panoramic Sunroof', '64-Color Ambient Lighting', 'Digital Cockpit', '18-Inch AMG Twin-Spoke Rims', 'Diamond Radiator Grille', 'Apple CarPlay & Android Auto'],
    safetyFeatures: ['Active Brake Assist', 'Attention Assist', 'Blind Spot Warning', '9 Airbags', 'Tyre Pressure Monitoring'],
    interiorFeatures: ['Artico Leather AMG Sports Seats', 'Flat-Bottom Sport Steering Wheel', 'Burmester Sound Experience', 'Dual-Zone Thermatic AC'],
    exteriorFeatures: ['Multibeam LED Intelligent Headlights', 'Sports Suspension', 'AMG Twin Chrome Exhaust Tips'],
    createdAt: '2026-03-07T10:00:00.000Z',
    updatedAt: '2026-03-15T13:00:00.000Z'
  },
  {
    id: 'veh-8',
    name: '2018 Nissan X-Trail 4WD Emergency Brake Package',
    make: 'Nissan',
    model: 'X-Trail',
    year: 2018,
    price: 2550000,
    mileage: 63000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '2000cc',
    bodyType: 'SUV',
    condition: 'Foreign Used',
    driveType: '4WD',
    color: 'Midnight Bronze',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'Unregistered (Duty Paid)',
    status: 'available',
    isFeatured: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'Versatile 2018 Nissan X-Trail 4WD with intelligent all-mode 4x4-i selector. High clearance, spacious 5-seater with modular cargo organizer, heated seats, around-view monitor, and emergency braking package.',
    features: ['All-Mode 4x4-i Selector', 'Around View 360 Camera', 'Emergency Braking Package', 'Push Button Start', 'Heated Seats', 'Roof Rails', 'Alloy Wheels'],
    safetyFeatures: ['Intelligent Emergency Braking', 'Lane Departure Warning', 'Vehicle Dynamic Control (VDC)', 'Hill Start Assist'],
    interiorFeatures: ['Waterproof Fabric Interior', 'Dual-Zone AC', 'Cruise Control', 'Spacious Flexible Boot Space'],
    exteriorFeatures: ['LED Daytime Running Lamps', 'Rear Privacy Tint', 'Rear Spoiler'],
    createdAt: '2026-03-08T11:00:00.000Z',
    updatedAt: '2026-03-15T14:00:00.000Z'
  },
  {
    id: 'veh-9',
    name: '2017 Toyota Fielder 1.5X Station Wagon',
    make: 'Toyota',
    model: 'Corolla Fielder',
    year: 2017,
    price: 1680000,
    mileage: 71000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '1500cc',
    bodyType: 'Station Wagon',
    condition: 'Foreign Used',
    driveType: '2WD / FWD',
    color: 'Silver Metallic',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'Unregistered (Duty Paid)',
    status: 'reserved',
    isFeatured: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'The undisputed Kenyan king of economy and utility. 2017 Toyota Corolla Fielder 1.5X. Outstanding fuel economy averaging 18km/L, immense luggage volume, easily available and cheap spare parts throughout Nairobi.',
    features: ['Auto Stop-Start Technology', 'Power Windows', 'Central Locking', 'Factory Wheel Covers', 'Reverse Camera'],
    safetyFeatures: ['Toyota Safety Sense C', 'ABS Brakes', 'Front Airbags'],
    interiorFeatures: ['Dark Fabric Interior', 'Fold-Flat Rear Seats for Large Cargo', 'Air Conditioning'],
    exteriorFeatures: ['Clear Lens Headlights', 'Rear Wiper', 'Chrome Accent Front Grille'],
    createdAt: '2026-03-09T15:00:00.000Z',
    updatedAt: '2026-03-15T15:00:00.000Z'
  },
  {
    id: 'veh-10',
    name: '2016 Toyota Hiace Super Custom Van (Diesel)',
    make: 'Toyota',
    model: 'Hiace',
    year: 2016,
    price: 2750000,
    mileage: 95000,
    fuel: 'Diesel',
    transmission: 'Manual',
    engineCapacity: '3000cc Turbo Diesel (1KD)',
    bodyType: 'Van',
    condition: 'Local Used',
    driveType: '2WD / FWD',
    color: 'White / Gold Two-Tone',
    location: 'Netwon Yard, Kangundo Road, Nairobi',
    registration: 'KDC 2xxA',
    status: 'sold',
    isFeatured: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80'
    ],
    primaryImageIndex: 0,
    description: 'Clean local used Toyota Hiace 14-seater powered by the legendary 1KD 3.0L turbo diesel engine. Perfect for corporate shuttles, school transport, or business logistics. Sold to a verified client with logbook transfer complete.',
    features: ['14 Passenger Seating', 'Rear Cabin Air Conditioning', 'Sliding Side Door', 'Tow Hook'],
    safetyFeatures: ['Seat Belts on All Passenger Rows', 'Speed Governor Installed', 'Fire Extinguisher Mount'],
    interiorFeatures: ['Reclining Passenger Seats', 'Overhead Parcel Shelves', 'Durable Vinyl Floor'],
    exteriorFeatures: ['Tinted Windows', 'Mud Flaps', 'Rear Bumper Step'],
    createdAt: '2026-03-10T16:00:00.000Z',
    updatedAt: '2026-03-15T16:00:00.000Z'
  }
];

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Katheo Christopher',
    rating: 5,
    review: 'Bought my Toyota Prado from Netwon Cars Kangundo Road. The team was transparent, the vehicle was in immaculate condition, and the logbook transfer took only 3 days. Highly recommended car dealer along Kangundo Road!',
    date: '2026-02-18',
    vehiclePurchased: '2018 Toyota Land Cruiser Prado',
    isApproved: true
  },
  {
    id: 'rev-2',
    customerName: 'Dennis Mutua',
    rating: 5,
    review: 'I had been looking for a clean Mazda CX-5 around Nairobi for weeks. Netwon Cars had the cleanest unit with genuine mileage and full auction inspection documentation. They also assisted with quick bank asset financing.',
    date: '2026-02-26',
    vehiclePurchased: '2017 Mazda CX-5 L-Package',
    isApproved: true
  },
  {
    id: 'rev-3',
    customerName: 'Faith Wambui',
    rating: 5,
    review: 'Did a trade-in of my older Premio for a 2018 Harrier. Fair valuation, no unnecessary bargaining, and the deal was closed smoothly in their Kangundo Road office within a few hours.',
    date: '2026-03-04',
    vehiclePurchased: '2018 Toyota Harrier Elegance',
    isApproved: true
  }
];

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Kangundo Road Showroom Yard',
    caption: 'Our secure and fully accessible car yard along Kangundo Road, Nairobi.',
    category: 'Dealership & Yard',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-02-10T10:00:00.000Z'
  },
  {
    id: 'gal-2',
    title: 'Customer Key Handover Celebration',
    caption: 'Celebrating another satisfied family receiving their pristine Toyota Prado.',
    category: 'Customer Deliveries',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-02-20T14:00:00.000Z'
  },
  {
    id: 'gal-3',
    title: 'Fresh Foreign Used Imports Arrival',
    caption: 'Inspecting newly cleared Japanese units straight from port clearance.',
    category: 'Vehicles',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-03-01T09:00:00.000Z'
  },
  {
    id: 'gal-4',
    title: 'Pre-Delivery Detailing & Checkup',
    caption: 'Every car leaves our yard thoroughly washed, detailed, and mechanically verified.',
    category: 'Events & Showroom',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-03-05T12:00:00.000Z'
  }
];

// In-memory cache + persistent file sync
let dbData: DatabaseSchema | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

export function getDatabase(): DatabaseSchema {
  if (dbData) return dbData;

  ensureDataDirectory();

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(content);
      return dbData!;
    } catch (err) {
      console.error('Error reading database file, falling back to seed:', err);
    }
  }

  // Seed with default admin (password: netwon2025)
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('netwon2025', salt);

  const initialAdmin: AdminUser = {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@netwoncars.co.ke',
    passwordHash
  };

  dbData = {
    vehicles: INITIAL_VEHICLES,
    categories: INITIAL_CATEGORIES,
    services: INITIAL_SERVICES,
    reviews: INITIAL_REVIEWS,
    enquiries: [
      {
        id: 'enq-1',
        name: 'Brian Omondi',
        email: 'brian.omondi@gmail.com',
        phone: '0712 345678',
        subject: 'Inquiry on 2018 Toyota Prado TX-L',
        message: 'Hi Netwon Cars team, I am interested in viewing the 2018 Prado this Friday. Does it come with a spare tire cover and is bank financing acceptable?',
        vehicleId: 'veh-1',
        vehicleName: '2018 Toyota Land Cruiser Prado TX-L 2.8L Diesel',
        status: 'new',
        createdAt: '2026-03-14T11:20:00.000Z'
      }
    ],
    appointments: [
      {
        id: 'apt-1',
        name: 'Sarah Wanjiku',
        phone: '0722 987654',
        email: 'sarah.wanjiku@outlook.com',
        vehicleId: 'veh-2',
        vehicleName: '2017 Mazda CX-5 XD L-Package 2.2L Diesel AWD',
        preferredDate: '2026-03-20',
        preferredTime: '10:30 AM',
        message: 'I want to come with my mechanic for a quick test drive around Kangundo road.',
        status: 'approved',
        createdAt: '2026-03-15T08:45:00.000Z'
      }
    ],
    tradeIns: [
      {
        id: 'trd-1',
        name: 'George Kariuki',
        phone: '0733 112233',
        email: 'gkariuki@yahoo.com',
        make: 'Subaru',
        model: 'Forester XT',
        year: 2014,
        mileage: 110000,
        registration: 'KCG 123Y',
        condition: 'Good clean running condition, no accident history.',
        expectedPrice: 1550000,
        description: 'Looking to trade in for the 2018 Toyota Harrier and top up with cash balance.',
        photos: ['https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80'],
        status: 'new',
        createdAt: '2026-03-15T10:15:00.000Z'
      }
    ],
    gallery: INITIAL_GALLERY,
    settings: INITIAL_SETTINGS,
    adminUsers: [initialAdmin]
  };

  saveDatabase(dbData);
  return dbData;
}

export function saveDatabase(data: DatabaseSchema): void {
  ensureDataDirectory();
  dbData = data;
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}
