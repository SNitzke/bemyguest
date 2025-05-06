
import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import { LandlordDetails } from '@/types/auth';

interface SubscriptionCardProps {
  landlordDetails: LandlordDetails | null;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ landlordDetails }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              {landlordDetails?.subscription_plan || 'Basic'} Plan
            </h3>
            <p className="text-blue-600">
              Active since {new Date(landlordDetails?.subscription_start_date || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0"
            onClick={() => navigate('/settings')}
          >
            Manage Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
