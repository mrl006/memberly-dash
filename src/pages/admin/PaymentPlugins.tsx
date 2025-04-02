
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Download, 
  Check, 
  X, 
  Search, 
  Settings,
  Info,
  Plus,
  Trash,
  Edit,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { paymentPluginsService } from "@/services/paymentPluginsService";
import { Toaster } from "@/components/ui/toaster";

// Payment plugin types
type PaymentMethod = "card" | "paypal" | "crypto" | "bank" | "regional";
type PluginStatus = "active" | "inactive" | "not_installed";

interface PaymentPlugin {
  id: string;
  name: string;
  description: string;
  category: PaymentMethod;
  status: PluginStatus;
  price: "Free" | "Premium";
  version: string;
  documentation: string;
  apiKey?: string;
  settings?: Record<string, any>;
}

const PaymentPlugins = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [paymentPlugins, setPaymentPlugins] = useState<PaymentPlugin[]>([]);
  const [selectedPlugin, setSelectedPlugin] = useState<PaymentPlugin | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PaymentPlugin;
    direction: 'ascending' | 'descending';
  } | null>(null);
  
  useEffect(() => {
    // Load plugins from the service
    const plugins = paymentPluginsService.getPaymentPlugins();
    setPaymentPlugins(plugins);
  }, []);

  const filteredPlugins = paymentPlugins.filter(plugin => {
    // Filter by search term
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && plugin.status === "active";
    if (activeTab === "inactive") return matchesSearch && plugin.status === "inactive";
    if (activeTab === "not_installed") return matchesSearch && plugin.status === "not_installed";
    if (activeTab === "free") return matchesSearch && plugin.price === "Free";
    if (activeTab === "premium") return matchesSearch && plugin.price === "Premium";
    
    // Filter by category
    return matchesSearch && plugin.category === activeTab;
  });

  // Sort the plugins
  const sortedPlugins = [...filteredPlugins];
  if (sortConfig !== null) {
    sortedPlugins.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }
  
  const handleInstallPlugin = (pluginId: string) => {
    setIsLoading(true);
    
    // Call the service to install the plugin
    const success = paymentPluginsService.installPlugin(pluginId);
    
    setTimeout(() => {
      if (success) {
        setPaymentPlugins([...paymentPluginsService.getPaymentPlugins()]);
        
        toast({
          title: "Plugin Installed",
          description: "The payment plugin has been successfully installed. Configure it to activate.",
        });
      } else {
        toast({
          title: "Installation Failed",
          description: "Failed to install the plugin. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handleUninstallPlugin = (pluginId: string) => {
    setIsLoading(true);
    
    // Call the service to uninstall the plugin
    const success = paymentPluginsService.uninstallPlugin(pluginId);
    
    setTimeout(() => {
      if (success) {
        setPaymentPlugins([...paymentPluginsService.getPaymentPlugins()]);
        
        toast({
          title: "Plugin Uninstalled",
          description: "The payment plugin has been successfully uninstalled.",
        });
      } else {
        toast({
          title: "Uninstallation Failed",
          description: "Failed to uninstall the plugin. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handleTogglePlugin = (pluginId: string, enabled: boolean) => {
    // Call the service to toggle the plugin status
    const success = paymentPluginsService.togglePluginStatus(pluginId, enabled);
    
    if (success) {
      setPaymentPlugins([...paymentPluginsService.getPaymentPlugins()]);
      
      toast({
        title: enabled ? "Plugin Enabled" : "Plugin Disabled",
        description: `The payment plugin has been ${enabled ? "enabled" : "disabled"}.`,
      });
    } else {
      toast({
        title: "Status Update Failed",
        description: "Failed to update the plugin status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleConfigurePlugin = (plugin: PaymentPlugin) => {
    setSelectedPlugin(plugin);
    setApiKey(plugin.apiKey || "");
    setShowApiKey(false);
    setIsConfigOpen(true);
  };
  
  const savePluginConfiguration = () => {
    if (!selectedPlugin) return;
    
    setIsLoading(true);
    
    // Call the service to configure the plugin
    const success = paymentPluginsService.configurePlugin(selectedPlugin.id, apiKey);
    
    setTimeout(() => {
      if (success) {
        setPaymentPlugins([...paymentPluginsService.getPaymentPlugins()]);
        setIsConfigOpen(false);
        
        toast({
          title: "Configuration Saved",
          description: "The payment plugin configuration has been successfully saved and activated.",
        });
      } else {
        toast({
          title: "Configuration Failed",
          description: "Failed to configure the plugin. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handleSort = (key: keyof PaymentPlugin) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };
  
  const getCategoryIcon = (category: PaymentMethod) => {
    switch (category) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "paypal":
        return <CreditCard className="h-4 w-4" />;
      case "crypto":
        return <CreditCard className="h-4 w-4" />;
      case "bank":
        return <CreditCard className="h-4 w-4" />;
      case "regional":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: PluginStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Inactive
          </Badge>
        );
      case "not_installed":
        return (
          <Badge variant="outline" className="text-gray-500">
            Not Installed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedPlugins.length > 0 ? (
        sortedPlugins.map((plugin) => (
          <Card key={plugin.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(plugin.category)}
                  <CardTitle className="text-lg">{plugin.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(plugin.status)}
                  <Badge variant={plugin.price === "Free" ? "default" : "secondary"}>
                    {plugin.price}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-xs mt-1">Version {plugin.version}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">{plugin.description}</p>
              
              {plugin.status !== "not_installed" && plugin.apiKey && (
                <div className="mt-3 bg-slate-50 p-2 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">API Key:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        const pluginIndex = paymentPlugins.findIndex(p => p.id === plugin.id);
                        if (pluginIndex !== -1) {
                          const updatedPlugins = [...paymentPlugins];
                          const currentPlugin = { ...updatedPlugins[pluginIndex] };
                          currentPlugin._showApiKey = !currentPlugin._showApiKey;
                          updatedPlugins[pluginIndex] = currentPlugin;
                          setPaymentPlugins(updatedPlugins);
                        }
                      }}
                    >
                      {plugin._showApiKey ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="font-mono mt-1 break-all">
                    {plugin._showApiKey ? plugin.apiKey : "•".repeat(12)}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-2 pb-4">
              {plugin.status !== "not_installed" ? (
                <>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`toggle-${plugin.id}`} 
                      checked={plugin.status === "active"} 
                      onCheckedChange={(checked) => handleTogglePlugin(plugin.id, checked)}
                      disabled={!plugin.apiKey}
                    />
                    <span className="text-xs">{plugin.status === "active" ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigurePlugin(plugin)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUninstallPlugin(plugin.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Uninstall
                    </Button>
                  </div>
                </>
              ) : (
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleInstallPlugin(plugin.id)}
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install Plugin
                </Button>
              )}
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No payment plugins found</h3>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
  
  const renderTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-2">
                Name
                {sortConfig?.key === 'name' && (
                  sortConfig.direction === 'ascending' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                )}
              </div>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-2">
                Status
                {sortConfig?.key === 'status' && (
                  sortConfig.direction === 'ascending' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center gap-2">
                Price
                {sortConfig?.key === 'price' && (
                  sortConfig.direction === 'ascending' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlugins.length > 0 ? (
            sortedPlugins.map((plugin) => (
              <TableRow key={plugin.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{plugin.name}</span>
                    <span className="text-xs text-gray-500">v{plugin.version}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(plugin.category)}
                    <span className="capitalize">{plugin.category}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(plugin.status)}</TableCell>
                <TableCell>
                  <Badge variant={plugin.price === "Free" ? "default" : "secondary"}>
                    {plugin.price}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {plugin.status !== "not_installed" ? (
                    <div className="flex items-center justify-end gap-2">
                      <Switch 
                        id={`toggle-table-${plugin.id}`} 
                        checked={plugin.status === "active"} 
                        onCheckedChange={(checked) => handleTogglePlugin(plugin.id, checked)}
                        disabled={!plugin.apiKey}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigurePlugin(plugin)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUninstallPlugin(plugin.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleInstallPlugin(plugin.id)}
                      disabled={isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Install
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex flex-col items-center justify-center">
                  <CreditCard className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No payment plugins found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Plugins</h1>
        <p className="text-muted-foreground">
          Install and configure payment gateways to accept payments on your platform
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search payment plugins..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="flex-1 sm:flex-none"
          >
            <i className="grid-view-icon"></i>
            Grid View
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="flex-1 sm:flex-none"
          >
            <i className="table-view-icon"></i>
            Table View
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="card">Cards</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="bank">Bank</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
            {viewMode === "grid" ? renderGridView() : renderTableView()}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Plugin Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Payment Plugin</DialogTitle>
            <DialogDescription>
              {selectedPlugin?.name} - Enter the required API keys and settings to activate this payment gateway.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="api-key">API Key</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            
            {selectedPlugin?.category === "crypto" && (
              <div className="grid gap-2">
                <Label htmlFor="crypto-network">Default Network</Label>
                <Select defaultValue="eth">
                  <SelectTrigger id="crypto-network">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">Ethereum</SelectItem>
                    <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {selectedPlugin?.category === "card" && (
              <div className="grid gap-2">
                <Label htmlFor="payment-mode">Payment Mode</Label>
                <Select defaultValue="live">
                  <SelectTrigger id="payment-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test Mode</SelectItem>
                    <SelectItem value="live">Live Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <p className="font-medium">Documentation</p>
                  <p className="mt-1">
                    For detailed information on how to obtain your API keys and configure this 
                    payment gateway, please refer to the 
                    <a 
                      href={selectedPlugin?.documentation} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline px-1"
                    >
                      official documentation
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfigOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={savePluginConfiguration}
              disabled={isLoading || !apiKey}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
};

export default PaymentPlugins;
