
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

// Mock Collection implementation that uses localStorage
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
let isInitialized = false;

// Initialize storage
export const initDatabase = async (): Promise<boolean> => {
  if (isInitialized) return true;
  
  try {
    console.log('Initializing local storage database');
    usersCollection = new LocalStorageCollection('users');
    settingsCollection = new LocalStorageCollection('settings');
    isInitialized = true;
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

// Close database connection (useful for cleanup)
export const closeDatabase = async (): Promise<void> => {
  isInitialized = false;
  usersCollection = null;
  settingsCollection = null;
  console.log('Disconnected from local database');
};
