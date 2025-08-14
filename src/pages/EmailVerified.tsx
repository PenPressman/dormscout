import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home } from 'lucide-react';

const EmailVerified = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dorm-green/10 to-dorm-blue/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-dorm-green to-dorm-blue rounded-full">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-dorm-green to-dorm-blue bg-clip-text text-transparent">
            Email Verified!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            Your email has been successfully verified! You can now start using Dorm Scout.
          </p>
          
          <Button 
            onClick={() => window.location.href = '/'}
            size="lg"
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerified;