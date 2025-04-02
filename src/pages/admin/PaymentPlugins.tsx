
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
import { CreditCard, Download, CheckCircle, AlertCircle, Search, Bitcoin, DollarSign, ChevronsUpDown } from "lucide-react";
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
import { paymentPluginsService } from "@/services/paymentPluginsService";

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
  const [paymentPlugins, setPaymentPlugins] = useState<PaymentPlugin[]>([]);
  const [selectedPlugin, setSelectedPlugin] = useState<PaymentPlugin | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  const handleInstallPlugin = (pluginId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPaymentPlugins(prevPlugins => 
        prevPlugins.map(plugin => 
          plugin.id === pluginId 
            ? { ...plugin, status: "inactive" } 
            : plugin
        )
      );
      
      setIsLoading(false);
      toast({
        title: "Plugin Installed",
        description: "The payment plugin has been successfully installed. Configure it to activate.",
      });
    }, 1000);
  };
  
  const handleUninstallPlugin = (pluginId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPaymentPlugins(prevPlugins => 
        prevPlugins.map(plugin => 
          plugin.id === pluginId 
            ? { ...plugin, status: "not_installed", apiKey: undefined } 
            : plugin
        )
      );
      
      setIsLoading(false);
      toast({
        title: "Plugin Uninstalled",
        description: "The payment plugin has been successfully uninstalled.",
      });
    }, 1000);
  };
  
  const handleTogglePlugin = (pluginId: string, enabled: boolean) => {
    setPaymentPlugins(prevPlugins => 
      prevPlugins.map(plugin => 
        plugin.id === pluginId 
          ? { ...plugin, status: enabled ? "active" : "inactive" } 
          : plugin
      )
    );
    
    toast({
      title: enabled ? "Plugin Enabled" : "Plugin Disabled",
      description: `The payment plugin has been ${enabled ? "enabled" : "disabled"}.`,
    });
  };
  
  const handleConfigurePlugin = (plugin: PaymentPlugin) => {
    setSelectedPlugin(plugin);
    setApiKey(plugin.apiKey || "");
    setIsConfigOpen(true);
  };
  
  const savePluginConfiguration = () => {
    if (!selectedPlugin) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPaymentPlugins(prevPlugins => 
        prevPlugins.map(plugin => 
          plugin.id === selectedPlugin.id 
            ? { ...plugin, apiKey, status: "active" } 
            : plugin
        )
      );
      
      setIsLoading(false);
      setIsConfigOpen(false);
      
      toast({
        title: "Configuration Saved",
        description: "The payment plugin configuration has been successfully saved and activated.",
      });
    }, 1000);
  };
  
  const getCategoryIcon = (category: PaymentMethod) => {
    switch (category) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "paypal":
        return <DollarSign className="h-4 w-4" />;
      case "crypto":
        return <Bitcoin className="h-4 w-4" />;
      case "bank":
        return <DollarSign className="h-4 w-4" />;
      case "regional":
        return <ChevronsUpDown className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Plugins</h1>
        <p className="text-muted-foreground">
          Install and configure payment gateways to accept payments on your platform
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search payment plugins..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlugins.length > 0 ? (
                filteredPlugins.map((plugin) => (
                  <Card key={plugin.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(plugin.category)}
                          <CardTitle className="text-lg">{plugin.name}</CardTitle>
                        </div>
                        <Badge variant={plugin.price === "Free" ? "default" : "secondary"}>
                          {plugin.price}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">Version {plugin.version}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">{plugin.description}</p>
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
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUninstallPlugin(plugin.id)}
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
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
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
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
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={savePluginConfiguration}
              disabled={isLoading || !apiKey}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentPlugins;
