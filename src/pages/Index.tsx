import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight, Check, Home, Image, ShieldCheck, Wallet } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { AspectRatio } from "../components/ui/aspect-ratio";

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
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
                    alt="Business professionals closing a property deal" 
                    className="w-full h-80 object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-0">
                        <AspectRatio ratio={4/3}>
                          <img 
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" 
                            alt="Modern apartment building" 
                            className="rounded-md object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-0">
                        <AspectRatio ratio={4/3}>
                          <img 
                            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" 
                            alt="Beautiful house" 
                            className="rounded-md object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-0">
                        <AspectRatio ratio={4/3}>
                          <img 
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" 
                            alt="Luxury home" 
                            className="rounded-md object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="hidden md:flex">
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </div>
            </Carousel>
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
                image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
              />
              <FeatureCard 
                icon={<Image />}
                title="Issue Reporting"
                description="Report problems with attached photos and track resolution status."
                image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
              />
              <FeatureCard 
                icon={<Home />}
                title="Property Oversight"
                description="Manage multiple properties and tenants from a single dashboard."
                image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
              />
              <FeatureCard 
                icon={<ShieldCheck />}
                title="Document Management"
                description="Store contracts, receipts, and identity documents securely."
                image="https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
              />
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 bg-white px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading mb-4">What Our Clients Say</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 shadow-md border-0 bg-gray-50">
                <CardContent className="p-0 space-y-4">
                  <p className="italic text-gray-600">"BeMyGuest has transformed how I manage my rental properties. The payment system is seamless and the tenant communication tools save me hours every week."</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" 
                      alt="Sarah Johnson" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Property Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="p-6 shadow-md border-0 bg-gray-50">
                <CardContent className="p-0 space-y-4">
                  <p className="italic text-gray-600">"As a tenant, I love how easy it is to report issues and make payments. The interface is intuitive and I always know where I stand with my lease."</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" 
                      alt="Michael Rodriguez" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">Michael Rodriguez</p>
                      <p className="text-sm text-gray-500">Tenant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                linkPath="/signup"
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
                linkPath="/signup"
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
                linkPath="/signup"
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
const FeatureCard = ({ icon, title, description, image }: { icon: React.ReactNode, title: string, description: string, image: string }) => {
  return (
    <Card className="border-0 shadow-md h-full">
      <CardContent className="p-0">
        <div className="h-40 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 space-y-3">
          <div className="h-12 w-12 rounded-full bg-bmg-100 text-bmg-500 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-semibold text-xl">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
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
  highlighted = false,
  linkPath
}: { 
  title: string, 
  price: string, 
  description: string, 
  features: string[], 
  buttonText: string, 
  buttonVariant?: "default" | "outline",
  highlighted?: boolean,
  linkPath: string
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
          <Link to={linkPath}>
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
