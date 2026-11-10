import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage, inviteLink } from "@/lib/format";
import { useProperties } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  propertyId?: string;
}

export const ShareInvite: React.FC<{ code: string; name: string; email: string }> = ({ code, name, email }) => {
  const link = inviteLink(code);
  const text = `Hola ${name}, te invito a BeMyGuest para administrar tu renta. Crea tu cuenta aquí: ${link}`;
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input readOnly value={link} onFocus={(e) => e.target.select()} />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Copiar enlace"
          onClick={() => navigator.clipboard.writeText(link).then(() => toast.success("Enlace copiado"))}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button asChild variant="secondary">
          <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href={`mailto:${email}?subject=${encodeURIComponent("Tu invitación a BeMyGuest")}&body=${encodeURIComponent(text)}`}>
            <Mail className="mr-2 h-4 w-4" /> Correo
          </a>
        </Button>
      </div>
    </div>
  );
};

const InviteTenantDialog: React.FC<Props> = ({ open, onOpenChange, propertyId }) => {
  const { user } = useAuth();
  const { data: properties = [] } = useProperties();
  const qc = useQueryClient();
  const [form, setForm] = useState({ property_id: "", tenant_name: "", tenant_email: "", rent_amount: "" });
  const [busy, setBusy] = useState(false);
  const [lease, setLease] = useState({ start_date: new Date().toISOString().slice(0,10), end_date: "", payment_day: "1", grace_days: "0", deposit_amount: "0", annual_increase: "" });
  const [created, setCreated] = useState<{ code: string; name: string; email: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const p = properties.find((x) => x.id === propertyId);
    setForm({ property_id: propertyId ?? "", tenant_name: "", tenant_email: "", rent_amount: p ? String(p.rent_amount) : "" });
    setCreated(null);
  }, [open, propertyId, properties]);

  const selected = properties.find((p) => p.id === form.property_id);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.property_id) return toast.error("Elige una propiedad");
    if (!lease.end_date || lease.end_date < lease.start_date) return toast.error("Revisa las fechas del contrato");
    setBusy(true);
    const { data, error } = await supabase
      .from("invitations")
      .insert({
        landlord_id: user.id,
        property_id: form.property_id,
        tenant_name: form.tenant_name.trim(),
        tenant_email: form.tenant_email.trim().toLowerCase(),
        rent_amount: Number(form.rent_amount) || 0,
        start_date: lease.start_date,
        end_date: lease.end_date,
        payment_day: Number(lease.payment_day),
        grace_days: Number(lease.grace_days),
        deposit_amount: Number(lease.deposit_amount),
        annual_increase: lease.annual_increase ? Number(lease.annual_increase) : null,
      })
      .select("code")
      .single();
    setBusy(false);
    if (error) return toast.error(errorMessage(error));
    qc.invalidateQueries({ queryKey: ["invitations"] });
    setCreated({ code: data.code, name: form.tenant_name.trim(), email: form.tenant_email.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{created ? "Invitación lista" : "Invitar inquilino"}</DialogTitle>
          <DialogDescription>
            {created
              ? `Comparte este enlace con ${created.name}. Al abrirlo creará su cuenta y quedará conectado a ${selected?.name ?? "la propiedad"}.`
              : "Genera un enlace único para que tu inquilino cree su cuenta conectada a la propiedad."}
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <>
            <ShareInvite {...created} />
            <Button className="w-full" onClick={() => onOpenChange(false)}>Listo</Button>
          </>
        ) : properties.length === 0 ? (
          <p className="text-sm text-muted-foreground">Primero agrega una propiedad.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>Propiedad</Label>
              <Select
                value={form.property_id}
                onValueChange={(v) => {
                  const p = properties.find((x) => x.id === v);
                  setForm((f) => ({ ...f, property_id: v, rent_amount: p ? String(p.rent_amount) : f.rent_amount }));
                }}
              >
                <SelectTrigger><SelectValue placeholder="Elige la propiedad" /></SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selected && <p className="text-xs text-muted-foreground">{selected.address}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-name">Nombre completo del inquilino</Label>
              <Input id="t-name" required value={form.tenant_name} onChange={(e) => setForm((f) => ({ ...f, tenant_name: e.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="t-email">Correo</Label>
                <Input id="t-email" type="email" required value={form.tenant_email} onChange={(e) => setForm((f) => ({ ...f, tenant_email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-rent">Renta mensual (MXN)</Label>
                <Input id="t-rent" type="number" min="0" required value={form.rent_amount} onChange={(e) => setForm((f) => ({ ...f, rent_amount: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {([{key:"start_date",label:"Fecha de inicio",type:"date"},{key:"end_date",label:"Fecha de fin",type:"date"},{key:"payment_day",label:"Día de pago (1–28)",type:"number"},{key:"grace_days",label:"Días de gracia",type:"number"},{key:"deposit_amount",label:"Depósito en garantía (MXN)",type:"number"},{key:"annual_increase",label:"Aumento anual % (opcional)",type:"number"}] as const).map(x=><div key={x.key}><Label htmlFor={`invite-${x.key}`}>{x.label}</Label><Input id={`invite-${x.key}`} type={x.type} required={x.key!=="annual_increase"} min={x.key==="payment_day"?1:0} max={x.key==="payment_day"?28:x.key==="grace_days"?30:x.key==="annual_increase"?100:undefined} value={lease[x.key]} onChange={e=>setLease({...lease,[x.key]:e.target.value})}/></div>)}
            </div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Generando..." : "Generar enlace de invitación"}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteTenantDialog;
