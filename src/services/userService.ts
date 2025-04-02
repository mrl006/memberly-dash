
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

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const collection = await getUsersCollection();
    if (!collection) {
      return getLocalUsers();
    }
    
    const users = await collection.find({}).toArray();
    return users as User[];
  } catch (error) {
    console.error('Error fetching users from MongoDB:', error);
    toast({
      title: "Database Error",
      description: "Failed to fetch users. Using local data instead.",
      variant: "destructive",
    });
    return getLocalUsers();
  }
};

// Add a new user
export const addUser = async (user: Omit<User, 'id' | 'joined' | 'status'>): Promise<User> => {
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
  
  try {
    const collection = await getUsersCollection();
    if (!collection) {
      throw new Error('Database connection failed');
    }
    
    await collection.insertOne(newUser);
    return newUser;
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
    
    return newUser;
  }
};

// Update an existing user
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  try {
    const collection = await getUsersCollection();
    if (!collection) {
      throw new Error('Database connection failed');
    }
    
    const result = await collection.findOneAndUpdate(
      { id: userId },
      { $set: userData },
      { returnDocument: 'after' }
    );
    
    return result as unknown as User;
  } catch (error) {
    console.error('Error updating user in MongoDB:', error);
    
    // Fallback to localStorage
    const users = getLocalUsers();
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, ...userData } : user
    );
    
    const updatedUser = updatedUsers.find(user => user.id === userId) || null;
    
    if (updatedUser) {
      saveLocalUsers(updatedUsers);
      
      toast({
        title: "Database Warning",
        description: "User updated locally only. Database connection failed.",
        variant: "destructive",
      });
      
      return updatedUser;
    }
    
    return null;
  }
};

// Delete a user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const collection = await getUsersCollection();
    if (!collection) {
      throw new Error('Database connection failed');
    }
    
    const result = await collection.deleteOne({ id: userId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting user from MongoDB:', error);
    
    // Fallback to localStorage
    const users = getLocalUsers();
    const updatedUsers = users.filter((user) => user.id !== userId);
    
    if (updatedUsers.length < users.length) {
      saveLocalUsers(updatedUsers);
      
      toast({
        title: "Database Warning",
        description: "User deleted locally only. Database connection failed.",
        variant: "destructive",
      });
      
      return true;
    }
    
    return false;
  }
};

// Toggle user status (active/inactive)
export const toggleUserStatus = async (userId: string): Promise<User | null> => {
  const users = await getUsers();
  const userToUpdate = users.find(user => user.id === userId);
  
  if (!userToUpdate) return null;
  
  const newStatus = userToUpdate.status === "active" ? "inactive" : "active";
  
  return updateUser(userId, { status: newStatus });
};

// Find a user by email - used for authentication
export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const users = await getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
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
