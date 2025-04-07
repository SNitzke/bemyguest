
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { User, Mail, Lock, CreditCard, Key, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Invitation, PaymentMethod } from "../../types";

interface AcceptInvitationFormProps {
  inviteCode?: string;
}

const AcceptInvitationForm: React.FC<AcceptInvitationFormProps> = ({ inviteCode: initialCode }) => {
  const [step, setStep] = useState<"code" | "details" | "payment">("code");
  const [inviteCode, setInviteCode] = useState(initialCode || "");
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { verifyInvitation, acceptInvitation } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialCode) {
      handleVerifyInvitation(initialCode);
    }
  }, [initialCode]);

  const handleVerifyInvitation = async (code: string) => {
    setIsSubmitting(true);
    
    try {
      const invitationData = await verifyInvitation(code);
      
      if (invitationData) {
        setInvitation(invitationData);
        setEmail(invitationData.email);
        setStep("details");
      }
    } catch (error) {
      console.error("Failed to verify invitation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode) {
      toast.error("Please enter an invitation code");
      return;
    }
    
    await handleVerifyInvitation(inviteCode);
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setStep("payment");
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod !== "cash" && (!accountName || !accountNumber || !bankName)) {
      toast.error("Please fill all payment information fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!invitation || !inviteCode) {
        throw new Error("Invalid invitation");
      }
      
      await acceptInvitation(inviteCode, {
        fullName,
        email,
        password,
        paymentMethod,
        paymentInfo: {
          accountName: paymentMethod !== "cash" ? accountName : undefined,
          accountNumber: paymentMethod !== "cash" ? accountNumber : undefined,
          bankName: paymentMethod !== "cash" ? bankName : undefined,
        },
      });
      
      // Redirect to dashboard after successful signup
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Join BeMyGuest</CardTitle>
        <CardDescription>
          {step === "code" && "Enter your invitation code to get started"}
          {step === "details" && "Create your account to continue"}
          {step === "payment" && "Set up your payment preferences"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "code" && (
          <form onSubmit={handleSubmitCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invitation Code</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="inviteCode"
                  placeholder="Enter your invitation code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-bmg-500 hover:bg-bmg-600" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Continue"}
            </Button>
          </form>
        )}
        
        {step === "details" && (
          <form onSubmit={handleSubmitDetails} className="space-y-4">
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
                  value={email}
                  disabled
                  className="pl-10 bg-gray-50"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">Email from invitation cannot be changed</p>
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
            
            <Button type="submit" className="w-full bg-bmg-500 hover:bg-bmg-600">
              Continue
            </Button>
          </form>
        )}
        
        {step === "payment" && (
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit" className="cursor-pointer">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="debit" id="debit" />
                  <Label htmlFor="debit" className="cursor-pointer">Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
                </div>
              </RadioGroup>
            </div>
            
            {paymentMethod !== "cash" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Cardholder Name</Label>
                  <Input
                    id="accountName"
                    placeholder="John Doe"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="accountNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bankName">Expiration Date & CVV</Label>
                  <Input
                    id="bankName"
                    placeholder="MM/YY & CVV"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
            {paymentMethod === "cash" && (
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                <div className="flex">
                  <CheckCircle2 className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Cash Payment Selected</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      You have selected to pay in cash. Please coordinate with your landlord for payment collection schedules and receipts.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full bg-bmg-500 hover:bg-bmg-600" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Complete Setup"}
            </Button>
          </form>
        )}
      </CardContent>
      {step !== "code" && (
        <CardFooter>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setStep(step === "payment" ? "details" : "code")}
          >
            Back
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AcceptInvitationForm;
