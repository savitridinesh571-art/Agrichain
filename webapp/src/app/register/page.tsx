export default function Registration() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Join AgriChain</h1>
        <p className="text-on-surface-variant font-sans mb-8">Register as a Farmer or Customer</p>
        
        <form className="bg-surface border border-outline p-6 rounded-xl shadow-sm flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Full Name</label>
            <input type="text" className="w-full border border-outline-variant rounded-md px-3 py-2 text-on-surface" placeholder="E.g. Ramesh Patil" />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Mobile Number</label>
            <input type="tel" className="w-full border border-outline-variant rounded-md px-3 py-2 text-on-surface" placeholder="+91" />
          </div>
          <button type="button" className="w-full bg-primary text-on-primary py-3 rounded-md font-bold mt-2">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
