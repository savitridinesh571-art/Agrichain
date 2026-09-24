import React, { useEffect, useState } from "react";
import { GoogleMapView, type MapMarker } from "./GoogleMapView";
import { calculateDirectionsRoute, type MapRouteResult } from "../lib/maps";
import { calculateDistanceKm, formatDistance, getCoordinatesForLocation } from "../lib/location";
import { Truck, MapPin, Clock, Navigation, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import type { Order } from "../context/AppProvider";

interface DeliveryRouteProps {
  order?: Order;
  customerCoords?: { lat: number; lng: number; address?: string };
  farmerCoords?: { lat: number; lng: number; farmName?: string };
  className?: string;
}

export function DeliveryRoute({
  order,
  customerCoords: customCustomerCoords,
  farmerCoords: customFarmerCoords,
  className = ""
}: DeliveryRouteProps) {
  // Derive customer coordinates
  const customerLat = order?.customerLatitude || customCustomerCoords?.lat || 19.2952;
  const customerLng = order?.customerLongitude || customCustomerCoords?.lng || 72.8544;
  const customerAddress = order?.deliveryAddress || customCustomerCoords?.address || "Customer Address";

  // Derive farmer coordinates (default to Nashik farm if missing)
  const farmerLat = order?.farmerLatitude || customFarmerCoords?.lat || 20.0059;
  const farmerLng = order?.farmerLongitude || customFarmerCoords?.lng || 73.7898;
  const farmerName = customFarmerCoords?.farmName || "Nashik Organic Farmer Hub";

  const [routeData, setRouteData] = useState<MapRouteResult | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Fallback Haversine distance
  const haversineDistKm = calculateDistanceKm(farmerLat, farmerLng, customerLat, customerLng);

  useEffect(() => {
    let isMounted = true;
    async function fetchDirections() {
      try {
        setLoadingRoute(true);
        const result = await calculateDirectionsRoute(
          { lat: farmerLat, lng: farmerLng },
          { lat: customerLat, lng: customerLng }
        );
        if (isMounted) {
          setRouteData(result);
          setLoadingRoute(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoadingRoute(false);
        }
      }
    }

    fetchDirections();

    return () => {
      isMounted = false;
    };
  }, [farmerLat, farmerLng, customerLat, customerLng]);

  const mapMarkers: MapMarker[] = [
    {
      id: "farmer-origin",
      lat: farmerLat,
      lng: farmerLng,
      title: farmerName,
      subtitle: "Harvest & Packing Origin",
      type: "farmer",
      distanceKm: haversineDistKm
    },
    {
      id: "customer-destination",
      lat: customerLat,
      lng: customerLng,
      title: "Delivery Address",
      subtitle: customerAddress,
      type: "customer"
    }
  ];

  const mapCenter = {
    lat: (farmerLat + customerLat) / 2,
    lng: (farmerLng + customerLng) / 2
  };

  return (
    <div className={`bg-white rounded-3xl p-5 border border-[#D5E5D8] shadow-md space-y-4 ${className}`}>
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1B4332] text-amber-300 rounded-2xl flex items-center justify-center font-bold shadow-md">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base text-[#1B4332]">
              Live Delivery Route & Logistics
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Direct farm-to-home transit monitoring path.
            </p>
          </div>
        </div>

        {order?.status && (
          <span className={`text-xs font-black px-3 py-1 rounded-full ${
            order.status === "Delivered" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-900 border border-amber-300"
          }`}>
            Status: {order.status}
          </span>
        )}
      </div>

      {/* Logistics Route Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-[#EBF4EE] p-3 rounded-2xl border border-[#CDE3D2]">
          <span className="text-[10px] text-gray-500 font-bold uppercase block flex items-center gap-1">
            <Navigation className="w-3 h-3 text-emerald-700" /> Total Distance
          </span>
          <span className="font-heading font-black text-lg text-[#1B4332]">
            {routeData?.distanceText || formatDistance(haversineDistKm)}
          </span>
        </div>

        <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
          <span className="text-[10px] text-amber-800 font-bold uppercase block flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" /> Est. Transit Time
          </span>
          <span className="font-heading font-black text-lg text-amber-900">
            {routeData?.durationText || `${Math.round(haversineDistKm * 2)} mins`}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
          <span className="text-[10px] text-emerald-800 font-bold uppercase block flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-700" /> Cold-Chain Transit
          </span>
          <span className="font-heading font-bold text-xs text-emerald-900 block mt-1">
            Verified Fresh Dispatch
          </span>
        </div>
      </div>

      {/* Map Rendering with Route */}
      <GoogleMapView
        center={mapCenter}
        zoom={9}
        markers={mapMarkers}
        showRoute={true}
        origin={{ lat: farmerLat, lng: farmerLng }}
        destination={{ lat: customerLat, lng: customerLng }}
        height="350px"
      />

      {/* Route Steps Preview if available */}
      {routeData?.steps && routeData.steps.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <h4 className="text-xs font-black text-[#1B4332] uppercase tracking-wide flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Route Navigation Steps
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
            {routeData.steps.slice(0, 4).map((step, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded-xl text-[11px] text-gray-700 font-medium flex items-center gap-2 border border-gray-200">
                <span className="w-4 h-4 rounded-full bg-[#1B4332] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
