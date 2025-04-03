
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, MessageSquare, Check, Calendar, Image, User, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isLandlord = user?.role === "landlord";

  const landlordLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Properties", path: "/properties", icon: <Image size={20} /> },
    { name: "Tenants", path: "/tenants", icon: <User size={20} /> },
    { name: "Payments", path: "/payments", icon: <Calendar size={20} /> },
    { name: "Issues", path: "/issues", icon: <Check size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const tenantLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Payments", path: "/payments", icon: <Calendar size={20} /> },
    { name: "Report Issue", path: "/report-issue", icon: <Plus size={20} /> },
    { name: "My Issues", path: "/issues", icon: <Check size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const links = isLandlord ? landlordLinks : tenantLinks;

  return (
    <aside className="w-16 md:w-64 bg-white border-r shrink-0">
      <div className="h-full px-3 py-6 flex flex-col">
        <div className="mb-6 flex justify-center md:justify-start">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-bmg-500 text-white h-8 w-8 md:h-10 md:w-10 rounded-md flex items-center justify-center font-bold text-lg">
              BG
            </div>
            <h1 className="text-xl font-heading font-bold text-bmg-800 hidden md:block">
              BeMyGuest
            </h1>
          </Link>
        </div>

        <nav className="space-y-1 flex-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "nav-link",
                pathname === link.path && "active"
              )}
            >
              <span className="min-w-[20px]">{link.icon}</span>
              <span className="hidden md:block">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-6 mt-6 border-t">
          <div className="flex items-center justify-center md:justify-start px-3">
            <Button variant="outline" className="w-full">
              <span className="min-w-[20px] mr-0 md:mr-2">
                <User size={18} />
              </span>
              <span className="hidden md:block">Help & Support</span>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
