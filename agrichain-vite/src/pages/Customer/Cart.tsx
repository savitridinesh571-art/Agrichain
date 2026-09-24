import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { 
  Trash2, ShoppingBag, ArrowLeft, ShieldCheck, MapPin, QrCode, 
  CreditCard, Smartphone, Building2, Banknote, CheckCircle2, 
  Loader2, Lock, Check, Sparkles, AlertCircle, Navigation
} from "lucide-react";
import { getCropImage } from "../../utils/cropImages";

type CheckoutStep = "CART" | "PAYMENT";
type PaymentMethod = "UPI" | "CARD" | "NET_BANKING" | "COD" | "ESCROW";

export function Cart() {
  const { cart, updateCartQuantity, removeFromCart, placeOrder, user, customerLocation, setCustomerLocation } = useAppContext();
  const navigate = useNavigate();

  // Checkout Flow Step State
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("CART");

  // Delivery Details State - dynamically initialized from real-time customerLocation or user profile
  const [address, setAddress] = useState(
    customerLocation?.address || user?.location || "Flat 402, Green Meadows, Mira Road, Maharashtra"
  );
  const [phone, setPhone] = useState(user?.phone || "+91 81020 55722");
  const [addressError, setAddressError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Sync address state automatically whenever customerLocation or user location changes
  useEffect(() => {
    if (customerLocation?.address) {
      setAddress(customerLocation.address);
    } else if (user?.location) {
      setAddress(user.location);
    }
  }, [customerLocation?.address, user?.location]);

  // Payment Option States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("GPay");
  const [customUpiId, setCustomUpiId] = useState("");
  const [upiIdError, setUpiIdError] = useState<string | null>(null);

  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  // Net Banking state
  const [selectedBank, setSelectedBank] = useState("SBI");

  // Processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 20 : 0;
  const total = subtotal + deliveryFee;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || address.trim().length < 5) {
      setAddressError("Please enter a valid delivery address.");
      return;
    }
    setAddressError(null);

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setPhoneError("Please enter a valid 10-digit contact number.");
      return;
    }
    setPhoneError(null);

    setCheckoutStep("PAYMENT");
  };

  const handleFinalPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMethod === "UPI" && customUpiId.trim()) {
      if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(customUpiId.trim())) {
        setUpiIdError("Please enter a valid UPI ID (e.g. name@upi)");
        return;
      }
    }
    setUpiIdError(null);

    setIsProcessingPayment(true);

    // Simulate realistic payment gateway authorization delay
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      const payMethodLabel = 
        paymentMethod === "UPI" ? `UPI (${selectedUpiApp})` :
        paymentMethod === "CARD" ? "Credit/Debit Card" :
        paymentMethod === "NET_BANKING" ? `Net Banking (${selectedBank})` :
        paymentMethod === "COD" ? "Cash on Delivery" : "AgriChain Escrow";

      const payStatusLabel = paymentMethod === "COD" ? "Cash on Delivery" : "Paid";

      setTimeout(() => {
        placeOrder(address, phone, payMethodLabel, payStatusLabel);
        navigate("/orders");
      }, 1200);
    }, 1800);
  };

  if (cart.length === 0 && checkoutStep === "CART") {
    return (
      <div className="py-12 text-center max-w-md mx-auto">
        <Card className="p-8 flex flex-col items-center gap-4 border-[#D5E5D8]">
          <ShoppingBag className="w-16 h-16 text-[#1B4332] opacity-40" />
          <h2 className="font-heading text-2xl font-bold text-[#1B4332]">Your Cart is Empty</h2>
          <p className="text-sm text-gray-600">
            Explore live farm produce and place orders directly with rural growers.
          </p>
          <Link to="/">
            <Button className="mt-2 bg-[#1B4332] text-white">Browse Marketplace</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12 font-sans">
      
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        {checkoutStep === "PAYMENT" ? (
          <button
            type="button"
            onClick={() => setCheckoutStep("CART")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1B4332] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </button>
        ) : (
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1B4332] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        )}

        {/* Progress Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`px-2.5 py-1 rounded-full ${checkoutStep === "CART" ? "bg-[#1B4332] text-white" : "bg-emerald-100 text-emerald-800"}`}>
            1. Review Cart
          </span>
          <span className="text-gray-400">→</span>
          <span className={`px-2.5 py-1 rounded-full ${checkoutStep === "PAYMENT" ? "bg-[#1B4332] text-white" : "bg-gray-100 text-gray-500"}`}>
            2. Payment Options
          </span>
        </div>
      </div>

      <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-[#1B4332]">
        {checkoutStep === "CART" ? `Direct Harvest Cart (${cart.length})` : "Select Payment Method"}
      </h1>

      {/* STEP 1: CART REVIEW */}
      {checkoutStep === "CART" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Cart Items List */}
          <div className="md:col-span-2 space-y-4">
            {cart.map(item => {
              const imgSrc = getCropImage(item.product.name, item.product.category, item.product.image);
              return (
                <Card key={item.product.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-[#D5E5D8]">
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={imgSrc}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#D5E5D8] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#1B4332]">{item.product.name}</h3>
                        <span className="text-xs text-gray-600 font-medium">({item.product.farm})</span>
                      </div>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5 font-medium">
                        <MapPin className="w-3 h-3 text-amber-600" /> {item.product.location}
                      </p>
                      <p className="text-sm font-extrabold text-[#1B4332] mt-1">
                        ₹{item.product.price} / {item.product.unit}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Remove controls */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-[#D5E5D8] rounded-xl overflow-hidden bg-[#F4F8F4]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-sm font-bold text-[#1B4332] hover:bg-[#EBF4EE]"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-xs text-[#1B4332]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-sm font-bold text-[#1B4332] hover:bg-[#EBF4EE]"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-heading font-extrabold text-base text-[#1B4332] min-w-[70px] text-right">
                      ₹{item.product.price * item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Checkout Summary Card */}
          <div>
            <Card className="p-5 flex flex-col gap-4 sticky top-20 border-[#D5E5D8] shadow-md">
              <h3 className="font-heading font-bold text-lg text-[#1B4332] border-b border-gray-100 pb-2">
                Order Summary
              </h3>

              <form onSubmit={handleProceedToPayment} className="flex flex-col gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">Delivery Address *</label>
                    {customerLocation?.address && (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-700" /> GPS Synced
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => {
                      const val = e.target.value;
                      setAddress(val);
                      if (customerLocation) {
                        setCustomerLocation({
                          ...customerLocation,
                          address: val
                        });
                      }
                    }}
                    className="w-full bg-[#EBF4EE]/50 border border-[#D5E5D8] rounded-xl p-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    placeholder="Enter complete delivery address"
                    required
                  />
                  {addressError && <p className="text-[11px] text-red-600 font-bold mt-0.5">{addressError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#EBF4EE]/50 border border-[#D5E5D8] rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    required
                  />
                  {phoneError && <p className="text-[11px] text-red-600 font-bold mt-0.5">{phoneError}</p>}
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100 font-medium">
                  <div className="flex justify-between">
                    <span>Harvest Subtotal</span>
                    <span className="font-bold text-gray-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Farm Dispatch Fee</span>
                    <span className="font-bold text-gray-900">₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#1B4332] pt-2 border-t border-gray-200">
                    <span>Total Payable</span>
                    <span className="font-heading text-lg text-[#1B4332]">₹{total}</span>
                  </div>
                </div>

                <Button type="submit" className="mt-2 bg-[#1B4332] hover:bg-[#122e22] text-white py-3 rounded-xl font-bold shadow-md">
                  Proceed to Payment (₹{total})
                </Button>
              </form>

              <p className="text-[11px] text-center text-emerald-800 font-bold flex items-center justify-center gap-1 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Fair Price Audit Guarantee Applied
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* STEP 2: PAYMENT OPTIONS SELECTION */}
      {checkoutStep === "PAYMENT" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Payment Method Selector & Inputs */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Payment Method Tabs */}
            <Card className="p-4 border-[#D5E5D8]">
              <label className="block text-xs font-bold text-gray-700 mb-3">Choose Payment Method / देयक पद्धत निवडा</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                
                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition ${
                    paymentMethod === "UPI"
                      ? "border-[#1B4332] bg-emerald-50/50 shadow-sm ring-2 ring-[#1B4332]/20"
                      : "border-[#D5E5D8] bg-[#F4F8F4] hover:bg-[#EBF4EE]"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#1B4332]" />
                  <span className="text-xs font-extrabold text-[#1B4332]">UPI / QR</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded-full">Instant</span>
                </button>

                {/* Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition ${
                    paymentMethod === "CARD"
                      ? "border-[#1B4332] bg-emerald-50/50 shadow-sm ring-2 ring-[#1B4332]/20"
                      : "border-[#D5E5D8] bg-[#F4F8F4] hover:bg-[#EBF4EE]"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-700" />
                  <span className="text-xs font-extrabold text-[#1B4332]">Cards</span>
                  <span className="text-[10px] text-gray-500 font-medium">Credit/Debit</span>
                </button>

                {/* Net Banking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("NET_BANKING")}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition ${
                    paymentMethod === "NET_BANKING"
                      ? "border-[#1B4332] bg-emerald-50/50 shadow-sm ring-2 ring-[#1B4332]/20"
                      : "border-[#D5E5D8] bg-[#F4F8F4] hover:bg-[#EBF4EE]"
                  }`}
                >
                  <Building2 className="w-5 h-5 text-amber-700" />
                  <span className="text-xs font-extrabold text-[#1B4332]">NetBanking</span>
                  <span className="text-[10px] text-gray-500 font-medium">All Banks</span>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition ${
                    paymentMethod === "COD"
                      ? "border-[#1B4332] bg-emerald-50/50 shadow-sm ring-2 ring-[#1B4332]/20"
                      : "border-[#D5E5D8] bg-[#F4F8F4] hover:bg-[#EBF4EE]"
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs font-extrabold text-[#1B4332]">COD</span>
                  <span className="text-[10px] text-gray-500 font-medium">Pay on Delivery</span>
                </button>

                {/* AgriChain ESCROW */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ESCROW")}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition ${
                    paymentMethod === "ESCROW"
                      ? "border-[#1B4332] bg-emerald-50/50 shadow-sm ring-2 ring-[#1B4332]/20"
                      : "border-[#D5E5D8] bg-[#F4F8F4] hover:bg-[#EBF4EE]"
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-extrabold text-[#1B4332]">Escrow</span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded-full">0% Fee</span>
                </button>
              </div>
            </Card>

            {/* TAB 1: UPI / QR PAYMENT DETAILS */}
            {paymentMethod === "UPI" && (
              <Card className="p-5 border-[#D5E5D8] flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-[#1B4332] text-base flex items-center gap-1.5">
                      <Smartphone className="w-5 h-5 text-emerald-700" />
                      <span>Instant UPI Payment</span>
                    </h3>
                    <p className="text-xs text-gray-600 font-medium">Pay via GPay, PhonePe, Paytm or scan QR Code</p>
                  </div>
                  <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Zero Extra Fee
                  </span>
                </div>

                {/* Popular UPI Apps selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Select UPI Application</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "GPay", label: "Google Pay", color: "bg-blue-50 text-blue-700 border-blue-200" },
                      { id: "PhonePe", label: "PhonePe", color: "bg-purple-50 text-purple-700 border-purple-200" },
                      { id: "Paytm", label: "Paytm UPI", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
                      { id: "BHIM", label: "BHIM UPI", color: "bg-orange-50 text-orange-700 border-orange-200" },
                    ].map(app => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id)}
                        className={`p-2.5 rounded-xl border text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                          selectedUpiApp === app.id ? `${app.color} ring-2 ring-emerald-600 shadow-sm` : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {selectedUpiApp === app.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                        <span>{app.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Interactive QR Code Display */}
                <div className="bg-[#F4F8F4] border border-[#CDE3D2] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl border border-[#D5E5D8] flex flex-col items-center justify-center shadow-sm relative shrink-0">
                    <QrCode className="w-20 h-20 text-[#1B4332]" />
                    <span className="text-[9px] font-extrabold text-[#1B4332] bg-amber-200 px-1.5 py-0.5 rounded mt-0.5">SCAN & PAY</span>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-xs font-bold text-gray-600">Scan QR Code using any UPI App</div>
                    <div className="text-lg font-extrabold text-[#1B4332]">Payable: ₹{total}</div>
                    <div className="text-[11px] text-gray-500 font-mono">UPI ID: agrichain.harvest@sbi</div>
                    <div className="text-[11px] text-emerald-800 font-semibold flex items-center justify-center sm:justify-start gap-1 pt-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Instant Payment Confirmation
                    </div>
                  </div>
                </div>

                {/* Or enter custom UPI VPA ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">OR Enter your VPA / UPI ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customUpiId}
                      onChange={e => {
                        setCustomUpiId(e.target.value);
                        if (upiIdError) setUpiIdError(null);
                      }}
                      placeholder="e.g. 8102055722@ybl or sumit@oksbi"
                      className="w-full bg-[#EBF4EE]/50 border border-[#D5E5D8] rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    />
                  </div>
                  {upiIdError && <p className="text-[11px] text-red-600 font-bold mt-1">{upiIdError}</p>}
                </div>
              </Card>
            )}

            {/* TAB 2: CREDIT / DEBIT CARD DETAILS */}
            {paymentMethod === "CARD" && (
              <Card className="p-5 border-[#D5E5D8] flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-extrabold text-[#1B4332] text-base flex items-center gap-1.5">
                    <CreditCard className="w-5 h-5 text-indigo-700" />
                    <span>Credit or Debit Card</span>
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px]">Visa</span>
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px]">Mastercard</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">RuPay</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Card Number *</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
                        setCardNumber(formatted);
                      }}
                      placeholder="4532 8912 3456 7890"
                      className="w-full bg-[#EBF4EE]/50 border border-[#D5E5D8] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date (MM/YY) *</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={e => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const formatted = raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
                          setCardExpiry(formatted);
                        }}
                        placeholder="08/28"
                        className="w-full bg-[#EBF4EE]/50 border border-[#D5E5D8] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">CVV Code *</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        className="w-full bg-[#EBF4EE]/50 border border-[#D5E5D8] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Cardholder Name *</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      placeholder="Sumit Yadav"
                      className="w-full bg-[#EBF4EE]/50 border border-[#D5E5D8] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                      required
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* TAB 3: NET BANKING */}
            {paymentMethod === "NET_BANKING" && (
              <Card className="p-5 border-[#D5E5D8] flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-extrabold text-[#1B4332] text-base flex items-center gap-1.5">
                    <Building2 className="w-5 h-5 text-amber-700" />
                    <span>Net Banking</span>
                  </h3>
                  <span className="text-xs text-gray-500 font-semibold">50+ Indian Banks</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Select Popular Bank</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "SBI", label: "State Bank of India (SBI)" },
                      { id: "HDFC", label: "HDFC Bank" },
                      { id: "ICICI", label: "ICICI Bank" },
                      { id: "AXIS", label: "Axis Bank" },
                      { id: "KOTAK", label: "Kotak Mahindra" },
                      { id: "BOB", label: "Bank of Baroda" },
                    ].map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-3 rounded-xl border text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
                          selectedBank === bank.id
                            ? "bg-[#1B4332] text-white border-[#1B4332] shadow-sm"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {selectedBank === bank.id && <Check className="w-3.5 h-3.5 text-amber-300" />}
                        <span>{bank.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* TAB 4: CASH ON DELIVERY (COD) */}
            {paymentMethod === "COD" && (
              <Card className="p-5 border-[#D5E5D8] flex flex-col gap-3 bg-amber-50/30">
                <div className="flex items-center gap-2 text-[#1B4332]">
                  <Banknote className="w-6 h-6 text-emerald-700" />
                  <h3 className="font-extrabold text-base">Cash on Doorstep Delivery (COD)</h3>
                </div>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  Pay cash or UPI upon delivery. You can inspect your fresh living-soil produce before handing over the payment to the local farm delivery partner.
                </p>
                <div className="p-2.5 bg-emerald-100/60 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>No upfront payment required today. Pay ₹{total} at doorstep.</span>
                </div>
              </Card>
            )}

            {/* TAB 5: AGRIHAIN ESCROW WALLET */}
            {paymentMethod === "ESCROW" && (
              <Card className="p-5 border-[#D5E5D8] flex flex-col gap-3 bg-emerald-50/40">
                <div className="flex items-center gap-2 text-[#1B4332]">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
                  <h3 className="font-extrabold text-base">AgriChain ESCROW Direct Harvest Pay</h3>
                </div>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  Funds are held in a secure 0%-fee smart escrow account and released to the farmer immediately upon quality check and delivery confirmation.
                </p>
              </Card>
            )}
          </div>

          {/* Final Checkout & Payment Confirmation Summary */}
          <div>
            <Card className="p-5 flex flex-col gap-4 sticky top-20 border-[#D5E5D8] shadow-md">
              <h3 className="font-heading font-bold text-lg text-[#1B4332] border-b border-gray-100 pb-2">
                Payment Summary
              </h3>

              <div className="space-y-2 text-xs font-medium text-gray-700">
                <div className="flex justify-between">
                  <span>Selected Method:</span>
                  <span className="font-bold text-[#1B4332]">
                    {paymentMethod === "UPI" ? `UPI (${selectedUpiApp})` :
                     paymentMethod === "CARD" ? "Credit/Debit Card" :
                     paymentMethod === "NET_BANKING" ? `NetBanking (${selectedBank})` :
                     paymentMethod === "COD" ? "Cash on Delivery" : "AgriChain Escrow"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Items Count:</span>
                  <span className="font-bold text-gray-900">{cart.length} Harvest Produce</span>
                </div>
                <div className="flex justify-between">
                  <span>Harvest Subtotal:</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Farm Dispatch Fee:</span>
                  <span className="font-bold text-gray-900">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#1B4332] pt-2 border-t border-gray-200">
                  <span>Total Amount:</span>
                  <span className="font-heading text-lg text-[#1B4332]">₹{total}</span>
                </div>
              </div>

              {paymentSuccess ? (
                <div className="p-4 bg-emerald-100 border-2 border-emerald-600 rounded-2xl text-center flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700 animate-bounce" />
                  <div className="font-extrabold text-[#1B4332] text-sm">Payment Successful!</div>
                  <div className="text-xs text-emerald-900 font-bold">Placing your harvest order...</div>
                </div>
              ) : (
                <form onSubmit={handleFinalPaymentSubmit}>
                  <Button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full bg-[#1B4332] hover:bg-[#122e22] text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authorizing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-300" />
                        <span>{paymentMethod === "COD" ? "Confirm Order (COD ₹" + total + ")" : "Pay & Place Order ₹" + total}</span>
                      </>
                    )}
                  </Button>
                </form>
              )}

              <p className="text-[11px] text-center text-gray-500 font-semibold flex items-center justify-center gap-1 pt-1">
                <Lock className="w-3.5 h-3.5 text-gray-400" /> 256-Bit Bank Grade Security
              </p>
            </Card>
          </div>

        </div>
      )}

    </div>
  );
}
