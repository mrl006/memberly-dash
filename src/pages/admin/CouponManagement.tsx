
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tags, Plus, Edit, Trash } from "lucide-react";

// Mock coupon data
const initialCoupons = [
  { id: 1, code: "WELCOME20", discount: "20%", expires: "2023-12-31", usage: "10/100" },
  { id: 2, code: "SUMMER50", discount: "50%", expires: "2023-09-30", usage: "45/50" },
  { id: 3, code: "FLAT10", discount: "$10.00", expires: "2023-10-15", usage: "23/Unlimited" },
  { id: 4, code: "NEWUSER", discount: "15%", expires: "Never", usage: "156/Unlimited" },
];

const CouponManagement = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Coupon Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Coupon
        </Button>
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
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
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

export default CouponManagement;
