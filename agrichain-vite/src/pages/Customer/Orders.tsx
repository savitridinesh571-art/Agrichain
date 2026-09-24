import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppProvider";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Package, CheckCircle2, Truck, Clock, ShieldCheck, MapPin, Trash2 } from "lucide-react";
import { getCropImage } from "../../utils/cropImages";
import { LiveOrderTrackingMap } from "../../components/LiveOrderTrackingMap";
import { DeliveryRoute } from "../../components/DeliveryRoute";

export function Orders() {
  const { orders, updateOrderStatus, deleteOrder, user } = useAppContext();

  const steps = [
    { label: "Placed", icon: Clock },
    { label: "Harvested & Packed", icon: Package },
    { label: "In Transit", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-primary">
            Track Harvest Orders ({orders.length})
          </h1>
          <p className="text-xs text-on-surface-variant">
            Real-time live GPS logistics, driver contact & transparent price audit tracking.
          </p>
        </div>
        <Link to="/">
          <Button variant="secondary">Explore Marketplace</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-40" />
          <h2 className="font-heading font-bold text-lg mb-1">No Orders Placed Yet</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            Place an order on the marketplace to trace your farm produce journey.
          </p>
          <Link to="/">
            <Button>Explore Marketplace</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order.id} className="p-5 sm:p-6 flex flex-col gap-6 border border-emerald-900/10 shadow-md">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-lg text-primary">{order.id}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-primary-container text-on-primary-container"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="text-left sm:text-right mr-2">
                    <span className="font-heading text-2xl font-black text-primary">₹{order.totalPrice}</span>
                    <span className="text-xs text-on-surface-variant block font-semibold">
                      Payment: {order.paymentMethod || "UPI Direct"} <span className="text-emerald-700 font-extrabold">({order.paymentStatus || "Paid"})</span>
                    </span>
                  </div>

                  {/* Mark as Delivered Quick Action Button */}
                  {order.status !== "Delivered" ? (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Delivered", 4)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm text-xs transition active:scale-95"
                      title="Set Order Status to Delivered"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Delivered</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold flex items-center gap-1.5 text-xs shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Product Delivered</span>
                    </span>
                  )}

                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition flex items-center gap-1.5 text-xs font-bold shrink-0"
                    title="Remove / Cancel Order"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Order</span>
                  </button>
                </div>
              </div>

              {/* Multi-Step Visual Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Logistics Tracking Progress (Click any step to update status)
                  </h4>
                  {order.status === "Delivered" && (
                    <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Order Completed & Delivered
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
                  {steps.map((step, idx) => {
                    const isPassed = order.trackingStep >= idx + 1;
                    const isCurrent = order.trackingStep === idx + 1;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.label}
                        onClick={() => updateOrderStatus(order.id, step.label as any, idx + 1)}
                        className={`p-3 rounded-xl border flex flex-col items-center text-center transition cursor-pointer hover:scale-[1.02] active:scale-95 ${
                          isCurrent
                            ? order.status === "Delivered"
                              ? "bg-emerald-700 text-white border-emerald-800 shadow-md font-bold"
                              : "bg-primary text-on-primary border-primary shadow-md"
                            : isPassed
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
                            : "bg-surface text-on-surface-variant border-outline opacity-60 hover:opacity-100"
                        }`}
                        title={`Click to set status to ${step.label}`}
                      >
                        <StepIcon className="w-5 h-5 mb-1" />
                        <span className="text-xs font-bold">{step.label}</span>
                        <span className="text-[10px] opacity-80 mt-0.5">Step {idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Interactive GPS Map Component (Vehicle, Temperature, Audit & Rating) */}
              <LiveOrderTrackingMap order={order} />

              {/* Google Maps Delivery Route & Navigation */}
              <DeliveryRoute order={order} />

              {/* Items List */}
              <div className="bg-surface-variant/40 rounded-xl p-4 space-y-3">
                <h4 className="font-heading text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Package Content
                </h4>
                {order.items.map(item => {
                  const imgSrc = getCropImage(item.product.name, item.product.category, item.product.image);
                  return (
                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={imgSrc}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-outline flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-on-surface">{item.product.name}</span>
                          <span className="text-xs text-on-surface-variant ml-2">x {item.quantity} {item.product.unit}</span>
                          <span className="block text-xs text-on-surface-variant">Farm: {item.product.farm}</span>
                        </div>
                      </div>
                      <span className="font-bold text-primary">₹{item.product.price * item.quantity}</span>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Details & Status Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs pt-2 border-t border-outline">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span><strong>Deliver to:</strong> {order.deliveryAddress} ({order.customerPhone})</span>
                </div>

                {/* Status Switcher Control Bar */}
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-primary mr-1">Status:</span>
                  <button
                    onClick={() => updateOrderStatus(order.id, "Placed", 1)}
                    className={`px-2 py-1 rounded text-[11px] font-bold border transition ${
                      order.trackingStep === 1 ? "bg-primary text-on-primary border-primary" : "bg-surface border-outline hover:bg-surface-variant"
                    }`}
                  >
                    Placed
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, "Harvested & Packed", 2)}
                    className={`px-2 py-1 rounded text-[11px] font-bold border transition ${
                      order.trackingStep === 2 ? "bg-primary text-on-primary border-primary" : "bg-surface border-outline hover:bg-surface-variant"
                    }`}
                  >
                    Packed
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, "In Transit", 3)}
                    className={`px-2 py-1 rounded text-[11px] font-bold border transition ${
                      order.trackingStep === 3 ? "bg-primary text-on-primary border-primary" : "bg-surface border-outline hover:bg-surface-variant"
                    }`}
                  >
                    Transit
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order.id, "Delivered", 4)}
                    className={`px-2.5 py-1 rounded text-[11px] font-extrabold border transition ${
                      order.trackingStep === 4 ? "bg-emerald-600 text-white border-emerald-700" : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    }`}
                  >
                    ✓ Delivered
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

