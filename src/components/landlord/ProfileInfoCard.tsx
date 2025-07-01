
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';

interface ProfileInfoCardProps {
  user: SupabaseUser | null;
  profile: Profile | null;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ user, profile }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={20} />
          Información del Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Nombre Completo</p>
          <p className="font-medium">{profile?.full_name || 'No proporcionado'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Teléfono</p>
          <p className="font-medium">{profile?.phone_number || 'No proporcionado'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Rol</p>
          <p className="font-medium capitalize">{profile?.role || 'Propietario'}</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Editar Perfil
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;
