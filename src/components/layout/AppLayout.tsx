import React from "react";
import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Building2, CalendarClock, CreditCard, Home, LogOut, MessageSquare, Settings, Users, Wrench, FileText, ChartNoAxesCombined, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { homePathFor, useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import TrialBanner from "./TrialBanner";
import { useIssues } from "@/hooks/useData";
import NotificationsBell from "@/components/rental/NotificationsBell";
import { useUnreadMessages } from "@/hooks/useRental";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const landlordLinks = [
  { name: "Inicio", path: "/landlord-profile", icon: Home },
  { name: "Propiedades", path: "/properties", icon: Building2 },
  { name: "Inquilinos", path: "/tenants", icon: Users },
  { name: "Pagos", path: "/payments", icon: CreditCard },
  { name: "Contratos", path: "/contracts", icon: FileText },
  { name: "Reportes", path: "/reports", icon: ChartNoAxesCombined },
  { name: "Reparaciones", path: "/issues", icon: Wrench },
  { name: "Calendario", path: "/maintenance", icon: CalendarClock },
  { name: "Mensajes", path: "/messages", icon: MessageSquare },
  { name: "Configuración", path: "/settings", icon: Settings },
];

const tenantLinks = [
  { name: "Inicio", path: "/dashboard", icon: Home },
  { name: "Contrato y documentos", path: "/contracts", icon: FileText },
  { name: "Reparaciones", path: "/issues", icon: Wrench },
  { name: "Mensajes", path: "/messages", icon: MessageSquare },
  { name: "Pagos", path: "/payments", icon: CreditCard },
  { name: "Configuración", path: "/settings", icon: Settings },
  { name: "Calendario", path: "/maintenance", icon: CalendarClock },
];

export const FullPageSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const AppLayout: React.FC = () => {
  const { user, role, profile, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: issues = [] } = useIssues();
  const { data: unreadMessages = 0 } = useUnreadMessages();
  const openIssues = role === "landlord" ? issues.filter((i) => i.status !== "resolved" && i.status !== "closed").length : 0;
  const badge = (path: string) =>
    ((path === "/issues" && openIssues > 0) || (path === "/messages" && unreadMessages > 0)) ? (
      <span className="ml-auto rounded-full bg-destructive px-1.5 text-[10px] font-bold leading-4 text-destructive-foreground">{path === "/issues" ? openIssues : unreadMessages}</span>
    ) : null;

  if (isLoading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  const links = role === "landlord" ? landlordLinks : tenantLinks;
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <Link to={homePathFor(role)} className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary font-heading font-bold text-sidebar-primary-foreground">
            BG
          </div>
          <span className="font-heading text-lg font-semibold">BeMyGuest</span>
        </Link>
        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {name}
              {badge(path)}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <p className="truncate text-sm font-medium">{profile?.full_name || user.email}</p>
          <p className="mb-3 text-xs opacity-70">{role === "landlord" ? "Propietario" : "Inquilino"}</p>
          <Button variant="secondary" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <header className="flex items-center justify-between border-b bg-card px-4 py-3">
          <div className="flex items-center gap-2"><Sheet><SheetTrigger asChild><Button size="icon" variant="ghost" className="md:hidden" aria-label="Abrir menú"><Menu className="h-5 w-5" /></Button></SheetTrigger><SheetContent side="left"><nav className="mt-6 space-y-2">{links.map(({name,path,icon:Icon})=><NavLink key={path} to={path} className="flex items-center gap-3 rounded-md p-3 hover:bg-muted"><Icon className="h-4 w-4"/>{name}{badge(path)}</NavLink>)}<Button asChild variant="outline"><Link to="/pricing">Planes</Link></Button></nav></SheetContent></Sheet><span className="font-heading font-semibold">BeMyGuest</span></div>
          <NotificationsBell />
          <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Cerrar sesión">
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-card py-2 md:hidden">
        {links.slice(0, 5).map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn("flex flex-col items-center gap-0.5 px-2 text-[11px]", isActive ? "text-primary" : "text-muted-foreground")
            }
          >
            <span className="relative">
              <Icon className="h-5 w-5" />
              {badge(path) && <span className="absolute -right-2 -top-1">{badge(path)}</span>}
            </span>
            {name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
