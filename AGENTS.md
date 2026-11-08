# BeMyGuest – technical rules

- Backend is Lovable Cloud; all data access goes through the Supabase client with RLS — never trust the client for ownership checks.
- Roles live only in `user_roles` (landlord/tenant), set by the signup trigger or `accept_invitation`; never read roles from user metadata in the UI.
- Landlord trial/plan state lives in `subscriptions`, writable only by service role (signup trigger and the `check-subscription` function); property limits and expired trials are enforced by a DB trigger, not UI.
- Tenants are linked to properties only through `tenancies`, created by the `accept_invitation` RPC; invitation lookup for signed-out visitors uses the `get_invitation` RPC.
- Messaging is allowed only between parties of an active tenancy (`shares_tenancy`), so chat contacts are derived from tenancies.
- Data fetching uses react-query hooks in `src/hooks/useData.ts`; invalidate the matching query key after writes.
- Plan prices, limits and Stripe IDs come from `src/config/stripe.ts`; keep `plan_property_limit` in SQL in sync with it.
