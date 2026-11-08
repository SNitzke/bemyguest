import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProperties } from "@/hooks/useData";
import { errorMessage, formatDate, formatMoney } from "@/lib/format";
import PageHeader, { EmptyState } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const MAINTENANCE_CATEGORIES: Record<string, { label: string; months: number }> = {
  waterproofing: { label: "Impermeabilización", months: 12 },
  plumbing: { label: "Tuberías / plomería", months: 12 },
  humidity: { label: "Humedad", months: 6 },
  paint: { label: "Pintura", months: 24 },
  electrical: { label: "Instalación eléctrica", months: 24 },
  boiler: { label: "Boiler / calentador", months: 12 },
  gas: { label: "Gas", months: 12 },
  fumigation: { label: "Fumigación", months: 6 },
  water_tank: { label: "Limpieza de tinaco/cisterna", months: 6 },
  maintenance: { label: "Mantenimiento general", months: 6 },
};

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const addMonths = (iso: string, m: number) => {
  const d = new Date(iso + "T12:00:00");
  d.setMonth(d.getMonth() + m);
  return toISO(d);
};
const parse = (iso: string) => new Date(iso + "T12:00:00");
const daysUntil = (iso: string) => Math.round((parse(iso).getTime() - new Date().setHours(12, 0, 0, 0)) / 86400000);

function useMaintenance() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["maintenance", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("maintenance_records").select("*").order("repaired_on", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

const empty = () => {
  const today = toISO(new Date());
  return { property_id: "", title: "", category: "maintenance", repaired_on: today, next_due_on: addMonths(today, 6), cost: "", notes: "" };
};

const Maintenance = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: properties = [] } = useProperties();
  const { data: records = [], isLoading } = useMaintenance();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(empty());
  const [busy, setBusy] = useState(false);
  const [day, setDay] = useState<Date | undefined>();

  const propName = (id: string) => properties.find((p) => p.id === id)?.name ?? "";

  const repairedDays = useMemo(() => records.map((r) => parse(r.repaired_on)), [records]);
  const dueDays = useMemo(() => records.filter((r) => r.next_due_on).map((r) => parse(r.next_due_on!)), [records]);
  const upcoming = records
    .filter((r) => r.next_due_on)
    .sort((a, b) => a.next_due_on!.localeCompare(b.next_due_on!));
  const dayISO = day ? toISO(day) : null;
  const dayItems = dayISO ? records.filter((r) => r.repaired_on === dayISO || r.next_due_on === dayISO) : [];

  const setCategory = (category: string) => {
    const m = MAINTENANCE_CATEGORIES[category]?.months ?? 6;
    setF({ ...f, category, title: f.title || MAINTENANCE_CATEGORIES[category].label, next_due_on: addMonths(f.repaired_on, m) });
  };
  const setRepaired = (repaired_on: string) => {
    const m = MAINTENANCE_CATEGORIES[f.category]?.months ?? 6;
    setF({ ...f, repaired_on, next_due_on: repaired_on ? addMonths(repaired_on, m) : f.next_due_on });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const property_id = f.property_id || properties[0]?.id;
    if (!user || !property_id) return toast.error("Primero agrega una propiedad");
    setBusy(true);
    const { error } = await supabase.from("maintenance_records").insert({
      landlord_id: user.id,
      property_id,
      title: f.title.trim() || MAINTENANCE_CATEGORIES[f.category].label,
      category: f.category,
      repaired_on: f.repaired_on,
      next_due_on: f.next_due_on || null,
      cost: f.cost ? Number(f.cost) : null,
      notes: f.notes.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(errorMessage(error));
    toast.success("Reparación guardada en el calendario");
    qc.invalidateQueries({ queryKey: ["maintenance"] });
    setF(empty());
    setOpen(false);
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este registro?")) return;
    const { error } = await supabase.from("maintenance_records").delete().eq("id", id);
    if (error) return toast.error(errorMessage(error));
    qc.invalidateQueries({ queryKey: ["maintenance"] });
  };

  const dueBadge = (iso: string) => {
    const d = daysUntil(iso);
    if (d < 0) return <Badge variant="destructive">Vencida hace {-d} días</Badge>;
    if (d <= 30) return <Badge>En {d} días</Badge>;
    return <Badge variant="secondary">{formatDate(iso)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendario de reparaciones"
        description="Recuerda cuándo reparaste algo y cuándo toca la próxima revisión"
        action={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Registrar reparación</Button>}
      />

      {!isLoading && records.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Sin reparaciones registradas" text="Registra la impermeabilización, plomería o cualquier arreglo y te sugeriremos la próxima fecha." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <Card>
            <CardContent className="p-3">
              <Calendar
                mode="single"
                selected={day}
                onSelect={setDay}
                modifiers={{ repaired: repairedDays, due: dueDays }}
                modifiersClassNames={{
                  repaired: "font-bold underline decoration-primary decoration-2 underline-offset-4",
                  due: "bg-accent text-accent-foreground font-bold",
                }}
              />
              <div className="flex flex-wrap gap-3 px-3 pb-2 text-xs text-muted-foreground">
                <span><span className="font-bold underline decoration-primary decoration-2">15</span> Reparado</span>
                <span><span className="rounded bg-accent px-1 font-bold text-accent-foreground">15</span> Próxima revisión</span>
              </div>
              {dayISO && (
                <div className="space-y-2 border-t p-3 text-sm">
                  <p className="font-medium">{formatDate(dayISO)}</p>
                  {dayItems.length === 0 && <p className="text-muted-foreground">Nada este día.</p>}
                  {dayItems.map((r) => (
                    <p key={r.id}>
                      {r.repaired_on === dayISO ? "Reparado: " : "Toca revisar: "}
                      <span className="font-medium">{r.title}</span> · {propName(r.property_id)}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Próximas revisiones</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Sin fechas próximas.</p>}
                {upcoming.slice(0, 6).map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-2 rounded-md border p-3">
                    <div>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{propName(r.property_id)} · última vez {formatDate(r.repaired_on)}</p>
                    </div>
                    {dueBadge(r.next_due_on!)}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Historial</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {records.map((r) => (
                  <div key={r.id} className="flex items-start justify-between gap-2 rounded-md border p-3">
                    <div className="space-y-1">
                      <p className="font-medium">{r.title} <Badge variant="outline" className="ml-1">{MAINTENANCE_CATEGORIES[r.category]?.label ?? r.category}</Badge></p>
                      <p className="text-xs text-muted-foreground">
                        {propName(r.property_id)} · reparado {formatDate(r.repaired_on)}
                        {r.next_due_on ? ` · próxima ${formatDate(r.next_due_on)}` : ""}
                        {r.cost != null ? ` · ${formatMoney(r.cost)}` : ""}
                      </p>
                      {r.notes && <p className="text-sm text-muted-foreground">{r.notes}</p>}
                    </div>
                    <Button size="icon" variant="ghost" aria-label="Eliminar" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Registrar reparación</DialogTitle></DialogHeader>
          {properties.length === 0 ? (
            <p className="text-sm text-muted-foreground">Primero agrega una propiedad.</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>Propiedad</Label>
                <Select value={f.property_id || properties[0].id} onValueChange={(v) => setF({ ...f, property_id: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={f.category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(MAINTENANCE_CATEGORIES).map(([k, c]) => <SelectItem key={k} value={k}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-title">¿Qué se reparó?</Label>
                <Input id="m-title" placeholder="Ej. Impermeabilización de azotea" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="m-done">Fecha de reparación</Label>
                  <Input id="m-done" type="date" required value={f.repaired_on} onChange={(e) => setRepaired(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="m-next">Próxima revisión (sugerida)</Label>
                  <Input id="m-next" type="date" value={f.next_due_on} onChange={(e) => setF({ ...f, next_due_on: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-cost">Costo (opcional)</Label>
                <Input id="m-cost" type="number" min="0" step="1" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-notes">Notas</Label>
                <Textarea id="m-notes" rows={3} placeholder="Proveedor, garantía, materiales..." value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={busy}>{busy ? "Guardando..." : "Guardar"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Maintenance;
