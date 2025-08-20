import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, acceptTos?: boolean, acceptPrivacy?: boolean) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  recordConsent: (tosVersion: string, privacyVersion: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, acceptTos: boolean = false, acceptPrivacy: boolean = false) => {
    try {
      console.log('Starting signup process for:', email);
      
      // Allow admin emails to bypass school validation
      const isAdminEmail = email === 'penelope.pressman@gmail.com' || email === 'penelopepressman@college.harvard.edu';
      
      if (!isAdminEmail) {
        // Check if email is from a supported school domain
        const supportedDomains = [
          'princeton.edu', 'mit.edu', 'harvard.edu', 'college.harvard.edu', 'stanford.edu', 
          'yale.edu', 'caltech.edu', 'duke.edu', 'jhu.edu', 'northwestern.edu', 
          'upenn.edu', 'cornell.edu', 'uchicago.edu', 'brown.edu', 'columbia.edu', 
          'dartmouth.edu', 'ucla.edu', 'berkeley.edu', 'umich.edu', 'rice.edu', 
          'vanderbilt.edu', 'cmu.edu', 'usc.edu', 'utexas.edu', 'wustl.edu', 
          'ucsd.edu', 'bu.edu', 'umd.edu', 'bowdoin.edu', 'ed.ac.uk', 'amherst.edu',
          'williams.edu', 'colgate.edu', 'colby.edu', 'middlebury.edu', 'bates.edu',
          'hamilton.edu', 'trincoll.edu', 'skidmore.edu', 'wesleyan.edu', 'conncoll.edu',
          'kenyon.edu', 'oberlin.edu', 'macalester.edu', 'stolaf.edu', 'grinnell.edu',
          'fandm.edu', 'dickinson.edu', 'denison.edu', 'oxy.edu', 'whitman.edu', 'reed.edu'
        ];
        const emailDomain = email.split('@')[1];
        console.log('Email domain:', emailDomain);
        console.log('Supported domains:', supportedDomains);
        
        if (!supportedDomains.includes(emailDomain)) {
          console.log('Domain not supported');
          const error = { message: 'Please use your verified school email address from one of the supported universities.' };
          toast({
            title: "Invalid email domain",
            description: error.message,
            variant: "destructive",
          });
          return { error };
        }
      } else {
        console.log('Admin email detected, bypassing school validation');
      }

      // Check consent requirements
      if (!acceptTos || !acceptPrivacy) {
        console.log('Consent not provided');
        const error = { message: 'Consent required to create a Dorm Scout account.' };
        toast({
          title: "Consent required",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      const redirectUrl = `${window.location.origin}/`;
      console.log('Redirect URL:', redirectUrl);
      
      console.log('Calling supabase.auth.signUp...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      console.log('Signup successful');
      toast({
        title: "Account created successfully!",
        description: "You can now sign in with your credentials.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Signup catch error:', error);
      toast({
        title: "Sign up failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        // Force page reload for clean state
        window.location.href = '/';
      }

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const recordConsent = async (tosVersion: string, privacyVersion: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_consents')
        .insert({
          user_id: user.id,
          tos_version: tosVersion,
          privacy_version: privacyVersion,
          ip_address: null, // Could be captured from client if needed
          user_agent: navigator.userAgent
        });

      if (error) throw error;

      // Update profile with latest consent info
      await supabase
        .from('profiles')
        .update({
          latest_tos_version: tosVersion,
          latest_privacy_version: privacyVersion,
          latest_consented_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      return { error: null };
    } catch (error: any) {
      console.error('Consent recording error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    recordConsent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};