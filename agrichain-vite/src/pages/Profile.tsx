import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAppContext } from "../context/AppProvider";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ShieldCheck, CheckCircle2, Sprout, MapPin, UserCheck, Loader2, Navigation } from "lucide-react";
import { getCurrentCoordinates, reverseGeocode, getCoordinatesForLocation } from "../lib/location";

export function Profile() {
  const { user, login } = useAppContext();

  const isFarmer = user?.role === "FARMER";

  const [name, setName] = useState(user?.name || (isFarmer ? "Ramesh Patil" : "Sumit Yadav"));
  const [phone, setPhone] = useState(user?.phone || "+91 98200 12345");
  const [location, setLocation] = useState(user?.location || (isFarmer ? "Nashik, Maharashtra" : "Mira-Bhayandar, Maharashtra"));
  const [farmName, setFarmName] = useState(user?.farmName || (isFarmer ? "Patil Organic Stewardship Farm" : ""));

  const [latitude, setLatitude] = useState<number | undefined>(user?.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(user?.longitude);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 4.A & 5. Handle device GPS location detection via navigator.geolocation.getCurrentPosition()
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationStatus("Requesting browser location permission...");

    try {
      const coords = await getCurrentCoordinates();
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);

      setLocationStatus(`✓ Device Location Detected: Lat ${coords.latitude.toFixed(4)}, Long ${coords.longitude.toFixed(4)}`);

      // Reverse geocode coordinates to fill readable location address
      try {
        const addr = await reverseGeocode(coords.latitude, coords.longitude);
        if (addr) {
          setLocation(addr);
        }
      } catch (err) {
        console.warn("Reverse geocoding warning:", err);
      }
    } catch (err: any) {
      setLocationStatus(`❌ ${err?.message || "Location detection failed."}`);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    let finalLat = latitude;
    let finalLng = longitude;

    // 4.B If lat/lng not set by GPS detection, derive from typed address string
    if ((finalLat === undefined || finalLng === undefined) && location) {
      const derived = getCoordinatesForLocation(location);
      if (derived) {
        finalLat = derived.latitude;
        finalLng = derived.longitude;
      }
    }

    const role = user.role || (isFarmer ? "FARMER" : "CUSTOMER");
    const updatedFarmName = isFarmer ? farmName : "";

    const userPayload: Record<string, any> = {
      name,
      phone,
      role,
      location,
      farmName: updatedFarmName,
      updatedAt: new Date().toISOString()
    };

    if (finalLat !== undefined) userPayload.latitude = finalLat;
    if (finalLng !== undefined) userPayload.longitude = finalLng;

    try {
      // 6. Save to users/{user.uid} with { merge: true }
      if (user.id) {
        await setDoc(doc(db, "users", user.id), userPayload, { merge: true });
      }

      // Update AppProvider context state
      login({
        ...user,
        name,
        phone,
        role,
        location,
        latitude: finalLat,
        longitude: finalLng,
        farmName: updatedFarmName
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error("Error saving profile to Firestore:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-4 bg-surface border border-outline p-5 rounded-2xl shadow-sm">
        <div className={`w-14 h-14 ${isFarmer ? "bg-primary text-on-primary" : "bg-secondary text-on-secondary"} rounded-full flex items-center justify-center font-heading text-2xl font-extrabold shadow-inner`}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-extrabold text-primary">{name}</h1>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${isFarmer ? "bg-primary-container text-on-primary-container" : "bg-secondary-container text-on-secondary-container"
              }`}>
              {isFarmer ? "Farmer" : "Customer"}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
            <ShieldCheck className="w-4 h-4 text-verified" /> Verified {isFarmer ? "FARMER" : "CUSTOMER"} Account
          </p>
        </div>
      </div>

      {/* Main Profile Settings Form */}
      <Card className="p-6">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="border-b border-outline pb-3 flex justify-between items-center">
            <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
              {isFarmer ? <Sprout className="w-5 h-5 text-primary" /> : <UserCheck className="w-5 h-5 text-secondary" />}
              {isFarmer ? "Farmer Account & Farm Settings" : "Customer Profile & Delivery Settings"}
            </h3>
          </div>

          <Input
            label={isFarmer ? "Farmer Full Name" : "Customer Full Name"}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <Input
            label="Registered Mobile Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {isFarmer ? "Farm Location / District Address" : "Delivery Residence Address"}
              </label>
              
              {/* 5. "📍 Detect My Location" Button */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-container/40 border border-primary/20 hover:bg-primary-container/70 transition-colors disabled:opacity-50"
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5 text-primary" />
                    📍 Detect My Location
                  </>
                )}
              </button>
            </div>

            <Input
              label=""
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Enter district, city, or full address"
              required
            />

            {/* Display Active Coordinates */}
            <div className="p-3 bg-surface-variant/40 border border-outline rounded-xl flex items-center justify-between text-xs text-on-surface-variant">
              <div>
                <span className="font-bold text-on-surface block">Geographic Coordinates</span>
                {latitude !== undefined && longitude !== undefined ? (
                  <span className="font-mono text-[11px] text-primary font-bold">
                    Latitude: {latitude.toFixed(6)} | Longitude: {longitude.toFixed(6)}
                  </span>
                ) : (
                  <span className="text-[11px] italic text-on-surface-variant">
                    No GPS coordinates captured yet. Click "Detect My Location" above.
                  </span>
                )}
              </div>
            </div>

            {locationStatus && (
              <p className={`text-[11px] font-medium px-1 ${locationStatus.startsWith("✓") ? "text-verified font-bold" : locationStatus.startsWith("❌") ? "text-error font-bold" : "text-primary"}`}>
                {locationStatus}
              </p>
            )}
          </div>

          {isFarmer && (
            <Input
              label="Registered Farm Name"
              value={farmName}
              onChange={e => setFarmName(e.target.value)}
              required
            />
          )}

          {/* Role Summary Badge */}
          <div className="p-4 bg-surface-variant/40 rounded-xl border border-outline flex items-center justify-between text-xs text-on-surface-variant">
            <div>
              <span className="font-bold text-on-surface block">Account Perspective</span>
              <span>Logged in as <strong className="text-primary">{isFarmer ? "Farmer / Grower" : "Consumer / Customer"}</strong></span>
            </div>
            <span className="px-3 py-1 bg-surface border border-outline rounded-full font-bold text-[11px] text-primary">
              Active Mode
            </span>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-verified-bg text-verified text-xs font-bold rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Profile details saved successfully!
            </div>
          )}

          <Button type="submit" className="mt-2" disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Profile...
              </span>
            ) : (
              `Save ${isFarmer ? "Farmer" : "Customer"} Details`
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
