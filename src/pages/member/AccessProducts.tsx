
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Unlock, FileText, Download, PlayCircle, Video, Image, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUserPurchasedProductsWithDetails } from "@/services/purchaseService";
import { useToast } from "@/hooks/use-toast";

const AccessProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadPurchasedProducts = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be the actual user ID from auth
        const currentUserId = "1"; // Mock user ID for demo purposes
        
        const purchasedProducts = await getUserPurchasedProductsWithDetails(currentUserId);
        setProducts(purchasedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load your purchased products",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPurchasedProducts();
  }, [toast]);
  
  // Helper function to determine the icon based on product type
  const getProductIcon = (product: any) => {
    const type = product.type?.toLowerCase();
    if (type?.includes('course')) return <Video className="h-12 w-12 text-primary" />;
    if (type?.includes('ebook') || type?.includes('pdf')) return <FileText className="h-12 w-12 text-primary" />;
    if (type?.includes('image') || type?.includes('photo')) return <Image className="h-12 w-12 text-primary" />;
    if (type?.includes('video')) return <PlayCircle className="h-12 w-12 text-primary" />;
    if (type?.includes('download') || type?.includes('digital')) return <Download className="h-12 w-12 text-primary" />;
    // Default icon
    return <FileText className="h-12 w-12 text-primary" />;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
          <p className="text-gray-500">Loading your products...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Products</h1>
        <p className="text-muted-foreground mt-2">
          Access all your purchased content and subscription benefits
        </p>
      </div>
      
      {products.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <Badge 
                    variant="outline" 
                    className={`${product.purchaseInfo?.status === "active" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-amber-50 text-amber-700 border-amber-200"}`}
                  >
                    {product.purchaseInfo?.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex flex-col items-center mt-2">
                  {getProductIcon(product)}
                  <CardTitle className="mt-4 text-center">{product.name}</CardTitle>
                </div>
                <CardDescription className="text-center">
                  {product.description || `${product.type} content`}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <div className="flex justify-center space-x-2 text-sm">
                  <span className="text-muted-foreground">Purchased:</span>
                  <span className="font-medium">
                    {new Date(product.purchaseInfo?.purchaseDate).toLocaleDateString()}
                  </span>
                </div>
                {product.purchaseInfo?.status !== "active" && (
                  <div className="mt-4 flex items-center justify-center text-amber-600">
                    <Lock className="h-4 w-4 mr-1" />
                    <span className="text-sm">Subscription expired</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={product.purchaseInfo?.status !== "active"}
                >
                  {product.purchaseInfo?.status === "active" ? (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Access Content
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Renew Subscription
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg bg-gray-50">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Products Found</h3>
          <p className="text-muted-foreground mb-6">
            You haven't purchased any products or subscriptions yet.
          </p>
          <Button>Browse Available Products</Button>
        </div>
      )}
    </div>
  );
};

export default AccessProducts;
