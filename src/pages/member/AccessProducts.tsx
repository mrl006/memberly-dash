
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductsCollection } from "@/services/dbService";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
          <p className="text-gray-500">Loading your products...</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Access Products</h1>
        <p className="text-gray-500 mt-1">Click on any product to access it</p>
      </motion.div>
      
      {products.length === 0 ? (
        <motion.div 
          className="text-center py-12 bg-gray-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <p className="text-gray-500">No products available. Please check back later.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
              className="aspect-square"
            >
              <Card 
                className={`h-full w-full overflow-hidden transition-all cursor-pointer flex flex-col ${product.bgColor} shadow-lg`}
                onClick={() => handleAccessProduct(product)}
              >
                <div className="flex flex-col items-center justify-center p-4 flex-grow">
                  <motion.div
                    className="flex flex-col items-center justify-center text-center h-full w-full"
                    animate={{
                      y: hoveredProduct === product.id ? -10 : 0,
                      scale: hoveredProduct === product.id ? 1.05 : 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <h2 className={`text-xl md:text-2xl font-bold mb-2 ${product.textColor}`}>
                      {product.name}
                    </h2>
                    <p className={`text-sm ${product.textColor} opacity-80 line-clamp-2`}>
                      {product.description}
                    </p>
                  </motion.div>
                </div>
                
                <div className="p-3 bg-black/30 backdrop-blur-sm">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant="ghost" 
                      className={`text-white font-medium w-full relative overflow-hidden group`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccessProduct(product);
                      }}
                    >
                      <span className="absolute inset-0 w-0 bg-white/30 transition-all duration-300 ease-out group-hover:w-full"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        Access
                        <motion.span 
                          animate={{ 
                            x: hoveredProduct === product.id ? 5 : 0,
                            opacity: hoveredProduct === product.id ? 1 : 0.7
                          }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 10 
                          }}
                        >
                          →
                        </motion.span>
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AccessProducts;
