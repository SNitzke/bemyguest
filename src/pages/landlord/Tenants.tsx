import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquare, UserPlus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useInvitations, useProperties, useTenancies } from "@/hooks/useData";
import { errorMessage, formatDate, formatMoney } from "@/lib/format";
import PageHeader, { EmptyState } from "@/components/PageHeader";
import InviteTenantDialog, { ShareInvite } from "@/components/landlord/InviteTenantDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Tenants = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: tenancies = [] } = useTenancies();
  const { data: invitations = [] } = useInvitations();
  const { data: properties = [] } = useProperties();
  const [open, setOpen] = useState(false);

  const active = tenancies.filter((t) => t.landlord_id === user?.id && t.status === "active");
  const pending = invitations.filter((i) => i.status === "pending");
  const propName = (id: string) => properties.find((p) => p.id === id)?.name ?? "—";

  const cancelInvite = async (iid: string) => {
    const { error } = await supabase.from("invitations").delete().eq("id", iid);
    if (error) return toast.error(errorMessage(error));
    qc.invalidateQueries({ queryKey: ["invitations"] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquilinos"
        description="Invita y administra a los inquilinos de cada propiedad"
        action={<Button onClick={() => setOpen(true)} disabled={!properties.length}><UserPlus className="mr-2 h-4 w-4" /> Invitar inquilino</Button>}
      />

      {!active.length && !pending.length ? (
        <EmptyState
          icon={Users}
          title="Todavía no tienes inquilinos"
          text={properties.length ? "Invita a tu inquilino: recibirá un enlace para crear su cuenta conectada a la propiedad." : "Primero agrega una propiedad."}
          action={properties.length ? <Button onClick={() => setOpen(true)}>Invitar inquilino</Button> : <Button asChild><Link to="/properties">Agregar propiedad</Link></Button>}
        />
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle className="text-base">Activos ({active.length})</CardTitle></CardHeader>
            <CardContent className="divide-y">
              {active.map((t) => (
                <div key={t.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{t.tenant?.full_name || "Inquilino"}</p>
                    <p className="text-sm text-muted-foreground">{t.tenant?.email}{t.tenant?.phone ? ` · ${t.tenant.phone}` : ""}</p>
                    <p className="text-xs text-muted-foreground">
                      <Link to={`/properties/${t.property_id}`} className="text-primary hover:underline">{t.property?.name}</Link> · {formatMoney(t.rent_amount)}/mes · desde {formatDate(t.start_date)}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline"><Link to={`/messages?to=${t.tenant_id}`}><MessageSquare className="mr-2 h-4 w-4" /> Mensaje</Link></Button>
                </div>
              ))}
              {!active.length && <p className="py-3 text-sm text-muted-foreground">Ninguno aún.</p>}
            </CardContent>
          </Card>
          {pending.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Invitaciones pendientes ({pending.length})</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {pending.map((i) => (
                  <div key={i.id} className="space-y-3 rounded-md border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{i.tenant_name}</p>
                        <p className="text-xs text-muted-foreground">{i.tenant_email} · {propName(i.property_id)}</p>
                      </div>
                      <Badge variant="secondary">Pendiente</Badge>
                    </div>
                    <ShareInvite code={i.code} name={i.tenant_name} email={i.tenant_email} />
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => cancelInvite(i.id)}>Cancelar invitación</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
      <InviteTenantDialog open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Tenants;
