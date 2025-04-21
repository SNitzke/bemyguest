
import React, { useState } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Edit, User as UserIcon, Phone, Mail, Image, Save } from 'lucide-react';

interface ProfileSettingsProps {
  user: User | null;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '555-123-4567', // Mock data, would come from user object in real app
    avatarUrl: user?.avatarUrl || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(profileData.avatarUrl || null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Here you would handle API call to update profile
    // Mock implementation for now
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });

    setIsEditingName(false);
    setIsEditingPhone(false);
    setIsEditingEmail(false);
  };

  const userInitials = profileData.name
    ? profileData.name
        .split(' ')
        .map(n => n[0])
        .join('')
    : 'U';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                {imagePreview || profileData.avatarUrl ? (
                  <AvatarImage src={imagePreview || profileData.avatarUrl} alt={profileData.name} />
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
                  Change Picture
                </Label>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  {isEditingName ? (
                    <div className="relative flex-1">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="pl-9"
                      />
                    </div>
                  ) : (
                    <span className="flex-1 py-2">{profileData.name}</span>
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
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  {isEditingPhone ? (
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="pl-9"
                      />
                    </div>
                  ) : (
                    <span className="flex-1 py-2">{profileData.phone}</span>
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
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  {isEditingEmail ? (
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        type="email"
                        className="pl-9"
                      />
                    </div>
                  ) : (
                    <span className="flex-1 py-2">{profileData.email}</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSaveProfile} className="gap-2">
            <Save size={16} />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Password Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Change Password</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Closure</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Closing your account will result in the permanent deletion of all your data including property listings, tenant information, and financial records. This action cannot be undone.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive">Close Account</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSettings;
