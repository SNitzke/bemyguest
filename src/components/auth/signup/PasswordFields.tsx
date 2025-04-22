
import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onChange: (field: 'password' | 'confirmPassword', value: string) => void;
}

export const PasswordFields: React.FC<PasswordFieldsProps> = ({ 
  password, 
  confirmPassword, 
  onChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onChange('password', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
          required
        />
      </div>
    </div>
  );
};
