
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo purposes, simulate login
    setTimeout(() => {
      setIsLoading(false);
      
      // Admin login logic
      if (email === "admin@memberly.com" && password === "admin123") {
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard!",
        });
        navigate("/admin");
        return;
      }
      
      // Regular member login logic
      if (email === "member@example.com" && password === "member123") {
        toast({
          title: "Login Successful",
          description: "Welcome back to your member dashboard!",
        });
        navigate("/member");
        return;
      }
      
      // Invalid credentials
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
          />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
            Remember me
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
        
        <div className="mt-4 text-muted-foreground">
          <p>Demo accounts:</p>
          <p>Admin: admin@memberly.com / admin123</p>
          <p>Member: member@example.com / member123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
