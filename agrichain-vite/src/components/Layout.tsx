import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import { ShoppingBag, User as UserIcon, Package, PlusCircle, LayoutDashboard, LogOut, Search, Sprout, Mic, X, MapPin, Globe, Menu } from "lucide-react";
import { getCropImage } from "../utils/cropImages";
import type { Language } from "../i18n/translations";

export function Layout() {
  const { user, logout, cart, products, searchQuery, setSearchQuery, login, language, setLanguage, t } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === "FARMER" ? "CUSTOMER" : "FARMER";
    login({ ...user, role: newRole });
    navigate(newRole === "FARMER" ? "/farmer" : "/");
  };

  // Filter matching products for live autocomplete suggestions dropdown
  const matchingProducts = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.localName && p.localName.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSelectProduct = (productId: string) => {
    setIsDropdownOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Header / Navigation Bar */}
      <header className="bg-primary text-on-primary sticky top-0 z-50 px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-inner">
              <Sprout className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-extrabold tracking-tight leading-tight">{t("brand")}</h1>
              <p className="text-[10px] text-primary-container font-medium -mt-0.5">Living Soil Market</p>
            </div>
          </Link>

          {/* Quick Search (Desktop) with Live Suggestions */}
          <div className="hidden md:flex flex-1 max-w-md relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  if (location.pathname !== "/") {
                    navigate("/");
                  }
                }}
                className="w-full pl-9 pr-8 py-2 text-sm bg-surface text-on-surface rounded-full focus:outline-none focus:ring-2 focus:ring-secondary border-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsDropdownOpen(false);
                  }}
                  className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {isDropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-outline rounded-xl shadow-xl overflow-hidden z-50 text-on-surface">
                <div className="p-2 bg-surface-variant text-[11px] font-bold text-on-surface-variant flex justify-between items-center border-b border-outline">
                  <span>Matching Results ({matchingProducts.length})</span>
                  <span className="text-[10px] text-primary font-semibold">Press Enter to view all</span>
                </div>

                {matchingProducts.length > 0 ? (
                  <div className="divide-y divide-outline-variant max-h-80 overflow-y-auto">
                    {matchingProducts.map(p => {
                      const imgSrc = getCropImage(p.name, p.category, p.image);
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p.id)}
                          className="flex items-center gap-3 p-3 hover:bg-surface-variant transition cursor-pointer"
                        >
                          <img
                            src={imgSrc}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-outline"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-heading font-bold text-xs truncate text-on-surface">
                                {p.name} {p.localName ? `(${p.localName})` : ""}
                              </h4>
                              <span className="font-extrabold text-xs text-primary ml-2">
                                ₹{p.price}/{p.unit}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mt-0.5">
                              <span className="bg-primary-container text-on-primary-container px-1.5 py-0.5 rounded text-[10px] font-semibold">
                                {p.category}
                              </span>
                              <span className="truncate flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 inline text-secondary" /> {p.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-on-surface-variant">
                    No crops found matching "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Multilingual Language Switcher Control */}
            <div className="flex items-center bg-primary-container text-on-primary-container px-2 py-1 rounded-full text-xs font-bold gap-1 shadow-sm border border-outline/30">
              <Globe className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-bold text-on-primary-container focus:outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <option value="en" className="bg-surface text-on-surface">EN</option>
                <option value="hi" className="bg-surface text-on-surface">हिंदी</option>
                <option value="mr" className="bg-surface text-on-surface">मराठी</option>
              </select>
            </div>

            {/* User Account Role Badge */}
            {user && (
              <span className="hidden sm:flex bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                {user.role === "FARMER" ? t("farmerMode") : t("customerMode")}
              </span>
            )}

            {/* Desktop Navigation Icons */}
            <div className="hidden md:flex items-center gap-2">
              
              {/* Customer Links */}
              {(!user || user.role === "CUSTOMER") && (
                <>
                  <Link
                    to="/cart"
                    className="relative p-2 hover:bg-primary-container hover:text-on-primary-container rounded-full transition"
                    title="Cart"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {totalCartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                        {totalCartCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/orders"
                    className={`p-2 hover:bg-primary-container hover:text-on-primary-container rounded-full transition ${location.pathname.startsWith('/orders') ? 'bg-primary-container text-on-primary-container' : ''}`}
                    title="My Orders"
                  >
                    <Package className="w-5 h-5" />
                  </Link>
                </>
              )}

              {/* Farmer Links */}
              {user?.role === "FARMER" && (
                <>
                  <Link
                    to="/farmer"
                    className={`p-2 hover:bg-primary-container hover:text-on-primary-container rounded-full transition ${location.pathname === '/farmer' ? 'bg-primary-container text-on-primary-container' : ''}`}
                    title="Farmer Hub"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                  
                  <Link
                    to="/farmer/dashboard"
                    className={`p-2 hover:bg-primary-container hover:text-on-primary-container rounded-full transition ${location.pathname === '/farmer/dashboard' ? 'bg-primary-container text-on-primary-container' : ''}`}
                    title="Voice Assistant & Analytics"
                  >
                    <Mic className="w-5 h-5" />
                  </Link>

                  <Link
                    to="/farmer/add"
                    className="p-2 hover:bg-primary-container hover:text-on-primary-container rounded-full transition"
                    title="Add Harvest"
                  >
                    <PlusCircle className="w-5 h-5 text-secondary" />
                  </Link>
                </>
              )}

              {/* Profile & Auth */}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={`p-2 hover:bg-primary-container hover:text-on-primary-container rounded-full transition ${location.pathname === '/profile' ? 'bg-primary-container text-on-primary-container' : ''}`}
                    title="Profile"
                  >
                    <UserIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="p-2 hover:bg-error-container hover:text-on-error-container rounded-full transition text-on-primary"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full font-extrabold text-xs shadow-sm hover:opacity-90 transition border border-outline/30"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-secondary text-on-secondary px-3.5 py-1.5 rounded-full font-extrabold text-xs shadow-sm hover:opacity-90 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Cart Button (Customer) */}
            {(!user || user.role === "CUSTOMER") && (
              <Link
                to="/cart"
                className="md:hidden relative p-2 hover:bg-primary-container rounded-full transition"
                title="Cart"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-primary-container/40 text-on-primary hover:bg-primary-container/60 transition"
              aria-label="Toggle Navigation Drawer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 md:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search crops, farms, location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== "/") {
                  navigate("/");
                }
              }}
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-surface text-on-surface rounded-full border-none focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-outline/30 space-y-2 bg-[#1B4332] p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-3">
            
            {user && (
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-extrabold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-white block leading-tight">{user.name}</span>
                    <span className="text-[10px] text-amber-300 font-medium">{user.role} Account</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toggleRole();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20 transition"
                >
                  Switch to {user.role === "FARMER" ? "Customer" : "Farmer"}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition"
              >
                <Sprout className="w-4 h-4 text-amber-300" />
                <span>Marketplace</span>
              </Link>

              {user?.role === "FARMER" ? (
                <>
                  <Link
                    to="/farmer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-300" />
                    <span>Farmer Hub</span>
                  </Link>

                  <Link
                    to="/farmer/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition"
                  >
                    <Mic className="w-4 h-4 text-amber-300" />
                    <span>Voice Assistant</span>
                  </Link>

                  <Link
                    to="/farmer/add"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 bg-amber-400 text-[#1B4332] rounded-xl text-xs font-extrabold flex items-center gap-2 transition shadow-md"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Harvest</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Cart ({totalCartCount})</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition"
                  >
                    <Package className="w-4 h-4 text-emerald-300" />
                    <span>My Orders</span>
                  </Link>
                </>
              )}

              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition"
                >
                  <UserIcon className="w-4 h-4 text-emerald-300" />
                  <span>Profile</span>
                </Link>
              ) : null}
            </div>

            <div className="pt-2 border-t border-white/10">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 text-xs font-extrabold flex items-center justify-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 bg-white/10 text-white font-extrabold text-xs rounded-xl text-center border border-white/20"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 bg-amber-400 text-[#1B4332] font-black text-xs rounded-xl text-center shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer Navigation & Credentials */}
      <footer className="bg-surface border-t border-outline text-on-surface-variant py-6 px-4 mt-12 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p className="font-heading font-bold text-primary text-sm mb-1">AGRICHAIN Living Soil Ecosystem</p>
            <p>Direct farm-to-table provenance & fair pricing algorithms.</p>
          </div>
          <div className="flex gap-4 font-medium">
            <Link to="/" className="hover:underline">Marketplace</Link>
            <Link to="/farmer" className="hover:underline">Farmer Hub</Link>
            <Link to="/orders" className="hover:underline">Order Logistics</Link>
            <Link to="/profile" className="hover:underline">Account Profile</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
