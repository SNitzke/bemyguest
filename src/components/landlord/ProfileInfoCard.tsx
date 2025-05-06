
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface ProfileInfoCardProps {
  user: SupabaseUser | null;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ user }) => {
  const navigate = useNavigate();
  const userMetadata = user?.user_metadata as { full_name?: string, role?: string, phone_number?: string } | undefined;
  const fullName = userMetadata?.full_name || 'Landlord';
  const phoneNumber = userMetadata?.phone_number || 'Not provided';
  
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={20} />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Full Name</p>
          <p className="font-medium">{fullName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-medium">{phoneNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Company</p>
          <p className="font-medium">Not provided</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Role</p>
          <p className="font-medium capitalize">{userMetadata?.role || 'Landlord'}</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;
