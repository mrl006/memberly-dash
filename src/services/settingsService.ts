
import { toast } from "@/hooks/use-toast";
import { getSettingsCollection } from "./dbService";

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

// Internal state to cache settings
let cachedGeneralSettings: GeneralSettings = {...defaultGeneralSettings};
let cachedSecuritySettings: SecuritySettings = {...defaultSecuritySettings};

// Get local general settings fallback
const getLocalGeneralSettings = (): GeneralSettings => {
  try {
    const storedSettings = localStorage.getItem('generalSettings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (e) {
    console.error('Error retrieving general settings from localStorage:', e);
  }
  return defaultGeneralSettings;
};

// Get local security settings fallback
const getLocalSecuritySettings = (): SecuritySettings => {
  try {
    const storedSettings = localStorage.getItem('securitySettings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (e) {
    console.error('Error retrieving security settings from localStorage:', e);
  }
  return defaultSecuritySettings;
};

// Get general settings - synchronous version for React state
export const getGeneralSettings = (): GeneralSettings => {
  return cachedGeneralSettings;
};

// Get general settings - async version for database operations
export const fetchGeneralSettings = async (): Promise<GeneralSettings> => {
  try {
    const collection = await getSettingsCollection();
    if (!collection) {
      const localSettings = getLocalGeneralSettings();
      cachedGeneralSettings = localSettings;
      return localSettings;
    }
    
    const settings = await collection.findOne({ type: 'general' });
    if (settings) {
      cachedGeneralSettings = settings.data as GeneralSettings;
      return cachedGeneralSettings;
    } else {
      // If no settings in DB, save the defaults
      await collection.insertOne({ 
        type: 'general', 
        data: defaultGeneralSettings 
      });
      cachedGeneralSettings = defaultGeneralSettings;
      return defaultGeneralSettings;
    }
  } catch (e) {
    console.error('Error retrieving general settings from MongoDB:', e);
    const localSettings = getLocalGeneralSettings();
    cachedGeneralSettings = localSettings;
    return localSettings;
  }
};

// Save general settings
export const saveGeneralSettings = async (settings: GeneralSettings): Promise<void> => {
  // Update cache immediately
  cachedGeneralSettings = settings;

  try {
    const collection = await getSettingsCollection();
    if (!collection) {
      throw new Error('Database connection failed');
    }
    
    await collection.updateOne(
      { type: 'general' },
      { $set: { data: settings } },
      { upsert: true }
    );
    
    toast({
      title: "Settings Saved",
      description: "Your general settings have been saved successfully.",
    });
  } catch (e) {
    console.error('Error saving general settings to MongoDB:', e);
    
    // Fallback to localStorage
    try {
      localStorage.setItem('generalSettings', JSON.stringify(settings));
      toast({
        title: "Settings Saved Locally",
        description: "Settings saved to local storage only. Database connection failed.",
        variant: "destructive",
      });
    } catch (localError) {
      console.error('Error saving general settings to localStorage:', localError);
      toast({
        title: "Error",
        description: "Failed to save general settings.",
        variant: "destructive",
      });
    }
  }
};

// Get security settings - synchronous version for React state
export const getSecuritySettings = (): SecuritySettings => {
  return cachedSecuritySettings;
};

// Get security settings - async version for database operations
export const fetchSecuritySettings = async (): Promise<SecuritySettings> => {
  try {
    const collection = await getSettingsCollection();
    if (!collection) {
      const localSettings = getLocalSecuritySettings();
      cachedSecuritySettings = localSettings;
      return localSettings;
    }
    
    const settings = await collection.findOne({ type: 'security' });
    if (settings) {
      cachedSecuritySettings = settings.data as SecuritySettings;
      return cachedSecuritySettings;
    } else {
      // If no settings in DB, save the defaults
      await collection.insertOne({ 
        type: 'security', 
        data: defaultSecuritySettings 
      });
      cachedSecuritySettings = defaultSecuritySettings;
      return defaultSecuritySettings;
    }
  } catch (e) {
    console.error('Error retrieving security settings from MongoDB:', e);
    const localSettings = getLocalSecuritySettings();
    cachedSecuritySettings = localSettings;
    return localSettings;
  }
};

// Save security settings
export const saveSecuritySettings = async (settings: SecuritySettings): Promise<void> => {
  // Update cache immediately
  cachedSecuritySettings = settings;

  try {
    const collection = await getSettingsCollection();
    if (!collection) {
      throw new Error('Database connection failed');
    }
    
    await collection.updateOne(
      { type: 'security' },
      { $set: { data: settings } },
      { upsert: true }
    );
    
    toast({
      title: "Settings Saved",
      description: "Your security settings have been saved successfully.",
    });
  } catch (e) {
    console.error('Error saving security settings to MongoDB:', e);
    
    // Fallback to localStorage
    try {
      localStorage.setItem('securitySettings', JSON.stringify(settings));
      toast({
        title: "Settings Saved Locally",
        description: "Settings saved to local storage only. Database connection failed.",
        variant: "destructive",
      });
    } catch (localError) {
      console.error('Error saving security settings to localStorage:', localError);
      toast({
        title: "Error",
        description: "Failed to save security settings.",
        variant: "destructive",
      });
    }
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

// Initialize the database connection and settings on app startup
export const initializeSettings = async (): Promise<void> => {
  // Attempt to load settings from database
  await fetchGeneralSettings();
  await fetchSecuritySettings();
  
  // Apply the general settings to the app
  applyGeneralSettings();
};
