
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Tag, AlertCircle, Check, X } from "lucide-react";
import { getUserPurchasedProductsWithDetails } from "@/services/purchaseService";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Subscriptions = () => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([]);
  const [digitalProducts, setDigitalProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadPurchasedProducts = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be the actual user ID from auth
        const currentUserId = "1"; // Mock user ID for demo purposes
        
        const purchasedProducts = await getUserPurchasedProductsWithDetails(currentUserId);
        
        // Filter into subscriptions and digital products
        const subscriptions = purchasedProducts.filter(p => p.type === "Membership" || p.type === "subscription");
        const downloads = purchasedProducts.filter(p => p.type === "Digital Download" || p.type === "Course" || p.type === "digital");
        
        setActiveSubscriptions(subscriptions);
        setDigitalProducts(downloads);
      } catch (error) {
        console.error("Error loading purchases:", error);
        toast({
          title: "Error",
          description: "Failed to load your subscriptions and purchases",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPurchasedProducts();
  }, [toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
          <p className="text-gray-500">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Your Subscriptions & Products</h1>
      
      <Tabs defaultValue="subscriptions" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="subscriptions">Memberships & Subscriptions</TabsTrigger>
          <TabsTrigger value="purchases">Digital Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions">
          <div className="grid gap-6 md:grid-cols-2">
            {activeSubscriptions.length > 0 ? (
              activeSubscriptions.map((subscription) => (
                <Card key={subscription.id} className="relative overflow-hidden">
                  {subscription.purchaseInfo?.status === "active" && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-md bg-green-600">
                        Active
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      <CardTitle>{subscription.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {subscription.description || "Membership subscription"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        <span className="font-medium">${subscription.price}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Purchased:</span>
                        <span className="font-medium">
                          {new Date(subscription.purchaseInfo?.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <div className="flex items-center">
                          {subscription.purchaseInfo?.status === "active" ? (
                            <>
                              <Check className="mr-1 h-4 w-4 text-green-500" />
                              <span className="text-green-500">Active</span>
                            </>
                          ) : (
                            <>
                              <X className="mr-1 h-4 w-4 text-red-500" />
                              <span className="text-red-500">Inactive</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Manage Subscription
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 border rounded-lg p-6 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Memberships</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any active memberships or subscriptions.
                </p>
                <Button>Browse Memberships</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="purchases">
          <div className="grid gap-6 md:grid-cols-2">
            {digitalProducts.length > 0 ? (
              digitalProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {product.type === "Digital Download" || product.type === "digital" ? (
                        <Download className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                      <CardTitle>{product.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {product.description || "Digital product"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        <span className="font-medium">${product.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Purchased:</span>
                        <span className="font-medium">
                          {new Date(product.purchaseInfo?.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 border rounded-lg p-6 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Digital Products</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't purchased any digital products or downloads yet.
                </p>
                <Button>Browse Products</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Subscriptions;
