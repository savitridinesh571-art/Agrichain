import React, { useState } from "react";
import { FIVE_LOCAL_MANDI_MARKETS, type MandiMarketPrice } from "../utils/voiceCropCatalog";
import { Building2, TrendingUp, TrendingDown, MapPin, RefreshCw, BadgeCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface LocalMandiPricesCardProps {
  selectedCropId?: string;
  onSelectMandiPrice?: (price: number) => void;
  className?: string;
}

export function LocalMandiPricesCard({ selectedCropId = "onion", onSelectMandiPrice, className = "" }: LocalMandiPricesCardProps) {
  const [activeCrop, setActiveCrop] = useState<string>(selectedCropId);

  const cropList = [
    { id: "onion", name: "कांदा (Onion)", emoji: "🧅" },
    { id: "tomato", name: "टोमॅटो (Tomato)", emoji: "🍅" },
    { id: "potato", name: "बटाटा (Potato)", emoji: "🥔" },
    { id: "wheat", name: "गहू (Wheat)", emoji: "🌾" },
    { id: "mango", name: "आंबा (Mango)", emoji: "🥭" }
  ];

  return (
    <div className={`bg-white rounded-3xl p-4 sm:p-5 border border-[#D5E5D8] shadow-md space-y-4 ${className}`}>
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              LIVE APMC SYNC
            </span>
            <span className="text-[10px] text-gray-500 font-bold">5 Markets Verified</span>
          </div>
          <h3 className="font-heading font-black text-base sm:text-lg text-[#1B4332] mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <span>5 Major Local APMC Market Prices</span>
          </h3>
          <p className="text-xs text-gray-600 font-medium">
            (५ प्रमुख स्थानिक बाजारसमितीचे ताजे दर • नाशिक, पुणे, वाशी, कोल्हापूर, नागपूर)
          </p>
        </div>

        <div className="bg-[#EBF4EE] px-3 py-1.5 rounded-xl border border-[#CDE3D2] flex items-center gap-1.5 text-xs text-[#1B4332] font-bold">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
          <span>Updated Today</span>
        </div>
      </div>

      {/* Crop Selector Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-gray-500 font-extrabold uppercase tracking-wide">Select Crop to View 5 Mandi Rates:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {cropList.map(crop => (
            <button
              key={crop.id}
              onClick={() => setActiveCrop(crop.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                activeCrop === crop.id
                  ? "bg-[#1B4332] text-amber-300 shadow-md ring-2 ring-emerald-600"
                  : "bg-gray-100 text-gray-700 hover:bg-[#EBF4EE] border border-gray-200"
              }`}
            >
              <span>{crop.emoji}</span>
              <span>{crop.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5 Local Mandis List Cards */}
      <div className="space-y-2.5">
        {FIVE_LOCAL_MANDI_MARKETS.map((mandi) => {
          const info = mandi.cropPrices[activeCrop] || mandi.cropPrices["onion"];
          return (
            <div
              key={mandi.id}
              className="p-3 rounded-2xl bg-[#F8FAF8] hover:bg-[#EBF4EE] border border-gray-200 transition flex flex-wrap items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1B4332] text-amber-300 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  🏢
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs sm:text-sm text-[#1B4332] group-hover:text-emerald-900 transition">
                    {mandi.mandiLocalName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500 font-bold flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {mandi.district}
                    </span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                      {mandi.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Rates & Trend */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-xs text-gray-500 font-bold">Range:</span>
                    <span className="font-heading font-black text-xs text-gray-700">
                      ₹{info.minPrice} - ₹{info.maxPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Avg Rate:</span>
                    <span className="font-heading font-black text-sm text-[#1B4332] bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                      ₹{info.avgPrice}/kg
                    </span>
                  </div>
                </div>

                {/* Trend Badge */}
                <div className={`px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 shrink-0 ${
                  info.trend === "up"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : info.trend === "down"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}>
                  {info.trend === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>{info.changePct}</span>
                </div>

                {/* Optional click to apply price */}
                {onSelectMandiPrice && (
                  <button
                    onClick={() => onSelectMandiPrice(info.avgPrice)}
                    className="text-[10px] font-extrabold bg-[#1B4332] hover:bg-[#122e22] text-white px-2.5 py-1 rounded-lg shadow transition"
                  >
                    Use Rate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct AgriChain Price Advantage Banner */}
      <div className="p-3 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>AgriChain Direct Fair Price Recommendation: Sell direct to save 15% middleman commission!</span>
        </div>
        <span className="bg-amber-400 text-[#1B4332] text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0">
          +15% Extra Profit
        </span>
      </div>

    </div>
  );
}
