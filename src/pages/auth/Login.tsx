
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    
    if (!password) {
      setErrorMessage("Password is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!validateForm()) {
      return;
    }
    
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
        if (rememberMe) {
          localStorage.setItem("memberly-user-email", email);
          localStorage.setItem("memberly-user-type", "admin");
        }
        navigate("/admin");
        return;
      }
      
      // Regular member login logic
      if (email === "member@example.com" && password === "member123") {
        toast({
          title: "Login Successful",
          description: "Welcome back to your member dashboard!",
        });
        if (rememberMe) {
          localStorage.setItem("memberly-user-email", email);
          localStorage.setItem("memberly-user-type", "member");
        }
        navigate("/member");
        return;
      }
      
      // Invalid credentials
      setErrorMessage("Invalid email or password. Please try again.");
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
            disabled={isLoading}
          />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
            Remember me
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
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
