import React, { useState } from "react";
import { useAppContext } from "../context/AppProvider";
import { calculateDistanceKm, getCoordinatesForLocation, formatDistance } from "../lib/location";
import { GoogleMapView, type MapMarker } from "./GoogleMapView";
import { MapPin, Sprout, ShoppingBag, Map as MapIcon, List, Navigation, Eye, CheckCircle2, Star, ArrowRight } from "lucide-react";
import { getCropImage } from "../utils/cropImages";
import { Link } from "react-router-dom";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface NearbyFarmersProps {
  maxDistanceKm?: number;
  className?: string;
}

export function NearbyFarmers({ maxDistanceKm = 50, className = "" }: NearbyFarmersProps) {
  const { products, customerLocation, addToCart, language, t } = useAppContext();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customer origin coordinates
  const customerCoords = customerLocation
    ? { lat: customerLocation.latitude, lng: customerLocation.longitude }
    : { lat: 19.2952, lng: 72.8544 }; // Default Mira-Bhayandar

  // Process products with distance calculation
  const nearbyProducts = products.map((prod) => {
    // Determine product coordinates from explicit fields or location mapping
    const rawCoords =
      prod.latitude && prod.longitude
        ? { latitude: prod.latitude, longitude: prod.longitude }
        : getCoordinatesForLocation(prod.location);

    const prodCoords = { lat: rawCoords.latitude, lng: rawCoords.longitude };

    const distKm = calculateDistanceKm(
      customerCoords.lat,
      customerCoords.lng,
      prodCoords.lat,
      prodCoords.lng
    );

    return {
      ...prod,
      coords: prodCoords,
      distanceKm: distKm
    };
  });

  // Sort by distance (nearest first)
  nearbyProducts.sort((a, b) => a.distanceKm - b.distanceKm);

  // Build markers for Google Maps view
  const mapMarkers: MapMarker[] = [
    {
      id: "customer-home",
      lat: customerCoords.lat,
      lng: customerCoords.lng,
      title: "Your Location",
      subtitle: customerLocation?.address || "Current Location",
      type: "customer"
    },
    ...nearbyProducts.map((p) => ({
      id: p.id,
      lat: p.coords.lat,
      lng: p.coords.lng,
      title: p.name,
      subtitle: `${p.farm} (${p.location})`,
      type: "farmer" as const,
      price: `₹${p.price}/${p.unit}`,
      cropName: p.name,
      distanceKm: p.distanceKm
    }))
  ];

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setToastMessage(`Added "${product.name}" to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B4332] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Section Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#D5E5D8] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Navigation className="w-3 h-3 text-emerald-700" /> GPS RADIUS SEARCH
            </span>
            <span className="text-[10px] text-gray-500 font-bold">Sorted by Proximity</span>
          </div>
          <h2 className="font-heading font-black text-lg sm:text-xl text-[#1B4332] mt-1 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-700" />
            <span>
              {language === "mr" ? "जवळचे शेतकरी आणि पीक" : language === "hi" ? "निकटतम किसान और उपज" : "Nearby Farmers & Produce"}
            </span>
          </h2>
          <p className="text-xs text-gray-600 font-medium">
            {customerLocation
              ? `Showing farmers sorted by distance from "${customerLocation.address.slice(0, 35)}..."`
              : "Detect your location above to get exact distance measurements to local Maharashtra farms."}
          </p>
        </div>

        {/* View Switcher: List vs Map */}
        <div className="flex items-center bg-[#EBF4EE] p-1 rounded-2xl border border-[#CDE3D2] shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === "list"
                ? "bg-[#1B4332] text-white shadow-sm"
                : "text-[#1B4332] hover:bg-white/50"
            }`}
          >
            <List className="w-4 h-4" />
            <span>List</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === "map"
                ? "bg-[#1B4332] text-white shadow-sm"
                : "text-[#1B4332] hover:bg-white/50"
            }`}
          >
            <MapIcon className="w-4 h-4 text-amber-300" />
            <span>Google Map</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Interactive Google Map View */}
      {viewMode === "map" && (
        <div className="space-y-3">
          <GoogleMapView
            center={customerCoords}
            zoom={9}
            markers={mapMarkers}
            height="420px"
          />

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-medium flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Tap any green marker on the map to view farm details, price per kg, and exact distance.</span>
          </div>
        </div>
      )}

      {/* Mode 2: Sorted List View */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {nearbyProducts.map((p) => {
            const imgSrc = getCropImage(p.name, p.category, p.image);
            return (
              <Card key={p.id} className="flex flex-col h-full hover:shadow-xl transition-all duration-200 overflow-hidden border border-[#D5E5D8] rounded-3xl bg-white group">
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                      {p.category}
                    </span>

                    {/* Prominent Distance Badge */}
                    <span className="bg-[#1B4332] text-amber-300 text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-emerald-500">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>{formatDistance(p.distanceKm)} away</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h4 className="font-heading text-lg font-black leading-tight">
                      {p.name}
                    </h4>
                    <p className="text-[11px] opacity-90 flex items-center gap-1 mt-0.5">
                      <Sprout className="w-3 h-3 text-amber-300" /> {p.farm} ({p.location})
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

                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      className="bg-[#1B4332] hover:bg-[#122e22] text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
