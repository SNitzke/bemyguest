
import React from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Phone } from "lucide-react";

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bmg-50 to-bmg-100 p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <LoginForm />
        </div>
        
        <div className="hidden md:block w-1/2 bg-bmg-500 p-12 text-white flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-6">Welcome to BeMyGuest</h2>
            <p className="mb-8">The complete solution for property management and tenant communication.</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Payment Management
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Problem Reporting
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Document Management
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simplified Communication
              </li>
            </ul>
            
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6" />
                <span>bemigest@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6" />
                <span>+52 55 6425 9421</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
