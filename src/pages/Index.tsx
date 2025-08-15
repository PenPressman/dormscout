import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileNavDrawer } from '@/components/MobileNavDrawer';
import { Search, Upload, Building } from 'lucide-react';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [requiresAuth, setRequiresAuth] = useState(false);
  const navigate = useNavigate();

  const handleAuthRequiredAction = (path: string) => {
    if (!user) {
      setRequiresAuth(true);
      return;
    }
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Mobile Header */}
      <header className="bg-white border-b shadow-sm safe-area-inset-top">
        <div className="container mx-auto px-4 py-3">
          <MobileNavDrawer 
            user={user}
            onNavigate={handleAuthRequiredAction} 
            onSignOut={signOut}
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <div className="mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-dorm-pink to-dorm-orange text-white p-3 md:p-4 rounded-lg mb-4 md:mb-6 inline-flex">
              <Building className="h-8 w-8 md:h-12 md:w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-dorm-pink via-dorm-orange to-dorm-blue bg-clip-text text-transparent leading-tight">
            Dorm Scout
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-4">
            Learn from earlier residents so you know what to expect!
          </p>
        </section>

        {/* Main Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16 max-w-4xl mx-auto">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-dorm-pink/10 to-dorm-pink/5">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="mb-4 md:mb-6">
                <div className="inline-flex items-center justify-center p-3 md:p-4 bg-dorm-pink rounded-2xl mb-3 md:mb-4">
                  <Search className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">Find a Dorm</h2>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Find your dorm, or dream dorm, and browse photos, reviews, and tips.
              </p>
              <Button 
                onClick={() => handleAuthRequiredAction('/find')}
                size="lg" 
                className="w-full text-base md:text-lg py-4 md:py-6 min-h-[44px]"
              >
                Start Exploring
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-dorm-orange/10 to-dorm-orange/5">
            <CardContent className="p-6 md:p-8 text-center">
              <div className="mb-4 md:mb-6">
                <div className="inline-flex items-center justify-center p-3 md:p-4 bg-dorm-orange rounded-2xl mb-3 md:mb-4">
                  <Upload className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">Share a Dorm</h2>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Help others by sharing your dorm experience
              </p>
              <Button 
                onClick={() => handleAuthRequiredAction('/share')}
                variant="secondary" 
                size="lg" 
                className="w-full text-base md:text-lg py-4 md:py-6 min-h-[44px]"
              >
                Share Your Room
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 md:mt-16 safe-area-inset-bottom">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-center">
              About Us
            </Link>
            <a 
              href="mailto:penelope.pressman@gmail.com" 
              className="text-muted-foreground hover:text-foreground transition-colors text-center"
            >
              Contact
            </a>
          </div>
          
          {/* Privacy Note */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed px-4">
                <span className="font-medium text-foreground">Privacy note:</span> Dorm Scout is not affiliated with any university. 
                Content is user-submitted and may be inaccurate. We collect only what's needed to run the site and never sell your data. 
                See our{' '}
                <Link 
                  to="/legal/privacy-policy" 
                  className="text-primary hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                {' '}for details.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Required Modal */}
      {requiresAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setRequiresAuth(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Sign In Required</h3>
              <p className="text-muted-foreground mb-6 text-sm md:text-base">
                You need to sign in with your school email to access this feature.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setRequiresAuth(false)} 
                  className="flex-1 min-h-[44px]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="flex-1 min-h-[44px]"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;