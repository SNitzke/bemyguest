
import React from 'react';
import { Label } from '../../ui/label';
import { Building2, User } from 'lucide-react';

interface RoleSelectorProps {
  role: 'tenant' | 'landlord';
  onChange: (role: 'tenant' | 'landlord') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ role, onChange }) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium text-gray-700">
        Selecciona tu rol:
      </Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => onChange('tenant')}
          className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${
            role === 'tenant' 
              ? 'border-bmg-500 bg-bmg-50 shadow-sm' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-full ${
              role === 'tenant' ? 'bg-bmg-100' : 'bg-gray-100'
            }`}>
              <User className={`h-8 w-8 ${
                role === 'tenant' ? 'text-bmg-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                role === 'tenant' ? 'text-bmg-900' : 'text-gray-900'
              }`}>
                Inquilino
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Busco o ya tengo una propiedad en alquiler
              </p>
            </div>
          </div>
          
          {/* Radio indicator */}
          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 ${
            role === 'tenant' 
              ? 'border-bmg-500 bg-bmg-500' 
              : 'border-gray-300 bg-white'
          }`}>
            {role === 'tenant' && (
              <div className="w-full h-full rounded-full bg-white scale-50" />
            )}
          </div>
        </div>

        <div
          onClick={() => onChange('landlord')}
          className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${
            role === 'landlord' 
              ? 'border-bmg-500 bg-bmg-50 shadow-sm' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-full ${
              role === 'landlord' ? 'bg-bmg-100' : 'bg-gray-100'
            }`}>
              <Building2 className={`h-8 w-8 ${
                role === 'landlord' ? 'text-bmg-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                role === 'landlord' ? 'text-bmg-900' : 'text-gray-900'
              }`}>
                Propietario
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Tengo propiedades para alquilar
              </p>
            </div>
          </div>
          
          {/* Radio indicator */}
          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 ${
            role === 'landlord' 
              ? 'border-bmg-500 bg-bmg-500' 
              : 'border-gray-300 bg-white'
          }`}>
            {role === 'landlord' && (
              <div className="w-full h-full rounded-full bg-white scale-50" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
