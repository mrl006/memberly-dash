
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import MemberLayout from "./layouts/MemberLayout";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import CouponManagement from "./pages/admin/CouponManagement";
import SupportTickets from "./pages/admin/SupportTickets";
import Settings from "./pages/admin/Settings";
import DashboardSettings from "./pages/admin/DashboardSettings";

// Member pages
import MemberDashboard from "./pages/member/Dashboard";
import Profile from "./pages/member/Profile";
import Subscriptions from "./pages/member/Subscriptions";
import Downloads from "./pages/member/Downloads";
import Support from "./pages/member/Support";
import AccessProducts from "./pages/member/AccessProducts";

// Misc pages
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="coupons" element={<CouponManagement />} />
            <Route path="support" element={<SupportTickets />} />
            <Route path="settings" element={<Settings />} />
            <Route path="dashboard-settings" element={<DashboardSettings />} />
          </Route>

          {/* Member routes */}
          <Route path="/member" element={<MemberLayout />}>
            <Route index element={<MemberDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="support" element={<Support />} />
            <Route path="access-products" element={<AccessProducts />} />
          </Route>

          {/* Not found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
