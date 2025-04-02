
import { Bell } from "lucide-react";
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

const MemberHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-30">
      {/* Logo Section */}
      <div 
        className="flex items-center cursor-pointer" 
        onClick={() => navigate("/member")}
      >
        <div className="text-primary font-bold text-2xl mr-2">Memberly</div>
        <span className="text-gray-600 text-sm hidden md:inline">Member Portal</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-brand-orange" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full overflow-hidden h-10 w-10 p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src="/lovable-uploads/0a3c5479-6eaf-42a3-a67e-9cc5f24a5216.png" 
                  alt="Profile" 
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
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
            <DropdownMenuItem onClick={() => navigate("/login")}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default MemberHeader;
