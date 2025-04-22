import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowLeft, CreditCard, Building, CheckCircle2 } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useAuth } from "../contexts/AuthContext";

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Property form state
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyUnits, setPropertyUnits] = useState("");

  // Payment information state
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!acceptedTerms) {
      toast.error("You must accept the terms and privacy policy");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This is a mock signup - in a real app, you would call your API or authentication service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (role === "landlord") {
        setShowPropertyForm(true);
        setIsSubmitting(false);
        return;
      } else {
        setShowPaymentForm(true);
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate property information
    if (!propertyName || !propertyAddress || !propertyUnits) {
      toast.error("Please fill all property fields");
      return;
    }
    
    try {
      // Mock API call to save property
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Account created successfully!");
      
      // Auto-login after successful signup
      await login(email, password);
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to set up property information");
    }
  };

  const handlePaymentInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      toast.success("Account created successfully!");
      
      // Auto-login after successful signup
      await login(email, password);
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to set up payment information");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bmg-50 to-bmg-100 p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="flex items-center text-bmg-600 hover:text-bmg-700 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your information to get started with BeMyGuest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={role === "tenant" ? "default" : "outline"}
                    className={role === "tenant" ? "bg-bmg-500 hover:bg-bmg-600" : ""}
                    onClick={() => setRole("tenant")}
                  >
                    Tenant
                  </Button>
                  <Button
                    type="button"
                    variant={role === "landlord" ? "default" : "outline"}
                    className={role === "landlord" ? "bg-bmg-500 hover:bg-bmg-600" : ""}
                    onClick={() => setRole("landlord")}
                  >
                    Landlord
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => {
                    setAcceptedTerms(checked === true);
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the{" "}
                  <Link to="#" className="text-bmg-500 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-bmg-500 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full bg-bmg-500 hover:bg-bmg-600" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-bmg-500 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Property Information Dialog for Landlords */}
        <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Property Information</DialogTitle>
              <DialogDescription>
                Tell us about your first property. You can add more properties later.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePropertySubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="propertyName"
                    placeholder="Sunset Apartments"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input
                  id="propertyAddress"
                  placeholder="123 Main St, City, State, ZIP"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="propertyUnits">Number of Units</Label>
                <Input
                  id="propertyUnits"
                  type="number"
                  placeholder="1"
                  min="1"
                  value={propertyUnits}
                  onChange={(e) => setPropertyUnits(e.target.value)}
                  required
                />
              </div>
              
              <DialogFooter>
                <Button type="submit" className="w-full bg-bmg-500 hover:bg-bmg-600">
                  Continue
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Payment Information Dialog - Only show for tenants */}
        {role === "tenant" && (
          <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Payment Information</DialogTitle>
                <DialogDescription>
                  Add your payment method for rent and other payments.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePaymentInfoSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">{role === "landlord" ? "Account Holder Name" : "Cardholder Name"}</Label>
                  <Input
                    id="accountName"
                    placeholder="John Doe"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">
                    {role === "landlord" ? "Account Number" : "Card Number"}
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="accountNumber"
                      placeholder={role === "landlord" ? "XXXX-XXXX-XXXX-XXXX" : "XXXX XXXX XXXX XXXX"}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bankName">
                    {role === "landlord" ? "Bank Name" : "Expiration Date & CVV"}
                  </Label>
                  <Input
                    id="bankName"
                    placeholder={role === "landlord" ? "Bank of America" : "MM/YY & CVV"}
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="w-full bg-bmg-500 hover:bg-bmg-600">
                    Complete Sign Up
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default SignUp;
