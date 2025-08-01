import React from "react";
import { useIssues } from "../hooks/useIssues";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AlertCircle, CheckCircle, Clock, Wrench } from "lucide-react";

const Issues: React.FC = () => {
  const { issues, isLoading } = useIssues();
  const { profile } = useAuth();
  const isLandlord = profile?.role === "landlord";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Wrench className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "destructive";
      case "in_progress":
        return "default";
      case "resolved":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-semibold">
          {isLandlord ? "Problemas Reportados" : "Mis Problemas"}
        </h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          {isLandlord ? "Problemas Reportados" : "Mis Problemas"}
        </h1>
        <p className="text-muted-foreground">
          {isLandlord 
            ? "Gestiona los problemas reportados por tus inquilinos"
            : "Revisa el estado de los problemas que has reportado"
          }
        </p>
      </div>

      {issues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isLandlord ? "No hay problemas reportados" : "No tienes problemas reportados"}
            </h3>
            <p className="text-muted-foreground text-center">
              {isLandlord 
                ? "Cuando tus inquilinos reporten problemas, aparecerán aquí."
                : "Si tienes algún problema en tu vivienda, puedes reportarlo desde el dashboard."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <Card key={issue.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(issue.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(issue.priority) as any}>
                      {issue.priority}
                    </Badge>
                    <Badge variant={getStatusColor(issue.status) as any} className="gap-1">
                      {getStatusIcon(issue.status)}
                      {issue.status === "new" && "Nuevo"}
                      {issue.status === "in_progress" && "En Progreso"}
                      {issue.status === "resolved" && "Resuelto"}
                      {issue.status === "closed" && "Cerrado"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {issue.description}
                </p>
                {issue.images && issue.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {issue.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Problema ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Issues;