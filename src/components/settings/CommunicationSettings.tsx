
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Save, Plus, Trash2, Edit } from 'lucide-react';

const CommunicationSettings = () => {
  const [messageTemplates, setMessageTemplates] = useState([
    { id: 1, name: 'Rent Reminder', content: 'Hello {tenant_name}, this is a friendly reminder that your rent payment of ${amount} is due on {due_date}. Thank you.' },
    { id: 2, name: 'Maintenance Confirmation', content: 'Hello {tenant_name}, we have received your maintenance request regarding {issue_description}. A technician will be scheduled within {timeframe}.' },
    { id: 3, name: 'Welcome Message', content: 'Welcome to {property_name}, {tenant_name}! We are delighted to have you as our tenant. Please let us know if you need any assistance getting settled.' }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (editingTemplate !== null) {
      setMessageTemplates(templates =>
        templates.map(template =>
          template.id === editingTemplate ? { ...template, [name]: value } : template
        )
      );
    } else {
      setNewTemplate(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTemplate = () => {
    if (newTemplate.name.trim() === '' || newTemplate.content.trim() === '') {
      toast({
        title: "Error",
        description: "Template name and content are required.",
        variant: "destructive"
      });
      return;
    }
    
    setMessageTemplates([
      ...messageTemplates,
      {
        id: Date.now(),
        name: newTemplate.name,
        content: newTemplate.content
      }
    ]);
    
    setNewTemplate({
      name: '',
      content: ''
    });
    
    setShowAddTemplate(false);
    
    toast({
      title: "Template added",
      description: "Your message template has been added successfully."
    });
  };

  const handleDeleteTemplate = (id: number) => {
    setMessageTemplates(messageTemplates.filter(template => template.id !== id));
    toast({
      title: "Template deleted",
      description: "Your message template has been deleted."
    });
  };

  const handleEditTemplate = (id: number) => {
    if (editingTemplate === id) {
      setEditingTemplate(null);
      toast({
        title: "Template updated",
        description: "Your message template has been updated."
      });
    } else {
      setEditingTemplate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Templates
          </CardTitle>
          <CardDescription>
            Create and manage message templates for common communications with tenants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {messageTemplates.map(template => (
            <div key={template.id} className="border rounded-md p-4 space-y-3">
              {editingTemplate === template.id ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={`template-name-${template.id}`}>Template Name</Label>
                    <Input
                      id={`template-name-${template.id}`}
                      name="name"
                      value={template.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`template-content-${template.id}`}>Content</Label>
                    <Textarea
                      id={`template-content-${template.id}`}
                      name="content"
                      value={template.content}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{template.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTemplate(template.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {template.content}
                  </p>
                </>
              )}
              
              {editingTemplate === template.id && (
                <div className="pt-2 flex justify-end gap-2">
                  <Button size="sm" onClick={() => handleEditTemplate(template.id)}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTemplate(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}

          {showAddTemplate ? (
            <div className="border rounded-md p-4 space-y-3">
              <h3 className="font-medium">Add New Template</h3>
              <div className="space-y-2">
                <Label htmlFor="new-template-name">Template Name</Label>
                <Input
                  id="new-template-name"
                  name="name"
                  value={newTemplate.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Payment Confirmation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-template-content">Template Content</Label>
                <p className="text-xs text-muted-foreground">
                  Use placeholders like {'{tenant_name}'}, {'{property_name}'}, {'{amount}'}, etc. for dynamic content.
                </p>
                <Textarea
                  id="new-template-content"
                  name="content"
                  value={newTemplate.content}
                  onChange={handleInputChange}
                  placeholder="Hello {tenant_name}, thank you for your payment of ${amount}..."
                  rows={4}
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button onClick={handleAddTemplate}>
                  <Save className="h-4 w-4 mr-1" />
                  Save Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddTemplate(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setShowAddTemplate(true)}
            >
              <Plus className="h-4 w-4" />
              Add New Template
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full text-xs text-muted-foreground">
            <p>
              <strong>Available placeholders:</strong> {'{tenant_name}'}, {'{property_name}'}, {'{amount}'}, {'{due_date}'}, {'{issue_description}'}, {'{timeframe}'}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CommunicationSettings;
