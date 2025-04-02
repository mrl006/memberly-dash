
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Calendar, Download, FileText, PlayCircle, Video, BarChart3, MousePointer, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Dummy subscription data
  const subscription = {
    name: "Professional Plan",
    status: "active",
    nextBillingDate: "May 28, 2023",
    daysRemaining: 18,
  };

  // Dummy products data with course progress
  const products = [
    {
      id: "1",
      name: "Introduction to Memberships",
      type: "Course",
      icon: <FileText className="h-10 w-10 text-primary" />,
      progress: 75,
      lastAccessed: "2 days ago",
    },
    {
      id: "2",
      name: "Advanced Monetization",
      type: "Course",
      icon: <Video className="h-10 w-10 text-primary" />,
      progress: 30,
      lastAccessed: "1 week ago",
    },
    {
      id: "3",
      name: "Monthly Webinar",
      type: "Event",
      icon: <Calendar className="h-10 w-10 text-primary" />,
      date: "May 15, 2023",
      time: "2:00 PM EST",
    },
    {
      id: "4",
      name: "Resource Pack",
      type: "Download",
      icon: <Download className="h-10 w-10 text-primary" />,
      downloadCount: 45,
    },
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "Course Progress",
      value: "68%",
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      description: "Average completion rate",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Last Session",
      value: "47 min",
      icon: <Clock className="h-5 w-5 text-green-600" />,
      description: "Time spent learning",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Activities",
      value: "12",
      icon: <MousePointer className="h-5 w-5 text-purple-600" />,
      description: "Completed this month",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section with Stats */}
      <div className="bg-gradient-to-r from-blue-50 via-blue-50 to-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Welcome back, John!</h1>
        <p className="text-muted-foreground mt-1 mb-6">
          Here's what's happening with your membership.
        </p>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {statsCards.map((stat, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="p-4 flex items-start">
                <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Subscription Status */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Subscription</h2>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        </div>
        
        <Card className="overflow-hidden border-none shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{subscription.name}</h3>
                <p className="text-muted-foreground text-sm">
                  Next billing date: {subscription.nextBillingDate}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Period</span>
                  <span>{subscription.daysRemaining} days remaining</span>
                </div>
                <Progress value={100 - (subscription.daysRemaining / 30) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 py-3">
            <Link to="/member/subscriptions">
              <Button variant="outline" size="sm">
                Manage Subscription
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      {/* Products Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Content</h2>
          <Link to="/member/access-products">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow border-none shadow-sm">
              <CardHeader className="pb-2 border-b bg-gray-50">
                <div className="flex justify-between items-start">
                  {product.icon}
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {product.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-1">{product.name}</h3>
                {product.type === "Course" && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{product.progress}%</span>
                    </div>
                    <Progress value={product.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Last accessed: {product.lastAccessed}</p>
                  </div>
                )}
                {product.type === "Event" && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      {product.date} at {product.time}
                    </p>
                    <Badge variant="outline" className="mt-2 bg-orange-50 text-orange-700 border-orange-200">
                      Upcoming
                    </Badge>
                  </div>
                )}
                {product.type === "Download" && product.downloadCount && (
                  <p className="text-xs text-gray-500 mt-3">
                    Downloaded {product.downloadCount} times
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-1 border-t bg-gray-50">
                <Button className="w-full" variant="outline">
                  {product.type === "Course" ? (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Continue Learning
                    </>
                  ) : product.type === "Event" ? (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Join Event
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
