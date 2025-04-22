
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import ProfileSettings from '../components/settings/ProfileSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import PaymentSettings from '../components/settings/PaymentSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import PropertyDefaults from '../components/settings/PropertyDefaults';
import CommunicationSettings from '../components/settings/CommunicationSettings';
import SupportSettings from '../components/settings/SupportSettings';
import { useLanguage } from '../contexts/LanguageContext';
import { User } from '@supabase/supabase-js';

// Helper function to adapt Supabase User to our expected User type
const adaptUser = (supabaseUser: User | null) => {
  if (!supabaseUser) return null;
  
  const userMetadata = supabaseUser.user_metadata as { full_name?: string, role?: string, avatar_url?: string } | undefined;
  
  return {
    id: supabaseUser.id,
    name: userMetadata?.full_name || 'User',
    email: supabaseUser.email || '',
    role: (userMetadata?.role as any) || 'tenant',
    avatarUrl: userMetadata?.avatar_url,
  };
};

const Settings = () => {
  const { user: supabaseUser } = useAuth();
  const user = adaptUser(supabaseUser);
  const [activeTab, setActiveTab] = useState("profile");
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">{t("accountSettings")}</h1>
        <p className="text-muted-foreground">{t("managePreferences")}</p>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="property-defaults">Property Defaults</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="help">Help & Support</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="property-defaults">
          <PropertyDefaults />
        </TabsContent>

        <TabsContent value="communications">
          <CommunicationSettings />
        </TabsContent>

        <TabsContent value="help">
          <SupportSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
