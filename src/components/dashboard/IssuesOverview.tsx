
import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Issue } from "../../types";

interface IssuesOverviewProps {
  issues: Issue[];
}

const IssuesOverview: React.FC<IssuesOverviewProps> = ({ issues }) => {
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Recent Issues</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {issues.length === 0 ? (
          <div className="px-6 py-4 text-center text-sm text-muted-foreground">
            No issues reported yet.
          </div>
        ) : (
          <div className="space-y-0 divide-y">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between px-6 py-4 last:rounded-b-lg hover:bg-muted/50 transition-colors"
              >
                <div className="grid gap-1">
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Badge className={getStatusBadgeClass(issue.status)} variant="outline">
                  {getStatusText(issue.status)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IssuesOverview;
