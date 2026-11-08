
CREATE TYPE public.app_role AS ENUM ('landlord', 'tenant');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text,
  bio text,
  emergency_contact text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- SUBSCRIPTIONS (landlords only; read-only for users)
CREATE TABLE public.subscriptions (
  user_id uuid PRIMARY KEY,
  plan text NOT NULL DEFAULT 'basic',
  status text NOT NULL DEFAULT 'trialing',
  trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  current_period_end timestamptz,
  stripe_customer_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER subscriptions_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.plan_property_limit(_plan text)
RETURNS integer LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE _plan WHEN 'basic' THEN 5 WHEN 'pro' THEN 20 WHEN 'premium' THEN 1000000 ELSE 0 END
$$;

CREATE OR REPLACE FUNCTION public.landlord_has_access(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s WHERE s.user_id = _user_id
      AND (s.status = 'active' OR (s.status = 'trialing' AND s.trial_ends_at > now()))
  )
$$;

-- PROPERTIES
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  city text,
  rent_amount numeric(12,2) NOT NULL DEFAULT 0,
  bedrooms integer,
  bathrooms numeric(3,1),
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX properties_landlord_idx ON public.properties(landlord_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER properties_updated BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TENANCIES (tenant <-> property)
CREATE TABLE public.tenancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  landlord_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  rent_amount numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  start_date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_id, tenant_id)
);
CREATE INDEX tenancies_tenant_idx ON public.tenancies(tenant_id);
CREATE INDEX tenancies_landlord_idx ON public.tenancies(landlord_id);
GRANT SELECT, UPDATE, DELETE ON public.tenancies TO authenticated;
GRANT ALL ON public.tenancies TO service_role;
ALTER TABLE public.tenancies ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER tenancies_updated BEFORE UPDATE ON public.tenancies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.is_tenant_of(_user_id uuid, _property_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.tenancies WHERE tenant_id = _user_id AND property_id = _property_id AND status = 'active')
$$;

CREATE OR REPLACE FUNCTION public.shares_tenancy(_a uuid, _b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.tenancies t WHERE t.status = 'active'
    AND ((t.landlord_id = _a AND t.tenant_id = _b) OR (t.landlord_id = _b AND t.tenant_id = _a)))
$$;

-- property policies
CREATE POLICY "Landlords read own properties" ON public.properties FOR SELECT TO authenticated
  USING (landlord_id = auth.uid() OR public.is_tenant_of(auth.uid(), id));
CREATE POLICY "Landlords add properties" ON public.properties FOR INSERT TO authenticated
  WITH CHECK (landlord_id = auth.uid() AND public.has_role(auth.uid(), 'landlord'));
CREATE POLICY "Landlords edit own properties" ON public.properties FOR UPDATE TO authenticated
  USING (landlord_id = auth.uid()) WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords delete own properties" ON public.properties FOR DELETE TO authenticated
  USING (landlord_id = auth.uid());

-- plan limit enforcement
CREATE OR REPLACE FUNCTION public.enforce_property_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _plan text; _count int;
BEGIN
  IF NOT public.landlord_has_access(NEW.landlord_id) THEN
    RAISE EXCEPTION 'Tu prueba gratuita terminó. Elige un plan para seguir agregando propiedades.';
  END IF;
  SELECT plan INTO _plan FROM public.subscriptions WHERE user_id = NEW.landlord_id;
  SELECT count(*) INTO _count FROM public.properties WHERE landlord_id = NEW.landlord_id;
  IF _count >= public.plan_property_limit(_plan) THEN
    RAISE EXCEPTION 'Llegaste al límite de propiedades de tu plan. Cambia de plan para agregar más.';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER properties_limit BEFORE INSERT ON public.properties FOR EACH ROW EXECUTE FUNCTION public.enforce_property_limit();

-- tenancy policies
CREATE POLICY "Parties read tenancies" ON public.tenancies FOR SELECT TO authenticated
  USING (landlord_id = auth.uid() OR tenant_id = auth.uid());
CREATE POLICY "Landlords update tenancies" ON public.tenancies FOR UPDATE TO authenticated
  USING (landlord_id = auth.uid()) WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords remove tenancies" ON public.tenancies FOR DELETE TO authenticated
  USING (landlord_id = auth.uid());

-- profile policies (own, plus the other party of a tenancy)
CREATE POLICY "Read own or connected profiles" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.shares_tenancy(auth.uid(), id));
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Insert own profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- INVITATIONS
CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  landlord_id uuid NOT NULL,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_name text NOT NULL,
  tenant_email text NOT NULL,
  rent_amount numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  accepted_by uuid,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.invitations TO authenticated;
GRANT ALL ON public.invitations TO service_role;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlords read own invitations" ON public.invitations FOR SELECT TO authenticated USING (landlord_id = auth.uid());
CREATE POLICY "Landlords create invitations" ON public.invitations FOR INSERT TO authenticated
  WITH CHECK (landlord_id = auth.uid() AND EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.landlord_id = auth.uid()));
CREATE POLICY "Landlords delete invitations" ON public.invitations FOR DELETE TO authenticated USING (landlord_id = auth.uid());

-- Public lookup of an invitation by code (only safe fields)
CREATE OR REPLACE FUNCTION public.get_invitation(_code text)
RETURNS TABLE (tenant_name text, tenant_email text, rent_amount numeric, status text,
  property_name text, property_address text, property_city text, landlord_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT i.tenant_name, i.tenant_email, i.rent_amount, i.status, p.name, p.address, p.city, pr.full_name
  FROM public.invitations i
  JOIN public.properties p ON p.id = i.property_id
  LEFT JOIN public.profiles pr ON pr.id = i.landlord_id
  WHERE i.code = _code
$$;
GRANT EXECUTE ON FUNCTION public.get_invitation(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.accept_invitation(_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _inv public.invitations; _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Debes iniciar sesión'; END IF;
  SELECT * INTO _inv FROM public.invitations WHERE code = _code FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Invitación no encontrada'; END IF;
  IF _inv.status = 'accepted' AND _inv.accepted_by <> _uid THEN RAISE EXCEPTION 'Esta invitación ya fue usada'; END IF;
  IF _inv.landlord_id = _uid THEN RAISE EXCEPTION 'No puedes aceptar tu propia invitación'; END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (_uid, 'tenant') ON CONFLICT DO NOTHING;
  INSERT INTO public.tenancies(property_id, landlord_id, tenant_id, rent_amount)
    VALUES (_inv.property_id, _inv.landlord_id, _uid, _inv.rent_amount)
    ON CONFLICT (property_id, tenant_id) DO UPDATE SET status = 'active';
  UPDATE public.invitations SET status = 'accepted', accepted_by = _uid, accepted_at = now() WHERE id = _inv.id;
  RETURN _inv.property_id;
END; $$;
REVOKE EXECUTE ON FUNCTION public.accept_invitation(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.accept_invitation(text) TO authenticated;

-- ISSUES
CREATE TABLE public.issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  landlord_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER issues_updated BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Parties read issues" ON public.issues FOR SELECT TO authenticated USING (landlord_id = auth.uid() OR tenant_id = auth.uid());
CREATE POLICY "Tenants report issues" ON public.issues FOR INSERT TO authenticated
  WITH CHECK (tenant_id = auth.uid() AND public.is_tenant_of(auth.uid(), property_id)
    AND landlord_id = (SELECT p.landlord_id FROM public.properties p WHERE p.id = property_id));
CREATE POLICY "Landlords update issues" ON public.issues FOR UPDATE TO authenticated
  USING (landlord_id = auth.uid()) WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords delete issues" ON public.issues FOR DELETE TO authenticated USING (landlord_id = auth.uid());

-- MESSAGES
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX messages_pair_idx ON public.messages(sender_id, recipient_id, created_at);
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties read messages" ON public.messages FOR SELECT TO authenticated USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Send to connected users" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.shares_tenancy(auth.uid(), recipient_id));
CREATE POLICY "Recipient marks read" ON public.messages FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid()) WITH CHECK (recipient_id = auth.uid());
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- PAYMENTS (manually recorded by landlords)
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  tenant_id uuid,
  category text NOT NULL DEFAULT 'rent',
  kind text NOT NULL DEFAULT 'income',
  method text NOT NULL DEFAULT 'transfer',
  amount numeric(12,2) NOT NULL,
  paid_on date NOT NULL DEFAULT current_date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties read payments" ON public.payments FOR SELECT TO authenticated USING (landlord_id = auth.uid() OR tenant_id = auth.uid());
CREATE POLICY "Landlords record payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (landlord_id = auth.uid() AND public.has_role(auth.uid(), 'landlord'));
CREATE POLICY "Landlords edit payments" ON public.payments FOR UPDATE TO authenticated USING (landlord_id = auth.uid()) WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords delete payments" ON public.payments FOR DELETE TO authenticated USING (landlord_id = auth.uid());

-- NEW USER SETUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _role text := coalesce(NEW.raw_user_meta_data->>'role', 'tenant');
        _plan text := coalesce(NEW.raw_user_meta_data->>'plan', 'basic');
BEGIN
  INSERT INTO public.profiles(id, full_name, email, phone)
  VALUES (NEW.id, coalesce(NEW.raw_user_meta_data->>'full_name', ''), coalesce(NEW.email, ''), NEW.raw_user_meta_data->>'phone');
  IF _role = 'landlord' THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'landlord');
    IF _plan NOT IN ('basic','pro','premium') THEN _plan := 'basic'; END IF;
    INSERT INTO public.subscriptions(user_id, plan) VALUES (NEW.id, _plan);
  ELSE
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'tenant');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
