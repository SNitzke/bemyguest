import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Building2, Plus, UserPlus, Users, Wallet, Wrench } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIssues, usePayments, useProperties, useTenancies } from "@/hooks/useData";
import { formatMoney } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import PropertyFormDialog from "@/components/landlord/PropertyFormDialog";
import InviteTenantDialog from "@/components/landlord/InviteTenantDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Stat = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <Card>
    <CardContent className="flex items-center gap-4 p-5">
      <div className="rounded-lg bg-secondary p-3 text-primary"><Icon className="h-5 w-5" /></div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-heading text-xl font-semibold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const LandlordHome = () => {
  const { profile, user } = useAuth();
  const { data: properties = [] } = useProperties();
  const { data: tenancies = [] } = useTenancies();
  const { data: issues = [] } = useIssues();
  const { data: payments = [] } = usePayments();
  const [addOpen, setAddOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const myTenancies = tenancies.filter((t) => t.landlord_id === user?.id && t.status === "active");
  const openIssues = issues.filter((i) => i.status !== "resolved").length;
  const month = new Date().toISOString().slice(0, 7);
  const monthIncome = payments.filter((p) => p.kind === "income" && p.paid_on.startsWith(month)).reduce((s, p) => s + Number(p.amount), 0);

  const chart = useMemo(() => {
    const months: { key: string; label: string; Ingresos: number; Gastos: number }[] = [];
    const d = new Date();
    for (let i = 5; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      months.push({ key: m.toISOString().slice(0, 7), label: m.toLocaleDateString("es-MX", { month: "short" }), Ingresos: 0, Gastos: 0 });
    }
    payments.forEach((p) => {
      const row = months.find((m) => p.paid_on.startsWith(m.key));
      if (!row) return;
      if (p.kind === "income") row.Ingresos += Number(p.amount);
      else row.Gastos += Number(p.amount);
    });
    return months;
  }, [payments]);

  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div>
      <PageHeader
        title={firstName ? `Hola, ${firstName}` : "Tu panel"}
        description="Resumen de tus propiedades"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setInviteOpen(true)} disabled={!properties.length}>
              <UserPlus className="mr-2 h-4 w-4" /> Invitar inquilino
            </Button>
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Propiedad</Button>
          </div>
        }
      />

      {properties.length === 0 && (
        <Card className="mb-6 border-primary/40 bg-secondary">
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Empieza agregando tu primera propiedad</p>
              <p className="text-sm text-muted-foreground">Después podrás invitar a tu inquilino con un enlace.</p>
            </div>
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Agregar propiedad</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Building2} label="Propiedades" value={properties.length} />
        <Stat icon={Users} label="Inquilinos activos" value={myTenancies.length} />
        <Stat icon={Wallet} label="Ingresos del mes" value={formatMoney(monthIncome)} />
        <Stat icon={Wrench} label="Reparaciones abiertas" value={openIssues} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Ingresos y gastos (6 meses)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip formatter={(v: number) => formatMoney(v)} />
                <Legend />
                <Bar dataKey="Ingresos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Gastos" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Tus propiedades</CardTitle>
            <Link to="/properties" className="text-sm text-primary hover:underline">Ver todas</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {properties.slice(0, 5).map((p) => {
              const t = myTenancies.find((x) => x.property_id === p.id);
              return (
                <Link key={p.id} to={`/properties/${p.id}`} className="block rounded-md border p-3 hover:bg-muted">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{t ? `Inquilino: ${t.tenant?.full_name || "—"}` : "Sin inquilino"} · {formatMoney(p.rent_amount)}</p>
                </Link>
              );
            })}
            {!properties.length && <p className="text-sm text-muted-foreground">Aún no tienes propiedades.</p>}
          </CardContent>
        </Card>
      </div>

      <PropertyFormDialog open={addOpen} onOpenChange={setAddOpen} />
      <InviteTenantDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
};

export default LandlordHome;
