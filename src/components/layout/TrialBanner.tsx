import { Link } from "react-router-dom";
import { hasLandlordAccess, trialDaysLeft, useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const TrialBanner = () => {
  const { subscription } = useAuth();
  if (!subscription || subscription.status === "active") return null;
  const days = trialDaysLeft(subscription);
  const active = hasLandlordAccess(subscription);

  return (
    <div className={active ? "bg-secondary text-secondary-foreground" : "bg-destructive text-destructive-foreground"}>
      <div className="flex flex-col items-start justify-between gap-2 px-4 py-2 text-sm sm:flex-row sm:items-center md:px-8">
        <span>
          {active
            ? `Prueba gratuita: te quedan ${days} ${days === 1 ? "día" : "días"}.`
            : "Tu prueba gratuita terminó. Elige un plan para seguir agregando propiedades."}
        </span>
        <Button asChild size="sm" variant={active ? "default" : "secondary"}>
          <Link to="/pricing">Ver planes</Link>
        </Button>
      </div>
    </div>
  );
};

export default TrialBanner;
