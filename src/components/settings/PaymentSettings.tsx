
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Trash2, Plus, Wallet } from 'lucide-react';

const PaymentSettings = () => {
  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, name: 'Primary Checking', accountNumber: '****6789', bankName: 'Chase' },
    { id: 2, name: 'Business Savings', accountNumber: '****4321', bankName: 'Bank of America' }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Credit Card', last4: '4242', brand: 'Visa', isDefault: true },
    { id: 2, type: 'ACH', last4: '9876', brand: 'Checking Account', isDefault: false }
  ]);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    accountNumber: '',
    routingNumber: '',
    bankName: ''
  });

  const handleDeleteAccount = (id: number) => {
    setBankAccounts(bankAccounts.filter(account => account.id !== id));
    toast({
      title: "Account removed",
      description: "Bank account has been removed successfully."
    });
  };

  const handleDeletePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast({
      title: "Payment method removed",
      description: "Payment method has been removed successfully."
    });
  };

  const handleAddAccount = () => {
    // In a real app, this would validate and submit to an API
    setBankAccounts([
      ...bankAccounts,
      {
        id: Date.now(),
        name: newAccount.name,
        accountNumber: `****${newAccount.accountNumber.slice(-4)}`,
        bankName: newAccount.bankName
      }
    ]);
    
    setNewAccount({
      name: '',
      accountNumber: '',
      routingNumber: '',
      bankName: ''
    });
    
    setShowAddAccount(false);
    
    toast({
      title: "Account added",
      description: "Bank account has been added successfully."
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccount(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Bank Accounts</CardTitle>
          <CardDescription>
            Manage your connected bank accounts for receiving payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bankAccounts.map(account => (
            <div key={account.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {account.bankName} • {account.accountNumber}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteAccount(account.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          {showAddAccount ? (
            <div className="p-4 border rounded-md space-y-4">
              <h3 className="font-medium">Add New Bank Account</h3>
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  name="name"
                  value={newAccount.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Primary Checking"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input
                  id="bank-name"
                  name="bankName"
                  value={newAccount.bankName}
                  onChange={handleInputChange}
                  placeholder="e.g. Chase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input
                  id="routing-number"
                  name="routingNumber"
                  value={newAccount.routingNumber}
                  onChange={handleInputChange}
                  placeholder="9 digits"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  name="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Account number"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddAccount}>Add Account</Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddAccount(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => setShowAddAccount(true)}
            >
              <Plus className="h-4 w-4" />
              Add Bank Account
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferred Payment Methods</CardTitle>
          <CardDescription>
            Configure how you prefer to receive payments from tenants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map(method => (
            <div key={method.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {method.brand} •••• {method.last4}
                    {method.isDefault && (
                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{method.type}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePaymentMethod(method.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        </CardContent>
        <CardFooter>
          <Button>Save Payment Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSettings;
