import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Search, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmailVerified = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dorm-green/10 to-dorm-blue/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-dorm-green to-dorm-blue rounded-full">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-dorm-green to-dorm-blue bg-clip-text text-transparent">
            ✅ Your email is verified! Welcome to Dorm Scout.
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            You're all set! Start exploring dorms or share your own room to help fellow students.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/find')}
              size="lg"
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              Find a Dorm
            </Button>
            
            <Button 
              onClick={() => navigate('/share')}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Share a Dorm
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Continue to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerified;