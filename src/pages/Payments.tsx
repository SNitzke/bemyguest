import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePayments, useProperties, useTenancies } from "@/hooks/useData";
import { errorMessage, formatDate, formatMoney, PAYMENT_CATEGORIES, PAYMENT_METHODS } from "@/lib/format";
import PageHeader, { EmptyState } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const NONE = "none";

const PaymentDialog: React.FC<{ open: boolean; onOpenChange: (o: boolean) => void }> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: properties = [] } = useProperties();
  const { data: tenancies = [] } = useTenancies();
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ category: "rent", method: "transfer", amount: "", paid_on: today, property_id: NONE, notes: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const propertyId = f.property_id === NONE ? null : f.property_id;
    const tenant = propertyId ? tenancies.find((t) => t.property_id === propertyId && t.status === "active") : undefined;
    const { error } = await supabase.from("payments").insert({
      landlord_id: user.id,
      property_id: propertyId,
      tenant_id: tenant?.tenant_id ?? null,
      category: f.category,
      kind: PAYMENT_CATEGORIES[f.category].kind,
      method: f.method,
      amount: Number(f.amount),
      paid_on: f.paid_on,
      notes: f.notes.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(errorMessage(error));
    toast.success("Pago registrado");
    qc.invalidateQueries({ queryKey: ["payments"] });
    setF({ category: "rent", method: "transfer", amount: "", paid_on: today, property_id: NONE, notes: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Registrar pago</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Concepto</Label>
              <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_CATEGORIES).map(([k, c]) => (
                    <SelectItem key={k} value={k}>{c.label} {c.kind === "income" ? "(ingreso)" : "(gasto)"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Método</Label>
              <Select value={f.method} onValueChange={(v) => setF({ ...f, method: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_METHODS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-amount">Monto (MXN)</Label>
              <Input id="pay-amount" type="number" min="0.01" step="0.01" required value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-date">Fecha</Label>
              <Input id="pay-date" type="date" required value={f.paid_on} onChange={(e) => setF({ ...f, paid_on: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Propiedad</Label>
            <Select value={f.property_id} onValueChange={(v) => setF({ ...f, property_id: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>General / sin propiedad</SelectItem>
                {properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay-notes">Notas</Label>
            <Textarea id="pay-notes" rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={busy}>{busy ? "Guardando..." : "Guardar pago"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Payments = () => {
  const { role } = useAuth();
  const isLandlord = role === "landlord";
  const qc = useQueryClient();
  const { data: payments = [], isLoading } = usePayments();
  const { data: properties = [] } = useProperties();
  const { data: tenancies = [] } = useTenancies();
  const [open, setOpen] = useState(false);

  const propName = (id: string | null) =>
    id ? properties.find((p) => p.id === id)?.name ?? tenancies.find((t) => t.property_id === id)?.property?.name ?? "—" : "General";
  const income = payments.filter((p) => p.kind === "income").reduce((s, p) => s + Number(p.amount), 0);
  const expense = payments.filter((p) => p.kind === "expense").reduce((s, p) => s + Number(p.amount), 0);

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este registro?")) return;
    const { error } = await supabase.from("payments").delete().eq("id", id);
    if (error) return toast.error(errorMessage(error));
    qc.invalidateQueries({ queryKey: ["payments"] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagos"
        description={isLandlord ? "Registra pagos en efectivo, transferencia o cheque y tus gastos" : "Historial de pagos registrados por tu arrendador"}
        action={isLandlord && <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Registrar pago</Button>}
      />

      {isLandlord && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Ingresos</p><p className="font-heading text-xl font-semibold text-primary">{formatMoney(income)}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Gastos</p><p className="font-heading text-xl font-semibold text-destructive">{formatMoney(expense)}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Balance</p><p className="font-heading text-xl font-semibold">{formatMoney(income - expense)}</p></CardContent></Card>
        </div>
      )}

      {!isLoading && payments.length === 0 ? (
        <EmptyState icon={Wallet} title="Sin pagos registrados" text={isLandlord ? "Registra tu primer pago o gasto; aparecerá en la gráfica de tu panel." : undefined} />
      ) : (
        <Card>
          <CardContent className="divide-y p-0">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{PAYMENT_CATEGORIES[p.category]?.label ?? p.category}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatDate(p.paid_on)} · {PAYMENT_METHODS[p.method] ?? p.method} · {propName(p.property_id)}{p.notes ? ` · ${p.notes}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={p.kind === "income" ? "font-semibold text-primary" : "font-semibold text-destructive"}>
                    {p.kind === "income" ? "+" : "−"}{formatMoney(p.amount)}
                  </span>
                  {isLandlord && (
                    <Button size="icon" variant="ghost" aria-label="Eliminar" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {isLandlord && <PaymentDialog open={open} onOpenChange={setOpen} />}
    </div>
  );
};

export default Payments;
