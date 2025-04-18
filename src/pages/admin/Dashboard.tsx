
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Users, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight, Save } from "lucide-react";
import { getAnalyticsCollection, updateDashboardAnalytics } from "@/services/dbService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface DashboardData {
  revenueData: Array<{name: string, total: number}>;
  subscriptionPlans: Array<{name: string, value: number}>;
  userActivity: Array<{name: string, active: number}>;
  overallMetrics: {
    totalRevenue: number;
    activeSubscriptions: number;
    totalMembers: number;
    churnRate: string;
  };
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMetrics, setEditedMetrics] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalMembers: 0,
    churnRate: ""
  });
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const analyticsCollection = await getAnalyticsCollection();
        if (analyticsCollection) {
          const data = await analyticsCollection.findOne({ id: "dashboard-data" });
          if (data) {
            setDashboardData(data);
            setEditedMetrics({
              totalRevenue: data.overallMetrics.totalRevenue,
              activeSubscriptions: data.overallMetrics.activeSubscriptions,
              totalMembers: data.overallMetrics.totalMembers,
              churnRate: data.overallMetrics.churnRate
            });
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSaveMetrics = async () => {
    try {
      if (!dashboardData) return;
      
      const updatedData = {
        ...dashboardData,
        overallMetrics: {
          ...editedMetrics
        }
      };
      
      const success = await updateDashboardAnalytics(updatedData);
      
      if (success) {
        setDashboardData(updatedData);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Dashboard metrics updated successfully",
        });
      } else {
        throw new Error("Failed to update metrics");
      }
    } catch (error) {
      console.error("Error updating metrics:", error);
      toast({
        title: "Error",
        description: "Failed to update dashboard metrics",
        variant: "destructive"
      });
    }
  };

  const handleEditMetric = (field: string, value: any) => {
    setEditedMetrics(prev => ({
      ...prev,
      [field]: field === 'churnRate' ? value : Number(value)
    }));
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your membership platform's performance.
          </p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"} 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel Editing" : "Edit Metrics"}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Input 
                  type="number" 
                  value={editedMetrics.totalRevenue} 
                  onChange={(e) => handleEditMetric('totalRevenue', e.target.value)}
                  className="text-xl font-bold"
                />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">${dashboardData?.overallMetrics.totalRevenue?.toLocaleString() || "0"}</div>
                <div className="flex items-center text-sm text-green-600 pt-1">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+18.2% from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Input 
                  type="number" 
                  value={editedMetrics.activeSubscriptions} 
                  onChange={(e) => handleEditMetric('activeSubscriptions', e.target.value)}
                  className="text-xl font-bold"
                />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboardData?.overallMetrics.activeSubscriptions || "0"}</div>
                <div className="flex items-center text-sm text-green-600 pt-1">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+4.3% from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Input 
                  type="number" 
                  value={editedMetrics.totalMembers} 
                  onChange={(e) => handleEditMetric('totalMembers', e.target.value)}
                  className="text-xl font-bold"
                />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboardData?.overallMetrics.totalMembers || "0"}</div>
                <div className="flex items-center text-sm text-green-600 pt-1">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+12.7% from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Input 
                  type="text" 
                  value={editedMetrics.churnRate} 
                  onChange={(e) => handleEditMetric('churnRate', e.target.value)}
                  className="text-xl font-bold"
                />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboardData?.overallMetrics.churnRate || "0"}%</div>
                <div className="flex items-center text-sm text-red-600 pt-1">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+0.3% from last month</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSaveMetrics} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData?.revenueData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, "Revenue"]}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData?.subscriptionPlans || []}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {(dashboardData?.subscriptionPlans || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData?.userActivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your membership platform's performance.
        </p>
      </div>

      {/* Stats Overview Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-full" />
          </CardContent>
        </Card>
      </div>

      {/* User Activity Chart Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
