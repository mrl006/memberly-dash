
import { toast } from "@/hooks/use-toast";

// Mock data for development
const mockReferralData = {
  earnings: 158.75,
  availableBalance: 75.25,
  totalEarned: 235.50,
  referralCount: 7,
  paymentMethod: {
    type: "paypal",
    details: "user@example.com"
  },
  withdrawals: [
    {
      id: "w1",
      date: "2023-10-15",
      amount: 50,
      paymentMethod: {
        type: "paypal",
        details: "user@example.com"
      },
      status: "completed"
    },
    {
      id: "w2",
      date: "2023-11-20",
      amount: 85.25,
      paymentMethod: {
        type: "paypal",
        details: "user@example.com"
      },
      status: "pending"
    }
  ],
  referrals: [
    {
      id: "r1",
      name: "John Smith",
      email: "john@example.com",
      joinDate: "2023-09-12",
      commission: 35.50
    },
    {
      id: "r2",
      name: "Jane Doe",
      email: "jane@example.com",
      joinDate: "2023-09-18",
      commission: 42.75
    },
    {
      id: "r3",
      name: "Mike Johnson",
      email: "mike@example.com",
      joinDate: "2023-10-05",
      commission: 28.00
    }
  ]
};

// Fetch referral data for the current user
export const fetchReferralData = async () => {
  try {
    // In a real application, this would fetch from a backend API
    // For now, we'll use mock data
    return Promise.resolve(mockReferralData);
  } catch (error) {
    console.error("Error fetching referral data:", error);
    throw error;
  }
};

// Save payment method for withdrawals
export const savePaymentMethod = async (paymentMethod: { type: string; details: string }) => {
  try {
    // In a real application, this would send to a backend API
    // For now, we'll just simulate a successful save
    mockReferralData.paymentMethod = paymentMethod;
    return Promise.resolve({ success: true });
  } catch (error) {
    console.error("Error saving payment method:", error);
    throw error;
  }
};

// Request a withdrawal
export const requestWithdrawal = async (withdrawalRequest: { 
  amount: number; 
  paymentMethod: { type: string; details: string } 
}) => {
  try {
    // In a real application, this would send to a backend API
    // For now, we'll just simulate a successful request
    
    // Create a new pending withdrawal
    const newWithdrawal = {
      id: `w${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: withdrawalRequest.amount,
      paymentMethod: withdrawalRequest.paymentMethod,
      status: "pending"
    };
    
    // Update mock data
    mockReferralData.withdrawals.unshift(newWithdrawal);
    mockReferralData.availableBalance -= withdrawalRequest.amount;
    
    return Promise.resolve({ success: true, withdrawal: newWithdrawal });
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    throw error;
  }
};

// Check if referral code is valid (for registration)
export const validateReferralCode = async (referralCode: string) => {
  try {
    // In a real application, this would check against a database
    // For now, we'll just simulate validation
    const isValid = referralCode && referralCode.length > 0;
    return Promise.resolve({ isValid });
  } catch (error) {
    console.error("Error validating referral code:", error);
    throw error;
  }
};

// Record a new referral when a user signs up using someone's referral code
export const recordReferral = async (newUserId: string, referrerId: string) => {
  try {
    // In a real application, this would update the database
    // For now, we'll just simulate success
    return Promise.resolve({ success: true });
  } catch (error) {
    console.error("Error recording referral:", error);
    throw error;
  }
};
