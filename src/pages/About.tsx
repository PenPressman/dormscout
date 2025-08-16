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
          
          <Card className="mt-8">
            <CardContent className="p-8 md:p-12 text-left max-w-none">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg mb-6">Hey! I'm Penelope.</p>
                
                <p className="mb-4">
                  I'm about to start my freshman year at Harvard, and honestly, the thing I stressed about the most wasn't classes…it was my dorm. I kept wondering: what's it gonna look like? how big is it? what do people usually do with the space?
                </p>
                
                <p className="mb-4">
                  There wasn't really a good way to find out. I could figure out what the building looked like, but not the room. I don't know the ins and outs of living there. So, I decided to build a solution.
                </p>
                
                <p className="mb-4">
                  That's how Dorm Scout was born. Students can post their actual dorm rooms so future students can see what they're walking into, get ideas, and feel a little less nervous about move-in.
                </p>
                
                <p className="mb-4">
                  The site's up and running, but here's the catch: I need your help to get it started. If you're in college, do me (and the next class of freshmen) a huge favor — post your room. Share your setup, your hacks, and anything else you learned.
                </p>
                
                <p className="mb-4">
                  Think of it like passing the torch. Your pics could save someone hours of stress, and you get dorm clout along the way.
                </p>
                
                <p className="mb-4">
                  Appreciate you for being part of this 🙌
                </p>
                
                <p className="text-right font-medium">
                  — Penelope
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;