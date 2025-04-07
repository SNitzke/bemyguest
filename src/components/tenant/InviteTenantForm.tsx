
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Property {
  id: string;
  name: string;
  units: number;
}

interface InviteTenantFormProps {
  properties: Property[];
}

const InviteTenantForm: React.FC<InviteTenantFormProps> = ({ properties }) => {
  const [email, setEmail] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const { createTenantInvitation } = useAuth();

  const availableUnits = Array.from({ length: properties.find(p => p.id === propertyId)?.units || 0 }, (_, i) => i + 1);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !propertyId || !unitNumber) {
      toast.error("Please fill all fields");
      return;
    }
    
    setIsSending(true);
    
    try {
      const code = await createTenantInvitation({
        email,
        propertyId,
        unitNumber,
      });
      
      setInvitationCode(code);
      toast.success(`Invitation sent to ${email}`);
    } catch (error) {
      console.error("Failed to send invitation:", error);
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPropertyId("");
    setUnitNumber("");
    setInvitationCode(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Invite a Tenant</CardTitle>
        <CardDescription>
          Send an invitation to your tenant to join BeMyGuest
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!invitationCode ? (
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Tenant Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tenant@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property">Select Property</Label>
              <Select value={propertyId} onValueChange={setPropertyId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit Number</Label>
              <Select value={unitNumber} onValueChange={setUnitNumber} disabled={!propertyId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={propertyId ? "Select a unit" : "Select a property first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit} value={unit.toString()}>
                      Unit {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full bg-bmg-500 hover:bg-bmg-600" disabled={isSending}>
              <Send className="mr-2 h-4 w-4" />
              {isSending ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">Invitation Sent!</h3>
              <p className="text-sm text-gray-500 mt-1">
                An invitation has been sent to {email}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium mb-1">Invitation Code:</p>
              <div className="flex items-center justify-between">
                <code className="bg-white px-3 py-1 rounded border text-sm">{invitationCode}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(invitationCode);
                    toast.success("Copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Share this code with your tenant if they didn't receive the email
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {invitationCode && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={resetForm}>
            Invite Another Tenant
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default InviteTenantForm;
