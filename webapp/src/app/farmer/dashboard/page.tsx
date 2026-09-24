export default function FarmerDashboard() {
  return (
    <div className="min-h-screen bg-surface-variant p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-heading font-bold text-primary">Voice Assistant & Analytics</h1>
        <div className="text-secondary font-bold">Ask AI</div>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-outline p-6 rounded-xl">
          <h2 className="font-heading font-bold mb-2">Market Insights</h2>
          <p className="text-sm text-on-surface-variant">Onions are trading 2% higher today in your region.</p>
        </div>
        <div className="bg-surface border border-outline p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">🎤</div>
          <div>
            <p className="font-bold">Speak to add product</p>
            <p className="text-xs text-on-surface-variant">"List 50kg tomatoes at ₹20"</p>
          </div>
        </div>
      </main>
    </div>
  );
}
