
import React from 'react';
import { Label } from '../../ui/label';
import { RadioGroup } from '../../ui/radio-group';
import { Building2, User } from 'lucide-react';

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
        <div
          onClick={() => onChange('tenant')}
          className={`flex cursor-pointer items-center justify-center rounded-lg border p-6 ${
            role === 'tenant' ? 'border-primary bg-primary/10' : 'border-muted bg-background'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <User className="h-6 w-6 text-gray-600" />
            <span>Tenant</span>
          </div>
          <input 
            type="radio" 
            name="role" 
            value="tenant" 
            checked={role === 'tenant'} 
            onChange={() => {}} 
            className="sr-only" 
          />
        </div>

        <div
          onClick={() => onChange('landlord')}
          className={`flex cursor-pointer items-center justify-center rounded-lg border p-6 ${
            role === 'landlord' ? 'border-primary bg-primary/10' : 'border-muted bg-background'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <Building2 className="h-6 w-6 text-gray-600" />
            <span>Landlord</span>
          </div>
          <input 
            type="radio" 
            name="role" 
            value="landlord" 
            checked={role === 'landlord'} 
            onChange={() => {}} 
            className="sr-only" 
          />
        </div>
      </RadioGroup>
    </div>
  );
};
