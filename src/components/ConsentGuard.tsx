import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { needsReconsent, LEGAL_TOS_VERSION, LEGAL_PRIVACY_VERSION } from '@/lib/legal';
import ConsentModal from '@/pages/ConsentModal';

interface ConsentGuardProps {
  children: React.ReactNode;
}

const ConsentGuard: React.FC<ConsentGuardProps> = ({ children }) => {
  const { user, recordConsent } = useAuth();
  const [showConsentModal, setShowConsentModal] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('latest_tos_version, latest_privacy_version, latest_consented_at')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (user && profile) {
      const needsNewConsent = needsReconsent(
        profile.latest_tos_version,
        profile.latest_privacy_version
      );
      
      if (needsNewConsent) {
        setShowConsentModal(true);
      }
    }
  }, [user, profile]);

  const handleConsent = async () => {
    const { error } = await recordConsent(LEGAL_TOS_VERSION, LEGAL_PRIVACY_VERSION);
    
    if (!error) {
      setShowConsentModal(false);
      // Refetch profile to update consent status
      window.location.reload();
    }
  };

  if (showConsentModal) {
    return (
      <ConsentModal
        onClose={() => setShowConsentModal(false)}
        onConsent={handleConsent}
      />
    );
  }

  return <>{children}</>;
};

export default ConsentGuard;