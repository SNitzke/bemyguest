
import React from "react";
import IssueReportForm from "../components/issues/IssueReportForm";

const ReportIssue: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Report an Issue</h1>
        <p className="text-muted-foreground">
          Please provide details about any problems that need attention
        </p>
      </div>

      <div className="max-w-2xl">
        <IssueReportForm />
      </div>
    </div>
  );
};

export default ReportIssue;
