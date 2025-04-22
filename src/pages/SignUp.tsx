
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";
import { SignUpForm } from "../components/auth/SignUpForm";
import { PropertyForm } from "../components/auth/PropertyForm";
import { PaymentForm } from "../components/auth/PaymentForm";

const SignUp: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [signUpData, setSignUpData] = useState<{
    email: string;
    password: string;
    role: UserRole;
  } | null>(null);

  const handleSignUp = async (data: { 
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    setIsSubmitting(true);
    
    try {
      await signup({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role,
      });
      
      setSignUpData({
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (data.role === "landlord") {
        setShowPropertyForm(true);
      } else {
        setShowPaymentForm(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertySubmit = async (data: {
    propertyName: string;
    propertyAddress: string;
    propertyUnits: string;
  }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Account created successfully!");
      
      if (signUpData) {
        await login(signUpData.email, signUpData.password);
      }
      
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to set up property information");
    }
  };

  const handlePaymentSubmit = async (data: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  }) => {
    try {
      toast.success("Account created successfully!");
      
      if (signUpData) {
        await login(signUpData.email, signUpData.password);
      }
      
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
            <SignUpForm onSubmit={handleSignUp} isSubmitting={isSubmitting} />
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

        <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Property Information</DialogTitle>
              <DialogDescription>
                Tell us about your first property. You can add more properties later.
              </DialogDescription>
            </DialogHeader>
            <PropertyForm onSubmit={handlePropertySubmit} />
          </DialogContent>
        </Dialog>

        <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Payment Information</DialogTitle>
              <DialogDescription>
                Add your payment method for rent and other payments.
              </DialogDescription>
            </DialogHeader>
            <PaymentForm onSubmit={handlePaymentSubmit} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SignUp;
