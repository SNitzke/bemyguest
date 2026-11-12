import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hasLandlordAccess, trialDaysLeft, useAuth } from "@/contexts/AuthContext";
import { STRIPE_PLANS, PlanId } from "@/config/stripe";
import { errorMessage, formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ReminderSettings from "@/components/rental/ReminderSettings";

const Settings = () => {
  const { user, profile, role, subscription, refresh } = useAuth();
  const [params] = useSearchParams();
  const welcome = params.get("welcome") === "1";
  const [f, setF] = useState({ full_name: "", phone: "", emergency_contact: "", bio: "" });
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "" });

  useEffect(() => {
    if (profile)
      setF({ full_name: profile.full_name, phone: profile.phone ?? "", emergency_contact: profile.emergency_contact ?? "", bio: profile.bio ?? "" });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: f.full_name.trim(), phone: f.phone.trim() || null, emergency_contact: f.emergency_contact.trim() || null, bio: f.bio.trim() || null })
      .eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(errorMessage(error));
    await refresh();
    toast.success("Perfil guardado");
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next.length < 8) return toast.error("La nueva contraseña debe tener al menos 8 caracteres");
    const { error } = await supabase.auth.updateUser({ password: pw.next, current_password: pw.current } as never);
    if (error) return toast.error(errorMessage(error));
    setPw({ current: "", next: "" });
    toast.success("Contraseña actualizada");
  };

  const plan = subscription ? STRIPE_PLANS[subscription.plan as PlanId] : null;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Configuración" description="Tu información personal y tu cuenta" />

      {welcome && (
        <Card className="border-primary/40 bg-secondary">
          <CardContent className="p-5">
            <p className="font-semibold">Paso 3: completa tu perfil</p>
            <p className="text-sm text-muted-foreground">
              Agrega tu teléfono y un contacto de emergencia. Después podrás ver tu vivienda, solicitar reparaciones y chatear con tu arrendador.
            </p>
            <Button asChild size="sm" className="mt-3"><Link to="/dashboard">Ir a mi vivienda</Link></Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Información personal</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="s-name">Nombre completo</Label>
                <Input id="s-name" required value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Correo</Label>
                <Input value={profile?.email ?? user?.email ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-phone">Teléfono</Label>
                <Input id="s-phone" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-em">Contacto de emergencia</Label>
                <Input id="s-em" placeholder="Nombre y teléfono" value={f.emergency_contact} onChange={(e) => setF({ ...f, emergency_contact: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-bio">Notas sobre ti</Label>
              <Textarea id="s-bio" rows={3} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
            </div>
            <Button type="submit" disabled={busy}>{busy ? "Guardando..." : "Guardar cambios"}</Button>
          </form>
        </CardContent>
      </Card>

      {role === "landlord" && subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tu plan</CardTitle>
            <CardDescription>
              {plan?.name ?? subscription.plan} ·{" "}
              {subscription.status === "active"
                ? `Activo${subscription.current_period_end ? ` hasta ${formatDate(subscription.current_period_end)}` : ""}`
                : "Consulta tus opciones de plan"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline"><Link to="/pricing">{subscription.status === "active" ? "Administrar plan" : "Elegir plan"}</Link></Button>
          </CardContent>
        </Card>
      )}

      {role === "landlord" && <ReminderSettings />}
      <Card>
        <CardHeader><CardTitle className="text-base">Contraseña</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pw-c">Contraseña actual</Label>
              <Input id="pw-c" type="password" autoComplete="current-password" required value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw-n">Nueva contraseña</Label>
              <Input id="pw-n" type="password" autoComplete="new-password" required value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            </div>
            <div><Button type="submit" variant="outline">Cambiar contraseña</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
