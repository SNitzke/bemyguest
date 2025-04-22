
import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { User, Mail, Phone } from 'lucide-react';

interface PersonalInfoFieldsProps {
  formData: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  onChange: (field: string, value: string) => void;
}

export const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ formData, onChange }) => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="fullName"
            placeholder="John Doe"
            className="pl-10"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
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
            className="pl-10"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="(555) 123-4567"
            className="pl-10"
            value={formData.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};
