export default function FarmerHub() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-on-primary py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="font-heading font-bold text-lg">My Farm Hub</h1>
        <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold">R</div>
      </header>
      <main className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary text-on-secondary p-4 rounded-xl shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wide">Live Orders</p>
          <p className="text-2xl font-heading font-extrabold mt-1">12</p>
        </div>
        <div className="bg-surface border border-outline p-4 rounded-xl shadow-sm">
          <p className="text-xs text-on-surface-variant font-bold tracking-wide uppercase">Revenue</p>
          <p className="text-2xl text-primary font-heading font-extrabold mt-1">₹4,500</p>
        </div>
      </main>
    </div>
  );
}
