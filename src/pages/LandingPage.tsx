
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock, BarChart3, MousePointer, Shield, Zap, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">Memberly</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">Home</Link>
            <Link to="#features" className="text-gray-700 hover:text-primary transition-colors">Features</Link>
            <Link to="#pricing" className="text-gray-700 hover:text-primary transition-colors">Pricing</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="font-medium">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 mb-12 lg:mb-0 z-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#1a1b4b]">
              World's Best <br/> Membership Platform
            </h1>
            <p className="text-xl mb-8 text-gray-600 max-w-lg">
              Get 50+ tools at an affordable price. For those who need premium membership features without the premium cost.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 font-medium px-8">
                  GET STARTED
                </Button>
              </Link>
              <Link to="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8">
                  See Features
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 flex justify-center"
          >
            <div className="relative w-full max-w-md lg:max-w-lg overflow-hidden rounded-2xl shadow-2xl">
              {/* Dashboard Mockup */}
              <div className="bg-white rounded-t-lg p-2">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="bg-[#f8f9fc] relative overflow-hidden">
                <img 
                  src="/lovable-uploads/94519d56-0d06-4fbe-952f-0dd4bd06039c.png" 
                  alt="Dashboard Preview" 
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Stats */}
        <div className="container mx-auto px-6 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 -mb-24 relative z-20"
          >
            {[
              { icon: <Clock className="h-5 w-5 text-blue-600" />, title: "Course Progress", value: "68%", desc: "Average completion rate" },
              { icon: <BarChart3 className="h-5 w-5 text-green-600" />, title: "Last Session", value: "47 min", desc: "Time spent learning" },
              { icon: <MousePointer className="h-5 w-5 text-purple-600" />, title: "Total Activities", value: "12", desc: "Completed this month" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg mr-4 ${
                    i === 0 ? "bg-blue-50" : i === 1 ? "bg-green-50" : "bg-purple-50"
                  }`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-xs text-gray-500">{stat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features with graphics */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1b4b]"
            >
              Affordable Group Buy Membership
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              We understand the importance of reliability and strive to provide our users with the best possible service at an affordable price.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-blue-500" />,
                title: "24×7 Support",
                description: "Our 24×7 website support team has but one goal in mind – to make your life easier."
              },
              {
                icon: <Zap className="h-12 w-12 text-red-500" />,
                title: "Instant Access",
                description: "There is no need for approval or anything else. You will get instant access after you have paid for it."
              },
              {
                icon: <LineChart className="h-12 w-12 text-green-500" />,
                title: "99% Uptime",
                description: "Our environment is fully automated, now we can give you higher uptime and stability."
              },
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
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                {feature.icon && (
                  <div className="mb-4 p-3 bg-gray-50 inline-block rounded-lg group-hover:bg-gray-100 transition-colors">
                    {feature.icon}
                  </div>
                )}
                <h3 className="text-xl font-bold mb-3 text-[#1a1b4b]">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gradient-to-br from-[#f5f7ff] to-[#ebf0ff]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a1b4b]">Experience Our Intuitive Dashboard</h2>
              <p className="text-lg text-gray-600 mb-8">
                Access all your membership features in one place. Track progress, manage subscriptions, and access resources with ease.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Real-time analytics and progress tracking",
                  "One-click access to all your purchased resources",
                  "Manage your subscription settings easily",
                  "Track your learning journey with detailed metrics"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="ml-3 text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button size="lg" className="px-8 font-medium">
                  Try It Now
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur-lg"></div>
                <div className="relative overflow-hidden rounded-xl bg-white shadow-xl">
                  <img 
                    src="/lovable-uploads/8cfe87fa-ee25-4cd6-830a-bd2a6dce6f5a.png" 
                    alt="Dashboard Interface" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1b4b]"
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Choose the plan that works best for your business.
            </motion.p>
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
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl ${
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
                <h3 className="text-xl font-bold mb-2 text-[#1a1b4b]">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6 min-h-[60px]">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#1a1b4b]">What Our Users Say</h2>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="mb-6 flex justify-center">
                <img 
                  src="/lovable-uploads/1df0f406-5672-445d-ae35-a2d89454292d.png" 
                  alt="Customer Testimonial" 
                  className="w-full max-w-md rounded-lg shadow-lg" 
                />
              </div>
              <p className="text-gray-600 text-lg italic mb-6">
                "The dashboard interface is intuitive and powerful. I can manage all my subscriptions and access my purchased tools instantly. Best investment for my business this year!"
              </p>
              <div>
                <h4 className="font-bold text-[#1a1b4b]">Sarah Johnson</h4>
                <p className="text-gray-500">CEO, Digital Solutions Inc.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-gradient-to-r from-primary/90 to-blue-600/90 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-6"
          >
            Ready to Start Your Membership Site?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-white/90 text-xl max-w-3xl mx-auto mb-8"
          >
            Join thousands of businesses that trust Memberly for their membership needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-medium">
                Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#1a1b4b] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Memberly</h3>
              <p className="text-gray-300 mb-4">
                The all-in-one membership platform for businesses of all sizes.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Testimonials</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Support</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">API Docs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
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
