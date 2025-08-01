import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Messages: React.FC = () => {
  const [newMessage, setNewMessage] = useState("");
  const { profile } = useAuth();
  const isLandlord = profile?.role === "landlord";

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implement real message sending
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Mensajes</h1>
        <p className="text-muted-foreground">
          {isLandlord 
            ? "Comunícate con tus inquilinos" 
            : "Comunícate con tu propietario"
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 bg-muted/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay mensajes</h3>
              <p className="text-muted-foreground">
                Los mensajes aparecerán aquí cuando comiences una conversación.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;