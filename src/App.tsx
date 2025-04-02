
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import AdminLayout from "./layouts/AdminLayout";
import MemberLayout from "./layouts/MemberLayout";
import AuthLayout from "./layouts/AuthLayout";
import { Login as LoginPage } from "./pages/auth/Login";
import { Register as RegisterPage } from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import { Dashboard as AdminDashboard } from "./pages/admin/Dashboard";
import { UserManagement as UsersPage } from "./pages/admin/UserManagement";
import ProductsPage from "./pages/admin/ProductManagement";
import { CouponManagement as CouponsPage } from "./pages/admin/CouponManagement";
import SupportTickets from "./pages/admin/SupportTickets";
import Settings from "./pages/admin/Settings";
import { Dashboard as MemberDashboard } from "./pages/member/Dashboard";
import { Profile as MemberProfile } from "./pages/member/Profile";
import ProductManagement from "./pages/admin/ProductManagement";
import DashboardSettings from "./pages/admin/DashboardSettings";
import ApiKeyManagement from "./pages/admin/ApiKeyManagement";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: "dashboard-settings",
          element: <DashboardSettings />,
        },
        {
          path: "users",
          element: <UsersPage />,
        },
        {
          path: "products",
          element: <ProductManagement />,
        },
        {
          path: "api-keys", 
          element: <ApiKeyManagement />
        },
        {
          path: "coupons",
          element: <CouponsPage />,
        },
        {
          path: "support",
          element: <SupportTickets />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
      ],
    },
    {
      path: "/member",
      element: <MemberLayout />,
      children: [
        {
          index: true,
          element: <MemberDashboard />,
        },
        {
          path: "profile",
          element: <MemberProfile />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
