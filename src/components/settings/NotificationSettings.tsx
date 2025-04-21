
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Bell, Mail, MessageSquare } from 'lucide-react';

const NotificationSettings = () => {
  const [notificationMethods, setNotificationMethods] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const [notificationTypes, setNotificationTypes] = useState({
    tenantApplications: true,
    leaseRenewals: true,
    paymentReceipts: true,
    maintenanceRequests: true,
    messages: true,
  });

  const [preferredChannel, setPreferredChannel] = useState('email');

  const handleMethodToggle = (method: keyof typeof notificationMethods) => {
    setNotificationMethods(prev => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const handleTypeToggle = (type: keyof typeof notificationTypes) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email-notifications" className="flex-1">
                Email Notifications
              </Label>
            </div>
            <Switch
              id="email-notifications"
              checked={notificationMethods.email}
              onCheckedChange={() => handleMethodToggle('email')}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="push-notifications" className="flex-1">
                Push Notifications
              </Label>
            </div>
            <Switch
              id="push-notifications"
              checked={notificationMethods.push}
              onCheckedChange={() => handleMethodToggle('push')}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="sms-notifications" className="flex-1">
                SMS Notifications
              </Label>
            </div>
            <Switch
              id="sms-notifications"
              checked={notificationMethods.sms}
              onCheckedChange={() => handleMethodToggle('sms')}
            />
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">Preferred Notification Channel</p>
            <RadioGroup value={preferredChannel} onValueChange={setPreferredChannel} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="channel-email" />
                <Label htmlFor="channel-email">Email (Primary)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="push" id="channel-push" />
                <Label htmlFor="channel-push">Push Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="channel-sms" />
                <Label htmlFor="channel-sms">SMS</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="tenant-applications" className="flex-1">
              New Tenant Applications
            </Label>
            <Switch
              id="tenant-applications"
              checked={notificationTypes.tenantApplications}
              onCheckedChange={() => handleTypeToggle('tenantApplications')}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="lease-renewals" className="flex-1">
              Lease Renewal Reminders
            </Label>
            <Switch
              id="lease-renewals"
              checked={notificationTypes.leaseRenewals}
              onCheckedChange={() => handleTypeToggle('leaseRenewals')}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="payment-receipts" className="flex-1">
              Payment Receipts
            </Label>
            <Switch
              id="payment-receipts"
              checked={notificationTypes.paymentReceipts}
              onCheckedChange={() => handleTypeToggle('paymentReceipts')}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="maintenance-requests" className="flex-1">
              Maintenance Requests
            </Label>
            <Switch
              id="maintenance-requests"
              checked={notificationTypes.maintenanceRequests}
              onCheckedChange={() => handleTypeToggle('maintenanceRequests')}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="tenant-messages" className="flex-1">
              Messages from Tenants
            </Label>
            <Switch
              id="tenant-messages"
              checked={notificationTypes.messages}
              onCheckedChange={() => handleTypeToggle('messages')}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNotifications}>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
