import { toast } from "@/hooks/use-toast";

// Interface for collection-like operations to match MongoDB API
export interface Collection {
  findOne: (query: any) => Promise<any>;
  find: (query: any) => { toArray: () => Promise<any[]> };
  insertOne: (doc: any) => Promise<any>;
  updateOne: (query: any, update: any, options?: any) => Promise<any>;
  deleteOne: (query: any) => Promise<any>;
  findOneAndUpdate: (query: any, update: any, options?: any) => Promise<any>;
}

// localStorage Collection implementation
class LocalStorageCollection implements Collection {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private getCollection(): any[] {
    try {
      const data = localStorage.getItem(this.collectionName);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error reading from localStorage for ${this.collectionName}:`, e);
      return [];
    }
  }

  private saveCollection(data: any[]): void {
    try {
      localStorage.setItem(this.collectionName, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving to localStorage for ${this.collectionName}:`, e);
      toast({
        title: "Storage Error",
        description: "Failed to save data to local storage.",
        variant: "destructive",
      });
    }
  }

  async findOne(query: any): Promise<any> {
    const collection = this.getCollection();
    const foundItem = collection.find(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    return foundItem || null;
  }

  find(query: any = {}): { toArray: () => Promise<any[]> } {
    return {
      toArray: async () => {
        const collection = this.getCollection();
        if (Object.keys(query).length === 0) {
          return collection;
        }
        return collection.filter(item => {
          for (const key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        });
      }
    };
  }

  async insertOne(doc: any): Promise<any> {
    const collection = this.getCollection();
    
    // Auto-generate an ID if one doesn't exist
    if (!doc._id && !doc.id) {
      doc.id = Date.now().toString();
    }
    
    collection.push(doc);
    this.saveCollection(collection);
    return { acknowledged: true, insertedId: doc._id || doc.id };
  }

  async updateOne(query: any, update: any, options: any = {}): Promise<any> {
    const collection = this.getCollection();
    let updated = false;
    
    const newCollection = collection.map(item => {
      let matches = true;
      for (const key in query) {
        if (item[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        updated = true;
        const newItem = { ...item };
        
        if (update.$set) {
          for (const key in update.$set) {
            newItem[key] = update.$set[key];
          }
        }
        
        return newItem;
      }
      
      return item;
    });
    
    this.saveCollection(newCollection);
    
    if (!updated && options.upsert) {
      const newDoc = { ...query };
      if (update.$set) {
        for (const key in update.$set) {
          newDoc[key] = update.$set[key];
        }
      }
      return this.insertOne(newDoc);
    }
    
    return { acknowledged: true, modifiedCount: updated ? 1 : 0 };
  }

  async deleteOne(query: any): Promise<any> {
    const collection = this.getCollection();
    let deleted = false;
    let index = -1;
    
    for (let i = 0; i < collection.length; i++) {
      let matches = true;
      for (const key in query) {
        if (collection[i][key] !== query[key]) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        index = i;
        break;
      }
    }
    
    if (index !== -1) {
      collection.splice(index, 1);
      this.saveCollection(collection);
      deleted = true;
    }
    
    return { acknowledged: true, deletedCount: deleted ? 1 : 0 };
  }

  async findOneAndUpdate(query: any, update: any, options: any = {}): Promise<any> {
    const doc = await this.findOne(query);
    
    if (!doc && !options.upsert) {
      return { value: null };
    }
    
    if (!doc && options.upsert) {
      const newDoc = { ...query };
      if (update.$set) {
        for (const key in update.$set) {
          newDoc[key] = update.$set[key];
        }
      }
      await this.insertOne(newDoc);
      return { value: newDoc };
    }
    
    const updatedDoc = { ...doc };
    if (update.$set) {
      for (const key in update.$set) {
        updatedDoc[key] = update.$set[key];
      }
    }
    
    await this.updateOne(query, update);
    
    if (options.returnDocument === 'after') {
      return { value: updatedDoc };
    } else {
      return { value: doc };
    }
  }
}

// Collections
let usersCollection: Collection | null = null;
let settingsCollection: Collection | null = null;
let ticketsCollection: Collection | null = null;
let productsCollection: Collection | null = null;
let couponsCollection: Collection | null = null;
let analyticsCollection: Collection | null = null;
let purchasesCollection: Collection | null = null; // New collection for tracking purchases
let isInitialized = false;

// Initialize default data if collection is empty
const initializeDefaultData = async () => {
  // Initialize default products if none exist
  const products = await productsCollection?.find({}).toArray();
  if (products && products.length === 0) {
    const defaultProducts = [
      { id: "1", name: "Basic Membership", price: 9.99, type: "subscription", status: "active", sales: 120 },
      { id: "2", name: "Premium Membership", price: 19.99, type: "subscription", status: "active", sales: 85 },
      { id: "3", name: "Enterprise Membership", price: 49.99, type: "subscription", status: "active", sales: 42 },
      { id: "4", name: "E-Book: Getting Started", price: 4.99, type: "digital", status: "active", sales: 67 },
    ];
    
    for (const product of defaultProducts) {
      await productsCollection?.insertOne(product);
    }
  }
  
  // Initialize default coupons if none exist
  const coupons = await couponsCollection?.find({}).toArray();
  if (coupons && coupons.length === 0) {
    const defaultCoupons = [
      { id: 1, code: "WELCOME20", discount: "20%", discountType: "percentage", discountValue: 20, expires: "2023-12-31", usage: "10/100", maxUses: 100, currentUses: 10 },
      { id: 2, code: "SUMMER50", discount: "50%", discountType: "percentage", discountValue: 50, expires: "2023-09-30", usage: "45/50", maxUses: 50, currentUses: 45 },
      { id: 3, code: "FLAT10", discount: "$10.00", discountType: "fixed", discountValue: 10, expires: "2023-10-15", usage: "23/Unlimited", maxUses: "Unlimited", currentUses: 23 },
    ];
    
    for (const coupon of defaultCoupons) {
      await couponsCollection?.insertOne(coupon);
    }
  }
  
  // Initialize analytics data if none exists
  const analytics = await analyticsCollection?.find({}).toArray();
  if (analytics && analytics.length === 0) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Create 7 months of revenue data
    const revenueData = [];
    for (let i = 0; i < 7; i++) {
      const monthName = new Date(year, month - 6 + i, 1).toLocaleString('default', { month: 'short' });
      revenueData.push({
        name: monthName,
        total: Math.floor(Math.random() * 3000) + 1000 // Random revenue between 1000-4000
      });
    }
    
    // Create subscription plan distribution
    const subscriptionPlans = [
      { name: "Basic", value: 30 },
      { name: "Standard", value: 45 },
      { name: "Premium", value: 25 }
    ];
    
    // Create weekly user activity
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const userActivity = weekDays.map(day => ({
      name: day,
      active: Math.floor(Math.random() * 100) + 100 // Random active users between 100-200
    }));
    
    // Overall metrics
    const overallMetrics = {
      totalRevenue: revenueData.reduce((acc, curr) => acc + curr.total, 0),
      activeSubscriptions: Math.floor(Math.random() * 300) + 200,
      totalMembers: Math.floor(Math.random() * 800) + 500,
      churnRate: (Math.random() * 3 + 1).toFixed(1)
    };
    
    await analyticsCollection?.insertOne({
      id: "dashboard-data",
      revenueData,
      subscriptionPlans,
      userActivity,
      overallMetrics,
      lastUpdated: new Date().toISOString()
    });
  }
  
  // Initialize default purchases if none exist
  const purchases = await purchasesCollection?.find({}).toArray();
  if (purchases && purchases.length === 0) {
    // Create some default purchases for demo purposes
    const defaultPurchases = [
      { id: "1", userId: "1", productId: "2", purchaseDate: new Date().toISOString(), status: "active" },
      { id: "2", userId: "2", productId: "1", purchaseDate: new Date().toISOString(), status: "active" },
      { id: "3", userId: "3", productId: "4", purchaseDate: new Date().toISOString(), status: "active" },
    ];
    
    for (const purchase of defaultPurchases) {
      await purchasesCollection?.insertOne(purchase);
    }
  }
};

// Initialize storage
export const initDatabase = async (): Promise<boolean> => {
  if (isInitialized) return true;
  
  try {
    console.log('Initializing local storage database');
    usersCollection = new LocalStorageCollection('users');
    settingsCollection = new LocalStorageCollection('settings');
    ticketsCollection = new LocalStorageCollection('tickets');
    productsCollection = new LocalStorageCollection('products');
    couponsCollection = new LocalStorageCollection('coupons');
    analyticsCollection = new LocalStorageCollection('analytics');
    purchasesCollection = new LocalStorageCollection('purchases'); // Initialize the new collection
    
    isInitialized = true;
    
    // Initialize default data
    await initializeDefaultData();
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    toast({
      title: "Database Error",
      description: "Failed to initialize local database. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
};

// Get users collection
export const getUsersCollection = async (): Promise<Collection | null> => {
  if (!isInitialized) {
    await initDatabase();
  }
  return usersCollection;
};

// Get settings collection
export const getSettingsCollection = async (): Promise<Collection | null> => {
  if (!isInitialized) {
    await initDatabase();
  }
  return settingsCollection;
};

// Get tickets collection
export const getTicketsCollection = async (): Promise<Collection | null> => {
  if (!isInitialized) {
    await initDatabase();
  }
  return ticketsCollection;
};

// Get products collection
export const getProductsCollection = async (): Promise<Collection | null> => {
  if (!isInitialized) {
    await initDatabase();
  }
  return productsCollection;
};

// Get coupons collection
export const getCouponsCollection = async (): Promise<Collection | null> => {
  if (!isInitialized) {
    await initDatabase();
  }
  return couponsCollection;
};

// Get analytics collection
export const getAnalyticsCollection = async (): Promise<Collection | null> => {
  if (!isInitialized) {
    await initDatabase();
  }
  return analyticsCollection;
};

// Get purchases collection
export const getPurchasesCollection = async (): Promise<Collection | null> => {
  if (!isInitialized) {
    await initDatabase();
  }
  return purchasesCollection;
};

// Check if a product has been purchased
export const isProductPurchased = async (productId: string | number): Promise<boolean> => {
  if (!isInitialized) {
    await initDatabase();
  }
  
  try {
    const purchases = await purchasesCollection?.find({ productId: productId.toString() }).toArray();
    return purchases && purchases.length > 0;
  } catch (error) {
    console.error('Error checking if product is purchased:', error);
    return false;
  }
};

// Get user purchased products
export const getUserPurchasedProducts = async (userId: string | number): Promise<any[]> => {
  if (!isInitialized) {
    await initDatabase();
  }
  
  try {
    const purchases = await purchasesCollection?.find({ userId: userId.toString() }).toArray();
    if (!purchases || purchases.length === 0) {
      return [];
    }
    
    const productIds = purchases.map(purchase => purchase.productId);
    const products = [];
    
    for (const productId of productIds) {
      const product = await productsCollection?.findOne({ id: productId });
      if (product) {
        products.push({
          ...product,
          purchaseInfo: purchases.find(p => p.productId === productId)
        });
      }
    }
    
    return products;
  } catch (error) {
    console.error('Error getting user purchased products:', error);
    return [];
  }
};

// Add a purchase record
export const addPurchase = async (userId: string | number, productId: string | number): Promise<boolean> => {
  if (!isInitialized) {
    await initDatabase();
  }
  
  try {
    const purchase = {
      id: Date.now().toString(),
      userId: userId.toString(),
      productId: productId.toString(),
      purchaseDate: new Date().toISOString(),
      status: "active"
    };
    
    await purchasesCollection?.insertOne(purchase);
    return true;
  } catch (error) {
    console.error('Error adding purchase:', error);
    return false;
  }
};

// Update dashboard analytics data
export const updateDashboardAnalytics = async (newData: any): Promise<boolean> => {
  if (!isInitialized) {
    await initDatabase();
  }
  
  try {
    const analytics = await analyticsCollection?.findOne({ id: "dashboard-data" });
    if (analytics) {
      await analyticsCollection?.updateOne(
        { id: "dashboard-data" },
        { $set: { ...newData, lastUpdated: new Date().toISOString() } }
      );
    } else {
      await analyticsCollection?.insertOne({
        id: "dashboard-data",
        ...newData,
        lastUpdated: new Date().toISOString()
      });
    }
    return true;
  } catch (error) {
    console.error('Error updating dashboard analytics:', error);
    return false;
  }
};

// Close database connection (useful for cleanup)
export const closeDatabase = async (): Promise<void> => {
  isInitialized = false;
  usersCollection = null;
  settingsCollection = null;
  ticketsCollection = null;
  productsCollection = null;
  couponsCollection = null;
  analyticsCollection = null;
  purchasesCollection = null;
  console.log('Disconnected from local database');
};
