
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { FileText, Check, Search, Wrench } from 'lucide-react';

const PropertyDefaults = () => {
  const [leaseDefaults, setLeaseDefaults] = useState({
    duration: '12',
    securityDepositFormula: 'oneMonth',
    securityDepositAmount: 0,
    gracePeriod: 5,
    lateFeeAmount: 50,
    lateFeePercentage: 5,
    useFlatFee: true
  });

  const [applicationDefaults, setApplicationDefaults] = useState({
    applicationFee: 50,
    requireCreditCheck: true,
    requireBackgroundCheck: true,
    requireIncomeVerification: true,
    requireRentalHistory: true
  });

  const [maintenanceDefaults, setMaintenanceDefaults] = useState({
    preferredContactMethod: 'app',
    emergencyContactPhone: '555-123-4567',
    lowPriorityResponse: '72',
    mediumPriorityResponse: '48',
    highPriorityResponse: '24'
  });

  const handleLeaseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeaseDefaults(prev => ({ ...prev, [name]: value }));
  };

  const handleApplicationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setApplicationDefaults(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleMaintenanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaintenanceDefaults(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveDefaults = () => {
    toast({
      title: "Default settings saved",
      description: "Your property default settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lease Terms Defaults
          </CardTitle>
          <CardDescription>
            These settings will be applied as defaults when creating new properties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lease-duration">Default Lease Duration (months)</Label>
            <Input
              id="lease-duration"
              name="duration"
              type="number"
              value={leaseDefaults.duration}
              onChange={handleLeaseInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Security Deposit Calculation</Label>
            <RadioGroup 
              value={leaseDefaults.securityDepositFormula}
              onValueChange={(value) => setLeaseDefaults(prev => ({ ...prev, securityDepositFormula: value }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oneMonth" id="deposit-one-month" />
                <Label htmlFor="deposit-one-month">One month's rent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="deposit-fixed" />
                <Label htmlFor="deposit-fixed">Fixed amount</Label>
              </div>
            </RadioGroup>
            
            {leaseDefaults.securityDepositFormula === 'fixed' && (
              <div className="pt-2">
                <Label htmlFor="deposit-amount">Fixed Deposit Amount ($)</Label>
                <Input
                  id="deposit-amount"
                  name="securityDepositAmount"
                  type="number"
                  value={leaseDefaults.securityDepositAmount}
                  onChange={handleLeaseInputChange}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grace-period">Late Payment Grace Period (days)</Label>
            <Input
              id="grace-period"
              name="gracePeriod"
              type="number"
              value={leaseDefaults.gracePeriod}
              onChange={handleLeaseInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Late Fee Type</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="fee-type" className="text-sm">
                  {leaseDefaults.useFlatFee ? 'Flat Fee' : 'Percentage'}
                </Label>
                <Switch
                  id="fee-type"
                  checked={leaseDefaults.useFlatFee}
                  onCheckedChange={(checked) => 
                    setLeaseDefaults(prev => ({ ...prev, useFlatFee: checked }))
                  }
                />
              </div>
            </div>
            
            {leaseDefaults.useFlatFee ? (
              <div className="pt-2">
                <Label htmlFor="late-fee-amount">Late Fee Amount ($)</Label>
                <Input
                  id="late-fee-amount"
                  name="lateFeeAmount"
                  type="number"
                  value={leaseDefaults.lateFeeAmount}
                  onChange={handleLeaseInputChange}
                />
              </div>
            ) : (
              <div className="pt-2">
                <Label htmlFor="late-fee-percentage">Late Fee Percentage (%)</Label>
                <Input
                  id="late-fee-percentage"
                  name="lateFeePercentage"
                  type="number"
                  value={leaseDefaults.lateFeePercentage}
                  onChange={handleLeaseInputChange}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Application Process Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="application-fee">Application Fee ($)</Label>
            <Input
              id="application-fee"
              name="applicationFee"
              type="number"
              value={applicationDefaults.applicationFee}
              onChange={handleApplicationInputChange}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Required Screening Checks</Label>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="credit-check"
                name="requireCreditCheck"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={applicationDefaults.requireCreditCheck}
                onChange={handleApplicationInputChange}
              />
              <Label htmlFor="credit-check" className="text-sm font-medium">
                Credit Check
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="background-check"
                name="requireBackgroundCheck"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={applicationDefaults.requireBackgroundCheck}
                onChange={handleApplicationInputChange}
              />
              <Label htmlFor="background-check" className="text-sm font-medium">
                Background Check
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="income-verification"
                name="requireIncomeVerification"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={applicationDefaults.requireIncomeVerification}
                onChange={handleApplicationInputChange}
              />
              <Label htmlFor="income-verification" className="text-sm font-medium">
                Income Verification (Pay Stubs/W2)
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rental-history"
                name="requireRentalHistory"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={applicationDefaults.requireRentalHistory}
                onChange={handleApplicationInputChange}
              />
              <Label htmlFor="rental-history" className="text-sm font-medium">
                Rental History
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Contact Method for Maintenance</Label>
            <RadioGroup 
              value={maintenanceDefaults.preferredContactMethod}
              onValueChange={(value) => setMaintenanceDefaults(prev => ({ ...prev, preferredContactMethod: value }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="app" id="contact-app" />
                <Label htmlFor="contact-app">In-App Request</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="contact-email" />
                <Label htmlFor="contact-email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="contact-phone" />
                <Label htmlFor="contact-phone">Phone Call</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emergency-phone">Emergency Contact Phone Number</Label>
            <Input
              id="emergency-phone"
              name="emergencyContactPhone"
              value={maintenanceDefaults.emergencyContactPhone}
              onChange={handleMaintenanceInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Standard Response Time by Priority (hours)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="low-priority" className="text-sm">Low Priority</Label>
                <Input
                  id="low-priority"
                  name="lowPriorityResponse"
                  type="number"
                  value={maintenanceDefaults.lowPriorityResponse}
                  onChange={handleMaintenanceInputChange}
                />
              </div>
              <div>
                <Label htmlFor="medium-priority" className="text-sm">Medium Priority</Label>
                <Input
                  id="medium-priority"
                  name="mediumPriorityResponse"
                  type="number"
                  value={maintenanceDefaults.mediumPriorityResponse}
                  onChange={handleMaintenanceInputChange}
                />
              </div>
              <div>
                <Label htmlFor="high-priority" className="text-sm">High Priority</Label>
                <Input
                  id="high-priority"
                  name="highPriorityResponse"
                  type="number"
                  value={maintenanceDefaults.highPriorityResponse}
                  onChange={handleMaintenanceInputChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveDefaults}>Save Default Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PropertyDefaults;
