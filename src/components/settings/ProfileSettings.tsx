
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Edit, User as UserIcon, Phone, Mail, Image, Save } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone_number: profile?.phone_number || '',
    avatar_url: profile?.avatar_url || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(profileData.avatar_url || null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateProfile(profileData);
      setIsEditingName(false);
      setIsEditingPhone(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const userInitials = profileData.full_name
    ? profileData.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
    : 'U';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                {imagePreview || profileData.avatar_url ? (
                  <AvatarImage src={imagePreview || profileData.avatar_url} alt={profileData.full_name} />
                ) : (
                  <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                )}
              </Avatar>
              <div className="relative">
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Image size={14} />
                  Cambiar Foto
                </Label>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div>
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Nombre Completo
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  {isEditingName ? (
                    <div className="relative flex-1">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        name="full_name"
                        value={profileData.full_name}
                        onChange={handleInputChange}
                        className="pl-9"
                      />
                    </div>
                  ) : (
                    <span className="flex-1 py-2">{profileData.full_name}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingName(!isEditingName)}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone_number" className="text-sm font-medium">
                  Número de Teléfono
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  {isEditingPhone ? (
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone_number"
                        name="phone_number"
                        value={profileData.phone_number}
                        onChange={handleInputChange}
                        className="pl-9"
                      />
                    </div>
                  ) : (
                    <span className="flex-1 py-2">{profileData.phone_number || 'No proporcionado'}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingPhone(!isEditingPhone)}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">
                  Dirección de Email
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex-1 py-2">{profile?.email}</span>
                  <span className="text-xs text-muted-foreground">No editable</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSaveProfile} className="gap-2" disabled={isSaving}>
            <Save size={16} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSettings;
