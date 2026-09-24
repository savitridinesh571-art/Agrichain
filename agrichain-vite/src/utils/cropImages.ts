// Name-wise Crop Image Resolver for AgriChain Marketplace

const CROP_IMAGE_MAP: Record<string, string> = {
  // Local Uploaded Crops (Highest Priority)
  "tomato": "/crops/tomato.png",
  "tomatoes": "/crops/tomato.png",
  "organic tomatoes": "/crops/tomato.png",
  "टोमॅटो": "/crops/tomato.png",
  "टमाटर": "/crops/tomato.png",

  "onion": "/crops/onion.png",
  "onions": "/crops/onion.png",
  "red onion": "/crops/onion.png",
  "कांदा": "/crops/onion.png",
  "प्याज़": "/crops/onion.png",

  "chili": "/crops/chili.png",
  "chilli": "/crops/chili.png",
  "green chili": "/crops/chili.png",
  "green chilli": "/crops/chili.png",
  "मिरची": "/crops/chili.png",
  "हरी मिर्च": "/crops/chili.png",

  "alphonsa mangoes": "/crops/mango.png",
  "mango": "/crops/mango.png",
  "mangoes": "/crops/mango.png",
  "haapus": "/crops/mango.png",
  "हापूस आंबा": "/crops/mango.png",
  "आम": "/crops/mango.png",

  "potato": "/crops/potato.png",
  "potatoes": "/crops/potato.png",
  "fresh potato": "/crops/potato.png",
  "बटाटा": "/crops/potato.png",
  "आलू": "/crops/potato.png",

  "green peas": "/crops/peas.png",
  "peas": "/crops/peas.png",
  "मटार": "/crops/peas.png",

  // Vegetables
  "cabbage": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80",
  "कोबी": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80",

  "cauliflower": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80",
  "फ्लॉवर": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80",

  "carrot": "https://images.unsplash.com/photo-1598170845058-128a2b634812?auto=format&fit=crop&w=800&q=80",
  "गाजर": "https://images.unsplash.com/photo-1598170845058-128a2b634812?auto=format&fit=crop&w=800&q=80",

  "radish": "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80",
  "मुळा": "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80",

  "beetroot": "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80",
  "बीट": "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80",

  "spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
  "पालक": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",

  "coriander": "https://images.unsplash.com/photo-1588879460405-b06f1ef78f30?auto=format&fit=crop&w=800&q=80",
  "कोथिंबीर": "https://images.unsplash.com/photo-1588879460405-b06f1ef78f30?auto=format&fit=crop&w=800&q=80",

  "fenugreek": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
  "methi": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
  "मेथी": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",

  "capsicum": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
  "ढोबळी मिरची": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",

  "lady finger": "https://images.unsplash.com/photo-1628773822503-930a84333bfa?auto=format&fit=crop&w=800&q=80",
  "okra": "https://images.unsplash.com/photo-1628773822503-930a84333bfa?auto=format&fit=crop&w=800&q=80",
  "bhindi": "https://images.unsplash.com/photo-1628773822503-930a84333bfa?auto=format&fit=crop&w=800&q=80",
  "भेंडी": "https://images.unsplash.com/photo-1628773822503-930a84333bfa?auto=format&fit=crop&w=800&q=80",

  "cucumber": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80",
  "काकडी": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80",

  "bottle gourd": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "lauki": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "दुधी भोपळा": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",

  "bitter gourd": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "karela": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "कारले": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",

  "ridge gourd": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "turai": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "शिराळी": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",

  // Fruits
  "apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
  "सफरचंद": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",

  "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  "केळी": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",

  "orange": "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
  "संत्री": "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",

  "grapes": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
  "द्राक्षे": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",

  "papaya": "https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=800&q=80",
  "पपई": "https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&w=800&q=80",

  "watermelon": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
  "कलिंगड": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",

  "muskmelon": "https://images.unsplash.com/photo-1598170845058-128a2b634812?auto=format&fit=crop&w=800&q=80",
  "टरबूज": "https://images.unsplash.com/photo-1598170845058-128a2b634812?auto=format&fit=crop&w=800&q=80",

  "guava": "https://images.unsplash.com/photo-1536511135884-77085799a4e4?auto=format&fit=crop&w=800&q=80",
  "पेरू": "https://images.unsplash.com/photo-1536511135884-77085799a4e4?auto=format&fit=crop&w=800&q=80",

  "pomegranate": "/crops/pomegranate.png",
  "डाळिंब": "/crops/pomegranate.png",
  "अनार": "/crops/pomegranate.png",

  "pineapple": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
  "अननस": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",

  "strawberry": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
  "स्ट्रॉबेरी": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",

  "chikoo": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
  "sapota": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
  "चिकू": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",

  "custard apple": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
  "sitaphal": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
  "सीताफळ": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",

  // --- GRAINS ---
  "rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "basmati rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "indrayani rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "तांदूळ": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "चावल": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",

  "wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "sharbati wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "गहू": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "गेहूं": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",

  "maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
  "corn": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
  "maize (corn)": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
  "मका": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",

  "barley": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
  "organic barley": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
  "जव": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
  "जौ": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",

  "jowar": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "sorghum": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "jowar (sorghum)": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "ज्वारी": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",

  "bajra": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "pearl millet": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "bajra (pearl millet)": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "बाजरी": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",

  "ragi": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "finger millet": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "ragi (finger millet)": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "नाचणी": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",

  "foxtail millet": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "राळा": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",

  "little millet": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "वरी": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",

  "kodo millet": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "कोद्रा": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",

  "barnyard millet": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "barnyard millet (bhagar)": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "भगर": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",

  "proso millet": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "वरई": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",

  "rolled oats": "https://images.unsplash.com/photo-1584947897568-7c87c04a29a6?auto=format&fit=crop&w=800&q=80",
  "oats": "https://images.unsplash.com/photo-1584947897568-7c87c04a29a6?auto=format&fit=crop&w=800&q=80",
  "ओट्स": "https://images.unsplash.com/photo-1584947897568-7c87c04a29a6?auto=format&fit=crop&w=800&q=80",

  "organic quinoa": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "quinoa": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "क्विनोआ": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",

  "amaranth": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "rajgira": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "amaranth (rajgira)": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "राजगिरा": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",

  // --- PULSES & LEGUMES (AUTHENTIC HIGH-RES CROP PHOTOS) ---
  "toor dal": "/crops/toor_dal.png",
  "arhar": "/crops/toor_dal.png",
  "toor dal / arhar": "/crops/toor_dal.png",
  "तूर डाळ": "/crops/toor_dal.png",

  "moong dal": "/crops/toor_dal.png",
  "green gram": "/crops/toor_dal.png",
  "moong dal (green gram)": "/crops/toor_dal.png",
  "मूग डाळ": "/crops/toor_dal.png",

  "urad dal": "/crops/urad_dal.png",
  "black gram": "/crops/urad_dal.png",
  "urad dal (black gram)": "/crops/urad_dal.png",
  "उडीद डाळ": "/crops/urad_dal.png",

  "chana": "/crops/chana.png",
  "chickpea": "/crops/chana.png",
  "chana / chickpea": "/crops/chana.png",
  "हरभरा": "/crops/chana.png",

  "masoor dal": "/crops/rajma.png",
  "red lentil": "/crops/rajma.png",
  "masoor dal (red lentil)": "/crops/rajma.png",
  "मसूर डाळ": "/crops/rajma.png",

  "rajma": "/crops/rajma.png",
  "kidney beans": "/crops/rajma.png",
  "rajma (kidney beans)": "/crops/rajma.png",
  "राजमा": "/crops/rajma.png",

  "kabuli chana": "/crops/chana.png",
  "white chickpea": "/crops/chana.png",
  "काबुली चणा": "/crops/chana.png",

  "black chickpea": "/crops/chana.png",
  "kala chana": "/crops/chana.png",
  "black chickpea (kala chana)": "/crops/chana.png",
  "काळा चणा": "/crops/chana.png",

  "matar": "/crops/peas.png",
  "matar / dried peas": "/crops/peas.png",
  "dried peas": "/crops/peas.png",
  "वाटाणा": "/crops/peas.png",

  "lobia": "/crops/chana.png",
  "black-eyed peas": "/crops/chana.png",
  "lobia (black-eyed peas)": "/crops/chana.png",

  "kulith": "/crops/urad_dal.png",
  "horse gram": "/crops/urad_dal.png",
  "kulith / horse gram": "/crops/urad_dal.png",
  "कुळीथ": "/crops/urad_dal.png",

  "moth beans": "/crops/urad_dal.png",
  "मटकी": "/crops/urad_dal.png",

  "organic soybean": "/crops/toor_dal.png",
  "soybean": "/crops/toor_dal.png",
  "सोयाबीन": "/crops/toor_dal.png",

  "cowpea": "/crops/chana.png",
  "चवळी": "/crops/chana.png",

  "field beans": "/crops/chana.png",
  "val": "/crops/chana.png",
  "field beans (val)": "/crops/chana.png",
  "वाल": "/crops/chana.png",

  "pigeon peas": "/crops/toor_dal.png",
  "तुरीची डाळ": "/crops/toor_dal.png",

  "whole lentils": "/crops/urad_dal.png",
  "lentils": "/crops/urad_dal.png",
  "मसूर": "/crops/urad_dal.png"
};

// Fallbacks by Category
const CATEGORY_FALLBACKS: Record<string, string> = {
  "Vegetables": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  "Fruits": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
  "Grains": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  "Pulses": "/crops/toor_dal.png"
};

export function getCropImage(productName: string, category: string = "Vegetables", existingImage?: string): string {
  const nameLower = productName.toLowerCase().trim();

  // Direct match in name-wise crop map takes HIGHEST priority
  if (CROP_IMAGE_MAP[nameLower]) {
    return CROP_IMAGE_MAP[nameLower];
  }

  // Substring match in name-wise crop map
  for (const [key, url] of Object.entries(CROP_IMAGE_MAP)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return url;
    }
  }

  // If existing image is valid and not a internal media/screenshot path or generic salad image
  if (
    existingImage &&
    existingImage.trim().length > 0 &&
    !existingImage.includes("media__") &&
    !existingImage.includes("register") &&
    !existingImage.includes("auth") &&
    !existingImage.includes("photo-1515543237350") &&
    !existingImage.includes("localhost:5173/src")
  ) {
    return existingImage;
  }

  // Category fallback
  return CATEGORY_FALLBACKS[category] || "/crops/toor_dal.png";
}
