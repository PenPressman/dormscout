import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Upload, ArrowLeft, Menu, Heart, Edit, LogOut, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const Layout = ({ children, showBackButton = false }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleMenuNavigation = (path: string) => {
    if (!user && (path === '/find' || path === '/share' || path === '/my-posts' || path === '/saved')) {
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="hover:bg-primary/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Link to="/" className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-dorm-pink to-dorm-orange text-white p-2 rounded-xl shadow-lg">
                  <Search className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-dorm-pink to-dorm-orange bg-clip-text text-transparent leading-tight">
                    Dorm Scout
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    Find Your Perfect Dorm
                  </span>
                </div>
              </Link>
            </div>
            
            {user && (
              <nav className="hidden md:flex items-center space-x-2">
                <Link to="/find">
                  <Button 
                    variant={isActive('/find') ? 'default' : 'ghost'}
                    className="font-medium"
                  >
                    Find a Dorm
                  </Button>
                </Link>
                <Link to="/share">
                  <Button 
                    variant={isActive('/share') ? 'secondary' : 'ghost'}
                    className="font-medium"
                  >
                    Share a Dorm
                  </Button>
                </Link>
              </nav>
            )}

            <div className="flex items-center space-x-4">
              {/* Menu Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleMenuNavigation('/find')}>
                    <Search className="h-4 w-4 mr-2" />
                    Find a Dorm
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuNavigation('/share')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Share a Dorm
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuNavigation('/my-posts')}>
                    <Edit className="h-4 w-4 mr-2" />
                    View Your Posts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuNavigation('/saved')}>
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

              {user ? (
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="default">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="flex items-center justify-around py-3">
            <Link 
              to="/find" 
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive('/find') ? 'text-dorm-pink bg-dorm-pink/10' : 'text-muted-foreground'
              }`}
            >
              <Search className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">Find</span>
            </Link>
            <Link 
              to="/share" 
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive('/share') ? 'text-dorm-orange bg-dorm-orange/10' : 'text-muted-foreground'
              }`}
            >
              <Upload className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">Share</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;