import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { CheckCircle2, ShieldCheck, MapPin, Calendar, Award, ArrowLeft, ShoppingBag, Truck } from "lucide-react";
import { getCropImage } from "../../utils/cropImages";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useAppContext();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-bold text-primary mb-2">Product Not Found</h2>
        <Link to="/" className="text-secondary font-bold underline">Return to Marketplace</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate("/cart");
  };

  const imgSrc = getCropImage(product.name, product.category, product.image);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <Card className="p-0 overflow-hidden flex flex-col gap-0 border border-outline rounded-3xl shadow-md">
        {/* Name-wise Crop Banner Image */}
        <div className="relative h-64 md:h-80 w-full bg-gray-100 overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {product.category}
              </span>
              {product.verified && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fair Price Verified
                </span>
              )}
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold drop-shadow-md">
              {product.name} {product.localName && <span className="text-xl font-normal opacity-90">({product.localName})</span>}
            </h1>
            <p className="text-sm flex items-center gap-1.5 mt-1 opacity-90 font-medium drop-shadow-sm">
              <MapPin className="w-4 h-4 text-amber-300" /> {product.location}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Price Header */}
          <div className="flex justify-between items-center border-b border-outline pb-4">
            <div>
              <span className="text-xs text-on-surface-variant block font-bold uppercase tracking-wider">Direct Farm Rate</span>
              <span className="font-heading text-4xl font-black text-[#1B4332]">₹{product.price}</span>
              <span className="text-sm text-on-surface-variant font-semibold"> / {product.unit}</span>
            </div>
            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
                Stock: {product.quantity} {product.unit}
              </span>
            </div>
          </div>

        {/* Description */}
        <div>
          <h3 className="font-heading font-bold text-lg text-primary mb-2">Crop Provenance & Quality</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Audit Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-variant p-4 rounded-xl text-sm">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <span className="text-xs text-on-surface-variant block">Quality Grade</span>
              <strong className="font-bold">{product.grade}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-secondary flex-shrink-0" />
            <div>
              <span className="text-xs text-on-surface-variant block">Harvest Date</span>
              <strong className="font-bold">{product.harvestDate}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-verified flex-shrink-0" />
            <div>
              <span className="text-xs text-on-surface-variant block">Soil Audit</span>
              <strong className="font-bold text-verified">{product.soilAuditStatus}</strong>
            </div>
          </div>
        </div>

        {/* Farmer Information Box */}
        <div className="bg-surface border border-outline rounded-xl p-4 flex justify-between items-center">
          <div>
            <span className="text-xs text-on-surface-variant block">Direct Farm Source</span>
            <h4 className="font-bold text-base text-primary">{product.farm}</h4>
            <p className="text-xs text-on-surface-variant">{product.location}</p>
          </div>
          <div className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
            Stewardship Certified
          </div>
        </div>

        {/* Add to Cart Actions */}
        <div className="pt-4 border-t border-outline flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center border border-outline rounded-md overflow-hidden bg-surface">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 py-2 text-lg font-bold hover:bg-surface-variant"
            >
              -
            </button>
            <span className="px-4 font-bold text-sm">{qty} {product.unit}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="px-3 py-2 text-lg font-bold hover:bg-surface-variant"
            >
              +
            </button>
          </div>

          <Button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" /> Buy Direct — ₹{product.price * qty}
          </Button>
        </div>

        <div className="text-xs text-center text-on-surface-variant flex items-center justify-center gap-2 pt-2">
          <Truck className="w-4 h-4 text-secondary" /> Direct farm dispatch within 24 hours of harvest locking.
        </div>
        </div>
      </Card>
    </div>
  );
}
