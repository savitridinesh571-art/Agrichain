import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Volume2, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Truck, 
  Package, 
  ChevronRight, 
  Sparkles,
  Flame,
  PlusCircle,
  FileText,
  MapPin,
  Building2,
  BadgeCheck
} from "lucide-react";
import { getCropImage } from "../../utils/cropImages";
import { VoiceListingModal } from "../../components/VoiceListingModal";
import { LocalMandiPricesCard } from "../../components/LocalMandiPricesCard";

export function PriceCheck() {
  const { user, products, addProduct } = useAppContext();

  const [selectedLang, setSelectedLang] = useState<"mr" | "hi" | "en">("mr");
  const [isListening, setIsListening] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voicePrompt, setVoicePrompt] = useState('🗣️ "आज टोमॅटोचा भाव काय आहे?"');
  const [aiResponse, setAiResponse] = useState({
    mandi: "नाशिक एपीएमसीमध्ये टोमॅटो भाव ₹२८ ते ₹३२ प्रति किलो आहे.",
    recommended: "तुमची विक्री किंमत ₹३० योग्य आहे."
  });

  const [urgentPacked, setUrgentPacked] = useState(false);

  // Simulated voice trigger
  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setVoicePrompt('🗣️ "आज कांद्याचा भाव काय आहे?"');
      setAiResponse({
        mandi: "नाशिक मंडीमध्ये लाल कांदा भाव ₹२२ ते ₹२६ प्रति किलो आहे.",
        recommended: "तुमची विक्री किंमत ₹२४ उत्तम नफा देईल."
      });
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F4F8F4] text-[#1B4332] pb-12 font-sans">
      <div className="max-w-md md:max-w-xl mx-auto space-y-4 px-3 sm:px-4 pt-3">

        {/* 1. Header / Top Navigation Bar */}
        <header className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#D5E5D8] shadow-sm">
          <Link to="/farmer" className="p-2 hover:bg-[#EBF4EE] rounded-xl transition text-[#1B4332]">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1B4332] text-amber-300 rounded-full flex items-center justify-center font-black text-xs">
              🌾
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-sm text-[#1B4332] leading-tight">AGRICHAIN</h1>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wide">Farm-to-Home Direct</p>
            </div>
            <span className="text-gray-300 mx-1">|</span>
            <span className="font-heading font-bold text-sm text-[#1B4332]">Price Check</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-400 overflow-hidden flex items-center justify-center text-base">
              🧑‍🌾
            </div>
          </div>
        </header>

        {/* 2. Sub-Header: APMC Live Sync, Greeting & Language Selector */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              APMC LIVE SYNC
            </span>
            <h2 className="font-heading font-black text-lg text-[#1B4332] mt-0.5 flex items-center gap-1.5">
              नमस्कार, {user?.name || "रमेशजी"} ✍️
            </h2>
          </div>

          {/* Language Selector Pills */}
          <div className="flex items-center bg-[#EBF4EE] p-1 rounded-xl border border-[#CDE3D2]">
            <button
              onClick={() => setSelectedLang("mr")}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                selectedLang === "mr"
                  ? "bg-[#1B4332] text-white shadow-sm"
                  : "text-[#1B4332] hover:bg-white/50"
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => setSelectedLang("hi")}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                selectedLang === "hi"
                  ? "bg-[#1B4332] text-white shadow-sm"
                  : "text-[#1B4332] hover:bg-white/50"
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setSelectedLang("en")}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                selectedLang === "en"
                  ? "bg-[#1B4332] text-white shadow-sm"
                  : "text-[#1B4332] hover:bg-white/50"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* 3. Hero Voice AI Price Checker Card */}
        <div className="bg-gradient-to-b from-[#0B2519] via-[#113826] to-[#1B4332] text-white rounded-3xl p-5 shadow-xl border border-emerald-900 relative overflow-hidden space-y-4">
          
          {/* Top Pill Badges */}
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-emerald-200 border border-white/10 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-300" /> કૃષિ મિત્ર અવાજ સહાયક (Voice AI)
            </span>
            <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[10px]">
              ⚡ जलद शोध
            </span>
          </div>

          {/* Voice Prompt & Waveform */}
          <div className="text-center space-y-2 pt-1">
            <p className="text-xs font-extrabold text-emerald-100">{voicePrompt}</p>
            
            {/* Waveform graphic */}
            <div className="flex items-center justify-center gap-1 h-6">
              <span className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${isListening ? "h-6 animate-pulse" : "h-3"}`}></span>
              <span className={`w-1 bg-amber-300 rounded-full transition-all duration-300 ${isListening ? "h-4 animate-pulse delay-75" : "h-5"}`}></span>
              <span className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${isListening ? "h-6 animate-pulse delay-100" : "h-2"}`}></span>
              <span className={`w-1 bg-amber-200 rounded-full transition-all duration-300 ${isListening ? "h-5 animate-pulse delay-150" : "h-4"}`}></span>
              <span className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${isListening ? "h-3 animate-pulse" : "h-2"}`}></span>
            </div>
          </div>

          {/* AI Response Card Container */}
          <div className="bg-white text-[#1B4332] p-4 rounded-2xl shadow-lg border border-emerald-100 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-black text-emerald-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AgriChain AI भाव सूचक:</span>
            </div>
            <p className="text-gray-700 leading-relaxed font-medium">
              {aiResponse.mandi} <span className="font-bold text-[#1B4332]">{aiResponse.recommended}</span>
            </p>
          </div>

          {/* Big Orange Pulse Microphone Button */}
          <div className="flex flex-col items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className={`w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-2xl transition hover:scale-105 active:scale-95 ${
                isListening ? "ring-8 ring-orange-400/40 animate-bounce" : ""
              }`}
            >
              <Mic className="w-8 h-8 text-white" />
            </button>
            
            <div className="text-center">
              <span className="font-extrabold text-xs text-amber-300 block">🎤 Speak Now / बोला / बोलिए</span>
              <span className="text-[10px] text-emerald-200 opacity-80">टॅप करा व कोणत्याही भाषेत विचारा</span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <Link
              to="/farmer/add"
              className="bg-white/15 hover:bg-white/25 text-white py-2 px-3 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>नवीन पीक जोडा (Add)</span>
            </Link>
            <Link
              to="/farmer"
              className="bg-white/15 hover:bg-white/25 text-white py-2 px-3 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>माझी कमाई (Check)</span>
            </Link>
          </div>
        </div>

        {/* 4. 5 Major Local Mandi APMC Market Prices Section */}
        <LocalMandiPricesCard />


        {/* 4. Monthly Direct Earnings Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#D5E5D8] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#1B4332]" /> या महिन्याची थेट कमाई (Direct Earnings)
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 text-emerald-600" /> UPI Verified
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="font-heading font-black text-3xl text-[#1B4332]">₹48,650</span>
              <span className="text-xs text-gray-500 font-bold ml-1.5">/ 1,840 kg विक्री</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>

          <p className="text-[10px] text-gray-500 pt-1 border-t border-gray-100 font-semibold">
            Bank of Maharashtra A/C •• 9014 खात्यात जमा
          </p>
        </div>

        {/* 5. 2-Column Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Active Orders Today */}
          <div className="bg-white p-4 rounded-2xl border border-[#D5E5D8] shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-bold">आजच्या ऑर्डर्स</span>
              <div className="w-8 h-8 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-heading font-black text-2xl text-[#1B4332]">8 सक्रिय</span>
              <div className="text-[10px] text-gray-500 font-semibold space-y-0.5 mt-1">
                <p>पिक-अपसाठी तयार: <strong className="text-gray-800 font-bold">4</strong></p>
                <p>मार्गावर (Out for Delivery): <strong className="text-emerald-700 font-bold">2</strong></p>
              </div>
            </div>
          </div>

          {/* Farm Stock */}
          <div className="bg-white p-4 rounded-2xl border border-[#D5E5D8] shadow-sm flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 font-bold">शेतमाल साठा</span>
              <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-heading font-black text-2xl text-[#1B4332]">650 kg</span>
              <div className="mt-1">
                <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-md inline-block">
                  📋 नागपूर संत्री (Audit): 1 भाग मंजुरी
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Urgent Action Delivery Card */}
        <div className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              तात्काळ डिलिव्हरी (Urgent Action)
            </span>
            <span className="bg-gray-100 text-gray-600 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
              #AGC-2026-001245
            </span>
          </div>

          {/* Customer Details */}
          <div className="flex items-center justify-between bg-[#F8FAF8] p-2.5 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#1B4332] text-white rounded-xl flex items-center justify-center font-black text-sm">
                P
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#1B4332]">Priya Sharma (प्रिया शर्मा)</h4>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> कोथरूड, पुणे • Kothrud, Pune
                </p>
              </div>
            </div>
            <span className="bg-gray-200 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-lg">
              Agri Van 11:30 AM
            </span>
          </div>

          {/* Produce List Items */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 bg-[#EBF4EE] rounded-xl border border-[#D5E5D8]">
              <img
                src={getCropImage("Organic Tomatoes", "Vegetables", "/crops/tomato.png")}
                alt="Tomato"
                className="w-10 h-10 object-cover rounded-lg border border-white"
              />
              <div>
                <p className="font-extrabold text-[11px] text-[#1B4332]">टोमॅटो (Tomato)</p>
                <p className="text-[10px] text-gray-600 font-bold">5 kg @ ₹30</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-[#EBF4EE] rounded-xl border border-[#D5E5D8]">
              <img
                src={getCropImage("Nashik Red Onions", "Vegetables", "/crops/onion.png")}
                alt="Onion"
                className="w-10 h-10 object-cover rounded-lg border border-white"
              />
              <div>
                <p className="font-extrabold text-[11px] text-[#1B4332]">कांदा (Nashik Onion)</p>
                <p className="text-[10px] text-gray-600 font-bold">2 kg @ ₹24</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setUrgentPacked(!urgentPacked)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm ${
              urgentPacked
                ? "bg-emerald-600 text-white"
                : "bg-[#1B4332] hover:bg-[#122e22] text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>{urgentPacked ? "✓ व्हॅनसाठी तयार आहे (Packed & Confirmed)" : "व्हॅनसाठी पॅक तयार आहे (Ready for AgriChain Van)"}</span>
          </button>
        </div>

        {/* 7. Live Stock & Prices List */}
        <div className="bg-white rounded-2xl p-4 border border-[#D5E5D8] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-sm text-[#1B4332]">
              शेतमाल साठा व दर (Live Stock & Prices)
            </h3>
            <Link to="/farmer" className="text-xs text-emerald-800 font-bold flex items-center hover:underline">
              सर्व पहा <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {/* Item 1 */}
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAF8] rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={getCropImage("Organic Tomatoes", "Vegetables", "/crops/tomato.png")}
                  alt="Tomato"
                  className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs text-[#1B4332]">टोमॅटो (Tomato)</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">A-Grade</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                    साठा: 280 kg शिल्लक • <span className="text-emerald-700 font-bold">✓ प्रमाणित (Approved)</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-heading font-black text-base text-[#1B4332]">₹30</span>
                <span className="text-[10px] text-gray-500 font-bold">/kg</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAF8] rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={getCropImage("Nagpur Oranges", "Fruits", "/crops/pomegranate.png")}
                  alt="Orange"
                  className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs text-[#1B4332]">नागपूर संत्री</h4>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded">Pending</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                    साठा: 220 kg शिल्लक • <span className="text-amber-700 font-bold">⏱️ तपासणी बाकी (Review)</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-heading font-black text-base text-[#1B4332]">₹55</span>
                <span className="text-[10px] text-gray-500 font-bold">/kg</span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAF8] rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={getCropImage("Nashik Red Onions", "Vegetables", "/crops/onion.png")}
                  alt="Onion"
                  className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs text-[#1B4332]">लाल कांदा (Red Onion)</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">A-Grade</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                    साठा: 150 kg शिल्लक • <span className="text-emerald-700 font-bold">✓ प्रमाणित (Approved)</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-heading font-black text-base text-[#1B4332]">₹24</span>
                <span className="text-[10px] text-gray-500 font-bold">/kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Weekly Demand & Sales Trend Bar Chart */}
        <div className="bg-white rounded-2xl p-4 border border-[#D5E5D8] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-sm text-[#1B4332] flex items-center gap-1.5">
                मागणी आणि विक्री कल (Weekly Demand)
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">शेत-ते-ग्राहक थेट खरेदी कल</p>
            </div>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-600 fill-orange-500" /> उच्च मागणी
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 pb-2 px-2 flex items-end justify-between h-32 border-b border-gray-100">
            {/* Mon */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-5 bg-emerald-300 rounded-t-md h-14"></div>
              <span className="text-[9px] text-gray-500 font-bold">सोम</span>
            </div>
            {/* Tue */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-5 bg-emerald-400 rounded-t-md h-16"></div>
              <span className="text-[9px] text-gray-500 font-bold">मंगळ</span>
            </div>
            {/* Wed */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-5 bg-[#1B4332] rounded-t-md h-22"></div>
              <span className="text-[9px] text-gray-500 font-bold">बुध</span>
            </div>
            {/* Thu */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-5 bg-emerald-400 rounded-t-md h-18"></div>
              <span className="text-[9px] text-gray-500 font-bold">गुरु</span>
            </div>
            {/* Fri */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-5 bg-[#1B4332] rounded-t-md h-24"></div>
              <span className="text-[9px] text-gray-500 font-bold">शुक्र</span>
            </div>
            {/* Sat (Peak) */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-5 bg-amber-500 rounded-t-md h-28"></div>
              <span className="text-[9px] font-black text-amber-900">शनि</span>
            </div>
            {/* Sun (Peak) */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-5 bg-amber-700 rounded-t-md h-30"></div>
              <span className="text-[9px] font-black text-amber-900">रवि</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-600 font-bold pt-1">
            <span>सरासरी दर: ₹29.40/kg</span>
            <span className="text-amber-800 font-extrabold">शनि-रवि आठवडी बाजारात 35% वाढ</span>
          </div>
        </div>

      </div>

      {/* Voice Listing Modal */}
      <VoiceListingModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}
