
import React, { useState } from "react";
import { issues } from "../utils/mockData";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";

const Issues: React.FC = () => {
  const { user } = useAuth();
  const isLandlord = user?.role === "landlord";
  const [filter, setFilter] = useState<string>("all");

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "inProgress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "New";
      case "inProgress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  const filteredIssues = filter === "all" 
    ? issues 
    : issues.filter(issue => issue.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">{isLandlord ? "Property Issues" : "My Issues"}</h1>
        <p className="text-muted-foreground">
          {isLandlord 
            ? "Manage and respond to tenant-reported issues" 
            : "Track the status of your reported issues"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          onClick={() => setFilter("all")}
          size="sm"
        >
          All
        </Button>
        <Button 
          variant={filter === "new" ? "default" : "outline"} 
          onClick={() => setFilter("new")}
          size="sm"
        >
          New
        </Button>
        <Button 
          variant={filter === "inProgress" ? "default" : "outline"} 
          onClick={() => setFilter("inProgress")}
          size="sm"
        >
          In Progress
        </Button>
        <Button 
          variant={filter === "resolved" ? "default" : "outline"} 
          onClick={() => setFilter("resolved")}
          size="sm"
        >
          Resolved
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {filter === "all" ? "All Issues" : `${getStatusText(filter)} Issues`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredIssues.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No issues found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusBadgeClass(issue.status)}>
                      {getStatusText(issue.status)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm">{issue.description}</p>
                  {issue.imageUrls.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {issue.imageUrls.map((url, index) => (
                        <div key={index} className="h-16 w-16 rounded overflow-hidden">
                          <img
                            src={url}
                            alt={`Issue image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Issues;
