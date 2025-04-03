
import React, { useState } from "react";
import { messages, users } from "../utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useAuth } from "../contexts/AuthContext";

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    user?.role === "landlord" ? "2" : "1" // Default to first tenant or landlord
  );

  // Filter messages to show only conversations involving the current user
  const relevantMessages = messages.filter(
    (msg) => msg.senderId === user?.id || msg.receiverId === user?.id
  );

  // Get unique conversation partners
  const conversationPartners = Array.from(
    new Set(
      relevantMessages.flatMap((msg) => [msg.senderId, msg.receiverId])
    )
  ).filter((id) => id !== user?.id);

  const conversationMessages = relevantMessages.filter(
    (msg) =>
      (msg.senderId === user?.id && msg.receiverId === selectedConversation) ||
      (msg.senderId === selectedConversation && msg.receiverId === user?.id)
  );

  // Sort messages by date
  conversationMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, this would call an API to send the message
    console.log("Sending message:", newMessage, "to user:", selectedConversation);
    
    // Clear the input
    setNewMessage("");
  };

  // Get user name by ID
  const getUserById = (id: string) => {
    return users.find((u) => u.id === id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with {user?.role === "landlord" ? "tenants" : "property management"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {conversationPartners.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No conversations yet.
              </div>
            ) : (
              <div className="space-y-0 divide-y">
                {conversationPartners.map((partnerId) => {
                  const partner = getUserById(partnerId);
                  return (
                    <button
                      key={partnerId}
                      className={`flex items-center gap-3 w-full p-4 text-left hover:bg-muted transition-colors ${
                        selectedConversation === partnerId
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => setSelectedConversation(partnerId)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={partner?.avatarUrl || ""} alt={partner?.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {partner?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{partner?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {partner?.role}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col h-[600px]">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={getUserById(selectedConversation)?.avatarUrl || ""}
                      alt={getUserById(selectedConversation)?.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserById(selectedConversation)?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{getUserById(selectedConversation)?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getUserById(selectedConversation)?.role}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {conversationMessages.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    conversationMessages.map((msg) => {
                      const isOwnMessage = msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              isOwnMessage
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-muted-foreground">
                  Choose a contact to start chatting
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
