
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Mail, Lock, User } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { UserRole } from "@/types";

interface SignUpFormProps {
  onSubmit: (data: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
  }) => void;
  isSubmitting: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isSubmitting }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("tenant");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    onSubmit({ fullName, email, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};
