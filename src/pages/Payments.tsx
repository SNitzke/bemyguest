import React from "react";
import { usePayments } from "../hooks/usePayments";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CreditCard, Calendar, CheckCircle } from "lucide-react";

const Payments: React.FC = () => {
  const { payments, isLoading } = usePayments();
  const { profile } = useAuth();
  const isLandlord = profile?.role === "landlord";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "secondary";
      case "pending":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Pagado";
      case "pending":
        return "Pendiente";
      case "failed":
        return "Fallido";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "rent":
        return "Renta";
      case "utilities":
        return "Servicios";
      case "other":
        return "Otro";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-semibold">Pagos</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Pagos</h1>
        <p className="text-muted-foreground">
          {isLandlord 
            ? "Gestiona los pagos de tus propiedades"
            : "Revisa tus pagos y estado de cuenta"
          }
        </p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay pagos registrados</h3>
            <p className="text-muted-foreground text-center">
              {isLandlord 
                ? "Los pagos de tus inquilinos aparecerán aquí."
                : "Tus pagos y transacciones aparecerán aquí."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {getTypeText(payment.payment_type || "")}
                  </CardTitle>
                  <Badge variant={getStatusColor(payment.status || "") as any}>
                    {getStatusText(payment.status || "")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monto:</span>
                  <span className="font-semibold text-lg">
                    ${payment.amount?.toLocaleString() || "0"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fecha de vencimiento:</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {payment.due_date ? new Date(payment.due_date).toLocaleDateString('es-ES') : "N/A"}
                  </span>
                </div>
                
                {payment.payment_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fecha de pago:</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
                
                {payment.description && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">{payment.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;