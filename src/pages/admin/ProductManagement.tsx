
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash, 
  SearchIcon, 
  Upload, 
  Download, 
  FileText, 
  Tag,
  AlertCircle
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Interface for product data
interface Product {
  id: number;
  name: string;
  price: string;
  status: "Active" | "Draft" | "Archived";
  description: string;
  type: "Membership" | "Digital Download" | "Course";
  downloadUrl?: string;
  licensedUsers?: number;
}

// Mock product data
const initialProducts: Product[] = [
  { id: 1, name: "Premium Membership", price: "99.99", status: "Active", description: "Access to all premium features", type: "Membership", licensedUsers: 245 },
  { id: 2, name: "Basic Membership", price: "49.99", status: "Active", description: "Access to basic features", type: "Membership", licensedUsers: 723 },
  { id: 3, name: "E-Book: Membership Guide", price: "19.99", status: "Active", description: "Comprehensive guide on membership benefits", type: "Digital Download", downloadUrl: "/downloads/ebook-guide.pdf" },
  { id: 4, name: "Video Course Bundle", price: "149.99", status: "Draft", description: "Complete video course series", type: "Course", downloadUrl: "/downloads/course-bundle.zip" },
];

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: "",
    status: "Draft",
    description: "",
    type: "Digital Download"
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Missing Information",
        description: "Please provide a product name and price.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...products.map(product => product.id), 0) + 1;
    const productToAdd = {
      id: newId,
      name: newProduct.name,
      price: newProduct.price,
      status: newProduct.status as "Active" | "Draft" | "Archived",
      description: newProduct.description || "",
      type: newProduct.type as "Membership" | "Digital Download" | "Course",
      downloadUrl: newProduct.downloadUrl,
      licensedUsers: 0
    };

    setProducts([...products, productToAdd]);
    setIsAddDialogOpen(false);
    setNewProduct({
      name: "",
      price: "",
      status: "Draft",
      description: "",
      type: "Digital Download"
    });

    toast({
      title: "Product Added",
      description: `${productToAdd.name} has been added successfully.`
    });
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    setProducts(products.map(product => 
      product.id === selectedProduct.id ? selectedProduct : product
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Product Updated",
      description: `${selectedProduct.name} has been updated successfully.`
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    
    toast({
      title: "Product Deleted",
      description: "The product has been deleted successfully."
    });
  };

  const handleFileUpload = () => {
    // Simulate file upload - in a real app, handle file uploading here
    toast({
      title: "File Uploaded",
      description: "Your file has been uploaded successfully."
    });
  };

  // Reset form when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setActiveTab("details");
      setNewProduct({
        name: "",
        price: "",
        status: "Draft",
        description: "",
        type: "Digital Download"
      });
    }
    setIsAddDialogOpen(open);
  };

  const resetEditForm = () => {
    setActiveTab("details");
    setSelectedProduct(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[750px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product for your membership platform
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Basic Details</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="files">Files & Downloads</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      value={newProduct.name || ''}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="e.g. Premium Membership"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input 
                        id="price" 
                        type="text"
                        className="pl-7" 
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="e.g. 99.99"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Product Type</Label>
                    <Select 
                      value={newProduct.type || 'Digital Download'} 
                      onValueChange={(value) => setNewProduct({...newProduct, type: value as any})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Membership">Membership</SelectItem>
                        <SelectItem value="Digital Download">Digital Download</SelectItem>
                        <SelectItem value="Course">Course</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newProduct.status || 'Draft'} 
                      onValueChange={(value) => setNewProduct({...newProduct, status: value as any})}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="description" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea 
                    id="description" 
                    className="min-h-[200px]"
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Enter detailed product description here..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a detailed description of your product. You can use markdown for formatting.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="space-y-4 mt-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Drag and drop files, or browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload PDF, ZIP, MP4, or other relevant files. Max 50MB.
                    </p>
                  </div>
                  <Button onClick={handleFileUpload} variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="downloadUrl">Download URL (optional)</Label>
                  <Input 
                    id="downloadUrl" 
                    value={newProduct.downloadUrl || ''}
                    onChange={(e) => setNewProduct({...newProduct, downloadUrl: e.target.value})}
                    placeholder="e.g. /downloads/product.pdf"
                  />
                  <p className="text-xs text-muted-foreground">
                    If your product is hosted elsewhere, enter the URL here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProduct}>Create Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="membership">Membership</SelectItem>
            <SelectItem value="download">Digital Download</SelectItem>
            <SelectItem value="course">Course</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your membership products and digital downloads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {product.type === "Membership" && <Tag className="mr-2 h-4 w-4" />}
                          {product.type === "Digital Download" && <Download className="mr-2 h-4 w-4" />}
                          {product.type === "Course" && <FileText className="mr-2 h-4 w-4" />}
                          {product.type}
                        </div>
                      </TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.status === "Active" ? "bg-green-100 text-green-800" : 
                          product.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen && selectedProduct?.id === product.id} onOpenChange={(open) => {
                            if (!open) resetEditForm();
                            if (open) setSelectedProduct(product);
                            setIsEditDialogOpen(open);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[750px]">
                              <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                                <DialogDescription>
                                  Update the details for {selectedProduct?.name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedProduct && (
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                                  <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="details">Basic Details</TabsTrigger>
                                    <TabsTrigger value="description">Description</TabsTrigger>
                                    <TabsTrigger value="files">Files & Downloads</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="details" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-name">Product Name</Label>
                                        <Input 
                                          id="edit-name" 
                                          value={selectedProduct.name}
                                          onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-price">Price</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-2.5">$</span>
                                          <Input 
                                            id="edit-price" 
                                            type="text"
                                            className="pl-7" 
                                            value={selectedProduct.price}
                                            onChange={(e) => setSelectedProduct({...selectedProduct, price: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-type">Product Type</Label>
                                        <Select 
                                          value={selectedProduct.type} 
                                          onValueChange={(value) => setSelectedProduct({...selectedProduct, type: value as any})}
                                        >
                                          <SelectTrigger id="edit-type">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Membership">Membership</SelectItem>
                                            <SelectItem value="Digital Download">Digital Download</SelectItem>
                                            <SelectItem value="Course">Course</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-status">Status</Label>
                                        <Select 
                                          value={selectedProduct.status} 
                                          onValueChange={(value) => setSelectedProduct({...selectedProduct, status: value as any})}
                                        >
                                          <SelectTrigger id="edit-status">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Archived">Archived</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="description" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-description">Product Description</Label>
                                      <Textarea 
                                        id="edit-description" 
                                        className="min-h-[200px]"
                                        value={selectedProduct.description}
                                        onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                                      />
                                    </div>
                                  </TabsContent>
                                  
                                  <TabsContent value="files" className="space-y-4 mt-4">
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
                                      <div className="flex justify-center">
                                        <Upload className="h-10 w-10 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">
                                          Drag and drop files, or browse
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Upload PDF, ZIP, MP4, or other relevant files. Max 50MB.
                                        </p>
                                      </div>
                                      <Button onClick={handleFileUpload} variant="outline" size="sm">
                                        Browse Files
                                      </Button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-downloadUrl">Download URL</Label>
                                      <Input 
                                        id="edit-downloadUrl" 
                                        value={selectedProduct.downloadUrl || ''}
                                        onChange={(e) => setSelectedProduct({...selectedProduct, downloadUrl: e.target.value})}
                                      />
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              )}
                              
                              <DialogFooter className="mt-6">
                                <Button variant="outline" onClick={resetEditForm}>Cancel</Button>
                                <Button onClick={handleUpdateProduct}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this product? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="bg-muted/50 p-4 rounded-md mb-4">
                                <div className="flex justify-between">
                                  <span className="font-medium">Name:</span>
                                  <span>{product.name}</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="font-medium">Price:</span>
                                  <span>${product.price}</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="font-medium">Type:</span>
                                  <span>{product.type}</span>
                                </div>
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductManagement;
