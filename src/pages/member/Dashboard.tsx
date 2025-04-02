
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Calendar, Download, FileText, PlayCircle, Video, BarChart3, MousePointer, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getUsers } from "@/services/userService";

const Dashboard = () => {
  // User activity data
  const [userStats, setUserStats] = useState({
    courseProgress: 68,
    lastSessionMinutes: 47,
    totalActivities: 12
  });

  // Subscription data
  const [subscription, setSubscription] = useState({
    name: "Professional Plan",
    status: "active",
    nextBillingDate: "May 28, 2023",
    daysRemaining: 18,
  });

  // User content data
  const [products, setProducts] = useState([
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
  ]);

  // Load user data when component mounts
  useEffect(() => {
    // In a real app, these values would come from an API
    // Here we're simulating that by retrieving user data from our service
    const users = getUsers();
    if (users.length > 0) {
      const user = users[0];

      // In a real app, these metrics would be fetched from a user analytics service
      // For now, we'll use our predefined values but with a slight randomization to make it feel more "real"
      const randomProgress = Math.floor(Math.random() * 15) + 60; // 60-75%
      const randomSession = Math.floor(Math.random() * 20) + 40; // 40-60 minutes
      const randomActivities = Math.floor(Math.random() * 5) + 10; // 10-15 activities

      setUserStats({
        courseProgress: randomProgress,
        lastSessionMinutes: randomSession,
        totalActivities: randomActivities
      });

      // Update subscription based on user data
      setSubscription({
        name: user.subscription,
        status: user.status,
        nextBillingDate: "May 28, 2023", // In a real app, this would come from the subscription service
        daysRemaining: 18,
      });
    }
  }, []);

  // Stats cards data
  const statsCards = [
    {
      title: "Course Progress",
      value: `${userStats.courseProgress}%`,
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      description: "Average completion rate",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Last Session",
      value: `${userStats.lastSessionMinutes} min`,
      icon: <Clock className="h-5 w-5 text-green-600" />,
      description: "Time spent learning",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Activities",
      value: userStats.totalActivities.toString(),
      icon: <MousePointer className="h-5 w-5 text-purple-600" />,
      description: "Completed this month",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8 w-full">
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
      
      {/* Your Content Section - Redesigned based on the provided image */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Content</h2>
          <Link to="/member/access-products">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Course 1 */}
          <div className="border rounded-md overflow-hidden shadow-sm">
            <div className="p-4 border-b flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                Course
              </Badge>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-4">Introduction to Memberships</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2 bg-gray-100" />
                <p className="text-xs text-gray-500">Last accessed: 2 days ago</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 flex justify-center">
              <Button variant="outline" className="w-full border-gray-200">
                <PlayCircle className="mr-2 h-4 w-4 text-primary" />
                Continue Learning
              </Button>
            </div>
          </div>

          {/* Course 2 */}
          <div className="border rounded-md overflow-hidden shadow-sm">
            <div className="p-4 border-b flex items-center space-x-3">
              <Video className="h-6 w-6 text-primary" />
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                Course
              </Badge>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-4">Advanced Monetization</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>30%</span>
                </div>
                <Progress value={30} className="h-2 bg-gray-100" />
                <p className="text-xs text-gray-500">Last accessed: 1 week ago</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 flex justify-center">
              <Button variant="outline" className="w-full border-gray-200">
                <PlayCircle className="mr-2 h-4 w-4 text-primary" />
                Continue Learning
              </Button>
            </div>
          </div>

          {/* Event */}
          <div className="border rounded-md overflow-hidden shadow-sm">
            <div className="p-4 border-b flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-primary" />
              <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                Event
              </Badge>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-4">Monthly Webinar</h3>
              
              <div className="mt-4 mb-6">
                <p className="text-sm text-gray-600">
                  May 15, 2023 at 2:00 PM EST
                </p>
                <Badge variant="outline" className="mt-3 bg-orange-50 text-orange-600 border-orange-200">
                  Upcoming
                </Badge>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 flex justify-center">
              <Button variant="outline" className="w-full border-gray-200">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                Join Event
              </Button>
            </div>
          </div>

          {/* Download */}
          <div className="border rounded-md overflow-hidden shadow-sm">
            <div className="p-4 border-b flex items-center space-x-3">
              <Download className="h-6 w-6 text-primary" />
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                Download
              </Badge>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-4">Resource Pack</h3>
              
              <div className="mt-4 mb-7">
                <p className="text-sm text-gray-600">
                  Downloaded 45 times
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 flex justify-center">
              <Button variant="outline" className="w-full border-gray-200">
                <Download className="mr-2 h-4 w-4 text-primary" />
                Download Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
