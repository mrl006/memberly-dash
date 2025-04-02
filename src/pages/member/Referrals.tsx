
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, DollarSign, Users, ExternalLink, Wallet, RefreshCw, ArrowUpRight } from "lucide-react";
import { fetchReferralData, requestWithdrawal, savePaymentMethod } from "@/services/referralService";

const Referrals = () => {
  const [referralLink, setReferralLink] = useState("");
  const [referralData, setReferralData] = useState<any>({
    earnings: 0,
    availableBalance: 0,
    totalEarned: 0,
    referralCount: 0,
    withdrawals: [],
    referrals: []
  });
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Generate a mock referral link
    const userId = "1"; // For demonstration, would use actual user ID in production
    const hostname = window.location.origin;
    setReferralLink(`${hostname}/register?ref=${userId}`);
    
    // Load referral data
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchReferralData();
      setReferralData(data);
      
      // Pre-fill payment method if available
      if (data.paymentMethod) {
        setPaymentMethod(data.paymentMethod.type);
        setPaymentDetails(data.paymentMethod.details);
      }
    } catch (error) {
      console.error("Error loading referral data:", error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied",
      description: "Referral link copied to clipboard"
    });
  };

  const handleSavePaymentMethod = async () => {
    if (!paymentDetails) {
      toast({
        title: "Payment Details Required",
        description: "Please enter your payment details",
        variant: "destructive"
      });
      return;
    }

    try {
      await savePaymentMethod({
        type: paymentMethod,
        details: paymentDetails
      });
      
      toast({
        title: "Success",
        description: "Payment method saved successfully"
      });
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive"
      });
    }
  };

  const handleWithdrawalRequest = async () => {
    const amount = parseFloat(withdrawalAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    if (amount > referralData.availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds available balance",
        variant: "destructive"
      });
      return;
    }

    if (!paymentDetails) {
      toast({
        title: "Payment Details Required",
        description: "Please set your payment details first",
        variant: "destructive"
      });
      return;
    }

    try {
      await requestWithdrawal({
        amount,
        paymentMethod: {
          type: paymentMethod,
          details: paymentDetails
        }
      });
      
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted for approval"
      });
      
      // Refresh data
      loadReferralData();
      setWithdrawalAmount("");
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
      toast({
        title: "Error",
        description: "Failed to process withdrawal request",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full mx-auto"></div>
          <p className="text-gray-500">Loading referral data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
        <p className="text-gray-500 mt-1">
          Share your link and earn 20% commission on all referrals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <DollarSign className="h-5 w-5 mr-2 opacity-80" /> 
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${referralData.availableBalance.toFixed(2)}</div>
            <p className="text-blue-100 text-sm mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 mr-2 opacity-80" /> 
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referralData.referralCount}</div>
            <p className="text-emerald-100 text-sm mt-1">Successful referrals</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Wallet className="h-5 w-5 mr-2 opacity-80" /> 
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${referralData.totalEarned.toFixed(2)}</div>
            <p className="text-purple-100 text-sm mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link with your friends to earn commission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="font-mono text-sm bg-gray-50"
            />
            <Button onClick={copyReferralLink}>
              <Copy className="h-4 w-4 mr-2" /> Copy
            </Button>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <Button variant="outline" size="sm" className="gap-2">
              <img src="/lovable-uploads/94519d56-0d06-4fbe-952f-0dd4bd06039c.png" className="w-4 h-4" alt="Facebook" />
              Share on Facebook
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <img src="/lovable-uploads/8cfe87fa-ee25-4cd6-830a-bd2a6dce6f5a.png" className="w-4 h-4" alt="Twitter" />
              Share on Twitter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" /> Share Link
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="withdraw" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Withdrawal History</TabsTrigger>
          <TabsTrigger value="referrals">My Referrals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="withdraw" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Earnings</CardTitle>
              <CardDescription>
                Request a withdrawal of your available balance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Withdrawal Amount</Label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <Input
                    id="withdrawAmount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Available balance: ${referralData.availableBalance.toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="withdrawMethod">Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  disabled={!paymentDetails}
                >
                  <SelectTrigger id="withdrawMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="usdt">USDT (BEP20)</SelectItem>
                  </SelectContent>
                </Select>
                {!paymentDetails && (
                  <p className="text-sm text-amber-600">
                    Please set up your payment method first
                  </p>
                )}
              </div>
              
              <Button 
                onClick={handleWithdrawalRequest}
                disabled={!paymentDetails || referralData.availableBalance <= 0}
                className="w-full"
              >
                Request Withdrawal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Set your preferred payment method for withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="usdt">USDT (BEP20)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentDetails">
                  {paymentMethod === "paypal" ? "PayPal Email" : 
                   paymentMethod === "upi" ? "UPI ID" : 
                   "USDT Address (BEP20)"}
                </Label>
                <Input
                  id="paymentDetails"
                  placeholder={
                    paymentMethod === "paypal" ? "your-email@example.com" : 
                    paymentMethod === "upi" ? "your-name@upi" : 
                    "0x..."
                  }
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                />
              </div>
              
              <Button onClick={handleSavePaymentMethod}>
                Save Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>
                Track your previous withdrawal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralData.withdrawals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referralData.withdrawals.map((withdrawal: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{withdrawal.date}</TableCell>
                        <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{withdrawal.paymentMethod.type}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            withdrawal.status === "completed" ? "bg-green-100 text-green-800" : 
                            withdrawal.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-red-100 text-red-800"
                          }`}>
                            {withdrawal.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No withdrawal history found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="referrals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>My Referrals</CardTitle>
              <CardDescription>
                View details of users you've referred
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralData.referrals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Commission Earned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referralData.referrals.map((referral: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{referral.name}</TableCell>
                        <TableCell>{referral.joinDate}</TableCell>
                        <TableCell>${referral.commission.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't referred anyone yet</p>
                  <Button variant="outline" className="mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" /> Share Your Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Referrals;
