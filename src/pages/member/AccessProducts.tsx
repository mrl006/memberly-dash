
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Unlock, Lock, FileText, Download, PlayCircle, Video, Image } from "lucide-react";
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
        console.log("Loaded products:", purchasedProducts); // Debug log to see what's being loaded
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
    if (type?.includes('course')) return <Video className="h-16 w-16 text-primary" />;
    if (type?.includes('ebook') || type?.includes('pdf')) return <FileText className="h-16 w-16 text-primary" />;
    if (type?.includes('image') || type?.includes('photo')) return <Image className="h-16 w-16 text-primary" />;
    if (type?.includes('video')) return <PlayCircle className="h-16 w-16 text-primary" />;
    if (type?.includes('download') || type?.includes('digital')) return <Download className="h-16 w-16 text-primary" />;
    // Default icon
    return <FileText className="h-16 w-16 text-primary" />;
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
      </div>
      
      {products.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden p-6 flex flex-col items-center">
              <div className="absolute top-3 left-3">
                <Badge 
                  variant="outline" 
                  className={`${product.purchaseInfo?.status === "active" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-amber-50 text-amber-700 border-amber-200"}`}
                >
                  {product.purchaseInfo?.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="flex flex-col items-center justify-center py-6">
                {getProductIcon(product)}
                <h2 className="text-xl font-bold mt-4 text-center">{product.name}</h2>
              </div>
              
              <Button 
                className="w-full mt-auto" 
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
