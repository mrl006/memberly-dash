
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const MemberHeader = () => {
  const navigate = useNavigate();

  return (
    <motion.header 
      className="bg-gradient-to-r from-primary/5 via-background to-primary/5 backdrop-blur-sm border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-30 w-full shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search Bar - Enhanced with animation */}
      <motion.div 
        className="flex md:flex-1 relative max-w-xs w-full"
        initial={{ opacity: 0, width: "90%" }}
        animate={{ opacity: 1, width: "100%" }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search resources..."
          className="pl-9 bg-white/50 backdrop-blur-sm border-gray-200 focus:bg-white transition-all duration-300"
        />
      </motion.div>
      
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/member/support")}
            className="hidden sm:flex border-gray-200 hover:bg-gray-50 hover:text-primary"
          >
            Get Help
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <motion.span 
              className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-orange-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500,
                damping: 15,
                delay: 0.5
              }}
            />
          </Button>
        </motion.div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="relative rounded-full overflow-hidden h-10 w-10 p-0 border border-gray-200"
              whileHover={{ scale: 1.1, borderColor: "rgba(var(--primary-rgb), 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src="/lovable-uploads/5f2b6002-1195-4f70-aee9-c6de2dd470aa.png" 
                  alt="Profile" 
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  JD
                </AvatarFallback>
              </Avatar>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/member/profile")}>
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/member/subscriptions")}>
              My Subscriptions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/login")}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default MemberHeader;
