
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginType, setLoginType] = useState<"client" | "admin">("client");
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
    
    // For demo purposes, simulate login with delayed response
    setTimeout(() => {
      setIsLoading(false);
      
      // Admin login logic
      if (loginType === "admin") {
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
        
        // Invalid admin credentials
        setErrorMessage("Invalid admin credentials. Please try again.");
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Sign In</h2>
        <p className="text-muted-foreground">Access your account</p>
      </div>
      
      <div className="flex bg-muted rounded-md p-1 mb-6">
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            loginType === "client" 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setLoginType("client")}
        >
          <span className="flex items-center justify-center gap-2">
            <KeyRound className="h-4 w-4" />
            Client Login
          </span>
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            loginType === "admin" 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setLoginType("admin")}
        >
          <span className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Admin Login
          </span>
        </button>
      </div>
      
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
            autoComplete="email"
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
            autoComplete="current-password"
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
            `Sign In as ${loginType === "admin" ? "Admin" : "Client"}`
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
