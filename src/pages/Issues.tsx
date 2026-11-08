import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIssues, useTenancies } from "@/hooks/useData";
import { errorMessage, formatDate, ISSUE_PRIORITY, ISSUE_STATUS } from "@/lib/format";
import PageHeader, { EmptyState } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const ReportIssueDialog: React.FC<{ open: boolean; onOpenChange: (o: boolean) => void }> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: tenancies = [] } = useTenancies();
  const mine = tenancies.filter((t) => t.tenant_id === user?.id && t.status === "active");
  const [f, setF] = useState({ title: "", description: "", priority: "medium", tenancy: "" });
  const [busy, setBusy] = useState(false);
  const tenancyId = f.tenancy || mine[0]?.id || "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = mine.find((x) => x.id === tenancyId);
    if (!user || !t) return toast.error("No tienes una vivienda conectada");
    setBusy(true);
    const { error } = await supabase.from("issues").insert({
      property_id: t.property_id,
      landlord_id: t.landlord_id,
      tenant_id: user.id,
      title: f.title.trim(),
      description: f.description.trim() || null,
      priority: f.priority,
    });
    setBusy(false);
    if (error) return toast.error(errorMessage(error));
    toast.success("Reporte enviado a tu arrendador");
    qc.invalidateQueries({ queryKey: ["issues"] });
    setF({ title: "", description: "", priority: "medium", tenancy: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Solicitar reparación</DialogTitle></DialogHeader>
        {mine.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no estás conectado a una vivienda. Abre el enlace de invitación de tu arrendador.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {mine.length > 1 && (
              <div className="space-y-2">
                <Label>Vivienda</Label>
                <Select value={tenancyId} onValueChange={(v) => setF({ ...f, tenancy: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{mine.map((t) => <SelectItem key={t.id} value={t.id}>{t.property?.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="i-title">¿Qué pasa?</Label>
              <Input id="i-title" required placeholder="Ej. Fuga en el baño" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="i-desc">Detalles</Label>
              <Textarea id="i-desc" rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Urgencia</Label>
              <Select value={f.priority} onValueChange={(v) => setF({ ...f, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(ISSUE_PRIORITY).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={busy}>{busy ? "Enviando..." : "Enviar reporte"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Issues = () => {
  const { role } = useAuth();
  const isLandlord = role === "landlord";
  const qc = useQueryClient();
  const { data: issues = [], isLoading } = useIssues();
  const { data: tenancies = [] } = useTenancies();
  const [open, setOpen] = useState(false);

  const propName = (id: string) => tenancies.find((t) => t.property_id === id)?.property?.name ?? "";
  const tenantName = (id: string) => tenancies.find((t) => t.tenant_id === id)?.tenant?.full_name ?? "";

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("issues").update({ status }).eq("id", id);
    if (error) return toast.error(errorMessage(error));
    qc.invalidateQueries({ queryKey: ["issues"] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reparaciones"
        description={isLandlord ? "Reportes de tus inquilinos" : "Tus solicitudes de reparación"}
        action={!isLandlord && <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Solicitar reparación</Button>}
      />
      {!isLoading && issues.length === 0 ? (
        <EmptyState icon={Wrench} title="No hay reportes" text={isLandlord ? "Cuando un inquilino reporte un problema aparecerá aquí." : "Si algo falla en tu vivienda, repórtalo aquí."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {issues.map((i) => (
            <Card key={i.id}>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{i.title}</p>
                  <Badge variant={i.priority === "urgent" || i.priority === "high" ? "destructive" : "secondary"}>{ISSUE_PRIORITY[i.priority] ?? i.priority}</Badge>
                </div>
                {i.description && <p className="text-sm text-muted-foreground">{i.description}</p>}
                <p className="text-xs text-muted-foreground">
                  {formatDate(i.created_at)} · {propName(i.property_id)}{isLandlord && tenantName(i.tenant_id) ? ` · ${tenantName(i.tenant_id)}` : ""}
                </p>
                {isLandlord ? (
                  <Select value={i.status} onValueChange={(v) => setStatus(i.id, v)}>
                    <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(ISSUE_STATUS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <Badge variant={i.status === "resolved" ? "secondary" : "default"}>{ISSUE_STATUS[i.status] ?? i.status}</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!isLandlord && <ReportIssueDialog open={open} onOpenChange={setOpen} />}
    </div>
  );
};

export default Issues;
