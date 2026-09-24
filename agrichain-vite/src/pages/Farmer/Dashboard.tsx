import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Mic, MicOff, Volume2, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, ShieldCheck, Sprout, ShoppingBag } from "lucide-react";
import { getCropImage } from "../../utils/cropImages";

// Comprehensive catalog list for Voice Assistant recognition
const VOICE_CROP_CATALOG = [
  // Vegetables
  { name: "Organic Tomatoes", localName: "टोमॅटो / टमाटर", category: "Vegetables", defaultPrice: 30, image: "/crops/tomato.png" },
  { name: "Nashik Red Onions", localName: "कांदा / प्याज", category: "Vegetables", defaultPrice: 32, image: "/crops/onion.png" },
  { name: "Fresh Potatoes", localName: "बटाटा / आलू", category: "Vegetables", defaultPrice: 25, image: "/crops/potato.png" },
  { name: "Spicy Green Chili", localName: "हिरवी मिरची / हरी मिर्च", category: "Vegetables", defaultPrice: 65, image: "/crops/green_chili.png" },
  { name: "Farm Garlic", localName: "लसूण / लहसुन", category: "Vegetables", defaultPrice: 140, image: "/crops/garlic.png" },
  { name: "Fresh Ginger", localName: "आले / अदरक", category: "Vegetables", defaultPrice: 90, image: "/crops/ginger.png" },
  { name: "Organic Spinach", localName: "पालक", category: "Vegetables", defaultPrice: 20, image: "/crops/spinach.png" },
  { name: "Fresh Cauliflower", localName: "फ्लॉवर / फूलगोभी", category: "Vegetables", defaultPrice: 35, image: "/crops/cauliflower.png" },
  
  // Fruits
  { name: "Alphonso Mangoes", localName: "हापूस आंबा / आम", category: "Fruits", defaultPrice: 150, image: "/crops/alphonso_mango.png" },
  { name: "Golden Bananas", localName: "केळी / केला", category: "Fruits", defaultPrice: 40, image: "/crops/banana.png" },
  { name: "Red Pomegranate", localName: "डाळिंब / अनार", category: "Fruits", defaultPrice: 120, image: "/crops/pomegranate.png" },
  { name: "Nashik Green Grapes", localName: "द्राक्षे / अंगूर", category: "Fruits", defaultPrice: 80, image: "/crops/grapes.png" },
  { name: "Kashmir Red Apples", localName: "सफरचंद / सेब", category: "Fruits", defaultPrice: 110, image: "/crops/apple.png" },
  { name: "Papaya", localName: "पपई / पपीता", category: "Fruits", defaultPrice: 35, image: "/crops/papaya.png" },

  // Grains
  { name: "Indrayani Rice", localName: "तांदूळ / चावल", category: "Grains", defaultPrice: 60, image: "/crops/rice.png" },
  { name: "Sharbati Wheat", localName: "गहू / गेहूं", category: "Grains", defaultPrice: 45, image: "/crops/wheat.png" },
  { name: "Golden Maize (Corn)", localName: "मका / मक्का", category: "Grains", defaultPrice: 28, image: "/crops/corn.png" },
  { name: "Hybrid Jowar", localName: "ज्वारी / ज्वार", category: "Grains", defaultPrice: 38, image: "/crops/jowar.png" },
  { name: "Organic Bajra", localName: "बाजरी / बाजरा", category: "Grains", defaultPrice: 32, image: "/crops/bajra.png" },

  // Pulses
  { name: "Toor Dal (Arhar)", localName: "तूर डाळ / अरहर", category: "Pulses", defaultPrice: 130, image: "/crops/toor_dal.png" },
  { name: "Moong Dal (Green Gram)", localName: "मूग डाळ / मूंग", category: "Pulses", defaultPrice: 110, image: "/crops/toor_dal.png" },
  { name: "Urad Dal (Black Gram)", localName: "उडीद डाळ / उड़द", category: "Pulses", defaultPrice: 120, image: "/crops/urad_dal.png" },
  { name: "Chana (Chickpea)", localName: "हरभरा / चना", category: "Pulses", defaultPrice: 85, image: "/crops/chana.png" },
  { name: "Masoor Dal (Red Lentil)", localName: "मसूर डाळ", category: "Pulses", defaultPrice: 95, image: "/crops/toor_dal.png" },
  { name: "Rajma (Kidney Beans)", localName: "राजमा", category: "Pulses", defaultPrice: 140, image: "/crops/rajma.png" }
];

export function FarmerDashboard() {
  const { addProduct, user, t } = useAppContext();
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  const [selectedCropFilter, setSelectedCropFilter] = useState("All");

  const [listedItemDetails, setListedItemDetails] = useState<{
    name: string;
    quantity: number;
    price: number;
    category: string;
    image: string;
  } | null>(null);

  // Dynamic voice recognition logic
  const processVoiceInput = (spokenText: string) => {
    setVoiceQuery(spokenText);
    setListedItemDetails(null);
    const lower = spokenText.toLowerCase();

    // 1. Find matching crop in our comprehensive catalog
    let matchedCrop = VOICE_CROP_CATALOG.find(c => 
      lower.includes(c.name.toLowerCase()) || 
      lower.includes(c.category.toLowerCase()) ||
      (c.localName && c.localName.split("/").some(l => lower.includes(l.trim().toLowerCase())))
    );

    // Default fallback to Organic Tomatoes if no specific crop found
    if (!matchedCrop) {
      if (lower.includes("onion") || lower.includes("कांदा") || lower.includes("प्याज")) {
        matchedCrop = VOICE_CROP_CATALOG[1];
      } else if (lower.includes("potato") || lower.includes("बटाटा") || lower.includes("आलू")) {
        matchedCrop = VOICE_CROP_CATALOG[2];
      } else if (lower.includes("mango") || lower.includes("आंबा") || lower.includes("आम")) {
        matchedCrop = VOICE_CROP_CATALOG[8];
      } else if (lower.includes("rice") || lower.includes("तांदूळ") || lower.includes("चावल")) {
        matchedCrop = VOICE_CROP_CATALOG[14];
      } else if (lower.includes("wheat") || lower.includes("गहू") || lower.includes("गेहूं")) {
        matchedCrop = VOICE_CROP_CATALOG[15];
      } else if (lower.includes("toor") || lower.includes("dal") || lower.includes("तूर")) {
        matchedCrop = VOICE_CROP_CATALOG[19];
      } else {
        matchedCrop = VOICE_CROP_CATALOG[0]; // Organic Tomatoes
      }
    }

    // 2. Parse quantity (e.g. 50kg, 100 kg, 20 kg)
    const qtyMatch = spokenText.match(/(\d+)\s*(kg|kilos|किलो|किग्रा)?/i);
    const parsedQty = qtyMatch ? parseInt(qtyMatch[1], 10) : 50;

    // 3. Parse price (e.g. ₹30, 30 per kg, 120 rs)
    const priceMatch = spokenText.match(/₹?\s*(\d+)\s*(per\s*kg|rs|रुपये|रु)?/i);
    const parsedPrice = priceMatch ? parseInt(priceMatch[1], 10) : matchedCrop.defaultPrice;

    // 4. Add product directly to marketplace inventory
    const finalImage = getCropImage(matchedCrop.name, matchedCrop.category, matchedCrop.image);

    addProduct({
      name: matchedCrop.name,
      localName: matchedCrop.localName,
      category: matchedCrop.category,
      price: parsedPrice,
      unit: "kg",
      quantity: parsedQty,
      farm: user?.farmName || `${user?.name || "Farmer"}'s Stewardship Farm`,
      location: user?.location || "Nashik, MH",
      verified: true,
      grade: "Grade A Organic",
      harvestDate: new Date().toISOString().split("T")[0],
      description: `Hands-free voice listed produce (${matchedCrop.localName}) under AgriChain living soil standards.`,
      image: finalImage,
      soilAuditStatus: "Approved"
    });

    setListedItemDetails({
      name: matchedCrop.name,
      quantity: parsedQty,
      price: parsedPrice,
      category: matchedCrop.category,
      image: finalImage
    });

    setAssistantReply(
      `✅ Voice Command Confirmed! Successfully listed ${parsedQty}kg ${matchedCrop.name} (${matchedCrop.localName}) at ₹${parsedPrice}/kg into the AgriChain marketplace.`
    );
  };

  // Handle microphone click / browser Web Speech API integration
  const startMicListing = () => {
    setAssistantReply(null);

    // Check if Web Speech API is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(false);
      setVoiceQuery("Voice recognition not supported in this browser. Please type or click a prompt below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.continuous = false;

      setIsListening(true);
      setVoiceQuery("🎙️ Listening to voice command... Speak crop name, quantity, and price.");

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript && transcript.trim()) {
          processVoiceInput(transcript);
        } else {
          setVoiceQuery("No speech detected. Click mic to try again.");
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceQuery("Microphone error or permission denied. Please click mic and speak clearly.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceQuery("Unable to activate microphone.");
    }
  };

  const samplePrompts = [
    { label: "🍅 Tomatoes", text: "List 50kg tomatoes at ₹30 per kg" },
    { label: "🧅 Onions", text: "List 100kg Nashik onions at ₹32 per kg" },
    { label: "🥭 Mangoes", text: "List 40kg Alphonso mangoes at ₹150 per kg" },
    { label: "🌾 Wheat", text: "List 200kg Sharbati wheat at ₹45 per kg" },
    { label: "🫘 Toor Dal", text: "List 80kg Toor dal at ₹130 per kg" },
    { label: "🥔 Potatoes", text: "List 150kg potatoes at ₹25 per kg" },
    { label: "🍎 Apples", text: "List 60kg Kashmir apples at ₹110 per kg" }
  ];

  const filteredCatalog = selectedCropFilter === "All"
    ? VOICE_CROP_CATALOG
    : VOICE_CROP_CATALOG.filter(c => c.category === selectedCropFilter);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-primary flex items-center gap-2">
            <Sprout className="w-7 h-7 text-primary" /> {t("farmerTitle")}
          </h1>
          <p className="text-xs text-on-surface-variant">
            Voice-guided inventory listing & hands-free marketplace publishing.
          </p>
        </div>
        <Link to="/farmer">
          <Button variant="tertiary" className="!px-3 !py-1.5 text-xs font-bold">
            Hub Inventory
          </Button>
        </Link>
      </div>

      {/* Voice Assistant Interactive Card */}
      <Card className="p-6 bg-gradient-to-br from-primary via-[#1B4332] to-[#2D6A4F] text-on-primary relative overflow-hidden shadow-xl rounded-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 bg-secondary text-on-secondary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Voice Command Enabled (मराठी / Hindi / English)
            </span>
            <h2 className="font-heading text-2xl font-extrabold">{t("speakToList")}</h2>
            <p className="text-xs opacity-90 max-w-md leading-relaxed">
              Tap the mic button and speak any crop name, quantity, and price. The AI assistant will detect your voice and automatically list your harvest into the live marketplace.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={startMicListing}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition shadow-2xl ${
                isListening
                  ? "bg-secondary text-on-secondary animate-bounce ring-8 ring-secondary/40"
                  : "bg-surface text-primary hover:scale-105"
              }`}
            >
              {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            </button>
            <span className="text-[11px] font-extrabold text-primary-container tracking-wide uppercase">
              {isListening ? `🎙️ ${t("listening")}` : t("micButtonLabel")}
            </span>
          </div>
        </div>

        {/* Live Voice Query & Result Confirmation Box */}
        {(voiceQuery || assistantReply) && (
          <div className="mt-6 pt-4 border-t border-white/20 bg-black/30 backdrop-blur-sm rounded-xl p-4 text-xs space-y-3">
            {voiceQuery && (
              <p className="flex items-center gap-2">
                <span className="opacity-70">Voice Detected:</span>
                <strong className="text-secondary font-bold text-sm">"{voiceQuery}"</strong>
              </p>
            )}
            {assistantReply && (
              <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/20 text-white">
                <Volume2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-bold text-xs">{assistantReply}</p>
                  <p className="text-[11px] opacity-80">Living soil quality grade & fair price benchmark verified.</p>
                </div>
              </div>
            )}

            {listedItemDetails && (
              <div className="flex items-center justify-between p-3 bg-surface text-on-surface rounded-xl border border-outline shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={listedItemDetails.image}
                    alt={listedItemDetails.name}
                    className="w-12 h-12 object-cover rounded-lg border border-outline"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-xs text-primary">{listedItemDetails.name}</h4>
                    <p className="text-[11px] text-on-surface-variant">
                      Listed: {listedItemDetails.quantity}kg • ₹{listedItemDetails.price}/kg
                    </p>
                  </div>
                </div>
                <Link to="/">
                  <Button variant="tertiary" className="!px-3 !py-1 text-[11px] font-bold">
                    View in Market →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Try Voice Commands Quick Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
          Try Quick Voice Commands (Click any prompt to test):
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {samplePrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => processVoiceInput(item.text)}
              className="text-xs bg-surface border border-outline px-3.5 py-1.5 rounded-full text-primary hover:bg-primary-container hover:text-on-primary-container transition font-bold shadow-sm flex items-center gap-1.5"
            >
              <span>{item.label}</span>
              <span className="text-on-surface-variant font-normal">("{item.text}")</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Assistant Supported Crop Catalog List */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-outline pb-4 mb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-verified" /> {t("supportedCatalog")}
            </h3>
            <p className="text-xs text-on-surface-variant">
              You can speak any of these crop names (in English, Hindi, or Marathi) to list your yield hands-free.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full">
            {["All", "Vegetables", "Fruits", "Grains", "Pulses"].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCropFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition flex-shrink-0 ${
                  selectedCropFilter === cat
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-variant text-on-surface hover:bg-outline-variant"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredCatalog.map((item, index) => {
            const cropImg = getCropImage(item.name, item.category, item.image);
            return (
              <div
                key={index}
                onClick={() => processVoiceInput(`List 50kg ${item.name} at ₹${item.defaultPrice} per kg`)}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-outline hover:border-primary bg-surface hover:bg-surface-variant/50 transition cursor-pointer group shadow-sm"
              >
                <img
                  src={cropImg}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg border border-outline flex-shrink-0 group-hover:scale-105 transition"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-heading font-bold text-xs text-primary truncate group-hover:text-secondary transition">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {item.localName}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="bg-primary-container text-on-primary-container px-1.5 py-0.5 rounded font-bold">
                      {item.category}
                    </span>
                    <span className="font-extrabold text-primary">
                      ₹{item.defaultPrice}/kg
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* APMC Mandi Regional Benchmark Pricing Grid */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-outline pb-3 mb-4">
          <div>
            <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" /> {t("mandiIndex")}
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Real-time APMC Mandi rates across Maharashtra local trading hubs to help you benchmark fair target prices.
            </p>
          </div>
          <span className="text-xs bg-verified-bg text-verified px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-verified/30 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fair Price Certified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {/* Nashik */}
          <div className="p-3.5 bg-surface-variant/40 rounded-xl border border-outline hover:border-primary transition shadow-sm space-y-1">
            <div className="flex justify-between items-start">
              <strong className="text-sm block text-primary font-bold">Red Onion (कांदा)</strong>
              <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                Nashik APMC
              </span>
            </div>
            <span className="text-on-surface-variant text-[11px] block">Mandi Range: ₹31 - ₹34/kg</span>
            <div className="pt-1.5 flex items-center justify-between border-t border-outline/50">
              <div className="text-verified font-bold text-[11px] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Rec: ₹32/kg
              </div>
              <span className="text-[10px] text-verified font-bold bg-verified-bg px-1.5 py-0.5 rounded">+4.2%</span>
            </div>
          </div>

          {/* Konkan / Ratnagiri */}
          <div className="p-3.5 bg-surface-variant/40 rounded-xl border border-outline hover:border-primary transition shadow-sm space-y-1">
            <div className="flex justify-between items-start">
              <strong className="text-sm block text-primary font-bold">Alphonso Mango (हापूस)</strong>
              <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                Ratnagiri APMC
              </span>
            </div>
            <span className="text-on-surface-variant text-[11px] block">Mandi Range: ₹140 - ₹160/kg</span>
            <div className="pt-1.5 flex items-center justify-between border-t border-outline/50">
              <div className="text-verified font-bold text-[11px] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Rec: ₹150/kg
              </div>
              <span className="text-[10px] text-verified font-bold bg-verified-bg px-1.5 py-0.5 rounded">+6.5%</span>
            </div>
          </div>

          {/* Pune APMC */}
          <div className="p-3.5 bg-surface-variant/40 rounded-xl border border-outline hover:border-primary transition shadow-sm space-y-1">
            <div className="flex justify-between items-start">
              <strong className="text-sm block text-primary font-bold">Organic Tomato (टोमॅटो)</strong>
              <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                Pune APMC
              </span>
            </div>
            <span className="text-on-surface-variant text-[11px] block">Mandi Range: ₹28 - ₹32/kg</span>
            <div className="pt-1.5 flex items-center justify-between border-t border-outline/50">
              <div className="text-verified font-bold text-[11px] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Rec: ₹30/kg
              </div>
              <span className="text-[10px] text-verified font-bold bg-verified-bg px-1.5 py-0.5 rounded">+2.1%</span>
            </div>
          </div>

          {/* Vashi Navi Mumbai */}
          <div className="p-3.5 bg-surface-variant/40 rounded-xl border border-outline hover:border-primary transition shadow-sm space-y-1">
            <div className="flex justify-between items-start">
              <strong className="text-sm block text-primary font-bold">Indrayani Rice (तांदूळ)</strong>
              <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                Vashi (Navi Mumbai)
              </span>
            </div>
            <span className="text-on-surface-variant text-[11px] block">Mandi Range: ₹58 - ₹64/kg</span>
            <div className="pt-1.5 flex items-center justify-between border-t border-outline/50">
              <div className="text-verified font-bold text-[11px] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Rec: ₹60/kg
              </div>
              <span className="text-[10px] text-verified font-bold bg-verified-bg px-1.5 py-0.5 rounded">+1.8%</span>
            </div>
          </div>

          {/* Solapur APMC */}
          <div className="p-3.5 bg-surface-variant/40 rounded-xl border border-outline hover:border-primary transition shadow-sm space-y-1">
            <div className="flex justify-between items-start">
              <strong className="text-sm block text-primary font-bold">Hybrid Jowar (ज्वारी)</strong>
              <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                Solapur APMC
              </span>
            </div>
            <span className="text-on-surface-variant text-[11px] block">Mandi Range: ₹36 - ₹40/kg</span>
            <div className="pt-1.5 flex items-center justify-between border-t border-outline/50">
              <div className="text-verified font-bold text-[11px] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Rec: ₹38/kg
              </div>
              <span className="text-[10px] text-verified font-bold bg-verified-bg px-1.5 py-0.5 rounded">+3.0%</span>
            </div>
          </div>

          {/* Latur APMC */}
          <div className="p-3.5 bg-surface-variant/40 rounded-xl border border-outline hover:border-primary transition shadow-sm space-y-1">
            <div className="flex justify-between items-start">
              <strong className="text-sm block text-primary font-bold">Toor Dal / Arhar (तूर डाळ)</strong>
              <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                Latur APMC
              </span>
            </div>
            <span className="text-on-surface-variant text-[11px] block">Mandi Range: ₹125 - ₹135/kg</span>
            <div className="pt-1.5 flex items-center justify-between border-t border-outline/50">
              <div className="text-verified font-bold text-[11px] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Rec: ₹130/kg
              </div>
              <span className="text-[10px] text-verified font-bold bg-verified-bg px-1.5 py-0.5 rounded">+5.4%</span>
            </div>
          </div>

          {/* Nagpur APMC */}
          <div className="p-3.5 bg-surface-variant/40 rounded-xl border border-outline hover:border-primary transition shadow-sm space-y-1">
            <div className="flex justify-between items-start">
              <strong className="text-sm block text-primary font-bold">Farm Garlic (लसूण)</strong>
              <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                Nagpur APMC
              </span>
            </div>
            <span className="text-on-surface-variant text-[11px] block">Mandi Range: ₹135 - ₹148/kg</span>
            <div className="pt-1.5 flex items-center justify-between border-t border-outline/50">
              <div className="text-verified font-bold text-[11px] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Rec: ₹140/kg
              </div>
              <span className="text-[10px] text-verified font-bold bg-verified-bg px-1.5 py-0.5 rounded">+8.2%</span>
            </div>
          </div>

          {/* Kolhapur APMC */}
          <div className="p-3.5 bg-surface-variant/40 rounded-xl border border-outline hover:border-primary transition shadow-sm space-y-1">
            <div className="flex justify-between items-start">
              <strong className="text-sm block text-primary font-bold">Green Chili (मिरची)</strong>
              <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                Kolhapur APMC
              </span>
            </div>
            <span className="text-on-surface-variant text-[11px] block">Mandi Range: ₹60 - ₹70/kg</span>
            <div className="pt-1.5 flex items-center justify-between border-t border-outline/50">
              <div className="text-verified font-bold text-[11px] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Rec: ₹65/kg
              </div>
              <span className="text-[10px] text-verified font-bold bg-verified-bg px-1.5 py-0.5 rounded">+3.5%</span>
            </div>
          </div>

          {/* Satara APMC */}
          <div className="p-3.5 bg-surface-variant/40 rounded-xl border border-outline hover:border-primary transition shadow-sm space-y-1">
            <div className="flex justify-between items-start">
              <strong className="text-sm block text-primary font-bold">Fresh Potato (बटाटा)</strong>
              <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                Satara APMC
              </span>
            </div>
            <span className="text-on-surface-variant text-[11px] block">Mandi Range: ₹22 - ₹26/kg</span>
            <div className="pt-1.5 flex items-center justify-between border-t border-outline/50">
              <div className="text-verified font-bold text-[11px] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Rec: ₹25/kg
              </div>
              <span className="text-[10px] text-verified font-bold bg-verified-bg px-1.5 py-0.5 rounded">+1.5%</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
