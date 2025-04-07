import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight, Check, Home, MessageSquare, ShieldCheck, Wallet } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-bmg-50 to-bmg-100">
      {/* Hero Section */}
      <header className="w-full py-6 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-bmg-500">BeMyGuest</h1>
        </div>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold font-heading text-bmg-800">
                Property Management Made Simple
              </h1>
              <p className="text-xl text-gray-600">
                BeMyGuest centralizes rental management, facilitating communication and 
                transactions between property owners and tenants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Login to your account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <Card className="bg-white border-0">
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" 
                    alt="Property management" 
                    className="w-full h-80 object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-heading mb-4">Everything You Need in One Place</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                BeMyGuest simplifies property management with powerful tools for both landlords and tenants.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<Wallet />}
                title="Payment Management"
                description="Handle rent payments, generate receipts, and send reminders automatically."
              />
              <FeatureCard 
                icon={<MessageSquare />}
                title="Issue Reporting"
                description="Report problems with attached photos and track resolution status."
              />
              <FeatureCard 
                icon={<Home />}
                title="Property Oversight"
                description="Manage multiple properties and tenants from a single dashboard."
              />
              <FeatureCard 
                icon={<ShieldCheck />}
                title="Document Management"
                description="Store contracts, receipts, and identity documents securely."
              />
            </div>
          </div>
        </section>

        {/* Pricing/Plans Section */}
        <section className="py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-heading mb-4">Choose Your Plan</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the plan that works best for your property management needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard 
                title="Basic"
                price="Free"
                description="For individual tenants"
                features={[
                  "Payment tracking",
                  "Issue reporting",
                  "Document storage",
                  "Basic messaging"
                ]}
                buttonText="Get Started"
                buttonVariant="outline"
              />
              <PricingCard 
                title="Professional"
                price="$29/mo"
                description="For property owners"
                features={[
                  "Multiple property management",
                  "Advanced payment tools",
                  "Tenant verification",
                  "Priority support",
                  "Financial reporting"
                ]}
                buttonText="Try Pro"
                buttonVariant="default"
                highlighted={true}
              />
              <PricingCard 
                title="Enterprise"
                price="Custom"
                description="For property management companies"
                features={[
                  "Unlimited properties",
                  "Custom integrations",
                  "Dedicated account manager",
                  "API access",
                  "White-label options"
                ]}
                buttonText="Contact Us"
                buttonVariant="outline"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-bmg-800 text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">BeMyGuest</h3>
            <p className="text-gray-300">The complete solution for property management and tenant communication.</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="text-gray-300">Email:</div>
                <a href="mailto:bemeguestt@gmail.com" className="text-gray-300 hover:text-white">
                  bemeguestt@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-gray-300">Phone:</div>
                <a href="tel:+525564259421" className="text-gray-300 hover:text-white">
                  +52 55 6425 9421
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Payment Management</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Issue Reporting</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Document Storage</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Messaging</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Cookies Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400">© {new Date().getFullYear()} BeMyGuest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card className="border-0 shadow-md h-full">
      <CardContent className="p-6 space-y-4">
        <div className="h-12 w-12 rounded-full bg-bmg-100 text-bmg-500 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-semibold text-xl">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

// Pricing Card Component
const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonVariant = "default",
  highlighted = false
}: { 
  title: string, 
  price: string, 
  description: string, 
  features: string[], 
  buttonText: string, 
  buttonVariant?: "default" | "outline",
  highlighted?: boolean
}) => {
  return (
    <Card className={`border-0 ${highlighted ? 'shadow-xl ring-2 ring-bmg-500' : 'shadow-md'} h-full`}>
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          <div className="text-3xl font-bold mb-2">{price}</div>
          <p className="text-gray-600">{description}</p>
        </div>
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-bmg-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="pt-4">
          <Link to="/signup">
            <Button 
              variant={buttonVariant} 
              className={`w-full ${highlighted ? 'bg-bmg-500 hover:bg-bmg-600' : ''}`}
            >
              {buttonText}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
