
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductsCollection } from "@/services/dbService";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  type: string;
  status: string;
  price: string;
  description: string;
  bgColor?: string;
  textColor?: string;
}

// Default color mapping for new products without custom colors
const getDefaultColors = (index: number) => {
  const colors = [
    { bg: "bg-gradient-to-br from-[#5030E5] to-[#00A550]", text: "text-white" },
    { bg: "bg-[#FF6B35]", text: "text-white" },
    { bg: "bg-[#15C39A]", text: "text-white" },
    { bg: "bg-[#00C4CC]", text: "text-white" },
    { bg: "bg-[#10A37F]", text: "text-white" },
    { bg: "bg-[#F8F9FA]", text: "text-[#246EB9]" },
    { bg: "bg-[#246EB9]", text: "text-white" },
    { bg: "bg-[#F8F9FA]", text: "text-[#FF8C00]" },
    { bg: "bg-[#0A1A2A]", text: "text-[#FA8E21]" },
  ];
  return colors[index % colors.length];
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
          const activeProducts = await productsCollection.find({ status: "Active" }).toArray();
          
          if (activeProducts && activeProducts.length > 0) {
            // Add color information to products that don't have it
            const productsWithColors = activeProducts.map((product, index) => {
              if (!product.bgColor || !product.textColor) {
                const colors = getDefaultColors(index);
                return {
                  ...product,
                  bgColor: product.bgColor || colors.bg,
                  textColor: product.textColor || colors.text
                };
              }
              return product;
            });
            
            setProducts(productsWithColors);
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
          description: "Failed to load your access products",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [toast]);
  
  const handleAccessProduct = (product: Product) => {
    toast({
      title: "Product Accessed",
      description: `You've accessed ${product.name}`,
      variant: "default"
    });
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
        <h1 className="text-3xl font-bold tracking-tight">Access Products</h1>
        <p className="text-gray-500 mt-1">Click on any product to access it</p>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products available. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col ${product.bgColor}`}
              onClick={() => handleAccessProduct(product)}
            >
              <div className="flex flex-col items-center justify-center p-6 h-32">
                <h2 className={`text-xl font-bold ${product.textColor}`}>{product.name}</h2>
              </div>
              <div className="bg-green-500 p-2 text-center text-white">
                <Button 
                  variant="link" 
                  className="text-white p-0 h-auto font-medium flex items-center justify-center w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccessProduct(product);
                  }}
                >
                  Access {product.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessProducts;
