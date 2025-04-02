import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { 
  getGeneralSettings, 
  saveGeneralSettings, 
  getSecuritySettings, 
  saveSecuritySettings,
  applyGeneralSettings,
  type GeneralSettings,
  type SecuritySettings
} from "@/services/settingsService";

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(getGeneralSettings());
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(getSecuritySettings());

  useEffect(() => {
    setGeneralSettings(getGeneralSettings());
    setSecuritySettings(getSecuritySettings());
  }, []);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveGeneralSettings = () => {
    saveGeneralSettings(generalSettings);
    applyGeneralSettings();
  };

  const handleSaveSecuritySettings = () => {
    saveSecuritySettings(securitySettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic information about your site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    name="supportPhone"
                    value={generalSettings.supportPhone}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all administrator accounts
                  </p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSwitchChange("twoFactorAuth", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="passwordExpiry">Password Expiry</Label>
                  <p className="text-sm text-muted-foreground">
                    Force password reset every 90 days
                  </p>
                </div>
                <Switch
                  id="passwordExpiry"
                  name="passwordExpiry"
                  checked={securitySettings.passwordExpiry}
                  onCheckedChange={(checked) => handleSwitchChange("passwordExpiry", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Failed Login Attempts</Label>
                <Input
                  id="loginAttempts"
                  name="loginAttempts"
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={handleSecurityChange}
                  className="max-w-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  Number of failed attempts before account lockout
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecuritySettings}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>
                Configure third-party integrations and API keys.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This section allows you to connect with payment processors, email services, and other external APIs.
              </p>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Payment Gateway</h3>
                  <p className="text-sm text-muted-foreground mb-2">Connect your payment processor</p>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Email Service</h3>
                  <p className="text-sm text-muted-foreground mb-2">Set up your email delivery service</p>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-2">Connect analytics tools</p>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Customize colors, logos, and other visual elements of your membership site.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Theme Colors</h3>
                  <div className="flex space-x-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-primary border"></div>
                    <div className="w-8 h-8 rounded-full bg-secondary border"></div>
                    <div className="w-8 h-8 rounded-full bg-accent border"></div>
                    <div className="w-8 h-8 rounded-full bg-background border"></div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Logo Upload</h3>
                  <Button variant="outline" className="mt-2">Upload Logo</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
