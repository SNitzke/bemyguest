
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { HelpCircle, Mail, ExternalLink, MessageSquare, Info, User } from 'lucide-react';

const SupportSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Find answers to common questions about using the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I add a new property?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  To add a new property, go to the Properties section from the sidebar menu and click on the "Add Property" button. Fill in the required details about your property and click "Save".
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I invite a tenant?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  You can invite a new tenant by going to the "Invite Tenant" page from the sidebar. Enter their email address, select the property and unit they'll be occupying, and send the invitation.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>How do rent payments work?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Rent payments can be made through the app. Tenants can set up automatic payments or make manual payments each month. You can track all payments in the Payments section.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I respond to maintenance requests?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Maintenance requests appear in the Issues section. You can view details, communicate with the tenant, update the status, and mark issues as resolved once completed.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>How do I change my notification settings?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  You can customize your notification preferences in the Settings page under the Notifications tab. There you can choose which events trigger notifications and how you'd like to receive them.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full justify-center gap-2">
            <ExternalLink className="h-4 w-4" />
            View Full Help Center
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Support
          </CardTitle>
          <CardDescription>
            Get help from our support team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-md">
            <Mail className="h-10 w-10 text-primary p-2 bg-primary/10 rounded" />
            <div>
              <h3 className="font-medium">Email Support</h3>
              <p className="text-sm text-muted-foreground">
                Send us an email at <a href="mailto:support@bemyguest.com" className="text-primary hover:underline">support@bemyguest.com</a>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Average response time: 24 hours
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-md">
            <MessageSquare className="h-10 w-10 text-primary p-2 bg-primary/10 rounded" />
            <div>
              <h3 className="font-medium">Live Chat</h3>
              <p className="text-sm text-muted-foreground">
                Chat with our support team directly through the app
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Available Monday-Friday, 9am-5pm PT
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-md">
            <User className="h-10 w-10 text-primary p-2 bg-primary/10 rounded" />
            <div>
              <h3 className="font-medium">Schedule a Call</h3>
              <p className="text-sm text-muted-foreground">
                Book a time to speak with our support team
              </p>
              <Button variant="link" className="h-auto p-0 text-primary text-sm">
                Schedule Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Legal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link to="/terms" className="block text-sm text-primary hover:underline">
            Terms of Service
          </Link>
          <Link to="/privacy" className="block text-sm text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link to="/cookie-policy" className="block text-sm text-primary hover:underline">
            Cookie Policy
          </Link>
          <div className="pt-2 text-xs text-muted-foreground">
            <p>BeMyGuest App Version 1.0.0</p>
            <p>© 2025 BeMyGuest, Inc. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportSettings;
