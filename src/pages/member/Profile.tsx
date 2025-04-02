
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Check, Info, Loader2, QrCode, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Profile = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // User profile data
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc.",
    website: "https://johndoe.com",
  });
  
  // Password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FASetupOpen, setIs2FASetupOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };
  
  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    }, 1000);
  };

  // Handle 2FA toggle
  const handle2FAToggle = () => {
    if (is2FAEnabled) {
      // Disable 2FA - would typically require confirmation
      confirmDisable2FA();
    } else {
      // Enable 2FA - show setup screen
      setIs2FASetupOpen(true);
    }
  };

  // Confirm disabling 2FA
  const confirmDisable2FA = () => {
    setIsSubmitting(true);
    
    // Simulate API call to disable 2FA
    setTimeout(() => {
      setIsSubmitting(false);
      setIs2FAEnabled(false);
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled for your account.",
      });
    }, 1000);
  };

  // Complete 2FA setup
  const complete2FASetup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast({
        title: "Verification Code Required",
        description: "Please enter the verification code from your authenticator app.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to verify and enable 2FA
    setTimeout(() => {
      setIsSubmitting(false);
      setIs2FAEnabled(true);
      setIs2FASetupOpen(false);
      setVerificationCode("");
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account.",
      });
    }, 1000);
  };

  // Generate mock backup codes (in real app these would come from the backend)
  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(`${Math.random().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`);
    }
    return codes;
  };

  // Mock backup codes
  const backupCodes = generateBackupCodes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card */}
        <Card className="flex-grow md:max-w-sm">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg" alt="John Doe" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <CardTitle className="text-center">{profileData.firstName} {profileData.lastName}</CardTitle>
              <CardDescription className="text-center">{profileData.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Member Since</h4>
              <p>April 23, 2023</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Current Plan</h4>
              <p>Professional Plan</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Upload New Photo
            </Button>
          </CardFooter>
        </Card>
        
        {/* Settings Tabs */}
        <div className="flex-grow">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="personal-form" onSubmit={handleProfileSubmit}>
                    <div className="grid gap-4 py-2">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input 
                            id="firstName" 
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input 
                            id="lastName" 
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input 
                            id="company" 
                            value={profileData.company}
                            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input 
                            id="website" 
                            value={profileData.website}
                            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button form="personal-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="password-form" onSubmit={handlePasswordSubmit}>
                    <div className="grid gap-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current password</Label>
                        <Input 
                          id="currentPassword" 
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input 
                          id="newPassword" 
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button form="password-form" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {is2FASetupOpen ? (
                    <div className="space-y-4">
                      <Alert className="bg-amber-50 border-amber-200">
                        <Info className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          Scan the QR code with an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-gray-50">
                        <div className="mb-4 p-2 bg-white border rounded">
                          <QrCode className="h-32 w-32" />
                        </div>
                        <p className="text-sm text-center text-muted-foreground mb-4">
                          Can't scan? Use this code: <span className="font-mono font-bold">HDJA 7D92 LM31 PQVS</span>
                        </p>
                      </div>
                      
                      <form onSubmit={complete2FASetup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="verificationCode">Verification Code</Label>
                          <Input
                            id="verificationCode"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-medium">Backup Codes</h4>
                          <p className="text-sm text-muted-foreground">
                            Save these backup codes in a secure place. Each code can only be used once.
                          </p>
                          <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-md border font-mono text-sm">
                            {backupCodes.map((code, index) => (
                              <div key={index} className="p-1">{code}</div>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText(backupCodes.join("\n"));
                              toast({
                                title: "Copied to Clipboard",
                                description: "Backup codes have been copied to your clipboard."
                              });
                            }}
                          >
                            Copy All Codes
                          </Button>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIs2FASetupOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                            {isSubmitting ? "Enabling..." : "Enable 2FA"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Two-factor authentication adds an additional layer of security to your
                        account by requiring more than just a password to sign in.
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {is2FAEnabled ? (
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                          ) : (
                            <Shield className="h-5 w-5 text-gray-400" />
                          )}
                          <Label htmlFor="2fa" className="flex-1">
                            {is2FAEnabled ? "2FA is currently enabled" : "Enable two-factor authentication"}
                          </Label>
                        </div>
                        <Switch
                          id="2fa"
                          checked={is2FAEnabled}
                          onCheckedChange={handle2FAToggle}
                        />
                      </div>
                      
                      {is2FAEnabled && (
                        <Alert className="mt-4 bg-green-50 border-green-200">
                          <Check className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Your account is protected with two-factor authentication.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </CardContent>
                {!is2FASetupOpen && is2FAEnabled && (
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        toast({
                          title: "Backup Codes",
                          description: "New backup codes have been generated and can be viewed in your settings."
                        });
                      }}
                    >
                      Generate New Backup Codes
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
