import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Upload, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';

const Index = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
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
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-dorm-pink to-dorm-orange rounded-full mb-6">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-dorm-pink via-dorm-orange to-dorm-blue bg-clip-text text-transparent">
            Dorm Scout
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover your perfect dorm room before you move in
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
                Search for dorms and see real photos from students
              </p>
              <Link to="/find">
                <Button size="lg" className="w-full text-lg py-6">
                  Start Exploring
                </Button>
              </Link>
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
              <Link to="/share">
                <Button variant="secondary" size="lg" className="w-full text-lg py-6">
                  Share Your Room
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