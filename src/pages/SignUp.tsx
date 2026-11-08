import React, { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Building2, Check, MailCheck, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { homePathFor, Role, useAuth } from "@/contexts/AuthContext";
import { STRIPE_PLANS, PlanId } from "@/config/stripe";
import { cn } from "@/lib/utils";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignUp = () => {
  const { user, role: currentRole, isLoading } = useAuth();
  const [params] = useSearchParams();
  const inviteCode = params.get("invite");
  const [role, setRole] = useState<Role>(inviteCode ? "tenant" : (params.get("role") as Role) === "tenant" ? "tenant" : "landlord");
  const [plan, setPlan] = useState<PlanId>((params.get("plan") as PlanId) in STRIPE_PLANS ? (params.get("plan") as PlanId) : "basic");
  const [fullName, setFullName] = useState(params.get("name") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (!isLoading && user) {
    return <Navigate to={inviteCode ? `/invite/${inviteCode}` : homePathFor(currentRole)} replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("La contraseña debe tener al menos 8 caracteres");
    setBusy(true);
    const redirect = inviteCode ? `${window.location.origin}/invite/${inviteCode}` : `${window.location.origin}/login`;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirect,
        data: { full_name: fullName.trim(), phone: phone.trim() || null, role, plan: role === "landlord" ? plan : null },
      },
    });
    setBusy(false);
    if (error) {
      if (/already registered/i.test(error.message)) return toast.error("Ese correo ya tiene cuenta. Inicia sesión.");
      return toast.error(error.message);
    }
    if (data.user && data.user.identities?.length === 0) {
      return toast.error("Ese correo ya tiene cuenta. Inicia sesión.");
    }
    if (!data.session) setSentTo(email.trim());
  };

  if (sentTo) {
    return (
      <AuthShell title="Revisa tu correo">
        <div className="flex flex-col items-center gap-4 text-center">
          <MailCheck className="h-12 w-12 text-primary" />
          <p>
            Enviamos un enlace de confirmación a <strong>{sentTo}</strong>. Ábrelo para activar tu cuenta
            {inviteCode ? " y conectarte con tu vivienda." : "."}
          </p>
          <p className="text-sm text-muted-foreground">Si no lo ves, revisa la carpeta de spam.</p>
          <Button asChild variant="outline"><Link to="/login">Ir a iniciar sesión</Link></Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={inviteCode ? "Paso 1: crea tu cuenta" : "Crea tu cuenta"}
      subtitle={inviteCode ? "Tu arrendador te invitó a BeMyGuest" : "Prueba gratis 14 días, sin tarjeta"}
    >
      <form onSubmit={submit} className="space-y-5">
        {!inviteCode && (
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: "landlord", label: "Soy propietario", icon: Building2 },
              { value: "tenant", label: "Soy inquilino", icon: User },
            ] as const).map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => setRole(value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition",
                  role === value ? "border-primary bg-secondary ring-2 ring-primary" : "hover:bg-muted",
                )}
              >
                <Icon className="h-6 w-6" />
                {label}
              </button>
            ))}
          </div>
        )}

        {role === "tenant" && !inviteCode && (
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            Para conectarte con tu vivienda, pide a tu arrendador el enlace de invitación. También puedes crear tu cuenta ahora y abrir el enlace después.
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
        </div>

        {role === "landlord" && (
          <div className="space-y-2">
            <Label>Plan (empiezas con 14 días gratis)</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {(Object.keys(STRIPE_PLANS) as PlanId[]).map((id) => {
                const p = STRIPE_PLANS[id];
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setPlan(id)}
                    className={cn(
                      "rounded-lg border p-3 text-left text-sm transition",
                      plan === id ? "border-primary bg-secondary ring-2 ring-primary" : "hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      {p.name} {plan === id && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="text-muted-foreground">${p.price} MXN/mes</div>
                    <div className="text-xs text-muted-foreground">{p.features[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link to={inviteCode ? `/login?next=/invite/${inviteCode}` : "/login"} className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthShell>
  );
};

export default SignUp;
