
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditCard, AlertCircle, Check, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock subscription data
const subscriptions = [
  {
    id: 1,
    name: "Premium Plan",
    status: "Active",
    renewalDate: "September 15, 2023",
    price: "$99.99/year",
    features: ["Unlimited Downloads", "Priority Support", "Early Access", "Exclusive Content"],
    progress: 65,
  },
  {
    id: 2,
    name: "Newsletter Subscription",
    status: "Active",
    renewalDate: "Monthly",
    price: "Free",
    features: ["Weekly Updates", "Blog Access"],
    progress: 100,
  }
];

// Available plans for upgrade
const availablePlans = [
  {
    id: 101,
    name: "Enterprise Plan",
    price: "$199.99/year",
    description: "For teams and businesses",
    features: ["All Premium Features", "Team Management", "API Access", "Dedicated Support"],
    popular: true,
  },
  {
    id: 102,
    name: "Lifetime Access",
    price: "$599.99",
    description: "One-time payment, lifetime access",
    features: ["All Premium Features", "Future Updates", "No Renewal Needed"],
    popular: false,
  }
];

const Subscriptions = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">My Subscriptions</h1>
      </div>

      {/* Active Subscriptions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Subscriptions</h2>
        
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{subscription.name}</CardTitle>
                  <CardDescription>Renews on {subscription.renewalDate}</CardDescription>
                </div>
                <Badge variant={subscription.status === "Active" ? "default" : "secondary"}>
                  {subscription.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subscription period</span>
                    <span>{subscription.progress}% complete</span>
                  </div>
                  <Progress value={subscription.progress} className="h-2" />
                </div>
                
                <div className="pt-2">
                  <p className="font-medium mb-2">Included benefits:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {subscription.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm font-medium">{subscription.price}</p>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Manage</Button>
                <Button variant="outline" size="sm">Cancel</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Available Plans */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold">Available Plans</h2>
        <p className="text-muted-foreground">Upgrade your subscription to get access to more features</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availablePlans.map((plan) => (
            <Card key={plan.id} className={plan.popular ? "border-primary" : ""}>
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Popular Choice
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-4">{plan.price}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Subscribe Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <Card>
          <CardHeader>
            <CardTitle>Manage Payment Methods</CardTitle>
            <CardDescription>Add or update your payment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 text-center border rounded-md bg-muted/50">
              <CreditCard className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="mb-2 font-medium">No payment methods found</p>
              <p className="text-sm text-muted-foreground mb-4">Add a payment method to manage your subscriptions</p>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" /> Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
