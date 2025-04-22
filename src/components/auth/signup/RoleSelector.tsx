
import React from 'react';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Building2 } from 'lucide-react';

interface RoleSelectorProps {
  role: 'tenant' | 'landlord';
  onChange: (role: 'tenant' | 'landlord') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ role, onChange }) => {
  return (
    <div className="space-y-2">
      <Label>I am a</Label>
      <RadioGroup
        value={role}
        onValueChange={(value: 'tenant' | 'landlord') => onChange(value)}
        className="grid grid-cols-2 gap-4"
      >
        <Label
          htmlFor="tenant"
          className={`flex cursor-pointer items-center justify-center rounded-lg border p-4 ${
            role === 'tenant' ? 'border-primary bg-primary/10' : 'border-muted'
          }`}
        >
          <RadioGroupItem value="tenant" id="tenant" className="sr-only" />
          <Building2 className="mr-2 h-5 w-5" />
          Tenant
        </Label>

        <Label
          htmlFor="landlord"
          className={`flex cursor-pointer items-center justify-center rounded-lg border p-4 ${
            role === 'landlord' ? 'border-primary bg-primary/10' : 'border-muted'
          }`}
        >
          <RadioGroupItem value="landlord" id="landlord" className="sr-only" />
          <Building2 className="mr-2 h-5 w-5" />
          Landlord
        </Label>
      </RadioGroup>
    </div>
  );
};
