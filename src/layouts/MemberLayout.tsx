
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
  Bell,
  Key,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberHeader from "@/components/member/MemberHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { ensureDefaultUsers, initializeUsers } from "@/services/userService";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants for sidebar
  const sidebarVariants = {
    open: { 
      x: 0,
      boxShadow: "5px 0px 15px rgba(0, 0, 0, 0.1)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: "-100%", 
      boxShadow: "none",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <motion.button 
        className={`lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary text-white shadow-lg`}
        onClick={() => setShowSidebar(!showSidebar)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Sidebar with animation */}
      <AnimatePresence>
        {(showSidebar || !isMobile) && (
          <motion.aside 
            className="bg-white w-64 border-r border-gray-200 flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-40"
            variants={sidebarVariants}
            initial={isMobile ? "closed" : "open"}
            animate="open"
            exit="closed"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-center">
              <motion.div
                className="flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/member")}
                style={{ cursor: "pointer" }}
              >
                <img 
                  src="/lovable-uploads/ababe9e5-16a4-4a61-a446-cc1d3009ce79.png" 
                  alt="Brand Logo" 
                  className="h-10 w-auto"
                />
              </motion.div>
            </div>
            
            <div className="flex flex-col flex-grow overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <NavLink 
                  to="/member" 
                  className={({isActive}) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
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
                    `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
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
                    `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
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
                  to="/member/access-products" 
                  className={({isActive}) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Key size={20} />
                  <span>Access Products</span>
                </NavLink>
                <NavLink 
                  to="/member/referrals" 
                  className={({isActive}) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Users size={20} />
                  <span>Referrals</span>
                </NavLink>
                <NavLink 
                  to="/member/downloads" 
                  className={({isActive}) => 
                    `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
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
                    `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
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
                <motion.button 
                  onClick={handleLogout}
                  className="flex items-center space-x-3 text-gray-700 px-4 py-3 rounded-md 
                           hover:bg-gray-100 transition-colors w-full"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`flex-1 ${(showSidebar || !isMobile) ? "lg:ml-64" : ""}`}>
        <MemberHeader />
        <main className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
