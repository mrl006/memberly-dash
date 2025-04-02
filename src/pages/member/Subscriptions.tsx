
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Check, X } from "lucide-react";

const Subscriptions = () => {
  // Dummy subscription data
  const subscription = {
    name: "Professional Plan",
    status: "active",
    price: "$19.99/month",
    nextBillingDate: "May 28, 2023",
    daysRemaining: 18,
    features: [
      "Full Access to Courses",
      "Premium Downloads",
      "Live Webinars",
      "Priority Support"
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Subscription</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and billing details</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Subscription */}
        <Card className="md:col-span-2 border-none shadow-sm">
          <CardHeader className="pb-2 border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Current Plan</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {subscription.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardDescription>
              Your subscription details and current status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg">{subscription.name}</h3>
                <p className="text-primary font-medium">{subscription.price}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Period</span>
                  <span>{subscription.daysRemaining} days remaining</span>
                </div>
                <Progress value={100 - (subscription.daysRemaining / 30) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Next billing date: {subscription.nextBillingDate}
                </p>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="font-medium mb-3">Included in your plan:</h4>
                <ul className="space-y-2">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 py-3 flex justify-between">
            <Button variant="outline" size="sm">
              Change Plan
            </Button>
            <Button variant="destructive" size="sm">
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
        
        {/* Payment Method */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2 border-b">
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Manage your billing details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="rounded-md border border-gray-200 p-2 bg-gray-50">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Visa ending in 4242</h3>
                <p className="text-sm text-gray-500">Expires 12/2024</p>
              </div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <p className="text-sm font-medium">Billing Address</p>
              <p className="text-sm text-gray-500">
                123 Main Street<br />
                Anytown, CA 12345<br />
                United States
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 py-3">
            <Button variant="outline" size="sm">
              Update Payment Method
            </Button>
          </CardFooter>
        </Card>
        
        {/* Billing History */}
        <Card className="md:col-span-3 border-none shadow-sm">
          <CardHeader className="pb-2 border-b">
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              Your payment history and receipts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-4 text-sm">Apr 28, 2023</td>
                    <td className="px-4 py-4 text-sm">Professional Plan - Monthly</td>
                    <td className="px-4 py-4 text-sm">$19.99</td>
                    <td className="px-4 py-4 text-sm">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        Download
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 text-sm">Mar 28, 2023</td>
                    <td className="px-4 py-4 text-sm">Professional Plan - Monthly</td>
                    <td className="px-4 py-4 text-sm">$19.99</td>
                    <td className="px-4 py-4 text-sm">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <Button variant="link" size="sm" className="h-auto p-0">
                        Download
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
