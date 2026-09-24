import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { getCropImage } from "../../utils/cropImages";

const VEGETABLE_OPTIONS = [
  { label: "Tomato / टोमॅटो", name: "Tomato", local: "टोमॅटो", cat: "Vegetables" },
  { label: "Onion / कांदा", name: "Onion", local: "कांदा", cat: "Vegetables" },
  { label: "Green Chili / मिरची", name: "Green Chili", local: "मिरची", cat: "Vegetables" },
  { label: "Potato / बटाटा (आलू)", name: "Potato", local: "बटाटा", cat: "Vegetables" },
  { label: "Cabbage / कोबी", name: "Cabbage", local: "कोबी", cat: "Vegetables" },
  { label: "Cauliflower / फ्लॉवर", name: "Cauliflower", local: "फ्लॉवर", cat: "Vegetables" },
  { label: "Carrot / गाजर", name: "Carrot", local: "गाजर", cat: "Vegetables" },
  { label: "Radish / मुळा", name: "Radish", local: "मुळा", cat: "Vegetables" },
  { label: "Beetroot / बीट", name: "Beetroot", local: "बीट", cat: "Vegetables" },
  { label: "Spinach / पालक", name: "Spinach", local: "पालक", cat: "Vegetables" },
  { label: "Coriander / कोथिंबीर", name: "Coriander", local: "कोथिंबीर", cat: "Vegetables" },
  { label: "Fenugreek (Methi) / मेथी", name: "Fenugreek (Methi)", local: "मेथी", cat: "Vegetables" },
  { label: "Green Peas / मटार", name: "Green Peas", local: "मटार", cat: "Vegetables" },
  { label: "Capsicum / ढोबळी मिरची", name: "Capsicum", local: "ढोबळी मिरची", cat: "Vegetables" },
  { label: "Lady Finger (Okra/Bhindi) / भेंडी", name: "Lady Finger", local: "भेंडी", cat: "Vegetables" },
  { label: "Cucumber / काकडी", name: "Cucumber", local: "काकडी", cat: "Vegetables" },
  { label: "Bottle Gourd (Lauki) / दुधी भोपळा", name: "Bottle Gourd", local: "दुधी भोपळा", cat: "Vegetables" },
  { label: "Bitter Gourd (Karela) / कारले", name: "Bitter Gourd", local: "कारले", cat: "Vegetables" },
  { label: "Ridge Gourd (Turai) / शिराळी", name: "Ridge Gourd", local: "शिराळी", cat: "Vegetables" },
];

const FRUIT_OPTIONS = [
  { label: "Alphonsa Mango / हापूस आंबा", name: "Alphonsa Mangoes", local: "हापूस आंबा", cat: "Fruits" },
  { label: "Apple / सफरचंद", name: "Apple", local: "सफरचंद", cat: "Fruits" },
  { label: "Banana / केळी", name: "Banana", local: "केळी", cat: "Fruits" },
  { label: "Orange / संत्री", name: "Orange", local: "संत्री", cat: "Fruits" },
  { label: "Grapes / द्राक्षे", name: "Grapes", local: "द्राक्षे", cat: "Fruits" },
  { label: "Papaya / पपई", name: "Papaya", local: "पपई", cat: "Fruits" },
  { label: "Watermelon / कलिंगड", name: "Watermelon", local: "कलिंगड", cat: "Fruits" },
  { label: "Muskmelon / टरबूज", name: "Muskmelon", local: "टरबूज", cat: "Fruits" },
  { label: "Guava / पेरू", name: "Guava", local: "पेरू", cat: "Fruits" },
  { label: "Pomegranate / डाळिंब", name: "Pomegranate", local: "डाळिंब", cat: "Fruits" },
  { label: "Pineapple / अननस", name: "Pineapple", local: "अननस", cat: "Fruits" },
  { label: "Strawberry / स्ट्रॉबेरी", name: "Strawberry", local: "स्ट्रॉबेरी", cat: "Fruits" },
  { label: "Chikoo (Sapota) / चिकू", name: "Chikoo", local: "चिकू", cat: "Fruits" },
  { label: "Custard Apple (Sitaphal) / सीताफळ", name: "Custard Apple", local: "सीताफळ", cat: "Fruits" },
];

const GRAIN_OPTIONS = [
  { label: "Rice / तांदूळ (चावल)", name: "Rice", local: "तांदूळ", cat: "Grains" },
  { label: "Indrayani Rice / तांदूळ", name: "Indrayani Rice", local: "तांदूळ", cat: "Grains" },
  { label: "Wheat / गहू (गेहूं)", name: "Wheat", local: "गहू", cat: "Grains" },
  { label: "Sharbati Wheat / Sharbati गहू", name: "Sharbati Wheat", local: "गहू", cat: "Grains" },
  { label: "Maize (Corn) / मका", name: "Maize (Corn)", local: "मका", cat: "Grains" },
  { label: "Barley / जव (जौ)", name: "Organic Barley", local: "जव", cat: "Grains" },
  { label: "Jowar (Sorghum) / ज्वारी", name: "Jowar (Sorghum)", local: "ज्वारी", cat: "Grains" },
  { label: "Bajra (Pearl Millet) / बाजरी", name: "Bajra (Pearl Millet)", local: "बाजरी", cat: "Grains" },
  { label: "Ragi (Finger Millet) / नाचणी", name: "Ragi (Finger Millet)", local: "नाचणी", cat: "Grains" },
  { label: "Foxtail Millet / राळा (कंगनी)", name: "Foxtail Millet", local: "राळा", cat: "Grains" },
  { label: "Little Millet / वरी (कुटकी)", name: "Little Millet", local: "वरी", cat: "Grains" },
  { label: "Kodo Millet / कोद्रा (कोदो)", name: "Kodo Millet", local: "कोद्रा", cat: "Grains" },
  { label: "Barnyard Millet / भगर (सावां)", name: "Barnyard Millet (Bhagar)", local: "भगर", cat: "Grains" },
  { label: "Proso Millet / वरई (चेना)", name: "Proso Millet", local: "वरई", cat: "Grains" },
  { label: "Oats / ओट्स (जई)", name: "Rolled Oats", local: "ओट्स", cat: "Grains" },
  { label: "Quinoa / क्विनोआ", name: "Organic Quinoa", local: "क्विनोआ", cat: "Grains" },
  { label: "Amaranth (Rajgira) / राजगिरा", name: "Amaranth (Rajgira)", local: "राजगिरा", cat: "Grains" },
];

const PULSE_OPTIONS = [
  { label: "Toor Dal / Arhar / तूर डाळ", name: "Toor Dal / Arhar", local: "तूर डाळ", cat: "Pulses" },
  { label: "Moong Dal (Green Gram) / मूग डाळ", name: "Moong Dal (Green Gram)", local: "मूग डाळ", cat: "Pulses" },
  { label: "Urad Dal (Black Gram) / उडीद डाळ", name: "Urad Dal (Black Gram)", local: "उडीद डाळ", cat: "Pulses" },
  { label: "Chana / Chickpea / हरभरा (चना)", name: "Chana / Chickpea", local: "हरभरा", cat: "Pulses" },
  { label: "Masoor Dal (Red Lentil) / मसूर डाळ", name: "Masoor Dal (Red Lentil)", local: "मसूर डाळ", cat: "Pulses" },
  { label: "Rajma (Kidney Beans) / राजमा", name: "Rajma (Kidney Beans)", local: "राजमा", cat: "Pulses" },
  { label: "Kabuli Chana / काबुली चणा", name: "Kabuli Chana", local: "काबुली चणा", cat: "Pulses" },
  { label: "Black Chickpea (Kala Chana) / काळा चणा", name: "Black Chickpea (Kala Chana)", local: "काळा चणा", cat: "Pulses" },
  { label: "Matar / Dried Peas / वाटाणा (मटर)", name: "Matar / Dried Peas", local: "वाटाणा", cat: "Pulses" },
  { label: "Lobia (Black-eyed Peas) / चवळी (लोबिया)", name: "Lobia (Black-eyed Peas)", local: "चवळी", cat: "Pulses" },
  { label: "Kulith / Horse Gram / कुळीथ", name: "Kulith / Horse Gram", local: "कुळीथ", cat: "Pulses" },
  { label: "Moth Beans / मटकी", name: "Moth Beans", local: "मटकी", cat: "Pulses" },
  { label: "Soybean / सोयाबीन", name: "Organic Soybean", local: "सोयाबीन", cat: "Pulses" },
  { label: "Cowpea / चवळी", name: "Cowpea", local: "चवळी", cat: "Pulses" },
  { label: "Green Peas / मटार", name: "Green Peas", local: "मटार", cat: "Pulses" },
  { label: "Field Beans (Val) / वाल", name: "Field Beans (Val)", local: "वाल", cat: "Pulses" },
  { label: "Pigeon Peas / तुरीची डाळ", name: "Pigeon Peas", local: "तुरीची डाळ", cat: "Pulses" },
  { label: "Whole Lentils / मसूर", name: "Whole Lentils", local: "मसूर", cat: "Pulses" },
];

const MAHARASHTRA_DISTRICTS = [
  { name: "Nashik, Maharashtra", lat: 20.0059, lng: 73.7898 },
  { name: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Satara, Maharashtra", lat: 17.6805, lng: 74.0183 },
  { name: "Solapur, Maharashtra", lat: 17.6599, lng: 75.9064 },
  { name: "Ratnagiri, Maharashtra", lat: 16.9902, lng: 73.312 },
  { name: "Kolhapur, Maharashtra", lat: 16.705, lng: 74.2433 },
  { name: "Nagpur, Maharashtra", lat: 21.1458, lng: 79.0882 },
  { name: "Ahmednagar, Maharashtra", lat: 19.0948, lng: 74.748 },
  { name: "Aurangabad, Maharashtra", lat: 19.8762, lng: 75.3433 },
  { name: "Sangli, Maharashtra", lat: 16.8524, lng: 74.5815 },
  { name: "Mira-Bhayandar, Maharashtra", lat: 19.2952, lng: 72.8544 }
];

export function AddProduct() {
  const { user, addProduct } = useAppContext();
  const navigate = useNavigate();

  const [selectedCropLabel, setSelectedCropLabel] = useState(VEGETABLE_OPTIONS[0].label);
  const [qty, setQty] = useState("50");
  const [price, setPrice] = useState("30");
  const [unit, setUnit] = useState("kg");
  const [farmLocation, setFarmLocation] = useState(user?.location || MAHARASHTRA_DISTRICTS[0].name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allOptions = [...VEGETABLE_OPTIONS, ...FRUIT_OPTIONS, ...GRAIN_OPTIONS, ...PULSE_OPTIONS];
    const cropObj = allOptions.find(o => o.label === selectedCropLabel) || {
      name: selectedCropLabel.split("/")[0].trim(),
      local: selectedCropLabel.includes("/") ? selectedCropLabel.split("/")[1].trim() : "",
      cat: "Vegetables"
    };

    const distObj = MAHARASHTRA_DISTRICTS.find(d => d.name === farmLocation) || MAHARASHTRA_DISTRICTS[0];

    addProduct({
      name: cropObj.name,
      localName: cropObj.local,
      category: cropObj.cat,
      price: parseInt(price) || 0,
      unit: unit,
      quantity: parseInt(qty) || 0,
      farm: user?.farmName || "Local Steward Farm",
      farmerId: user?.id,
      location: farmLocation,
      latitude: distObj.lat,
      longitude: distObj.lng,
      verified: true,
      grade: "Grade A",
      harvestDate: new Date().toISOString().split("T")[0],
      description: `Farm-fresh ${cropObj.name} directly harvested under AgriChain certified fair-trade standards.`,
      image: getCropImage(cropObj.name, cropObj.cat),
      soilAuditStatus: "Approved"
    });
    navigate("/farmer");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-primary mb-6">List Harvest Yield</h1>
      
      <Card className="p-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Select Crop / Produce</label>
            <select 
              value={selectedCropLabel} 
              onChange={e => setSelectedCropLabel(e.target.value)}
              className="w-full h-12 border-1.5 border-outline-variant rounded-md px-3 text-on-surface bg-surface font-medium"
            >
              <optgroup label="🥦 Vegetables (भाज्या)">
                {VEGETABLE_OPTIONS.map(v => (
                  <option key={v.label} value={v.label}>{v.label}</option>
                ))}
              </optgroup>
              <optgroup label="🍎 Fruits (फळे)">
                {FRUIT_OPTIONS.map(f => (
                  <option key={f.label} value={f.label}>{f.label}</option>
                ))}
              </optgroup>
              <optgroup label="🌾 Grains (धान्य)">
                {GRAIN_OPTIONS.map(g => (
                  <option key={g.label} value={g.label}>{g.label}</option>
                ))}
              </optgroup>
              <optgroup label="🫘 Pulses & Legumes (कठधान्ये / डाळी)">
                {PULSE_OPTIONS.map(p => (
                  <option key={p.label} value={p.label}>{p.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantity" type="number" value={qty} onChange={e => setQty(e.target.value)} required />
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">Unit</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full h-12 border-1.5 border-outline-variant rounded-md px-3 text-on-surface bg-surface font-medium"
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="dozen">dozen</option>
                <option value="quintal">quintal</option>
                <option value="box">box</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Farm Location (GPS District)</label>
            <select
              value={farmLocation}
              onChange={e => setFarmLocation(e.target.value)}
              className="w-full h-12 border-1.5 border-outline-variant rounded-md px-3 text-on-surface bg-surface font-medium"
            >
              {MAHARASHTRA_DISTRICTS.map(d => (
                <option key={d.name} value={d.name}>
                  📍 {d.name} ({d.lat.toFixed(2)}, {d.lng.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <Input label="Desired Price (₹)" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
          
          <div className="bg-review-bg text-review border border-review rounded-md p-3 text-sm mt-2">
            <strong>Smart Audit:</strong> Based on live APMC mandi rates, fair market listing is certified automatically with living soil bonus.
          </div>

          <Button type="submit" className="mt-4">Publish Listing</Button>
        </form>
      </Card>
    </div>
  );
}
