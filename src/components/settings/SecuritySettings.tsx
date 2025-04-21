import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Shield, Smartphone, Laptop, Info, LogOut, Lock, Plus } from 'lucide-react';

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [devices, setDevices] = useState([
    { id: 1, name: 'MacBook Pro', lastActive: '2023-04-19 14:32', location: 'San Francisco, CA' },
    { id: 2, name: 'iPhone 14', lastActive: '2023-04-20 09:15', location: 'San Francisco, CA' },
    { id: 3, name: 'Chrome - Windows', lastActive: '2023-04-15 18:45', location: 'New York, NY' }
  ]);

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? "Two-factor authentication disabled" : "Two-factor authentication enabled",
      description: twoFactorEnabled 
        ? "Your account is now less secure."
        : "Your account is now more secure."
    });
  };

  const handleRemoveDevice = (id: number) => {
    setDevices(devices.filter(device => device.id !== id));
    toast({
      title: "Device removed",
      description: "The device has been logged out and removed from your account."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by requiring a verification code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted/30 rounded-md">
            <div className="flex items-center gap-3">
              <Shield className="h-10 w-10 text-primary p-2 bg-primary/10 rounded" />
              <div>
                <h3 className="font-medium">Secure your account</h3>
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="two-factor"
                checked={twoFactorEnabled}
                onCheckedChange={handleToggleTwoFactor}
              />
              <Label htmlFor="two-factor">
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="space-y-2 p-4 border border-dashed rounded-md">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <Info className="h-4 w-4" />
                Your two-factor methods
              </h3>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Authenticator App</span>
                </div>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                  Primary
                </span>
              </div>
              <Button size="sm" variant="outline" className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Backup Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
          <CardDescription>
            Manage devices that are currently signed in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {devices.map(device => (
            <div key={device.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                {device.name.includes('iPhone') ? (
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Laptop className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {device.lastActive} • {device.location}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveDevice(device.id)}
                className="text-xs"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Sign Out
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Lock className="h-4 w-4 mr-2" />
            Sign Out All Devices
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecuritySettings;
