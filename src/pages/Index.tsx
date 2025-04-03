
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowRight, Download, Settings } from "lucide-react";
import { paymentPluginsService } from "@/services/paymentPluginsService";

const Index = () => {
  const navigate = useNavigate();
  const plugins = paymentPluginsService.getPaymentPlugins();
  
  // Count plugins by status
  const activePlugins = plugins.filter(plugin => plugin.status === "active").length;
  const installedPlugins = plugins.filter(plugin => plugin.status !== "not_installed").length;
  const totalPlugins = plugins.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Gateway Management</h1>
          <p className="text-gray-600">
            Manage and configure payment gateways to accept payments from your customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Active Gateways</CardTitle>
              <CardDescription>Payment methods ready to accept payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{activePlugins}</p>
                    <p className="text-sm text-gray-500">Active</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round((activePlugins / totalPlugins) * 100)}% of total
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Installed Gateways</CardTitle>
              <CardDescription>Payment methods installed but may need configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Download className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{installedPlugins}</p>
                    <p className="text-sm text-gray-500">Installed</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round((installedPlugins / totalPlugins) * 100)}% of total
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Available Gateways</CardTitle>
              <CardDescription>Payment methods available to install</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalPlugins}</p>
                    <p className="text-sm text-gray-500">Total Available</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  100% of total
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Gateway Management</CardTitle>
            <CardDescription>
              Install, configure, and manage payment gateways for your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Choose from a variety of payment processors including credit cards, PayPal, 
              cryptocurrency options, direct bank payments, and regional payment methods.
              Each gateway can be configured with your API keys and custom settings.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit Card Processing
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Accept payments via Stripe, Square, Braintree, and more.
                </p>
                <div className="flex gap-2 mt-2">
                  {plugins.filter(p => p.category === "card" && p.status === "active").slice(0, 3).map(plugin => (
                    <div key={plugin.id} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {plugin.name.split(' ')[0]}
                    </div>
                  ))}
                  {plugins.filter(p => p.category === "card" && p.status === "active").length === 0 && (
                    <div className="text-xs text-gray-500">No active gateways</div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Digital Wallets
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Accept payments via PayPal, Apple Pay, Google Pay, and more.
                </p>
                <div className="flex gap-2 mt-2">
                  {plugins.filter(p => p.category === "paypal" && p.status === "active").slice(0, 3).map(plugin => (
                    <div key={plugin.id} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {plugin.name.split(' ')[0]}
                    </div>
                  ))}
                  {plugins.filter(p => p.category === "paypal" && p.status === "active").length === 0 && (
                    <div className="text-xs text-gray-500">No active gateways</div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cryptocurrency
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Accept Bitcoin, Ethereum, and other cryptocurrencies.
                </p>
                <div className="flex gap-2 mt-2">
                  {plugins.filter(p => p.category === "crypto" && p.status === "active").slice(0, 3).map(plugin => (
                    <div key={plugin.id} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {plugin.name.split(' ')[0]}
                    </div>
                  ))}
                  {plugins.filter(p => p.category === "crypto" && p.status === "active").length === 0 && (
                    <div className="text-xs text-gray-500">No active gateways</div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Regional Payment Methods
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Accept region-specific payment options worldwide.
                </p>
                <div className="flex gap-2 mt-2">
                  {plugins.filter(p => p.category === "regional" && p.status === "active").slice(0, 3).map(plugin => (
                    <div key={plugin.id} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {plugin.name.split(' ')[0]}
                    </div>
                  ))}
                  {plugins.filter(p => p.category === "regional" && p.status === "active").length === 0 && (
                    <div className="text-xs text-gray-500">No active gateways</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate("/admin/payment-plugins")} 
              className="w-full sm:w-auto"
            >
              Manage Payment Gateways
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {installedPlugins > 0 ? (
            <div className="space-y-4">
              {plugins.filter(p => p.status !== "not_installed").slice(0, 3).map(plugin => (
                <div key={plugin.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                      plugin.status === "active" ? "bg-green-100" : "bg-yellow-100"
                    }`}>
                      <CreditCard className={`h-4 w-4 ${
                        plugin.status === "active" ? "text-green-600" : "text-yellow-600"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{plugin.name}</p>
                      <p className="text-xs text-gray-500">
                        {plugin.status === "active" ? "Active" : "Installed but inactive"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/admin/payment-plugins")}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-1">No payment gateways installed</h3>
              <p className="text-gray-500 mb-4">
                Install your first payment gateway to start accepting payments
              </p>
              <Button onClick={() => navigate("/admin/payment-plugins")}>
                Browse Payment Gateways
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
