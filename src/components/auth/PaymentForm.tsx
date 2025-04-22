
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CreditCard } from "lucide-react";
import { DialogFooter } from "../ui/dialog";

interface PaymentFormProps {
  onSubmit: (data: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  }) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      accountName,
      accountNumber,
      bankName,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
      
      <DialogFooter>
        <Button type="submit" className="w-full bg-bmg-500 hover:bg-bmg-600">
          Complete Sign Up
        </Button>
      </DialogFooter>
    </form>
  );
};
