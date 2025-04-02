
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductsCollection } from "@/services/dbService";
import { useToast } from "@/hooks/use-toast";
import { purchaseProduct } from "@/services/purchaseService";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  type: string;
  status: string;
  price: number;
  description: string;
  bgColor?: string;
  textColor?: string;
}

// Default color mapping for products
const getDefaultColors = (index: number) => {
  const colors = [
    { bg: "bg-blue-600", text: "text-white" },
    { bg: "bg-orange-500", text: "text-white" },
    { bg: "bg-emerald-600", text: "text-white" },
    { bg: "bg-purple-600", text: "text-white" },
    { bg: "bg-indigo-600", text: "text-white" },
    { bg: "bg-pink-600", text: "text-white" },
    { bg: "bg-teal-600", text: "text-white" },
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
          // Adding default products if none exist
          const checkProducts = await productsCollection.find({}).toArray();
          
          if (!checkProducts || checkProducts.length === 0) {
            const defaultProducts = [
              { 
                id: "1", 
                name: "Basic Membership", 
                price: 9.99, 
                type: "subscription", 
                status: "active", 
                sales: 120,
                description: "Access to all basic features and content."
              },
              { 
                id: "2", 
                name: "Premium Membership", 
                price: 19.99, 
                type: "subscription", 
                status: "active", 
                sales: 85,
                description: "Enhanced access with premium features and priority support."
              },
              { 
                id: "3", 
                name: "Enterprise Membership", 
                price: 49.99, 
                type: "subscription", 
                status: "active", 
                sales: 42,
                description: "Full access to all features, dedicated support, and custom solutions."
              },
              { 
                id: "4", 
                name: "Resource Pack", 
                price: 4.99, 
                type: "digital", 
                status: "active", 
                sales: 67,
                description: "Downloadable resources and templates to enhance your experience."
              },
            ];
            
            for (const product of defaultProducts) {
              await productsCollection.insertOne(product);
            }
          }
          
          const activeProducts = await productsCollection.find({ status: "active" }).toArray();
          
          if (activeProducts && activeProducts.length > 0) {
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
      const purchased = await purchaseProduct("1", product.id);
      
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
          {products.map((product, index) => (
            <Card 
              key={product.id}
              className={`overflow-hidden shadow-md cursor-pointer ${product.bgColor || getDefaultColors(index).bg} border-0`}
              onClick={() => handleAccessProduct(product)}
            >
              <div className="p-6 flex flex-col h-40">
                <h2 className={`text-xl font-bold mb-2 ${product.textColor || "text-white"}`}>
                  {product.name}
                </h2>
                <p className={`text-sm opacity-90 mb-4 ${product.textColor || "text-white"}`}>
                  {product.description || "Access this product now"}
                </p>
              </div>
              
              <div className="p-4 bg-black/10">
                <Button 
                  variant="secondary" 
                  className={`w-full ${product.textColor || "text-white"} font-medium`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccessProduct(product);
                  }}
                >
                  Access Now <ArrowRight className="ml-2 h-4 w-4" />
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
