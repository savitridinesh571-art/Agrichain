export default function AddProduct() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-primary mb-6">Add New Harvest</h1>
      <form className="max-w-xl bg-surface border border-outline p-6 rounded-xl shadow-sm flex flex-col gap-4">
        <div>
           <label className="block font-bold text-sm mb-1">Crop Type</label>
           <select className="w-full border border-outline rounded-md px-3 py-2">
             <option>Tomato / टोमॅटो</option>
             <option>Onion / कांदा</option>
           </select>
        </div>
        <div>
           <label className="block font-bold text-sm mb-1">Quantity (Kg)</label>
           <input type="number" className="w-full border border-outline rounded-md px-3 py-2" />
        </div>
        <div className="bg-review-bg text-review border border-review rounded-md p-3 text-sm">
           <strong>Smart Price:</strong> Recommended selling price is ₹30/kg based on current market rates.
        </div>
        <button type="button" className="bg-primary text-on-primary font-bold rounded-md py-3 mt-4">
          Publish Listing
        </button>
      </form>
    </div>
  );
}
