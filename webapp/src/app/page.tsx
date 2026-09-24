import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Header / App Bar */}
      <header className="bg-primary text-on-primary sticky top-0 z-50 px-4 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center">
            {/* Placeholder logo */}
            <span className="text-primary font-heading font-extrabold text-xl">A</span>
          </div>
          <h1 className="font-heading text-lg font-bold tracking-tight">AgriChain Marketplace</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold mr-2">
            EN
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">
            U
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
        
        {/* Verification Alert Banner */}
        <div className="bg-verified-bg border border-verified rounded-lg p-4 flex gap-3 text-verified items-start">
          <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="font-bold text-[13px]">Fair Price Audit Complete</p>
            <p className="text-xs text-opacity-90">All listed produce meets AgriChain farm-to-door minimum pricing standards.</p>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-surface rounded-xl shadow-[0_1px_3px_rgba(27,67,50,0.08)] border border-outline p-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-3">Direct from the Soil</h2>
          <p className="font-sans text-on-surface-variant max-w-lg mx-auto mb-6">
            Connecting rural producers operating under bright sunlight with urban consumers seeking traceable, farm-to-table provenance.
          </p>
          <button className="bg-secondary text-on-secondary hover:bg-opacity-90 transition transform active:scale-95 px-6 py-3 rounded-md font-bold shadow-md">
            View Harvest Yields
          </button>
        </section>

        {/* Commodity Tracking Grid */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-heading text-2xl font-bold text-on-background">Live Commodities</h3>
            <span className="text-secondary font-bold text-sm">See all live bids</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="bg-surface rounded-xl border border-outline shadow-[0_1px_3px_rgba(27,67,50,0.05)] overflow-hidden">
              <div className="h-32 bg-surface-variant relative">
                <div className="absolute top-2 right-2 bg-verified text-white px-2 py-1 rounded-full text-[11px] font-bold tracking-wider">
                  VERIFIED ORIGIN
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-heading text-lg font-bold text-primary">Red Onion / कांदा</h4>
                  <div className="text-right">
                    <span className="block font-heading text-xl font-extrabold text-on-background">₹32/kg</span>
                    <span className="text-xs text-secondary-container-on font-bold">↑ 2.4%</span>
                  </div>
                </div>
                <div className="space-y-1 mb-4 border-t border-outline-variant pt-3 mt-3">
                  <p className="text-sm flex justify-between"><span className="text-on-surface-variant">Farm:</span> <strong>Ramesh Patil, Nashik</strong></p>
                  <p className="text-sm flex justify-between"><span className="text-on-surface-variant">Grade:</span> <strong>A (Premium export)</strong></p>
                </div>
                <button className="w-full bg-primary text-on-primary hover:bg-opacity-90 py-2.5 rounded-md font-bold transition transform active:scale-[0.99]">
                  Buy Direct
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface rounded-xl border border-outline shadow-[0_1px_3px_rgba(27,67,50,0.05)] overflow-hidden">
              <div className="h-32 bg-surface-variant relative">
                <div className="absolute top-2 right-2 bg-review text-review-bg px-2 py-1 rounded-full text-[11px] font-bold tracking-wider">
                  SOIL AUDIT PENDING
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-heading text-lg font-bold text-primary">Green Chili / मिरची</h4>
                  <div className="text-right">
                    <span className="block font-heading text-xl font-extrabold text-on-background">₹45/kg</span>
                  </div>
                </div>
                <div className="space-y-1 mb-4 border-t border-outline-variant pt-3 mt-3">
                  <p className="text-sm flex justify-between"><span className="text-on-surface-variant">Farm:</span> <strong>Suresh Bhave, Pune</strong></p>
                  <p className="text-sm flex justify-between"><span className="text-on-surface-variant">Grade:</span> <strong>B (Standard)</strong></p>
                </div>
                <button className="w-full bg-primary text-on-primary hover:bg-opacity-90 py-2.5 rounded-md font-bold transition transform active:scale-[0.99] opacity-90">
                  Buy Direct
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
