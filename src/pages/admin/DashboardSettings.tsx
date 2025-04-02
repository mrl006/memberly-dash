
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenueInputs from "@/services/RevenueInputs";
import SubscriptionPlanInputs from "@/services/SubscriptionPlanInputs";

const DashboardSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Settings</h1>
        <p className="text-muted-foreground">
          Configure the data displayed on your admin dashboard.
        </p>
      </div>
      
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue">Revenue Data</TabsTrigger>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="mt-4">
          <RevenueInputs />
        </TabsContent>
        <TabsContent value="plans" className="mt-4">
          <SubscriptionPlanInputs />
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Data Management</CardTitle>
          <CardDescription>
            Tips for managing your dashboard data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>All data is stored locally and will persist between sessions</li>
            <li>You can edit key metrics directly on the main dashboard</li>
            <li>Use these settings to modify detailed data like monthly revenue</li>
            <li>Changes will be reflected immediately on the dashboard</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
