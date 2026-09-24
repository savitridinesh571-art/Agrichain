import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppProvider";
import { 
  parseVoiceInputToCrop, 
  COMPREHENSIVE_CROP_CATALOG, 
  type VoiceCropItem, 
  speakTextOutLoud 
} from "../utils/voiceCropCatalog";
import { LocalMandiPricesCard } from "./LocalMandiPricesCard";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  CheckCircle2, 
  PlusCircle, 
  ShieldCheck, 
  TrendingUp,
  Package,
  Search,
  Globe,
  ArrowRight,
  Zap,
  Tag,
  Star
} from "lucide-react";
import { Button } from "./ui/Button";

interface VoiceListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded?: (productName: string) => void;
}

export function VoiceListingModal({ isOpen, onClose, onProductAdded }: VoiceListingModalProps) {
  const { addProduct, user, products } = useAppContext();

  const [speechLang, setSpeechLang] = useState<"mr" | "hi" | "en">("mr");
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string | null>(null);
  const [customInputText, setCustomInputText] = useState("");
  const [selectedCropFilter, setSelectedCropFilter] = useState("All");

  const [detectedCropData, setDetectedCropData] = useState<{
    matchedCrop: VoiceCropItem;
    quantity: number;
    price: number;
    image: string;
  } | null>(null);

  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Process voice or text input
  const handleProcessInput = (rawText: string) => {
    if (!rawText || !rawText.trim()) return;
    setSpokenTranscript(rawText);
    const parsed = parseVoiceInputToCrop(rawText);
    setDetectedCropData(parsed);
    setPublishSuccess(null);

    // Speak audio feedback out loud if audio is not muted
    if (!isAudioMuted) {
      const feedbackText = speechLang === "mr"
        ? `${parsed.matchedCrop.marathiName} ${parsed.quantity} किलो, ${parsed.price} रुपये प्रति किलो आवाजाने स्वीकारले आहे. #१ क्रमांकावर जोडण्यासाठी तयार.`
        : speechLang === "hi"
        ? `${parsed.matchedCrop.hindiName} ${parsed.quantity} किलो, ${parsed.price} रुपये प्रति किलो आवाज से स्वीकार किया गया. #1 स्थान पर जोड़ने के लिए तैयार.`
        : `Voice Accepted: ${parsed.quantity}kg ${parsed.matchedCrop.name} at ₹${parsed.price}/kg. Ready for #1 listing position.`;

      speakTextOutLoud(feedbackText, speechLang);
    }
  };

  // Start Web Speech Recognition
  const startMicListing = () => {
    setPublishSuccess(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(false);
      setSpokenTranscript(
        speechLang === "mr"
          ? "ब्राउझरमध्ये मायक्रोफोन सपोर्ट उपलब्ध नाही. कृपया खालील पर्याय वापरा किंवा टाईप करा."
          : speechLang === "hi"
          ? "माइक्रोफोन सपोर्ट उपलब्ध नहीं है। कृपया नीचे दिए गए विकल्प चुनें या टाइप करें।"
          : "Voice recognition not supported in this browser. Please type or select a prompt below."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLang === "mr" ? "mr-IN" : speechLang === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.continuous = false;

      setIsListening(true);
      setSpokenTranscript(
        speechLang === "mr"
          ? "🎙️ ऐकत आहे... (तुमचे पीक, वजन व भाव स्पष्ट बोला)"
          : speechLang === "hi"
          ? "🎙️ सुन रहा हूँ... (अपनी फसल, वजन और दाम बोलें)"
          : "🎙️ Listening... Please speak crop details clearly."
      );

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript && transcript.trim()) {
          handleProcessInput(transcript);
        } else {
          setSpokenTranscript(
            speechLang === "mr"
              ? "काहीही ऐकू आले नाही. कृपया मायक्रोफोन बटण दाबून पुन्हा बोला."
              : speechLang === "hi"
              ? "कुछ सुना नहीं गया। कृपया फिर से प्रयास करें।"
              : "No speech detected. Please click mic and try again."
          );
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpokenTranscript(
          speechLang === "mr"
            ? "मायक्रोफोन ऐकू शकला नाही. कृपया मायक्रोफोन बटण दाबून पुन्हा बोला."
            : speechLang === "hi"
            ? "माइक्रोफोन एक्सेस नहीं मिला या आवाज़ नहीं आई। कृपया फिर से बोलें।"
            : "Voice not detected. Please click mic button and speak clearly."
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setSpokenTranscript(
        speechLang === "mr"
          ? "मायक्रोफोन सुरू करता आला नाही."
          : speechLang === "hi"
          ? "माइक्रोफोन चालू नहीं हो सका।"
          : "Unable to activate microphone."
      );
    }
  };

  // Select crop directly from catalog grid
  const handleSelectCrop = (crop: VoiceCropItem) => {
    const text = speechLang === "mr" 
      ? `५० किलो ${crop.marathiName} ${crop.defaultPrice} रुपये`
      : speechLang === "hi"
      ? `50 किलो ${crop.hindiName} ${crop.defaultPrice} रुपये`
      : `50kg ${crop.name} at ₹${crop.defaultPrice} per kg`;

    handleProcessInput(text);
  };

  // Finalize & publish product to marketplace
  const handlePublishHarvest = () => {
    if (!detectedCropData) return;

    const { matchedCrop, quantity, price, image } = detectedCropData;

    addProduct({
      name: matchedCrop.name,
      localName: matchedCrop.localName,
      category: matchedCrop.category,
      price: price,
      unit: "kg",
      quantity: quantity,
      farm: user?.farmName || `${user?.name || "Farmer"}'s Organic Farm`,
      farmerId: user?.id,
      location: user?.location || "Nashik, MH",
      verified: true,
      grade: "Grade A Organic",
      harvestDate: new Date().toISOString().split("T")[0],
      description: `Hands-free voice listed harvest (${matchedCrop.localName}) under AgriChain living soil standards.`,
      image: image,
      soilAuditStatus: "Approved"
    });

    const successMsg = `🎉 Listed in #1 Position: "${matchedCrop.name} (${matchedCrop.localName})" is live on the Marketplace!`;
    setPublishSuccess(successMsg);

    if (!isAudioMuted) {
      const spokenSuccess = speechLang === "mr"
        ? `अभिनंदन! ${matchedCrop.marathiName} पहिल्या नंबरवर जोडले गेले आहे!`
        : speechLang === "hi"
        ? `बधाई हो! ${matchedCrop.hindiName} पहले नंबर पर लिस्ट हो चुका है!`
        : `Success! ${matchedCrop.name} is now published in #1 position!`;
      
      speakTextOutLoud(spokenSuccess, speechLang);
    }

    if (onProductAdded) {
      onProductAdded(matchedCrop.name);
    }

    setDetectedCropData(null);
    setSpokenTranscript(null);
  };

  const sampleVoicePrompts = [
    { label: "🧅 कांदा (Red Onion)", text: "रेड ओन्यिन 25 केजी, ₹60 केजी" },
    { label: "🍅 टोमॅटो (Tomatoes)", text: speechLang === "mr" ? "टोमॅटो ५० किलो ३० रुपये" : "50kg tomatoes at ₹30" },
    { label: "🥭 हापूस आंबा (Mango)", text: speechLang === "mr" ? "हापूस आंबा ४० किलो १५० रुपये" : "40kg Alphonso mangoes at ₹150" },
    { label: "🌾 तांदूळ (Indrayani Rice)", text: speechLang === "mr" ? "तांदूळ ५० किलो ६० रुपये" : "50kg Indrayani rice at ₹60" },
    { label: "🫘 तूर डाळ (Toor Dal)", text: speechLang === "mr" ? "तूर डाळ ८० किलो १३० रुपये" : "80kg Toor dal at ₹130" },
    { label: "🥔 बटाटा (Potatoes)", text: speechLang === "mr" ? "बटाटा १५० किलो २५ रुपये" : "150kg potatoes at ₹25" },
    { label: "🍎 सफरचंद (Apples)", text: speechLang === "mr" ? "सफरचंद ६० किलो ११० रुपये" : "60kg Kashmir apples at ₹110" }
  ];

  const filteredCatalog = selectedCropFilter === "All"
    ? COMPREHENSIVE_CROP_CATALOG
    : COMPREHENSIVE_CROP_CATALOG.filter(c => c.category === selectedCropFilter);

  // Farmer's recent voice listings (newest first)
  const recentListings = products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#D5E5D8] my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#1B4332] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 text-[#1B4332] rounded-2xl flex items-center justify-center font-black shadow-md">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg sm:text-xl text-white leading-tight">
                Voice Harvest Listing (बोलून पीक जोडा)
              </h2>
              <p className="text-xs text-emerald-200 font-medium">
                Detect, accept & list products directly at #1 Position
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Readout Mute/Unmute Toggle */}
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className={`p-2 rounded-xl border transition ${
                isAudioMuted
                  ? "bg-red-500/20 text-red-200 border-red-400/40"
                  : "bg-emerald-700/50 text-amber-300 border-emerald-500/50 hover:bg-emerald-600/50"
              }`}
              title={isAudioMuted ? "Enable Voice Feedback" : "Mute Voice Feedback"}
            >
              {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">

          {/* Success Toast */}
          {publishSuccess && (
            <div className="p-4 bg-emerald-700 text-white rounded-2xl flex items-center gap-3 shadow-lg animate-bounce">
              <CheckCircle2 className="w-6 h-6 text-amber-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-bold">{publishSuccess}</span>
            </div>
          )}

          {/* Hero Microphone Card */}
          <div className="bg-gradient-to-br from-[#0B2519] via-[#1B4332] to-[#122e22] text-white rounded-2xl p-5 shadow-xl border border-emerald-900 relative overflow-hidden flex flex-col items-center text-center space-y-3">
            
            {/* Top Bar: Speech AI Badge & Language Selectors */}
            <div className="flex flex-wrap items-center justify-between w-full gap-2">
              <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1.5 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" /> Marathi / Hindi / English Speech AI
              </span>

              {/* Language Switcher Pills */}
              <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/20">
                <button
                  onClick={() => setSpeechLang("mr")}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-black transition ${
                    speechLang === "mr"
                      ? "bg-amber-400 text-[#1B4332] shadow-sm"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => setSpeechLang("hi")}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-black transition ${
                    speechLang === "hi"
                      ? "bg-amber-400 text-[#1B4332] shadow-sm"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setSpeechLang("en")}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-black transition ${
                    speechLang === "en"
                      ? "bg-amber-400 text-[#1B4332] shadow-sm"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Pulsing Central Microphone Button */}
            <div className="relative pt-2 pb-1">
              <button
                onClick={startMicListing}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl relative z-10 ${
                  isListening
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#1B4332] scale-110 ring-8 ring-amber-400/40 animate-bounce"
                    : "bg-white text-[#1B4332] hover:scale-105 hover:bg-amber-50 active:scale-95"
                }`}
              >
                {isListening ? <MicOff className="w-10 h-10 text-[#1B4332]" /> : <Mic className="w-10 h-10 text-[#1B4332]" />}
              </button>

              {/* Real-time wave animation pulse */}
              {isListening && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 rounded-full bg-amber-400/20 animate-ping"></div>
                </div>
              )}
            </div>

            {/* Listening Wave Visualizer */}
            {isListening ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 h-6">
                  <span className="w-1.5 bg-amber-400 rounded-full h-6 animate-pulse"></span>
                  <span className="w-1.5 bg-amber-300 rounded-full h-4 animate-pulse delay-75"></span>
                  <span className="w-1.5 bg-amber-400 rounded-full h-7 animate-pulse delay-100"></span>
                  <span className="w-1.5 bg-amber-200 rounded-full h-5 animate-pulse delay-150"></span>
                  <span className="w-1.5 bg-amber-400 rounded-full h-4 animate-pulse"></span>
                </div>
                <span className="text-xs font-black text-amber-300 block uppercase tracking-wider">
                  🎙️ AI ऐकत आहे... (Speak any product name like "रेड ओन्यिन", "टोमॅटो", "तांदूळ")
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xs font-black text-amber-300 block uppercase tracking-wider">
                  CLICK MIC & SPEAK CROP DETAILS
                </span>
                <p className="text-[11px] text-emerald-100 mt-0.5 font-medium">
                  {speechLang === "mr"
                    ? 'उदाहरण: "रेड ओन्यिन २५ केजी, ६० केजी" किंवा "५० किलो टोमॅटो ३० रुपये"'
                    : speechLang === "hi"
                    ? 'उदाहरण: "रेड अनियन 25 केजी, 60 रुपये" या "50 किलो टमाटर"'
                    : 'Example: "Red Onion 25kg, ₹60/kg" or "50kg Tomatoes at ₹30"'}
                </p>
              </div>
            )}

            {/* Live Spoken Voice Transcript Display */}
            {spokenTranscript && (
              <div className="w-full bg-black/40 border border-amber-400/50 rounded-xl p-2.5 flex items-center justify-center gap-2 animate-in fade-in">
                <span className="text-amber-300 text-xs font-black">🗣️ Spoken Voice:</span>
                <span className="text-white text-xs font-bold italic">"{spokenTranscript}"</span>
              </div>
            )}

            {/* Custom Input Text Fallback */}
            <div className="w-full pt-1">
              <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20 shadow-inner">
                <input
                  type="text"
                  placeholder={
                    speechLang === "mr"
                      ? "किंवा येथे नाव व भाव टाईप करा (उदा. रेड ओन्यिन 25 केजी 60 रुपये)"
                      : "Or type product name (e.g. Red Onion 25kg @ 60)"
                  }
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customInputText.trim()) {
                      handleProcessInput(customInputText);
                      setCustomInputText("");
                    }
                  }}
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-white placeholder-emerald-200/60 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (customInputText.trim()) {
                      handleProcessInput(customInputText);
                      setCustomInputText("");
                    }
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-[#1B4332] px-3.5 py-1.5 rounded-lg text-xs font-extrabold shrink-0 shadow"
                >
                  Detect AI
                </button>
              </div>
            </div>
          </div>

          {/* Quick Test Voice Command Chips */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-gray-600 block uppercase tracking-wide">
              Quick Voice Test Prompts (1-Tap Test):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleVoicePrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleProcessInput(item.text)}
                  className="text-xs bg-[#EBF4EE] hover:bg-[#1B4332] hover:text-white border border-[#CDE3D2] px-3 py-1 rounded-full text-[#1B4332] transition font-bold flex items-center gap-1"
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DETECTED & ACCEPTED CROP PREVIEW CARD */}
          {detectedCropData && (
            <div className="bg-[#EBF4EE] border-2 border-emerald-600 rounded-2xl p-4 space-y-4 shadow-md animate-in zoom-in-95 duration-200 relative">
              
              <div className="flex items-center justify-between border-b border-[#CDE3D2] pb-2">
                <span className="text-xs font-black text-[#1B4332] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Voice Accepted & Verified
                </span>
                <span className="bg-amber-400 text-[#1B4332] text-[11px] font-black px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#1B4332]" /> #1 Position in List
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={detectedCropData.image}
                    alt={detectedCropData.matchedCrop.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-[#1B4332] leading-tight">
                      {detectedCropData.matchedCrop.name}
                    </h3>
                    <p className="text-xs text-emerald-800 font-bold">
                      {detectedCropData.matchedCrop.localName} • <span className="text-gray-500 font-medium">{detectedCropData.matchedCrop.category}</span>
                    </p>
                    <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
                      Stock: {detectedCropData.quantity} kg
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm">
                    <span className="text-[10px] text-gray-500 font-bold block uppercase">Rate per kg</span>
                    <span className="font-heading font-black text-xl text-[#1B4332]">
                      ₹{detectedCropData.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Earnings & Publish Action */}
              <div className="pt-3 border-t border-[#CDE3D2] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-gray-500 font-bold block">Estimated Total Earnings:</span>
                  <span className="text-base font-black text-[#1B4332]">
                    ₹{(detectedCropData.price * detectedCropData.quantity).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setDetectedCropData(null);
                      setSpokenTranscript(null);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handlePublishHarvest}
                    className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#122e22] hover:to-[#1B4332] text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-300" />
                    <span>Publish to Marketplace at #1 Position</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live APMC 5 Local Mandi Prices Card */}
          <LocalMandiPricesCard
            selectedCropId={detectedCropData?.matchedCrop?.id || "onion"}
            onSelectMandiPrice={(selectedRate) => {
              if (detectedCropData) {
                setDetectedCropData({
                  ...detectedCropData,
                  price: selectedRate
                });
              }
            }}
          />

          {/* Recently Voice-Listed Products List */}
          {recentListings.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#1B4332] uppercase tracking-wide flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-emerald-700" /> Live Farmer Harvest Listings ({recentListings.length})
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Newest First (#1 at Top)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recentListings.map((prod, index) => (
                  <div key={prod.id} className={`flex items-center justify-between p-2 rounded-xl border ${
                    index === 0 ? "bg-amber-50 border-amber-300 ring-2 ring-amber-300/50" : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img src={prod.image} alt={prod.name} className="w-9 h-9 rounded-lg object-cover" />
                        <span className={`absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white ${
                          index === 0 ? "bg-amber-500" : "bg-gray-600"
                        }`}>
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1B4332] truncate">{prod.name}</h4>
                        <span className="text-[10px] text-gray-500 font-medium">{prod.quantity} {prod.unit} available</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                      ₹{prod.price}/{prod.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Select Any Product from Catalog Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-sm text-[#1B4332]">
                Or Select Any Product Below to List (30+ Crops)
              </h3>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {["All", "Vegetables", "Fruits", "Grains", "Pulses"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCropFilter(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                      selectedCropFilter === cat
                        ? "bg-[#1B4332] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-44 overflow-y-auto pr-1">
              {filteredCatalog.map(crop => (
                <div
                  key={crop.id}
                  onClick={() => handleSelectCrop(crop)}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-gray-200 hover:border-[#1B4332] bg-gray-50 hover:bg-[#EBF4EE] transition cursor-pointer group"
                >
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-extrabold text-xs text-[#1B4332] truncate">
                      {crop.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 truncate font-medium">
                      {crop.localName}
                    </p>
                    <p className="text-[10px] font-black text-emerald-800 mt-0.5">
                      ₹{crop.defaultPrice}/kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
