import React from "react";
import { Navigate } from "react-router-dom";
import { homePathFor, Role, useAuth } from "@/contexts/AuthContext";

const RoleRoute: React.FC<{ role: Role; children: React.ReactNode }> = ({ role, children }) => {
  const { role: current } = useAuth();
  if (current !== role) return <Navigate to={homePathFor(current)} replace />;
  return <>{children}</>;
};

export default RoleRoute;
