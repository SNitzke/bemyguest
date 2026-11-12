import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Message, useTenancies } from "@/hooks/useData";
import { cn } from "@/lib/utils";
import { errorMessage } from "@/lib/format";
import PageHeader, { EmptyState } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Messages = () => {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const qc = useQueryClient();
  const { data: tenancies = [] } = useTenancies();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // contacts = the other party in each active tenancy
  const contacts = useMemo(() => {
    const map = new Map<string, { id: string; person: string; name: string; subtitle: string }>();
    tenancies
      .filter((t) => t.status === "active")
      .forEach((t) => {
        const isLandlord = t.landlord_id === user?.id;
        const other = isLandlord ? t.tenant : t.landlord;
        const id = isLandlord ? t.tenant_id : t.landlord_id;
        map.set(t.id, { id: t.id, person: id, name: other?.full_name || other?.email || "Contacto", subtitle: t.property?.name ?? "" });
      });
    return Array.from(map.values());
  }, [tenancies, user?.id]);

  const selected = params.get("contract") || contacts.find(c=>c.person===params.get("to"))?.id || contacts[0]?.id || null;

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", user?.id],
    enabled: !!user,
    refetchInterval: 10000,
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at");
      if (error) throw error;
      return data as Message[];
    },
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`messages-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () =>
        qc.invalidateQueries({ queryKey: ["messages", user.id] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, qc]);

  const thread = messages.filter(
    (m) => m.tenancy_id === selected,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    const unread = thread.filter((m) => m.recipient_id === user?.id && !m.read_at).map((m) => m.id);
    if (unread.length) supabase.from("messages").update({ read_at: new Date().toISOString() }).in("id", unread).then(() => {});
  }, [thread.length, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const unreadFrom = (id: string) => messages.filter((m) => m.tenancy_id === id && m.recipient_id === user?.id && !m.read_at).length;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || !selected) return;
    const contact = contacts.find(c=>c.id===selected);
    if (!contact || text.trim().length > 4000) return toast.error("Revisa el mensaje");
    const content = text.trim();
    setText("");
    const { error } = await supabase.from("messages").insert({ sender_id: user.id, recipient_id: contact.person, tenancy_id: selected, content });
    if (error) {
      setText(content);
      return toast.error(errorMessage(error));
    }
    qc.invalidateQueries({ queryKey: ["messages", user.id] });
  };

  if (!contacts.length) {
    return (
      <div>
        <PageHeader title="Mensajes" />
        <EmptyState icon={MessageSquare} title="Sin conversaciones" text="Podrás chatear cuando un inquilino acepte la invitación a una de tus propiedades (o cuando aceptes la de tu arrendador)." />
      </div>
    );
  }

  const current = contacts.find((c) => c.id === selected);

  return (
    <div>
      <PageHeader title="Mensajes" />
      <div className="grid h-[calc(100vh-14rem)] min-h-[420px] overflow-hidden rounded-xl border bg-card md:grid-cols-[260px_1fr]">
        <div className="hidden border-r md:block">
          {contacts.map((c) => (
            <Button variant="ghost"
              key={c.id}
              onClick={() => setParams({ contract: c.id })}
              className={cn("flex h-auto w-full items-center justify-between rounded-none border-b px-4 py-3 text-left hover:bg-muted", c.id === selected && "bg-secondary")}
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">{c.subtitle}</p>
              </div>
              {unreadFrom(c.id) > 0 && <span className="rounded-full bg-primary px-2 text-xs text-primary-foreground">{unreadFrom(c.id)}</span>}
            </Button>
          ))}
        </div>
        <div className="flex min-h-0 flex-col">
          <div className="border-b px-4 py-3">
            <select
              className="w-full bg-transparent font-medium md:hidden"
              value={selected ?? ""}
              onChange={(e) => setParams({ contract: e.target.value })}
            >
              {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <p className="hidden font-medium md:block">{current?.name}</p>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {thread.map((m) => (
              <div key={m.id} className={cn("flex", m.sender_id === user?.id ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] rounded-2xl px-4 py-2 text-sm", m.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  {m.content}
                  <div className="mt-1 text-[10px] opacity-70">{new Date(m.created_at).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}</div>
                </div>
              </div>
            ))}
            {!thread.length && <p className="text-center text-sm text-muted-foreground">Escribe el primer mensaje.</p>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 border-t p-3">
            <Input aria-label="Mensaje" maxLength={4000} placeholder="Escribe un mensaje..." value={text} onChange={(e) => setText(e.target.value)} />
            <Button type="submit" size="icon" aria-label="Enviar"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
