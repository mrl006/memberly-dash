
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, CreditCard } from "lucide-react";

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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Subscription</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and billing details</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan */}
        <Card className="border shadow-sm">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Current Plan</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Your subscription details and current status
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold text-xl">{subscription.name}</h3>
                <p className="text-primary font-medium text-lg">{subscription.price}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Period</span>
                  <span>{subscription.daysRemaining} days remaining</span>
                </div>
                <Progress 
                  value={100 - (subscription.daysRemaining / 30) * 100} 
                  className="h-2"
                  // Create a gradient from blue to green
                  style={{
                    background: "linear-gradient(to right, #3b82f6, #10b981)"
                  }}
                />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Next billing date: {subscription.nextBillingDate}
                </p>
              </div>
              
              <div className="pt-2">
                <h4 className="font-medium mb-3 text-center">Included in your plan:</h4>
                <ul className="space-y-3">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Method */}
        <Card className="border shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Payment Method</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your billing details
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="rounded-md border border-gray-200 p-3 bg-gray-50">
                  <CreditCard className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Visa ending in 4242</h3>
                  <p className="text-sm text-gray-500">Expires 12/2024</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Billing Address</p>
                <div className="text-gray-600">
                  <p>123 Main Street</p>
                  <p>Anytown, CA 12345</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
