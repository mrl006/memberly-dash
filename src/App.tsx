import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import AdminLayout from "./layouts/AdminLayout";
import MemberLayout from "./layouts/MemberLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CouponsPage from "./pages/admin/CouponsPage";
import SupportPage from "./pages/admin/SupportPage";
import SettingsPage from "./pages/admin/SettingsPage";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberProfile from "./pages/member/MemberProfile";
import ProductManagement from "./pages/admin/ProductManagement";
import DashboardSettings from "./pages/admin/DashboardSettings";

// Add the import for the ApiKeyManagement component
import ApiKeyManagement from "./pages/admin/ApiKeyManagement";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
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
          element: <SupportPage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
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
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
