export const formatMoney = (n: number | string | null | undefined) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n ?? 0));

export const formatDate = (d: string | null | undefined) =>
  d ? new Date(d.length === 10 ? `${d}T12:00:00` : d).toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Mexico_City" }) : "—";

export const errorMessage = (e: unknown) =>
  e && typeof e === "object" && "message" in e ? String((e as { message: string }).message) : "Ocurrió un error, intenta de nuevo";

export const PAYMENT_CATEGORIES: Record<string, { label: string; kind: "income" | "expense" }> = {
  rent: { label: "Pago de renta", kind: "income" },
  deposit: { label: "Depósito", kind: "income" },
  services: { label: "Pago de servicios", kind: "expense" },
  maintenance: { label: "Mantenimiento", kind: "expense" },
  humidity: { label: "Humedad", kind: "expense" },
  waterproofing: { label: "Impermeabilización", kind: "expense" },
  plumbing: { label: "Tuberías", kind: "expense" },
  other_income: { label: "Otro ingreso", kind: "income" },
  other_expense: { label: "Otro gasto", kind: "expense" },
};

export const PAYMENT_METHODS: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  check: "Cheque",
  card: "Tarjeta",
};

export const ISSUE_STATUS: Record<string, string> = {
  open: "Reportado",
  reviewing: "En revisión",
  approved: "Aprobado",
  in_progress: "En proceso",
  resolved: "Resuelto",
};

export const ISSUE_PRIORITY: Record<string, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

export const inviteLink = (code: string) => `${window.location.origin}/invite/${code}`;
