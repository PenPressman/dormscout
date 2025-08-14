import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus, List } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const ShareDorm = () => {
  const { user } = useAuth();

  // Redirect to auth if not logged in
  if (!user) {
    window.location.href = '/auth';
    return null;
  }
  return (
    <Layout showBackButton>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-dorm-orange to-dorm-green rounded-full mb-6">
            <Upload className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-dorm-orange to-dorm-green bg-clip-text text-transparent">
            Share Your Dorm
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help future students by sharing photos and experiences from your dorm room
          </p>
        </div>

        {/* Main Action */}
        <div className="max-w-2xl mx-auto">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-dorm-green/10 to-dorm-green/5">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center p-6 bg-dorm-green rounded-2xl mb-6">
                  <Plus className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Create New Dorm Profile</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Share photos of your empty room, decorated space, and helpful tips for future residents
              </p>
              <Link to="/dorm/create">
                <Button variant="success" size="lg" className="text-xl py-6 px-12">
                  Log New Entry
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">What to Include</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center border-dorm-pink/20">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-dorm-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-dorm-pink" />
                </div>
                <h3 className="font-bold mb-2">Empty Room Photos</h3>
                <p className="text-sm text-muted-foreground">
                  Show the room layout, dimensions, and built-in features
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-dorm-blue/20">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-dorm-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-dorm-blue" />
                </div>
                <h3 className="font-bold mb-2">Decorated Photos</h3>
                <p className="text-sm text-muted-foreground">
                  Share how you organized and decorated your space
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-dorm-orange/20">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-dorm-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <List className="h-8 w-8 text-dorm-orange" />
                </div>
                <h3 className="font-bold mb-2">Helpful Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Tips about storage, laundry, bathroom info, and more
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Your Privacy is Protected</h3>
              <p className="text-sm text-muted-foreground">
                All posts are anonymous. Your personal information and username remain private. 
                Only your dorm details and photos will be shared to help other students.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ShareDorm;