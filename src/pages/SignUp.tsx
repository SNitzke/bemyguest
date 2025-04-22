
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { EnhancedSignUpForm } from "../components/auth/EnhancedSignUpForm";

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bmg-50 to-bmg-100 p-4">
      <div className="w-full max-w-2xl">
        <Link 
          to="/" 
          className="flex items-center text-bmg-600 hover:text-bmg-700 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information to get started with BeMyGuest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedSignUpForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
