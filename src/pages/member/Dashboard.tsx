
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Calendar, Download, FileText, PlayCircle, Video } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Dummy subscription data
  const subscription = {
    name: "Professional Plan",
    status: "active",
    nextBillingDate: "May 28, 2023",
    daysRemaining: 18,
  };

  // Dummy products data
  const products = [
    {
      id: "1",
      name: "Introduction to Memberships",
      type: "Course",
      icon: <FileText className="h-10 w-10 text-primary" />,
      progress: 75,
    },
    {
      id: "2",
      name: "Advanced Monetization",
      type: "Course",
      icon: <Video className="h-10 w-10 text-primary" />,
      progress: 30,
    },
    {
      id: "3",
      name: "Monthly Webinar",
      type: "Event",
      icon: <Calendar className="h-10 w-10 text-primary" />,
      date: "May 15, 2023",
    },
    {
      id: "4",
      name: "Resource Pack",
      type: "Download",
      icon: <Download className="h-10 w-10 text-primary" />,
    },
  ];

  // Latest announcements
  const announcements = [
    {
      id: "1",
      title: "New Course Available",
      date: "3 days ago",
      content: "Check out our new course on advanced membership strategies!"
    },
    {
      id: "2",
      title: "Upcoming Maintenance",
      date: "1 week ago",
      content: "The platform will be undergoing maintenance on May 20th from 2-4 AM EST."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, John!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your membership.
        </p>
      </div>
      
      {/* Subscription Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Your Subscription</CardTitle>
              <CardDescription>Current plan and billing information</CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {subscription.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
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
              <Progress value={100 - (subscription.daysRemaining / 30) * 100} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/member/subscriptions">
            <Button variant="outline" size="sm">
              Manage Subscription
            </Button>
          </Link>
        </CardFooter>
      </Card>
      
      {/* Products Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Content</h2>
          <Link to="/member/downloads">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {product.icon}
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {product.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium line-clamp-1">{product.name}</h3>
                {product.type === "Course" && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{product.progress}%</span>
                    </div>
                    <Progress value={product.progress} />
                  </div>
                )}
                {product.type === "Event" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Scheduled for {product.date}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-1">
                <Button className="w-full">
                  {product.type === "Course" ? "Continue Learning" : 
                   product.type === "Event" ? "Join Event" : 
                   "Download Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Announcements */}
      <div>
        <h2 className="text-xl font-bold mb-4">Latest Announcements</h2>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">{announcement.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p>{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Quick Support */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Our support team is ready to assist you</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link to="/member/support">
            <Button>
              Contact Support
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
