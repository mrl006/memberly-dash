
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
  Bell,
  Search,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminHeader from "@/components/admin/AdminHeader";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const handleLogout = () => {
    // Implement logout logic here
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <button 
        className={`lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-white shadow-lg`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`bg-sidebar w-64 flex-shrink-0 flex-col ${
          showSidebar ? "flex" : "hidden"
        } fixed inset-y-0 lg:flex z-40`}
      >
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-foreground">Memberly</h1>
          <p className="text-sm text-sidebar-foreground/80">Admin Panel</p>
        </div>
        
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavLink to="/admin" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`} end>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/dashboard-settings" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <BarChart size={20} />
              <span>Dashboard Settings</span>
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <Users size={20} />
              <span>Users</span>
            </NavLink>
            <NavLink to="/admin/products" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <ShoppingBag size={20} />
              <span>Products</span>
            </NavLink>
            <NavLink to="/admin/coupons" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <Tags size={20} />
              <span>Coupons</span>
            </NavLink>
            <NavLink to="/admin/support" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <LifeBuoy size={20} />
              <span>Support</span>
            </NavLink>
            <NavLink to="/admin/settings" className={({isActive}) => `sidebar-link ${isActive ? "active" : ""}`}>
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </nav>
          
          <div className="p-4 border-t border-sidebar-border mt-auto">
            <button 
              onClick={handleLogout}
              className="sidebar-link w-full justify-center"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 ${showSidebar ? "lg:ml-64" : ""}`}>
        <AdminHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
