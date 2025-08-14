import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Camera, FileText, Share, Heart } from 'lucide-react';
import Layout from '@/components/Layout';

interface DormProfile {
  id: string;
  dorm_name: string;
  room_number?: string;
  photos_empty?: string[];
  photos_decorated?: string[];
  notes?: string;
  created_at: string;
  school?: {
    name: string;
    primary_color?: string;
  };
}

const DormProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['dorm-profile', id],
    queryFn: async () => {
      if (!id) throw new Error('No profile ID provided');
      
      const { data, error } = await supabase
        .from('dorm_profiles')
        .select(`
          *,
          school:schools(name, primary_color)
        `)
        .eq('id', id)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data as DormProfile;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <Layout showBackButton>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dorm profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout showBackButton>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Dorm Profile Not Found</h1>
          <p className="text-muted-foreground">This dorm profile doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  const allPhotos = [...(profile.photos_empty || []), ...(profile.photos_decorated || [])];

  return (
    <Layout showBackButton>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Building className="h-6 w-6 text-dorm-blue" />
            <span className="text-lg font-medium text-dorm-blue">{profile.school?.name}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{profile.dorm_name}</h1>
          {profile.room_number && (
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">Room {profile.room_number}</span>
            </div>
          )}
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              {new Date(profile.created_at).toLocaleDateString()}
            </Badge>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photos Section */}
          <div className="lg:col-span-2">
            {/* Empty Room Photos */}
            {profile.photos_empty && profile.photos_empty.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-dorm-pink" />
                    Empty Room Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.photos_empty.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={photo}
                          alt={`Empty room ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Decorated Room Photos */}
            {profile.photos_decorated && profile.photos_decorated.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-dorm-orange" />
                    Decorated Room Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.photos_decorated.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={photo}
                          alt={`Decorated room ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Photos Message */}
            {allPhotos.length === 0 && (
              <Card className="mb-8">
                <CardContent className="p-12 text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Photos Available</h3>
                  <p className="text-muted-foreground">
                    This dorm profile doesn't have any photos yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notes & Info Section */}
          <div className="lg:col-span-1">
            {profile.notes && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-dorm-green" />
                    Room Notes & Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-foreground">
                      {profile.notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dorm:</span>
                  <span className="font-medium">{profile.dorm_name}</span>
                </div>
                {profile.room_number && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room:</span>
                    <span className="font-medium">{profile.room_number}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Photos:</span>
                  <span className="font-medium">{allPhotos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shared:</span>
                  <span className="font-medium">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DormProfile;