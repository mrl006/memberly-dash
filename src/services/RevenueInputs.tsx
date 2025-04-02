
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

interface MonthlyData {
  name: string;
  total: number;
}

const RevenueInputs = () => {
  const [months, setMonths] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const analyticsCollection = await getAnalyticsCollection();
        if (analyticsCollection) {
          const data = await analyticsCollection.findOne({ id: "dashboard-data" });
          if (data && data.revenueData) {
            setMonths(data.revenueData);
          }
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        toast({
          title: "Error",
          description: "Failed to load revenue data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRevenueSave = async () => {
    try {
      setIsSaving(true);
      const analyticsCollection = await getAnalyticsCollection();
      if (analyticsCollection) {
        const data = await analyticsCollection.findOne({ id: "dashboard-data" });
        if (data) {
          const updatedData = {
            ...data,
            revenueData: months
          };
          
          await updateDashboardAnalytics(updatedData);
          
          toast({
            title: "Success",
            description: "Revenue data updated successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error saving revenue data:", error);
      toast({
        title: "Error",
        description: "Failed to save revenue data",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevenueChange = (index: number, value: number) => {
    const updated = [...months];
    updated[index] = { ...updated[index], total: value };
    setMonths(updated);
  };

  if (isLoading) {
    return <div>Loading revenue data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Monthly Revenue</CardTitle>
        <CardDescription>Update revenue figures for each month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {months.map((month, index) => (
            <div key={index} className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor={`month-${index}`}>{month.name}</Label>
              <Input
                id={`month-${index}`}
                type="number"
                value={month.total}
                onChange={(e) => handleRevenueChange(index, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleRevenueSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Revenue Data"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RevenueInputs;
