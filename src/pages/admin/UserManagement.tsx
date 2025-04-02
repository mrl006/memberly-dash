import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Filter, MoreHorizontal, X, Check, AlertTriangle, Trash2, Edit, Shield, Bug } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getUsers, updateUser, deleteUser, toggleUserStatus, addUser, User } from "@/services/userService";

interface UserFormData {
  name: string;
  email: string;
  subscription: string;
  password?: string;
  confirmPassword?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    subscription: "Basic",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [subscriptionFilter, setSubscriptionFilter] = useState<string | null>(null);

  const { toast } = useToast();
  
  // Load users with error handling
  const loadUsers = () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Get users from our service which uses localStorage
      const loadedUsers = getUsers();
      setUsers(loadedUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load users");
      
      toast({
        title: "Error loading users",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load users on component mount and whenever the user list might change
  useEffect(() => {
    loadUsers();
  }, []);
  
  // Filter users based on search term and filters
  const filteredUsers = users.filter(
    (user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter ? user.status === statusFilter : true;
      const matchesSubscription = subscriptionFilter ? user.subscription === subscriptionFilter : true;
      
      return matchesSearch && matchesStatus && matchesSubscription;
    }
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!isEditUserOpen) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subscription: "Basic",
      password: "",
      confirmPassword: "",
    });
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subscription: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Add user to our service
      const newUser = addUser({
        name: formData.name,
        email: formData.email,
        subscription: formData.subscription,
      });
      
      // Update local state to reflect new user
      setUsers([...users, newUser]);
      setIsAddUserOpen(false);
      resetForm();
      
      toast({
        title: "User Added",
        description: `${formData.name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedUser) return;
    
    setLoading(true);
    
    try {
      // Update user in our service
      const updatedUser = updateUser(selectedUser.id, {
        name: formData.name,
        email: formData.email,
        subscription: formData.subscription,
      });
      
      if (updatedUser) {
        // Update local state
        setUsers(users.map((user) =>
          user.id === selectedUser.id ? updatedUser : user
        ));
      }
      
      setIsEditUserOpen(false);
      resetForm();
      
      toast({
        title: "User Updated",
        description: `${formData.name}'s details have been updated.`,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete user from our service
      const success = deleteUser(userId);
      
      if (success) {
        // Update local state
        setUsers(users.filter((user) => user.id !== userId));
        
        toast({
          title: "User Deleted",
          description: "User has been permanently removed.",
        });
      } else {
        toast({
          title: "Error",
          description: "User not found or could not be deleted.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      // Toggle user status in our service
      const updatedUser = toggleUserStatus(userId);
      
      if (updatedUser) {
        // Update local state
        setUsers(users.map((user) =>
          user.id === userId ? updatedUser : user
        ));
        
        toast({
          title: `User ${updatedUser.status === "active" ? "Activated" : "Deactivated"}`,
          description: `User status has been updated to ${updatedUser.status}.`,
        });
      } else {
        toast({
          title: "Error",
          description: "User not found or could not be updated.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      password: "",
      confirmPassword: "",
    });
    setIsEditUserOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setSubscriptionFilter(null);
  };

  // If there's a critical error, show diagnostic information
  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            View and manage your platform users.
          </p>
        </div>
        
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="flex items-center text-red-700">
              <Bug className="mr-2 h-5 w-5" />
              User Section Error
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-4">
              {errorMessage || "There was a problem loading the user management section."}
            </p>
            <div className="flex justify-end">
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            View and manage your platform users.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-9 w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <Label className="text-xs">Status</Label>
                  <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2">
                  <Label className="text-xs">Subscription</Label>
                  <Select value={subscriptionFilter || ""} onValueChange={(value) => setSubscriptionFilter(value || null)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All subscriptions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All subscriptions</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <DropdownMenuSeparator />
                <Button variant="ghost" size="sm" className="w-full justify-center mt-1" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account. They'll receive an email to set their password.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="e.g. John Doe"
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="e.g. john.doe@example.com"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subscription">Subscription</Label>
                    <Select onValueChange={handleSelectChange} value={formData.subscription}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subscription" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      placeholder="••••••••"
                      className={formErrors.password ? "border-red-500" : ""}
                    />
                    {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword} 
                      onChange={handleInputChange} 
                      placeholder="••••••••"
                      className={formErrors.confirmPassword ? "border-red-500" : ""}
                    />
                    {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sendEmail" />
                    <Label htmlFor="sendEmail" className="text-sm font-normal cursor-pointer">
                      Send welcome email with login details
                    </Label>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => {
                      setIsAddUserOpen(false);
                      resetForm();
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        "Add User"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Platform Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10">
                <div className="flex justify-center items-center space-x-2">
                  <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm font-medium">Loading users...</span>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-1">No Users Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No users match your current filters.
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.subscription}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : user.status === "inactive"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditModal(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, user.status)}>
                                {user.status === "active" ? (
                                  <>
                                    <X className="h-4 w-4 mr-2" />
                                    Deactivate User
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Activate User
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the user
                                      account and remove their data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details and subscription information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-subscription">Subscription</Label>
                <Select onValueChange={handleSelectChange} value={formData.subscription}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => {
                  setIsEditUserOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default UserManagement;
