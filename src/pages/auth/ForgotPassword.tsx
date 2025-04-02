
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo purposes, simulate password reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your inbox for password reset instructions.",
      });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
        <p className="mb-6 text-gray-600">
          We've sent password reset instructions to:
          <br />
          <span className="font-medium">{email}</span>
        </p>
        <Button onClick={() => navigate("/login")} className="w-full">
          Return to Login
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Didn't receive an email?{" "}
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/login" className="inline-flex items-center text-sm mb-6 text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to login
      </Link>
      
      <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
      <p className="mb-6 text-gray-600">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
      
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
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Instructions"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
