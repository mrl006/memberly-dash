import { toast } from "@/hooks/use-toast";
import { getGeneralSettings } from "./settingsService";
import { getUsersCollection } from "./dbService";

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: string;
  status: string;
  joined: string;
}

// Cache for users
let cachedUsers: User[] = [];

// Fallback to localStorage if MongoDB connection fails
const getLocalUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (e) {
      console.error('Error parsing stored users:', e);
    }
  }
  return [];
};

// Convert MongoDB document to User interface
const convertDocumentToUser = (doc: any): User => {
  // If the document already matches our User interface, return it
  if (doc.id && doc.name && doc.email && doc.subscription && doc.status && doc.joined) {
    return doc as User;
  }
  
  // Otherwise, create a User from document fields
  return {
    id: doc.id || doc._id?.toString() || Date.now().toString(36),
    name: doc.name || "Unknown User",
    email: doc.email || "no-email",
    subscription: doc.subscription || "Basic",
    status: doc.status || "active",
    joined: doc.joined || new Date().toLocaleDateString(),
  };
};

// Get all users - synchronous version for React state
export const getUsers = (): User[] => {
  if (cachedUsers.length > 0) {
    return cachedUsers;
  }
  return getLocalUsers();
};

// Fetch users from database - async version
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const collection = await getUsersCollection();
    if (!collection) {
      const localUsers = getLocalUsers();
      cachedUsers = localUsers;
      return localUsers;
    }
    
    const documents = await collection.find({}).toArray();
    const users = documents.map(doc => convertDocumentToUser(doc));
    
    // Update cache
    cachedUsers = users;
    return users;
  } catch (error) {
    console.error('Error fetching users from MongoDB:', error);
    toast({
      title: "Database Error",
      description: "Failed to fetch users. Using local data instead.",
      variant: "destructive",
    });
    const localUsers = getLocalUsers();
    cachedUsers = localUsers;
    return localUsers;
  }
};

// Add a new user
export const addUser = (user: Omit<User, 'id' | 'joined' | 'status'>): User => {
  // Generate a unique ID based on timestamp and random number
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  
  const newUser: User = {
    ...user,
    id: uniqueId,
    status: "active",
    joined: new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
  };
  
  // Add user to database asynchronously
  addUserToDatabase(newUser).catch(error => 
    console.error('Failed to add user to database:', error)
  );
  
  // Update local cache immediately
  cachedUsers = [...cachedUsers, newUser];
  
  return newUser;
};

// Helper function to add user to database
const addUserToDatabase = async (newUser: User): Promise<void> => {
  try {
    const collection = await getUsersCollection();
    if (!collection) {
      throw new Error('Database connection failed');
    }
    
    await collection.insertOne(newUser);
  } catch (error) {
    console.error('Error adding user to MongoDB:', error);
    
    // Fallback to localStorage
    const users = getLocalUsers();
    const updatedUsers = [...users, newUser];
    saveLocalUsers(updatedUsers);
    
    toast({
      title: "Database Warning",
      description: "User saved locally only. Database connection failed.",
      variant: "destructive",
    });
  }
};

// Update an existing user
export const updateUser = (userId: string, userData: Partial<User>): User | null => {
  // Find user in cache first
  const userIndex = cachedUsers.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    // If not in cache, try local storage
    const localUsers = getLocalUsers();
    const localUserIndex = localUsers.findIndex(user => user.id === userId);
    
    if (localUserIndex === -1) {
      return null; // User not found
    }
    
    const updatedUser = { ...localUsers[localUserIndex], ...userData };
    localUsers[localUserIndex] = updatedUser;
    
    // Update cache
    cachedUsers = localUsers;
    
    // Update database asynchronously
    updateUserInDatabase(userId, userData).catch(error =>
      console.error('Failed to update user in database:', error)
    );
    
    return updatedUser;
  }
  
  // Update user in cache
  const updatedUser = { ...cachedUsers[userIndex], ...userData };
  cachedUsers[userIndex] = updatedUser;
  
  // Update database asynchronously
  updateUserInDatabase(userId, userData).catch(error =>
    console.error('Failed to update user in database:', error)
  );
  
  return updatedUser;
};

// Helper function to update user in database
const updateUserInDatabase = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    const collection = await getUsersCollection();
    if (!collection) {
      throw new Error('Database connection failed');
    }
    
    await collection.findOneAndUpdate(
      { id: userId },
      { $set: userData },
      { returnDocument: 'after' }
    );
  } catch (error) {
    console.error('Error updating user in MongoDB:', error);
    
    // Fallback to localStorage
    const users = getLocalUsers();
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, ...userData } : user
    );
    
    saveLocalUsers(updatedUsers);
    
    toast({
      title: "Database Warning",
      description: "User updated locally only. Database connection failed.",
      variant: "destructive",
    });
  }
};

// Delete a user
export const deleteUser = (userId: string): boolean => {
  // Check if user exists in cache
  const userExists = cachedUsers.some(user => user.id === userId);
  
  if (!userExists) {
    // Check localStorage
    const localUsers = getLocalUsers();
    if (!localUsers.some(user => user.id === userId)) {
      return false; // User not found
    }
  }
  
  // Update cache
  cachedUsers = cachedUsers.filter(user => user.id !== userId);
  
  // Delete from database asynchronously
  deleteUserFromDatabase(userId).catch(error =>
    console.error('Failed to delete user from database:', error)
  );
  
  return true;
};

// Helper function to delete user from database
const deleteUserFromDatabase = async (userId: string): Promise<void> => {
  try {
    const collection = await getUsersCollection();
    if (!collection) {
      throw new Error('Database connection failed');
    }
    
    await collection.deleteOne({ id: userId });
  } catch (error) {
    console.error('Error deleting user from MongoDB:', error);
    
    // Fallback to localStorage
    const users = getLocalUsers();
    const updatedUsers = users.filter((user) => user.id !== userId);
    
    saveLocalUsers(updatedUsers);
    
    toast({
      title: "Database Warning",
      description: "User deleted locally only. Database connection failed.",
      variant: "destructive",
    });
  }
};

// Toggle user status (active/inactive)
export const toggleUserStatus = (userId: string): User | null => {
  const userIndex = cachedUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    return null; // User not found
  }
  
  const user = cachedUsers[userIndex];
  const newStatus = user.status === "active" ? "inactive" : "active";
  
  return updateUser(userId, { status: newStatus });
};

// Find a user by email - used for authentication
export const findUserByEmail = (email: string): User | undefined => {
  return cachedUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Helper function to save users to localStorage as fallback
const saveLocalUsers = (users: User[]): void => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to localStorage:', e);
    const settings = getGeneralSettings();
    toast({
      title: `${settings.siteName} - Error`,
      description: "Failed to save user data. Please try again.",
      variant: "destructive",
    });
  }
};

// Initialize users
export const initializeUsers = async (): Promise<void> => {
  await fetchUsers();
};
