import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Trash2, Eye, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ManualPaymentForm } from './ManualPaymentForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface ManualPayment {
  id: string;
  amount: number;
  payment_type: string;
  payment_method: string;
  description: string | null;
  payment_date: string;
  created_at: string;
  property_id: string | null;
  properties?: {
    name: string;
    address: string;
  };
}

const paymentTypeLabels: Record<string, string> = {
  rent: 'Renta',
  utilities: 'Servicios',
  maintenance: 'Mantenimiento',
  humidity: 'Humedad',
  waterproofing: 'Impermeabilización',
  plumbing: 'Tuberías',
  other: 'Otro'
};

const paymentMethodLabels: Record<string, string> = {
  cash: 'Efectivo',
  bank_transfer: 'Transferencia',
  check: 'Cheque',
  other: 'Otro'
};

const getPaymentTypeColor = (type: string) => {
  switch (type) {
    case 'rent': return 'bg-green-100 text-green-800';
    case 'utilities': return 'bg-blue-100 text-blue-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    case 'humidity': return 'bg-purple-100 text-purple-800';
    case 'waterproofing': return 'bg-indigo-100 text-indigo-800';
    case 'plumbing': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function ManualPaymentsList() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('manual_payments')
        .select(`
          *,
          properties:property_id (
            name,
            address
          )
        `)
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching manual payments:', error);
      toast.error('Error al cargar los pagos');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('manual_payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      toast.success('Pago eliminado exitosamente');
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Error al eliminar el pago');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pagos Registrados Manualmente</CardTitle>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus size={16} />
            Registrar Pago
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No tienes pagos registrados manualmente
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus size={16} />
              Registrar Primer Pago
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getPaymentTypeColor(payment.payment_type)}>
                        {paymentTypeLabels[payment.payment_type]}
                      </Badge>
                      <Badge variant="outline">
                        {paymentMethodLabels[payment.payment_method]}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-semibold text-green-600">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(payment.payment_date)}
                      </span>
                    </div>

                    {payment.properties && (
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>Propiedad:</strong> {payment.properties.name} - {payment.properties.address}
                      </p>
                    )}

                    {payment.description && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Descripción:</strong> {payment.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar pago?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El pago será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deletePayment(payment.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <ManualPaymentForm
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={fetchPayments}
      />
    </Card>
  );
}