import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [consentError, setConsentError] = useState('');
  const { signIn, signUp, user } = useAuth();

  useEffect(() => {
    if (user) {
      // Redirect authenticated users
      window.location.href = '/';
    }
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsentError('');
    
    // Check consent checkboxes
    if (!agreeTos || !agreePrivacy) {
      setConsentError('You must agree to continue.');
      return;
    }
    
    setLoading(true);
    await signUp(email, password, agreeTos, agreePrivacy);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-dorm-pink to-dorm-orange bg-clip-text text-transparent">Dorm Scout</CardTitle>
          <CardDescription>
            Connect with your school email to explore and share dorm room information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">School Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">School Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.name@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use your official school email (.edu domain)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 characters
                  </p>
                </div>
                
                {/* Consent Checkboxes */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="agree-tos"
                      checked={agreeTos}
                      onCheckedChange={(checked) => setAgreeTos(checked === true)}
                      aria-describedby="consent-error"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label 
                        htmlFor="agree-tos"
                        className="text-sm font-normal leading-relaxed cursor-pointer"
                      >
                        I agree to the{' '}
                        <Link 
                          to="/legal/terms-of-service" 
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Dorm Scout Terms of Service
                        </Link>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="agree-privacy"
                      checked={agreePrivacy}
                      onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
                      aria-describedby="consent-error"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label 
                        htmlFor="agree-privacy"
                        className="text-sm font-normal leading-relaxed cursor-pointer"
                      >
                        I have read the{' '}
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
                  
                  {consentError && (
                    <div 
                      id="consent-error"
                      className="text-sm text-destructive" 
                      role="alert"
                      aria-live="polite"
                    >
                      {consentError}
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !agreeTos || !agreePrivacy}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Supported universities:</p>
            <p className="text-xs mt-1">Princeton • MIT • Harvard • Stanford • Yale • Caltech • Duke • Johns Hopkins • Northwestern • UPenn • Cornell • UChicago • Brown • Columbia • Dartmouth • UCLA • UC Berkeley • Michigan • Rice • Vanderbilt • Carnegie Mellon • USC • UT Austin • Washington University • UC San Diego • Boston University • University of Maryland</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;