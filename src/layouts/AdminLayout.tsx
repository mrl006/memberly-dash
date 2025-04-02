
import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Tags, 
  LifeBuoy, 
  Settings, 
  LogOut,
  Menu,
  X,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/admin/AdminHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { initializeUsers } from "@/services/userService";

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Hide sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile]);

  // Initialize users on mount
  useEffect(() => {
    initializeUsers();
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button 
        className={`lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-white shadow-lg`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`bg-blue-500 w-64 flex-shrink-0 ${
          showSidebar ? "flex" : "hidden"
        } fixed inset-y-0 left-0 lg:flex z-40 flex-col`}
      >
        <div className="p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Memberly</h1>
          <p className="text-sm mt-1">Admin Panel</p>
        </div>
        
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavLink to="/admin" className={({isActive}) => `flex items-center gap-3 px-4 py-2 rounded-md text-white ${isActive ? "bg-blue-600 font-medium" : "hover:bg-blue-600"}`} end>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/dashboard-settings" className={({isActive}) => `flex items-center gap-3 px-4 py-2 rounded-md text-white ${isActive ? "bg-blue-600 font-medium" : "hover:bg-blue-600"}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard Settings</span>
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => `flex items-center gap-3 px-4 py-2 rounded-md text-white ${isActive ? "bg-blue-600 font-medium" : "hover:bg-blue-600"}`}>
              <Users size={20} />
              <span>Users</span>
            </NavLink>
            <NavLink to="/admin/products" className={({isActive}) => `flex items-center gap-3 px-4 py-2 rounded-md text-white ${isActive ? "bg-blue-600 font-medium" : "hover:bg-blue-600"}`}>
              <ShoppingBag size={20} />
              <span>Products</span>
            </NavLink>
            <NavLink to="/admin/api-keys" className={({isActive}) => `flex items-center gap-3 px-4 py-2 rounded-md text-white ${isActive ? "bg-blue-600 font-medium" : "hover:bg-white/10"}`}>
              <Key size={20} />
              <span>API Keys</span>
            </NavLink>
            <NavLink to="/admin/coupons" className={({isActive}) => `flex items-center gap-3 px-4 py-2 rounded-md text-white ${isActive ? "bg-blue-600 font-medium" : "hover:bg-blue-600"}`}>
              <Tags size={20} />
              <span>Coupons</span>
            </NavLink>
            <NavLink to="/admin/support" className={({isActive}) => `flex items-center gap-3 px-4 py-2 rounded-md text-white ${isActive ? "bg-blue-600 font-medium" : "hover:bg-blue-600"}`}>
              <LifeBuoy size={20} />
              <span>Support</span>
            </NavLink>
            <NavLink to="/admin/settings" className={({isActive}) => `flex items-center gap-3 px-4 py-2 rounded-md text-white ${isActive ? "bg-blue-600 font-medium" : "hover:bg-blue-600"}`}>
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </nav>
          
          <div className="p-4 border-t border-blue-400 mt-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-white hover:bg-blue-600"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${showSidebar ? "lg:ml-64" : ""}`}>
        <AdminHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
