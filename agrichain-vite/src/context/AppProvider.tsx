import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, onSnapshot, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { getCropImage } from "../utils/cropImages";
import { translations } from "../i18n/translations";
import type { Language, TranslationKeys } from "../i18n/translations";
import {
  getCurrentCoordinates,
  reverseGeocode,
  getCoordinatesForLocation,
  type CustomerLocation
} from "../lib/location";

export type Role = "FARMER" | "CUSTOMER" | null;

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
  location?: string;
  latitude?: number;
  longitude?: number;
  farmName?: string;
  email?: string;
}

export interface Product {
  id: string;
  name: string;
  localName?: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  farm: string;
  farmerId?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  grade: string;
  harvestDate: string;
  description: string;
  image?: string;
  soilAuditStatus: "Approved" | "Pending" | "In Review";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderReview {
  rating: number;
  tags: string[];
  comment?: string;
  submittedAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  customerLatitude?: number;
  customerLongitude?: number;
  farmerId?: string;
  farmerLatitude?: number;
  farmerLongitude?: number;
  status: "Placed" | "Harvested & Packed" | "In Transit" | "Delivered";
  createdAt: string;
  trackingStep: number;
  paymentMethod?: string;
  paymentStatus?: "Paid" | "Pending" | "Cash on Delivery";
  review?: OrderReview;
}

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (deliveryAddress: string, customerPhone: string, paymentMethod?: string, paymentStatus?: "Paid" | "Pending" | "Cash on Delivery") => Order;
  updateOrderStatus: (orderId: string, status: Order["status"], step: number) => void;
  deleteOrder: (orderId: string) => void;
  addOrderReview: (orderId: string, review: OrderReview) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;

  // Location features
  customerLocation: CustomerLocation | null;
  setCustomerLocation: (location: CustomerLocation | null) => void;
  detectLocation: () => Promise<CustomerLocation | null>;
  isDetectingLocation: boolean;
  locationError: string | null;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Red Onion",
    localName: "कांदा",
    category: "Vegetables",
    price: 32,
    unit: "kg",
    quantity: 150,
    farm: "Ramesh Patil Organic Farm",
    location: "Nashik, Maharashtra",
    verified: true,
    grade: "Grade A (Premium Export)",
    harvestDate: "2026-09-10",
    description: "Freshly harvested, naturally dried red onions with rich flavor and high shelf life. Grown using drip irrigation and zero synthetic pesticides.",
    image: "/crops/onion.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-2",
    name: "Green Chili",
    localName: "मिरची",
    category: "Vegetables",
    price: 45,
    unit: "kg",
    quantity: 80,
    farm: "Suresh Bhave Agri Estate",
    location: "Pune, Maharashtra",
    verified: false,
    grade: "Grade B (Standard)",
    harvestDate: "2026-09-12",
    description: "Spicy green chillies directly sourced from the fields in Pune. Fresh, vibrant, and ideal for daily culinary needs.",
    image: "/crops/chili.png",
    soilAuditStatus: "In Review"
  },
  {
    id: "prod-3",
    name: "Organic Tomatoes",
    localName: "टोमॅटो",
    category: "Vegetables",
    price: 28,
    unit: "kg",
    quantity: 200,
    farm: "Green Canopy Farms",
    location: "Mira-Bhayandar, Maharashtra",
    verified: true,
    grade: "Grade A+",
    harvestDate: "2026-09-11",
    description: "Vine-ripened, juicy red tomatoes packed with antioxidants. Guaranteed 100% fair price audit approved.",
    image: "/crops/tomato.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-4",
    name: "Alphonsa Mangoes",
    localName: "हापूस आंबा",
    category: "Fruits",
    price: 350,
    unit: "dozen",
    quantity: 45,
    farm: "Konkan Orchards",
    location: "Ratnagiri, Maharashtra",
    verified: true,
    grade: "GI Tag Certified",
    harvestDate: "2026-09-08",
    description: "Authentic Ratnagiri Hapus mangoes naturally ripened without carbide. Unmatched aroma and sweetness directly from coastal orchards.",
    image: "/crops/mango.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-5",
    name: "Fresh Potato",
    localName: "बटाटा / आलू",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    quantity: 120,
    farm: "Patil Organic Farm",
    location: "Satara, Maharashtra",
    verified: true,
    grade: "Grade A",
    harvestDate: "2026-09-11",
    description: "Farm-fresh high quality organic potatoes harvested directly from fertile soil in Satara.",
    image: "/crops/potato.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-6",
    name: "Kashmiri Apple",
    localName: "सफरचंद",
    category: "Fruits",
    price: 180,
    unit: "kg",
    quantity: 90,
    farm: "Valley Fresh Orchards",
    location: "Shimla, HP",
    verified: true,
    grade: "Grade A+",
    harvestDate: "2026-09-09",
    description: "Crisp, sweet & juicy mountain apples handpicked at peak ripeness.",
    image: getCropImage("Apple", "Fruits"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-7",
    name: "Green Peas",
    localName: "मटार",
    category: "Vegetables",
    price: 60,
    unit: "kg",
    quantity: 75,
    farm: "Green Fields Agro",
    location: "Kolhapur, MH",
    verified: true,
    grade: "Grade A",
    harvestDate: "2026-09-12",
    description: "Sweet, tender green peas freshly podded from sustainable fields.",
    image: "/crops/peas.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-8",
    name: "Mahabaleshwar Strawberry",
    localName: "स्ट्रॉबेरी",
    category: "Fruits",
    price: 220,
    unit: "box",
    quantity: 40,
    farm: "Berry Hill Farms",
    location: "Mahabaleshwar, MH",
    verified: true,
    grade: "GI Tag Certified",
    harvestDate: "2026-09-13",
    description: "Fragrant, dark red luscious strawberries fresh from Mahabaleshwar plateau.",
    image: getCropImage("Strawberry", "Fruits"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-9",
    name: "Fresh Pomegranate",
    localName: "डाळिंब / अनार",
    category: "Fruits",
    price: 140,
    unit: "kg",
    quantity: 65,
    farm: "Shree Ganesh Orchards",
    location: "Solapur, MH",
    verified: true,
    grade: "Bhagwa Export Grade",
    harvestDate: "2026-09-12",
    description: "Deep red juicy Bhagwa pomegranates known for sweet arils and rich nutrients.",
    image: "/crops/pomegranate.png",
    soilAuditStatus: "Approved"
  },

  // --- GRAINS ---
  {
    id: "prod-10",
    name: "Indrayani Rice",
    localName: "तांदूळ / चावल",
    category: "Grains",
    price: 65,
    unit: "kg",
    quantity: 500,
    farm: "Maval Rice Producers Cooperative",
    location: "Pune, MH",
    verified: true,
    grade: "Grade A Aromatic",
    harvestDate: "2026-09-01",
    description: "Aromatic traditional Indrayani rice from Maval belt. Soft texture and natural aroma when cooked.",
    image: getCropImage("Rice", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-11",
    name: "Sharbati Wheat",
    localName: "गहू / गेहूं",
    category: "Grains",
    price: 45,
    unit: "kg",
    quantity: 800,
    farm: "Godavari Agri Farms",
    location: "Nashik, MH",
    verified: true,
    grade: "Premium Golden Grain",
    harvestDate: "2026-08-28",
    description: "Golden lustre Sharbati wheat grown in sun-drenched soil. Ideal for soft, fluffy rotis.",
    image: getCropImage("Wheat", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-12",
    name: "Maize (Corn)",
    localName: "मका / मक्का",
    category: "Grains",
    price: 28,
    unit: "kg",
    quantity: 350,
    farm: "Deccan Plateau Farms",
    location: "Satara, MH",
    verified: true,
    grade: "Standard Feed & Flour",
    harvestDate: "2026-09-05",
    description: "Sun-dried yellow maize kernels rich in carbohydrates and dietary fiber.",
    image: getCropImage("Maize", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-13",
    name: "Organic Barley",
    localName: "जव / जौ",
    category: "Grains",
    price: 38,
    unit: "kg",
    quantity: 200,
    farm: "Vidarbha Organic Hub",
    location: "Nagpur, MH",
    verified: true,
    grade: "Grade A",
    harvestDate: "2026-09-02",
    description: "Hulled barley grains rich in soluble fiber and essential antioxidants.",
    image: getCropImage("Barley", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-14",
    name: "Jowar (Sorghum)",
    localName: "ज्वारी",
    category: "Grains",
    price: 48,
    unit: "kg",
    quantity: 450,
    farm: "Maldandi Jowar Collective",
    location: "Solapur, MH",
    verified: true,
    grade: "Maldandi Grade 35-1",
    harvestDate: "2026-09-07",
    description: "Traditional Solapur Maldandi Jowar. Gluten-free grain perfect for soft bhakris.",
    image: getCropImage("Jowar", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-15",
    name: "Bajra (Pearl Millet)",
    localName: "बाजरी",
    category: "Grains",
    price: 35,
    unit: "kg",
    quantity: 400,
    farm: "Desh Millet Producers",
    location: "Ahmednagar, MH",
    verified: true,
    grade: "Grade A Super",
    harvestDate: "2026-09-06",
    description: "High-protein pearl millet harvested directly from rain-fed organic farms.",
    image: getCropImage("Bajra", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-16",
    name: "Ragi (Finger Millet)",
    localName: "नाचणी / रागी",
    category: "Grains",
    price: 55,
    unit: "kg",
    quantity: 300,
    farm: "Konkan Hill Farms",
    location: "Sindhudurg, MH",
    verified: true,
    grade: "Iron & Calcium Rich",
    harvestDate: "2026-09-04",
    description: "Calcium-rich dark finger millet. Excellent superfood for porridge and nutritious rotis.",
    image: getCropImage("Ragi", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-17",
    name: "Foxtail Millet",
    localName: "राळा / कंगनी",
    category: "Grains",
    price: 70,
    unit: "kg",
    quantity: 150,
    farm: "Sahyadri Bio Farms",
    location: "Satara, MH",
    verified: true,
    grade: "Unpolished Organic",
    harvestDate: "2026-09-03",
    description: "Ancient unpolished foxtail millet with low glycemic index for healthy living.",
    image: getCropImage("Foxtail Millet", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-18",
    name: "Little Millet",
    localName: "वरी / कुटकी",
    category: "Grains",
    price: 75,
    unit: "kg",
    quantity: 120,
    farm: "Western Ghats Agri",
    location: "Ratnagiri, MH",
    verified: true,
    grade: "Fasting Grade A",
    harvestDate: "2026-09-02",
    description: "Pure Little Millet (Vari Cha Tandul) used for nutritional meals and fasting recipes.",
    image: getCropImage("Little Millet", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-19",
    name: "Kodo Millet",
    localName: "कोद्रा / कोदो",
    category: "Grains",
    price: 68,
    unit: "kg",
    quantity: 110,
    farm: "Central Organic Trust",
    location: "Wardha, MH",
    verified: true,
    grade: "High Fiber Grade",
    harvestDate: "2026-09-01",
    description: "Nutrient-dense Kodo millet rich in B vitamins and essential minerals.",
    image: getCropImage("Kodo Millet", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-20",
    name: "Barnyard Millet (Bhagar)",
    localName: "भगर / सावां",
    category: "Grains",
    price: 85,
    unit: "kg",
    quantity: 180,
    farm: "Panchavati Farmers Group",
    location: "Nashik, MH",
    verified: true,
    grade: "Premium Fasting Special",
    harvestDate: "2026-09-05",
    description: "Clean, pearled Barnyard millet (Bhagar) processed traditionally without chemical polishing.",
    image: getCropImage("Barnyard Millet", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-21",
    name: "Proso Millet",
    localName: "वरई / चेना",
    category: "Grains",
    price: 72,
    unit: "kg",
    quantity: 90,
    farm: "Khandesh Agro Co.",
    location: "Jalgaon, MH",
    verified: true,
    grade: "Grade A Cleaned",
    harvestDate: "2026-09-03",
    description: "Light digestible Proso millet rich in complex carbohydrates and proteins.",
    image: getCropImage("Proso Millet", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-22",
    name: "Rolled Oats",
    localName: "ओट्स / जई",
    category: "Grains",
    price: 95,
    unit: "kg",
    quantity: 250,
    farm: "Green Canopy Farms",
    location: "Pune, MH",
    verified: true,
    grade: "Whole Grain Rolled",
    harvestDate: "2026-09-08",
    description: "Heart-healthy 100% whole grain rolled oats processed under clean hygienic standards.",
    image: getCropImage("Oats", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-23",
    name: "Organic Quinoa",
    localName: "क्विनोआ",
    category: "Grains",
    price: 180,
    unit: "kg",
    quantity: 80,
    farm: "Deccan Superfoods",
    location: "Sangli, MH",
    verified: true,
    grade: "Export Quality White",
    harvestDate: "2026-09-04",
    description: "Complete protein white quinoa loaded with all 9 essential amino acids.",
    image: getCropImage("Quinoa", "Grains"),
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-24",
    name: "Amaranth (Rajgira)",
    localName: "राजगिरा",
    category: "Grains",
    price: 110,
    unit: "kg",
    quantity: 140,
    farm: "Satpura Hill Organics",
    location: "Nandurbar, MH",
    verified: true,
    grade: "Grade A Cleaned",
    harvestDate: "2026-09-02",
    description: "Naturally puffed Rajgira grains packed with plant protein, iron, and lysine.",
    image: getCropImage("Amaranth", "Grains"),
    soilAuditStatus: "Approved"
  },

  // --- PULSES & LEGUMES ---
  {
    id: "prod-25",
    name: "Toor Dal / Arhar",
    localName: "तूर डाळ / अरहर",
    category: "Pulses",
    price: 135,
    unit: "kg",
    quantity: 600,
    farm: "Marathwada Farmers Producer Co",
    location: "Latur, MH",
    verified: true,
    grade: "Unpolished GI Latur Special",
    harvestDate: "2026-09-01",
    description: "Famous Latur unpolished Toor Dal with delicious taste and high protein purity.",
    image: "/crops/toor_dal.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-26",
    name: "Moong Dal (Green Gram)",
    localName: "मूग डाळ / मूंग",
    category: "Pulses",
    price: 120,
    unit: "kg",
    quantity: 450,
    farm: "Tapi Valley Organics",
    location: "Dhule, MH",
    verified: true,
    grade: "Grade A Yellow Split",
    harvestDate: "2026-09-03",
    description: "Easily digestible yellow moong dal harvested without artificial coloring.",
    image: "/crops/toor_dal.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-27",
    name: "Urad Dal (Black Gram)",
    localName: "उडीद डाळ / उड़द",
    category: "Pulses",
    price: 125,
    unit: "kg",
    quantity: 380,
    farm: "Vidarbha Pulse Hub",
    location: "Akola, MH",
    verified: true,
    grade: "Bold White Split",
    harvestDate: "2026-09-02",
    description: "Premium split white urad dal. Essential ingredient for dosas, idlis, and dal makhani.",
    image: "/crops/urad_dal.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-28",
    name: "Chana / Chickpea",
    localName: "हरभरा / चना",
    category: "Pulses",
    price: 85,
    unit: "kg",
    quantity: 700,
    farm: "Deccan Pulses Estate",
    location: "Osmanabad, MH",
    verified: true,
    grade: "Desi Brown Grade A",
    harvestDate: "2026-09-04",
    description: "Nutritious brown Bengal gram (Chana) harvested from fertile black soil.",
    image: "/crops/chana.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-29",
    name: "Masoor Dal (Red Lentil)",
    localName: "मसूर डाळ / मसूर",
    category: "Pulses",
    price: 98,
    unit: "kg",
    quantity: 400,
    farm: "Central Plateau Organics",
    location: "Amravati, MH",
    verified: true,
    grade: "Split Pink Unpolished",
    harvestDate: "2026-09-05",
    description: "Quick-cooking pink masoor dal packed with folate, iron, and dietary fiber.",
    image: "/crops/rajma.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-30",
    name: "Rajma (Kidney Beans)",
    localName: "राजमा",
    category: "Pulses",
    price: 140,
    unit: "kg",
    quantity: 250,
    farm: "Valley Harvest Co.",
    location: "Satara, MH",
    verified: true,
    grade: "Chitra Red Bold",
    harvestDate: "2026-09-06",
    description: "Premium red speckled Chitra Rajma with melt-in-mouth texture after cooking.",
    image: "/crops/rajma.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-31",
    name: "Kabuli Chana",
    localName: "काबुली चणा",
    category: "Pulses",
    price: 135,
    unit: "kg",
    quantity: 320,
    farm: "Godavari Agri Farms",
    location: "Nashik, MH",
    verified: true,
    grade: "Extra Large 9mm Bold",
    harvestDate: "2026-09-07",
    description: "Large 9mm size Kabuli chickpeas perfect for flavorful chole dishes.",
    image: "/crops/chana.png",
    soilAuditStatus: "Approved"
  },
  {
    id: "prod-32",
    name: "Black Chickpea (Kala Chana)",
    localName: "काळा चणा",
    category: "Pulses",
    price: 88,
    unit: "kg",
    quantity: 500,
    farm: "Marathwada Organic Hub",
    location: "Nanded, MH",
    verified: true,
    grade: "High Fiber Desi",
    harvestDate: "2026-09-05",
    description: "Protein-rich Kala Chana great for sprouts, curries, and healthy salads.",
    image: "/crops/chana.png",
    soilAuditStatus: "Approved"
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-10241",
    items: [
      { product: DEFAULT_PRODUCTS[0], quantity: 5 },
      { product: DEFAULT_PRODUCTS[2], quantity: 3 }
    ],
    totalPrice: 264,
    customerName: "Sumit Yadav",
    customerPhone: "+91 81020 55722",
    deliveryAddress: "Flat 402, Green Acres, Mira Road, Thane, Maharashtra",
    customerLatitude: 19.2952,
    customerLongitude: 72.8544,
    farmerId: "farm-101",
    farmerLatitude: 20.0059,
    farmerLongitude: 73.7898,
    status: "In Transit",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    trackingStep: 3,
    paymentMethod: "UPI Direct",
    paymentStatus: "Paid"
  },
  {
    id: "ORD-10242",
    items: [
      { product: DEFAULT_PRODUCTS[3], quantity: 2 },
      { product: DEFAULT_PRODUCTS[7], quantity: 2 }
    ],
    totalPrice: 1160,
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    deliveryAddress: "12/A Sahakar Nagar, Pune, Maharashtra",
    customerLatitude: 18.5204,
    customerLongitude: 73.8567,
    farmerId: "farm-102",
    farmerLatitude: 16.9902,
    farmerLongitude: 73.3120,
    status: "Harvested & Packed",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    trackingStep: 2,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid"
  },
  {
    id: "ORD-10243",
    items: [
      { product: DEFAULT_PRODUCTS[9], quantity: 10 },
      { product: DEFAULT_PRODUCTS[24], quantity: 2 }
    ],
    totalPrice: 940,
    customerName: "Rohan Mehta",
    customerPhone: "+91 91234 56789",
    deliveryAddress: "Gokuldham Heights, Goregaon East, Mumbai, MH",
    customerLatitude: 19.1663,
    customerLongitude: 72.8526,
    farmerId: "farm-103",
    farmerLatitude: 18.5204,
    farmerLongitude: 73.8567,
    status: "Delivered",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    trackingStep: 4,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Cash on Delivery",
    review: {
      rating: 5,
      tags: ["Super Fresh", "Fast Delivery"],
      comment: "Excellent organic grain quality! The Indrayani rice aroma is fantastic.",
      submittedAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [products, setProducts] = useState<Product[]>(() => {
    const defaultIds = new Set(DEFAULT_PRODUCTS.map(p => p.id));
    const saved = localStorage.getItem("agri_products");
    if (!saved) return DEFAULT_PRODUCTS;
    try {
      const parsed: Product[] = JSON.parse(saved);
      const validParsed = parsed.filter(p => !p.id.startsWith("prod-") || defaultIds.has(p.id));
      const existingIds = new Set(validParsed.map(p => p.id));
      const missingDefaults = DEFAULT_PRODUCTS.filter(p => !existingIds.has(p.id));
      const merged = [...validParsed, ...missingDefaults];
      return merged.map(p => ({
        ...p,
        image: getCropImage(p.name, p.category)
      }));
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("agri_cart");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("agri_orders");
    if (!saved) return DEFAULT_ORDERS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("agri_lang") as Language;
    return saved && (saved === "en" || saved === "hi" || saved === "mr") ? saved : "en";
  });

  // Customer Location State
  const [customerLocation, setCustomerLocationState] = useState<CustomerLocation | null>(() => {
    try {
      const saved = localStorage.getItem("agri_customer_location");
      return saved
        ? JSON.parse(saved)
        : {
            latitude: 19.2952,
            longitude: 72.8544,
            address: "Mira-Bhayandar, Maharashtra",
            isDetected: false
          };
    } catch {
      return {
        latitude: 19.2952,
        longitude: 72.8544,
        address: "Mira-Bhayandar, Maharashtra",
        isDetected: false
      };
    }
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const setCustomerLocation = (loc: CustomerLocation | null) => {
    setCustomerLocationState(loc);
    if (loc) {
      try {
        localStorage.setItem("agri_customer_location", JSON.stringify(loc));
      } catch (e) {
        console.warn("Failed to persist location:", e);
      }

      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              location: loc.address,
              latitude: loc.latitude,
              longitude: loc.longitude
            }
          : null
      );

      if (user) {
        const userRef = doc(db, "users", user.id);
        setDoc(
          userRef,
          {
            location: loc.address,
            latitude: loc.latitude,
            longitude: loc.longitude
          },
          { merge: true }
        ).catch((err) => console.warn("Firestore user location sync error:", err));
      }
    } else {
      localStorage.removeItem("agri_customer_location");
    }
  };

  const detectLocation = async (): Promise<CustomerLocation | null> => {
    setIsDetectingLocation(true);
    setLocationError(null);

    try {
      const coords = await getCurrentCoordinates();
      const address = await reverseGeocode(coords.latitude, coords.longitude);

      const loc: CustomerLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: address,
        isDetected: true,
        detectedAt: new Date().toISOString()
      };

      setCustomerLocation(loc);
      setIsDetectingLocation(false);
      return loc;
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to detect location.";
      setLocationError(errorMsg);
      setIsDetectingLocation(false);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      try {
        const profileRef = doc(db, "users", firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
          console.warn("No Firestore profile found for:", firebaseUser.uid);
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            email: firebaseUser.email || "",
            phone: firebaseUser.phoneNumber || "",
            role: "CUSTOMER"
          });
          return;
        }

        const profile = profileSnap.data();

        const appUser: User = {
          id: firebaseUser.uid,
          name: profile.name || firebaseUser.displayName || "User",
          phone: profile.phone || firebaseUser.phoneNumber || "",
          role: (profile.role as Role) || "CUSTOMER",
          location: profile.location || "",
          farmName: profile.farmName || "",
          latitude: typeof profile.latitude === "number" ? profile.latitude : undefined,
          longitude: typeof profile.longitude === "number" ? profile.longitude : undefined,
          email: firebaseUser.email || profile.email || ""
        };

        setUser(appUser);

        if (profile.location) {
          setCustomerLocationState((prev) => {
            if (!prev || !prev.isDetected) {
              return {
                latitude: typeof profile.latitude === "number" ? profile.latitude : 19.2952,
                longitude: typeof profile.longitude === "number" ? profile.longitude : 72.8544,
                address: profile.location,
                isDetected: false
              };
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Error fetching user profile from Firestore:", err);
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email || "",
          phone: firebaseUser.phoneNumber || "",
          role: "CUSTOMER"
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const productsRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedProducts: Product[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as Product[];
          setProducts(fetchedProducts);
        }
      },
      (error) => {
        console.error("Firestore products snapshot error:", error);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unsubscribe = onSnapshot(
      ordersRef,
      async (snapshot) => {
        if (!snapshot.empty) {
          const fetchedOrders: Order[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as Order[];
          setOrders(fetchedOrders);
        } else {
          // Auto-seed default sample orders into Firestore if orders collection is empty
          console.log("Seeding initial orders into Firestore...");
          for (const ord of DEFAULT_ORDERS) {
            try {
              await setDoc(doc(db, "orders", ord.id), ord);
            } catch (err) {
              console.warn("Error seeding order to Firestore:", ord.id, err);
            }
          }
          setOrders(DEFAULT_ORDERS);
        }
      },
      (error) => {
        console.error("Firestore orders snapshot error:", error);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    localStorage.setItem("agri_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("agri_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("agri_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("agri_lang", language);
  }, [language]);

  const t = (key: keyof TranslationKeys): string => {
    return translations[language]?.[key] || translations["en"][key] || key;
  };

  const login = async (newUser: User) => {
    let lat = newUser.latitude;
    let lng = newUser.longitude;

    if ((lat === undefined || lng === undefined) && newUser.location) {
      const derived = getCoordinatesForLocation(newUser.location);
      if (derived) {
        lat = lat ?? derived.latitude;
        lng = lng ?? derived.longitude;
      }
    }

    const completeUser: User = {
      ...newUser,
      latitude: lat,
      longitude: lng,
      farmName: newUser.farmName || (newUser.role === "FARMER" ? `${newUser.name.split(" ")[0]}'s Farm` : "")
    };

    setUser(completeUser);

    if (completeUser.id) {
      try {
        const updatePayload: Record<string, any> = {
          name: completeUser.name,
          phone: completeUser.phone,
          role: completeUser.role,
          location: completeUser.location || "",
          farmName: completeUser.farmName || "",
          updatedAt: new Date().toISOString()
        };

        if (completeUser.latitude !== undefined) {
          updatePayload.latitude = completeUser.latitude;
        }
        if (completeUser.longitude !== undefined) {
          updatePayload.longitude = completeUser.longitude;
        }

        await setDoc(
          doc(db, "users", completeUser.id),
          updatePayload,
          { merge: true }
        );
      } catch (err) {
        console.error("Failed to save user data to Firestore:", err);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const addProduct = async (prod: Omit<Product, "id">) => {
    const prodId = "prod-" + Date.now();
    const coords = prod.location ? getCoordinatesForLocation(prod.location) : { latitude: 19.2952, longitude: 72.8544 };
    const newProd: Product = {
      ...prod,
      id: prodId,
      farmerId: prod.farmerId || user?.id,
      latitude: prod.latitude || coords.latitude,
      longitude: prod.longitude || coords.longitude
    };
    setProducts((prev) => [newProd, ...prev]);
    try {
      await setDoc(doc(db, "products", prodId), newProd);
    } catch (err) {
      console.error("Failed to add product to Firestore:", err);
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    try {
      await updateDoc(doc(db, "products", id), updated);
    } catch (err) {
      console.error("Failed to update product in Firestore:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error("Failed to delete product from Firestore:", err);
    }
  };

  const addToCart = (product: Product, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = (
    deliveryAddress: string,
    customerPhone: string,
    paymentMethod: string = "UPI Direct",
    paymentStatus: "Paid" | "Pending" | "Cash on Delivery" = "Paid"
  ): Order => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const deliveryFee = subtotal > 0 ? 20 : 0;
    const totalPrice = subtotal + deliveryFee;
    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);

    const firstProduct = cart[0]?.product;
    const farmerCoords = firstProduct
      ? (firstProduct.latitude && firstProduct.longitude
          ? { latitude: firstProduct.latitude, longitude: firstProduct.longitude }
          : getCoordinatesForLocation(firstProduct.location))
      : { latitude: 20.0059, longitude: 73.7898 };

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      totalPrice,
      customerName: user?.name || "Guest Customer",
      customerPhone: customerPhone || user?.phone || "+91 99999 99999",
      deliveryAddress,
      customerLatitude: customerLocation?.latitude || 19.2952,
      customerLongitude: customerLocation?.longitude || 72.8544,
      farmerId: firstProduct?.farmerId || "farm-101",
      farmerLatitude: farmerCoords.latitude,
      farmerLongitude: farmerCoords.longitude,
      status: "Placed",
      createdAt: new Date().toISOString(),
      trackingStep: 1,
      paymentMethod,
      paymentStatus
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    setDoc(doc(db, "orders", orderId), newOrder).catch((err) => {
      console.error("Failed to save order to Firestore:", err);
    });

    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"],
    step: number
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, trackingStep: step } : o))
    );
    try {
      await updateDoc(doc(db, "orders", orderId), { status, trackingStep: step });
    } catch (err) {
      console.error("Failed to update order status in Firestore:", err);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await deleteDoc(doc(db, "orders", orderId));
    } catch (err) {
      console.error("Failed to delete order from Firestore:", err);
    }
  };

  const addOrderReview = async (orderId: string, review: OrderReview) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, review } : o))
    );
    try {
      await updateDoc(doc(db, "orders", orderId), { review });
    } catch (err) {
      console.error("Failed to add order review to Firestore:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        addOrderReview,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        language,
        setLanguage,
        t,
        customerLocation,
        setCustomerLocation,
        detectLocation,
        isDetectingLocation,
        locationError
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
