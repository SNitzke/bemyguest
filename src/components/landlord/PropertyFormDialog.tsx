import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage } from "@/lib/format";
import type { Property } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  property?: Property | null;
}

const empty = { name: "", address: "", city: "", state: "", rent_amount: "", bedrooms: "", bathrooms: "", description: "" };

const PropertyFormDialog: React.FC<Props> = ({ open, onOpenChange, property }) => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      property
        ? {
            name: property.name,
            address: property.address,
            city: property.city ?? "",
            state: property.state ?? "",
            rent_amount: String(property.rent_amount ?? ""),
            bedrooms: property.bedrooms?.toString() ?? "",
            bathrooms: property.bathrooms?.toString() ?? "",
            description: property.description ?? "",
          }
        : empty,
    );
  }, [open, property]);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      rent_amount: Number(form.rent_amount) || 0,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      description: form.description.trim() || null,
    };
    const { error } = property
      ? await supabase.from("properties").update(payload).eq("id", property.id)
      : await supabase.from("properties").insert({ ...payload, landlord_id: user.id });
    setBusy(false);
    if (error) return toast.error(errorMessage(error));
    toast.success(property ? "Propiedad actualizada" : "Propiedad agregada");
    qc.invalidateQueries({ queryKey: ["properties"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{property ? "Editar propiedad" : "Agregar propiedad"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="p-name">Nombre</Label>
            <Input id="p-name" required placeholder="Ej. Depto Roma Norte 3B" value={form.name} onChange={set("name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-address">Dirección</Label>
            <Input id="p-address" required value={form.address} onChange={set("address")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="p-state">Estado</Label>
              <Input id="p-state" maxLength={100} placeholder="Ej. Ciudad de México" value={form.state} onChange={set("state")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-city">Ciudad</Label>
              <Input id="p-city" value={form.city} onChange={set("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-rent">Renta mensual (MXN)</Label>
              <Input id="p-rent" type="number" min="0" step="0.01" required value={form.rent_amount} onChange={set("rent_amount")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-bed">Recámaras</Label>
              <Input id="p-bed" type="number" min="0" value={form.bedrooms} onChange={set("bedrooms")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-bath">Baños</Label>
              <Input id="p-bath" type="number" min="0" step="0.5" value={form.bathrooms} onChange={set("bathrooms")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-desc">Descripción</Label>
            <Textarea id="p-desc" rows={3} value={form.description} onChange={set("description")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={busy}>{busy ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormDialog;
