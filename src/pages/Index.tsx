import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Upload, Camera, Users, GraduationCap } from 'lucide-react';
import Layout from '@/components/Layout';

const Index = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to auth page if not logged in
      window.location.href = '/auth';
    }
  }, [user, loading]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="mb-6">
            <GraduationCap className="h-16 w-16 mx-auto text-primary mb-4" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to DormVision</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what your dorm room really looks like. Browse photos from past residents and share your own room setup to help future students.
          </p>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Search className="h-6 w-6 text-primary" />
                <CardTitle>Find Your Room</CardTitle>
              </div>
              <CardDescription>
                Search for your dorm building and room number to see photos and tips from previous residents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/search">
                <Button className="w-full">
                  Start Searching
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Upload className="h-6 w-6 text-primary" />
                <CardTitle>Share Your Room</CardTitle>
              </div>
              <CardDescription>
                Upload photos of your dorm room to help future residents know what to expect.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/upload">
                <Button className="w-full" variant="outline">
                  Upload Photos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Community Driven</CardTitle>
              </div>
              <CardDescription>
                Join thousands of students sharing dorm experiences across university campuses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>✓ Verified school email only</p>
                <p>✓ Safe and moderated content</p>
                <p>✓ Help future residents</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Photo Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">What You Can Find</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Empty Rooms</CardTitle>
                <CardDescription>
                  See the bare room layout and dimensions before you move in.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Designed Rooms</CardTitle>
                <CardDescription>
                  Get inspiration from how past students decorated and organized their space.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Tips & Details</CardTitle>
                <CardDescription>
                  Read helpful tips about storage, furniture, and room-specific advice.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Explore?</CardTitle>
              <CardDescription className="text-lg">
                Start by searching for your dorm or sharing your current room setup.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search Rooms
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Index;