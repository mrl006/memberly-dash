
import { toast } from "@/hooks/use-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: string;
  status: string;
  joined: string;
}

// Retrieve users from localStorage or use default data
const getInitialUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (e) {
      console.error('Error parsing stored users:', e);
    }
  }

  // Default users if none in localStorage
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      subscription: "Professional",
      status: "active",
      joined: "Apr 23, 2023",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      subscription: "Basic",
      status: "active",
      joined: "May 12, 2023",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      subscription: "Professional",
      status: "inactive",
      joined: "Jan 5, 2023",
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice.brown@example.com",
      subscription: "Premium",
      status: "active",
      joined: "Mar 18, 2023",
    },
    {
      id: "5",
      name: "Charlie Davis",
      email: "charlie.davis@example.com",
      subscription: "Basic",
      status: "expired",
      joined: "Feb 27, 2023",
    },
  ];
};

// Get all users
export const getUsers = (): User[] => {
  return getInitialUsers();
};

// Add a new user
export const addUser = (user: Omit<User, 'id' | 'joined' | 'status'>): User => {
  const users = getUsers();
  
  const newUser: User = {
    ...user,
    id: (users.length + 1).toString(),
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
