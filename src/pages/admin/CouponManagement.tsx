import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tags, Plus, Edit, Trash, Calendar, Percent, DollarSign, Hash } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCouponsCollection } from "@/services/dbService";
import { Skeleton } from "@/components/ui/skeleton";

interface Coupon {
  id: number;
  code: string;
  discount: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expires: string;
  usage: string;
  maxUses: number | string;
  currentUses: number;
}

const CouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    discountType: "percentage",
    discountValue: 10,
    expires: "",
    maxUses: 100,
    currentUses: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const couponsCollection = await getCouponsCollection();
        if (couponsCollection) {
          const data = await couponsCollection.find({}).toArray();
          setCoupons(data);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast({
          title: "Error",
          description: "Failed to load coupons",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, [toast]);

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discountValue) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const formattedDiscount = newCoupon.discountType === "percentage" 
        ? `${newCoupon.discountValue}%` 
        : `$${newCoupon.discountValue.toFixed(2)}`;
      
      const formattedUsage = `0/${newCoupon.maxUses === "Unlimited" ? "Unlimited" : newCoupon.maxUses}`;
      
      const newId = coupons.length > 0 ? Math.max(...coupons.map(c => c.id)) + 1 : 1;
      
      const couponToAdd = {
        id: newId,
        code: newCoupon.code,
        discount: formattedDiscount,
        discountType: newCoupon.discountType as "percentage" | "fixed",
        discountValue: Number(newCoupon.discountValue),
        expires: newCoupon.expires || "Never",
        usage: formattedUsage,
        maxUses: newCoupon.maxUses || "Unlimited",
        currentUses: 0
      };
      
      const couponsCollection = await getCouponsCollection();
      if (couponsCollection) {
        await couponsCollection.insertOne(couponToAdd);
        setCoupons([...coupons, couponToAdd]);
        
        toast({
          title: "Coupon Added",
          description: `Coupon ${newCoupon.code} has been created successfully.`
        });
        
        setNewCoupon({
          code: "",
          discountType: "percentage",
          discountValue: 10,
          expires: "",
          maxUses: 100,
          currentUses: 0
        });
        
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      toast({
        title: "Error",
        description: "Failed to add coupon",
        variant: "destructive"
      });
    }
  };

  const handleEditCoupon = async () => {
    if (!currentCoupon) return;
    
    try {
      const formattedDiscount = currentCoupon.discountType === "percentage" 
        ? `${currentCoupon.discountValue}%` 
        : `$${currentCoupon.discountValue.toFixed(2)}`;
      
      const formattedUsage = `${currentCoupon.currentUses}/${currentCoupon.maxUses === "Unlimited" ? "Unlimited" : currentCoupon.maxUses}`;
      
      const updatedCoupon = {
        ...currentCoupon,
        discount: formattedDiscount,
        usage: formattedUsage
      };
      
      const couponsCollection = await getCouponsCollection();
      if (couponsCollection) {
        await couponsCollection.updateOne(
          { id: currentCoupon.id },
          { $set: updatedCoupon }
        );
        
        setCoupons(prevCoupons => 
          prevCoupons.map(coupon => 
            coupon.id === currentCoupon.id ? updatedCoupon : coupon
          )
        );
        
        toast({
          title: "Coupon Updated",
          description: `Coupon ${currentCoupon.code} has been updated successfully.`
        });
        
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast({
        title: "Error",
        description: "Failed to update coupon",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCoupon = async () => {
    if (!currentCoupon) return;
    
    try {
      const couponsCollection = await getCouponsCollection();
      if (couponsCollection) {
        await couponsCollection.deleteOne({ id: currentCoupon.id });
        
        setCoupons(prevCoupons => 
          prevCoupons.filter(coupon => coupon.id !== currentCoupon.id)
        );
        
        toast({
          title: "Coupon Deleted",
          description: `Coupon ${currentCoupon.code} has been deleted successfully.`
        });
        
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <CouponSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Coupon Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Create a new discount coupon for your customers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="couponCode" className="text-right">
                  Code
                </Label>
                <Input
                  id="couponCode"
                  placeholder="SUMMER20"
                  className="col-span-3"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Discount Type
                </Label>
                <RadioGroup 
                  className="col-span-3"
                  value={newCoupon.discountType}
                  onValueChange={(value) => setNewCoupon({...newCoupon, discountType: value as "percentage" | "fixed"})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="flex items-center">
                      <Percent className="h-4 w-4 mr-1" /> Percentage
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" /> Fixed Amount
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountValue" className="text-right">
                  Value
                </Label>
                <div className="col-span-3 flex items-center">
                  {newCoupon.discountType === "percentage" && <Percent className="h-4 w-4 mr-1" />}
                  {newCoupon.discountType === "fixed" && <DollarSign className="h-4 w-4 mr-1" />}
                  <Input
                    id="discountValue"
                    type="number"
                    placeholder={newCoupon.discountType === "percentage" ? "10" : "10.00"}
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({...newCoupon, discountValue: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiryDate" className="text-right">
                  Expires
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  className="col-span-3"
                  value={newCoupon.expires}
                  onChange={(e) => setNewCoupon({...newCoupon, expires: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxUses" className="text-right">
                  Usage Limit
                </Label>
                <div className="col-span-3">
                  <Select
                    value={typeof newCoupon.maxUses === 'string' ? newCoupon.maxUses : String(newCoupon.maxUses)}
                    onValueChange={(value) => {
                      setNewCoupon({
                        ...newCoupon, 
                        maxUses: value === "Unlimited" ? "Unlimited" : parseInt(value)
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select usage limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 uses</SelectItem>
                      <SelectItem value="50">50 uses</SelectItem>
                      <SelectItem value="100">100 uses</SelectItem>
                      <SelectItem value="500">500 uses</SelectItem>
                      <SelectItem value="1000">1000 uses</SelectItem>
                      <SelectItem value="Unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleAddCoupon}>
                Create Coupon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discount Coupons</CardTitle>
          <CardDescription>
            Create and manage promotional coupon codes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>{coupon.id}</TableCell>
                      <TableCell className="font-medium">{coupon.code}</TableCell>
                      <TableCell>{coupon.discount}</TableCell>
                      <TableCell>{coupon.expires}</TableCell>
                      <TableCell>{coupon.usage}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen && currentCoupon?.id === coupon.id} onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (open) setCurrentCoupon(coupon);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Coupon</DialogTitle>
                                <DialogDescription>
                                  Make changes to the coupon details.
                                </DialogDescription>
                              </DialogHeader>
                              {currentCoupon && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-couponCode" className="text-right">
                                      Code
                                    </Label>
                                    <Input
                                      id="edit-couponCode"
                                      className="col-span-3"
                                      value={currentCoupon.code}
                                      onChange={(e) => setCurrentCoupon({
                                        ...currentCoupon,
                                        code: e.target.value.toUpperCase()
                                      })}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">
                                      Discount Type
                                    </Label>
                                    <RadioGroup 
                                      className="col-span-3"
                                      value={currentCoupon.discountType}
                                      onValueChange={(value) => setCurrentCoupon({
                                        ...currentCoupon,
                                        discountType: value as "percentage" | "fixed"
                                      })}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="percentage" id="edit-percentage" />
                                        <Label htmlFor="edit-percentage" className="flex items-center">
                                          <Percent className="h-4 w-4 mr-1" /> Percentage
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="fixed" id="edit-fixed" />
                                        <Label htmlFor="edit-fixed" className="flex items-center">
                                          <DollarSign className="h-4 w-4 mr-1" /> Fixed Amount
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-discountValue" className="text-right">
                                      Value
                                    </Label>
                                    <div className="col-span-3 flex items-center">
                                      {currentCoupon.discountType === "percentage" && <Percent className="h-4 w-4 mr-1" />}
                                      {currentCoupon.discountType === "fixed" && <DollarSign className="h-4 w-4 mr-1" />}
                                      <Input
                                        id="edit-discountValue"
                                        type="number"
                                        value={currentCoupon.discountValue}
                                        onChange={(e) => setCurrentCoupon({
                                          ...currentCoupon,
                                          discountValue: parseFloat(e.target.value)
                                        })}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-expiryDate" className="text-right">
                                      Expires
                                    </Label>
                                    <Input
                                      id="edit-expiryDate"
                                      type="date"
                                      className="col-span-3"
                                      value={currentCoupon.expires !== "Never" ? currentCoupon.expires : ""}
                                      onChange={(e) => setCurrentCoupon({
                                        ...currentCoupon,
                                        expires: e.target.value || "Never"
                                      })}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-maxUses" className="text-right">
                                      Usage Limit
                                    </Label>
                                    <div className="col-span-3">
                                      <Select
                                        value={typeof currentCoupon.maxUses === 'string' ? currentCoupon.maxUses : String(currentCoupon.maxUses)}
                                        onValueChange={(value) => {
                                          setCurrentCoupon({
                                            ...currentCoupon, 
                                            maxUses: value === "Unlimited" ? "Unlimited" : parseInt(value)
                                          })
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select usage limit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="10">10 uses</SelectItem>
                                          <SelectItem value="50">50 uses</SelectItem>
                                          <SelectItem value="100">100 uses</SelectItem>
                                          <SelectItem value="500">500 uses</SelectItem>
                                          <SelectItem value="1000">1000 uses</SelectItem>
                                          <SelectItem value="Unlimited">Unlimited</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit" onClick={handleEditCoupon}>
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog open={isDeleteDialogOpen && currentCoupon?.id === coupon.id} onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (open) setCurrentCoupon(coupon);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Delete Coupon</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this coupon? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              {currentCoupon && (
                                <div className="py-4">
                                  <div className="border p-4 rounded-md mb-4">
                                    <p><strong>Code:</strong> {currentCoupon.code}</p>
                                    <p><strong>Discount:</strong> {currentCoupon.discount}</p>
                                    <p><strong>Expires:</strong> {currentCoupon.expires}</p>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteCoupon}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No coupons found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCoupons.length} of {coupons.length} coupons
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const CouponSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Coupon Management</h1>
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-64 mb-4" />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Skeleton className="h-4 w-8" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-48" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default CouponManagement;
