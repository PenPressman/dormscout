import { useState } from 'react';
import { Menu, X, Search, Upload, Heart, Edit, LogOut, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileNavDrawerProps {
  user: any | null;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export const MobileNavDrawer = ({ user, onNavigate, onSignOut }: MobileNavDrawerProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleNavigation = (path: string) => {
    setOpen(false);
    onNavigate(path);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Back button - visible on all pages except home */}
      {!isHomePage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-2 min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Home button/Logo - always centered */}
      <div className={`flex items-center space-x-3 ${!isHomePage ? 'absolute left-1/2 transform -translate-x-1/2' : ''}`}>
        <div className="bg-gradient-to-r from-dorm-pink to-dorm-orange text-white p-2 rounded-lg">
          <div className="h-5 w-5 bg-white/20 rounded"></div>
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-dorm-pink to-dorm-orange bg-clip-text text-transparent">
          Dorm Scout
        </h1>
      </div>

      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="p-2 min-h-[44px] min-w-[44px]">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation items */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start min-h-[44px] text-left"
                  onClick={() => handleNavigation('/find')}
                >
                  <Search className="h-5 w-5 mr-3" />
                  Find a Dorm
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start min-h-[44px] text-left"
                  onClick={() => handleNavigation('/share')}
                >
                  <Upload className="h-5 w-5 mr-3" />
                  Share a Dorm
                </Button>

                {user && (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start min-h-[44px] text-left"
                      onClick={() => handleNavigation('/my-posts')}
                    >
                      <Edit className="h-5 w-5 mr-3" />
                      View Your Posts
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start min-h-[44px] text-left"
                      onClick={() => handleNavigation('/saved')}
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      View Saved Dorms
                    </Button>
                  </>
                )}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t mt-auto">
              {user ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start min-h-[44px] text-left"
                  onClick={() => {
                    setOpen(false);
                    onSignOut();
                  }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start min-h-[44px] text-left"
                  onClick={() => handleNavigation('/auth')}
                >
                  <LogIn className="h-5 w-5 mr-3" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};