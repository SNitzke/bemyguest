import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, MapPin, MessageSquare, Pencil, UserMinus, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useInvitations, useIssues, usePayments, useProperties, useTenancies } from "@/hooks/useData";
import { errorMessage, formatDate, formatMoney, ISSUE_STATUS, PAYMENT_CATEGORIES } from "@/lib/format";
import PropertyFormDialog from "@/components/landlord/PropertyFormDialog";
import InviteTenantDialog, { ShareInvite } from "@/components/landlord/InviteTenantDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PropertyDetail = () => {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: properties = [], isLoading } = useProperties();
  const { data: tenancies = [] } = useTenancies();
  const { data: invitations = [] } = useInvitations();
  const { data: issues = [] } = useIssues();
  const { data: payments = [] } = usePayments();
  const [editOpen, setEditOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const property = properties.find((p) => p.id === id);
  if (isLoading) return null;
  if (!property) return <p>No encontramos esta propiedad. <Link className="text-primary" to="/properties">Volver</Link></p>;

  const tenants = tenancies.filter((t) => t.property_id === id && t.status === "active");
  const pending = invitations.filter((i) => i.property_id === id && i.status === "pending");
  const propIssues = issues.filter((i) => i.property_id === id);
  const propPayments = payments.filter((p) => p.property_id === id).slice(0, 8);

  const endTenancy = async (tid: string) => {
    if (!confirm("¿Desvincular a este inquilino de la propiedad?")) return;
    const { error } = await supabase.from("tenancies").delete().eq("id", tid);
    if (error) return toast.error(errorMessage(error));
    toast.success("Inquilino desvinculado");
    qc.invalidateQueries({ queryKey: ["tenancies"] });
  };

  const cancelInvite = async (iid: string) => {
    const { error } = await supabase.from("invitations").delete().eq("id", iid);
    if (error) return toast.error(errorMessage(error));
    qc.invalidateQueries({ queryKey: ["invitations"] });
  };

  return (
    <div className="space-y-6">
      <Link to="/properties" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-1 h-4 w-4" /> Propiedades</Link>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold md:text-3xl">{property.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {property.address}{property.city ? `, ${property.city}` : ""}</p>
          <p className="mt-2 font-semibold">{formatMoney(property.rent_amount)} / mes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}><Pencil className="mr-2 h-4 w-4" /> Editar</Button>
          <Button onClick={() => setInviteOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> Invitar inquilino</Button>
        </div>
      </div>
      {property.description && <p className="text-sm text-muted-foreground">{property.description}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Inquilinos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {tenants.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">{t.tenant?.full_name || "Inquilino"}</p>
                  <p className="text-xs text-muted-foreground">{t.tenant?.email} · desde {formatDate(t.start_date)} · {formatMoney(t.rent_amount)}</p>
                </div>
                <div className="flex gap-1">
                  <Button asChild size="icon" variant="ghost" aria-label="Enviar mensaje"><Link to={`/messages?to=${t.tenant_id}`}><MessageSquare className="h-4 w-4" /></Link></Button>
                  <Button size="icon" variant="ghost" aria-label="Desvincular" onClick={() => endTenancy(t.id)}><UserMinus className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
            {pending.map((i) => (
              <div key={i.id} className="space-y-2 rounded-md border border-dashed p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{i.tenant_name} <Badge variant="secondary" className="ml-1">Invitación pendiente</Badge></p>
                    <p className="text-xs text-muted-foreground">{i.tenant_email}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => cancelInvite(i.id)}>Cancelar</Button>
                </div>
                <ShareInvite code={i.code} name={i.tenant_name} email={i.tenant_email} />
              </div>
            ))}
            {!tenants.length && !pending.length && <p className="text-sm text-muted-foreground">Sin inquilinos todavía. Invita a uno con el botón de arriba.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Reparaciones</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {propIssues.map((i) => (
              <Link key={i.id} to="/issues" className="flex items-center justify-between rounded-md border p-3 hover:bg-muted">
                <span className="font-medium">{i.title}</span>
                <Badge variant={i.status === "resolved" ? "secondary" : "default"}>{ISSUE_STATUS[i.status] ?? i.status}</Badge>
              </Link>
            ))}
            {!propIssues.length && <p className="text-sm text-muted-foreground">No hay reportes.</p>}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pagos recientes</CardTitle>
            <Link to="/payments" className="text-sm text-primary hover:underline">Registrar pago</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {propPayments.map((p) => (
              <div key={p.id} className="flex justify-between text-sm">
                <span>{formatDate(p.paid_on)} · {PAYMENT_CATEGORIES[p.category]?.label ?? p.category}</span>
                <span className={p.kind === "income" ? "font-medium text-primary" : "font-medium text-destructive"}>
                  {p.kind === "income" ? "+" : "−"}{formatMoney(p.amount)}
                </span>
              </div>
            ))}
            {!propPayments.length && <p className="text-sm text-muted-foreground">Sin pagos registrados.</p>}
          </CardContent>
        </Card>
      </div>

      <PropertyFormDialog open={editOpen} onOpenChange={setEditOpen} property={property} />
      <InviteTenantDialog open={inviteOpen} onOpenChange={setInviteOpen} propertyId={property.id} />
    </div>
  );
};

export default PropertyDetail;
