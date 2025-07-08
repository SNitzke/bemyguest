import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { UserPlus, User, Mail, Hash, DollarSign, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InviteTenantModalProps {
  properties: Array<{ id: string; name: string; rent_amount?: number }>;
}

export const InviteTenantModal: React.FC<InviteTenantModalProps> = ({ properties }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [invitationLink, setInvitationLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    tenantName: '',
    tenantEmail: '',
    propertyId: '',
    unitNumber: '',
    rentAmount: ''
  });

  const selectedProperty = properties.find(p => p.id === formData.propertyId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tenantName || !formData.tenantEmail || !formData.propertyId || !formData.unitNumber || !formData.rentAmount) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (!user) {
      toast.error('Debes estar autenticado');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate invitation code
      const { data: codeData } = await supabase.rpc('generate_invitation_code');
      const invitationCode = codeData;

      // Create invitation
      const { error } = await supabase
        .from('tenant_invitations')
        .insert({
          landlord_id: user.id,
          property_id: formData.propertyId,
          tenant_name: formData.tenantName,
          tenant_email: formData.tenantEmail,
          unit_number: formData.unitNumber,
          rent_amount: parseFloat(formData.rentAmount),
          invitation_code: invitationCode
        });

      if (error) throw error;

      // Generate invitation link
      const link = `${window.location.origin}/tenant-invitation?code=${invitationCode}&email=${encodeURIComponent(formData.tenantEmail)}`;
      setInvitationLink(link);
      setStep(2);
      toast.success('Invitación creada exitosamente');
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast.error('Error al crear la invitación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      toast.success('Link copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar el link');
    }
  };

  const resetForm = () => {
    setFormData({
      tenantName: '',
      tenantEmail: '',
      propertyId: '',
      unitNumber: '',
      rentAmount: ''
    });
    setStep(1);
    setCopied(false);
    setInvitationLink('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus size={16} />
          Invitar Inquilino
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Invitar Nuevo Inquilino' : 'Invitación Creada'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenantName">Nombre del Inquilino</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tenantName"
                  placeholder="Juan Pérez"
                  value={formData.tenantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, tenantName: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tenantEmail">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tenantEmail"
                  type="email"
                  placeholder="juan@example.com"
                  value={formData.tenantEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, tenantEmail: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property">Propiedad</Label>
              <Select 
                value={formData.propertyId} 
                onValueChange={(value) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    propertyId: value,
                    rentAmount: properties.find(p => p.id === value)?.rent_amount?.toString() || ''
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una propiedad" />
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
              <Label htmlFor="unitNumber">Número de Unidad</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="unitNumber"
                  placeholder="101"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rentAmount">Monto de Renta Mensual</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="rentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="1500.00"
                  value={formData.rentAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, rentAmount: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
              {selectedProperty?.rent_amount && (
                <p className="text-sm text-muted-foreground">
                  Renta predeterminada: ${selectedProperty.rent_amount}
                </p>
              )}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear Invitación'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">¡Invitación Creada!</h3>
              <p className="text-muted-foreground">
                Comparte este link con {formData.tenantName} para que pueda acceder a su perfil de inquilino.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Link de Invitación</Label>
              <div className="flex gap-2">
                <Input 
                  value={invitationLink} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Resumen de la Invitación:</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Inquilino:</strong> {formData.tenantName}</p>
                <p><strong>Email:</strong> {formData.tenantEmail}</p>
                <p><strong>Propiedad:</strong> {selectedProperty?.name}</p>
                <p><strong>Unidad:</strong> {formData.unitNumber}</p>
                <p><strong>Renta:</strong> ${formData.rentAmount}</p>
              </div>
            </div>
            
            <Button onClick={resetForm} className="w-full">
              Crear Otra Invitación
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};