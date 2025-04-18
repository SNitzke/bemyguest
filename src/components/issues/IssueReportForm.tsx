import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { FileImage, ShieldCheck, CheckCircle } from "lucide-react";

const IssueReportForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Issue reported successfully");
      setTitle("");
      setDescription("");
      setImages(null);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an Issue</CardTitle>
        <CardDescription>
          Describe the problem and attach any relevant photos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              placeholder="e.g., Leaking faucet, Broken heater"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please describe the issue in detail..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Attach Images (optional)</Label>
            <div className="border rounded-md p-4 bg-muted/30">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-sm text-muted-foreground mb-2">Upload clear photos of resolved issues</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                    alt="Solved technical problem" 
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                    alt="Resolved coding issue" 
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                    alt="Collaborative problem solving" 
                    className="w-full h-24 object-cover rounded-md opacity-50"
                  />
                </div>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Issue Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IssueReportForm;
