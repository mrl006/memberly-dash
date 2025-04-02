
import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
  Home, 
  User, 
  CreditCard, 
  Download, 
  LifeBuoy, 
  LogOut,
  Menu,
  X,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberHeader from "@/components/member/MemberHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { ensureDefaultUsers, initializeUsers } from "@/services/userService";

const MemberLayout = () => {
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
    const loadUsers = async () => {
      await initializeUsers();
      await ensureDefaultUsers();
    };
    
    loadUsers();
  }, []);

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
        className={`bg-white w-64 border-r border-gray-200 flex-shrink-0 flex-col ${
          showSidebar ? "flex" : "hidden"
        } fixed inset-y-0 lg:flex z-40`}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold gradient-heading">Memberly</h1>
          <p className="text-sm text-gray-600">Member Portal</p>
        </div>
        
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavLink 
              to="/member" 
              className={({isActive}) => 
                `flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                }`
              } 
              end
            >
              <Home size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/member/profile" 
              className={({isActive}) => 
                `flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <User size={20} />
              <span>My Profile</span>
            </NavLink>
            <NavLink 
              to="/member/subscriptions" 
              className={({isActive}) => 
                `flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <CreditCard size={20} />
              <span>Subscriptions</span>
            </NavLink>
            <NavLink 
              to="/member/downloads" 
              className={({isActive}) => 
                `flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Download size={20} />
              <span>Downloads</span>
            </NavLink>
            <NavLink 
              to="/member/support" 
              className={({isActive}) => 
                `flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <LifeBuoy size={20} />
              <span>Get Support</span>
            </NavLink>
          </nav>
          
          <div className="p-4 border-t border-gray-200 mt-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 px-4 py-3 rounded-md 
                         hover:bg-gray-100 transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 ${showSidebar ? "lg:ml-64" : ""}`}>
        <MemberHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
