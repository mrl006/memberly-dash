
import { 
  getPurchasesCollection, 
  getUserPurchasedProducts, 
  addPurchase, 
  getProductsCollection
} from "./dbService";
import { toast } from "@/hooks/use-toast";

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  purchaseDate: string;
  status: "active" | "cancelled" | "expired";
}

// Get all purchases
export const getAllPurchases = async (): Promise<Purchase[]> => {
  try {
    const purchasesCollection = await getPurchasesCollection();
    if (!purchasesCollection) return [];
    
    const purchases = await purchasesCollection.find({}).toArray();
    return purchases as Purchase[];
  } catch (error) {
    console.error("Error getting all purchases:", error);
    return [];
  }
};

// Get purchases for a specific user
export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  try {
    const purchasesCollection = await getPurchasesCollection();
    if (!purchasesCollection) return [];
    
    const purchases = await purchasesCollection.find({ userId }).toArray();
    return purchases as Purchase[];
  } catch (error) {
    console.error(`Error getting purchases for user ${userId}:`, error);
    return [];
  }
};

// Check if a user has purchased a specific product
export const hasUserPurchasedProduct = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const purchasesCollection = await getPurchasesCollection();
    if (!purchasesCollection) return false;
    
    const purchase = await purchasesCollection.findOne({ 
      userId, 
      productId,
      status: "active" 
    });
    
    return !!purchase;
  } catch (error) {
    console.error(`Error checking if user ${userId} purchased product ${productId}:`, error);
    return false;
  }
};

// Purchase a product
export const purchaseProduct = async (userId: string, productId: string): Promise<boolean> => {
  try {
    // Check if the product exists
    const productsCollection = await getProductsCollection();
    if (!productsCollection) return false;
    
    const product = await productsCollection.findOne({ id: productId });
    if (!product) {
      toast({
        title: "Product Not Found",
        description: "The product you're trying to purchase doesn't exist.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if the user has already purchased this product
    const alreadyPurchased = await hasUserPurchasedProduct(userId, productId);
    if (alreadyPurchased) {
      toast({
        title: "Already Purchased",
        description: "You've already purchased this product.",
        variant: "default"
      });
      return false;
    }
    
    // Create a new purchase record
    const result = await addPurchase(userId, productId);
    
    if (result) {
      toast({
        title: "Purchase Successful",
        description: `You've successfully purchased ${product.name}.`
      });
      return true;
    } else {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error(`Error purchasing product ${productId} for user ${userId}:`, error);
    toast({
      title: "Purchase Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive"
    });
    return false;
  }
};

// Get a user's purchased products with full product details
export const getUserPurchasedProductsWithDetails = async (userId: string): Promise<any[]> => {
  try {
    return await getUserPurchasedProducts(userId);
  } catch (error) {
    console.error(`Error getting purchased products for user ${userId}:`, error);
    toast({
      title: "Error",
      description: "Failed to load your purchased products.",
      variant: "destructive"
    });
    return [];
  }
};

// Cancel a purchase
export const cancelPurchase = async (purchaseId: string): Promise<boolean> => {
  try {
    const purchasesCollection = await getPurchasesCollection();
    if (!purchasesCollection) return false;
    
    await purchasesCollection.updateOne(
      { id: purchaseId },
      { $set: { status: "cancelled" } }
    );
    
    toast({
      title: "Purchase Cancelled",
      description: "Your purchase has been cancelled successfully."
    });
    
    return true;
  } catch (error) {
    console.error(`Error cancelling purchase ${purchaseId}:`, error);
    toast({
      title: "Cancellation Failed",
      description: "Failed to cancel your purchase. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
