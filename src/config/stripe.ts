// Stripe subscription plans configuration
export const STRIPE_PLANS = {
  free: {
    id: 'free', name: 'Gratis', price_id: '', product_id: '', price: 0,
    currency: 'MXN', interval: 'month', maxProperties: 1,
    features: ['1 propiedad', 'Contratos y pagos', 'Reparaciones y mensajes', 'Recordatorios por correo'],
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price_id: 'price_1SslQsDUpT7yliasbhJGV8IZ',
    product_id: 'prod_TqSL2kzvgCM3Nh',
    price: 299,
    currency: 'MXN',
    interval: 'month',
    maxProperties: 5,
    features: [
      'Hasta 5 propiedades',
      'Gestión de inquilinos',
      'Reportes básicos',
      'Soporte por email',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price_id: 'price_1SslRCDUpT7yliasi6M5rEBJ',
    product_id: 'prod_TqSLdRAmujp1F8',
    price: 599,
    currency: 'MXN',
    interval: 'month',
    maxProperties: 1000000,
    features: [
      'Propiedades ilimitadas',
      'Gestión de inquilinos',
      'Reportes avanzados',
      'Soporte prioritario',
      'Recordatorios automáticos',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price_id: 'price_1SslRWDUpT7ylias7A72EcCe',
    product_id: 'prod_TqSMI3sGbfMOZz',
    price: 999,
    currency: 'MXN',
    interval: 'month',
    maxProperties: 999999,
    features: [
      'Propiedades ilimitadas',
      'Gestión de inquilinos',
      'Reportes avanzados',
      'Soporte 24/7',
      'Recordatorios automáticos',
      'API personalizada',
      'Marca blanca',
    ],
  },
} as const;
// New Pro pricing is deliberately unset until commercial terms are confirmed.
export const PRO_MONTHLY_PRICE: number | null = null;
export const PUBLIC_PLANS = ['free', 'pro'] as const;

export type PlanId = keyof typeof STRIPE_PLANS;
export type StripePlan = typeof STRIPE_PLANS[PlanId];
