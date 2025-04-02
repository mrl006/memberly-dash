
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import AdminLayout from "./layouts/AdminLayout";
import MemberLayout from "./layouts/MemberLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import CouponManagement from "./pages/admin/CouponManagement";
import SupportTickets from "./pages/admin/SupportTickets";
import Settings from "./pages/admin/Settings";
import MemberDashboard from "./pages/member/Dashboard";
import Profile from "./pages/member/Profile";
import DashboardSettings from "./pages/admin/DashboardSettings";
import ApiKeyManagement from "./pages/admin/ApiKeyManagement";
import AccessProducts from "./pages/member/AccessProducts";
import Downloads from "./pages/member/Downloads";
import Support from "./pages/member/Support";

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
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "dashboard-settings",
          element: <DashboardSettings />,
        },
        {
          path: "users",
          element: <UserManagement />,
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
          element: <CouponManagement />,
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
          element: <Profile />,
        },
        {
          path: "access-products",
          element: <AccessProducts />,
        },
        {
          path: "downloads",
          element: <Downloads />,
        },
        {
          path: "support",
          element: <Support />,
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
