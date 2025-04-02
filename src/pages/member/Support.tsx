
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LifeBuoy, MessageSquare, AlertCircle, Plus, Send, Loader2 } from "lucide-react";
import { getTicketsCollection } from "@/services/dbService";
import { useToast } from "@/hooks/use-toast";

// Mock FAQ data
const faqItems = [
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription by going to the Subscriptions page, selecting the subscription you want to cancel, and clicking on the 'Cancel' button. Follow the prompts to complete the cancellation process."
  },
  {
    question: "Can I download content on multiple devices?",
    answer: "Yes, you can download content on up to 5 devices with your membership. Simply log in to your account on each device to access your downloads."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans."
  },
  {
    question: "How often is new content added?",
    answer: "New content is typically added weekly. Premium members receive notifications when new content relevant to their interests becomes available."
  },
  {
    question: "I've forgotten my password, what should I do?",
    answer: "Click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to reset your password."
  },
];

const Support = () => {
  const [activeTab, setActiveTab] = useState("new-ticket");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    description: "",
  });
  const [userTickets, setUserTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simulated user info (in a real app, this would come from auth)
  const currentUser = {
    name: "Current User",
    email: "user@example.com"
  };

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setIsLoading(true);
        const ticketsCollection = await getTicketsCollection();
        
        if (ticketsCollection) {
          // In a real app, you would filter by authenticated user ID
          // Here we're just showing tickets with user === "Current User"
          const result = await ticketsCollection.find({ user: currentUser.name }).toArray();
          setUserTickets(result);
        }
      } catch (error) {
        console.error("Error fetching user tickets:", error);
        toast({
          title: "Error",
          description: "Failed to load your support tickets",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === "my-tickets") {
      fetchUserTickets();
    }
  }, [activeTab, toast]);

  const handleTicketFormChange = (field, value) => {
    setTicketForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const ticketsCollection = await getTicketsCollection();
      
      if (ticketsCollection) {
        const newTicket = {
          id: Date.now(),
          user: currentUser.name,
          subject: ticketForm.subject,
          category: ticketForm.category,
          description: ticketForm.description,
          status: "Open",
          priority: "Medium", // Default priority
          created: new Date().toISOString().split('T')[0],
          messages: 1,
        };
        
        await ticketsCollection.insertOne(newTicket);
        
        toast({
          title: "Success",
          description: "Your support ticket has been submitted",
        });
        
        setTicketForm({
          subject: "",
          category: "",
          description: "",
        });
        
        // Switch to My Tickets tab and refresh the list
        setActiveTab("my-tickets");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Error",
        description: "Failed to submit your support ticket",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Get Support</h1>
      </div>

      <Tabs defaultValue="new-ticket" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="new-ticket">
            <Plus className="h-4 w-4 mr-2" /> New Ticket
          </TabsTrigger>
          <TabsTrigger value="my-tickets">
            <MessageSquare className="h-4 w-4 mr-2" /> My Tickets
          </TabsTrigger>
          <TabsTrigger value="faqs">
            <AlertCircle className="h-4 w-4 mr-2" /> FAQs
          </TabsTrigger>
        </TabsList>

        {/* New Ticket Form */}
        <TabsContent value="new-ticket">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Please provide details about your issue and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={ticketForm.subject}
                    onChange={(e) => handleTicketFormChange("subject", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={ticketForm.category}
                    onValueChange={(value) => handleTicketFormChange("category", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="account">Account Access</SelectItem>
                      <SelectItem value="technical">Technical Issues</SelectItem>
                      <SelectItem value="content">Content Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe your issue in detail"
                    rows={5}
                    value={ticketForm.description}
                    onChange={(e) => handleTicketFormChange("description", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                  <Input id="attachment" type="file" disabled={isLoading} />
                  <p className="text-xs text-muted-foreground">
                    Max file size: 5MB. Supported formats: JPG, PNG, PDF
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                onClick={handleSubmitTicket} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Submit Ticket
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* My Tickets */}
        <TabsContent value="my-tickets">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>
                View and manage your support requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <span>Loading your tickets...</span>
                </div>
              ) : userTickets.length > 0 ? (
                <div className="space-y-4">
                  {userTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <Badge variant={ticket.status === "Open" ? "default" : "secondary"} className="ml-2">
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {ticket.created} • {ticket.messages} messages
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No Support Tickets</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven't created any support tickets yet
                  </p>
                  <Button onClick={() => setActiveTab("new-ticket")}>Create a Ticket</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs */}
        <TabsContent value="faqs">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("new-ticket")}>
                  Submit a support ticket
                </Button>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;
