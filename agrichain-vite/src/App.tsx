import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppProvider";
import { Layout } from "./components/Layout";

// Screen Imports
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { Home } from "./pages/Customer/Home";
import { ProductDetail } from "./pages/Customer/ProductDetail";
import { Cart } from "./pages/Customer/Cart";
import { Orders } from "./pages/Customer/Orders";
import { FarmerHub } from "./pages/Farmer/Hub";
import { FarmerDashboard } from "./pages/Farmer/Dashboard";
import { PriceCheck } from "./pages/Farmer/PriceCheck";
import { AddProduct } from "./pages/Farmer/AddProduct";
import { Profile } from "./pages/Profile";

// Strict Route Protection Wrapper
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: ("FARMER" | "CUSTOMER")[];
}) {
  const { user, isAuthLoading } = useAppContext();
  
  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#1B4332]">Authenticating AgriChain User...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const userRole = user.role as "FARMER" | "CUSTOMER";
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={userRole === "FARMER" ? "/farmer" : "/"} replace />;
  }
  
  return <>{children}</>;
}

// Redirect logged-in users away from /login and /register pages directly to their dashboard/home
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoading } = useAppContext();

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#1B4332]">Loading AgriChain Login...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === "FARMER" ? "/farmer" : "/"} replace />;
  }
  return <>{children}</>;
}

function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Auth Routes (Only accessible when NOT logged in) */}
          <Route path="login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          
          {/* Main Marketplace & Home - PROTECTED (Requires authentication to enter website) */}
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="cart" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><Cart /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><Orders /></ProtectedRoute>} />
          
          {/* Protected Farmer Flow (Requires FARMER authentication) */}
          <Route path="farmer" element={<ProtectedRoute allowedRoles={["FARMER"]}><FarmerHub /></ProtectedRoute>} />
          <Route path="farmer/dashboard" element={<ProtectedRoute allowedRoles={["FARMER"]}><PriceCheck /></ProtectedRoute>} />
          <Route path="farmer/price-check" element={<ProtectedRoute allowedRoles={["FARMER"]}><PriceCheck /></ProtectedRoute>} />
          <Route path="farmer/voice" element={<ProtectedRoute allowedRoles={["FARMER"]}><FarmerDashboard /></ProtectedRoute>} />
          <Route path="farmer/add" element={<ProtectedRoute allowedRoles={["FARMER"]}><AddProduct /></ProtectedRoute>} />
          
          {/* Protected User Settings */}
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Fallback - Redirects to Home (which forces /login if not logged in) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
