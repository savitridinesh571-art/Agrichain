import React, { useState } from "react";
import type { Order, OrderReview } from "../context/AppProvider";
import { useAppContext } from "../context/AppProvider";
import { 
  Navigation, 
  Thermometer, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Send, 
  Heart, 
  BadgeCheck, 
  DollarSign
} from "lucide-react";
import { getCropImage } from "../utils/cropImages";

interface LiveOrderTrackingMapProps {
  order: Order;
}

export function LiveOrderTrackingMap({ order }: LiveOrderTrackingMapProps) {
  const { addOrderReview, updateOrderStatus } = useAppContext();

  const [showPriceAudit, setShowPriceAudit] = useState(true);
  const [rating, setRating] = useState<number>(order.review?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    order.review?.tags || ["Ultra Fresh 🍅", "On-Time Rider 🛵"]
  );
  const [comment, setComment] = useState<string>(order.review?.comment || "");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!order.review);
  const [driverMsgModal, setDriverMsgModal] = useState(false);
  const [driverMsgText, setDriverMsgText] = useState("");
  const [driverMsgSent, setDriverMsgSent] = useState(false);

  const availableTags = [
    "Ultra Fresh 🍅",
    "Properly Chilled ❄️",
    "On-Time Rider 🛵",
    "Organic Quality 🌿",
    "Fair Direct Price 💚",
    "Zero Damage Packaging 📦"
  ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewData: OrderReview = {
      rating,
      tags: selectedTags,
      comment,
      submittedAt: new Date().toISOString()
    };
    addOrderReview(order.id, reviewData);
    setIsSubmitted(true);
  };

  const handleSendMessage = () => {
    if (!driverMsgText.trim()) return;
    setDriverMsgSent(true);
    setTimeout(() => {
      setDriverMsgSent(false);
      setDriverMsgModal(false);
      setDriverMsgText("");
    }, 2000);
  };

  const isDelivered = order.status === "Delivered" || order.trackingStep === 4;

  return (
    <div className="space-y-4">
      
      {/* 1. Live Interactive GPS Map & Van Status Container */}
      <div className="bg-gradient-to-b from-[#0F2D1F] via-[#16432D] to-[#1B4332] rounded-3xl p-4 sm:p-5 text-white shadow-xl border border-emerald-800 space-y-4 relative overflow-hidden">
        
        {/* Top Status Header Pill */}
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-heading font-extrabold uppercase tracking-wider text-amber-300">
              {isDelivered ? "✓ Delivery Completed" : "Out for Delivery (मार्गक्रमण)"}
            </span>
          </div>
          <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-emerald-200 border border-white/10 font-mono">
            ETA: {isDelivered ? "Delivered at Doorstep" : "45 mins (01:15 PM)"}
          </span>
        </div>

        {/* Live Vector Map Graphic */}
        <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-white/15 bg-[#123323] shadow-inner flex flex-col justify-between p-3">
          
          {/* Simulated Map Background Grid & Route SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#2D6A4F" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Curved Animated GPS Route Line */}
            <path 
              d="M 30 140 C 100 80, 200 160, 340 60" 
              fill="none" 
              stroke="#F59E0B" 
              strokeWidth="4" 
              strokeDasharray="6,6"
              className="animate-pulse"
            />
          </svg>

          {/* Map Top Floating Gauges */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            {/* Temperature Gauge */}
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
              <div className="w-7 h-7 bg-sky-500/20 text-sky-300 rounded-lg flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-sky-300" />
              </div>
              <div>
                <span className="font-heading font-black text-sm text-sky-200">4.2°C</span>
                <span className="text-[9px] text-emerald-200 block font-bold leading-none">Cold Van Transit</span>
              </div>
            </div>

            {/* Distance Away */}
            <div className="bg-amber-400 text-[#1B4332] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg text-xs">
              <Navigation className="w-4 h-4 fill-[#1B4332]" />
              <span>{isDelivered ? "Destination Reached" : "3.4 km away"}</span>
            </div>
          </div>

          {/* Map Center Pins: Cold Van & Customer Home */}
          <div className="relative z-10 flex items-center justify-between px-6 sm:px-12 my-auto">
            {/* Van Marker */}
            <div className="flex flex-col items-center gap-1 animate-bounce">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-amber-400/30">
                <Truck className="w-5 h-5" />
              </div>
              <span className="bg-black/60 backdrop-blur-sm text-[9px] px-2 py-0.5 rounded text-amber-300 font-extrabold">
                AgriChain Cold Van
              </span>
            </div>

            {/* Destination Pin */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-emerald-500/30">
                <MapPin className="w-5 h-5 text-amber-300" />
              </div>
              <span className="bg-black/60 backdrop-blur-sm text-[9px] px-2 py-0.5 rounded text-white font-bold">
                Customer Location
              </span>
            </div>
          </div>

          {/* Map Footer Note */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-emerald-200 font-medium bg-black/30 backdrop-blur-sm p-2 rounded-xl border border-white/10">
            <span>📍 Delivery Address: {order.deliveryAddress}</span>
            <span className="font-bold text-amber-300">Live GPS Verified</span>
          </div>
        </div>

        {/* Tracking Timeline Journey Steps */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Tracking Journey / वितरण प्रवास
          </h4>

          <div className="space-y-3 relative pl-3 border-l-2 border-emerald-500/50 ml-2">
            {/* Step 1 */}
            <div className="relative pl-4">
              <span className="absolute -left-[19px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">✓</span>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Order Placed</span>
                <span className="text-[10px] text-emerald-200">08:30 AM</span>
              </div>
              <p className="text-[11px] text-emerald-100 opacity-90">Confirmed & assigned to Nashik cluster</p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-4">
              <span className="absolute -left-[19px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">✓</span>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Harvested & Packed by Ramesh Patil</span>
                <span className="text-[10px] text-emerald-200">10:15 AM</span>
              </div>
              <p className="text-[11px] text-emerald-100 opacity-90">Sun-picked, sorted for Grade A+ quality</p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-4">
              <span className="absolute -left-[19px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">✓</span>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">Picked up by AgriChain Cold Van</span>
                <span className="text-[10px] text-emerald-200">12:00 PM</span>
              </div>
              <p className="text-[11px] text-emerald-100 opacity-90">IoT active temperature tracking enabled</p>
            </div>

            {/* Step 4 */}
            <div className="relative pl-4">
              <span className={`absolute -left-[19px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                isDelivered ? "bg-emerald-500 text-white" : "bg-amber-400 text-[#1B4332] animate-ping"
              }`}>
                {isDelivered ? "✓" : "•"}
              </span>
              <div className="flex justify-between text-xs">
                <span className={`font-bold ${isDelivered ? "text-white" : "text-amber-300"}`}>
                  {isDelivered ? "Doorstep Delivery Completed" : "Out for Delivery with Driver Sachin"}
                </span>
                <span className="text-[10px] text-amber-300 font-bold">{isDelivered ? "Delivered" : "Now"}</span>
              </div>
              <p className="text-[11px] text-emerald-100 opacity-90">
                {isDelivered ? "Contactless handoff with farm freshness seal" : "Approaching your sector • 45 min ETA"}
              </p>
            </div>
          </div>
        </div>

        {/* Driver Contact Card */}
        <div className="bg-white text-[#1B4332] p-3 rounded-2xl shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center text-xl overflow-hidden shrink-0">
              🧑‍✈️
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-[#1B4332]">Sachin K. • Eco Runner</h4>
              <p className="text-[10px] text-gray-500 font-bold">Electric Van #MH-15-EV-4402</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href="tel:+919820012345" 
              className="p-2.5 bg-gray-100 hover:bg-gray-200 text-[#1B4332] rounded-xl font-bold transition flex items-center gap-1 text-xs"
              title="Call Driver Sachin"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
            </a>
            <button
              onClick={() => setDriverMsgModal(true)}
              className="px-3 py-2 bg-[#1B4332] hover:bg-[#122e22] text-white rounded-xl font-bold transition flex items-center gap-1.5 text-xs shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-amber-300" />
              <span>Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Driver Message Popup Modal */}
      {driverMsgModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-[#1B4332] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-emerald-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-heading font-black text-sm text-[#1B4332] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700" /> Message Driver Sachin
              </h3>
              <button onClick={() => setDriverMsgModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            {driverMsgSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1 text-emerald-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-extrabold text-xs">Message Sent to Driver!</p>
                <p className="text-[10px] text-emerald-700">Sachin will follow your instructions upon arrival.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-600">Send delivery instructions (e.g. Leave at gate, Ring doorbell):</p>
                <textarea
                  value={driverMsgText}
                  onChange={(e) => setDriverMsgText(e.target.value)}
                  placeholder="Type message for driver..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none h-24"
                ></textarea>

                <div className="flex gap-2">
                  <button
                    onClick={() => setDriverMsgText("Please ring doorbell when you arrive.")}
                    className="text-[10px] bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg text-gray-700 font-bold"
                  >
                    🔔 Ring Doorbell
                  </button>
                  <button
                    onClick={() => setDriverMsgText("Please leave package at security gate.")}
                    className="text-[10px] bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg text-gray-700 font-bold"
                  >
                    🏢 Gate Handoff
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => setDriverMsgModal(false)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                  <button onClick={handleSendMessage} className="px-4 py-2 text-xs font-black bg-[#1B4332] text-white rounded-xl shadow-md flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-amber-300" /> Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Open Audit Price Verification Card */}
      {(() => {
        const primaryItem = order.items && order.items[0];
        const productName = primaryItem?.product?.name || "Farm Produce";
        const unit = primaryItem?.product?.unit || "kg";
        const farmerPrice = primaryItem?.product?.price || Math.round(order.totalPrice / (primaryItem?.quantity || 1));
        const apmcMin = Math.round(farmerPrice * 0.92);
        const apmcMax = Math.round(farmerPrice * 1.08);
        const savedAmount = Math.round(farmerPrice * 0.25);

        return (
          <div className="bg-white rounded-2xl p-4 border border-[#D5E5D8] shadow-sm space-y-3">
            <button
              onClick={() => setShowPriceAudit(!showPriceAudit)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-black text-sm">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs sm:text-sm text-[#1B4332]">
                    How Was This Price Verified? (पारदर्शक शेतकरी भाव)
                  </h4>
                  <p className="text-[10px] text-gray-500 font-bold">Open Audit Report • Direct Farm Gate Price</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                  100% Fair
                </span>
                {showPriceAudit ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {showPriceAudit && (
              <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-[#F8FAF8] rounded-xl">
                  <span className="text-gray-600 font-bold">👨‍🌾 Farmer Price Paid Direct ({productName}):</span>
                  <span className="font-heading font-black text-[#1B4332]">₹{farmerPrice} / {unit}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-[#F8FAF8] rounded-xl">
                  <span className="text-gray-600 font-bold">🏛️ APMC Mandi Reference Range:</span>
                  <span className="font-heading font-black text-gray-700">₹{apmcMin} - ₹{apmcMax} / {unit}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-[#F8FAF8] rounded-xl">
                  <span className="text-gray-600 font-bold">🎖️ Quality Grade:</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-200">
                    A+ Certified Organic
                  </span>
                </div>

                {/* Zero Middlemen Markup Highlight */}
                <div className="p-3 bg-[#0F2D1F] text-white rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">ZERO MIDDLEMEN MARKUPS</span>
                    <span className="font-heading font-black text-base text-amber-300">₹{savedAmount}/{unit} Saved Direct</span>
                  </div>
                  <span className="bg-white/10 px-3 py-1.5 rounded-xl text-[10px] font-extrabold text-emerald-200 border border-white/10">
                    🌱 100% Farmgate Value
                  </span>
                </div>

                {order.items && order.items.length > 1 && (
                  <div className="pt-1 text-[10px] text-gray-500 font-medium">
                    * APMC Mandi audit verified for ordered produce ({order.items.length} items total).
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* 3. Rate Produce & Farmers Interactive Section (Unlocks after Delivery) */}
      <div className={`rounded-3xl p-5 shadow-lg border transition-all ${
        isDelivered 
          ? "bg-gradient-to-b from-amber-500/10 via-white to-emerald-50 border-amber-300 ring-2 ring-amber-300/40" 
          : "bg-white border-gray-200 opacity-90"
      }`}>
        
        <div className="text-center space-y-1 pb-3 border-b border-amber-200/50">
          <div className="w-12 h-12 bg-amber-400 text-[#1B4332] rounded-full flex items-center justify-center mx-auto shadow-md font-black text-xl mb-1">
            ⭐
          </div>
          <h3 className="font-heading font-black text-base text-[#1B4332]">
            Rate Produce & Farmers (शेतकरी व पिकाला रेटिंग द्या)
          </h3>
          <p className="text-xs text-gray-600 font-medium max-w-sm mx-auto">
            Support Ramesh Patil & Sunita Deshmukh with genuine feedback for direct fair bonuses!
          </p>
        </div>

        {isSubmitted ? (
          /* Submitted Rating Confirmation */
          <div className="py-4 text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-2xl font-black text-xs shadow-sm">
              <BadgeCheck className="w-5 h-5 text-emerald-600" />
              <span>✓ Review & Fair Bonus Submitted!</span>
            </div>
            
            <div className="flex items-center justify-center gap-1 text-amber-500 text-lg">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-6 h-6 ${s <= (order.review?.rating || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {order.review?.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {order.review?.comment && (
              <p className="text-xs text-gray-700 italic bg-white p-3 rounded-xl border border-gray-200 max-w-md mx-auto">
                "{order.review.comment}"
              </p>
            )}

            <p className="text-[11px] text-emerald-800 font-extrabold">
              💚 Farmer Ramesh & Sunita received your {order.review?.rating || rating}⭐ review and direct quality bonus.
            </p>
          </div>
        ) : (
          /* Interactive Rating Form */
          <form onSubmit={handleReviewSubmit} className="pt-4 space-y-4">
            
            {/* Interactive 5 Star Selection */}
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-[11px] text-gray-500 font-extrabold uppercase tracking-wide">
                Tap a star to leave review:
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const active = starVal <= (hoverRating || rating);
                  return (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition transform hover:scale-125 active:scale-95 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          active
                            ? "fill-amber-400 text-amber-400 drop-shadow-md"
                            : "text-gray-300 hover:text-amber-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-black text-amber-800">
                {rating === 5 ? "⭐⭐⭐⭐⭐ Ultra Exceptional Freshness!" : `${rating} Stars Rated`}
              </span>
            </div>

            {/* Quick Feedback Tag Chips */}
            <div className="space-y-1.5 text-center">
              <span className="text-[11px] text-gray-500 font-bold block">Select Quality Badges:</span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-full transition ${
                        isSelected
                          ? "bg-[#1B4332] text-amber-300 shadow-md ring-2 ring-amber-400"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Comment Box */}
            <div className="space-y-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write optional message for farmer (e.g., Rameshji's tomatoes were extremely crisp and fresh!)..."
                className="w-full p-3 rounded-2xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium h-20"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-2xl shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Submit Review & Award Farmer Fair Bonus</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
