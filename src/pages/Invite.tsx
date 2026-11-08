import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Home, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage, formatMoney } from "@/lib/format";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { FullPageSpinner } from "@/components/layout/AppLayout";

const Steps = ({ current }: { current: number }) => (
  <ol className="mb-6 flex items-center gap-2 text-xs">
    {["Crear cuenta", "Confirmar vivienda", "Completar perfil"].map((s, i) => (
      <li key={s} className="flex flex-1 items-center gap-2">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            i + 1 <= current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {i + 1}
        </span>
        <span className={i + 1 === current ? "font-medium" : "text-muted-foreground"}>{s}</span>
      </li>
    ))}
  </ol>
);

const Invite = () => {
  const { code = "" } = useParams();
  const { user, isLoading, refresh, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const { data: invite, isLoading: loadingInvite } = useQuery({
    queryKey: ["invite", code],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_invitation", { _code: code });
      if (error) throw error;
      return data?.[0] ?? null;
    },
  });

  if (isLoading || loadingInvite) return <FullPageSpinner />;

  if (!invite) {
    return (
      <AuthShell title="Invitación no válida">
        <p className="text-muted-foreground">Este enlace no existe o fue eliminado. Pide a tu arrendador uno nuevo.</p>
        <Button asChild className="mt-6"><Link to="/">Ir al inicio</Link></Button>
      </AuthShell>
    );
  }

  const propertyCard = (
    <div className="rounded-lg border bg-secondary p-4">
      <div className="flex items-center gap-2 font-semibold"><Home className="h-4 w-4" /> {invite.property_name}</div>
      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" /> {invite.property_address}{invite.property_city ? `, ${invite.property_city}` : ""}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Renta mensual</span><div className="font-semibold">{formatMoney(invite.rent_amount)}</div></div>
        <div><span className="text-muted-foreground">Arrendador</span><div className="font-semibold">{invite.landlord_name || "—"}</div></div>
      </div>
    </div>
  );

  // Step 1: no account yet
  if (!user) {
    const qs = new URLSearchParams({ invite: code, name: invite.tenant_name, email: invite.tenant_email });
    return (
      <AuthShell title={`Hola, ${invite.tenant_name}`} subtitle="Tu arrendador te invitó a BeMyGuest">
        <Steps current={1} />
        {propertyCard}
        <p className="mt-4 text-sm">Primero deberás crear una cuenta. Después confirmarás que esta es la vivienda que acordaron.</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1"><Link to={`/signup?${qs}`}>Crear mi cuenta</Link></Button>
          <Button asChild variant="outline" className="flex-1"><Link to={`/login?next=/invite/${code}`}>Ya tengo cuenta</Link></Button>
        </div>
      </AuthShell>
    );
  }

  if (invite.status === "accepted") {
    return (
      <AuthShell title="Invitación aceptada">
        <p className="text-muted-foreground">Esta vivienda ya está conectada a una cuenta.</p>
        <Button className="mt-6" onClick={() => navigate("/dashboard")}>Ir a mi vivienda</Button>
      </AuthShell>
    );
  }

  const accept = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("accept_invitation", { _code: code });
    setBusy(false);
    if (error) return toast.error(errorMessage(error));
    await refresh();
    toast.success("¡Listo! Ya estás conectado con tu vivienda");
    navigate("/settings?welcome=1");
  };

  // Step 2: confirm property
  return (
    <AuthShell title="Paso 2: confirma tu vivienda" subtitle="Revisa que sea la vivienda que acordaste con tu arrendador">
      <Steps current={2} />
      {propertyCard}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" onClick={accept} disabled={busy}>
          <CheckCircle2 className="mr-2 h-4 w-4" /> {busy ? "Conectando..." : "Sí, es mi vivienda"}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={async () => {
            await signOut();
            toast.message("Cerraste sesión. Abre el enlace con la cuenta correcta.");
          }}
        >
          Usar otra cuenta
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Si los datos no son correctos, contacta a tu arrendador antes de aceptar.</p>
    </AuthShell>
  );
};

export default Invite;
