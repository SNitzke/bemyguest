import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bath, BedDouble, Building2, MapPin, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Property, useProperties, useTenancies } from "@/hooks/useData";
import { errorMessage, formatMoney } from "@/lib/format";
import PageHeader, { EmptyState } from "@/components/PageHeader";
import PropertyFormDialog from "@/components/landlord/PropertyFormDialog";
import InviteTenantDialog from "@/components/landlord/InviteTenantDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Properties = () => {
  const { user } = useAuth();
  const { data: properties = [], isLoading } = useProperties();
  const { data: tenancies = [] } = useTenancies();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Property | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [inviteFor, setInviteFor] = useState<string | undefined>();
  const [deleting, setDeleting] = useState<Property | null>(null);

  const remove = async () => {
    if (!deleting) return;
    const { error } = await supabase.from("properties").delete().eq("id", deleting.id);
    if (error) return toast.error(errorMessage(error));
    toast.success("Propiedad eliminada");
    qc.invalidateQueries();
    setDeleting(null);
  };

  return (
    <div>
      <PageHeader
        title="Propiedades"
        description="Agrega, edita y elimina tus propiedades"
        action={<Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Agregar propiedad</Button>}
      />

      {!isLoading && properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Aún no tienes propiedades"
          text="Agrega tu primera propiedad para empezar a invitar inquilinos y registrar pagos."
          action={<Button onClick={() => setFormOpen(true)}><Plus className="mr-2 h-4 w-4" /> Agregar propiedad</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((p) => {
            const tenants = tenancies.filter((t) => t.property_id === p.id && t.status === "active" && t.landlord_id === user?.id);
            return (
              <Card key={p.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/properties/${p.id}`} className="font-heading text-lg font-semibold hover:underline">{p.name}</Link>
                    <Badge variant={tenants.length ? "default" : "secondary"}>{tenants.length ? "Rentada" : "Disponible"}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {p.address}{p.city ? `, ${p.city}` : ""}</p>
                  <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                    {p.bedrooms != null && <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {p.bedrooms}</span>}
                    {p.bathrooms != null && <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {p.bathrooms}</span>}
                  </div>
                  <p className="mt-3 font-semibold">{formatMoney(p.rent_amount)} <span className="text-sm font-normal text-muted-foreground">/ mes</span></p>
                  <p className="mt-1 text-sm">{tenants.length ? `Inquilino: ${tenants.map((t) => t.tenant?.full_name || "—").join(", ")}` : "Sin inquilino"}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Button size="sm" variant="outline" onClick={() => setInviteFor(p.id)}><UserPlus className="mr-1 h-4 w-4" /> Invitar</Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(p); setFormOpen(true); }}><Pencil className="mr-1 h-4 w-4" /> Editar</Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleting(p)}><Trash2 className="mr-1 h-4 w-4" /> Eliminar</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <PropertyFormDialog open={formOpen} onOpenChange={setFormOpen} property={editing} />
      <InviteTenantDialog open={!!inviteFor} onOpenChange={(o) => !o && setInviteFor(undefined)} propertyId={inviteFor} />
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Se borrarán también sus inquilinos vinculados, invitaciones y reparaciones. No se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Properties;
