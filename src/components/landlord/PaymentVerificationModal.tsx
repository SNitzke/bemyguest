import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { Copy, CreditCard, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionPlan: string;
}

export const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({
  open,
  onOpenChange,
  subscriptionPlan,
}) => {
  const [paymentData, setPaymentData] = useState({
    referenceNumber: '',
    amount: '',
    paymentDate: '',
    notes: ''
  });

  const bankInfo = {
    bankName: "Banco Nacional",
    accountNumber: "0123456789",
    accountHolder: "BeMyGuest Real Estate",
    routingNumber: "021000021"
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData.referenceNumber || !paymentData.amount || !paymentData.paymentDate) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Simular envío de verificación
    toast.success('Solicitud de verificación enviada. Te contactaremos dentro de 24-48 horas.');
    onOpenChange(false);
    setPaymentData({ referenceNumber: '', amount: '', paymentDate: '', notes: '' });
  };

  const getPlanPrice = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'basic': return '$29.99';
      case 'premium': return '$79.99';
      case 'enterprise': return '$199.99';
      default: return '$29.99';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Verificar Pago - Plan {subscriptionPlan}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Bancaria */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Información para Transferencia Bancaria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Banco</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bankInfo.bankName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(bankInfo.bankName, 'Nombre del banco')}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Número de Cuenta</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{bankInfo.accountNumber}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(bankInfo.accountNumber, 'Número de cuenta')}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Titular</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bankInfo.accountHolder}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(bankInfo.accountHolder, 'Titular de la cuenta')}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Monto a Transferir</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-primary">{getPlanPrice(subscriptionPlan)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(getPlanPrice(subscriptionPlan), 'Monto')}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de Verificación */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Número de Referencia *</Label>
              <Input
                id="reference"
                placeholder="Ej: 123456789"
                value={paymentData.referenceNumber}
                onChange={(e) => setPaymentData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                Ingresa el número de referencia que te proporcionó el banco
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto Transferido *</Label>
              <Input
                id="amount"
                placeholder="29.99"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Fecha de Pago *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentData.paymentDate}
                onChange={(e) => setPaymentData(prev => ({ ...prev, paymentDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                placeholder="Cualquier información adicional sobre el pago..."
                value={paymentData.notes}
                onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="text-blue-600 mt-0.5" size={16} />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Tiempo de Verificación</p>
                  <p className="text-blue-600">
                    Una vez enviada tu información, verificaremos tu pago en un plazo de 24-48 horas.
                    Te notificaremos por email cuando tu cuenta sea activada.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 gap-2">
                <Check size={16} />
                Enviar Verificación
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};