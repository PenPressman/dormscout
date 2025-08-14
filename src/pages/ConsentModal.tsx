import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { AlertTriangle } from 'lucide-react';

interface ConsentModalProps {
  onClose: () => void;
  onConsent: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onClose, onConsent }) => {
  const [agreeTos, setAgreeTos] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  const handleAgreeAndContinue = async () => {
    if (!agreeTos || !agreePrivacy) return;
    
    setLoading(true);
    try {
      await onConsent();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold">
            We've updated our Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Our Terms of Service and Privacy Policy have been updated. Please review and agree to continue using Dorm Scout.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="modal-agree-tos"
                checked={agreeTos}
                onCheckedChange={(checked) => setAgreeTos(checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="modal-agree-tos"
                  className="text-sm font-normal leading-relaxed cursor-pointer"
                >
                  I agree to the updated{' '}
                  <Link 
                    to="/legal/terms-of-service" 
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </Link>
                </Label>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="modal-agree-privacy"
                checked={agreePrivacy}
                onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="modal-agree-privacy"
                  className="text-sm font-normal leading-relaxed cursor-pointer"
                >
                  I have read the updated{' '}
                  <Link 
                    to="/legal/privacy-policy" 
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex-1"
              disabled={loading}
            >
              Sign Out
            </Button>
            <Button 
              onClick={handleAgreeAndContinue}
              className="flex-1"
              disabled={loading || !agreeTos || !agreePrivacy}
            >
              {loading ? 'Updating...' : 'Agree & Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentModal;