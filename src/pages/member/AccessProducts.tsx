
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { getUserPurchasedProductsWithDetails } from "@/services/purchaseService";
import { useToast } from "@/hooks/use-toast";

// Define product data with colors matching the image
const productData = [
  { id: "1", name: "Semrush", bgColor: "bg-gradient-to-br from-[#5030E5] to-[#00A550]", textColor: "text-white", path: "semrush" },
  { id: "2", name: "Ubersuggest", bgColor: "bg-[#FF6B35]", textColor: "text-white", path: "ubersuggest" },
  { id: "3", name: "Grammarly", bgColor: "bg-[#15C39A]", textColor: "text-white", path: "grammarly" },
  { id: "4", name: "Canva", bgColor: "bg-[#00C4CC]", textColor: "text-white", path: "canva" },
  { id: "5", name: "ChatGPT Plus", bgColor: "bg-[#10A37F]", textColor: "text-white", path: "chat-gpt" },
  { id: "6", name: "SEOptimer", bgColor: "bg-[#F8F9FA]", textColor: "text-[#246EB9]", path: "seoptimer" },
  { id: "7", name: "Seobility", bgColor: "bg-[#246EB9]", textColor: "text-white", path: "seobility" },
  { id: "8", name: "SEO Site Checkup", bgColor: "bg-[#F8F9FA]", textColor: "text-[#FF8C00]", path: "seo-site-checkup" },
  { id: "9", name: "Ahrefs", bgColor: "bg-[#0A1A2A]", textColor: "text-[#FA8E21]", path: "ahrefs" },
];

const AccessProducts = () => {
  const [products, setProducts] = useState(productData);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadPurchasedProducts = async () => {
      try {
        setIsLoading(true);
        // Mock functionality - in a real app this would filter/modify the products based on user's purchases
        setProducts(productData);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load your access products",
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
          <p className="text-gray-500">Loading your products...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Access Products</h1>
        <p className="text-gray-500 mt-1">Click on any product to access it</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col ${product.bgColor}`}
          >
            <div className="flex flex-col items-center justify-center p-6 h-32">
              <h2 className={`text-xl font-bold ${product.textColor}`}>{product.name}</h2>
            </div>
            <div className="bg-green-500 p-2 text-center text-white">
              <Button 
                variant="link" 
                className="text-white p-0 h-auto font-medium flex items-center justify-center w-full"
                onClick={() => window.open(`https://${product.path}.com`, '_blank')}
              >
                {product.name}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccessProducts;
