
import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Lock } from 'lucide-react';

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onChange: (field: string, value: string) => void;
}

export const PasswordFields: React.FC<PasswordFieldsProps> = ({ password, confirmPassword, onChange }) => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            value={password}
            onChange={(e) => onChange('password', e.target.value)}
            required
            minLength={6}
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
            className="pl-10"
            value={confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            required
          />
        </div>
        {password !== confirmPassword && confirmPassword && (
          <p className="text-sm text-destructive">Passwords do not match</p>
        )}
      </div>
    </div>
  );
};
