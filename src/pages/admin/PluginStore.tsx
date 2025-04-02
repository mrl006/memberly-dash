
import { useState } from "react";
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
import { Search, Package, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock plugin data
const plugins = [
  {
    id: "badge-ranking",
    name: "User Badge & Ranking System",
    description: "Auto-assign badges based on actions. Display user ranks on profile and leaderboards.",
    category: "engagement",
    installed: false,
    price: "Free",
    version: "1.0.0"
  },
  {
    id: "affiliate",
    name: "Affiliate/Referral Plugin",
    description: "Unique referral link for every user. Tracks clicks, signups, and earnings.",
    category: "marketing",
    installed: true,
    price: "Free",
    version: "1.2.0"
  },
  {
    id: "live-chat",
    name: "Live Chat or Support Widget",
    description: "Real-time messaging between users and support/admin. Chat history saved to database.",
    category: "support",
    installed: false,
    price: "Premium",
    version: "1.1.0"
  },
  {
    id: "forms-builder",
    name: "Custom Forms Builder",
    description: "Drag-and-drop form elements. Save responses to the database. Export CSV or view submissions.",
    category: "tools",
    installed: false,
    price: "Premium",
    version: "1.0.5"
  },
  {
    id: "ai-content",
    name: "AI Content Generator",
    description: "Uses OpenAI/GPT to generate content (posts, replies, emails).",
    category: "tools",
    installed: false,
    price: "Premium",
    version: "2.0.0"
  },
  {
    id: "crypto-wallet",
    name: "Crypto Wallet Integrator",
    description: "Connect MetaMask, Phantom, or WalletConnect. Show wallet balance, send/receive tokens.",
    category: "payments",
    installed: false,
    price: "Premium",
    version: "1.0.0"
  },
  {
    id: "leaderboard",
    name: "Leaderboard Plugin",
    description: "Displays top users by score, referrals, XP, etc. Weekly, monthly, or all-time filters.",
    category: "engagement",
    installed: false,
    price: "Free",
    version: "1.0.0"
  },
  {
    id: "announcements",
    name: "Announcement Bar or Pop-up",
    description: "Schedule and publish banner messages or modals. Global or role-based targeting.",
    category: "marketing",
    installed: false,
    price: "Free",
    version: "1.0.0"
  },
  {
    id: "quests",
    name: "Task & Quest System",
    description: "Create task lists with rewards. Track task completion by user. Auto-assign based on roles.",
    category: "engagement",
    installed: false,
    price: "Premium",
    version: "1.0.0"
  },
  {
    id: "webhooks",
    name: "Webhook & API Trigger Plugin",
    description: "Trigger external APIs on user actions. Custom headers and payload setup.",
    category: "tools",
    installed: false,
    price: "Premium",
    version: "1.1.2"
  },
  {
    id: "dark-mode",
    name: "Dark/Light Mode Switcher",
    description: "UI toggle to switch between light and dark themes. Saves user preference.",
    category: "ui",
    installed: false,
    price: "Free",
    version: "1.0.0"
  },
  {
    id: "telegram",
    name: "Telegram Bot Integration",
    description: "Bot sends alerts or reminders. Users can link their Telegram to get updates.",
    category: "communication",
    installed: false,
    price: "Premium",
    version: "1.0.0"
  },
  {
    id: "push-notifications",
    name: "Push Notification Manager",
    description: "Send browser or mobile push notifications. Target by user segments or roles.",
    category: "communication",
    installed: false,
    price: "Premium",
    version: "1.0.0"
  },
  {
    id: "polls",
    name: "Polls & Voting Plugin",
    description: "Admin creates polls with multiple options. Users vote and view results.",
    category: "engagement",
    installed: false,
    price: "Free",
    version: "1.0.0"
  },
  {
    id: "subscription",
    name: "Subscription Manager",
    description: "Manage free and paid subscription plans. Integrate Stripe/PayPal/USDT.",
    category: "payments",
    installed: true,
    price: "Premium",
    version: "1.5.0"
  },
  {
    id: "dashboard-widgets",
    name: "Custom Dashboard Widgets",
    description: "Users choose which widgets to show/hide. Include stats, tips, feed, countdowns, etc.",
    category: "ui",
    installed: false,
    price: "Free",
    version: "1.0.0"
  },
  {
    id: "language",
    name: "Language & Translation Plugin",
    description: "Switch site language from dropdown. Store translations in JSON or DB.",
    category: "tools",
    installed: false,
    price: "Premium",
    version: "1.0.0"
  },
  {
    id: "calendar",
    name: "Event/Calendar Plugin",
    description: "Add platform-wide or user-specific events. Reminder notifications.",
    category: "tools",
    installed: false,
    price: "Free",
    version: "1.0.0"
  },
  {
    id: "2fa",
    name: "Two-Factor Authentication (2FA)",
    description: "Setup via email, SMS, or authenticator apps. Required at login.",
    category: "security",
    installed: true,
    price: "Free",
    version: "1.3.0"
  },
  {
    id: "media-uploader",
    name: "Media Uploader & Gallery",
    description: "Users upload files or images to their profile. Admin can moderate uploads.",
    category: "tools",
    installed: false,
    price: "Free",
    version: "1.0.0"
  }
];

const PluginStore = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [pluginsList, setPluginsList] = useState(plugins);
  
  const filteredPlugins = pluginsList.filter(plugin => {
    // Filter by search term
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "installed") return matchesSearch && plugin.installed;
    if (activeTab === "free") return matchesSearch && plugin.price === "Free";
    if (activeTab === "premium") return matchesSearch && plugin.price === "Premium";
    
    // Filter by category
    return matchesSearch && plugin.category === activeTab;
  });
  
  const handleInstallPlugin = (pluginId: string) => {
    setPluginsList(prevPlugins => 
      prevPlugins.map(plugin => 
        plugin.id === pluginId 
          ? { ...plugin, installed: true } 
          : plugin
      )
    );
    
    toast({
      title: "Plugin Installed",
      description: "The plugin has been successfully installed.",
    });
  };
  
  const handleUninstallPlugin = (pluginId: string) => {
    setPluginsList(prevPlugins => 
      prevPlugins.map(plugin => 
        plugin.id === pluginId 
          ? { ...plugin, installed: false } 
          : plugin
      )
    );
    
    toast({
      title: "Plugin Uninstalled",
      description: "The plugin has been successfully uninstalled.",
    });
  };
  
  const handleTogglePlugin = (pluginId: string, enabled: boolean) => {
    toast({
      title: enabled ? "Plugin Enabled" : "Plugin Disabled",
      description: `The plugin has been ${enabled ? "enabled" : "disabled"}.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plugin Store</h1>
        <p className="text-muted-foreground">
          Browse, install and manage plugins to extend your platform's functionality
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search plugins..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlugins.length > 0 ? (
                filteredPlugins.map((plugin) => (
                  <Card key={plugin.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{plugin.name}</CardTitle>
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
                      {plugin.installed ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Switch 
                              id={`toggle-${plugin.id}`} 
                              defaultChecked 
                              onCheckedChange={(checked) => handleTogglePlugin(plugin.id, checked)}
                            />
                            <span className="text-xs">Enabled</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUninstallPlugin(plugin.id)}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Uninstall
                          </Button>
                        </>
                      ) : (
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleInstallPlugin(plugin.id)}
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
                  <Package className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No plugins found</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PluginStore;
