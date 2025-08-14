import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Upload, Building, Menu, Heart, Edit, LogOut, LogIn } from 'lucide-react';

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
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-dorm-pink to-dorm-orange text-white p-2 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-dorm-pink to-dorm-orange bg-clip-text text-transparent">
              Dorm Scout
            </h1>
          </div>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleAuthRequiredAction('/find')}>
                <Search className="h-4 w-4 mr-2" />
                Find a Dorm
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAuthRequiredAction('/share')}>
                <Upload className="h-4 w-4 mr-2" />
                Share a Dorm
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAuthRequiredAction('/my-posts')}>
                <Edit className="h-4 w-4 mr-2" />
                View Your Posts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAuthRequiredAction('/saved')}>
                <Heart className="h-4 w-4 mr-2" />
                View Saved Dorms
              </DropdownMenuItem>
              {user ? (
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => navigate('/auth')}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-dorm-pink to-dorm-orange text-white p-4 rounded-lg mb-6 inline-flex">
              <Building className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-dorm-pink via-dorm-orange to-dorm-blue bg-clip-text text-transparent">
            Dorm Scout
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Learn from earlier residents so you know what to expect!
          </p>
        </section>

        {/* Main Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-dorm-pink/10 to-dorm-pink/5">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center p-4 bg-dorm-pink rounded-2xl mb-4">
                  <Search className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Find a Dorm</h2>
              <p className="text-muted-foreground mb-6">
                Find your dorm, or dream dorm, and browse photos, reviews, and tips.
              </p>
              <Button 
                onClick={() => handleAuthRequiredAction('/find')}
                size="lg" 
                className="w-full text-lg py-6"
              >
                Start Exploring
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-dorm-orange/10 to-dorm-orange/5">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center p-4 bg-dorm-orange rounded-2xl mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Share a Dorm</h2>
              <p className="text-muted-foreground mb-6">
                Help others by sharing your dorm experience
              </p>
              <Button 
                onClick={() => handleAuthRequiredAction('/share')}
                variant="secondary" 
                size="lg" 
                className="w-full text-lg py-6"
              >
                Share Your Room
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center space-x-8">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About Us
            </Link>
            <a 
              href="mailto:penelope.pressman@gmail.com" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
          
          {/* Privacy Note */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setRequiresAuth(false)}>
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Sign In Required</h3>
              <p className="text-muted-foreground mb-6">
                You need to sign in with your school email to access this feature.
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setRequiresAuth(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => navigate('/auth')} className="flex-1">
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