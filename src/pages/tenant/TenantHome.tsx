import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, MapPin, MessageSquare, Wrench } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIssues, useTenancies } from "@/hooks/useData";
import { formatDate, formatMoney, ISSUE_STATUS } from "@/lib/format";
import PageHeader, { EmptyState } from "@/components/PageHeader";
import { ReportIssueDialog } from "@/pages/Issues";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRental } from "@/hooks/useRental";
import { usePayments } from "@/hooks/useData";
import { chargeBalance } from "@/lib/accounting";

const TenantHome = () => {
  const { user, profile } = useAuth();
  const { data: tenancies = [], isLoading } = useTenancies();
  const { data: issues = [] } = useIssues();
  const [reportOpen, setReportOpen] = useState(false);
  const { data: rental } = useRental();
  const { data: payments = [] } = usePayments();
  const mine = tenancies.filter((t) => t.tenant_id === user?.id && t.status === "active");
  const firstName = profile?.full_name?.split(" ")[0];

  if (!isLoading && !mine.length) {
    return (
      <div>
        <PageHeader title={firstName ? `Hola, ${firstName}` : "Bienvenido"} />
        <EmptyState
          icon={Home}
          title="Aún no estás conectado a una vivienda"
          text="Pide a tu arrendador que te envíe el enlace de invitación de BeMyGuest y ábrelo con esta cuenta."
          action={<Button asChild variant="outline"><Link to="/settings">Completar mi perfil</Link></Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={firstName ? `Hola, ${firstName}` : "Mi vivienda"} description="Todo sobre tu renta en un solo lugar" />
      {mine.map((t) => (
        <Card key={t.id}>
          <CardContent className="grid gap-4 p-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-heading text-xl font-semibold">{t.property?.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {t.property?.address}{t.property?.city ? `, ${t.property.city}` : ""}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div><p className="text-muted-foreground">Renta mensual</p><p className="font-semibold">{formatMoney(t.rent_amount)}</p></div>
                <div><p className="text-muted-foreground">Arrendador</p><p className="font-semibold">{t.landlord?.full_name || "—"}</p></div>
                <div><p className="text-muted-foreground">Desde</p><p className="font-semibold">{formatDate(t.start_date)}</p></div>
              </div>
              {(() => {const charge=rental?.charges.find(c=>c.tenancy_id===t.id&&chargeBalance(c,payments.filter(p=>p.charge_id===c.id),t.grace_days).balance>0);if(!charge)return <p className="mt-4 text-sm">Sin cargos pendientes.</p>;const b=chargeBalance(charge,payments.filter(p=>p.charge_id===charge.id),t.grace_days);const days=Math.ceil((new Date(charge.due_on+"T12:00:00").getTime()-Date.now())/86400000);return <div className="mt-4 border-t pt-3 text-sm"><p>Próximo vencimiento: <strong>{formatDate(charge.due_on)}</strong> · {days>=0?`En ${days} días`:`Hace ${-days} días`}</p><p>Saldo: <strong>{formatMoney(b.balance)}</strong> · {b.status==="overdue"?"Vencido":b.status==="partial"?"Parcial":"Pendiente"}</p></div>;})()}
              {t.property?.description && <p className="mt-4 text-sm text-muted-foreground">{t.property.description}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline"><Link to="/payments">Subir comprobante</Link></Button>
              <Button onClick={() => setReportOpen(true)}><Wrench className="mr-2 h-4 w-4" /> Solicitar reparación</Button>
              <Button asChild variant="outline"><Link to={`/messages?to=${t.landlord_id}`}><MessageSquare className="mr-2 h-4 w-4" /> Escribir al arrendador</Link></Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Mis reportes</CardTitle>
          <Link to="/issues" className="text-sm text-primary hover:underline">Ver todos</Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {issues.slice(0, 5).map((i) => (
            <div key={i.id} className="flex items-center justify-between rounded-md border p-3">
              <span>{i.title}</span>
              <Badge variant={i.status === "resolved" ? "secondary" : "default"}>{ISSUE_STATUS[i.status] ?? i.status}</Badge>
            </div>
          ))}
          {!issues.length && <p className="text-sm text-muted-foreground">No has reportado problemas.</p>}
        </CardContent>
      </Card>
      <ReportIssueDialog open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
};

export default TenantHome;
