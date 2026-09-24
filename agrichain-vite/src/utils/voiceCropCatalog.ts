import { getCropImage } from "./cropImages";

export interface VoiceCropItem {
  id: string;
  name: string;
  localName: string;
  marathiName: string;
  hindiName: string;
  category: "Vegetables" | "Fruits" | "Grains" | "Pulses";
  defaultPrice: number;
  image: string;
  aliases: string[];
}

export const COMPREHENSIVE_CROP_CATALOG: VoiceCropItem[] = [
  // Vegetables
  {
    id: "tomato",
    name: "Organic Tomatoes",
    localName: "टोमॅटो / टमाटर",
    marathiName: "टोमॅटो",
    hindiName: "टमाटर",
    category: "Vegetables",
    defaultPrice: 30,
    image: "/crops/tomato.png",
    aliases: ["tomato", "tomatoes", "टोमॅटो", "टमाटर", "tamatar", "टोमेटो", "टॉमेटो", "रेड टोमॅटो"]
  },
  {
    id: "onion",
    name: "Nashik Red Onions",
    localName: "कांदा / प्याज",
    marathiName: "कांदा",
    hindiName: "प्याज",
    category: "Vegetables",
    defaultPrice: 32,
    image: "/crops/onion.png",
    aliases: [
      "onion", "onions", "red onion", "कांदा", "प्याज", "kanda", "pyaz",
      "ओन्यिन", "ऑनियन", "अनियन", "रेड ओन्यिन", "रेड ऑनियन", "रेड अनियन", "रेड कांदा", "ओनियन"
    ]
  },
  {
    id: "potato",
    name: "Fresh Potatoes",
    localName: "बटाटा / आलू",
    marathiName: "बटाटा",
    hindiName: "आलू",
    category: "Vegetables",
    defaultPrice: 25,
    image: "/crops/potato.png",
    aliases: ["potato", "potatoes", "बटाटा", "आलू", "batata", "aalu", "aloo", "पोटॅटो", "पोटेटो"]
  },
  {
    id: "chili",
    name: "Spicy Green Chili",
    localName: "हिरवी मिरची / हरी मिर्च",
    marathiName: "हिरवी मिरची",
    hindiName: "हरी मिर्च",
    category: "Vegetables",
    defaultPrice: 65,
    image: "/crops/green_chili.png",
    aliases: ["chili", "chilli", "mirchi", "हिरवी मिरची", "हरी मिर्च", "mirch", "मिरची", "चिली", "ग्रीन चिली"]
  },
  {
    id: "garlic",
    name: "Farm Garlic",
    localName: "लसूण / लहसुन",
    marathiName: "लसूण",
    hindiName: "लहसुन",
    category: "Vegetables",
    defaultPrice: 140,
    image: "/crops/garlic.png",
    aliases: ["garlic", "लसूण", "लहसुन", "lasun", "lahsun", "गार्लिक", "गारलिक"]
  },
  {
    id: "ginger",
    name: "Fresh Ginger",
    localName: "आले / अदरक",
    marathiName: "आले",
    hindiName: "अदरक",
    category: "Vegetables",
    defaultPrice: 90,
    image: "/crops/ginger.png",
    aliases: ["ginger", "आले", "अदरक", "aale", "adrak", "जिंजर", "जिन्जर"]
  },
  {
    id: "spinach",
    name: "Organic Spinach",
    localName: "पालक",
    marathiName: "पालक",
    hindiName: "पालक",
    category: "Vegetables",
    defaultPrice: 20,
    image: "/crops/spinach.png",
    aliases: ["spinach", "पालक", "palak", "स्पिनॅच"]
  },
  {
    id: "cauliflower",
    name: "Fresh Cauliflower",
    localName: "फ्लॉवर / फूलगोभी",
    marathiName: "फ्लॉवर",
    hindiName: "फूलगोभी",
    category: "Vegetables",
    defaultPrice: 35,
    image: "/crops/cauliflower.png",
    aliases: ["cauliflower", "gobi", "flower", "फ्लॉवर", "फूलगोभी", "phoolgobi", "कॉलीफ्लॉवर"]
  },
  {
    id: "brinjal",
    name: "Fresh Brinjal (Eggplant)",
    localName: "वांगी / बैंगन",
    marathiName: "वांगी",
    hindiName: "बैंगन",
    category: "Vegetables",
    defaultPrice: 40,
    image: "/crops/tomato.png",
    aliases: ["brinjal", "eggplant", "baingan", "वांगी", "बैंगन", "vangi", "ब्रिंजल"]
  },
  {
    id: "ladyfinger",
    name: "Organic Okra (Lady Finger)",
    localName: "भेंडी / भिंडी",
    marathiName: "भेंडी",
    hindiName: "भिंडी",
    category: "Vegetables",
    defaultPrice: 45,
    image: "/crops/green_chili.png",
    aliases: ["okra", "ladyfinger", "bhindi", "भेंडी", "भिंडी", "लेडी फिंगर"]
  },

  // Fruits
  {
    id: "mango",
    name: "Alphonso Mangoes",
    localName: "हापूस आंबा / आम",
    marathiName: "हापूस आंबा",
    hindiName: "आम",
    category: "Fruits",
    defaultPrice: 150,
    image: "/crops/alphonso_mango.png",
    aliases: ["mango", "mangoes", "alphonso", "hapus", "आंबा", "आम", "amba", "aam", "मँगो", "मॅंगो", "हापूस"]
  },
  {
    id: "banana",
    name: "Golden Bananas",
    localName: "केळी / केला",
    marathiName: "केळी",
    hindiName: "केला",
    category: "Fruits",
    defaultPrice: 40,
    image: "/crops/banana.png",
    aliases: ["banana", "bananas", "केळी", "केला", "keli", "kela", "बनाना"]
  },
  {
    id: "pomegranate",
    name: "Red Pomegranate",
    localName: "डाळिंब / अनार",
    marathiName: "डाळिंब",
    hindiName: "अनार",
    category: "Fruits",
    defaultPrice: 120,
    image: "/crops/pomegranate.png",
    aliases: ["pomegranate", "dalimb", "anar", "डाळिंब", "अनार", "पोमेग्रॅनेट"]
  },
  {
    id: "grapes",
    name: "Nashik Green Grapes",
    localName: "द्राक्षे / अंगूर",
    marathiName: "द्राक्षे",
    hindiName: "अंगूर",
    category: "Fruits",
    defaultPrice: 80,
    image: "/crops/grapes.png",
    aliases: ["grapes", "draksha", "angoor", "द्राक्षे", "अंगूर", "ग्रेप्स"]
  },
  {
    id: "apple",
    name: "Kashmir Red Apples",
    localName: "सफरचंद / सेब",
    marathiName: "सफरचंद",
    hindiName: "सेब",
    category: "Fruits",
    defaultPrice: 110,
    image: "/crops/apple.png",
    aliases: ["apple", "apples", "safarchand", "seb", "सफरचंद", "सेब", "ॲपल", "एपळ"]
  },
  {
    id: "papaya",
    name: "Fresh Papaya",
    localName: "पपई / पपीता",
    marathiName: "पपई",
    hindiName: "पपीता",
    category: "Fruits",
    defaultPrice: 35,
    image: "/crops/papaya.png",
    aliases: ["papaya", "पपई", "पपीता", "papai", "papeeta", "पपाया"]
  },

  // Grains
  {
    id: "rice",
    name: "Indrayani Rice",
    localName: "तांदूळ / चावल",
    marathiName: "तांदूळ",
    hindiName: "चावल",
    category: "Grains",
    defaultPrice: 60,
    image: "/crops/rice.png",
    aliases: ["rice", "indrayani", "tandul", "chawal", "तांदूळ", "चावल", "राइस", "राईस", "भाता"]
  },
  {
    id: "wheat",
    name: "Sharbati Wheat",
    localName: "गहू / गेहूं",
    marathiName: "गहू",
    hindiName: "गेहूं",
    category: "Grains",
    defaultPrice: 45,
    image: "/crops/wheat.png",
    aliases: ["wheat", "gahu", "gehun", "गहू", "गेहूं", "व्हीट", "व्हिट"]
  },
  {
    id: "corn",
    name: "Golden Maize (Corn)",
    localName: "मका / मक्का",
    marathiName: "मका",
    hindiName: "मक्का",
    category: "Grains",
    defaultPrice: 28,
    image: "/crops/corn.png",
    aliases: ["corn", "maize", "maka", "makka", "मका", "मक्का", "कॉर्न"]
  },
  {
    id: "jowar",
    name: "Hybrid Jowar",
    localName: "ज्वारी / ज्वार",
    marathiName: "ज्वारी",
    hindiName: "ज्वार",
    category: "Grains",
    defaultPrice: 38,
    image: "/crops/jowar.png",
    aliases: ["jowar", "jwari", "jwar", "ज्वारी", "ज्वार", "जोवार"]
  },
  {
    id: "bajra",
    name: "Organic Bajra",
    localName: "बाजरी / बाजरा",
    marathiName: "बाजरी",
    hindiName: "बाजरा",
    category: "Grains",
    defaultPrice: 32,
    image: "/crops/bajra.png",
    aliases: ["bajra", "bajri", "बाजरी", "बाजरा", "बाजरी"]
  },

  // Pulses
  {
    id: "toor",
    name: "Toor Dal (Arhar)",
    localName: "तूर डाळ / अरहर",
    marathiName: "तूर डाळ",
    hindiName: "अरहर",
    category: "Pulses",
    defaultPrice: 130,
    image: "/crops/toor_dal.png",
    aliases: ["toor", "arhar", "tur dal", "तूर डाळ", "अरहर", "toor dal", "तूर"]
  },
  {
    id: "moong",
    name: "Moong Dal (Green Gram)",
    localName: "मूग डाळ / मूंग",
    marathiName: "मूग डाळ",
    hindiName: "मूंग",
    category: "Pulses",
    defaultPrice: 110,
    image: "/crops/toor_dal.png",
    aliases: ["moong", "mung", "मूग डाळ", "मूंग", "मूग"]
  },
  {
    id: "urad",
    name: "Urad Dal (Black Gram)",
    localName: "उडीद डाळ / उड़द",
    marathiName: "उडीद डाळ",
    hindiName: "उड़द",
    category: "Pulses",
    defaultPrice: 120,
    image: "/crops/urad_dal.png",
    aliases: ["urad", "udid", "उडीद डाळ", "उड़द", "उडीद"]
  },
  {
    id: "chana",
    name: "Chana (Chickpea)",
    localName: "हरभरा / चना",
    marathiName: "हरभरा",
    hindiName: "चना",
    category: "Pulses",
    defaultPrice: 85,
    image: "/crops/chana.png",
    aliases: ["chana", "chickpea", "harbhara", "हरभरा", "चना", "चणा"]
  },
  {
    id: "rajma",
    name: "Rajma (Kidney Beans)",
    localName: "राजमा",
    marathiName: "राजमा",
    hindiName: "राजमा",
    category: "Pulses",
    defaultPrice: 140,
    image: "/crops/rajma.png",
    aliases: ["rajma", "kidney beans", "राजमा"]
  }
];

/**
 * Converts Devanagari numerals (०-९) to Latin digits (0-9)
 */
export function convertDevanagariNumerals(str: string): string {
  const devanagariDigits: { [key: string]: string } = {
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9"
  };
  return str.replace(/[०-९]/g, match => devanagariDigits[match] || match);
}

/**
 * Text-to-speech audio feedback for farmers out loud
 */
export function speakTextOutLoud(text: string, lang: "mr" | "hi" | "en" = "mr") {
  if (!("speechSynthesis" in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    if (lang === "mr") {
      utterance.lang = "mr-IN";
    } else if (lang === "hi") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Graceful speech synthesis fallback
  }
}

/**
 * Main NLP voice input parser
 */
export function parseVoiceInputToCrop(spokenText: string) {
  const normalizedText = convertDevanagariNumerals(spokenText);
  const text = normalizedText.toLowerCase();

  // Tokenize input words
  const tokens = text.split(/[\s,./\-\(\)]+/).filter(Boolean);

  // 1. Try exact or alias match across whole text
  let matched = COMPREHENSIVE_CROP_CATALOG.find(crop => 
    crop.aliases.some(alias => text.includes(alias.toLowerCase())) ||
    text.includes(crop.name.toLowerCase()) ||
    text.includes(crop.marathiName.toLowerCase()) ||
    text.includes(crop.hindiName.toLowerCase())
  );

  // 2. If no direct match, check individual word tokens matching crop aliases
  if (!matched) {
    matched = COMPREHENSIVE_CROP_CATALOG.find(crop =>
      crop.aliases.some(alias =>
        tokens.some(t => t.includes(alias.toLowerCase()) || alias.toLowerCase().includes(t))
      )
    );
  }

  // Default fallback if no keyword matches
  if (!matched) {
    matched = COMPREHENSIVE_CROP_CATALOG[0]; // Organic Tomatoes
  }

  // 3. Parse quantity (e.g., 25 केजी, 50kg, 100 kg, 20 किग्रा, पन्नास)
  let quantity = 50;
  const qtyMatch = normalizedText.match(/(\d+)\s*(kg|kilos|किलो|किग्रा|केजी)?/i);
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1], 10);
  } else if (text.includes("पन्नास") || text.includes("पचास")) {
    quantity = 50;
  } else if (text.includes("शंभर") || text.includes("सौ")) {
    quantity = 100;
  } else if (text.includes("वीस") || text.includes("बीस")) {
    quantity = 20;
  } else if (text.includes("तीस")) {
    quantity = 30;
  }

  // 4. Parse price (e.g., ₹60 केजी, ₹30, 30 per kg, 120 rs, 40 रुपये)
  let price = matched.defaultPrice;

  // Search for price patterns like ₹60, 60 रु, 60 केजी (second number), or @ 60
  const numbers = [...normalizedText.matchAll(/(\d+)/g)].map(m => parseInt(m[0], 10));

  if (numbers.length >= 2) {
    // If multiple numbers spoken (e.g. 25 kg, 60 rs), quantity is usually 1st, price is 2nd!
    const candidatePrice = numbers[1];
    if (candidatePrice > 0 && candidatePrice <= 1000) {
      price = candidatePrice;
    }
  } else {
    const priceMatch = normalizedText.match(/₹?\s*(\d+)\s*(per\s*kg|rs|रुपये|रु|केजी)?/i);
    if (priceMatch) {
      const parsedPriceVal = parseInt(priceMatch[1], 10);
      if (parsedPriceVal > 0 && parsedPriceVal <= 1000) {
        price = parsedPriceVal;
      }
    }
  }

  const image = getCropImage(matched.name, matched.category, matched.image);

  return {
    matchedCrop: matched,
    quantity,
    price,
    image
  };
}

export interface MandiCropPriceInfo {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  trend: "up" | "down" | "stable";
  changePct: string;
  arrivalQty: string;
}

export interface MandiMarketPrice {
  id: string;
  mandiName: string;
  mandiLocalName: string;
  district: string;
  badge: string;
  cropPrices: {
    [cropId: string]: MandiCropPriceInfo;
  };
}

export const FIVE_LOCAL_MANDI_MARKETS: MandiMarketPrice[] = [
  {
    id: "mandi-nashik",
    mandiName: "1. Nashik APMC Main Yard",
    mandiLocalName: "१. नाशिक एपीएमसी मुख्य बाजार",
    district: "Nashik, MH",
    badge: "Major Producer Hub",
    cropPrices: {
      onion: { minPrice: 28, maxPrice: 34, avgPrice: 32, trend: "up", changePct: "+5.2%", arrivalQty: "4,200 Qtl" },
      tomato: { minPrice: 26, maxPrice: 32, avgPrice: 29, trend: "up", changePct: "+4.1%", arrivalQty: "2,800 Qtl" },
      potato: { minPrice: 22, maxPrice: 26, avgPrice: 24, trend: "stable", changePct: "0.0%", arrivalQty: "1,950 Qtl" },
      wheat: { minPrice: 42, maxPrice: 48, avgPrice: 45, trend: "up", changePct: "+2.0%", arrivalQty: "3,100 Qtl" },
      mango: { minPrice: 130, maxPrice: 160, avgPrice: 145, trend: "up", changePct: "+6.5%", arrivalQty: "850 Qtl" }
    }
  },
  {
    id: "mandi-pune",
    mandiName: "2. Pune APMC Gultekadi Market",
    mandiLocalName: "२. पुणे मार्केट यार्ड गुलटेकडी",
    district: "Pune, MH",
    badge: "High Consumer Demand",
    cropPrices: {
      onion: { minPrice: 30, maxPrice: 36, avgPrice: 34, trend: "up", changePct: "+3.8%", arrivalQty: "5,100 Qtl" },
      tomato: { minPrice: 28, maxPrice: 35, avgPrice: 31, trend: "up", changePct: "+5.0%", arrivalQty: "3,400 Qtl" },
      potato: { minPrice: 24, maxPrice: 28, avgPrice: 26, trend: "up", changePct: "+1.5%", arrivalQty: "2,400 Qtl" },
      wheat: { minPrice: 44, maxPrice: 50, avgPrice: 47, trend: "stable", changePct: "0.0%", arrivalQty: "4,000 Qtl" },
      mango: { minPrice: 140, maxPrice: 175, avgPrice: 155, trend: "up", changePct: "+4.2%", arrivalQty: "1,200 Qtl" }
    }
  },
  {
    id: "mandi-vashi",
    mandiName: "3. Vashi APMC Hub (Navi Mumbai)",
    mandiLocalName: "३. वाशी एपीएमसी नवी मुंबई",
    district: "Navi Mumbai, MH",
    badge: "Highest Price Realization",
    cropPrices: {
      onion: { minPrice: 34, maxPrice: 42, avgPrice: 38, trend: "up", changePct: "+7.4%", arrivalQty: "6,800 Qtl" },
      tomato: { minPrice: 32, maxPrice: 40, avgPrice: 35, trend: "up", changePct: "+6.8%", arrivalQty: "4,500 Qtl" },
      potato: { minPrice: 26, maxPrice: 32, avgPrice: 28, trend: "up", changePct: "+3.0%", arrivalQty: "3,800 Qtl" },
      wheat: { minPrice: 48, maxPrice: 55, avgPrice: 52, trend: "up", changePct: "+1.8%", arrivalQty: "5,200 Qtl" },
      mango: { minPrice: 160, maxPrice: 210, avgPrice: 185, trend: "up", changePct: "+8.5%", arrivalQty: "2,100 Qtl" }
    }
  },
  {
    id: "mandi-kolhapur",
    mandiName: "4. Kolhapur APMC Central Yard",
    mandiLocalName: "४. कोल्हापूर बाजार समिती",
    district: "Kolhapur, MH",
    badge: "South MH Agro Hub",
    cropPrices: {
      onion: { minPrice: 26, maxPrice: 32, avgPrice: 29, trend: "down", changePct: "-1.5%", arrivalQty: "2,900 Qtl" },
      tomato: { minPrice: 25, maxPrice: 30, avgPrice: 28, trend: "stable", changePct: "0.0%", arrivalQty: "2,100 Qtl" },
      potato: { minPrice: 21, maxPrice: 25, avgPrice: 23, trend: "stable", changePct: "0.0%", arrivalQty: "1,500 Qtl" },
      wheat: { minPrice: 41, maxPrice: 46, avgPrice: 43, trend: "up", changePct: "+1.2%", arrivalQty: "2,300 Qtl" },
      mango: { minPrice: 125, maxPrice: 150, avgPrice: 135, trend: "stable", changePct: "0.0%", arrivalQty: "600 Qtl" }
    }
  },
  {
    id: "mandi-nagpur",
    mandiName: "5. Nagpur Kalamna APMC Mandi",
    mandiLocalName: "५. नागपूर कळमणा एपीएमसी",
    district: "Nagpur, MH",
    badge: "Vidarbha Regional Market",
    cropPrices: {
      onion: { minPrice: 29, maxPrice: 35, avgPrice: 31, trend: "up", changePct: "+2.5%", arrivalQty: "3,600 Qtl" },
      tomato: { minPrice: 27, maxPrice: 33, avgPrice: 30, trend: "up", changePct: "+3.5%", arrivalQty: "2,700 Qtl" },
      potato: { minPrice: 23, maxPrice: 27, avgPrice: 25, trend: "up", changePct: "+1.0%", arrivalQty: "1,800 Qtl" },
      wheat: { minPrice: 43, maxPrice: 49, avgPrice: 46, trend: "up", changePct: "+2.2%", arrivalQty: "3,900 Qtl" },
      mango: { minPrice: 135, maxPrice: 165, avgPrice: 150, trend: "up", changePct: "+5.0%", arrivalQty: "950 Qtl" }
    }
  }
];

