import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { Card } from "../../components/ui/Card";
import { getCropImage } from "../../utils/cropImages";
import { 
  PlusCircle, 
  Mic, 
  ShoppingBag, 
  Trash2, 
  CheckCircle2, 
  TrendingUp, 
  Package, 
  Tag, 
  Search, 
  Eye, 
  MapPin, 
  AlertCircle,
  ChevronRight,
  X,
  Clock,
  Truck,
  DollarSign,
  Calendar,
  Building2,
  ShieldCheck,
  Sparkles,
  Calculator,
  User,
  Phone
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { VoiceListingModal } from "../../components/VoiceListingModal";
import { LocalMandiPricesCard } from "../../components/LocalMandiPricesCard";

export function FarmerHub() {
  const { 
    products, 
    deleteProduct, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    addToCart, 
    orders,
    updateOrderStatus,
    t 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<"myListings" | "marketplace">("myListings");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLiveOrdersModalOpen, setIsLiveOrdersModalOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isMandiModalOpen, setIsMandiModalOpen] = useState(false);

  // Mandi Calculator state
  const [calcQty, setCalcQty] = useState<number>(100);
  const [calcPrice, setCalcPrice] = useState<number>(32);

  // Get farmer products
  const myProducts = products;

  const categoryOptions = [
    { id: "All", label: t("all") },
    { id: "Vegetables", label: t("vegetables") },
    { id: "Fruits", label: t("fruits") },
    { id: "Grains", label: t("grains") },
    { id: "Pulses", label: t("pulses") }
  ];

  const filteredMarketplaceProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.localName && p.localName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
    setToastMessage(`Removed "${name}" from your produce listings.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B4332] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#1B4332]">Farm Hub</h1>
          <p className="text-xs text-gray-600 font-medium">Manage your produce listings & explore live market rates.</p>
        </div>

        <Link 
          to="/farmer/add" 
          className="bg-[#1B4332] hover:bg-[#122e22] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>+ Add Harvest</span>
        </Link>
      </header>

      {/* Overview Stat Cards (Interactive with Modals) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Live Orders Card (Interactive Amber Accent) */}
        <div 
          onClick={() => setIsLiveOrdersModalOpen(true)}
          className="p-4 bg-[#D97706] hover:bg-[#b46103] text-white rounded-2xl shadow-sm flex flex-col justify-between border border-amber-600 cursor-pointer transition transform hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
          title="Click to manage live orders and update status"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase font-black tracking-wider opacity-90">Live Orders</p>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Manage</span>
          </div>
          <p className="text-3xl font-heading font-black mt-2">{orders.length > 0 ? orders.length : 12}</p>
          <p className="text-[10px] opacity-80 mt-1 font-medium flex items-center gap-1">
            <span>Tap to view {orders.length > 0 ? orders.length : 12} live shipments</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Revenue Card (Interactive Clean Card) */}
        <div 
          onClick={() => setIsRevenueModalOpen(true)}
          className="p-4 bg-white hover:bg-emerald-50/50 text-[#1B4332] rounded-2xl shadow-sm border border-[#D5E5D8] hover:border-emerald-500 flex flex-col justify-between cursor-pointer transition transform hover:scale-[1.02] active:scale-95 group"
          title="Click for revenue and payout breakdown"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-500 font-black tracking-wider uppercase">Revenue</p>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">Payouts</span>
          </div>
          <p className="text-3xl text-[#1B4332] font-heading font-black mt-2">
            ₹{orders.length > 0 ? orders.reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString() : "4,500"}
          </p>
          <p className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <span>Tap for financial breakdown</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Mandi Benchmark Card (Interactive APMC Index) */}
        <div 
          onClick={() => setIsMandiModalOpen(true)}
          className="p-4 bg-[#EBF4EE] hover:bg-[#d8ebd9] text-[#1B4332] rounded-2xl shadow-sm border border-[#CDE3D2] hover:border-emerald-600 flex flex-col justify-between cursor-pointer transition transform hover:scale-[1.02] active:scale-95 group"
          title="Click to view live APMC Mandi rates across Maharashtra"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-[#1B4332] font-black tracking-wider uppercase flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" /> Mandi Index
            </p>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black">Live</span>
          </div>
          <p className="text-xl font-heading font-black mt-2 text-emerald-800">Live (+18%)</p>
          <p className="text-[10px] text-emerald-800 font-bold mt-1 flex items-center gap-1">
            <span>Tap for APMC rates & AI check</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </p>
        </div>

        {/* Active Listings Count Card */}
        <div 
          onClick={() => {
            setActiveTab("myListings");
            window.scrollTo({ top: 400, behavior: "smooth" });
          }}
          className="p-4 bg-white hover:bg-gray-50 text-[#1B4332] rounded-2xl shadow-sm border border-[#D5E5D8] hover:border-[#1B4332] flex flex-col justify-between cursor-pointer transition transform hover:scale-[1.02] active:scale-95 group"
          title="Click to jump to your produce listings"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-500 font-black tracking-wider uppercase">Active Listings</p>
            <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">List</span>
          </div>
          <p className="text-3xl text-[#1B4332] font-heading font-black mt-2">{myProducts.length}</p>
          <p className="text-[10px] text-gray-600 font-bold mt-1 flex items-center gap-1">
            <span>Tap to manage stock</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
          </p>
        </div>
      </div>

      {/* Voice Assistant Shortcut Card */}
      <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-emerald-800">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div 
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-10 h-10 bg-amber-400 text-[#1B4332] rounded-full flex items-center justify-center font-black shrink-0 cursor-pointer hover:scale-110 transition shadow-lg"
            title="Click to speak or list produce"
          >
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Voice Harvest Listing (बोलून पीक जोडा)</h3>
            <p className="text-xs text-emerald-100 font-medium">Speak in Hindi or Marathi to list produce in 30 seconds.</p>
          </div>
        </div>

        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="bg-amber-400 hover:bg-amber-300 text-[#1B4332] font-black text-xs px-4 py-2.5 rounded-xl shadow transition shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Mic className="w-4 h-4" />
          <span>Use Voice Assistant</span>
        </button>
      </div>

      {/* View Switcher Tabs: My Produce Listings vs Marketplace Product List */}
      <div className="flex items-center bg-[#EBF4EE] p-1.5 rounded-2xl border border-[#CDE3D2] w-full max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab("myListings")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === "myListings"
              ? "bg-[#1B4332] text-white shadow-sm"
              : "text-[#1B4332] hover:bg-white/60"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Produce Listings ({myProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("marketplace")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === "marketplace"
              ? "bg-[#1B4332] text-white shadow-sm"
              : "text-[#1B4332] hover:bg-white/60"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Marketplace Product List</span>
        </button>
      </div>

      {/* Tab 1: My Produce Listings (Matching Screenshot Layout) */}
      {activeTab === "myListings" && (
        <section className="space-y-4">
          <h2 className="text-xl font-heading font-extrabold text-[#1B4332]">My Produce Listings</h2>
          {myProducts.length === 0 ? (
            <Card className="p-8 text-center bg-white border border-[#D5E5D8] rounded-2xl">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-[#1B4332]">No produce listed yet</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">Add your harvest using our simple form or voice assistant.</p>
              <Link to="/farmer/add" className="inline-block bg-[#1B4332] text-white text-xs font-extrabold px-4 py-2 rounded-xl">
                + Add Harvest Now
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {myProducts.map(p => {
                const imgSrc = getCropImage(p.name, p.category, p.image);
                return (
                  <Card 
                    key={p.id} 
                    className="p-4 flex justify-between items-center bg-white border border-[#D5E5D8] rounded-2xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={imgSrc}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#D5E5D8] flex-shrink-0"
                      />
                      <div>
                        <h3 className="font-heading font-extrabold text-lg text-[#1B4332]">{p.name}</h3>
                        <p className="text-xs text-gray-600 font-semibold mt-0.5">
                          Price: <span className="text-[#1B4332] font-black">₹{p.price}/{p.unit}</span> | Stock: <span className="text-gray-800 font-bold">{p.quantity} {p.unit}</span>
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-red-600 font-extrabold text-xs px-3 py-1.5 hover:bg-red-50 rounded-xl border border-red-100 transition shrink-0"
                    >
                      Remove
                    </button>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Full Marketplace Product List Page */}
      {activeTab === "marketplace" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-[#1B4332]">All Marketplace Produce</h2>
              <p className="text-xs text-gray-600 font-medium">Browse all crops listed across Maharashtra organic farms.</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categoryOptions.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-[#1B4332] text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-[#EBF4EE] border border-[#D5E5D8]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Listing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMarketplaceProducts.map(p => {
              const imgSrc = getCropImage(p.name, p.category, p.image);
              return (
                <Card key={p.id} className="flex flex-col h-full hover:shadow-lg transition overflow-hidden border border-[#D5E5D8] rounded-2xl bg-white">
                  <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={p.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                        {p.category}
                      </span>
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        {p.grade}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <h4 className="font-heading text-lg font-extrabold leading-tight">
                        {p.name}
                      </h4>
                      <p className="text-[11px] opacity-90 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-300" /> {p.location} ({p.farm})
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>
                    
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="font-heading text-xl font-black text-[#1B4332]">₹{p.price}</span>
                        <span className="text-xs text-gray-500"> / {p.unit}</span>
                        <span className="block text-[10px] text-emerald-700 font-bold">Stock: {p.quantity} {p.unit}</span>
                      </div>

                      <Link to={`/product/${p.id}`}>
                        <Button variant="tertiary" className="!px-3 !py-1.5 !min-h-[36px] text-xs flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Voice Harvest Listing Modal */}
      <VoiceListingModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onProductAdded={(name) => {
          setToastMessage(`"Successfully added ${name} to your listings!"`);
          setActiveTab("myListings");
        }}
      />

      {/* 1. Live Orders Modal */}
      {isLiveOrdersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#D5E5D8] my-8 animate-in fade-in zoom-in duration-200">
            <div className="bg-[#D97706] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white text-[#D97706] rounded-2xl flex items-center justify-center font-black shadow-md">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-black text-xl text-white">Live Customer Orders ({orders.length > 0 ? orders.length : 12})</h2>
                  <p className="text-xs text-amber-100">Real-time order fulfillment & logistics status manager</p>
                </div>
              </div>
              <button 
                onClick={() => setIsLiveOrdersModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Displaying sample customer orders. Place a real order in marketplace to test live tracking!</span>
                  </div>

                  {/* Sample Orders Cards */}
                  {[
                    {
                      id: "AGC-2026-9041",
                      customer: "Priya Sharma (Pune)",
                      phone: "+91 98234 11098",
                      address: "Flat 402, Sunshine Heights, Kothrud, Pune",
                      items: "5kg Organic Tomatoes, 2kg Nashik Red Onions",
                      amount: 210,
                      status: "In Transit"
                    },
                    {
                      id: "AGC-2026-8812",
                      customer: "Sumit Yadav (Mira-Bhayandar)",
                      phone: "+91 98200 12345",
                      address: "Bhayandar West, Thane, Maharashtra",
                      items: "10kg Indrayani Rice, 3kg Toor Dal",
                      amount: 990,
                      status: "Harvested & Packed"
                    },
                    {
                      id: "AGC-2026-7650",
                      customer: "Dr. Ananya Roy (Mumbai)",
                      phone: "+91 98190 77621",
                      address: "Bandra West, Mumbai",
                      items: "4kg Alphonso Mangoes, 2kg Turmeric",
                      amount: 860,
                      status: "Placed"
                    }
                  ].map((ord) => (
                    <div key={ord.id} className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
                        <div>
                          <span className="font-heading font-black text-sm text-[#1B4332]">{ord.id}</span>
                          <span className="text-xs text-gray-600 font-bold ml-2">• {ord.customer}</span>
                        </div>
                        <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                          {ord.status}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong className="text-gray-800">Address:</strong> {ord.address}</p>
                        <p><strong className="text-gray-800">Items:</strong> {ord.items}</p>
                        <p><strong className="text-gray-800">Phone:</strong> {ord.phone}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="font-heading font-black text-base text-[#1B4332]">Total: ₹{ord.amount}</span>
                        <Link 
                          to="/orders"
                          onClick={() => setIsLiveOrdersModalOpen(false)}
                          className="bg-[#1B4332] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#122e22] transition"
                        >
                          View Logistics Map →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
                      <div>
                        <span className="font-heading font-black text-sm text-[#1B4332]">{ord.id}</span>
                        <span className="text-xs text-gray-500 ml-2">• Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        ord.status === "Delivered" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong className="text-gray-800">Address:</strong> {ord.deliveryAddress}</p>
                      <p><strong className="text-gray-800">Phone:</strong> {ord.customerPhone}</p>
                      <p><strong className="text-gray-800">Items:</strong> {ord.items.map(i => `${i.quantity} ${i.product.unit} ${i.product.name}`).join(", ")}</p>
                    </div>

                    {/* Status Changer Bar */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-200">
                      <span className="text-[11px] font-bold text-gray-600 mr-1">Update Status:</span>
                      {["Placed", "Harvested & Packed", "In Transit", "Delivered"].map((st, idx) => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(ord.id, st as any, idx + 1)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition border ${
                            ord.status === st
                              ? "bg-[#1B4332] text-white border-[#1B4332]"
                              : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                          }`}
                        >
                          {st.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Revenue & Financial Settlement Modal */}
      {isRevenueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-[#D5E5D8] my-8 animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1B4332] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 text-[#1B4332] rounded-2xl flex items-center justify-center font-black shadow-md">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-black text-xl text-white">Revenue & Financial Settlement</h2>
                  <p className="text-xs text-emerald-200">Direct Bank Settlement & Fair Trade Bonus Payouts</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRevenueModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Financial KPI Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#EBF4EE] p-4 rounded-2xl border border-[#CDE3D2]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Gross Revenue</span>
                  <span className="font-heading font-black text-2xl text-[#1B4332]">
                    ₹{orders.length > 0 ? orders.reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString() : "4,500"}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">+22% vs Middleman APMC Rate</span>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Settled Bank Payout</span>
                  <span className="font-heading font-black text-2xl text-emerald-800">
                    ₹{orders.length > 0 ? Math.round(orders.reduce((acc, o) => acc + o.totalPrice, 0) * 0.85).toLocaleString() : "3,825"}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">Bank of Maharashtra •• 9014</span>
                </div>
              </div>

              {/* Bonus Card */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-black block">🌱 Living Soil Organic Dividend (+5%)</span>
                  <span className="text-[11px] opacity-90">Bonus credited for zero-chemical verified harvest.</span>
                </div>
                <span className="font-heading font-black text-xl text-white bg-white/20 px-3 py-1 rounded-xl">
                  +₹{orders.length > 0 ? Math.round(orders.reduce((acc, o) => acc + o.totalPrice, 0) * 0.05).toLocaleString() : "225"}
                </span>
              </div>

              {/* Crop Category Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-[#1B4332] uppercase tracking-wide">Revenue Share by Produce</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-bold text-gray-800">🍅 Vegetables (Tomatoes & Onions)</span>
                    <span className="font-black text-[#1B4332]">₹1,800 (40%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-bold text-gray-800">🥭 Fruits (Mangoes & Pomegranate)</span>
                    <span className="font-black text-[#1B4332]">₹1,500 (33%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-bold text-gray-800">🌾 Grains (Indrayani Rice & Wheat)</span>
                    <span className="font-black text-[#1B4332]">₹800 (18%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-bold text-gray-800">🫘 Pulses (Toor Dal & Chana)</span>
                    <span className="font-black text-[#1B4332]">₹400 (9%)</span>
                  </div>
                </div>
              </div>

              {/* Settlement History Log Table */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-black text-[#1B4332] uppercase tracking-wide">Recent Bank Payout Logs</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <strong className="text-gray-800 block">UPI Transfer #AG-PAY-8809</strong>
                      <span className="text-[10px] text-gray-500">14 Sep 2026 • Order #AGC-2026-9041</span>
                    </div>
                    <span className="text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded-md">✓ Settled (₹1,200)</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <strong className="text-gray-800 block">UPI Transfer #AG-PAY-7712</strong>
                      <span className="text-[10px] text-gray-500">12 Sep 2026 • Order #AGC-2026-8812</span>
                    </div>
                    <span className="text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded-md">✓ Settled (₹2,625)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. Mandi Index & AI Price Checker Modal */}
      {isMandiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#D5E5D8] my-8 animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1B4332] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 text-[#1B4332] rounded-2xl flex items-center justify-center font-black shadow-md">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-black text-xl text-white">APMC Mandi Index & AI Pricing</h2>
                  <p className="text-xs text-emerald-200">Live regional mandi rates across Maharashtra</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMandiModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Regional Mandi Benchmark Component */}
              <LocalMandiPricesCard />

              {/* Interactive AI Mandi Calculator Tool */}
              <div className="bg-[#EBF4EE] border-2 border-emerald-600 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-black text-sm text-[#1B4332] flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-emerald-700" /> Instant Profit & Price Estimator
                  </h4>
                  <span className="bg-amber-400 text-[#1B4332] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    AI Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Harvest Weight (kg):</label>
                    <input
                      type="number"
                      value={calcQty}
                      onChange={e => setCalcQty(Number(e.target.value))}
                      className="w-full bg-white border border-[#D5E5D8] p-2 rounded-xl text-sm font-bold text-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Price per kg (₹):</label>
                    <input
                      type="number"
                      value={calcPrice}
                      onChange={e => setCalcPrice(Number(e.target.value))}
                      className="w-full bg-white border border-[#D5E5D8] p-2 rounded-xl text-sm font-bold text-[#1B4332]"
                    />
                  </div>
                </div>

                {/* Calculated Result Box */}
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Estimated Direct Earnings:</span>
                    <span className="font-heading font-black text-2xl text-[#1B4332]">
                      ₹{(calcQty * calcPrice).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right text-[11px] font-bold text-emerald-800">
                    <p className="bg-emerald-100 px-2 py-0.5 rounded">+22% vs APMC Middleman</p>
                    <p className="text-amber-800 text-[10px] mt-0.5">+₹{(calcQty * calcPrice * 0.05).toFixed(0)} Living Soil Bonus</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <Link
                  to="/farmer/price-check"
                  onClick={() => setIsMandiModalOpen(false)}
                  className="bg-[#1B4332] hover:bg-[#122e22] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <span>Open Full Voice Price Assistant</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}


