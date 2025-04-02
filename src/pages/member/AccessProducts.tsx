
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Unlock } from "lucide-react";
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
  
  // Simplified product icon with custom styling based on type
  const getProductIcon = (product: any) => {
    const type = product.type?.toLowerCase();
    
    // Use different colors based on product type
    let bgColor = "bg-blue-500";
    let iconClass = "text-blue-500";
    
    if (type?.includes('course') || type?.includes('subscription')) {
      bgColor = "bg-blue-500";
      iconClass = "text-blue-500";
      return (
        <div className={`rounded-full ${iconClass} h-16 w-16 flex items-center justify-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 8H7V7h10v4z"/>
          </svg>
        </div>
      );
    }
    
    // Default icon for other types
    return (
      <div className={`rounded-full ${iconClass} h-16 w-16 flex items-center justify-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 20V8h2v12H8zm6 0V8h2v12h-2z"/>
        </svg>
      </div>
    );
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
              <div className="flex flex-col items-center justify-center py-6">
                {getProductIcon(product)}
                <h2 className="text-xl font-bold mt-4 text-center">{product.name}</h2>
              </div>
              
              <Button 
                className="w-full mt-auto" 
                disabled={product.purchaseInfo?.status !== "active"}
              >
                <Unlock className="mr-2 h-4 w-4" />
                Access Content
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg bg-gray-50">
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
