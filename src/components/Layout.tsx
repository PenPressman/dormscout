import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, Search, Upload, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">DormVision</span>
            </Link>
            
            {user && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive('/') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/search" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive('/search') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  <Search className="h-4 w-4" />
                  <span>Search Rooms</span>
                </Link>
                <Link 
                  to="/upload" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive('/upload') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
              </nav>
            )}

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="flex items-center justify-around py-2">
            <Link 
              to="/" 
              className={`flex flex-col items-center p-2 ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link 
              to="/search" 
              className={`flex flex-col items-center p-2 ${
                isActive('/search') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Search className="h-5 w-5" />
              <span className="text-xs mt-1">Search</span>
            </Link>
            <Link 
              to="/upload" 
              className={`flex flex-col items-center p-2 ${
                isActive('/upload') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs mt-1">Upload</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;