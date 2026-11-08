import React from "react";
import { Link } from "react-router-dom";

const AuthShell: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-secondary px-4 py-10">
    <Link to="/" className="mb-6 flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary font-heading font-bold text-primary-foreground">BG</div>
      <span className="font-heading text-xl font-semibold">BeMyGuest</span>
    </Link>
    <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-sm md:p-8">
      <h1 className="font-heading text-2xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  </div>
);

export default AuthShell;
