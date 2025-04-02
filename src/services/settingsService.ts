
import { toast } from "@/hooks/use-toast";

// Define interfaces for our settings
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordExpiry: boolean;
  loginAttempts: string;
}

// Default settings
const defaultGeneralSettings: GeneralSettings = {
  siteName: "Memberly",
  siteDescription: "Your Membership Management Solution",
  contactEmail: "support@memberly.com",
  supportPhone: "+1 (555) 123-4567",
};

const defaultSecuritySettings: SecuritySettings = {
  twoFactorAuth: true,
  passwordExpiry: false,
  loginAttempts: "5",
};

// Get general settings from localStorage
export const getGeneralSettings = (): GeneralSettings => {
  try {
    const storedSettings = localStorage.getItem('generalSettings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (e) {
    console.error('Error retrieving general settings:', e);
    toast({
      title: "Error",
      description: "Failed to load general settings.",
      variant: "destructive",
    });
  }
  
  return defaultGeneralSettings;
};

// Save general settings to localStorage
export const saveGeneralSettings = (settings: GeneralSettings): void => {
  try {
    localStorage.setItem('generalSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your general settings have been saved successfully.",
    });
  } catch (e) {
    console.error('Error saving general settings:', e);
    toast({
      title: "Error",
      description: "Failed to save general settings.",
      variant: "destructive",
    });
  }
};

// Get security settings from localStorage
export const getSecuritySettings = (): SecuritySettings => {
  try {
    const storedSettings = localStorage.getItem('securitySettings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (e) {
    console.error('Error retrieving security settings:', e);
    toast({
      title: "Error",
      description: "Failed to load security settings.",
      variant: "destructive",
    });
  }
  
  return defaultSecuritySettings;
};

// Save security settings to localStorage
export const saveSecuritySettings = (settings: SecuritySettings): void => {
  try {
    localStorage.setItem('securitySettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your security settings have been saved successfully.",
    });
  } catch (e) {
    console.error('Error saving security settings:', e);
    toast({
      title: "Error",
      description: "Failed to save security settings.",
      variant: "destructive",
    });
  }
};

// Apply general settings throughout the application
export const applyGeneralSettings = (): void => {
  const settings = getGeneralSettings();
  
  // Update document title with site name
  document.title = settings.siteName;
  
  // You can extend this to apply other settings throughout the app
  // For example, update meta tags, global context, etc.
};
