
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
        <Label htmlFor="password">Contraseña</Label>
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
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
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
          <p className="flex items-center text-red-600 mt-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Las contraseñas no coinciden
          </p>
        )}
        {password && password.length < 6 && (
          <p className="flex items-center text-amber-600 mt-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            La contraseña debe tener al menos 6 caracteres
          </p>
        )}
      </div>
    </div>
  );
};
