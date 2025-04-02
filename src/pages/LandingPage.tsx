
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold gradient-heading">Memberly</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
            <Link to="#features" className="text-gray-700 hover:text-primary">Features</Link>
            <Link to="#pricing" className="text-gray-700 hover:text-primary">Pricing</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="bg-gradient-to-br from-brand-blue to-brand-teal py-20 flex-grow">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              The Complete Membership Platform
            </h1>
            <p className="text-xl mb-8 text-white/80">
              Create, manage, and grow your membership business with our all-in-one platform.
            </p>
            <div className="flex space-x-4">
              <Link to="/register">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  See Features
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 w-full max-w-md">
              <div className="bg-white rounded-md p-4 shadow-md">
                <h3 className="font-bold text-gray-800 mb-3">Member Dashboard</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div 
                      key={item}
                      className="aspect-video bg-gray-100 rounded-md flex items-center justify-center"
                    >
                      Product {item}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-3/4 mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All-In-One Membership Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, manage, and grow your membership business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Powerful Admin Dashboard",
                description: "Manage users, analyze data, and make informed decisions with our comprehensive admin panel."
              },
              {
                title: "Secure Member Portal",
                description: "Provide your members with a secure portal to access their purchases, subscriptions, and more."
              },
              {
                title: "Subscription Management",
                description: "Easily set up and manage subscription plans, trial periods, and payment processing."
              },
              {
                title: "Digital Product Delivery",
                description: "Securely deliver digital products, content, and downloads to your members."
              },
              {
                title: "Coupon & Discount System",
                description: "Create promotional offers and discount codes to boost sales and engagement."
              },
              {
                title: "Integrated Support System",
                description: "Provide excellent customer support with our built-in ticket management system."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$29",
                description: "Perfect for individuals and small businesses just getting started.",
                features: [
                  "Up to 500 members",
                  "Basic admin dashboard",
                  "Member portal",
                  "Digital product delivery",
                  "Email support"
                ],
                highlight: false,
                buttonText: "Start with Starter"
              },
              {
                name: "Professional",
                price: "$79",
                description: "Ideal for growing businesses with active membership programs.",
                features: [
                  "Up to 5,000 members",
                  "Advanced admin dashboard",
                  "Premium member portal",
                  "Coupon management",
                  "Priority support",
                  "API access"
                ],
                highlight: true,
                buttonText: "Go Professional"
              },
              {
                name: "Enterprise",
                price: "$199",
                description: "For large organizations with complex membership requirements.",
                features: [
                  "Unlimited members",
                  "Full-featured admin dashboard",
                  "Custom member portal",
                  "Advanced analytics",
                  "24/7 premium support",
                  "White-label options"
                ],
                highlight: false,
                buttonText: "Contact Sales"
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg ${
                  plan.highlight 
                    ? "ring-2 ring-primary shadow-xl relative" 
                    : "border border-gray-200 shadow-sm"
                } p-6`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6 min-h-[60px]">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.highlight 
                      ? "bg-primary hover:bg-primary/90" 
                      : ""
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-brand-blue py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Membership Site?
          </h2>
          <p className="text-white/80 text-xl max-w-3xl mx-auto mb-8">
            Join thousands of businesses that trust Memberly for their membership needs.
          </p>
          <Link to="/register">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg">
              Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Memberly</h3>
              <p className="text-gray-400 mb-4">
                The all-in-one membership platform for businesses of all sizes.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Testimonials</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Support</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">API Docs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Memberly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
