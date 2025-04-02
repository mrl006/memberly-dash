
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Key, 
  Plus, 
  Copy, 
  Trash, 
  RefreshCcw, 
  Import, 
  Check, 
  AlertCircle 
} from "lucide-react";

interface ApiKey {
  id: string;
  key: string;
  name: string;
  status: "Active" | "Expired" | "Revoked";
  created: string;
  expires: string;
  lastUsed?: string;
}

const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const generateApiKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const prefix = 'mbly';
  let result = prefix + '_';
  
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

const calculateExpiryDate = (duration: number, unit: string): string => {
  const date = new Date();
  
  switch (unit) {
    case 'days':
      date.setDate(date.getDate() + duration);
      break;
    case 'months':
      date.setMonth(date.getMonth() + duration);
      break;
    case 'years':
      date.setFullYear(date.getFullYear() + duration);
      break;
    default:
      break;
  }
  
  return date.toISOString();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [durationUnit, setDurationUnit] = useState('days');
  const [generatedKey, setGeneratedKey] = useState('');
  const [importedKey, setImportedKey] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('keys');
  const { toast } = useToast();

  useEffect(() => {
    // In a real application, we would fetch API keys from a database
    // For now, let's use localStorage to simulate persistence
    const storedKeys = localStorage.getItem('apiKeys');
    if (storedKeys) {
      setApiKeys(JSON.parse(storedKeys));
    }
  }, []);

  const saveApiKeys = (keys: ApiKey[]) => {
    localStorage.setItem('apiKeys', JSON.stringify(keys));
    setApiKeys(keys);
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for the API key",
        variant: "destructive"
      });
      return;
    }

    const key = generateApiKey();
    const expiryDate = calculateExpiryDate(duration, durationUnit);
    
    const newKey: ApiKey = {
      id: generateUniqueId(),
      key,
      name: newKeyName,
      status: "Active",
      created: new Date().toISOString(),
      expires: expiryDate
    };
    
    const updatedKeys = [...apiKeys, newKey];
    saveApiKeys(updatedKeys);
    
    setGeneratedKey(key);
    setNewKeyName('');
    
    toast({
      title: "Success",
      description: "API key created successfully"
    });
  };

  const handleRevokeKey = (id: string) => {
    const updatedKeys = apiKeys.map(key => 
      key.id === id ? { ...key, status: "Revoked" as const } : key
    );
    
    saveApiKeys(updatedKeys);
    
    toast({
      title: "Key Revoked",
      description: "The API key has been revoked successfully"
    });
  };

  const handleDeleteKey = (id: string) => {
    const updatedKeys = apiKeys.filter(key => key.id !== id);
    saveApiKeys(updatedKeys);
    
    toast({
      title: "Key Deleted",
      description: "The API key has been deleted successfully"
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      toast({
        title: "Copied",
        description: "API key copied to clipboard"
      });
    });
  };

  const handleImportKey = () => {
    if (!importedKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive"
      });
      return;
    }

    setImportStatus('loading');
    
    // Simulate API call to validate the key
    setTimeout(() => {
      const isValidKey = importedKey.startsWith('mbly_') && importedKey.length > 36;
      
      if (isValidKey) {
        setImportStatus('success');
        toast({
          title: "Success",
          description: "API key imported successfully. Products are now available."
        });
        
        // In a real application, we would store the imported key
        localStorage.setItem('importedApiKey', importedKey);
      } else {
        setImportStatus('error');
        toast({
          title: "Error",
          description: "Invalid API key",
          variant: "destructive"
        });
      }
      
      setTimeout(() => {
        if (isValidKey) {
          setIsImportDialogOpen(false);
          setImportedKey('');
          setImportStatus('idle');
        }
      }, 1500);
    }, 1500);
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    setGeneratedKey('');
    setNewKeyName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">API Key Management</h1>
        <div className="flex space-x-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Import className="mr-2 h-4 w-4" /> Import API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import API Key</DialogTitle>
                <DialogDescription>
                  Enter an API key to access products from another Memberly instance.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    placeholder="Enter API key (e.g., mbly_...)"
                    value={importedKey}
                    onChange={(e) => setImportedKey(e.target.value)}
                  />
                </div>
                
                {importStatus === 'success' && (
                  <div className="rounded-md bg-green-50 p-4 mt-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Key validated successfully
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {importStatus === 'error' && (
                  <div className="rounded-md bg-red-50 p-4 mt-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          Invalid API key
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleImportKey} 
                  disabled={importStatus === 'loading'}
                >
                  {importStatus === 'loading' ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : "Import Key"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Generate API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate new API Key</DialogTitle>
                <DialogDescription>
                  Create a new API key for resellers to access your products.
                </DialogDescription>
              </DialogHeader>
              
              {!generatedKey ? (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g., Reseller Company Name"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Expiration</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        min="1"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                        className="w-24"
                      />
                      <Select value={durationUnit} onValueChange={setDurationUnit}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                          <SelectItem value="years">Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="rounded-md bg-primary/10 p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-3 w-full">
                        <p className="text-sm font-medium">Your new API key</p>
                        <div className="mt-1 relative">
                          <Input
                            value={generatedKey}
                            readOnly
                            className="font-mono text-xs pr-10"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0"
                            onClick={() => handleCopyKey(generatedKey)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Important:</strong> This key will only be displayed once. Please copy it now and store it securely.
                  </p>
                </div>
              )}
              
              <DialogFooter>
                {!generatedKey ? (
                  <Button onClick={handleCreateKey}>Generate Key</Button>
                ) : (
                  <Button onClick={handleCreateDialogClose}>Close</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="keys">Your API Keys</TabsTrigger>
          <TabsTrigger value="imported">Imported Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keys" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated API Keys</CardTitle>
              <CardDescription>
                Manage API keys for resellers to access your products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.length > 0 ? (
                      apiKeys.map((apiKey) => (
                        <TableRow key={apiKey.id}>
                          <TableCell className="font-medium">{apiKey.name}</TableCell>
                          <TableCell>{formatDate(apiKey.created)}</TableCell>
                          <TableCell>{formatDate(apiKey.expires)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                apiKey.status === "Active" && !isExpired(apiKey.expires)
                                  ? "bg-green-100 text-green-800"
                                  : apiKey.status === "Revoked"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {isExpired(apiKey.expires) && apiKey.status === "Active"
                                ? "Expired" 
                                : apiKey.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyKey(apiKey.key)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              
                              {apiKey.status === "Active" && !isExpired(apiKey.expires) && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to revoke this API key? Resellers using this key will immediately lose access to your products.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleRevokeKey(apiKey.id)}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                      >
                                        Revoke Key
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                              
                              {(apiKey.status === "Revoked" || isExpired(apiKey.expires)) && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this API key? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteKey(apiKey.id)}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No API keys generated yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="imported" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Imported API Keys</CardTitle>
              <CardDescription>
                Manage API keys from other Memberly instances.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {localStorage.getItem('importedApiKey') ? (
                <div className="space-y-4">
                  <div className="rounded-md bg-primary/10 p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-3 w-full">
                        <p className="text-sm font-medium">Active API key</p>
                        <div className="mt-1 relative">
                          <Input
                            value={localStorage.getItem('importedApiKey') || ''}
                            readOnly
                            className="font-mono text-xs pr-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash className="mr-2 h-4 w-4" /> Remove Imported Key
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this imported API key? You will lose access to the associated products.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              localStorage.removeItem('importedApiKey');
                              toast({
                                title: "Key Removed",
                                description: "The imported API key has been removed successfully"
                              });
                              setActiveTab('keys');
                            }}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">No API Keys Imported</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Import an API key to access products from another Memberly instance and resell them to your customers.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsImportDialogOpen(true)}
                  >
                    <Import className="mr-2 h-4 w-4" /> Import API Key
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiKeyManagement;
