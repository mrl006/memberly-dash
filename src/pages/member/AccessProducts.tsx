
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductsCollection } from "@/services/dbService";
import { useToast } from "@/hooks/use-toast";
import { purchaseProduct } from "@/services/purchaseService";
import { ArrowRight, ShoppingBag, Box, Package, Ticket } from "lucide-react";

interface Product {
  id: number | string;
  name: string;
  type: string;
  status: string;
  price: string | number;
  description: string;
  bgColor?: string;
  textColor?: string;
}

// Default color mapping for products
const getDefaultColors = (type: string) => {
  const typeColors = {
    "Membership": { bg: "bg-blue-600", text: "text-white" },
    "Digital Download": { bg: "bg-orange-500", text: "text-white" },
    "Course": { bg: "bg-emerald-600", text: "text-white" },
    // Fallback colors for other types
    "default": { bg: "bg-purple-600", text: "text-white" }
  };
  
  return typeColors[type as keyof typeof typeColors] || typeColors.default;
};

// Get product icon based on type
const getProductIcon = (type: string) => {
  switch(type) {
    case "Membership":
      return <Ticket className="h-5 w-5" />;
    case "Digital Download":
      return <Box className="h-5 w-5" />;
    case "Course":
      return <Package className="h-5 w-5" />;
    default:
      return <ShoppingBag className="h-5 w-5" />;
  }
};

const AccessProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const productsCollection = await getProductsCollection();
        
        if (productsCollection) {
          // Fetch products from admin panel (same source)
          const activeProducts = await productsCollection.find({ status: "Active" }).toArray();
          
          if (activeProducts && activeProducts.length > 0) {
            // Format products with colors based on type
            const formattedProducts = activeProducts.map((product) => {
              const colors = getDefaultColors(product.type);
              return {
                ...product,
                bgColor: product.bgColor || colors.bg,
                textColor: product.textColor || colors.text
              };
            });
            
            setProducts(formattedProducts);
          } else {
            setProducts([]);
            toast({
              title: "No Active Products",
              description: "There are no active products available",
              variant: "default"
            });
          }
        }
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [toast]);
  
  const handleAccessProduct = async (product: Product) => {
    try {
      // Using the userId "1" for demonstration
      const purchased = await purchaseProduct("1", product.id.toString());
      
      if (purchased) {
        toast({
          title: "Access Granted",
          description: `You now have access to ${product.name}`,
        });
      }
    } catch (error) {
      console.error("Error accessing product:", error);
      toast({
        title: "Access Error",
        description: "There was an error gaining access to this product",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
          <p className="text-gray-500">Loading products...</p>
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
      
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products available. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const productColors = getDefaultColors(product.type);
            const bgColor = product.bgColor || productColors.bg;
            const textColor = product.textColor || productColors.text;
            
            return (
              <Card 
                key={product.id}
                className={`overflow-hidden shadow-md cursor-pointer transition-transform hover:translate-y-[-5px] ${bgColor} border-0`}
                onClick={() => handleAccessProduct(product)}
              >
                <div className="p-6 flex flex-col h-40">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center justify-center p-2 rounded-full ${textColor} bg-black/10 mr-2`}>
                      {getProductIcon(product.type)}
                    </span>
                    <h2 className={`text-xl font-bold ${textColor}`}>
                      {product.name}
                    </h2>
                  </div>
                  <p className={`text-sm opacity-90 mb-4 ${textColor}`}>
                    {product.description || "Access this product now"}
                  </p>
                  <div className={`mt-auto inline-flex items-center ${textColor} text-sm font-semibold`}>
                    ${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}
                  </div>
                </div>
                
                <div className="p-4 bg-black/10">
                  <Button 
                    variant="secondary" 
                    className={`w-full ${textColor} font-medium`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccessProduct(product);
                    }}
                  >
                    Access Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccessProducts;
