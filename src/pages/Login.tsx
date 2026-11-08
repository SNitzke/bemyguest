import React, { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { homePathFor, useAuth } from "@/contexts/AuthContext";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const translate = (msg: string) => {
  if (/invalid login credentials/i.test(msg)) return "Correo o contraseña incorrectos.";
  if (/email not confirmed/i.test(msg)) return "Primero confirma tu correo: revisa tu bandeja de entrada (y spam).";
  return msg;
};

const Login = () => {
  const { user, role, isLoading } = useAuth();
  const [params] = useSearchParams();
  const next = params.get("next");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isLoading && user) return <Navigate to={next?.startsWith("/") ? next : homePathFor(role)} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return toast.error(translate(error.message));
    toast.success("¡Bienvenido de nuevo!");
    if (next?.startsWith("/")) navigate(next);
  };

  const forgot = async () => {
    if (!email) return toast.error("Escribe tu correo primero");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return toast.error(error.message);
    toast.success("Te enviamos un correo para restablecer tu contraseña");
  };

  return (
    <AuthShell title="Iniciar sesión" subtitle="Entra con tu correo y contraseña">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <button type="button" onClick={forgot} className="text-xs text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
