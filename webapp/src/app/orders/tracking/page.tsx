export default function OrderTracking() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <h1 className="font-heading text-2xl font-extrabold text-primary mb-6">Order Tracking</h1>
      
      <div className="max-w-2xl bg-surface border border-outline rounded-xl p-6 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 bg-verified text-verified-bg text-xs font-bold px-4 rounded-bl-xl">In Transit</div>
        <h2 className="font-heading font-bold text-lg mb-1">Order #88392</h2>
        <p className="text-sm text-on-surface-variant mb-6">50kg Saffron Onions</p>

        <div className="flex flex-col gap-4 border-l-2 border-outline-variant ml-2 pl-4 py-2 relative">
          <div className="relative">
            <div className="absolute -left-[23px] w-3 h-3 bg-secondary rounded-full"></div>
            <p className="font-bold text-sm">Harvested & Packed</p>
            <p className="text-xs text-on-surface-variant">Ramesh Farm, Nashik</p>
          </div>
          <div className="relative mt-4 opacity-50">
            <div className="absolute -left-[23px] w-3 h-3 bg-outline rounded-full"></div>
            <p className="font-bold text-sm">Arriving at Urban Hub</p>
            <p className="text-xs text-on-surface-variant">Estimated: Tomorrow</p>
          </div>
        </div>
      </div>
    </div>
  );
}
