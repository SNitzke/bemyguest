import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { homePathFor, useAuth } from "@/contexts/AuthContext";
import { STRIPE_PLANS, PlanId } from "@/config/stripe";
import { errorMessage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Pricing = () => {
  const { user, role, subscription, refresh } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (params.get("canceled")) toast.message("Pago cancelado");
  }, [params]);

  const choose = async (id: PlanId) => {
    if (!user) return navigate(`/signup?role=landlord&plan=${id}`);
    if (role !== "landlord") return toast.error("Solo los propietarios pagan un plan. Para inquilinos es gratis.");
    setLoading(id);
    const { data, error } = await supabase.functions.invoke("create-checkout", { body: { priceId: STRIPE_PLANS[id].price_id, planName: id } });
    setLoading(null);
    if (error || data?.error) return toast.error(data?.error ?? errorMessage(error));
    window.location.href = data.url;
  };

  const portal = async () => {
    setLoading("portal");
    const { data, error } = await supabase.functions.invoke("customer-portal");
    setLoading(null);
    if (error || data?.error) return toast.error(data?.error ?? errorMessage(error));
    window.location.href = data.url;
  };

  const sync = async () => {
    setLoading("sync");
    const { error } = await supabase.functions.invoke("check-subscription");
    await refresh();
    setLoading(null);
    if (error) return toast.error(errorMessage(error));
    toast.success("Estado del plan actualizado");
  };

  return (
    <div className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link to={user ? homePathFor(role) : "/"} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Volver
        </Link>
        <div className="my-8 text-center">
          <h1 className="font-heading text-3xl font-semibold md:text-4xl">Planes para propietarios</h1>
          <p className="mt-2 text-muted-foreground">14 días gratis para probar todo. Los inquilinos usan BeMyGuest sin costo.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {(Object.keys(STRIPE_PLANS) as PlanId[]).map((id) => {
            const p = STRIPE_PLANS[id];
            const current = subscription?.plan === id;
            return (
              <Card key={id} className={cn("flex flex-col", id === "pro" && "border-primary ring-2 ring-primary")}>
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <p className="font-heading text-3xl font-semibold">${p.price}<span className="text-base font-normal text-muted-foreground"> MXN/mes</span></p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm">
                    {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" /> {f}</li>)}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={id === "pro" ? "default" : "outline"} disabled={!!loading} onClick={() => choose(id)}>
                    {loading === id ? "Abriendo pago..." : !user ? "Empezar prueba gratis" : current && subscription?.status === "active" ? "Plan actual" : `Pagar ${p.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        {role === "landlord" && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="ghost" onClick={sync} disabled={!!loading}>Ya pagué, actualizar mi plan</Button>
            {subscription?.status === "active" && <Button variant="outline" onClick={portal} disabled={!!loading}>Administrar suscripción</Button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
