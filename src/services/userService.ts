
import { toast } from "@/hooks/use-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: string;
  status: string;
  joined: string;
}

// Retrieve users from localStorage
const getInitialUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (e) {
      console.error('Error parsing stored users:', e);
    }
  }
  
  // Return empty array if no users in localStorage
  return [];
};

// Get all users
export const getUsers = (): User[] => {
  return getInitialUsers();
};

// Add a new user
export const addUser = (user: Omit<User, 'id' | 'joined' | 'status'>): User => {
  const users = getUsers();
  
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
  
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  
  return newUser;
};

// Update an existing user
export const updateUser = (userId: string, userData: Partial<User>): User | null => {
  const users = getUsers();
  
  const updatedUsers = users.map((user) =>
    user.id === userId ? { ...user, ...userData } : user
  );
  
  const updatedUser = updatedUsers.find(user => user.id === userId) || null;
  
  if (updatedUser) {
    saveUsers(updatedUsers);
    return updatedUser;
  }
  
  return null;
};

// Delete a user
export const deleteUser = (userId: string): boolean => {
  const users = getUsers();
  
  const updatedUsers = users.filter((user) => user.id !== userId);
  
  if (updatedUsers.length < users.length) {
    saveUsers(updatedUsers);
    return true;
  }
  
  return false;
};

// Toggle user status (active/inactive)
export const toggleUserStatus = (userId: string): User | null => {
  const users = getUsers();
  const userToUpdate = users.find(user => user.id === userId);
  
  if (!userToUpdate) return null;
  
  const newStatus = userToUpdate.status === "active" ? "inactive" : "active";
  
  return updateUser(userId, { status: newStatus });
};

// Find a user by email - used for authentication
export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Save users to localStorage
const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to localStorage:', e);
    toast({
      title: "Error",
      description: "Failed to save user data. Please try again.",
      variant: "destructive",
    });
  }
};
