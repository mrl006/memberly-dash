
import { toast } from "@/hooks/use-toast";

// Mock data for development
const mockAdminReferralData = {
  stats: {
    totalCommissions: 1250.75,
    pendingWithdrawals: 325.50,
    totalReferrals: 48,
    activeReferrers: 12
  },
  pendingWithdrawals: [
    {
      id: "w1",
      userId: "user123",
      userName: "John Smith",
      amount: 75.25,
      paymentMethod: "paypal",
      paymentDetails: "john@example.com",
      requestDate: "2023-11-20"
    },
    {
      id: "w2",
      userId: "user456",
      userName: "Sarah Johnson",
      amount: 120.00,
      paymentMethod: "usdt",
      paymentDetails: "0x1234567890abcdef",
      requestDate: "2023-11-22"
    },
    {
      id: "w3",
      userId: "user789",
      userName: "Mike Brown",
      amount: 45.50,
      paymentMethod: "upi",
      paymentDetails: "mike@upi",
      requestDate: "2023-11-23"
    }
  ],
  topReferrers: [
    {
      id: "user123",
      name: "John Smith",
      email: "john@example.com",
      referralCount: 8,
      totalEarnings: 285.75
    },
    {
      id: "user456",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      referralCount: 6,
      totalEarnings: 215.50
    },
    {
      id: "user789",
      name: "Mike Brown",
      email: "mike@example.com",
      referralCount: 5,
      totalEarnings: 175.25
    },
    {
      id: "user101",
      name: "Emily Davis",
      email: "emily@example.com",
      referralCount: 4,
      totalEarnings: 145.00
    },
    {
      id: "user102",
      name: "David Wilson",
      email: "david@example.com",
      referralCount: 3,
      totalEarnings: 105.75
    }
  ],
  settings: {
    commissionRate: 20,
    minWithdrawalAmount: 10,
    isReferralActive: true,
    allowPaypal: true,
    allowUpi: true,
    allowUsdt: true
  }
};

// Fetch referral data for admin dashboard
export const fetchAdminReferralData = async () => {
  try {
    // In a real application, this would fetch from a backend API
    // For now, we'll use mock data
    return Promise.resolve(mockAdminReferralData);
  } catch (error) {
    console.error("Error fetching admin referral data:", error);
    throw error;
  }
};

// Approve a withdrawal request
export const approveWithdrawal = async (withdrawalId: string) => {
  try {
    // In a real application, this would update the database
    // For now, we'll just simulate success
    
    // Find the withdrawal in the mock data
    const withdrawalIndex = mockAdminReferralData.pendingWithdrawals.findIndex(
      w => w.id === withdrawalId
    );
    
    if (withdrawalIndex !== -1) {
      // Remove from pending withdrawals
      const withdrawal = mockAdminReferralData.pendingWithdrawals.splice(withdrawalIndex, 1)[0];
      
      // Update stats
      mockAdminReferralData.stats.pendingWithdrawals -= withdrawal.amount;
      mockAdminReferralData.stats.totalCommissions += withdrawal.amount;
    }
    
    return Promise.resolve({ success: true });
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    throw error;
  }
};

// Reject a withdrawal request
export const rejectWithdrawal = async (withdrawalId: string) => {
  try {
    // In a real application, this would update the database
    // For now, we'll just simulate success
    
    // Find the withdrawal in the mock data
    const withdrawalIndex = mockAdminReferralData.pendingWithdrawals.findIndex(
      w => w.id === withdrawalId
    );
    
    if (withdrawalIndex !== -1) {
      // Remove from pending withdrawals
      const withdrawal = mockAdminReferralData.pendingWithdrawals.splice(withdrawalIndex, 1)[0];
      
      // Update stats
      mockAdminReferralData.stats.pendingWithdrawals -= withdrawal.amount;
    }
    
    return Promise.resolve({ success: true });
  } catch (error) {
    console.error("Error rejecting withdrawal:", error);
    throw error;
  }
};

// Update referral program settings
export const updateReferralSettings = async (settings: any) => {
  try {
    // In a real application, this would update the database
    // For now, we'll just update our mock data
    mockAdminReferralData.settings = {
      ...mockAdminReferralData.settings,
      ...settings
    };
    
    return Promise.resolve({ success: true });
  } catch (error) {
    console.error("Error updating referral settings:", error);
    throw error;
  }
};

// Generate a report of referral activity
export const generateReferralReport = async (startDate: string, endDate: string) => {
  try {
    // In a real application, this would query the database
    // For now, we'll just simulate a report
    return Promise.resolve({
      success: true,
      report: {
        period: `${startDate} to ${endDate}`,
        totalReferrals: 15,
        totalCommissions: 325.75,
        newReferrers: 3
      }
    });
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};
