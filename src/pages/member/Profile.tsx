
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Check, Info, Loader2, QrCode, Shield, ShieldCheck, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateUser, User, getUsers, findUserByEmail } from "@/services/userService";
import { motion } from "framer-motion";

const Profile = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState("/lovable-uploads/5f2b6002-1195-4f70-aee9-c6de2dd470aa.png");
  const [isUploading, setIsUploading] = useState(false);
  
  // User profile data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
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

  // Load current user on mount
  useEffect(() => {
    // In a real app, this would get the current user from auth context
    // For demo purposes, we'll use the first user from the users collection
    const users = getUsers();
    if (users.length > 0) {
      const user = users[0];
      setCurrentUser(user);
      
      // Parse the name into first and last name
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(' ') || "";
      
      setProfileData({
        firstName,
        lastName,
        email: user.email,
        phone: user.phone || "",
        company: user.company || "",
        website: user.website || "",
      });
    }
  }, []);
  
  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "User data not found",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Update user in the database
    const updatedUser = updateUser(currentUser.id, {
      name: `${profileData.firstName} ${profileData.lastName}`.trim(),
      email: profileData.email,
      phone: profileData.phone,
      company: profileData.company,
      website: profileData.website,
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (updatedUser) {
        setCurrentUser(updatedUser);
        toast({
          title: "Profile Updated",
          description: "Your profile information has been updated successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    }, 500);
  };

  // Handle photo upload
  const handlePhotoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate file upload
    setTimeout(() => {
      // Create object URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setAvatarSrc(objectUrl);
      setIsUploading(false);
      
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been updated successfully.",
      });
    }, 1500);
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
        <Card className="flex-grow md:max-w-sm shadow-sm border-none">
          <CardHeader>
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary/10">
                  <AvatarImage src={avatarSrc} alt={profileData.firstName} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handlePhotoUpload}>
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-center text-xl">{profileData.firstName} {profileData.lastName}</CardTitle>
              <CardDescription className="text-center">{profileData.email}</CardDescription>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-muted-foreground">Member Since</h4>
              <p className="font-medium">{currentUser?.joined || "April 23, 2023"}</p>
            </div>
            <div className="space-y-2 bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-muted-foreground">Current Plan</h4>
              <p className="font-medium">{currentUser?.subscription || "Professional Plan"}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary" 
              onClick={handlePhotoUpload}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Photo
            </Button>
          </CardFooter>
        </Card>
        
        {/* Settings Tabs */}
        <div className="flex-grow">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <Card className="shadow-sm border-none">
                <CardHeader className="pb-3">
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
                            className="border-gray-200 focus-visible:ring-primary/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input 
                            id="lastName" 
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            className="border-gray-200 focus-visible:ring-primary/30"
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
                          className="border-gray-200 focus-visible:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="border-gray-200 focus-visible:ring-primary/30"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input 
                            id="company" 
                            value={profileData.company}
                            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                            className="border-gray-200 focus-visible:ring-primary/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input 
                            id="website" 
                            value={profileData.website}
                            onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                            className="border-gray-200 focus-visible:ring-primary/30"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 pt-4">
                  <Button form="personal-form" disabled={isSubmitting} className="ml-auto">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <Card className="shadow-sm border-none">
                <CardHeader className="pb-3">
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
                          className="border-gray-200 focus-visible:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input 
                          id="newPassword" 
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="border-gray-200 focus-visible:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="border-gray-200 focus-visible:ring-primary/30"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 pt-4">
                  <Button form="password-form" disabled={isSubmitting} className="ml-auto">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-sm border-none">
                <CardHeader className="pb-3">
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
                            className="border-gray-200 focus-visible:ring-primary/30"
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
                  <CardFooter className="border-t bg-gray-50 pt-4">
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
