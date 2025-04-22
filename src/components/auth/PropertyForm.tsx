
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Building } from "lucide-react";
import { DialogFooter } from "../ui/dialog";
import { toast } from "sonner";

interface PropertyFormProps {
  onSubmit: (data: {
    propertyName: string;
    propertyAddress: string;
    propertyUnits: string;
  }) => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit }) => {
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyUnits, setPropertyUnits] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyName || !propertyAddress || !propertyUnits) {
      toast.error("Please fill all property fields");
      return;
    }

    onSubmit({
      propertyName,
      propertyAddress,
      propertyUnits,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
  );
};
