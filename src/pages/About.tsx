import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building } from 'lucide-react';
import Layout from '@/components/Layout';

const About = () => {
  return (
    <Layout showBackButton>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-dorm-pink to-dorm-blue rounded-full mb-6">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-dorm-pink to-dorm-blue bg-clip-text text-transparent">
            About Us
          </h1>
          
          <Card className="mt-16">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-muted-foreground">
                Coming Soon
              </h2>
              <p className="text-muted-foreground">
                We're working on something amazing. Stay tuned!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;