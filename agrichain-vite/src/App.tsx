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
  const { user } = useAppContext();
  
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
  const { user } = useAppContext();
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
          {/* Public Landing & Produce Marketplace */}
          <Route index element={<Home />} />
          
          {/* Auth Routes (Only accessible when NOT logged in) */}
          <Route path="login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          
          {/* Protected Customer Flow (Requires authentication) */}
          <Route path="product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          
          {/* Protected Farmer Flow (Requires FARMER authentication) */}
          <Route path="farmer" element={<ProtectedRoute allowedRoles={["FARMER"]}><FarmerHub /></ProtectedRoute>} />
          <Route path="farmer/dashboard" element={<ProtectedRoute allowedRoles={["FARMER"]}><PriceCheck /></ProtectedRoute>} />
          <Route path="farmer/price-check" element={<ProtectedRoute allowedRoles={["FARMER"]}><PriceCheck /></ProtectedRoute>} />
          <Route path="farmer/voice" element={<ProtectedRoute allowedRoles={["FARMER"]}><FarmerDashboard /></ProtectedRoute>} />
          <Route path="farmer/add" element={<ProtectedRoute allowedRoles={["FARMER"]}><AddProduct /></ProtectedRoute>} />
          
          {/* Protected User Settings */}
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Fallback - Redirects to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
