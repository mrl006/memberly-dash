
import { MongoClient, Collection, Db } from 'mongodb';
import { toast } from "@/hooks/use-toast";

// Connection string - you should replace <db_password> with your actual password
const uri = "mongodb+srv://benjamin836712:<db_password>@mrlai.x0h8q.mongodb.net/?retryWrites=true&majority&appName=MRLai";

// MongoDB Client
let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;

// Collections
let usersCollection: Collection | null = null;
let settingsCollection: Collection | null = null;

// Initialize MongoDB connection
export const initDatabase = async (): Promise<boolean> => {
  if (client && db) return true; // Already connected
  if (isConnecting) return false; // Connection in progress
  
  isConnecting = true;
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    
    db = client.db('memberly');
    usersCollection = db.collection('users');
    settingsCollection = db.collection('settings');
    
    console.log('Connected to MongoDB');
    isConnecting = false;
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    toast({
      title: "Database Error",
      description: "Failed to connect to database. Please try again later.",
      variant: "destructive",
    });
    isConnecting = false;
    return false;
  }
};

// Get users collection
export const getUsersCollection = async (): Promise<Collection | null> => {
  if (!usersCollection) {
    const connected = await initDatabase();
    if (!connected) return null;
  }
  return usersCollection;
};

// Get settings collection
export const getSettingsCollection = async (): Promise<Collection | null> => {
  if (!settingsCollection) {
    const connected = await initDatabase();
    if (!connected) return null;
  }
  return settingsCollection;
};

// Close database connection (useful for cleanup)
export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    usersCollection = null;
    settingsCollection = null;
    console.log('Disconnected from MongoDB');
  }
};
