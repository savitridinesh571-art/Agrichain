import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppProvider";
import { MapPin, Navigation, CheckCircle2, AlertCircle, Loader2, Edit3, Save, Compass, Sparkles } from "lucide-react";

interface LocationPickerProps {
  onLocationSelected?: (address: string, lat: number, lng: number) => void;
  className?: string;
}

export function LocationPicker({ onLocationSelected, className = "" }: LocationPickerProps) {
  const {
    customerLocation,
    detectLocation,
    isDetectingLocation,
    locationError,
    setCustomerLocation,
    language,
    t
  } = useAppContext();

  const [isEditingManual, setIsEditingManual] = useState(false);
  const [manualAddressInput, setManualAddressInput] = useState(customerLocation?.address || "");
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (customerLocation?.address) {
      setManualAddressInput(customerLocation.address);
    }
  }, [customerLocation?.address]);

  const handleDetectClick = async () => {
    setSuccessNotice(null);
    const loc = await detectLocation();
    if (loc) {
      setManualAddressInput(loc.address);
      const noticeText =
        language === "mr"
          ? "📍 रिअल-टाईम स्थान शोधले! आपण खालील पत्त्यामध्ये बदल करू शकता."
          : language === "hi"
          ? "📍 रियल-टाइम स्थान खोजा गया! आप नीचे पते में बदलाव कर सकते हैं।"
          : "📍 Real-time location detected! You can edit/customize the address below.";
      setSuccessNotice(noticeText);
      setTimeout(() => setSuccessNotice(null), 5000);

      // Auto open edit mode so user can add flat/wing/landmark details easily
      setIsEditingManual(true);

      if (onLocationSelected) {
        onLocationSelected(loc.address, loc.latitude, loc.longitude);
      }
    }
  };

  const handleSaveManualAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddressInput.trim()) return;

    // Preserve existing real-time GPS coordinates or fallback to default center
    const currentLat = customerLocation?.latitude || 19.2952;
    const currentLng = customerLocation?.longitude || 72.8544;
    const wasDetected = customerLocation?.isDetected ?? false;

    const updatedLoc = {
      latitude: currentLat,
      longitude: currentLng,
      address: manualAddressInput.trim(),
      isDetected: wasDetected,
      detectedAt: new Date().toISOString()
    };

    setCustomerLocation(updatedLoc);
    setIsEditingManual(false);

    const noticeText =
      language === "mr"
        ? "✓ पत्ता अपडेट झाला!"
        : language === "hi"
        ? "✓ पता अपडेट किया गया!"
        : "✓ Delivery address updated!";
    setSuccessNotice(noticeText);
    setTimeout(() => setSuccessNotice(null), 4000);

    if (onLocationSelected) {
      onLocationSelected(updatedLoc.address, updatedLoc.latitude, updatedLoc.longitude);
    }
  };

  return (
    <div className={`bg-white rounded-3xl p-5 border border-[#D5E5D8] shadow-md space-y-4 ${className}`}>
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#EBF4EE] text-[#1B4332] rounded-2xl flex items-center justify-center font-bold shadow-sm">
            <Compass className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base text-[#1B4332]">
              {language === "mr" ? "स्थान आणि डिलिव्हरी पत्ता" : language === "hi" ? "स्थान और डिलीवरी पता" : "Delivery Location"}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {language === "mr"
                ? "जवळचे शेतकरी व ताजे पीक शोधण्यासाठी तुमचे स्थान जोडा."
                : language === "hi"
                ? "निकटतम किसान और ताज़ा उपज खोजने के लिए स्थान जोड़ें।"
                : "Detect location to view nearby organic farms & fair pricing."}
            </p>
          </div>
        </div>

        {customerLocation && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {customerLocation.isDetected ? "GPS Active" : "Manual Address"}
          </span>
        )}
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Location Detection Button Bar */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <button
          type="button"
          onClick={handleDetectClick}
          disabled={isDetectingLocation}
          className={`flex-1 py-3.5 px-5 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2.5 shadow-md ${
            isDetectingLocation
              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
              : "bg-[#1B4332] hover:bg-[#122e22] text-white active:scale-98 cursor-pointer"
          }`}
        >
          {isDetectingLocation ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
              <span>
                {language === "mr" ? "स्थान शोधत आहे..." : language === "hi" ? "स्थान खोज रहे हैं..." : "Detecting Real-Time Location..."}
              </span>
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5 text-amber-300" />
              <span>
                {language === "mr" ? "📍 माझे स्थान शोधा" : language === "hi" ? "📍 मेरा स्थान खोजें" : "📍 Detect My Location"}
              </span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setManualAddressInput(customerLocation?.address || "");
            setIsEditingManual(!isEditingManual);
          }}
          className="px-4 py-3.5 rounded-2xl border-2 border-[#D5E5D8] hover:border-[#1B4332] bg-[#F4F8F4] text-[#1B4332] font-bold text-xs transition flex items-center justify-center gap-2 shrink-0"
        >
          <Edit3 className="w-4 h-4 text-emerald-700" />
          <span>{isEditingManual ? "Cancel Edit" : "Enter Address"}</span>
        </button>
      </div>

      {/* Error Notice */}
      {locationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Currently Detected Address Display Card */}
      {customerLocation && !isEditingManual && (
        <div className="p-4 bg-[#EBF4EE] rounded-2xl border border-[#CDE3D2] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                {language === "mr" ? "सध्याचे स्थान:" : language === "hi" ? "वर्तमान स्थान:" : "Current Location:"}
              </span>
              <p className="text-xs font-extrabold text-[#1B4332] leading-snug">
                {customerLocation.address}
              </p>
              <p className="text-[10px] text-gray-500 font-mono font-medium mt-0.5">
                Coords: {customerLocation.latitude.toFixed(4)}, {customerLocation.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setManualAddressInput(customerLocation.address);
              setIsEditingManual(true);
            }}
            className="p-2 bg-white hover:bg-emerald-100 rounded-xl text-emerald-800 border border-[#D5E5D8] transition shrink-0 flex items-center gap-1 text-xs font-bold shadow-xs"
            title="Edit Address"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
      )}

      {/* Editable Address Input Form (Auto-opened on location detection or when edit is clicked) */}
      {isEditingManual && (
        <form onSubmit={handleSaveManualAddress} className="space-y-3 pt-3 border-t border-gray-100 bg-[#F4F8F4] p-4 rounded-2xl border border-[#D5E5D8]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-800">
                {language === "mr" ? "डिलिव्हरी पत्ता बदला किंवा पूर्ण करा:" : language === "hi" ? "डिलीवरी पता बदलें या पूरा करें:" : "Delivery Address (Editable):"}
              </label>
              {customerLocation?.isDetected && (
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> GPS Coords Preserved
                </span>
              )}
            </div>
            
            <textarea
              rows={2}
              value={manualAddressInput}
              onChange={(e) => setManualAddressInput(e.target.value)}
              placeholder="e.g. Flat 402, Sunshine Heights, Main Street, Thane"
              className="w-full bg-white border border-[#D5E5D8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-[#1B4332] shadow-xs"
              required
            />
            <p className="text-[11px] text-gray-500 font-medium mt-1">
              💡 Real-time location auto-filled this address. You can add your flat number, wing, street, or landmark above.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingManual(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#1B4332] hover:bg-[#122e22] text-white text-xs font-black px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition active:scale-98"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>Save & Update Address</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}

