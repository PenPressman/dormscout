import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Camera, FileText, Share, Heart, HeartIcon } from 'lucide-react';
import Layout from '@/components/Layout';

interface DormProfile {
  id: string;
  user_id: string;
  school_id: string;
  dorm_name: string;
  room_number?: string;
  photos_empty?: string[];
  photos_decorated?: string[];
  notes?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  contact_enabled: boolean;
  contact_first_name?: string;
  contact_last_initial?: string;
  contact_email?: string;
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
        .rpc('get_dorm_profile_secure', {
          profile_id: id
        });
      
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Profile not found');
      
      const profileData = data[0];
      
      // Fetch school data separately
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('name, primary_color')
        .eq('id', profileData.school_id)
        .single();
      
      if (schoolError) throw schoolError;
      
      return {
        ...profileData,
        school: schoolData
      } as DormProfile;
    },
    enabled: !!id
  });

  // Check if dorm is already saved
  const { data: isSaved } = useQuery({
    queryKey: ['is-dorm-saved', id, user?.id],
    queryFn: async () => {
      if (!user || !id) return false;
      
      const { data, error } = await supabase
        .from('saved_dorms')
        .select('id')
        .eq('user_id', user.id)
        .eq('dorm_profile_id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!user && !!id
  });

  // Save/unsave dorm mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) throw new Error('User not authenticated or no dorm ID');
      
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_dorms')
          .delete()
          .eq('user_id', user.id)
          .eq('dorm_profile_id', id);
        
        if (error) throw error;
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_dorms')
          .insert({
            user_id: user.id,
            dorm_profile_id: id
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-dorm-saved'] });
      queryClient.invalidateQueries({ queryKey: ['saved-dorms'] });
      toast({
        title: isSaved ? "Removed from saved" : "Saved successfully",
        description: isSaved 
          ? "This dorm has been removed from your saved list." 
          : "This dorm has been added to your saved list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update saved status. Please try again.",
        variant: "destructive",
      });
      console.error('Save mutation error:', error);
    }
  });

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${profile?.dorm_name} - Dorm Scout`,
        text: `Check out this dorm: ${profile?.dorm_name}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Dorm link has been copied to your clipboard.",
      });
    }
  };

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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => saveMutation.mutate()}
                disabled={!user || saveMutation.isPending}
                className={isSaved ? "text-red-500 hover:text-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleShare}
              >
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