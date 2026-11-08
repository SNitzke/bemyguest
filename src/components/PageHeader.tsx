import React from "react";

const PageHeader: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="font-heading text-2xl font-semibold md:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
    {action}
  </div>
);

export const EmptyState: React.FC<{ icon: React.ElementType; title: string; text?: string; action?: React.ReactNode }> = ({
  icon: Icon,
  title,
  text,
  action,
}) => (
  <div className="flex flex-col items-center rounded-xl border border-dashed bg-card p-10 text-center">
    <Icon className="mb-3 h-10 w-10 text-muted-foreground" />
    <p className="font-medium">{title}</p>
    {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default PageHeader;
