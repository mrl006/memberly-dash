
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle, 
  XCircle, 
  Percent, 
  DollarSign, 
  Users, 
  BarChart3, 
  Settings, 
  Search,
  RefreshCw,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchAdminReferralData, 
  approveWithdrawal, 
  rejectWithdrawal,
  updateReferralSettings
} from "@/services/adminReferralService";

const ReferralManagement = () => {
  const [referralData, setReferralData] = useState<any>({
    stats: {
      totalCommissions: 0,
      pendingWithdrawals: 0,
      totalReferrals: 0,
      activeReferrers: 0,
    },
    pendingWithdrawals: [],
    topReferrers: [],
    settings: {
      commissionRate: 20,
      minWithdrawalAmount: 10,
      isReferralActive: true,
      allowPaypal: true,
      allowUpi: true,
      allowUsdt: true
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminReferralData();
      setReferralData(data);
    } catch (error) {
      console.error("Error loading admin referral data:", error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    try {
      await approveWithdrawal(withdrawalId);
      toast({
        title: "Withdrawal Approved",
        description: "The withdrawal request has been approved"
      });
      loadReferralData();
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast({
        title: "Error",
        description: "Failed to approve withdrawal",
        variant: "destructive"
      });
    }
  };

  const handleRejectWithdrawal = async (withdrawalId: string) => {
    try {
      await rejectWithdrawal(withdrawalId);
      toast({
        title: "Withdrawal Rejected",
        description: "The withdrawal request has been rejected"
      });
      loadReferralData();
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      toast({
        title: "Error",
        description: "Failed to reject withdrawal",
        variant: "destructive"
      });
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateReferralSettings(referralData.settings);
      toast({
        title: "Settings Saved",
        description: "Referral program settings have been updated"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    }
  };

  const handleSettingChange = (field: string, value: any) => {
    setReferralData({
      ...referralData,
      settings: {
        ...referralData.settings,
        [field]: value
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
          <p className="text-gray-500">Loading referral data...</p>
        </div>
      </div>
    );
  }

  const filteredWithdrawals = referralData.pendingWithdrawals.filter((w: any) => 
    w.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Referral Program Management</h1>
        <p className="text-gray-500 mt-1">
          Manage and monitor your referral program performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-500" /> 
              Total Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${referralData.stats.totalCommissions.toFixed(2)}</div>
            <p className="text-gray-500 text-sm mt-1">All-time payouts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-500" /> 
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referralData.stats.totalReferrals}</div>
            <p className="text-gray-500 text-sm mt-1">Successful referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-500" /> 
              Active Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referralData.stats.activeReferrers}</div>
            <p className="text-gray-500 text-sm mt-1">Users with ≥1 referral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-amber-600">
              <FileText className="h-5 w-5 mr-2 text-amber-600" /> 
              Pending Withdrawals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${referralData.stats.pendingWithdrawals.toFixed(2)}</div>
            <p className="text-gray-500 text-sm mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="withdrawals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
          <TabsTrigger value="top-referrers">Top Referrers</TabsTrigger>
          <TabsTrigger value="settings">Program Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="withdrawals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Withdrawal Requests</CardTitle>
              <CardDescription>
                Review and process user withdrawal requests
              </CardDescription>
              <div className="flex mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by user name or ID..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="ml-2" onClick={loadReferralData}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredWithdrawals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.map((withdrawal: any) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium">{withdrawal.userName}</TableCell>
                        <TableCell>${withdrawal.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{withdrawal.paymentMethod}</TableCell>
                        <TableCell>{withdrawal.requestDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleApproveWithdrawal(withdrawal.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleRejectWithdrawal(withdrawal.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-5 w-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending withdrawal requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="top-referrers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>
                Users who have generated the most referrals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralData.topReferrers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Referral Count</TableHead>
                      <TableHead>Total Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referralData.topReferrers.map((referrer: any) => (
                      <TableRow key={referrer.id}>
                        <TableCell className="font-medium">{referrer.name}</TableCell>
                        <TableCell>{referrer.email}</TableCell>
                        <TableCell>{referrer.referralCount}</TableCell>
                        <TableCell>${referrer.totalEarnings.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No referral data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Program Settings</CardTitle>
              <CardDescription>
                Configure your referral program parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isReferralActive" className="text-base font-medium">Program Status</Label>
                  <p className="text-sm text-gray-500">Enable or disable the referral program</p>
                </div>
                <Switch
                  id="isReferralActive"
                  checked={referralData.settings.isReferralActive}
                  onCheckedChange={(checked) => handleSettingChange("isReferralActive", checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commissionRate" className="text-base font-medium">
                  Commission Rate (%)
                </Label>
                <div className="flex items-center max-w-xs">
                  <Input
                    id="commissionRate"
                    type="number"
                    value={referralData.settings.commissionRate}
                    onChange={(e) => handleSettingChange("commissionRate", parseFloat(e.target.value))}
                    className="pr-9"
                  />
                  <Percent className="h-4 w-4 text-gray-400 -ml-8" />
                </div>
                <p className="text-sm text-gray-500">
                  Percentage of revenue shared with referrers
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minWithdrawalAmount" className="text-base font-medium">
                  Minimum Withdrawal Amount
                </Label>
                <div className="flex items-center max-w-xs">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <Input
                    id="minWithdrawalAmount"
                    type="number"
                    value={referralData.settings.minWithdrawalAmount}
                    onChange={(e) => handleSettingChange("minWithdrawalAmount", parseFloat(e.target.value))}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Minimum amount required for withdrawal
                </p>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Payment Methods</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <span className="font-medium">PayPal</span>
                      <p className="text-sm text-gray-500">Allow PayPal withdrawals</p>
                    </div>
                    <Switch
                      checked={referralData.settings.allowPaypal}
                      onCheckedChange={(checked) => handleSettingChange("allowPaypal", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <span className="font-medium">UPI</span>
                      <p className="text-sm text-gray-500">Allow UPI withdrawals</p>
                    </div>
                    <Switch
                      checked={referralData.settings.allowUpi}
                      onCheckedChange={(checked) => handleSettingChange("allowUpi", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <span className="font-medium">USDT (BEP20)</span>
                      <p className="text-sm text-gray-500">Allow USDT withdrawals</p>
                    </div>
                    <Switch
                      checked={referralData.settings.allowUsdt}
                      onCheckedChange={(checked) => handleSettingChange("allowUsdt", checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  <Settings className="h-4 w-4 mr-2" /> Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferralManagement;
