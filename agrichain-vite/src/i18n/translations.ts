export type Language = "en" | "hi" | "mr";

export interface TranslationKeys {
  // Brand & Header Navigation
  brand: string;
  searchPlaceholder: string;
  home: string;
  farmerHub: string;
  voiceAssistant: string;
  addHarvest: string;
  cart: string;
  orders: string;
  profile: string;
  login: string;
  logout: string;
  farmerMode: string;
  customerMode: string;
  languageSelect: string;

  // Categories
  all: string;
  vegetables: string;
  fruits: string;
  grains: string;
  pulses: string;

  // Marketplace & Hero
  heroTitle: string;
  heroSubtitle: string;
  livingSoilCertified: string;
  gradeA: string;
  fairPrice: string;
  addToCart: string;
  inCart: string;
  outOfStock: string;
  pricePerKg: string;
  viewDetails: string;
  availableQty: string;
  farmerName: string;
  harvestDate: string;

  // Farmer Voice Assistant & Dashboard
  farmerTitle: string;
  speakToList: string;
  micButtonLabel: string;
  listening: string;
  supportedCatalog: string;
  mandiIndex: string;
  tryVoicePrompts: string;

  // Cart & Orders
  cartTitle: string;
  checkout: string;
  emptyCart: string;
  orderHistory: string;

  // Profile
  farmerProfileTitle: string;
  customerProfileTitle: string;
  fullName: string;
  mobileNumber: string;
  location: string;
  farmName: string;
  saveDetails: string;

  // Location & Nearby Farmers
  detectLocation: string;
  detectingLocation: string;
  locationDetected: string;
  nearbyFarmers: string;
  distanceAway: string;
  deliveryRoute: string;
}

export const translations: Record<Language, TranslationKeys> = {
  en: {
    brand: "AGRICHAIN",
    searchPlaceholder: "Search crops, farms, pulses, fruits...",
    home: "Marketplace",
    farmerHub: "Farmer Hub",
    voiceAssistant: "Voice Assistant",
    addHarvest: "Add Harvest",
    cart: "Cart",
    orders: "My Orders",
    profile: "Profile",
    login: "Sign In / Register",
    logout: "Logout",
    farmerMode: "Farmer",
    customerMode: "Customer",
    languageSelect: "Language",

    all: "All Crops",
    vegetables: "Vegetables",
    fruits: "Fruits",
    grains: "Grains & Cereals",
    pulses: "Pulses & Legumes",

    heroTitle: "Direct Farm-to-Home Harvest",
    heroSubtitle: "Buy 100% verified organic crops directly from local Maharashtra farmers with zero middlemen.",
    livingSoilCertified: "Living Soil Certified",
    gradeA: "Grade A Quality",
    fairPrice: "Fair Price Guaranteed",
    addToCart: "Add to Cart",
    inCart: "Added in Cart",
    outOfStock: "Out of Stock",
    pricePerKg: "per kg",
    viewDetails: "View Farm Audit",
    availableQty: "Available Quantity",
    farmerName: "Farmer / Farm",
    harvestDate: "Harvested On",

    farmerTitle: "Farmer AI Assistant & Voice Listing",
    speakToList: "Speak to List Any Crop Harvest",
    micButtonLabel: "Click Mic to Speak",
    listening: "Listening to Voice...",
    supportedCatalog: "Supported Voice Command Crop Catalog",
    mandiIndex: "APMC Mandi Live Price Benchmark Index",
    tryVoicePrompts: "Try Quick Voice Commands:",

    cartTitle: "Your Fresh Produce Cart",
    checkout: "Proceed to Direct Checkout",
    emptyCart: "Your cart is currently empty",
    orderHistory: "Order Tracking & History",

    farmerProfileTitle: "Farmer Account & Farm Settings",
    customerProfileTitle: "Customer Profile & Delivery Settings",
    fullName: "Full Name",
    mobileNumber: "Mobile Number",
    location: "Location / District",
    farmName: "Registered Farm Name",
    saveDetails: "Save Profile Details",

    detectLocation: "📍 Detect My Location",
    detectingLocation: "Detecting Location...",
    locationDetected: "Location Detected Successfully",
    nearbyFarmers: "Nearby Farmers & Produce",
    distanceAway: "away",
    deliveryRoute: "Live Delivery Route"
  },

  hi: {
    brand: "एग्रीचैन",
    searchPlaceholder: "फसलें, खेत, दालें, फल खोजें...",
    home: "मंडी बाजार",
    farmerHub: "किसान हब",
    voiceAssistant: "वॉइस असिस्टेंट",
    addHarvest: "फसल जोड़ें",
    cart: "कार्ट",
    orders: "मेरे ऑर्डर",
    profile: "प्रोफ़ाइल",
    login: "साइन इन / रजिस्टर",
    logout: "लॉग आउट",
    farmerMode: "किसान",
    customerMode: "ग्राहक",
    languageSelect: "भाषा",

    all: "सभी फसलें",
    vegetables: "सब्जियां",
    fruits: "फल",
    grains: "अनाज और खाद्यान्न",
    pulses: "दालें और फलियां",

    heroTitle: "खेत से सीधे आपके घर ताज़ा फसल",
    heroSubtitle: "बिना किसी बिचौलिए के स्थानीय महाराष्ट्र के किसानों से सीधे 100% जैविक फसलें खरीदें।",
    livingSoilCertified: "जीवंत मिट्टी प्रमाणित",
    gradeA: "ग्रेड ए गुणवत्ता",
    fairPrice: "उचित मूल्य गारंटी",
    addToCart: "कार्ट में जोड़ें",
    inCart: "कार्ट में जोड़ा गया",
    outOfStock: "स्टॉक समाप्त",
    pricePerKg: "प्रति किग्रा",
    viewDetails: "फार्म ऑडिट देखें",
    availableQty: "उपलब्ध मात्रा",
    farmerName: "किसान / खेत",
    harvestDate: "कटाई की तिथि",

    farmerTitle: "किसान एआई असिस्टेंट और वॉइस लिस्टिंग",
    speakToList: "किसी भी फसल को बेचने के लिए बोलें",
    micButtonLabel: "बोलने के लिए माइक पर क्लिक करें",
    listening: "आवाज़ सुन रहे हैं...",
    supportedCatalog: "वॉइस कमांड समर्थित फसल कैटलॉग",
    mandiIndex: "एपीएमसी मंडी लाइव मूल्य सूचकांक",
    tryVoicePrompts: "त्वरित वॉइस कमांड आज़माएं:",

    cartTitle: "आपकी ताज़ा उपज कार्ट",
    checkout: "डायरेक्ट चेकआउट के लिए आगे बढ़ें",
    emptyCart: "आपकी कार्ट वर्तमान में खाली है",
    orderHistory: "ऑर्डर ट्रैकिंग और इतिहास",

    farmerProfileTitle: "किसान खाता और फार्म सेटिंग्स",
    customerProfileTitle: "ग्राहक प्रोफ़ाइल और डिलीवरी सेटिंग्स",
    fullName: "पूरा नाम",
    mobileNumber: "मोबाइल नंबर",
    location: "स्थान / जिला",
    farmName: "पंजीकृत फार्म का नाम",
    saveDetails: "विवरण सुरक्षित करें",

    detectLocation: "📍 मेरा स्थान खोजें",
    detectingLocation: "स्थान खोज रहे हैं...",
    locationDetected: "स्थान सफलतापूर्वक प्राप्त हुआ",
    nearbyFarmers: "निकटतम किसान और उपज",
    distanceAway: "दूर",
    deliveryRoute: "लाइव डिलीवरी रूट"
  },

  mr: {
    brand: "ॲग्रीचेन",
    searchPlaceholder: "पिके, शेत, डाळी, फळे शोधा...",
    home: "बाजारपेठ",
    farmerHub: "शेतकरी हब",
    voiceAssistant: "व्हॉइस असिस्टंट",
    addHarvest: "पीक जोडा",
    cart: "कार्ट",
    orders: "माझ्या मागण्या",
    profile: "प्रोफाइल",
    login: "साइन इन / नोंदणी",
    logout: "बाहेर पडा",
    farmerMode: "शेतकरी",
    customerMode: "ग्राहक",
    languageSelect: "भाषा",

    all: "सर्व पिके",
    vegetables: "भाजीपाला",
    fruits: "फळे",
    grains: "धान्य आणि तृणधान्ये",
    pulses: "डाळी आणि कडधान्ये",

    heroTitle: "थेट शेतातून घरात ताजे पीक",
    heroSubtitle: "कोणत्याही मध्यस्थाशिवाय स्थानिक महाराष्ट्रातील शेतकऱ्यांकडून थेट १००% सेंद्रिय पिके खरेदी करा.",
    livingSoilCertified: "जीवंत माती प्रमाणित",
    gradeA: "अ दर्जा गुणवत्ता",
    fairPrice: "रास्त भाव हमी",
    addToCart: "कार्टमध्ये जोडा",
    inCart: "कार्टमध्ये जोडले",
    outOfStock: "साठा संपला",
    pricePerKg: "प्रति किलो",
    viewDetails: "शेती ऑडिट पहा",
    availableQty: "उपलब्ध प्रमाण",
    farmerName: "शेतकरी / शेत",
    harvestDate: "काढणी तारीख",

    farmerTitle: "शेतकरी एआय असिस्टंट आणि व्हॉइस लिस्टिंग",
    speakToList: "कोणतेही पीक विकण्यासाठी बोला",
    micButtonLabel: "बोलण्यासाठी मायक्रोफोनवर क्लिक करा",
    listening: "आवाज ऐकत आहे...",
    supportedCatalog: "व्हॉइस कमांड समर्थित पीक सूची",
    mandiIndex: "एपीएमसी बाजार समिती थेट दर निर्देशांक",
    tryVoicePrompts: "त्वरित व्हॉइस कमांड वापरा:",

    cartTitle: "तुमचे ताजे पीक कार्ट",
    checkout: "थेट खरेदीसाठी पुढे जा",
    emptyCart: "तुमचे कार्ट सध्या रिकामे आहे",
    orderHistory: "मागणी ट्रॅकिंग आणि इतिहास",

    farmerProfileTitle: "शेतकरी खाते आणि शेत माहिती",
    customerProfileTitle: "ग्राहक प्रोफाइल आणि वितरण माहिती",
    fullName: "पूर्ण नाव",
    mobileNumber: "मोबाइल क्रमांक",
    location: "स्थान / जिल्हा",
    farmName: "नोंदणीकृत शेताचे नाव",
    saveDetails: "माहिती जतन करा",

    detectLocation: "📍 माझे स्थान शोधा",
    detectingLocation: "स्थान शोधत आहे...",
    locationDetected: "स्थान यशस्वीरित्या मिळाले",
    nearbyFarmers: "जवळचे शेतकरी आणि पीक",
    distanceAway: "दूर",
    deliveryRoute: "थेट डिलिव्हरी मार्ग"
  }
};
