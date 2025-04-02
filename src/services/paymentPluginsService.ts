
// Payment plugin types
type PaymentMethod = "card" | "paypal" | "crypto" | "bank" | "regional";
type PluginStatus = "active" | "inactive" | "not_installed";

interface PaymentPlugin {
  id: string;
  name: string;
  description: string;
  category: PaymentMethod;
  status: PluginStatus;
  price: "Free" | "Premium";
  version: string;
  documentation: string;
  apiKey?: string;
  settings?: Record<string, any>;
}

// Mock payment plugins data
const paymentPlugins: PaymentPlugin[] = [
  {
    id: "stripe",
    name: "Stripe Payment Gateway",
    description: "Official Stripe integration for React. Supports full checkout flow, subscriptions, and card payments.",
    category: "card",
    status: "not_installed",
    price: "Free",
    version: "1.2.0",
    documentation: "https://stripe.com/docs/stripe-js/react"
  },
  {
    id: "paypal",
    name: "PayPal React SDK",
    description: "Official PayPal React SDK. Easily embed PayPal Buttons and handle transactions for one-time or recurring payments.",
    category: "paypal",
    status: "not_installed",
    price: "Free",
    version: "1.0.5",
    documentation: "https://paypal.github.io/react-paypal-js"
  },
  {
    id: "coinbase",
    name: "Coinbase Commerce",
    description: "Integrate crypto payments via Coinbase. Accept BTC, ETH, USDC, and other popular cryptocurrencies.",
    category: "crypto",
    status: "not_installed",
    price: "Free",
    version: "2.0.0",
    documentation: "https://commerce.coinbase.com/docs/"
  },
  {
    id: "plaid",
    name: "Plaid Link",
    description: "Connect to users' bank accounts for direct debit/ACH payments using Plaid's secure API.",
    category: "bank",
    status: "not_installed",
    price: "Premium",
    version: "1.1.0",
    documentation: "https://plaid.com/docs/link/"
  },
  {
    id: "metamask",
    name: "MetaMask Web3 Connector",
    description: "Connect to MetaMask wallet for Ethereum and ERC-20 token payments with web3-react integration.",
    category: "crypto",
    status: "not_installed",
    price: "Free",
    version: "1.0.0",
    documentation: "https://docs.metamask.io/"
  },
  {
    id: "razorpay",
    name: "Razorpay Payment Gateway",
    description: "India-focused payment gateway supporting UPI, cards, netbanking and more payment methods.",
    category: "regional",
    status: "not_installed",
    price: "Free",
    version: "1.0.0",
    documentation: "https://razorpay.com/docs/"
  },
  {
    id: "flutterwave",
    name: "Flutterwave React",
    description: "Africa-focused payments solution supporting cards, bank accounts, mobile money for Nigeria and other markets.",
    category: "regional",
    status: "not_installed",
    price: "Free",
    version: "1.0.5",
    documentation: "https://developer.flutterwave.com/docs"
  },
  {
    id: "nowpayments",
    name: "NOWPayments Crypto",
    description: "Accept payments in Bitcoin, Ethereum, Litecoin and 100+ other cryptocurrencies with low transaction fees.",
    category: "crypto",
    status: "not_installed",
    price: "Premium",
    version: "1.0.0",
    documentation: "https://nowpayments.io/doc/"
  },
  {
    id: "paystack",
    name: "Paystack Inline",
    description: "Popular payment solution for African markets with focus on Nigeria, Ghana, and South Africa.",
    category: "regional",
    status: "not_installed",
    price: "Free",
    version: "1.1.2",
    documentation: "https://paystack.com/docs/payments/accept-payments/"
  },
  {
    id: "mollie",
    name: "Mollie Payments",
    description: "European payment service provider supporting iDEAL, credit cards, PayPal, and more EU payment methods.",
    category: "regional",
    status: "not_installed",
    price: "Free",
    version: "1.0.0",
    documentation: "https://docs.mollie.com/"
  },
  {
    id: "square",
    name: "Square Payments",
    description: "Accept credit and debit cards, manage payments, invoices, and more with Square's payment processing.",
    category: "card",
    status: "not_installed",
    price: "Premium",
    version: "1.0.0",
    documentation: "https://developer.squareup.com/docs"
  },
  {
    id: "braintree",
    name: "Braintree SDK",
    description: "PayPal's Braintree payment gateway supporting cards, PayPal, Venmo, Apple Pay and Google Pay.",
    category: "card",
    status: "not_installed",
    price: "Premium",
    version: "1.3.0",
    documentation: "https://developer.paypal.com/braintree/docs"
  },
  {
    id: "bitpay",
    name: "BitPay Crypto",
    description: "Specialized gateway for Bitcoin and Bitcoin Cash payments with direct crypto settlement.",
    category: "crypto",
    status: "not_installed",
    price: "Free",
    version: "1.0.0",
    documentation: "https://bitpay.com/docs/"
  },
  {
    id: "paddle",
    name: "Paddle SaaS Payments",
    description: "Complete payment solution for SaaS businesses with subscriptions, licensing, and tax management.",
    category: "card",
    status: "not_installed",
    price: "Premium",
    version: "1.0.0",
    documentation: "https://developer.paddle.com/guides/readme"
  }
];

class PaymentPluginsService {
  private plugins: PaymentPlugin[] = paymentPlugins;
  
  getPaymentPlugins(): PaymentPlugin[] {
    return this.plugins;
  }
  
  getPluginById(id: string): PaymentPlugin | undefined {
    return this.plugins.find(plugin => plugin.id === id);
  }
  
  installPlugin(id: string): boolean {
    const pluginIndex = this.plugins.findIndex(plugin => plugin.id === id);
    if (pluginIndex === -1) return false;
    
    this.plugins[pluginIndex].status = "inactive";
    return true;
  }
  
  uninstallPlugin(id: string): boolean {
    const pluginIndex = this.plugins.findIndex(plugin => plugin.id === id);
    if (pluginIndex === -1) return false;
    
    this.plugins[pluginIndex].status = "not_installed";
    this.plugins[pluginIndex].apiKey = undefined;
    return true;
  }
  
  configurePlugin(id: string, apiKey: string, settings?: Record<string, any>): boolean {
    const pluginIndex = this.plugins.findIndex(plugin => plugin.id === id);
    if (pluginIndex === -1) return false;
    
    this.plugins[pluginIndex].apiKey = apiKey;
    
    if (settings) {
      this.plugins[pluginIndex].settings = settings;
    }
    
    this.plugins[pluginIndex].status = "active";
    return true;
  }
  
  togglePluginStatus(id: string, active: boolean): boolean {
    const pluginIndex = this.plugins.findIndex(plugin => plugin.id === id);
    if (pluginIndex === -1) return false;
    
    this.plugins[pluginIndex].status = active ? "active" : "inactive";
    return true;
  }
}

export const paymentPluginsService = new PaymentPluginsService();
