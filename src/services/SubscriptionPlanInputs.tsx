
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAnalyticsCollection, updateDashboardAnalytics } from "@/services/dbService";
import { toast } from "@/hooks/use-toast";

interface PlanData {
  name: string;
  value: number;
}

const SubscriptionPlanInputs = () => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const analyticsCollection = await getAnalyticsCollection();
        if (analyticsCollection) {
          const data = await analyticsCollection.findOne({ id: "dashboard-data" });
          if (data && data.subscriptionPlans) {
            setPlans(data.subscriptionPlans);
          }
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription plans",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlanSave = async () => {
    try {
      setIsSaving(true);
      const analyticsCollection = await getAnalyticsCollection();
      if (analyticsCollection) {
        const data = await analyticsCollection.findOne({ id: "dashboard-data" });
        if (data) {
          const updatedData = {
            ...data,
            subscriptionPlans: plans
          };
          
          await updateDashboardAnalytics(updatedData);
          
          toast({
            title: "Success",
            description: "Subscription plans updated successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error saving subscription plans:", error);
      toast({
        title: "Error",
        description: "Failed to save subscription plans",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlanChange = (index: number, value: number) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], value: value };
    setPlans(updated);
  };

  if (isLoading) {
    return <div>Loading subscription plans...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Subscription Plans</CardTitle>
        <CardDescription>Update subscription plan distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {plans.map((plan, index) => (
            <div key={index} className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor={`plan-${index}`}>{plan.name}</Label>
              <Input
                id={`plan-${index}`}
                type="number"
                value={plan.value}
                onChange={(e) => handlePlanChange(index, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePlanSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Plan Data"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPlanInputs;
