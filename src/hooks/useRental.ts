import {useQuery,useQueryClient} from '@tanstack/react-query';
import {supabase} from '@/integrations/supabase/client';
import {useAuth} from '@/contexts/AuthContext';
import {useTenancies} from './useData';
export function useRental() {
 const {user}=useAuth(); const {data:tenancies=[]}=useTenancies();
 return useQuery({queryKey:['rental',user?.id,tenancies.map(t=>t.id).join(',')],enabled:!!user,refetchInterval:15000,queryFn:async()=>{
  for(const t of tenancies){const result=await supabase.rpc('generate_rent_charges',{_tenancy:t.id}); if(result.error) throw result.error;}
  const [charges,expenses,credits]=await Promise.all([supabase.from('rent_charges').select('*').order('due_on'),supabase.from('rental_expenses').select('*').order('paid_on',{ascending:false}),supabase.from('credit_allocations').select('*')]);
  if(charges.error||expenses.error||credits.error) throw charges.error||expenses.error||credits.error;
  return {charges:charges.data??[],expenses:expenses.data??[],credits:credits.data??[]};
 }});
}
export function useRefreshRental(){const qc=useQueryClient();return ()=>{for(const key of ['rental','payments','contracts','notifications','issues','maintenance','tenancies'])qc.invalidateQueries({queryKey:[key]});};}
export function useNotifications(){const {user}=useAuth();return useQuery({queryKey:['notifications',user?.id],enabled:!!user,refetchInterval:15000,queryFn:async()=>{const {data,error}=await supabase.from('notifications').select('*').order('created_at',{ascending:false}).limit(100);if(error)throw error;return data;}});}
export function useUnreadMessages(){const {user}=useAuth();return useQuery({queryKey:['unread',user?.id],enabled:!!user,refetchInterval:10000,queryFn:async()=>{if(!user)return 0;const {count,error}=await supabase.from('messages').select('id',{count:'exact',head:true}).eq('recipient_id',user.id).is('read_at',null);if(error)throw error;return count??0;}});}
