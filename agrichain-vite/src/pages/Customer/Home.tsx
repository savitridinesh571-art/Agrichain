import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  Eye, 
  MapPin, 
  Sprout, 
  ShieldCheck, 
  TrendingUp, 
  Mic, 
  Truck, 
  Users, 
  Award, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  HelpCircle,
  Wheat,
  Star,
  Clock,
  Tag
} from "lucide-react";
import { getCropImage } from "../../utils/cropImages";
import { FarmerHub } from "../Farmer/Hub";
import { LocationPicker } from "../../components/LocationPicker";
import { NearbyFarmers } from "../../components/NearbyFarmers";

export function Home() {
  const { products, searchQuery, selectedCategory, setSelectedCategory, addToCart, user, t } = useAppContext();
  const navigate = useNavigate();

  // If user is a logged-in Farmer, render the Farmer Home Page directly
  if (user?.role === "FARMER") {
    return <FarmerHub />;
  }

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categoryOptions = [
    { id: "All", label: t("all") },
    { id: "Vegetables", label: t("vegetables") },
    { id: "Fruits", label: t("fruits") },
    { id: "Grains", label: t("grains") },
    { id: "Pulses", label: t("pulses") }
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.localName && p.localName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setToastMessage(`Added "${product.name}" to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const faqs = [
    {
      q: "How does AgriChain guarantee fair pricing for farmers & consumers?",
      a: "AgriChain connects to live APMC Mandi benchmark indexes across Maharashtra. Our AI pricing model eliminates middleman margins, giving farmers +20% higher earnings while providing consumers with wholesale organic prices."
    },
    {
      q: "What is 'Living Soil Certification'?",
      a: "Living Soil Certified produce comes from farms that practice zero-chemical regeneration, natural composting, and sustainable soil rotation. Every listed batch undergoes physical and soil verification before approval."
    },
    {
      q: "How do farmers with limited digital literacy list their produce?",
      a: "Farmers can simply use our Voice Assistant in Hindi or Marathi. By pressing the mic button and saying e.g. '50kg Organic Tomatoes in Nashik at ₹40', our NLP AI automatically fills out the listing form."
    },
    {
      q: "How fast is doorstep delivery?",
      a: "Orders placed before 2 PM are harvested fresh from local farms in Nashik, Pune, and Satara and delivered directly to your urban doorstep within 24 hours in climate-controlled logistics."
    }
  ];

  const farmerStories = [
    {
      name: "Ramesh Patil",
      location: "Nashik, Maharashtra",
      crop: "Organic Tomatoes & Grapes",
      incomeGain: "+32% Earnings",
      quote: "Before AgriChain, APMC middlemen took over 40% of my earnings. Now, urban customers buy directly from my farm at fair rates.",
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Sunita Deshmukh",
      location: "Satara, Maharashtra",
      crop: "Desi Pulses & Organic Turmeric",
      incomeGain: "+28% Earnings",
      quote: "The voice listing in Marathi makes selling effortless. I just speak into my phone after harvest, and orders start coming in!",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Anand Pawar",
      location: "Pune District",
      crop: "Fresh Wheat & Basmati Grain",
      incomeGain: "+35% Earnings",
      quote: "Direct logistics tracking keeps my customers informed about harvest & dispatch times. Transparency builds long-term trust.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="flex flex-col gap-10">

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B4332] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <Link to="/cart" className="underline text-amber-300 text-xs font-extrabold ml-2">
            View Cart
          </Link>
        </div>
      )}

      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-white rounded-3xl p-6 md:p-12 overflow-hidden shadow-xl border border-emerald-800">
        {/* Background Decorative Pattern */}
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-extrabold text-xs px-3 py-1 rounded-full backdrop-blur-md">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              {t("livingSoilCertified")}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-200 border border-amber-400/30 font-extrabold text-xs px-3 py-1 rounded-full backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              0% Middleman Margin
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
            Direct Farm-to-Home Harvest. <br />
            <span className="text-amber-300">100% Organic & Fair Priced.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-emerald-100 text-sm md:text-base max-w-2xl mb-8 leading-relaxed font-medium">
            Connecting rural Maharashtra growers directly with urban households. Guaranteed APMC Mandi fair pricing benchmarks, zero middlemen overhead, and express 24-hour field delivery.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <a 
              href="#produce-catalog" 
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-[#1B4332] font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Fresh Produce</span>
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-10 pt-8 border-t border-emerald-600/40 text-left">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xl md:text-2xl">
                <Users className="w-5 h-5 text-emerald-300 shrink-0" /> 1,200+
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-1">Active Customers</p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xl md:text-2xl">
                <Tag className="w-5 h-5 text-emerald-300 shrink-0" /> Cheap &amp; Fair
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-1">Affordable Direct Price</p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xl md:text-2xl">
                <Clock className="w-5 h-5 text-emerald-300 shrink-0" /> 6 AM - 12 PM
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-1">Slots Available</p>
            </div>
          </div>

        </div>
      </section>

      {/* Customer Location Detection Component */}
      <section id="location-section">
        <LocationPicker />
      </section>

      {/* Nearby Farmers Proximity & Map Discovery Component */}
      <section id="nearby-farmers-section">
        <NearbyFarmers />
      </section>

      {/* Role Selection / Quick Action Cards */}
      <section>
        {/* Buyer Persona Card */}
        <div className="bg-white border border-[#D5E5D8] rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-bl-full -z-0 transition group-hover:scale-110" />
          
          <div className="relative z-10 max-w-xl">
            <div className="w-12 h-12 bg-[#EBF4EE] rounded-2xl flex items-center justify-center text-[#1B4332] mb-4">
              <ShoppingBag className="w-6 h-6 text-[#1B4332]" />
            </div>
            <span className="text-[11px] font-extrabold text-[#1B4332] uppercase tracking-wider">For Urban Buyers</span>
            <h3 className="font-heading text-xl font-black text-[#1B4332] mt-1 mb-2">
              Buy Farm-Fresh Organic Produce
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Directly purchase seasonal vegetables, fruits, and grains from Maharashtra farmers with full provenance tracking and fair price guarantees.
            </p>
          </div>

          <a 
            href="#produce-catalog" 
            className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#EBF4EE] hover:bg-[#1B4332] text-[#1B4332] hover:text-white font-bold text-xs px-6 py-3.5 rounded-xl transition shrink-0"
          >
            <span>Browse Fresh Crops</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Fair Price Verification Alert Banner */}
      <div className="bg-[#EBF4EE] border border-[#CDE3D2] rounded-2xl p-4 flex gap-3 text-[#1B4332] items-center shadow-sm">
        <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-700" />
        <div className="flex-1">
          <p className="font-heading font-bold text-sm text-[#1B4332]">{t("fairPrice")}</p>
          <p className="text-xs text-gray-700 leading-relaxed mt-0.5">
            All listed crops directly connect rural growers with urban buyers under AgriChain fair pricing standards indexed to live APMC Mandi rates.
          </p>
        </div>
      </div>

      {/* Platform Core Pillars / Why AgriChain */}
      <section className="bg-white border border-[#D5E5D8] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-block bg-[#EBF4EE] text-[#1B4332] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Ecosystem Features
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-black text-[#1B4332]">
            Why Buy & Sell on AgriChain?
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Built to empower rural agriculture while providing urban homes with unadulterated freshness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2F2E5]">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-[#1B4332] mb-3">
              <Sprout className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#1B4332] mb-1">Living Soil Audit</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Strict chemical-free audit guaranteeing living microbial soil health for every crop.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2F2E5]">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-[#1B4332] mb-3">
              <TrendingUp className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#1B4332] mb-1">Fair APMC Pricing</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Algorithmic benchmark rates ensuring farmers earn 20-30% more than middleman offers.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2F2E5]">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-[#1B4332] mb-3">
              <Mic className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#1B4332] mb-1">Vernacular Voice AI</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Hindi & Marathi speech recognition letting any farmer list harvest in seconds.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2F2E5]">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-[#1B4332] mb-3">
              <Truck className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-heading font-bold text-sm text-[#1B4332] mb-1">Express Delivery</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Direct field harvest logistics delivering fresh produce to urban doorsteps within 24h.
            </p>
          </div>
        </div>
      </section>

      {/* Main Produce Marketplace Grid */}
      <section id="produce-catalog" className="scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">Marketplace Showcase</span>
            <h2 className="font-heading text-2xl md:text-3xl font-black text-[#1B4332]">
              Available Fresh Harvest ({filteredProducts.length})
            </h2>
          </div>

          {/* Category Pills Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryOptions.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-[#1B4332] text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-[#EBF4EE] border border-[#D5E5D8]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center bg-white border border-[#D5E5D8]">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
            <h4 className="font-heading font-bold text-lg mb-1 text-[#1B4332]">No produce matching filter</h4>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Try clearing your search query or selecting a different crop category above.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(p => {
              const imgSrc = getCropImage(p.name, p.category, p.image);
              return (
                <Card key={p.id} className="flex flex-col h-full hover:shadow-xl transition duration-300 overflow-hidden border border-[#D5E5D8] rounded-3xl bg-white group">
                  
                  {/* Name-wise Crop Image Display */}
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={p.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-xl">
                        {p.category}
                      </span>
                      {p.verified ? (
                        <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="bg-amber-600 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                          AUDIT PENDING
                        </span>
                      )}
                    </div>

                    {/* Bottom Image Overlay Text */}
                    <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                      <h4 className="font-heading text-xl font-extrabold leading-tight drop-shadow-md">
                        {p.name} {p.localName && <span className="text-sm font-normal opacity-90">({p.localName})</span>}
                      </h4>
                      <p className="text-xs flex items-center gap-1 mt-0.5 opacity-90 font-medium drop-shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-amber-300" /> {p.location}
                      </p>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2 text-xs text-gray-600">
                      <p className="line-clamp-2 leading-relaxed">{p.description}</p>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-gray-400 block font-medium">Producer Farm:</span>
                          <strong className="text-gray-800 font-bold">{p.farm}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium">Quality Grade:</span>
                          <strong className="text-gray-800 font-bold">{p.grade}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Action */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-heading text-2xl font-black text-[#1B4332]">₹{p.price}</span>
                        <span className="text-xs text-gray-500"> / {p.unit}</span>
                        <span className="block text-[11px] text-emerald-700 font-bold">Stock: {p.quantity} {p.unit}</span>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/product/${p.id}`}>
                          <Button variant="tertiary" className="!px-3 !py-2 !min-h-[38px] text-xs flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Details
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleAddToCart(p)}
                          className="!px-3.5 !py-2 !min-h-[38px] text-xs flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#122e22] text-white"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> {t("addToCart")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* How AgriChain Works Section */}
      <section className="bg-gradient-to-br from-[#EBF4EE] to-[#F4F8F4] border border-[#CDE3D2] rounded-3xl p-6 md:p-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-block bg-[#1B4332] text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Transparent Process
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-black text-[#1B4332]">
            How AgriChain Works
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            4 simple steps connecting local growers directly with urban kitchens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
          
          <div className="bg-white p-6 rounded-2xl border border-[#D5E5D8] flex flex-col items-start gap-3 shadow-sm relative">
            <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white font-extrabold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-heading font-bold text-base text-[#1B4332]">Harvest & Voice AI</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Farmer speaks crop details in Hindi or Marathi. Voice AI generates listing & checks stock.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D5E5D8] flex flex-col items-start gap-3 shadow-sm relative">
            <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white font-extrabold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-heading font-bold text-base text-[#1B4332]">Fair Price Verification</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              AgriChain algorithms cross-reference APMC Mandi rates to guarantee fair farmer payouts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D5E5D8] flex flex-col items-start gap-3 shadow-sm relative">
            <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white font-extrabold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="font-heading font-bold text-base text-[#1B4332]">Direct Household Order</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Urban families select fresh produce, enjoying wholesale pricing with zero middleman markup.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D5E5D8] flex flex-col items-start gap-3 shadow-sm relative">
            <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white font-extrabold text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="font-heading font-bold text-base text-[#1B4332]">24h Tracked Delivery</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Harvested fresh and delivered to your doorstep with live stage tracking and provenance proof.
            </p>
          </div>

        </div>
      </section>

      {/* Farmer Testimonials Section */}
      <section className="bg-white border border-[#D5E5D8] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-block bg-[#EBF4EE] text-[#1B4332] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Community Impact
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-black text-[#1B4332]">
            Empowering Maharashtra Farmers
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Real stories from local growers who transformed their livelihoods through direct selling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farmerStories.map((story, i) => (
            <div key={i} className="bg-[#F8FAF8] border border-[#E2F2E5] p-6 rounded-2xl flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <img 
                  src={story.image} 
                  alt={story.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#1B4332]"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1B4332]">{story.name}</h4>
                  <p className="text-[11px] text-gray-500">{story.location}</p>
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded mt-0.5">
                    {story.incomeGain}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (Accordion) */}
      <section className="bg-white border border-[#D5E5D8] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1 bg-[#EBF4EE] text-[#1B4332] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-black text-[#1B4332]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-[#D5E5D8] rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 md:p-5 bg-white hover:bg-[#F8FAF8] flex items-center justify-between gap-4 font-bold text-sm text-[#1B4332]"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#1B4332] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="p-4 md:p-5 bg-[#F8FAF8] border-t border-[#D5E5D8] text-xs text-gray-600 leading-relaxed font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[#1B4332] text-white rounded-3xl p-8 md:p-10 text-center relative overflow-hidden shadow-lg border border-emerald-800">
        <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-amber-300 mb-3 animate-pulse" />
          <h2 className="font-heading text-2xl md:text-3xl font-black mb-3">
            Experience 100% Unadulterated Organic Harvest
          </h2>
          <p className="text-emerald-100 text-xs md:text-sm mb-6 max-w-lg leading-relaxed font-medium">
            Join thousands of urban households enjoying farm-fresh produce delivered directly from local growers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="#produce-catalog" 
              className="bg-amber-400 hover:bg-amber-300 text-[#1B4332] font-black text-xs px-6 py-3 rounded-xl shadow-md transition"
            >
              Start Shopping Now
            </a>
            {!user && (
              <Link 
                to="/login" 
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md transition"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

