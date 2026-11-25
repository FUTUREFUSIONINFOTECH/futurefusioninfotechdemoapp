export type RoleType =
  | "customer-app"
  | "customer-mobile-web"
  | "customer-web"
  | "sales"
  | "business"
  | "super";

export type CustomerPage =
  | "home"
  | "book"
  | "bookings"
  | "notifications"
  | "profile"
  | "confirmation";

export type IconKey =
  | "all"
  | "hospital"
  | "medical_labs"
  | "fitness"
  | "car"
  | "water_wash"
  | "salon"
  | "beauty"
  | "vip"
  | "celebrity"
  | "briefcase";

export interface CategoryItem {
  name: string;
  sub?: string;
  icon: IconKey;
}

export interface BusinessItem {
  id: string;
  name: string;
  category: string;
  tag?: string;
  city: string;
  address: string;
  rating: string;
  price: number;
  icon: IconKey;
  services: string[];
  staff: string[];
  paused?: boolean;
}

export interface BookingItem {
  id: string;
  businessId: string;
  business: string;
  category: string;
  city: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  customer: string;
  phone: string;
  status: string;
  note?: string;
  requestedDate?: string;
  requestedTime?: string;
}

export interface PlanItem {
  name: string;
  amount: number;
  commission: number;
}

export interface SalesPerson {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  idProof: string;
  bankOrUpi: string;
  status: "Verified" | "Pending Verification" | "Rejected";
  loginId: string;
  password: string;
  wallet: number;
  earned: number;
  withdrawn: number;
  created: string;
}

export interface WalletTxn {
  id: string;
  spId: string;
  type: "Commission Credit" | "Withdrawal";
  amount: number;
  desc: string;
  method: string;
  date: string;
}

export interface BusinessOrder {
  id: string;
  spId: string;
  spName: string;
  bizName: string;
  category: string;
  tag: string;
  city: string;
  address: string;
  owner: string;
  phone: string;
  email: string;
  services: string;
  staff: string;
  plan: string;
  amount: number;
  commission: number;
  verifyStatus: "Pending Verification" | "Verified & Confirmed" | "Rejected";
  paymentStatus: "Unpaid" | "Full Payment Received";
  credited: boolean;
  loginIssued: boolean;
  loginId: string;
  bizId: string;
  date: string;
}

export interface BizCredential {
  bizId: string;
  bizName: string;
  city: string;
  category: string;
  owner: string;
  loginId: string;
  password: string;
  mustChange: boolean;
}

export const LOGO_SRC =
  "data:image/webp;base64,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";

export const CAT_ICONS: Record<IconKey, string> = {
  all: "/assets/aistudio/all_3cb57e6c.png",
  hospital: "/assets/aistudio/hospital_a149eb60.png",
  medical_labs: "/assets/aistudio/medicallabs_dd2025f4.png",
  fitness: "/assets/aistudio/gym_31ef1976.png",
  car: "/assets/aistudio/carbikeservice_48a1d597.png",
  water_wash: "/assets/aistudio/carbikewaterwash_2af5e8e8.png",
  salon: "/assets/aistudio/saloon_81649f85.png",
  beauty: "/assets/aistudio/beautyparlour_49717644.jpeg",
  vip: "/assets/aistudio/vip_7c6b3a11.png",
  celebrity: "/assets/aistudio/celebrities_e2eb494d.png",
  briefcase: "/assets/aistudio/others_ff9522ed.png",
};

export const categories: CategoryItem[] = [
  { name: "Hospital", sub: "Doctors & Clinics", icon: "hospital" },
  { name: "Medical Labs & Scans", sub: "Diagnostics & Tests", icon: "medical_labs" },
  { name: "Gym", sub: "Fitness & Training", icon: "fitness" },
  { name: "Car & Bike Service", sub: "Repair & Maintenance", icon: "car" },
  { name: "Car & Bike Water Wash", sub: "Foam Wash & Detailing", icon: "water_wash" },
  { name: "Saloon", sub: "Hair & Grooming", icon: "salon" },
  { name: "Beauty Parlour", sub: "Bridal & Skin Care", icon: "beauty" },
  { name: "VIPs", sub: "Top Business Persons", icon: "vip" },
  { name: "Celebrities", sub: "Actors & Well-Known Persons", icon: "celebrity" },
  { name: "Other", sub: "General Services", icon: "briefcase" },
];

export const cities = ["Chennai", "Coimbatore", "Thiruvarur", "Madurai", "Trichy"];

export const initialBusinesses: BusinessItem[] = [
  {
    id: "b1",
    name: "City Care Hospital",
    category: "Hospital",
    city: "Chennai",
    address: "Anna Nagar, Chennai",
    rating: "4.8",
    price: 500,
    icon: "hospital",
    services: ["Cardiology", "General Medicine", "Dermatology"],
    staff: ["Dr. Meera", "Dr. Arjun"],
  },
  {
    id: "b9",
    name: "Apex Diagnostics, Labs & Scans",
    category: "Medical Labs & Scans",
    tag: "MRI, CT Scan & Blood Tests",
    city: "Chennai",
    address: "Nungambakkam, Chennai",
    rating: "4.9",
    price: 650,
    icon: "medical_labs",
    services: ["Full Body Blood Panel", "MRI & CT Scan", "Ultrasound & ECG"],
    staff: ["Dr. S. Karthikeyan", "Lab Team"],
  },
  {
    id: "b2",
    name: "ProFit Fitness Studio",
    category: "Gym",
    city: "Coimbatore",
    address: "RS Puram, Coimbatore",
    rating: "4.7",
    price: 400,
    icon: "fitness",
    services: ["Personal Training", "Yoga", "Fitness Assessment"],
    staff: ["Vikram", "Nisha"],
  },
  {
    id: "b3",
    name: "AutoCare Car & Bike Service Hub",
    category: "Car & Bike Service",
    city: "Chennai",
    address: "Guindy, Chennai",
    rating: "4.6",
    price: 900,
    icon: "car",
    services: ["General Service", "Oil Change", "AC & Brake Check"],
    staff: ["Service Team"],
  },
  {
    id: "b10",
    name: "AquaJet Car & Bike Water Wash",
    category: "Car & Bike Water Wash",
    tag: "Foam Wash & Detailing",
    city: "Madurai",
    address: "Bypass Road, Madurai",
    rating: "4.8",
    price: 300,
    icon: "water_wash",
    services: ["High-Pressure Foam Wash", "Underbody & Engine Wash", "Ceramic Polish"],
    staff: ["Wash Bay Crew"],
  },
  {
    id: "b4",
    name: "Glow Hair & Grooming Saloon",
    category: "Saloon",
    city: "Thiruvarur",
    address: "South Street, Thiruvarur",
    rating: "4.9",
    price: 350,
    icon: "salon",
    services: ["Haircut & Styling", "Beard Grooming", "Hair Spa"],
    staff: ["Anu", "Priya"],
  },
  {
    id: "b5",
    name: "Aura Bridal & Beauty Parlour",
    category: "Beauty Parlour",
    tag: "Bridal, Skin & Makeup",
    city: "Chennai",
    address: "T. Nagar, Chennai",
    rating: "4.9",
    price: 800,
    icon: "beauty",
    services: ["Bridal & Party Makeup", "Gold & Glow Facial", "Hair Spa & Styling", "Manicure & Pedicure"],
    staff: ["Divya", "Kavya"],
  },
  {
    id: "b6",
    name: "Apex Executive & VIP Desk",
    category: "VIPs",
    tag: "Top Business Persons",
    city: "Chennai",
    address: "MRC Nagar, Chennai",
    rating: "4.9",
    price: 5000,
    icon: "vip",
    services: ["Top Business Person Meet", "CXO Strategic Advisory", "Investor Pitch & Board Slot", "Corporate Keynote Request"],
    staff: ["Raghavendra Rao (Chairman)", "Meenakshi Sundaram (MD)"],
  },
  {
    id: "b7",
    name: "Starlight Celebrity & Actor Desk",
    category: "Celebrities",
    tag: "Actors & Film Personalities",
    city: "Chennai",
    address: "Kodambakkam, Chennai",
    rating: "4.9",
    price: 15000,
    icon: "celebrity",
    services: ["Actor Appearance & Endorsement", "Chief Guest & Launch Event", "Media Interview & Podcast Slot", "Fan Meet & Greet Session"],
    staff: ["Aravind Karthik (Actor)", "Priyadharshini (Film Artist)"],
  },
  {
    id: "b8",
    name: "Eminent Voices & Public Figures",
    category: "Celebrities",
    tag: "Well-Known Persons & Mentors",
    city: "Coimbatore",
    address: "Race Course Road, Coimbatore",
    rating: "4.8",
    price: 7500,
    icon: "celebrity",
    services: ["Well-Known Person Keynote", "Cultural & Book Launch Guest", "Public Panel & Talk Session"],
    staff: ["Dr. K. Balasubramanian (Author)", "Sadhana Krishnan (Media Host)"],
  },
];

export const servicesList: string[][] = [
  ["General Consultation", "Hospital", "30 min", "₹500", "Active"],
  ["Full Body Blood Panel & MRI", "Medical Labs & Scans", "45 min", "₹650", "Active"],
  ["Personal Training", "Gym", "60 min", "₹800", "Active"],
  ["Oil Change & Brake Check", "Car & Bike Service", "45 min", "₹900", "Active"],
  ["High-Pressure Foam Wash", "Car & Bike Water Wash", "30 min", "₹300", "Active"],
  ["Haircut & Grooming", "Saloon", "30 min", "₹350", "Active"],
  ["Bridal & Party Makeup", "Beauty Parlour", "90 min", "₹2,500", "Active"],
  ["Top Business Person Meet", "VIPs", "45 min", "₹5,000", "Active"],
  ["Actor & Well-Known Person Booking", "Celebrities", "60 min", "₹15,000", "Active"],
];

export const plans: PlanItem[] = [
  { name: "Starter Business Plan", amount: 10000, commission: 1500 },
  { name: "Growth Business Plan", amount: 18000, commission: 2700 },
  { name: "VIP / Celebrity Desk Plan", amount: 25000, commission: 3750 },
];

export const initialSalesPersons: SalesPerson[] = [
  {
    id: "sp1",
    name: "Karthik Subramanian",
    phone: "98401 22334",
    email: "karthik.sales@app4app.in",
    city: "Chennai",
    idProof: "PAN-ABCPK4821F",
    bankOrUpi: "karthik.sales@okhdfcbank",
    status: "Verified",
    loginId: "sales.karthik",
    password: "Sales@2026",
    wallet: 2700,
    earned: 2700,
    withdrawn: 0,
    created: "2026-11-20",
  },
  {
    id: "sp2",
    name: "Priya Dharshini R",
    phone: "97890 44551",
    email: "priya.field@app4app.in",
    city: "Coimbatore",
    idProof: "AADHAAR-XXXX-9921",
    bankOrUpi: "priya.r@okicici",
    status: "Pending Verification",
    loginId: "",
    password: "",
    wallet: 0,
    earned: 0,
    withdrawn: 0,
    created: "2026-11-24",
  },
];

export const initialWalletTxns: WalletTxn[] = [
  {
    id: "WTX-1001",
    spId: "sp1",
    type: "Commission Credit",
    amount: 2700,
    desc: "Commission for full payment · Aura Bridal & Beauty Parlour (ORD-501)",
    method: "Company Wallet Credit",
    date: "2026-11-21",
  },
];

export const initialBusinessOrders: BusinessOrder[] = [
  {
    id: "ORD-501",
    spId: "sp1",
    spName: "Karthik Subramanian",
    bizName: "Aura Bridal & Beauty Parlour",
    category: "Beauty Parlour",
    tag: "Bridal, Skin & Makeup",
    city: "Chennai",
    address: "T. Nagar, Chennai",
    owner: "Divya Lakshmi",
    phone: "98412 66778",
    email: "aura.bridal@example.com",
    services: "Bridal & Party Makeup, Gold & Glow Facial, Hair Spa",
    staff: "Divya, Kavya",
    plan: "Growth Business Plan",
    amount: 18000,
    commission: 2700,
    verifyStatus: "Verified & Confirmed",
    paymentStatus: "Full Payment Received",
    credited: true,
    loginIssued: true,
    loginId: "biz.aura",
    bizId: "b5",
    date: "2026-11-21",
  },
  {
    id: "ORD-502",
    spId: "sp1",
    spName: "Karthik Subramanian",
    bizName: "Crown Heritage Salon & Spa",
    category: "Beauty Parlour",
    tag: "Luxury Bridal & Grooming",
    city: "Madurai",
    address: "KK Nagar, Madurai",
    owner: "Senthil Nathan",
    phone: "94431 77889",
    email: "crown.madurai@example.com",
    services: "Bridal Studio, Keratin Spa, Skin Brightening",
    staff: "Nandhini, Deepika",
    plan: "Starter Business Plan",
    amount: 10000,
    commission: 1500,
    verifyStatus: "Pending Verification",
    paymentStatus: "Unpaid",
    credited: false,
    loginIssued: false,
    loginId: "",
    bizId: "",
    date: "2026-11-25",
  },
];

export const initialBizCredentials: BizCredential[] = [
  {
    bizId: "b1",
    bizName: "City Care Hospital",
    city: "Chennai",
    category: "Hospital",
    owner: "Dr. Meera",
    loginId: "biz.citycare",
    password: "Temp@2026",
    mustChange: true,
  },
  {
    bizId: "b5",
    bizName: "Aura Bridal & Beauty Parlour",
    city: "Chennai",
    category: "Beauty Parlour",
    owner: "Divya Lakshmi",
    loginId: "biz.aura",
    password: "Temp@501",
    mustChange: true,
  },
];

export const businessMenu: [string, string][] = [
  ["Overview", "chart"],
  ["Appointments", "calendar"],
  ["Services", "grid"],
  ["Departments", "department"],
  ["Staff & Professionals", "users"],
  ["Availability", "clock"],
  ["Customers", "user"],
  ["Reports", "chart"],
  ["Business Profile", "building"],
  ["Password & Security", "lock"],
  ["Notifications", "bell"],
];

export const superMenu: [string, string][] = [
  ["Overview", "chart"],
  ["Sales Verification", "userCheck"],
  ["Business Orders", "fileCheck"],
  ["Businesses", "building"],
  ["Categories & Cities", "grid"],
  ["All Appointments", "calendar"],
  ["Customers", "users"],
  ["Reports", "chart"],
  ["Platform Settings", "settings"],
];
